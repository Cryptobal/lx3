import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const DEFAULT_FROM = "LX3 <no-reply@lx3.ai>";

function getBaseUrl(): string {
  return process.env.NEXTAUTH_URL || "https://lx3.ai";
}

function getNotificationEmails(): string[] {
  const envEmails = process.env.NOTIFICATION_EMAILS;
  if (envEmails) {
    return envEmails.split(",").map((e) => e.trim()).filter(Boolean);
  }
  return ["carlos.irigoyen@gmail.com"];
}

export async function sendQuoteEmail(params: {
  to: string;
  contactName: string;
  quoteTitle: string;
  quoteNumber: string;
  total: string;
  currency: string;
  trackingToken: string;
  pdfUrl?: string;
}) {
  const {
    to,
    contactName,
    quoteTitle,
    quoteNumber,
    total,
    currency,
    trackingToken,
    pdfUrl,
  } = params;

  const quoteUrl = `${getBaseUrl()}/q/${trackingToken}`;

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          <!-- Header -->
          <tr>
            <td style="background-color:#0f172a;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:1px;">LX3</h1>
              <p style="margin:4px 0 0;color:#94a3b8;font-size:13px;">Soluciones Digitales</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 16px;color:#1e293b;font-size:16px;line-height:1.6;">
                Hola <strong>${contactName}</strong>,
              </p>
              <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.6;">
                Te enviamos la cotizacion que solicitaste. A continuacion encontraras los detalles:
              </p>

              <!-- Quote Details Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:32px;">
                <tr>
                  <td style="padding:24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom:12px;">
                          <span style="color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Cotizacion</span><br>
                          <span style="color:#1e293b;font-size:15px;font-weight:600;">${quoteNumber}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom:12px;">
                          <span style="color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Descripcion</span><br>
                          <span style="color:#1e293b;font-size:15px;font-weight:600;">${quoteTitle}</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span style="color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Total</span><br>
                          <span style="color:#0f172a;font-size:22px;font-weight:700;">${total} ${currency}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:32px;">
                    <a href="${quoteUrl}" style="display:inline-block;background-color:#2563eb;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;padding:14px 40px;border-radius:6px;">
                      Ver Cotizacion Completa
                    </a>
                  </td>
                </tr>
              </table>

              ${
                pdfUrl
                  ? `<p style="margin:0 0 8px;color:#475569;font-size:14px;text-align:center;">
                      Tambien puedes <a href="${pdfUrl}" style="color:#2563eb;text-decoration:underline;">descargar el PDF</a>.
                    </p>`
                  : ""
              }

              <p style="margin:24px 0 0;color:#475569;font-size:14px;line-height:1.6;">
                Si tienes alguna pregunta, no dudes en responder a este correo.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc;border-top:1px solid #e2e8f0;padding:24px 40px;text-align:center;">
              <p style="margin:0 0 4px;color:#64748b;font-size:13px;">
                LX3 Soluciones Digitales
              </p>
              <p style="margin:0;color:#94a3b8;font-size:12px;">
                Este correo fue enviado como parte de una cotizacion solicitada.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();

  const { data, error } = await resend.emails.send({
    from: DEFAULT_FROM,
    to,
    subject: `Cotizacion ${quoteNumber} - ${quoteTitle}`,
    html,
  });

  if (error) {
    throw new Error(`Failed to send quote email: ${error.message}`);
  }

  return { id: data?.id, quoteUrl };
}

export async function sendNotificationEmail(params: {
  subject: string;
  body: string;
}) {
  const { subject, body } = params;
  const recipients = getNotificationEmails();

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background-color:#f4f4f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="background-color:#0f172a;padding:20px 40px;">
              <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">LX3 Notification</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px;">
              <div style="color:#1e293b;font-size:15px;line-height:1.6;">${body}</div>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f8fafc;border-top:1px solid #e2e8f0;padding:16px 40px;text-align:center;">
              <p style="margin:0;color:#94a3b8;font-size:12px;">LX3 Growth OS</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();

  const { data, error } = await resend.emails.send({
    from: DEFAULT_FROM,
    to: recipients,
    subject,
    html,
  });

  if (error) {
    throw new Error(`Failed to send notification email: ${error.message}`);
  }

  return { id: data?.id };
}

export async function sendNewLeadNotification(params: {
  contactName: string;
  email?: string;
  company?: string;
  source: string;
  message?: string;
}) {
  const { contactName, email, company, source, message } = params;

  const details = [
    `<strong>Nombre:</strong> ${contactName}`,
    email ? `<strong>Email:</strong> ${email}` : null,
    company ? `<strong>Empresa:</strong> ${company}` : null,
    `<strong>Origen:</strong> ${source}`,
  ]
    .filter(Boolean)
    .map((line) => `<p style="margin:4px 0;">${line}</p>`)
    .join("\n");

  const messageBlock = message
    ? `<div style="margin-top:16px;padding:16px;background-color:#f1f5f9;border-radius:6px;border-left:4px solid #2563eb;">
        <p style="margin:0 0 4px;color:#64748b;font-size:12px;text-transform:uppercase;">Mensaje</p>
        <p style="margin:0;color:#1e293b;font-size:14px;line-height:1.6;">${message}</p>
      </div>`
    : "";

  const body = `
    <h2 style="margin:0 0 16px;color:#1e293b;font-size:18px;">Nuevo Lead Recibido</h2>
    ${details}
    ${messageBlock}
    <p style="margin:24px 0 0;color:#475569;font-size:14px;">
      <a href="${getBaseUrl()}/growth-os/contacts" style="color:#2563eb;text-decoration:underline;">Ver en Growth OS</a>
    </p>
  `.trim();

  return sendNotificationEmail({
    subject: `Nuevo Lead: ${contactName}${company ? ` (${company})` : ""}`,
    body,
  });
}
