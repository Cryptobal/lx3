import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  if (!prisma) {
    return NextResponse.json({ error: "DB not available" }, { status: 500 });
  }

  try {
    const { token } = await params;

    const quote = await prisma.quote.findUnique({
      where: { trackingToken: token },
    });

    if (!quote) {
      return new NextResponse(null, { status: 404 });
    }

    // Record view
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;

    await prisma.quoteViewLog.create({
      data: {
        quoteId: quote.id,
        ipAddress,
        userAgent: request.headers.get("user-agent"),
      },
    });

    await prisma.quote.update({
      where: { id: quote.id },
      data: {
        viewCount: { increment: 1 },
        lastViewedAt: new Date(),
        status: quote.status === "SENT" ? "VIEWED" : undefined,
      },
    });

    // Record activity
    await prisma.activity.create({
      data: {
        type: "QUOTE_VIEWED",
        title: `Cotización ${quote.quoteNumber} vista`,
        contactId: quote.contactId,
        dealId: quote.dealId,
        metadata: { quoteId: quote.id, ipAddress },
      },
    });

    // Return 1x1 transparent pixel
    const pixel = Buffer.from(
      "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
      "base64"
    );

    return new NextResponse(pixel, {
      headers: {
        "Content-Type": "image/gif",
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Quote tracking error:", error);
    return new NextResponse(null, { status: 200 });
  }
}
