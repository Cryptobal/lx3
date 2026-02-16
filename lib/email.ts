import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const LEAD_RECIPIENT = 'carlos.irigoyen@gmail.com';

interface LeadEmailData {
  name?: string;
  company?: string;
  website?: string;
  industry?: string;
  size?: string;
  role?: string;
  service?: string;
  painPoint?: string;
  previousAttempts?: string;
  decisionMakers?: string;
  email?: string;
  phone?: string;
  score?: number;
  tier?: string;
  language?: string;
  conversationSummary?: string;
  messages?: { role: string; content: string }[];
}

function buildLeadEmailHtml(data: LeadEmailData): string {
  const tierColor =
    data.tier === 'hot' ? '#e53e3e' : data.tier === 'warm' ? '#dd6b20' : '#718096';
  const tierLabel =
    data.tier === 'hot' ? '🔥 HOT' : data.tier === 'warm' ? '🟡 WARM' : '🔵 COLD';

  const fields = [
    { label: 'Nombre', value: data.name },
    { label: 'Email', value: data.email },
    { label: 'Telefono', value: data.phone },
    { label: 'Empresa', value: data.company },
    { label: 'Pagina Web', value: data.website },
    { label: 'Industria', value: data.industry },
    { label: 'Tamano', value: data.size },
    { label: 'Rol', value: data.role },
    { label: 'Servicio Solicitado', value: data.service },
    { label: 'Pain point', value: data.painPoint },
    { label: 'Intentos previos', value: data.previousAttempts },
    { label: 'Decision makers', value: data.decisionMakers },
    { label: 'Idioma', value: data.language === 'es' ? 'Espanol' : 'Ingles' },
  ];

  const fieldRows = fields
    .filter((f) => f.value)
    .map(
      (f) => `
      <tr>
        <td style="padding: 8px 12px; font-weight: 600; color: #4a5568; border-bottom: 1px solid #e2e8f0; width: 180px;">${f.label}</td>
        <td style="padding: 8px 12px; color: #2d3748; border-bottom: 1px solid #e2e8f0;">${f.value}</td>
      </tr>`
    )
    .join('');

  const conversationHtml = data.messages
    ? data.messages
        .map(
          (m) => `
        <div style="margin-bottom: 12px;">
          <strong style="color: ${m.role === 'user' ? '#2b6cb0' : '#718096'};">${m.role === 'user' ? '👤 Prospecto' : '🤖 AI Factory'}:</strong>
          <p style="margin: 4px 0 0 0; color: #4a5568; line-height: 1.5;">${m.content.replace(/\n/g, '<br/>')}</p>
        </div>`
        )
        .join('')
    : '';

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 640px; margin: 0 auto; padding: 20px; background-color: #f7fafc;">

  <div style="background: white; border-radius: 12px; padding: 32px; border: 1px solid #e2e8f0;">

    <div style="text-align: center; margin-bottom: 24px;">
      <h1 style="margin: 0; font-size: 22px; color: #1a202c;">Nuevo Lead — AI Factory</h1>
      <div style="margin-top: 8px;">
        <span style="display: inline-block; padding: 4px 16px; border-radius: 20px; font-size: 14px; font-weight: 700; color: white; background-color: ${tierColor};">
          ${tierLabel} — Score: ${data.score ?? 0}/100
        </span>
      </div>
    </div>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
      ${fieldRows}
    </table>

    ${
      data.conversationSummary
        ? `
    <div style="margin-bottom: 24px;">
      <h2 style="font-size: 16px; color: #1a202c; margin-bottom: 8px;">Resumen Diagnostico</h2>
      <div style="background: #f7fafc; border-radius: 8px; padding: 16px; color: #4a5568; line-height: 1.6; font-size: 14px;">
        ${data.conversationSummary.replace(/\n/g, '<br/>')}
      </div>
    </div>`
        : ''
    }

    ${
      conversationHtml
        ? `
    <div>
      <h2 style="font-size: 16px; color: #1a202c; margin-bottom: 12px;">Conversacion Completa</h2>
      <div style="background: #f7fafc; border-radius: 8px; padding: 16px; font-size: 13px;">
        ${conversationHtml}
      </div>
    </div>`
        : ''
    }

  </div>

  <p style="text-align: center; color: #a0aec0; font-size: 12px; margin-top: 16px;">
    Enviado automaticamente por LX3 AI Factory Diagnostic System
  </p>

</body>
</html>`;
}

export async function sendLeadNotification(data: LeadEmailData) {
  const tierLabel =
    data.tier === 'hot' ? '🔥 HOT' : data.tier === 'warm' ? '🟡 WARM' : '🔵 COLD';

  try {
    const result = await resend.emails.send({
      from: 'LX3 AI Factory <leads@lx3.ai>',
      to: LEAD_RECIPIENT,
      subject: `${tierLabel} Lead: ${data.name || 'Sin nombre'} — ${data.company || 'Sin empresa'} — Score ${data.score ?? 0}/100`,
      html: buildLeadEmailHtml(data),
    });

    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('[Email Error]', error);
    return { success: false, error: String(error) };
  }
}
