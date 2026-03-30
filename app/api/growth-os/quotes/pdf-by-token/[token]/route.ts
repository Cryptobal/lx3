import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateQuotePDF } from "@/lib/growth-os/services/pdf-generator";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  if (!prisma) {
    return NextResponse.json({ error: "DB not available" }, { status: 500 });
  }

  try {
    const { token } = await params;

    const quote = await prisma.quote.findUnique({
      where: { trackingToken: token },
      include: {
        items: { orderBy: { order: "asc" } },
        contact: { include: { company: true } },
      },
    });

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    const contactName = quote.contact
      ? `${quote.contact.firstName} ${quote.contact.lastName || ""}`.trim()
      : null;

    const pdfBuffer = await generateQuotePDF({
      quoteNumber: quote.quoteNumber,
      title: quote.title,
      description: quote.description,
      createdAt: quote.createdAt,
      validUntil: quote.validUntil,
      contactName,
      companyName: quote.contact?.company?.name ?? null,
      items: quote.items.map((item) => ({
        description: item.description,
        details: item.details,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        total: Number(item.total),
      })),
      subtotal: Number(quote.subtotal),
      taxRate: quote.taxRate ? Number(quote.taxRate) : null,
      taxAmount: quote.taxAmount ? Number(quote.taxAmount) : null,
      total: Number(quote.total),
      currency: quote.currency,
      notes: quote.notes,
      terms: quote.terms,
    });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${quote.quoteNumber}.pdf"`,
        "Cache-Control": "private, no-cache",
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
