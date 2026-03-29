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
