import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!prisma) {
    return NextResponse.json({ error: "DB not available" }, { status: 500 });
  }

  try {
    const { id } = await params;
    const { action, message } = await request.json();

    const quote = await prisma.quote.findUnique({
      where: { id },
      include: { contact: true },
    });

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    if (action === "accept") {
      await prisma.quote.update({
        where: { id },
        data: { status: "ACCEPTED", acceptedAt: new Date() },
      });

      await prisma.activity.create({
        data: {
          type: "QUOTE_ACCEPTED",
          title: `Cotización ${quote.quoteNumber} aceptada por ${quote.contact?.firstName || "cliente"}`,
          contactId: quote.contactId,
          dealId: quote.dealId,
          metadata: { quoteId: id },
        },
      });

      // TODO: Send notification email to admin when Resend is configured
      console.log(
        `[Quote] Quote ${quote.quoteNumber} accepted by client${
          quote.contact?.email ? ` (${quote.contact.email})` : ""
        }`
      );

      return NextResponse.json({ ok: true, status: "ACCEPTED" });
    }

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
          title: `Cliente solicitó cambios en cotización ${quote.quoteNumber}`,
          description: message.trim(),
          contactId: quote.contactId,
          dealId: quote.dealId,
          metadata: {
            quoteId: id,
            changeRequest: message.trim(),
          },
        },
      });

      // TODO: Send notification email to admin when Resend is configured
      console.log(
        `[Quote] Change request for ${quote.quoteNumber}: ${message.trim()}`
      );

      return NextResponse.json({ ok: true, status: "CHANGES_REQUESTED" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Quote respond error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
