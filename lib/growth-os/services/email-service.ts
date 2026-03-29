import { Resend } from "resend";

const FROM_ADDRESS = "LX3 Growth OS <growth@lx3.ai>";

function getAdminEmails(): string[] {
  return process.env.NOTIFICATION_EMAILS?.split(",").map((e) => e.trim()) || [
    "carlos.irigoyen@gmail.com",
  ];
}

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  return apiKey ? new Resend(apiKey) : null;
}

// ---------------------------------------------------------------------------
// Send quote email to contact
// ---------------------------------------------------------------------------

export async function sendQuoteEmail(params: {
  to: string;
  contactName: string;
  quoteTitle: string;
  quoteNumber: string;
  trackingToken: string;
  pdfUrl?: string;
}) {
  const resend = getResendClient();
  if (!resend) {
    console.error("[Growth OS Email] Missing RESEND_API_KEY");
    return { success: false, error: "Missing RESEND_API_KEY" };
  }

  const quoteUrl = `https://lx3.ai/q/${params.trackingToken}`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f7fafc;">
  <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 40px 32px; text-align: center;">
    <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">LX3</h1>
    <p style="margin: 8px 0 0; color: #94a3b8; font-size: 14px;">Propuesta Profesional</p>
  </div>

  <div style="background: #ffffff; padding: 40px 32px;">
    <p style="margin: 0 0 16px; color: #334155; font-size: 16px; line-height: 1.6;">
      Hola ${params.contactName},
    </p>
    <p style="margin: 0 0 24px; color: #334155; font-size: 16px; line-height: 1.6;">
      Hemos preparado la siguiente propuesta para ti:
    </p>

    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
      <p style="margin: 0 0 4px; color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Propuesta</p>
      <p style="margin: 0 0 8px; color: #0f172a; font-size: 20px; font-weight: 600;">${params.quoteTitle}</p>
      <p style="margin: 0; color: #64748b; font-size: 14px;">N.o ${params.quoteNumber}</p>
    </div>

    <div style="text-align: center; margin-bottom: 32px;">
      <a href="${quoteUrl}" style="display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-size: 16px; font-weight: 600;">
        Ver Propuesta Completa
      </a>
    </div>

    ${params.pdfUrl ? `<p style="text-align: center; margin: 0 0 24px; color: #64748b; font-size: 14px;"><a href="${params.pdfUrl}" style="color: #2563eb; text-decoration: underline;">Descargar PDF</a></p>` : ""}

    <p style="margin: 0; color: #94a3b8; font-size: 13px; line-height: 1.5;">
      Si tienes preguntas, responde directamente a este correo o contactanos en contacto@lx3.ai.
    </p>
  </div>

  <div style="padding: 24px 32px; text-align: center;">
    <p style="margin: 0; color: #94a3b8; font-size: 12px;">
      &copy; ${new Date().getFullYear()} LX3 &mdash; Software a Medida con IA
    </p>
  </div>
</body>
</html>`;

  try {
    const result = await resend.emails.send({
      from: FROM_ADDRESS,
      to: params.to,
      subject: `Propuesta ${params.quoteNumber}: ${params.quoteTitle}`,
      html,
    });

    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error("[Growth OS Email] sendQuoteEmail error:", error);
    return { success: false, error: String(error) };
  }
}

// ---------------------------------------------------------------------------
// Notify admins about quote activity
// ---------------------------------------------------------------------------

export async function sendQuoteNotification(params: {
  type: "viewed" | "accepted" | "rejected";
  quoteNumber: string;
  contactName: string;
}) {
  const resend = getResendClient();
  if (!resend) {
    console.error("[Growth OS Email] Missing RESEND_API_KEY");
    return { success: false, error: "Missing RESEND_API_KEY" };
  }

  const labels: Record<string, { emoji: string; action: string; color: string }> = {
    viewed: { emoji: "👁", action: "Vista", color: "#2563eb" },
    accepted: { emoji: "✅", action: "Aceptada", color: "#16a34a" },
    rejected: { emoji: "❌", action: "Rechazada", color: "#dc2626" },
  };

  const { emoji, action, color } = labels[params.type];

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; background-color: #f7fafc;">
  <div style="background: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e2e8f0;">
    <div style="text-align: center; margin-bottom: 20px;">
      <span style="font-size: 40px;">${emoji}</span>
    </div>
    <h2 style="margin: 0 0 8px; text-align: center; color: #0f172a; font-size: 18px;">
      Propuesta <span style="color: ${color};">${action}</span>
    </h2>
    <p style="margin: 0 0 24px; text-align: center; color: #64748b; font-size: 14px;">
      ${params.contactName} &mdash; ${params.quoteNumber}
    </p>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Contacto</td>
        <td style="padding: 8px 0; color: #0f172a; font-size: 14px; text-align: right; font-weight: 600;">${params.contactName}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Propuesta</td>
        <td style="padding: 8px 0; color: #0f172a; font-size: 14px; text-align: right; font-weight: 600;">${params.quoteNumber}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Estado</td>
        <td style="padding: 8px 0; color: ${color}; font-size: 14px; text-align: right; font-weight: 600;">${action}</td>
      </tr>
    </table>
  </div>
  <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 16px;">
    LX3 Growth OS
  </p>
</body>
</html>`;

  try {
    const result = await resend.emails.send({
      from: FROM_ADDRESS,
      to: getAdminEmails(),
      subject: `${emoji} Propuesta ${params.quoteNumber} ${action} por ${params.contactName}`,
      html,
    });

    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error("[Growth OS Email] sendQuoteNotification error:", error);
    return { success: false, error: String(error) };
  }
}

// ---------------------------------------------------------------------------
// Notify admins about a new lead from Growth OS
// ---------------------------------------------------------------------------

export async function sendNewLeadNotification(params: {
  contactName: string;
  email?: string;
  source: string;
}) {
  const resend = getResendClient();
  if (!resend) {
    console.error("[Growth OS Email] Missing RESEND_API_KEY");
    return { success: false, error: "Missing RESEND_API_KEY" };
  }

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; background-color: #f7fafc;">
  <div style="background: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e2e8f0;">
    <div style="text-align: center; margin-bottom: 20px;">
      <span style="font-size: 40px;">🎯</span>
    </div>
    <h2 style="margin: 0 0 16px; text-align: center; color: #0f172a; font-size: 18px;">Nuevo Lead &mdash; Growth OS</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Nombre</td>
        <td style="padding: 8px 0; color: #0f172a; font-size: 14px; text-align: right; font-weight: 600;">${params.contactName}</td>
      </tr>
      ${params.email ? `<tr><td style="padding: 8px 0; color: #64748b; font-size: 14px;">Email</td><td style="padding: 8px 0; color: #0f172a; font-size: 14px; text-align: right; font-weight: 600;">${params.email}</td></tr>` : ""}
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Fuente</td>
        <td style="padding: 8px 0; color: #0f172a; font-size: 14px; text-align: right; font-weight: 600;">${params.source}</td>
      </tr>
    </table>
  </div>
  <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 16px;">
    LX3 Growth OS
  </p>
</body>
</html>`;

  try {
    const result = await resend.emails.send({
      from: FROM_ADDRESS,
      to: getAdminEmails(),
      subject: `🎯 Nuevo Lead: ${params.contactName} (${params.source})`,
      html,
    });

    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error("[Growth OS Email] sendNewLeadNotification error:", error);
    return { success: false, error: String(error) };
  }
}
