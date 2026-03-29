"use server";

import { prisma } from "@/lib/db";

export async function getDashboardStats() {
  if (!prisma) return { data: { totalContacts: 0, activeDeals: 0, pipelineValue: 0, pendingQuotes: 0 } };

  try {
    const [totalContacts, activeDeals, pendingQuotes, pipelineAgg] = await Promise.all([
      prisma.contact.count(),
      prisma.deal.count({
        where: { stage: { isWon: false, isLost: false } },
      }),
      prisma.quote.count({
        where: { status: { in: ["DRAFT", "SENT", "VIEWED"] } },
      }),
      prisma.deal.aggregate({
        where: { stage: { isWon: false, isLost: false } },
        _sum: { value: true },
      }),
    ]);

    const pipelineValue = pipelineAgg._sum.value ? Number(pipelineAgg._sum.value) : 0;

    return {
      data: { totalContacts, activeDeals, pipelineValue, pendingQuotes },
    };
  } catch (error) {
    console.error("getDashboardStats error:", error);
    return { data: { totalContacts: 0, activeDeals: 0, pipelineValue: 0, pendingQuotes: 0 } };
  }
}

export async function getRecentActivities(limit = 20) {
  if (!prisma) return { data: [] };

  try {
    const activities = await prisma.activity.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        user: { select: { id: true, name: true, image: true } },
        contact: { select: { id: true, firstName: true, lastName: true } },
        deal: { select: { id: true, title: true } },
      },
    });

    return { data: JSON.parse(JSON.stringify(activities)) };
  } catch (error) {
    console.error("getRecentActivities error:", error);
    return { data: [] };
  }
}

export async function getPipelineSummary() {
  if (!prisma) return { data: [] };

  try {
    const stages = await prisma.pipelineStage.findMany({
      orderBy: { order: "asc" },
      include: {
        deals: { select: { value: true } },
      },
    });

    const summary = stages.map((stage) => ({
      id: stage.id,
      name: stage.name,
      color: stage.color ?? "#6B7280",
      order: stage.order,
      isWon: stage.isWon,
      isLost: stage.isLost,
      count: stage.deals.length,
      totalValue: stage.deals.reduce(
        (sum, d) => sum + (d.value ? Number(d.value) : 0),
        0
      ),
    }));

    return { data: summary };
  } catch (error) {
    console.error("getPipelineSummary error:", error);
    return { data: [] };
  }
}

export async function getLeadSourceBreakdown() {
  if (!prisma) return { data: [] };

  try {
    const result = await prisma.contact.groupBy({
      by: ["source"],
      _count: { source: true },
      orderBy: { _count: { source: "desc" } },
    });

    const sourceColors: Record<string, string> = {
      MANUAL: "#6B7280",
      WEBSITE_FORM: "#3B82F6",
      COTIZADOR: "#10B981",
      CHATBOT: "#8B5CF6",
      APOLLO: "#F59E0B",
      IMPORT: "#EC4899",
      REFERRAL: "#14B8A6",
    };

    const data = result.map((r) => ({
      source: r.source,
      count: r._count.source,
      color: sourceColors[r.source] ?? "#6B7280",
    }));

    return { data };
  } catch (error) {
    console.error("getLeadSourceBreakdown error:", error);
    return { data: [] };
  }
}
