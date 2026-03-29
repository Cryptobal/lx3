"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

type ActionResult<T = unknown> = { success: true; data: T } | { success: false; error: string };

export async function getVisitorSessions(params?: {
  search?: string;
  contactId?: string;
  page?: number;
  pageSize?: number;
}) {
  if (!prisma) return { data: [], total: 0 };

  try {
    const { search, contactId, page = 1, pageSize = 20 } = params ?? {};
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { visitorId: { contains: search, mode: "insensitive" } },
        { resolvedCompany: { contains: search, mode: "insensitive" } },
        { resolvedDomain: { contains: search, mode: "insensitive" } },
        { contact: { firstName: { contains: search, mode: "insensitive" } } },
        { contact: { email: { contains: search, mode: "insensitive" } } },
      ];
    }
    if (contactId) where.contactId = contactId;

    const [data, total] = await Promise.all([
      prisma.visitorSession.findMany({
        where,
        include: {
          _count: { select: { pageViews: true } },
          contact: { select: { id: true, firstName: true, lastName: true, email: true } },
        },
        orderBy: { lastActivityAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.visitorSession.count({ where }),
    ]);

    return { data: JSON.parse(JSON.stringify(data)), total };
  } catch (error) {
    console.error("getVisitorSessions error:", error);
    return { data: [], total: 0 };
  }
}

export async function getVisitorSession(id: string): Promise<ActionResult> {
  if (!prisma) return { success: false, error: "Database not available" };

  try {
    const session = await prisma.visitorSession.findUnique({
      where: { id },
      include: {
        pageViews: { orderBy: { viewedAt: "asc" } },
        contact: true,
      },
    });

    if (!session) return { success: false, error: "Session not found" };
    return { success: true, data: JSON.parse(JSON.stringify(session)) };
  } catch (error) {
    console.error("getVisitorSession error:", error);
    return { success: false, error: "Failed to fetch session" };
  }
}

export async function recordTrackingEvent(data: {
  visitorId: string;
  path: string;
  title?: string;
  duration?: number;
  scrollDepth?: number;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  country?: string;
  city?: string;
  deviceType?: string;
}): Promise<ActionResult> {
  if (!prisma) return { success: false, error: "Database not available" };

  try {
    // Find or create session for this visitor (active in last 30 minutes)
    const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000);

    let session = await prisma.visitorSession.findFirst({
      where: {
        visitorId: data.visitorId,
        lastActivityAt: { gte: thirtyMinAgo },
      },
      orderBy: { lastActivityAt: "desc" },
    });

    if (session) {
      session = await prisma.visitorSession.update({
        where: { id: session.id },
        data: { lastActivityAt: new Date() },
      });
    } else {
      session = await prisma.visitorSession.create({
        data: {
          visitorId: data.visitorId,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          referrer: data.referrer,
          utmSource: data.utmSource,
          utmMedium: data.utmMedium,
          utmCampaign: data.utmCampaign,
          utmTerm: data.utmTerm,
          utmContent: data.utmContent,
          country: data.country,
          city: data.city,
          deviceType: data.deviceType,
        },
      });
    }

    await prisma.pageView.create({
      data: {
        sessionId: session.id,
        path: data.path,
        title: data.title,
        duration: data.duration,
        scrollDepth: data.scrollDepth,
      },
    });

    return { success: true, data: { sessionId: session.id } };
  } catch (error) {
    console.error("recordTrackingEvent error:", error);
    return { success: false, error: "Failed to record tracking event" };
  }
}

export async function linkVisitorToContact(
  visitorId: string,
  contactId: string
): Promise<ActionResult> {
  if (!prisma) return { success: false, error: "Database not available" };

  try {
    const contact = await prisma.contact.findUnique({ where: { id: contactId } });
    if (!contact) return { success: false, error: "Contact not found" };

    const result = await prisma.visitorSession.updateMany({
      where: { visitorId },
      data: { contactId },
    });

    revalidatePath(`/admin/contacts/${contactId}`);
    return { success: true, data: { updatedSessions: result.count } };
  } catch (error) {
    console.error("linkVisitorToContact error:", error);
    return { success: false, error: "Failed to link visitor to contact" };
  }
}
