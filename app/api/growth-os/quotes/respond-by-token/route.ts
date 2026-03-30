import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendQuoteNotification } from "@/lib/growth-os/services/email-service";

export async function POST(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json({ error: "DB not available" }, { status: 500 });
  }

  try {
    const { token, action, message } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 });
    }

    const quote = await prisma.quote.findUnique({
      where: { trackingToken: token },
      include: { contact: true },
    });

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    const contactName = quote.contact
      ? `${quote.contact.firstName} ${quote.contact.lastName || ""}`.trim()
      : "Cliente";

    if (action === "request_changes") {
      if (!message?.trim()) {
        return NextResponse.json(
          { error: "Message is required" },
          { status: 400 }
        );
      }

      await prisma.activity.create({
        data: {
          type: "QUOTE_REJECTED",
          title: `Cliente solicito cambios en cotizacion ${quote.quoteNumber}`,
          description: message.trim(),
          contactId: quote.contactId,
          dealId: quote.dealId,
          metadata: {
            quoteId: quote.id,
            changeRequest: message.trim(),
          },
        },
      });

      sendQuoteNotification({
        type: "rejected",
        quoteNumber: quote.quoteNumber,
        contactName,
      }).catch((err) =>
        console.error("[Quote] Failed to send changes notification:", err)
      );

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Quote respond-by-token error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
