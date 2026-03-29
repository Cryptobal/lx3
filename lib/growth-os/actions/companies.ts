"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

type ActionResult<T = unknown> = { success: true; data: T } | { success: false; error: string };

export async function getCompanies(params?: {
  search?: string;
  industry?: string;
  page?: number;
  pageSize?: number;
}) {
  if (!prisma) return { data: [], total: 0 };

  try {
    const { search, industry, page = 1, pageSize = 20 } = params ?? {};
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { domain: { contains: search, mode: "insensitive" } },
        { industry: { contains: search, mode: "insensitive" } },
      ];
    }
    if (industry) where.industry = industry;

    const [data, total] = await Promise.all([
      prisma.company.findMany({
        where,
        include: { _count: { select: { contacts: true, deals: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.company.count({ where }),
    ]);

    return { data: JSON.parse(JSON.stringify(data)), total };
  } catch (error) {
    console.error("getCompanies error:", error);
    return { data: [], total: 0 };
  }
}

export async function getCompany(id: string): Promise<ActionResult> {
  if (!prisma) return { success: false, error: "Database not available" };

  try {
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        contacts: true,
        deals: { include: { stage: true, contact: true } },
      },
    });

    if (!company) return { success: false, error: "Company not found" };
    return { success: true, data: JSON.parse(JSON.stringify(company)) };
  } catch (error) {
    console.error("getCompany error:", error);
    return { success: false, error: "Failed to fetch company" };
  }
}

export async function createCompany(data: {
  name: string;
  domain?: string;
  industry?: string;
  size?: string;
  country?: string;
  city?: string;
  website?: string;
  linkedinUrl?: string;
  logoUrl?: string;
  phone?: string;
  description?: string;
  tags?: string[];
}): Promise<ActionResult> {
  if (!prisma) return { success: false, error: "Database not available" };

  try {
    const company = await prisma.company.create({
      data: {
        name: data.name,
        domain: data.domain || undefined,
        industry: data.industry,
        size: data.size,
        country: data.country,
        city: data.city,
        website: data.website,
        linkedinUrl: data.linkedinUrl,
        logoUrl: data.logoUrl,
        phone: data.phone,
        description: data.description,
        tags: data.tags ?? [],
      },
    });

    revalidatePath("/admin/companies");
    return { success: true, data: JSON.parse(JSON.stringify(company)) };
  } catch (error) {
    console.error("createCompany error:", error);
    return { success: false, error: "Failed to create company" };
  }
}

export async function updateCompany(
  id: string,
  data: {
    name?: string;
    domain?: string | null;
    industry?: string;
    size?: string;
    country?: string;
    city?: string;
    website?: string;
    linkedinUrl?: string;
    logoUrl?: string;
    phone?: string;
    description?: string;
    tags?: string[];
  }
): Promise<ActionResult> {
  if (!prisma) return { success: false, error: "Database not available" };

  try {
    const company = await prisma.company.update({
      where: { id },
      data: {
        ...data,
        domain: data.domain || undefined,
      },
    });

    revalidatePath("/admin/companies");
    revalidatePath(`/admin/companies/${id}`);
    return { success: true, data: JSON.parse(JSON.stringify(company)) };
  } catch (error) {
    console.error("updateCompany error:", error);
    return { success: false, error: "Failed to update company" };
  }
}

export async function deleteCompany(id: string): Promise<ActionResult> {
  if (!prisma) return { success: false, error: "Database not available" };

  try {
    await prisma.company.delete({ where: { id } });
    revalidatePath("/admin/companies");
    return { success: true, data: null };
  } catch (error) {
    console.error("deleteCompany error:", error);
    return { success: false, error: "Failed to delete company" };
  }
}
