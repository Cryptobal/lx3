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

export async function getConversionFunnel() {
  if (!prisma) return { data: [] };

  try {
    const stages = await prisma.pipelineStage.findMany({
      orderBy: { order: "asc" },
      select: {
        name: true,
        color: true,
        order: true,
        isWon: true,
        isLost: true,
        _count: { select: { deals: true } },
      },
    });

    // Include all deals ever (including won/lost) for the funnel
    const allDealsCount = await prisma.deal.count();
    const data = stages.map((s) => ({
      name: s.name,
      color: s.color ?? "#6B7280",
      count: s._count.deals,
      percentage: allDealsCount > 0 ? Math.round((s._count.deals / allDealsCount) * 100) : 0,
      isWon: s.isWon,
      isLost: s.isLost,
    }));

    return { data };
  } catch (error) {
    console.error("getConversionFunnel error:", error);
    return { data: [] };
  }
}

export async function getRevenueMetrics() {
  if (!prisma) return { data: { wonRevenue: 0, forecastRevenue: 0, avgDealSize: 0, avgDaysToClose: 0, dealsWonThisMonth: 0, quotesAccepted: 0 } };

  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [wonDeals, activeDealsAgg, activeDeals, quotesAccepted] = await Promise.all([
      prisma.deal.findMany({
        where: { stage: { isWon: true } },
        select: { value: true, createdAt: true, closedAt: true },
      }),
      prisma.deal.aggregate({
        where: { stage: { isWon: false, isLost: false } },
        _sum: { value: true },
        _avg: { probability: true },
      }),
      prisma.deal.findMany({
        where: { stage: { isWon: false, isLost: false } },
        select: { value: true, probability: true },
      }),
      prisma.quote.count({
        where: { status: "ACCEPTED", acceptedAt: { gte: startOfMonth } },
      }),
    ]);

    const wonRevenue = wonDeals.reduce((sum, d) => sum + (d.value ? Number(d.value) : 0), 0);
    const dealsWonThisMonth = wonDeals.filter(
      (d) => d.closedAt && new Date(d.closedAt) >= startOfMonth
    ).length;

    // Weighted forecast
    const forecastRevenue = activeDeals.reduce(
      (sum, d) => sum + (d.value ? Number(d.value) : 0) * ((d.probability ?? 50) / 100),
      0
    );

    // Avg deal size (won)
    const wonWithValue = wonDeals.filter((d) => d.value);
    const avgDealSize = wonWithValue.length > 0
      ? wonRevenue / wonWithValue.length
      : 0;

    // Avg days to close
    const closedDeals = wonDeals.filter((d) => d.closedAt);
    const avgDaysToClose = closedDeals.length > 0
      ? Math.round(
          closedDeals.reduce((sum, d) => {
            const created = new Date(d.createdAt).getTime();
            const closed = new Date(d.closedAt!).getTime();
            return sum + (closed - created) / (1000 * 60 * 60 * 24);
          }, 0) / closedDeals.length
        )
      : 0;

    return {
      data: { wonRevenue, forecastRevenue, avgDealSize, avgDaysToClose, dealsWonThisMonth, quotesAccepted },
    };
  } catch (error) {
    console.error("getRevenueMetrics error:", error);
    return { data: { wonRevenue: 0, forecastRevenue: 0, avgDealSize: 0, avgDaysToClose: 0, dealsWonThisMonth: 0, quotesAccepted: 0 } };
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
