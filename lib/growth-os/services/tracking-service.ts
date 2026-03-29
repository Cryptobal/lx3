import { prisma } from "@/lib/db";

export async function recordPageView(data: {
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
  ipAddress?: string;
  country?: string;
  city?: string;
  deviceType?: string;
}) {
  if (!prisma) throw new Error("Database not available");

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
    userAgent,
    ipAddress,
    country,
    city,
    deviceType,
  } = data;

  // Find an active session for this visitor (last activity within 30 minutes)
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

  let session = await prisma.visitorSession.findFirst({
    where: {
      visitorId,
      lastActivityAt: { gte: thirtyMinutesAgo },
    },
    orderBy: { lastActivityAt: "desc" },
  });

  if (!session) {
    session = await prisma.visitorSession.create({
      data: {
        visitorId,
        ipAddress,
        userAgent,
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
  }

  // Update session last activity
  await prisma.visitorSession.update({
    where: { id: session.id },
    data: { lastActivityAt: new Date() },
  });

  // Create the page view
  const pageView = await prisma.pageView.create({
    data: {
      path,
      title,
      sessionId: session.id,
    },
  });

  return { session, pageView };
}

export async function updatePageViewMetrics(
  sessionId: string,
  pageViewId: string,
  data: {
    duration?: number;
    scrollDepth?: number;
  }
) {
  if (!prisma) throw new Error("Database not available");

  const pageView = await prisma.pageView.findFirst({
    where: {
      id: pageViewId,
      sessionId,
    },
  });

  if (!pageView) {
    throw new Error("PageView not found for the given session");
  }

  const updatedPageView = await prisma.pageView.update({
    where: { id: pageViewId },
    data: {
      duration: data.duration ?? pageView.duration,
      scrollDepth: data.scrollDepth ?? pageView.scrollDepth,
    },
  });

  // Also update session last activity
  await prisma.visitorSession.update({
    where: { id: sessionId },
    data: { lastActivityAt: new Date() },
  });

  return updatedPageView;
}

export async function linkVisitorToContact(
  visitorId: string,
  contactId: string
) {
  if (!prisma) throw new Error("Database not available");

  // Verify the contact exists
  const contact = await prisma.contact.findUnique({
    where: { id: contactId },
  });

  if (!contact) {
    throw new Error(`Contact with id ${contactId} not found`);
  }

  // Link all sessions with this visitorId to the contact
  const result = await prisma.visitorSession.updateMany({
    where: { visitorId },
    data: { contactId },
  });

  return { linkedSessions: result.count };
}
