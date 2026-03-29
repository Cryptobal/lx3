"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

type ActionResult<T = unknown> = { success: true; data: T } | { success: false; error: string };

async function generateQuoteNumber(): Promise<string> {
  if (!prisma) throw new Error("Database not available");

  const year = new Date().getFullYear();
  const prefix = `LX3-${year}-`;

  const lastQuote = await prisma.quote.findFirst({
    where: { quoteNumber: { startsWith: prefix } },
    orderBy: { quoteNumber: "desc" },
  });

  let nextNum = 1;
  if (lastQuote) {
    const lastNum = parseInt(lastQuote.quoteNumber.replace(prefix, ""), 10);
    if (!isNaN(lastNum)) nextNum = lastNum + 1;
  }

  return `${prefix}${String(nextNum).padStart(3, "0")}`;
}

export async function getQuotes(params?: {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  if (!prisma) return { data: [], total: 0 };

  try {
    const { search, status, page = 1, pageSize = 20 } = params ?? {};
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { quoteNumber: { contains: search, mode: "insensitive" } },
        { title: { contains: search, mode: "insensitive" } },
        { contact: { firstName: { contains: search, mode: "insensitive" } } },
        { contact: { lastName: { contains: search, mode: "insensitive" } } },
      ];
    }
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      prisma.quote.findMany({
        where,
        include: { contact: true, deal: true, createdBy: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.quote.count({ where }),
    ]);

    return { data: JSON.parse(JSON.stringify(data)), total };
  } catch (error) {
    console.error("getQuotes error:", error);
    return { data: [], total: 0 };
  }
}

export async function getQuote(id: string): Promise<ActionResult> {
  if (!prisma) return { success: false, error: "Database not available" };

  try {
    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        items: { orderBy: { order: "asc" } },
        contact: true,
        deal: true,
        viewLogs: { orderBy: { viewedAt: "desc" } },
        createdBy: true,
      },
    });

    if (!quote) return { success: false, error: "Quote not found" };
    return { success: true, data: JSON.parse(JSON.stringify(quote)) };
  } catch (error) {
    console.error("getQuote error:", error);
    return { success: false, error: "Failed to fetch quote" };
  }
}

export async function getQuoteByToken(token: string): Promise<ActionResult> {
  if (!prisma) return { success: false, error: "Database not available" };

  try {
    const quote = await prisma.quote.findUnique({
      where: { trackingToken: token },
      include: {
        items: { orderBy: { order: "asc" } },
        contact: { select: { firstName: true, lastName: true, email: true, company: { select: { name: true } } } },
      },
    });

    if (!quote) return { success: false, error: "Quote not found" };
    return { success: true, data: JSON.parse(JSON.stringify(quote)) };
  } catch (error) {
    console.error("getQuoteByToken error:", error);
    return { success: false, error: "Failed to fetch quote" };
  }
}

export async function createQuote(data: {
  title: string;
  description?: string;
  subtotal: number;
  taxRate?: number;
  taxAmount?: number;
  total: number;
  currency?: string;
  validUntil?: string;
  notes?: string;
  terms?: string;
  dealId?: string;
  contactId?: string;
  createdById?: string;
  items: {
    description: string;
    details?: string;
    quantity: number;
    unitPrice: number;
    total: number;
    order: number;
  }[];
}): Promise<ActionResult> {
  if (!prisma) return { success: false, error: "Database not available" };

  try {
    const quoteNumber = await generateQuoteNumber();
    const trackingToken = crypto.randomUUID();

    const quote = await prisma.quote.create({
      data: {
        quoteNumber,
        title: data.title,
        description: data.description,
        subtotal: data.subtotal,
        taxRate: data.taxRate,
        taxAmount: data.taxAmount,
        total: data.total,
        currency: data.currency ?? "CLP",
        validUntil: data.validUntil ? new Date(data.validUntil) : undefined,
        notes: data.notes,
        terms: data.terms,
        trackingToken,
        dealId: data.dealId || undefined,
        contactId: data.contactId || undefined,
        createdById: data.createdById || undefined,
        items: {
          create: data.items.map((item) => ({
            description: item.description,
            details: item.details,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total,
            order: item.order,
          })),
        },
      },
      include: { items: true },
    });

    revalidatePath("/admin/quotes");
    return { success: true, data: JSON.parse(JSON.stringify(quote)) };
  } catch (error) {
    console.error("createQuote error:", error);
    return { success: false, error: "Failed to create quote" };
  }
}

