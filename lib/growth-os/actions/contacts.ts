"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

type ActionResult<T = unknown> = { success: true; data: T } | { success: false; error: string };

export async function getContacts(params?: {
  search?: string;
  source?: string;
  page?: number;
  pageSize?: number;
}) {
  if (!prisma) return { data: [], total: 0 };

  try {
    const { search, source, page = 1, pageSize = 20 } = params ?? {};
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { company: { name: { contains: search, mode: "insensitive" } } },
      ];
    }
    if (source) where.source = source;

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

    return { data: JSON.parse(JSON.stringify(data)), total };
  } catch (error) {
    console.error("getContacts error:", error);
    return { data: [], total: 0 };
  }
}

export async function getContact(id: string): Promise<ActionResult> {
  if (!prisma) return { success: false, error: "Database not available" };

  try {
    const contact = await prisma.contact.findUnique({
      where: { id },
      include: {
        company: true,
        deals: { include: { stage: true } },
        quotes: true,
        activities: { orderBy: { createdAt: "desc" } },
        visitorSessions: { include: { pageViews: true } },
      },
    });

    if (!contact) return { success: false, error: "Contact not found" };
    return { success: true, data: JSON.parse(JSON.stringify(contact)) };
  } catch (error) {
    console.error("getContact error:", error);
    return { success: false, error: "Failed to fetch contact" };
  }
}

export async function createContact(data: {
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  position?: string;
  companyId?: string;
  source?: string;
  tags?: string[];
  notes?: string;
}): Promise<ActionResult> {
  if (!prisma) return { success: false, error: "Database not available" };

  try {
    const contact = await prisma.contact.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email || undefined,
        phone: data.phone,
        position: data.position,
        companyId: data.companyId || undefined,
        source: (data.source as any) || "MANUAL",
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

    revalidatePath("/admin/contacts");
    return { success: true, data: JSON.parse(JSON.stringify(contact)) };
  } catch (error) {
    console.error("createContact error:", error);
    return { success: false, error: "Failed to create contact" };
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
    avatarUrl?: string;
    companyId?: string | null;
    source?: string;
    tags?: string[];
    notes?: string;
  }
): Promise<ActionResult> {
  if (!prisma) return { success: false, error: "Database not available" };

  try {
    const contact = await prisma.contact.update({
      where: { id },
      data: {
        ...data,
        source: data.source ? (data.source as any) : undefined,
        email: data.email || undefined,
      },
    });

    revalidatePath("/admin/contacts");
    revalidatePath(`/admin/contacts/${id}`);
    return { success: true, data: JSON.parse(JSON.stringify(contact)) };
  } catch (error) {
    console.error("updateContact error:", error);
    return { success: false, error: "Failed to update contact" };
  }
}

export async function deleteContact(id: string): Promise<ActionResult> {
  if (!prisma) return { success: false, error: "Database not available" };

  try {
    await prisma.contact.delete({ where: { id } });
    revalidatePath("/admin/contacts");
    return { success: true, data: null };
  } catch (error) {
    console.error("deleteContact error:", error);
    return { success: false, error: "Failed to delete contact" };
  }
}
