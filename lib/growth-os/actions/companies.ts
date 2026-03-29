"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getCompanies(params: {
  search?: string;
  page?: number;
  pageSize?: number;
}) {
  if (!prisma) throw new Error("Database not available");

  const { search, page = 1, pageSize = 20 } = params;

  try {
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { domain: { contains: search, mode: "insensitive" } },
        { industry: { contains: search, mode: "insensitive" } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.company.findMany({
        where,
        include: {
          _count: {
            select: {
              contacts: true,
              deals: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.company.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  } catch (error) {
    console.error("Failed to get companies:", error);
    throw new Error("Failed to get companies");
  }
}

export async function getCompany(id: string) {
  if (!prisma) throw new Error("Database not available");

  try {
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        contacts: true,
        deals: { include: { stage: true } },
      },
    });

    if (!company) throw new Error("Company not found");

    return company;
  } catch (error) {
    console.error("Failed to get company:", error);
    throw new Error("Failed to get company");
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
  phone?: string;
  description?: string;
  tags?: string[];
}) {
  if (!prisma) throw new Error("Database not available");

  try {
    const company = await prisma.company.create({
      data: {
        name: data.name,
        domain: data.domain,
        industry: data.industry,
        size: data.size,
        country: data.country,
        city: data.city,
        website: data.website,
        linkedinUrl: data.linkedinUrl,
        phone: data.phone,
        description: data.description,
        tags: data.tags ?? [],
      },
    });

    revalidatePath("/growth-os/companies");
    return company;
  } catch (error) {
    console.error("Failed to create company:", error);
    throw new Error("Failed to create company");
  }
}

export async function updateCompany(
  id: string,
  data: {
    name?: string;
    domain?: string;
    industry?: string;
    size?: string;
    country?: string;
    city?: string;
    website?: string;
    linkedinUrl?: string;
    phone?: string;
    description?: string;
    tags?: string[];
  }
) {
  if (!prisma) throw new Error("Database not available");

  try {
    const company = await prisma.company.update({
      where: { id },
      data,
    });

    revalidatePath("/growth-os/companies");
    revalidatePath(`/growth-os/companies/${id}`);
    return company;
  } catch (error) {
    console.error("Failed to update company:", error);
    throw new Error("Failed to update company");
  }
}

export async function deleteCompany(id: string) {
  if (!prisma) throw new Error("Database not available");

  try {
    await prisma.company.delete({ where: { id } });

    revalidatePath("/growth-os/companies");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete company:", error);
    throw new Error("Failed to delete company");
  }
}
