import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { type NextRequest } from 'next/server';

import {
  ConversationPhase,
  type ChatMessage,
  type ConversationState,
  type LeadData,
} from '@/lib/chatbot/types';
import { buildSystemPrompt } from '@/lib/chatbot/system-prompt';
import { determineNextPhase } from '@/lib/chatbot/phases';
import { calculateLeadScore, getLeadTier } from '@/lib/chatbot/scoring';
import { getRedirectMessage, sanitizeOutput, getOffTopicCategory } from '@/lib/chatbot/guardrails';
import { generateSummaryPrompt } from '@/lib/chatbot/summary';

export const runtime = 'edge';

const MAX_MESSAGES_PER_SESSION = 20;

const sessionMessageCounts = new Map<string, { count: number; lastReset: number }>();

const SESSION_WINDOW_MS = 30 * 60 * 1000;

function getSessionId(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() ?? 'unknown';
  const userAgent = request.headers.get('user-agent') ?? 'unknown';
  return `${ip}-${userAgent.slice(0, 50)}`;
}

function checkRateLimit(sessionId: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const session = sessionMessageCounts.get(sessionId);

  if (!session || now - session.lastReset > SESSION_WINDOW_MS) {
    sessionMessageCounts.set(sessionId, { count: 1, lastReset: now });
    return { allowed: true, remaining: MAX_MESSAGES_PER_SESSION - 1 };
  }

  if (session.count >= MAX_MESSAGES_PER_SESSION) {
    return { allowed: false, remaining: 0 };
  }

  session.count += 1;
  return { allowed: true, remaining: MAX_MESSAGES_PER_SESSION - session.count };
}

function detectLanguage(messages: ChatMessage[]): string {
  const userMessages = messages.filter((m) => m.role === 'user');
  if (userMessages.length === 0) return 'en';

  const lastUserMessage = userMessages[userMessages.length - 1].content;

  const spanishIndicators = [
    /[a-z]cion\b/i,
    /\b(hola|buenos|buenas|gracias|por favor|nosotros|nuestra|empresa|quiero|necesito|tenemos|estamos|somos|tiene|como|que|donde|cuando|porque)\b/i,
    /[aeiou]mente\b/i,
    /\b(el|la|los|las|un|una|unos|unas|del|al)\b/i,
  ];

  const spanishScore = spanishIndicators.reduce(
    (score, pattern) => score + (pattern.test(lastUserMessage) ? 1 : 0),
    0
  );

  return spanishScore >= 2 ? 'es' : 'en';
}

function extractLeadData(
  messages: ChatMessage[],
  existingData: Partial<LeadData>
): Partial<LeadData> {
  const data: Partial<LeadData> = { ...existingData };

  const userMessages = messages
    .filter((m) => m.role === 'user')
    .map((m) => m.content)
    .join(' ');

  const emailMatch = userMessages.match(
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/
  );
  if (emailMatch && !data.email) {
    data.email = emailMatch[0];
  }

  const sizePatterns = [
    /(\d{1,5})\s*(employees|empleados|people|personas|team members|colaboradores)/i,
    /\b(small|medium|large|enterprise|startup|pequena|mediana|grande)\b.*\b(company|empresa|organization|organizacion)\b/i,
    /\b(company|empresa|organization|organizacion)\b.*\b(small|medium|large|enterprise|startup|pequena|mediana|grande)\b/i,
  ];

  if (!data.size) {
    for (const pattern of sizePatterns) {
      const match = userMessages.match(pattern);
      if (match) {
        data.size = match[0];
        break;
      }
    }
  }

  return data;
}

function convertToMessages(messages: ChatMessage[]) {
  return messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));
}

