"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { ContactSource } from "@/lib/generated/prisma/client";

export async function getContacts(params: {
  search?: string;
  source?: string;
  tag?: string;
  companyId?: string;
  page?: number;
  pageSize?: number;
}) {
  if (!prisma) throw new Error("Database not available");

  const { search, source, tag, companyId, page = 1, pageSize = 20 } = params;

  try {
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    if (source) {
      where.source = source;
    }

    if (tag) {
      where.tags = { has: tag };
    }

    if (companyId) {
      where.companyId = companyId;
    }

    const [data, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        include: { company: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.contact.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  } catch (error) {
    console.error("Failed to get contacts:", error);
    throw new Error("Failed to get contacts");
  }
}

export async function getContact(id: string) {
  if (!prisma) throw new Error("Database not available");

  try {
    const contact = await prisma.contact.findUnique({
      where: { id },
      include: {
        company: true,
        deals: { include: { stage: true } },
        activities: { orderBy: { createdAt: "desc" } },
        quotes: true,
        visitorSessions: {
          include: { pageViews: true },
          orderBy: { startedAt: "desc" },
        },
      },
    });

    if (!contact) throw new Error("Contact not found");

    return contact;
  } catch (error) {
    console.error("Failed to get contact:", error);
    throw new Error("Failed to get contact");
  }
}

export async function createContact(data: {
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  position?: string;
  linkedinUrl?: string;
  companyId?: string;
  source?: ContactSource;
  tags?: string[];
  notes?: string;
}) {
  if (!prisma) throw new Error("Database not available");

  try {
    const contact = await prisma.contact.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        position: data.position,
        linkedinUrl: data.linkedinUrl,
        companyId: data.companyId,
        source: data.source ?? "MANUAL",
        tags: data.tags ?? [],
        notes: data.notes,
      },
    });

    await prisma.activity.create({
      data: {
        type: "CONTACT_CREATED",
        title: `Contact created: ${data.firstName} ${data.lastName ?? ""}`.trim(),
        contactId: contact.id,
      },
    });

    revalidatePath("/growth-os/contacts");
    return contact;
  } catch (error) {
    console.error("Failed to create contact:", error);
    throw new Error("Failed to create contact");
  }
}

export async function updateContact(
  id: string,
  data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    position?: string;
    linkedinUrl?: string;
    companyId?: string | null;
    source?: ContactSource;
    tags?: string[];
    notes?: string;
  }
) {
  if (!prisma) throw new Error("Database not available");

  try {
    const contact = await prisma.contact.update({
      where: { id },
      data,
    });

    revalidatePath("/growth-os/contacts");
    revalidatePath(`/growth-os/contacts/${id}`);
    return contact;
  } catch (error) {
    console.error("Failed to update contact:", error);
    throw new Error("Failed to update contact");
  }
}

export async function deleteContact(id: string) {
  if (!prisma) throw new Error("Database not available");

  try {
    await prisma.contact.delete({ where: { id } });

    revalidatePath("/growth-os/contacts");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete contact:", error);
    throw new Error("Failed to delete contact");
  }
}
