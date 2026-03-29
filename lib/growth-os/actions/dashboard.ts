"use server";

import { prisma } from "@/lib/db";

export async function getDashboardStats() {
  if (!prisma) throw new Error("Database not available");

  try {
    const [totalContacts, activeDeals, pipelineValue, pendingQuotes] =
      await Promise.all([
        prisma.contact.count(),
        prisma.deal.count({
          where: {
            stage: {
              isWon: false,
              isLost: false,
            },
          },
        }),
        prisma.deal.aggregate({
          _sum: { value: true },
          where: {
            stage: {
              isWon: false,
              isLost: false,
            },
          },
        }),
        prisma.quote.count({
          where: {
            status: { in: ["SENT", "VIEWED"] },
          },
        }),
      ]);

    return {
      totalContacts,
      activeDeals,
      pipelineValue: pipelineValue._sum.value?.toNumber() ?? 0,
      pendingQuotes,
    };
  } catch (error) {
    console.error("Failed to get dashboard stats:", error);
    throw new Error("Failed to get dashboard stats");
  }
}

export async function getPipelineSummary() {
  if (!prisma) throw new Error("Database not available");

  try {
    const stages = await prisma.pipelineStage.findMany({
      include: {
        deals: {
          select: { value: true },
        },
      },
      orderBy: { order: "asc" },
    });

    return stages.map((stage) => ({
      stageName: stage.name,
      color: stage.color,
      count: stage.deals.length,
      totalValue: stage.deals.reduce(
        (sum, deal) => sum + (deal.value?.toNumber() ?? 0),
        0
      ),
    }));
  } catch (error) {
    console.error("Failed to get pipeline summary:", error);
    throw new Error("Failed to get pipeline summary");
  }
}

export async function getRecentActivities(limit: number = 10) {
  if (!prisma) throw new Error("Database not available");

  try {
    const activities = await prisma.activity.findMany({
      include: {
        user: true,
        contact: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return activities;
  } catch (error) {
    console.error("Failed to get recent activities:", error);
    throw new Error("Failed to get recent activities");
  }
}

export async function getLeadSourceStats() {
  if (!prisma) throw new Error("Database not available");

  try {
    const stats = await prisma.contact.groupBy({
      by: ["source"],
      _count: { source: true },
      orderBy: { _count: { source: "desc" } },
    });

    return stats.map((stat) => ({
      source: stat.source,
      count: stat._count.source,
    }));
  } catch (error) {
    console.error("Failed to get lead source stats:", error);
    throw new Error("Failed to get lead source stats");
  }
}

export async function getRecentVisitors(limit: number = 10) {
  if (!prisma) throw new Error("Database not available");

  try {
    const visitors = await prisma.visitorSession.findMany({
      include: {
        pageViews: true,
        contact: true,
      },
      orderBy: { startedAt: "desc" },
      take: limit,
    });

    return visitors;
  } catch (error) {
    console.error("Failed to get recent visitors:", error);
    throw new Error("Failed to get recent visitors");
  }
}
