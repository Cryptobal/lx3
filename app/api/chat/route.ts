import { streamText } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { type NextRequest } from 'next/server';

import { prisma } from '@/lib/db';

async function saveConversation(
  sessionId: string,
  userContent: string,
  assistantContent: string
): Promise<void> {
  if (!prisma) return;
  try {
    const conversation = await prisma.conversation.upsert({
      where: { sessionId },
      create: { sessionId },
      update: {},
    });
    await prisma.message.createMany({
      data: [
        { conversationId: conversation.id, role: 'user', content: userContent },
        { conversationId: conversation.id, role: 'assistant', content: assistantContent },
      ],
    });
  } catch (err) {
    console.error('[Chat DB Save Error]', err);
  }
}
import { type ChatMessage, type ConversationState, type LeadData } from '@/lib/chatbot/types';
import { buildSystemPrompt } from '@/lib/chatbot/system-prompt';
import { calculateLeadScore, getLeadTier } from '@/lib/chatbot/scoring';
import { isOffTopic, getRedirectMessage } from '@/lib/chatbot/guardrails';

export const runtime = 'nodejs';

function getAnthropicClient() {
  return createAnthropic({
    apiKey: process.env.LX3_ANTHROPIC_API_KEY,
    baseURL: 'https://api.anthropic.com/v1',
  });
}

// --- Rate Limiting (in-memory, per-instance) ---

const MAX_MESSAGES_PER_SESSION = 30;
const SESSION_WINDOW_MS = 30 * 60 * 1000;
const sessionCounts = new Map<string, { count: number; lastReset: number }>();

function getSessionId(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() ?? 'unknown';
  const ua = request.headers.get('user-agent') ?? 'unknown';
  return `${ip}-${ua.slice(0, 50)}`;
}

function checkRateLimit(sessionId: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const session = sessionCounts.get(sessionId);

  if (!session || now - session.lastReset > SESSION_WINDOW_MS) {
    sessionCounts.set(sessionId, { count: 1, lastReset: now });
    return { allowed: true, remaining: MAX_MESSAGES_PER_SESSION - 1 };
  }

  if (session.count >= MAX_MESSAGES_PER_SESSION) {
    return { allowed: false, remaining: 0 };
  }

  session.count += 1;
  return { allowed: true, remaining: MAX_MESSAGES_PER_SESSION - session.count };
}

// --- Language Detection ---

function detectLanguage(messages: ChatMessage[]): string {
  const userMessages = messages.filter((m) => m.role === 'user');
  if (userMessages.length === 0) return 'es';

  const lastUserMessage = userMessages[userMessages.length - 1].content;
  const spanishWords = /\b(hola|buenos|buenas|gracias|por|favor|nosotros|nuestra|nuestro|empresa|quiero|necesito|tenemos|estamos|somos|tiene|como|que|donde|cuando|porque|soy|de|en|con|para|pero|hay|ser|esta|este|estos|estas|eso|ese|muy|mas|mi|tu|su|nos|les|ya|si|tambien|trabajo|trabajamos|problema|proceso|equipo|datos|cliente|clientes|negocio|operacion|automatizar|mejorar|reducir|implementar|area|tiempo|costo|ayuda|puedo|puede|quiere|hacemos|hacen|busco|buscamos|necesitamos|harto|sistema|gestion)\b/ig;
  const matches = lastUserMessage.match(spanishWords);
  return (matches ? matches.length : 0) >= 2 ? 'es' : 'en';
}

// --- Lead Data Extraction ---

