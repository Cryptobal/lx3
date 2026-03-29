import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json({ error: "DB not available" }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { type } = body;

    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      null;
    const country = request.headers.get("x-vercel-ip-country") || null;
    const city = request.headers.get("x-vercel-ip-city") || null;

    if (type === "pageview") {
      const {
        visitorId,
        path,
        title,
        referrer,
        utmSource,
        utmMedium,
        utmCampaign,
        utmTerm,
        utmContent,
        deviceType,
      } = body;

      if (!visitorId || !path) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }

      // Find or create session (sessions expire after 30 min of inactivity)
      const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000);
      let session = await prisma.visitorSession.findFirst({
        where: {
          visitorId,
          lastActivityAt: { gte: thirtyMinAgo },
        },
        orderBy: { lastActivityAt: "desc" },
      });

      if (!session) {
        session = await prisma.visitorSession.create({
          data: {
            visitorId,
            ipAddress,
            userAgent: request.headers.get("user-agent"),
            referrer,
            utmSource,
            utmMedium,
            utmCampaign,
            utmTerm,
            utmContent,
            country,
            city,
            deviceType,
          },
        });
      } else {
        await prisma.visitorSession.update({
          where: { id: session.id },
          data: { lastActivityAt: new Date() },
        });
      }

      const pageView = await prisma.pageView.create({
        data: {
          path,
          title,
          sessionId: session.id,
        },
      });

      return NextResponse.json({ ok: true, pageViewId: pageView.id, sessionId: session.id });
    }

    if (type === "engagement") {
      const { pageViewId, duration, scrollDepth } = body;

      if (pageViewId) {
        await prisma.pageView.update({
          where: { id: pageViewId },
          data: {
            duration: duration || undefined,
            scrollDepth: scrollDepth || undefined,
          },
        });
      }

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Unknown event type" }, { status: 400 });
  } catch (error) {
    console.error("Tracking error:", error);
    return NextResponse.json({ ok: true }); // Never fail tracking
  }
}
