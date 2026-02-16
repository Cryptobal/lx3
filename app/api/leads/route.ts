import { type NextRequest } from 'next/server';
import { sendLeadNotification } from '@/lib/email';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      leadData,
      messages,
      conversationSummary,
      score,
      tier,
      language,
    } = body as {
      leadData: Record<string, string | number | undefined>;
      messages: { role: string; content: string }[];
      conversationSummary?: string;
      score?: number;
      tier?: string;
      language?: string;
    };

    if (!leadData && !messages) {
      return new Response(
        JSON.stringify({ error: 'Lead data or messages required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await sendLeadNotification({
      name: leadData?.name as string,
      company: leadData?.company as string,
      industry: leadData?.industry as string,
      size: leadData?.size as string,
      role: leadData?.role as string,
      painPoint: leadData?.painPoint as string,
      previousAttempts: leadData?.previousAttempts as string,
      decisionMakers: leadData?.decisionMakers as string,
      email: leadData?.email as string,
      phone: leadData?.phone as string,
      website: leadData?.website as string,
      service: leadData?.service as string,
      score: score ?? (leadData?.score as number),
      tier: tier ?? 'cold',
      language: language ?? 'es',
      conversationSummary,
      messages,
    });

    if (result.success) {
      return new Response(
        JSON.stringify({ success: true, emailId: result.id }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Failed to send email notification.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[Leads API Error]', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
