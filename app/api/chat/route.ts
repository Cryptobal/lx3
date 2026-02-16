import { streamText } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
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

export const runtime = 'nodejs';

function getAnthropicClient() {
  return createAnthropic({
    apiKey: process.env.LX3_ANTHROPIC_API_KEY,
    baseURL: 'https://api.anthropic.com/v1',
  });
}

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

  const spanishWords = /\b(hola|buenos|buenas|gracias|por|favor|nosotros|nuestra|nuestro|empresa|quiero|necesito|tenemos|estamos|somos|tiene|como|que|donde|cuando|porque|soy|de|en|con|para|pero|hay|ser|esta|este|estos|estas|eso|ese|muy|mas|mi|tu|su|nos|les|ya|si|tambien|trabajo|trabajamos|problema|proceso|equipo|datos|cliente|clientes|negocio|operacion|automatizar|mejorar|reducir|implementar|area|tiempo|costo|ayuda|puedo|puede|quiere|hacemos|hacen|busco|buscamos|necesitamos)\b/ig;
  const matches = lastUserMessage.match(spanishWords);
  const spanishScore = matches ? matches.length : 0;

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

    const updatedState: ConversationState = {
      phase: nextPhase,
      messages,
      leadData: updatedLeadData,
      language,
    };

    const encoder = new TextEncoder();

    let aiText: string;
    try {
      const result = await streamText({
        model: getAnthropicClient()('claude-3-haiku-20240307'),
        system: systemPrompt,
        messages: coreMessages,
        maxOutputTokens: nextPhase === ConversationPhase.SUMMARY ? 2000 : 500,
        temperature: 0.7,
      });
      aiText = await result.text;
      const sanitizedText = sanitizeOutput(aiText);
      if (sanitizedText !== aiText) {
        console.warn('[Guardrails] Output was sanitized.');
        aiText = sanitizedText;
      }
    } catch (aiError) {
      console.error('[AI API Error]', aiError);
      const errorMsg = aiError instanceof Error ? aiError.message : '';
      const isCredits = errorMsg.includes('credit') || errorMsg.includes('balance');
      aiText = isCredits
        ? (language === 'es'
          ? 'El servicio de AI no esta disponible temporalmente. Por favor, agenda una llamada directa con nuestro equipo en la pagina de contacto para recibir tu diagnostico personalizado.'
          : 'The AI service is temporarily unavailable. Please schedule a direct call with our team on the contact page to receive your personalized diagnostic.')
        : (language === 'es'
          ? 'Hubo un error al procesar tu mensaje. Por favor intenta de nuevo en unos momentos.'
          : 'There was an error processing your message. Please try again in a moment.');
    }

    const responseStream = new ReadableStream({
      start(controller) {
        const textChunk = `0:${JSON.stringify(aiText)}\n`;
        controller.enqueue(encoder.encode(textChunk));

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
