import { type NextRequest } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

export const runtime = "nodejs";

const RECIPIENTS = ["contacto@lx3.ai", "carlos.irigoyen@gmail.com"];

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  return apiKey ? new Resend(apiKey) : null;
}

const diagnosticoSchema = z.object({
  needs: z.array(z.string()).min(1),
  userCount: z.string().min(1),
  currentTools: z.array(z.string()).min(1),
  hasTechTeam: z.string().min(1),
  budget: z.string().min(1),
  formData: z.object({
    name: z.string().min(1),
    company: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional().default(""),
    description: z.string().optional().default(""),
  }),
});

const needLabels: Record<string, string> = {
  crm: "CRM / Gestion comercial",
  erp: "ERP / Gestion operativa",
  portal: "Portal de clientes",
  dashboard: "Dashboard / Reportes",
  mobile: "App mobile para equipo en terreno",
  "ai-automation": "Automatizacion de procesos con IA",
};

const userCountLabels: Record<string, string> = {
  "1-10": "1-10 usuarios",
  "10-50": "10-50 usuarios",
  "50-200": "50-200 usuarios",
  "200+": "200+ usuarios",
};

const toolLabels: Record<string, string> = {
  excel: "Excel / Google Sheets",
  legacy: "Sistema propio (legacy)",
  saas: "SaaS (Salesforce, HubSpot, etc.)",
  erp: "ERP (SAP, Oracle, etc.)",
  nothing: "Nada — todo es manual",
};

const techTeamLabels: Record<string, string> = {
  "yes-devs": "Si, tiene desarrolladores",
  "it-no-dev": "Tiene IT pero no desarrolla",
  "no-external": "No, necesita todo externalizado",
};

const budgetLabels: Record<string, string> = {
  "under-3m": "Menos de $3.000.000 CLP",
  "3m-8m": "$3.000.000 - $8.000.000 CLP",
  "8m-15m": "$8.000.000 - $15.000.000 CLP",
  "over-15m": "Mas de $15.000.000 CLP",
  unsure: "No tengo claro, necesito orientacion",
};