export async function updateQuote(
  id: string,
  data: {
    title?: string;
    description?: string;
    subtotal?: number;
    taxRate?: number;
    taxAmount?: number;
    total?: number;
    currency?: string;
    status?: string;
    validUntil?: string | null;
    notes?: string;
    terms?: string;
    dealId?: string | null;
    contactId?: string | null;
    items?: {
      id?: string;
      description: string;
      details?: string;
      quantity: number;
      unitPrice: number;
      total: number;
      order: number;
    }[];
  }
): Promise<ActionResult> {
  if (!prisma) return { success: false, error: "Database not available" };

  try {
    const { items, ...quoteData } = data;
    const updateData: Record<string, unknown> = { ...quoteData };

    if (data.validUntil !== undefined) {
      updateData.validUntil = data.validUntil ? new Date(data.validUntil) : null;
    }
    if (data.status) {
      updateData.status = data.status;
    }

    if (items) {
      await prisma.quoteItem.deleteMany({ where: { quoteId: id } });
      await prisma.quoteItem.createMany({
        data: items.map((item) => ({
          quoteId: id,
          description: item.description,
          details: item.details,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total,
          order: item.order,
        })),
      });
    }

    delete updateData.items;
    const quote = await prisma.quote.update({
      where: { id },
      data: updateData,
      include: { items: { orderBy: { order: "asc" } } },
    });

    revalidatePath("/admin/quotes");
    revalidatePath(`/admin/quotes/${id}`);
    return { success: true, data: JSON.parse(JSON.stringify(quote)) };
  } catch (error) {
    console.error("updateQuote error:", error);
    return { success: false, error: "Failed to update quote" };
  }
}

export async function deleteQuote(id: string): Promise<ActionResult> {
  if (!prisma) return { success: false, error: "Database not available" };

  try {
    await prisma.quote.delete({ where: { id } });
    revalidatePath("/admin/quotes");
    return { success: true, data: null };
  } catch (error) {
    console.error("deleteQuote error:", error);
    return { success: false, error: "Failed to delete quote" };
  }
}

export async function recordQuoteView(
  token: string,
  ip?: string,
  userAgent?: string
): Promise<ActionResult> {
  if (!prisma) return { success: false, error: "Database not available" };

  try {
    const quote = await prisma.quote.findUnique({
      where: { trackingToken: token },
    });
    if (!quote) return { success: false, error: "Quote not found" };

    await prisma.quoteViewLog.create({
      data: {
        quoteId: quote.id,
        ipAddress: ip,
        userAgent,
      },
    });

    const updateData: Record<string, unknown> = {
      viewCount: { increment: 1 },
      lastViewedAt: new Date(),
    };
    if (quote.status === "SENT") {
      updateData.status = "VIEWED";
    }

    await prisma.quote.update({ where: { id: quote.id }, data: updateData });

    await prisma.activity.create({
      data: {
        type: "QUOTE_VIEWED",
        title: `Quote ${quote.quoteNumber} viewed`,
        contactId: quote.contactId || undefined,
        dealId: quote.dealId || undefined,
        metadata: { ip, quoteNumber: quote.quoteNumber },
      },
    });

    return { success: true, data: null };
  } catch (error) {
    console.error("recordQuoteView error:", error);
    return { success: false, error: "Failed to record view" };
  }
}

export async function acceptQuote(token: string): Promise<ActionResult> {
  if (!prisma) return { success: false, error: "Database not available" };

  try {
    const quote = await prisma.quote.findUnique({
      where: { trackingToken: token },
    });
    if (!quote) return { success: false, error: "Quote not found" };

    await prisma.quote.update({
      where: { id: quote.id },
      data: { status: "ACCEPTED", acceptedAt: new Date() },
    });

    await prisma.activity.create({
      data: {
        type: "QUOTE_ACCEPTED",
        title: `Quote ${quote.quoteNumber} accepted`,
        contactId: quote.contactId || undefined,
        dealId: quote.dealId || undefined,
        metadata: { quoteNumber: quote.quoteNumber },
      },
    });

    revalidatePath("/admin/quotes");
    return { success: true, data: null };
  } catch (error) {
    console.error("acceptQuote error:", error);
    return { success: false, error: "Failed to accept quote" };
  }
}
