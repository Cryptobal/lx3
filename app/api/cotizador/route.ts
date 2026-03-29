import { type NextRequest } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

export const runtime = "nodejs";

const RECIPIENTS = ["contacto@lx3.ai", "carlos.irigoyen@gmail.com"];

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  return apiKey ? new Resend(apiKey) : null;
}

const cotizadorSchema = z.object({
  formData: z.object({
    name: z.string().min(1),
    company: z.string().optional().default(""),
    email: z.string().email(),
    phone: z.string().optional().default(""),
    source: z.string().optional().default(""),
    notes: z.string().optional().default(""),
  }),
  selectedPackage: z.string().min(1),
  addonCounts: z.record(z.string(), z.number()),
  monthlyPlan: z.string().nullable(),
  totalOneTime: z.number(),
  totalMonthly: z.number(),
});

const packageNames: Record<string, string> = {
  landing: "Landing Pro",
  corporate: "Web Corporativa",
  platform: "Web a Medida",
};

const addonNames: Record<string, string> = {
  "extra-page": "Pagina adicional",
  blog: "Blog integrado",
  whatsapp: "WhatsApp integrado",
  mercadopago: "Pagos online",
  catalogo: "Catalogo de productos",
  forms: "Formularios avanzados",
  chatbot: "Chatbot con IA",
  multilang: "Multilenguaje (ES/EN)",
};

const planNames: Record<string, string> = {
  basic: "Mantencion Basica",
  growth: "Crecimiento SEO",
  pro: "SEO Profesional",
};

const sourceNames: Record<string, string> = {
  google: "Google",
  linkedin: "LinkedIn",
  referral: "Referido",
  other: "Otro",
};

function formatCLP(amount: number): string {
  return `$${new Intl.NumberFormat("es-CL").format(amount)}`;
}

