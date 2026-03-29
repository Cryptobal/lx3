"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { EmailStatus } from "@/lib/generated/prisma/client";

export async function getEmailLogs(params: {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  if (!prisma) throw new Error("Database not available");

  const { search, status, page = 1, pageSize = 20 } = params;

  try {
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { to: { contains: search, mode: "insensitive" } },
        { subject: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status) {
      where.status = status;
    }

    const [data, total] = await Promise.all([
      prisma.emailLog.findMany({
        where,
        include: {
          contact: true,
          sentBy: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.emailLog.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  } catch (error) {
    console.error("Failed to get email logs:", error);
    throw new Error("Failed to get email logs");
  }
}

export async function createEmailLog(data: {
  to: string;
  subject: string;
  body?: string;
  status?: EmailStatus;
  resendId?: string;
  contactId?: string;
  sentById?: string;
}) {
  if (!prisma) throw new Error("Database not available");

  try {
    const emailLog = await prisma.emailLog.create({
      data: {
        to: data.to,
        subject: data.subject,
        body: data.body,
        status: data.status ?? "QUEUED",
        resendId: data.resendId,
        contactId: data.contactId,
        sentById: data.sentById,
      },
    });

    revalidatePath("/growth-os/emails");
    return emailLog;
  } catch (error) {
    console.error("Failed to create email log:", error);
    throw new Error("Failed to create email log");
  }
}
