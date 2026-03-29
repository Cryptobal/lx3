import { prisma } from "@/lib/db";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TrackingEventData {
  visitorId: string;
  path: string;
  title?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  userAgent?: string;
  screenWidth?: number;
  ip?: string;
  country?: string;
  city?: string;
  duration?: number;
  scrollDepth?: number;
}

// ---------------------------------------------------------------------------
// Main tracking handler
// ---------------------------------------------------------------------------

export async function processTrackingEvent(data: TrackingEventData) {
  if (!prisma) return { type: "no_db" };

  const deviceType = data.userAgent ? resolveDeviceType(data.userAgent) : "desktop";

  // Find or create visitor session (one session per visitorId per day)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let session = await prisma.visitorSession.findFirst({
    where: {
      visitorId: data.visitorId,
      startedAt: { gte: today },
    },
    orderBy: { startedAt: "desc" },
  });

  if (!session) {
    session = await prisma.visitorSession.create({
      data: {
        visitorId: data.visitorId,
        deviceType,
        userAgent: data.userAgent ?? null,
        ipAddress: data.ip ?? null,
        country: data.country ?? null,
        city: data.city ?? null,
        referrer: data.referrer ?? null,
        utmSource: data.utmSource ?? null,
        utmMedium: data.utmMedium ?? null,
        utmCampaign: data.utmCampaign ?? null,
        utmTerm: data.utmTerm ?? null,
        utmContent: data.utmContent ?? null,
        startedAt: new Date(),
      },
    });
  }

  // If this is an exit event, update the most recent page view with duration/scroll
  if (data.duration !== undefined || data.scrollDepth !== undefined) {
    const lastPageView = await prisma.pageView.findFirst({
      where: {
        sessionId: session.id,
        path: data.path,
      },
      orderBy: { viewedAt: "desc" },
    });

    if (lastPageView) {
      await prisma.pageView.update({
        where: { id: lastPageView.id },
        data: {
          ...(data.duration !== undefined && { duration: data.duration }),
          ...(data.scrollDepth !== undefined && { scrollDepth: data.scrollDepth }),
        },
      });
    }

    // Update session last activity
    await prisma.visitorSession.update({
      where: { id: session.id },
      data: { lastActivityAt: new Date() },
    });

    return { sessionId: session.id, type: "exit_update" };
  }

  // Create page view
  const pageView = await prisma.pageView.create({
    data: {
      sessionId: session.id,
      path: data.path,
      title: data.title ?? null,
      viewedAt: new Date(),
    },
  });

  // Update session last activity
  await prisma.visitorSession.update({
    where: { id: session.id },
    data: { lastActivityAt: new Date() },
  });

  return { sessionId: session.id, pageViewId: pageView.id, type: "page_view" };
}

// ---------------------------------------------------------------------------
// Device type resolution
// ---------------------------------------------------------------------------

export function resolveDeviceType(userAgent: string): "mobile" | "desktop" | "tablet" {
  const ua = userAgent.toLowerCase();

  if (/ipad|tablet|playbook|silk/.test(ua)) return "tablet";
  if (/android(?!.*mobile)/.test(ua)) return "tablet";
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile|wpdesktop/.test(ua)) return "mobile";

  return "desktop";
}

// ---------------------------------------------------------------------------
// Link visitor sessions to a known contact
// ---------------------------------------------------------------------------

export async function linkVisitorSessions(visitorId: string, contactId: string) {
  if (!prisma) return { updated: 0 };

  const result = await prisma.visitorSession.updateMany({
    where: { visitorId },
    data: { contactId },
  });

  return { updated: result.count };
}
