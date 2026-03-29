import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendQuoteEmail } from "@/lib/growth-os/services/email-service";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!prisma) {
    return NextResponse.json(
      { error: "Database not available" },
      { status: 503 }
    );
  }

  try {
    const { id } = await params;

    // Fetch quote with contact
    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        contact: true,
      },
    });

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    if (!quote.contact?.email) {
      return NextResponse.json(
        { error: "Contact has no email address" },
        { status: 400 }
      );
    }

    // Generate tracking token if not exists
    let trackingToken = quote.trackingToken;
    if (!trackingToken) {
      trackingToken = crypto.randomUUID();
      await prisma.quote.update({
        where: { id },
        data: { trackingToken },
      });
    }

    // Send email
    const emailResult = await sendQuoteEmail({
      to: quote.contact.email,
      contactName: `${quote.contact.firstName} ${quote.contact.lastName ?? ""}`.trim(),
      quoteTitle: quote.title,
      quoteNumber: quote.quoteNumber,
      trackingToken,
      pdfUrl: quote.pdfUrl ?? undefined,
    });

    if (!emailResult.success) {
      // Log failed email
      await prisma.emailLog.create({
        data: {
          to: quote.contact.email,
          subject: `Propuesta ${quote.quoteNumber}: ${quote.title}`,
          status: "FAILED",
          contactId: quote.contactId,
          errorMsg: emailResult.error ?? null,
        },
      });

      return NextResponse.json(
        { error: emailResult.error ?? "Failed to send email" },
        { status: 500 }
      );
    }

    // Update quote status to SENT
    await prisma.quote.update({
      where: { id },
      data: {
        status: "SENT",
        sentAt: new Date(),
      },
    });

    // Create activity
    await prisma.activity.create({
      data: {
        type: "QUOTE_SENT",
        title: `Propuesta ${quote.quoteNumber} enviada a ${quote.contact.email}`,
        contactId: quote.contactId,
        dealId: quote.dealId ?? undefined,
        metadata: {
          quoteNumber: quote.quoteNumber,
          toEmail: quote.contact.email,
          resendId: emailResult.id,
        },
      },
    });

    // Create EmailLog entry
    await prisma.emailLog.create({
      data: {
        to: quote.contact.email,
        subject: `Propuesta ${quote.quoteNumber}: ${quote.title}`,
        status: "SENT",
        resendId: emailResult.id ?? null,
        sentAt: new Date(),
        contactId: quote.contactId,
      },
    });

    return NextResponse.json({ ok: true, emailId: emailResult.id });
  } catch (error) {
    console.error("[QuoteSend] Error:", error);
    return NextResponse.json(
      { error: "Failed to send quote" },
      { status: 500 }
    );
  }
}
