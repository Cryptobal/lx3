import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { nanoid } from "nanoid";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!prisma) {
    return NextResponse.json({ error: "DB not available" }, { status: 500 });
  }

  try {
    const { id } = await params;

    const quote = await prisma.quote.findUnique({
      where: { id },
      include: { contact: true, items: true },
    });

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    if (!quote.contact?.email) {
      return NextResponse.json(
        { error: "Contact has no email" },
        { status: 400 }
      );
    }

    // Generate tracking token if not exists
    const trackingToken = quote.trackingToken || nanoid(24);
    const baseUrl = process.env.NEXTAUTH_URL || "https://lx3.ai";
    const publicUrl = `${baseUrl}/q/${trackingToken}`;

    // Format total
    const total = Number(quote.total);
    const formattedTotal =
      quote.currency === "CLP"
        ? `$${total.toLocaleString("es-CL")}`
        : `US$${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

    // Send email
    const emailResult = await resend.emails.send({
      from: "LX3 <cotizaciones@lx3.ai>",
      to: quote.contact.email,
      subject: `Cotización ${quote.quoteNumber} - ${quote.title}`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="background:white;border-radius:12px;padding:40px;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
      <div style="text-align:center;margin-bottom:32px;">
        <h1 style="font-size:24px;font-weight:700;color:#111827;margin:0;">LX3</h1>
        <p style="color:#6b7280;font-size:14px;margin:4px 0 0;">Software Studio</p>
      </div>

      <p style="color:#374151;font-size:16px;line-height:1.6;">
        Hola ${quote.contact.firstName},
      </p>

      <p style="color:#374151;font-size:16px;line-height:1.6;">
        Te enviamos la cotización <strong>${quote.quoteNumber}</strong> por <strong>${quote.title}</strong>.
      </p>

      <div style="background:#f9fafb;border-radius:8px;padding:20px;margin:24px 0;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="color:#6b7280;font-size:14px;padding:4px 0;">Cotización</td>
            <td style="color:#111827;font-size:14px;padding:4px 0;text-align:right;font-weight:600;">${quote.quoteNumber}</td>
          </tr>
          <tr>
            <td style="color:#6b7280;font-size:14px;padding:4px 0;">Total</td>
            <td style="color:#111827;font-size:18px;padding:4px 0;text-align:right;font-weight:700;">${formattedTotal}</td>
          </tr>
          ${quote.validUntil ? `<tr>
            <td style="color:#6b7280;font-size:14px;padding:4px 0;">Válida hasta</td>
            <td style="color:#111827;font-size:14px;padding:4px 0;text-align:right;">${new Date(quote.validUntil).toLocaleDateString("es-CL")}</td>
          </tr>` : ""}
        </table>
      </div>

      <div style="text-align:center;margin:32px 0;">
        <a href="${publicUrl}" style="display:inline-block;background:#111827;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px;">
          Ver Cotización
        </a>
      </div>

      <p style="color:#9ca3af;font-size:13px;text-align:center;margin-top:32px;">
        Si tienes alguna pregunta, responde este email o contáctanos en contacto@lx3.ai
      </p>
    </div>
  </div>
</body>
</html>`,
    });

    // Update quote
    await prisma.quote.update({
      where: { id },
      data: {
        trackingToken,
        status: "SENT",
        sentAt: new Date(),
      },
    });

    // Create email log
    await prisma.emailLog.create({
      data: {
        to: quote.contact.email,
        subject: `Cotización ${quote.quoteNumber} - ${quote.title}`,
        status: "SENT",
        resendId: emailResult.data?.id,
        sentAt: new Date(),
        contactId: quote.contactId,
        sentById: session.user.id,
      },
    });

    // Record activity
    await prisma.activity.create({
      data: {
        type: "QUOTE_SENT",
        title: `Cotización ${quote.quoteNumber} enviada a ${quote.contact.email}`,
        contactId: quote.contactId,
        dealId: quote.dealId,
        userId: session.user.id,
        metadata: { quoteId: id, email: quote.contact.email },
      },
    });

    return NextResponse.json({ ok: true, trackingToken });
  } catch (error) {
    console.error("Send quote error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
