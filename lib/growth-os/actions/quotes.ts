"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { QuoteStatus } from "@/lib/generated/prisma/client";

export async function getQuotes(params: {
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
        { title: { contains: search, mode: "insensitive" } },
        { quoteNumber: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status) {
      where.status = status;
    }

    const [data, total] = await Promise.all([
      prisma.quote.findMany({
        where,
        include: {
          contact: true,
          deal: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.quote.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  } catch (error) {
    console.error("Failed to get quotes:", error);
    throw new Error("Failed to get quotes");
  }
}

export async function getQuote(id: string) {
  if (!prisma) throw new Error("Database not available");

  try {
    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        items: { orderBy: { order: "asc" } },
        contact: true,
        deal: true,
        createdBy: true,
        viewLogs: { orderBy: { viewedAt: "desc" } },
      },
    });

    if (!quote) throw new Error("Quote not found");

    return quote;
  } catch (error) {
    console.error("Failed to get quote:", error);
    throw new Error("Failed to get quote");
  }
}

export async function getNextQuoteNumber() {
  if (!prisma) throw new Error("Database not available");

  try {
    const year = new Date().getFullYear();
    const prefix = `LX3-${year}-`;
    const lastQuote = await prisma.quote.findFirst({
      where: { quoteNumber: { startsWith: prefix } },
      orderBy: { quoteNumber: "desc" },
    });
    const nextSeq = lastQuote
      ? parseInt(lastQuote.quoteNumber.split("-")[2]) + 1
      : 1;
    return `${prefix}${String(nextSeq).padStart(3, "0")}`;
  } catch (error) {
    console.error("Failed to get next quote number:", error);
    throw new Error("Failed to get next quote number");
  }
}

export async function createQuote(data: {
  title: string;
  description?: string;
  contactId?: string;
  dealId?: string;
  createdById?: string;
  items: Array<{
    description: string;
    details?: string;
    quantity: number;
    unitPrice: number;
    order: number;
  }>;
  notes?: string;
  terms?: string;
  validUntil?: Date | string;
  currency?: string;
  taxRate?: number;
}) {
  if (!prisma) throw new Error("Database not available");

  try {
    const quoteNumber = await getNextQuoteNumber();

    const subtotal = data.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    const taxRate = data.taxRate ?? 0;
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;

    const quote = await prisma.quote.create({
      data: {
        quoteNumber,
        title: data.title,
        description: data.description,
        contactId: data.contactId,
        dealId: data.dealId,
        createdById: data.createdById,
        subtotal: parseFloat(subtotal.toFixed(2)),
        taxRate: data.taxRate != null ? parseFloat(data.taxRate.toFixed(2)) : null,
        taxAmount: parseFloat(taxAmount.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
        currency: data.currency ?? "CLP",
        validUntil: data.validUntil ? new Date(data.validUntil) : undefined,
        notes: data.notes,
        terms: data.terms,
        items: {
          create: data.items.map((item) => ({
            description: item.description,
            details: item.details,
            quantity: parseFloat(item.quantity.toFixed(2)),
            unitPrice: parseFloat(item.unitPrice.toFixed(2)),
            total: parseFloat((item.quantity * item.unitPrice).toFixed(2)),
            order: item.order,
          })),
        },
      },
      include: {
        items: { orderBy: { order: "asc" } },
        contact: true,
        deal: true,
      },
    });

    revalidatePath("/growth-os/quotes");
    return quote;
  } catch (error) {
    console.error("Failed to create quote:", error);
    throw new Error("Failed to create quote");
  }
}

export async function updateQuote(
  id: string,
  data: {
    title?: string;
    description?: string;
    contactId?: string | null;
    dealId?: string | null;
    items?: Array<{
      description: string;
      details?: string;
      quantity: number;
      unitPrice: number;
      order: number;
    }>;
    notes?: string;
    terms?: string;
    validUntil?: Date | string | null;
    currency?: string;
    taxRate?: number;
  }
) {
  if (!prisma) throw new Error("Database not available");

  try {
    const updateData: Record<string, unknown> = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.contactId !== undefined) updateData.contactId = data.contactId;
    if (data.dealId !== undefined) updateData.dealId = data.dealId;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.terms !== undefined) updateData.terms = data.terms;
    if (data.currency !== undefined) updateData.currency = data.currency;
    if (data.validUntil !== undefined) {
      updateData.validUntil = data.validUntil
        ? new Date(data.validUntil)
        : null;
    }

    if (data.items !== undefined) {
      const subtotal = data.items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
      );
      const taxRate = data.taxRate ?? 0;
      const taxAmount = subtotal * (taxRate / 100);
      const total = subtotal + taxAmount;

      updateData.subtotal = parseFloat(subtotal.toFixed(2));
      updateData.taxAmount = parseFloat(taxAmount.toFixed(2));
      updateData.total = parseFloat(total.toFixed(2));

      if (data.taxRate != null) {
        updateData.taxRate = parseFloat(data.taxRate.toFixed(2));
      }

      // Delete existing items and recreate
      await prisma.quoteItem.deleteMany({ where: { quoteId: id } });

      updateData.items = {
        create: data.items.map((item) => ({
          description: item.description,
          details: item.details,
          quantity: parseFloat(item.quantity.toFixed(2)),
          unitPrice: parseFloat(item.unitPrice.toFixed(2)),
          total: parseFloat((item.quantity * item.unitPrice).toFixed(2)),
          order: item.order,
        })),
      };
    } else if (data.taxRate != null) {
      updateData.taxRate = parseFloat(data.taxRate.toFixed(2));
    }

    const quote = await prisma.quote.update({
      where: { id },
      data: updateData,
      include: {
        items: { orderBy: { order: "asc" } },
        contact: true,
        deal: true,
      },
    });

    revalidatePath("/growth-os/quotes");
    revalidatePath(`/growth-os/quotes/${id}`);
    return quote;
  } catch (error) {
    console.error("Failed to update quote:", error);
    throw new Error("Failed to update quote");
  }
}

export async function updateQuoteStatus(id: string, status: QuoteStatus) {
  if (!prisma) throw new Error("Database not available");

  try {
    const timestampData: Record<string, Date> = {};
    const now = new Date();

    if (status === "SENT") timestampData.sentAt = now;
    if (status === "ACCEPTED") timestampData.acceptedAt = now;
    if (status === "REJECTED") timestampData.rejectedAt = now;

    const quote = await prisma.quote.update({
      where: { id },
      data: {
        status,
        ...timestampData,
      },
    });

    revalidatePath("/growth-os/quotes");
    revalidatePath(`/growth-os/quotes/${id}`);
    return quote;
  } catch (error) {
    console.error("Failed to update quote status:", error);
    throw new Error("Failed to update quote status");
  }
}

export async function deleteQuote(id: string) {
  if (!prisma) throw new Error("Database not available");

  try {
    await prisma.quote.delete({ where: { id } });

    revalidatePath("/growth-os/quotes");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete quote:", error);
    throw new Error("Failed to delete quote");
  }
}