function extractLeadData(
  messages: ChatMessage[],
  existingData: Partial<LeadData>
): Partial<LeadData> {
  const data: Partial<LeadData> = { ...existingData };

  const userText = messages
    .filter((m) => m.role === 'user')
    .map((m) => m.content)
    .join(' ');

  if (!data.email) {
    const m = userText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/);
    if (m) data.email = m[0];
  }

  if (!data.phone) {
    const m = userText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{2,4}/);
    if (m && m[0].replace(/\D/g, '').length >= 7) data.phone = m[0].trim();
  }

  if (!data.name) {
    const patterns = [
      /\b(?:soy|me llamo|mi nombre es|habla)\s+([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)?)/,
      /\b(?:my name is|i'm|i am|this is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/,
    ];
    for (const p of patterns) {
      const m = userText.match(p);
      if (m) { data.name = m[1].trim(); break; }
    }
  }

  if (!data.company) {
    const patterns = [
      /\b(?:de|from|en|at|trabajo en)\s+([A-ZÁÉÍÓÚÑ][A-Za-záéíóúñ0-9]+(?:\s+[A-ZÁÉÍÓÚÑ][A-Za-záéíóúñ0-9]+){0,3})/,
      /(?:empresa|company|compania)\s+(?:se llama\s+)?([A-ZÁÉÍÓÚÑ][A-Za-záéíóúñ0-9]+(?:\s+[A-Za-záéíóúñ0-9]+){0,3})/i,
    ];
    const skip = new Set(['una', 'un', 'la', 'el', 'los', 'las', 'mi', 'tu', 'su', 'the', 'my', 'our', 'Chile', 'Peru', 'Mexico', 'Colombia', 'Argentina']);
    for (const p of patterns) {
      const m = userText.match(p);
      if (m && !skip.has(m[1].trim())) { data.company = m[1].trim(); break; }
    }
  }

  if (!data.size) {
    const patterns = [
      /(\d{1,5})\s*(?:employees|empleados|people|personas|colaboradores|trabajadores)/i,
      /(?:somos|tenemos|we have|we are)\s+(\d{1,5})\b/i,
    ];
    for (const p of patterns) {
      const m = userText.match(p);
      if (m) { data.size = m[0]; break; }
    }
  }

  if (!data.role) {
    const m = userText.match(/\b(?:soy el|soy la|soy|i'm the|i am the|my role is|mi rol es|mi cargo es)\s+((?:CEO|CTO|CFO|COO|CIO|VP|director|directora|gerente|jefe|jefa|head|manager|lead|founder|fundador|socio|partner|ingeniero|engineer|analista|consultant|consultor)[a-záéíóúñ\s]*)/i);
    if (m) data.role = m[1].trim();
  }

  if (!data.industry) {
    const map: Record<string, string> = {
      'logistic': 'Logistica', 'logistica': 'Logistica', 'transporte': 'Transporte', 'envio': 'Logistica',
      'retail': 'Retail', 'comercio': 'Comercio', 'ecommerce': 'E-commerce', 'tienda': 'Retail',
      'fintech': 'Fintech', 'financier': 'Finanzas', 'banco': 'Banca', 'bank': 'Banca', 'seguro': 'Seguros',
      'salud': 'Salud', 'health': 'Salud', 'clinic': 'Salud', 'hospital': 'Salud', 'farmac': 'Farmaceutica',
      'manufactur': 'Manufactura', 'fabric': 'Manufactura', 'industrial': 'Industrial',
      'mining': 'Mineria', 'miner': 'Mineria', 'agri': 'Agricultura', 'agro': 'Agricultura',
      'construc': 'Construccion', 'inmobiliar': 'Inmobiliaria', 'real estate': 'Inmobiliaria',
      'educa': 'Educacion', 'universid': 'Educacion', 'software': 'Tech', 'tech': 'Tech', 'saas': 'SaaS',
      'consult': 'Consultoria', 'legal': 'Legal', 'marketing': 'Marketing', 'telecom': 'Telecomunicaciones',
      'energia': 'Energia', 'energy': 'Energia', 'alimento': 'Alimentos', 'food': 'Alimentos',
      'seguridad': 'Seguridad', 'security': 'Seguridad', 'servicios': 'Servicios',
    };
    const lower = userText.toLowerCase();
    for (const [kw, ind] of Object.entries(map)) {
      if (lower.includes(kw)) { data.industry = ind; break; }
    }
  }

  if (!data.website) {
    const m = userText.match(/\b(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+)(?:\/\S*)?/);
    if (m) {
      const domain = m[0].trim();
      const skipDomains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 'icloud.com', 'lx3.ai'];
      if (!skipDomains.some(d => domain.includes(d))) {
        data.website = domain;
      }
    }
  }

  if (!data.service) {
    const patterns = [
      /(?:necesitamos|necesito|queremos|buscamos|interesa|quiero)\s+(.{5,120})/i,
      /(?:servicio de|service for|implementar|automatizar|mejorar|optimizar)\s+(.{5,100})/i,
      /(?:me interesa|nos interesa|interested in)\s+(.{5,100})/i,
    ];
    for (const p of patterns) {
      const m = userText.match(p);
      if (m) { data.service = m[1].trim().replace(/[.!?]$/, ''); break; }
    }
  }

  if (!data.painPoint) {
    const patterns = [
      /(?:problema|problem|challenge|desafio|reto|dificultad)\s+(?:es|is|con|with|de|que)?\s*(.{10,100})/i,
      /(?:harto|tired|cansado|frustrado|frustrated)\s+(?:de|of|con|with)\s*(.{5,100})/i,
      /(?:automatizar|automate|mejorar|improve|reducir|reduce|optimizar)\s+(.{10,80})/i,
    ];
    for (const p of patterns) {
      const m = userText.match(p);
      if (m) { data.painPoint = m[1].trim().replace(/[.!?]$/, ''); break; }
    }
  }

  return data;
}

// --- Main Handler ---

export async function POST(request: NextRequest) {
  try {
    const sessionId = getSessionId(request);
    const { allowed, remaining } = checkRateLimit(sessionId);

    if (!allowed) {
      return new Response(
        JSON.stringify({
          error: 'Has alcanzado el limite de mensajes. Puedes escribirnos directamente por WhatsApp al +56 9 8230 7771 para continuar la conversacion.',
          code: 'RATE_LIMIT',
        }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();
    const { messages, conversationState } = body as {
      messages: ChatMessage[];
      conversationState?: ConversationState;
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const state: ConversationState = conversationState ?? {
      leadData: {},
      language: 'es',
    };

    const language = detectLanguage(messages);
    state.language = language;

    // Check for off-topic messages (only truly off-topic: crypto, politics, etc.)
    const latestUserMessage = messages[messages.length - 1];
    if (latestUserMessage?.role === 'user' && isOffTopic(latestUserMessage.content)) {
      const redirectMessage = getRedirectMessage(language);
      const updatedLeadData = extractLeadData(messages, state.leadData);
      const score = calculateLeadScore(updatedLeadData);

      saveConversation(sessionId, latestUserMessage.content, redirectMessage);

      const updatedState: ConversationState = {
        leadData: { ...updatedLeadData, score },
        language,
      };

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(`0:${JSON.stringify(redirectMessage)}\n`));
          controller.enqueue(encoder.encode(`d:${JSON.stringify({
            conversationState: updatedState,
            leadScore: score,
            leadTier: getLeadTier(score),
          })}\n`));
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-RateLimit-Remaining': String(remaining),
        },
      });
    }

    // Extract lead data and calculate score
    const updatedLeadData = extractLeadData(messages, state.leadData);
    const score = calculateLeadScore(updatedLeadData);
    updatedLeadData.score = score;
    state.leadData = updatedLeadData;

    const systemPrompt = buildSystemPrompt(language, updatedLeadData);

    const coreMessages = messages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .slice(-20)
      .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    const updatedState: ConversationState = {
      leadData: updatedLeadData,
      language,
    };

    // Real streaming response
    const encoder = new TextEncoder();

    const lastUserContent = latestUserMessage?.content ?? '';
    let assistantContent = '';

    const responseStream = new ReadableStream({
      async start(controller) {
        try {
          const result = streamText({
            model: getAnthropicClient()('claude-sonnet-4-20250514'),
            system: systemPrompt,
            messages: coreMessages,
            maxOutputTokens: 400,
            temperature: 0.4,
          });

          for await (const chunk of result.textStream) {
            assistantContent += chunk;
            controller.enqueue(encoder.encode(`0:${JSON.stringify(chunk)}\n`));
          }
        } catch (aiError) {
          console.error('[AI API Error]', aiError);
          const errorMsg = language === 'es'
            ? 'Hubo un error al procesar tu mensaje. Puedes intentar de nuevo o escribirnos directo por WhatsApp al +56 9 8230 7771.'
            : 'There was an error processing your message. You can try again or reach us directly on WhatsApp at +56 9 8230 7771.';
          assistantContent = errorMsg;
          controller.enqueue(encoder.encode(`0:${JSON.stringify(errorMsg)}\n`));
        }

        saveConversation(sessionId, lastUserContent, assistantContent);

        // Send metadata after text completes
        controller.enqueue(encoder.encode(`d:${JSON.stringify({
          conversationState: updatedState,
          leadScore: score,
          leadTier: getLeadTier(score),
        })}\n`));

        controller.close();
      },
    });

    return new Response(responseStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-RateLimit-Remaining': String(remaining),
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