export async function POST(request: NextRequest) {
  try {
    const sessionId = getSessionId(request);
    const { allowed, remaining } = checkRateLimit(sessionId);

    if (!allowed) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded. Please try again later or schedule a call with our team.',
          code: 'RATE_LIMIT',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    const body = await request.json();
    const { messages, conversationState } = body as {
      messages: ChatMessage[];
      conversationState: ConversationState;
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required and must not be empty.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const state: ConversationState = conversationState ?? {
      phase: ConversationPhase.GREETING,
      messages: [],
      leadData: {},
      language: 'en',
    };

    const language = detectLanguage(messages);
    state.language = language;

    const latestUserMessage = messages[messages.length - 1];

    if (latestUserMessage && latestUserMessage.role === 'user') {
      const offTopicCategory = getOffTopicCategory(latestUserMessage.content);

      if (offTopicCategory) {
        const redirectMessage = getRedirectMessage(latestUserMessage.content, language);

        const updatedLeadData = extractLeadData(messages, state.leadData);
        const score = calculateLeadScore(updatedLeadData);

        const updatedState: ConversationState = {
          ...state,
          messages,
          leadData: { ...updatedLeadData, score },
          language,
        };

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          start(controller) {
            const textChunk = `0:${JSON.stringify(redirectMessage)}\n`;
            controller.enqueue(encoder.encode(textChunk));

            const dataChunk = `d:${JSON.stringify({
              conversationState: updatedState,
              leadScore: score,
              leadTier: getLeadTier(score),
            })}\n`;
            controller.enqueue(encoder.encode(dataChunk));

            controller.close();
          },
        });

        return new Response(stream, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'X-RateLimit-Remaining': String(remaining),
            'X-Conversation-Phase': state.phase,
          },
        });
      }
    }

    const updatedLeadData = extractLeadData(messages, state.leadData);
    const userMessageCount = messages.filter((m) => m.role === 'user').length;
    const nextPhase = determineNextPhase(state.phase, userMessageCount, updatedLeadData);
    state.phase = nextPhase;

    const score = calculateLeadScore(updatedLeadData);
    updatedLeadData.score = score;
    state.leadData = updatedLeadData;

    let systemPrompt = buildSystemPrompt(nextPhase, language, updatedLeadData);

    if (nextPhase === ConversationPhase.SUMMARY) {
      const summaryInstructions = generateSummaryPrompt(updatedLeadData, language);
      systemPrompt += `\n\n---\n\nSUMMARY GENERATION INSTRUCTIONS:\n${summaryInstructions}`;
    }

    const coreMessages = convertToMessages(messages);

    const result = streamText({
      model: anthropic('claude-haiku-4-5-20250929'),
      system: systemPrompt,
      messages: coreMessages,
      maxOutputTokens: nextPhase === ConversationPhase.SUMMARY ? 2000 : 500,
      temperature: 0.7,
      onFinish: async ({ text }) => {
        const sanitizedText = sanitizeOutput(text);
        if (sanitizedText !== text) {
          console.warn('[Guardrails] Output was sanitized. Original contained restricted content.');
        }
      },
    });

    const updatedState: ConversationState = {
      phase: nextPhase,
      messages,
      leadData: updatedLeadData,
      language,
    };

    const textStream = result.textStream;
    const encoder = new TextEncoder();

    const responseStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of textStream) {
          const encoded = `0:${JSON.stringify(chunk)}\n`;
          controller.enqueue(encoder.encode(encoded));
        }

        const statePayload = `d:${JSON.stringify({
          phase: nextPhase,
          conversationState: updatedState,
          leadScore: score,
          leadTier: getLeadTier(score),
        })}\n`;
        controller.enqueue(encoder.encode(statePayload));

        controller.close();
      },
    });

    return new Response(responseStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-RateLimit-Remaining': String(remaining),
        'X-Conversation-Phase': nextPhase,
        'X-Lead-Score': String(score),
        'X-Lead-Tier': getLeadTier(score),
      },
    });
  } catch (error) {
    console.error('[Chat API Error]', error);

    const isAuthError =
      error instanceof Error &&
      (error.message.includes('API key') || error.message.includes('authentication'));

    if (isAuthError) {
      return new Response(
        JSON.stringify({ error: 'Service configuration error. Please try again later.' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
