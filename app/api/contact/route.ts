import { type NextRequest } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

export const runtime = "nodejs";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  return apiKey ? new Resend(apiKey) : null;
}

const contactSchema = z.object({
  name: z.string().min(1),
  company: z.string().min(1).optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(1),
  source: z.string().optional(),
});

function buildContactEmailHtml(data: z.infer<typeof contactSchema>): string {
  const sourceLabels: Record<string, string> = {
    google: "Google",
    linkedin: "LinkedIn",
    referral: "Referido",
    other: "Otro",
  };

  const fields = [
    { label: "Nombre", value: data.name },
    { label: "Empresa", value: data.company },
    { label: "Email", value: data.email },
    { label: "Telefono", value: data.phone },
    { label: "Fuente", value: data.source ? sourceLabels[data.source] || data.source : undefined },
  ];

  const fieldRows = fields
    .filter((f) => f.value)
    .map(
      (f) => `
      <tr>
        <td style="padding: 10px 16px; font-weight: 600; color: #4a5568; border-bottom: 1px solid #e2e8f0; width: 140px; vertical-align: top;">${f.label}</td>
        <td style="padding: 10px 16px; color: #2d3748; border-bottom: 1px solid #e2e8f0;">${f.value}</td>
      </tr>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7fafc;">

  <div style="background: white; border-radius: 12px; padding: 32px; border: 1px solid #e2e8f0;">

    <div style="text-align: center; margin-bottom: 24px;">
      <h1 style="margin: 0; font-size: 20px; color: #1a202c;">Nuevo contacto desde lx3.ai</h1>
      <p style="margin: 8px 0 0 0; color: #718096; font-size: 14px;">${data.name}${data.company ? ` de ${data.company}` : ""}</p>
    </div>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
      ${fieldRows}
    </table>

    <div style="margin-top: 24px;">
      <h2 style="font-size: 15px; color: #1a202c; margin-bottom: 8px;">Mensaje</h2>
      <div style="background: #f7fafc; border-radius: 8px; padding: 16px; color: #4a5568; line-height: 1.6; font-size: 14px; white-space: pre-wrap;">
        ${data.message.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br/>")}
      </div>
    </div>

    <div style="margin-top: 24px; text-align: center;">
      <a href="mailto:${data.email}" style="display: inline-block; padding: 10px 24px; background: #06B6D4; color: white; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 500;">
        Responder a ${data.name}
      </a>
    </div>

  </div>

  <p style="text-align: center; color: #a0aec0; font-size: 12px; margin-top: 16px;">
    Enviado desde el formulario de contacto de lx3.ai
  </p>

</body>
</html>`;
}

export async function POST(request: NextRequest) {
  try {
    const resend = getResendClient();
    if (!resend) {
      console.error("[Contact API] Missing RESEND_API_KEY");
      return new Response(
        JSON.stringify({ error: "Servicio de correo no configurado. Intenta mas tarde." }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await request.json();

    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({
          error: "Datos invalidos. Revisa los campos del formulario.",
          details: parsed.error.flatten().fieldErrors,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = parsed.data;

    const result = await resend.emails.send({
      from: "LX3 <contacto@lx3.ai>",
      to: "carlos.irigoyen@gmail.com",
      replyTo: data.email,
      subject: `Nuevo contacto: ${data.name}${data.company ? ` — ${data.company}` : ""}`,
      html: buildContactEmailHtml(data),
    });

    if (result.error) {
      console.error("[Contact API] Resend error:", result.error);
      return new Response(
        JSON.stringify({ error: "Error al enviar el mensaje. Intenta de nuevo." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, id: result.data?.id }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[Contact API] Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Error inesperado. Intenta de nuevo." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