function buildEmailHtml(data: z.infer<typeof diagnosticoSchema>): string {
  const { needs, userCount, currentTools, hasTechTeam, budget, formData } = data;

  const needsList = needs.map((n) => needLabels[n] || n).join(", ");
  const toolsList = currentTools.map((t) => toolLabels[t] || t).join(", ");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7fafc;">

  <div style="background: white; border-radius: 12px; padding: 32px; border: 1px solid #e2e8f0;">

    <div style="text-align: center; margin-bottom: 24px;">
      <h1 style="margin: 0; font-size: 22px; color: #1a202c;">Nuevo diagnostico software — LX3</h1>
      <span style="display: inline-block; margin-top: 8px; padding: 4px 12px; background: #FB923C; color: white; border-radius: 20px; font-size: 12px; font-weight: 600;">Software</span>
    </div>

    <!-- Prospect data -->
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
      <tr>
        <td style="padding: 10px 16px; font-weight: 600; color: #4a5568; border-bottom: 1px solid #e2e8f0; width: 140px;">Nombre</td>
        <td style="padding: 10px 16px; color: #2d3748; border-bottom: 1px solid #e2e8f0;">${formData.name}</td>
      </tr>
      <tr>
        <td style="padding: 10px 16px; font-weight: 600; color: #4a5568; border-bottom: 1px solid #e2e8f0;">Empresa</td>
        <td style="padding: 10px 16px; color: #2d3748; border-bottom: 1px solid #e2e8f0;">${formData.company}</td>
      </tr>
      <tr>
        <td style="padding: 10px 16px; font-weight: 600; color: #4a5568; border-bottom: 1px solid #e2e8f0;">Email</td>
        <td style="padding: 10px 16px; color: #2d3748; border-bottom: 1px solid #e2e8f0;">${formData.email}</td>
      </tr>
      ${formData.phone ? `<tr>
        <td style="padding: 10px 16px; font-weight: 600; color: #4a5568; border-bottom: 1px solid #e2e8f0;">Telefono</td>
        <td style="padding: 10px 16px; color: #2d3748; border-bottom: 1px solid #e2e8f0;">${formData.phone}</td>
      </tr>` : ""}
    </table>

    <!-- Diagnostic responses -->
    <div style="margin-bottom: 20px;">
      <h2 style="font-size: 16px; color: #1a202c; margin-bottom: 8px;">Necesidades</h2>
      <div style="background: #f0f7ff; border-radius: 8px; padding: 16px; border-left: 4px solid #3A8BFD;">
        <p style="color: #2d3748; margin: 0;">${needsList}</p>
      </div>
    </div>

    <div style="margin-bottom: 20px;">
      <h2 style="font-size: 16px; color: #1a202c; margin-bottom: 8px;">Usuarios estimados</h2>
      <div style="background: #f7fafc; border-radius: 8px; padding: 16px; border-left: 4px solid #CBD5E0;">
        <p style="color: #2d3748; margin: 0;">${userCountLabels[userCount] || userCount}</p>
      </div>
    </div>

    <div style="margin-bottom: 20px;">
      <h2 style="font-size: 16px; color: #1a202c; margin-bottom: 8px;">Herramientas actuales</h2>
      <div style="background: #f7fafc; border-radius: 8px; padding: 16px; border-left: 4px solid #CBD5E0;">
        <p style="color: #2d3748; margin: 0;">${toolsList}</p>
      </div>
    </div>

    <div style="margin-bottom: 20px;">
      <h2 style="font-size: 16px; color: #1a202c; margin-bottom: 8px;">Equipo tecnico</h2>
      <div style="background: #f7fafc; border-radius: 8px; padding: 16px; border-left: 4px solid #CBD5E0;">
        <p style="color: #2d3748; margin: 0;">${techTeamLabels[hasTechTeam] || hasTechTeam}</p>
      </div>
    </div>

    <div style="margin-bottom: 20px;">
      <h2 style="font-size: 16px; color: #1a202c; margin-bottom: 8px;">Presupuesto estimado</h2>
      <div style="background: #fef3c7; border-radius: 8px; padding: 16px; border-left: 4px solid #EAB308;">
        <strong style="color: #2d3748;">${budgetLabels[budget] || budget}</strong>
      </div>
    </div>

    ${formData.description ? `
    <div style="margin-bottom: 24px;">
      <h2 style="font-size: 16px; color: #1a202c; margin-bottom: 8px;">Descripcion del proyecto</h2>
      <div style="background: #f7fafc; border-radius: 8px; padding: 16px; border-left: 4px solid #CBD5E0;">
        <p style="color: #4a5568; margin: 0; white-space: pre-wrap;">${formData.description}</p>
      </div>
    </div>
    ` : ""}

    <!-- Reply button -->
    <div style="text-align: center;">
      <a href="mailto:${formData.email}" style="display: inline-block; padding: 12px 32px; background: #3A8BFD; color: white; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600;">
        Responder a ${formData.name}
      </a>
    </div>

  </div>

  <p style="text-align: center; color: #a0aec0; font-size: 12px; margin-top: 16px;">
    LX3 Diagnostico Software · lx3.ai/cotiza
  </p>

</body>
</html>`;
}

export async function POST(request: NextRequest) {
  try {
    const resend = getResendClient();
    if (!resend) {
      console.error("[Diagnostico API] Missing RESEND_API_KEY");
      return Response.json(
        { error: "Servicio de correo no configurado." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const parsed = diagnosticoSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Datos invalidos.", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const budgetLabel = budgetLabels[data.budget] || data.budget;

    const result = await resend.emails.send({
      from: "LX3 <cotizador@lx3.ai>",
      to: RECIPIENTS,
      replyTo: data.formData.email,
      subject: `\u{1F527} Diagnostico software: ${data.formData.name} — ${data.formData.company} — Presupuesto: ${budgetLabel}`,
      html: buildEmailHtml(data),
    });

    if (result.error) {
      console.error("[Diagnostico API] Resend error:", result.error);
      return Response.json(
        { error: "Error al enviar. Intenta de nuevo." },
        { status: 500 }
      );
    }

    return Response.json({ success: true, id: result.data?.id });
  } catch (error) {
    console.error("[Diagnostico API] Unexpected error:", error);
    return Response.json(
      { error: "Error inesperado. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
