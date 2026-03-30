"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

type ActionResult<T = unknown> = { success: true; data: T } | { success: false; error: string };

export async function getEmailLogs(params?: {
  search?: string;
  status?: string;
  contactId?: string;
  page?: number;
  pageSize?: number;
}) {
  if (!prisma) return { data: [], total: 0 };

  try {
    const { search, status, contactId, page = 1, pageSize = 20 } = params ?? {};
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { to: { contains: search, mode: "insensitive" } },
        { subject: { contains: search, mode: "insensitive" } },
      ];
    }
    if (status) where.status = status;
    if (contactId) where.contactId = contactId;

    const [data, total] = await Promise.all([
      prisma.emailLog.findMany({
        where,
        include: {
          contact: { select: { id: true, firstName: true, lastName: true, email: true } },
          sentBy: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.emailLog.count({ where }),
    ]);

    return { data: JSON.parse(JSON.stringify(data)), total };
  } catch (error) {
    console.error("getEmailLogs error:", error);
    return { data: [], total: 0 };
  }
}

export async function createEmailLog(data: {
  to: string;
  subject: string;
  body?: string;
  status?: string;
  resendId?: string;
  contactId?: string;
  sentById?: string;
}): Promise<ActionResult> {
  if (!prisma) return { success: false, error: "Database not available" };

  try {
    const log = await prisma.emailLog.create({
      data: {
        to: data.to,
        subject: data.subject,
        body: data.body,
        status: (data.status as any) || "QUEUED",
        resendId: data.resendId,
        contactId: data.contactId || undefined,
        sentById: data.sentById || undefined,
      },
    });

    revalidatePath("/admin/emails");
    return { success: true, data: JSON.parse(JSON.stringify(log)) };
  } catch (error) {
    console.error("createEmailLog error:", error);
    return { success: false, error: "Failed to create email log" };
  }
}

// ---------------------------------------------------------------------------
// Gmail email queries
// ---------------------------------------------------------------------------

export async function getGmailEmails(params?: {
  search?: string;
  direction?: string;
  contactId?: string;
  page?: number;
  pageSize?: number;
}) {
  if (!prisma) return { data: [], total: 0, page: 1, pageSize: 20, totalPages: 0 };

  try {
    const { search, direction, contactId, page = 1, pageSize = 20 } = params ?? {};
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { from: { contains: search, mode: "insensitive" } },
        { subject: { contains: search, mode: "insensitive" } },
        { snippet: { contains: search, mode: "insensitive" } },
      ];
    }
    if (direction) where.direction = direction;
    if (contactId) where.contactId = contactId;

    const [data, total] = await Promise.all([
      prisma.gmailEmail.findMany({
        where,
        include: {
          contact: { select: { id: true, firstName: true, lastName: true, email: true } },
        },
        orderBy: { receivedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.gmailEmail.count({ where }),
    ]);

    return {
      data: JSON.parse(JSON.stringify(data)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  } catch (error) {
    console.error("getGmailEmails error:", error);
    return { data: [], total: 0, page: 1, pageSize: 20, totalPages: 0 };
  }
}

export async function getContactEmails(contactId: string) {
  if (!prisma) return { sent: [], gmail: [] };

  try {
    const [sent, gmail] = await Promise.all([
      prisma.emailLog.findMany({
        where: { contactId },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      prisma.gmailEmail.findMany({
        where: { contactId },
        orderBy: { receivedAt: "desc" },
        take: 50,
      }),
    ]);

    return {
      sent: JSON.parse(JSON.stringify(sent)),
      gmail: JSON.parse(JSON.stringify(gmail)),
    };
  } catch (error) {
    console.error("getContactEmails error:", error);
    return { sent: [], gmail: [] };
  }
}

export async function getGmailSyncStatus(userId: string) {
  if (!prisma) return null;

  try {
    const syncState = await prisma.gmailSyncState.findUnique({
      where: { userId },
    });

    if (!syncState) return null;

    const emailCount = await prisma.gmailEmail.count();

    return {
      connected: true,
      emailAddress: syncState.emailAddress,
      lastSyncAt: syncState.lastSyncAt.toISOString(),
      totalEmails: emailCount,
    };
  } catch {
    return null;
  }
}