function buildEmailHtml(data: z.infer<typeof cotizadorSchema>): string {
  const { formData, selectedPackage, addonCounts, monthlyPlan, totalOneTime, totalMonthly } = data;

  const activeAddons = Object.entries(addonCounts)
    .filter(([, count]) => (count as number) > 0)
    .map(([id, count]) => {
      const name = addonNames[id] || id;
      return (count as number) > 1 ? `${name} x${count}` : name;
    });

  const addonRows = activeAddons.length > 0
    ? activeAddons.map((a) => `<li style="padding: 4px 0; color: #4a5568;">${a}</li>`).join("")
    : '<li style="padding: 4px 0; color: #718096;">Ninguno</li>';

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7fafc;">

  <div style="background: white; border-radius: 12px; padding: 32px; border: 1px solid #e2e8f0;">

    <div style="text-align: center; margin-bottom: 24px;">
      <h1 style="margin: 0; font-size: 22px; color: #1a202c;">Nueva cotizacion web — LX3</h1>
    </div>

    <!-- Prospect data -->
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
      <tr>
        <td style="padding: 10px 16px; font-weight: 600; color: #4a5568; border-bottom: 1px solid #e2e8f0; width: 140px;">Nombre</td>
        <td style="padding: 10px 16px; color: #2d3748; border-bottom: 1px solid #e2e8f0;">${formData.name}</td>
      </tr>
      ${formData.company ? `<tr>
        <td style="padding: 10px 16px; font-weight: 600; color: #4a5568; border-bottom: 1px solid #e2e8f0;">Empresa</td>
        <td style="padding: 10px 16px; color: #2d3748; border-bottom: 1px solid #e2e8f0;">${formData.company}</td>
      </tr>` : ""}
      <tr>
        <td style="padding: 10px 16px; font-weight: 600; color: #4a5568; border-bottom: 1px solid #e2e8f0;">Email</td>
        <td style="padding: 10px 16px; color: #2d3748; border-bottom: 1px solid #e2e8f0;">${formData.email}</td>
      </tr>
      ${formData.phone ? `<tr>
        <td style="padding: 10px 16px; font-weight: 600; color: #4a5568; border-bottom: 1px solid #e2e8f0;">Telefono</td>
        <td style="padding: 10px 16px; color: #2d3748; border-bottom: 1px solid #e2e8f0;">${formData.phone}</td>
      </tr>` : ""}
      ${formData.source ? `<tr>
        <td style="padding: 10px 16px; font-weight: 600; color: #4a5568; border-bottom: 1px solid #e2e8f0;">Fuente</td>
        <td style="padding: 10px 16px; color: #2d3748; border-bottom: 1px solid #e2e8f0;">${sourceNames[formData.source] || formData.source}</td>
      </tr>` : ""}
    </table>

    <!-- Package -->
    <div style="margin-bottom: 20px;">
      <h2 style="font-size: 16px; color: #1a202c; margin-bottom: 8px;">Paquete seleccionado</h2>
      <div style="background: #f0f7ff; border-radius: 8px; padding: 16px; border-left: 4px solid #3A8BFD;">
        <strong style="color: #2d3748;">${packageNames[selectedPackage] || selectedPackage}</strong>
      </div>
    </div>

    <!-- Add-ons -->
    <div style="margin-bottom: 20px;">
      <h2 style="font-size: 16px; color: #1a202c; margin-bottom: 8px;">Add-ons</h2>
      <ul style="margin: 0; padding-left: 20px; list-style-type: disc;">
        ${addonRows}
      </ul>
    </div>

    <!-- Monthly plan -->
    <div style="margin-bottom: 24px;">
      <h2 style="font-size: 16px; color: #1a202c; margin-bottom: 8px;">Plan mensual</h2>
      <div style="background: ${monthlyPlan ? "#f0fdf4" : "#f7fafc"}; border-radius: 8px; padding: 16px; border-left: 4px solid ${monthlyPlan ? "#34D399" : "#CBD5E0"};">
        <strong style="color: #2d3748;">${monthlyPlan ? planNames[monthlyPlan] || monthlyPlan : "Sin plan mensual"}</strong>
        ${totalMonthly > 0 ? ` — <span style="color: #34D399; font-weight: 700;">${formatCLP(totalMonthly)} CLP/mes</span>` : ""}
      </div>
    </div>

    ${formData.notes ? `
    <!-- Notes -->
    <div style="margin-bottom: 24px;">
      <h2 style="font-size: 16px; color: #1a202c; margin-bottom: 8px;">Notas del prospecto</h2>
      <div style="background: #f7fafc; border-radius: 8px; padding: 16px; border-left: 4px solid #CBD5E0;">
        <p style="color: #4a5568; margin: 0; white-space: pre-wrap;">${formData.notes}</p>
      </div>
    </div>
    ` : ""}

    <!-- Totals -->
    <div style="background: #1a202c; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
      <div style="margin-bottom: 12px;">
        <span style="color: #a0aec0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Total pago unico</span>
        <div style="color: #3A8BFD; font-size: 28px; font-weight: 800;">${formatCLP(totalOneTime)} CLP</div>
      </div>
      ${totalMonthly > 0 ? `<div>
        <span style="color: #a0aec0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Total mensual</span>
        <div style="color: #FB923C; font-size: 22px; font-weight: 700;">${formatCLP(totalMonthly)} CLP/mes</div>
      </div>` : ""}
    </div>

    <!-- Reply button -->
    <div style="text-align: center;">
      <a href="mailto:${formData.email}" style="display: inline-block; padding: 12px 32px; background: #3A8BFD; color: white; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600;">
        Responder a ${formData.name}
      </a>
    </div>

  </div>

  <p style="text-align: center; color: #a0aec0; font-size: 12px; margin-top: 16px;">
    LX3 Cotizador · lx3.ai/cotiza
  </p>

</body>
</html>`;
}

export async function POST(request: NextRequest) {
  try {
    const resend = getResendClient();
    if (!resend) {
      console.error("[Cotizador API] Missing RESEND_API_KEY");
      return Response.json(
        { error: "Servicio de correo no configurado." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const parsed = cotizadorSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Datos invalidos.", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const companyLabel = data.formData.company || "Sin empresa";

    const result = await resend.emails.send({
      from: "LX3 <cotizador@lx3.ai>",
      to: RECIPIENTS,
      replyTo: data.formData.email,
      subject: `\u{1F4B0} Cotizacion web: ${data.formData.name} — ${companyLabel} — ${formatCLP(data.totalOneTime)} CLP`,
      html: buildEmailHtml(data),
    });

    if (result.error) {
      console.error("[Cotizador API] Resend error:", result.error);
      return Response.json(
        { error: "Error al enviar. Intenta de nuevo." },
        { status: 500 }
      );
    }

    return Response.json({ success: true, id: result.data?.id });
  } catch (error) {
    console.error("[Cotizador API] Unexpected error:", error);
    return Response.json(
      { error: "Error inesperado. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
