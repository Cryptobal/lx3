import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  if (!prisma) {
    return NextResponse.json({
      totalContacts: 0,
      totalCompanies: 0,
      activeDeals: 0,
      pipelineValue: 0,
      pendingQuotes: 0,
      wonDealsValue: 0,
      conversionRate: 0,
    });
  }

  try {
    const [
      totalContacts,
      totalCompanies,
      activeDeals,
      pendingQuotes,
      pipelineAgg,
      wonAgg,
      totalClosedDeals,
      wonDealsCount,
    ] = await Promise.all([
      prisma.contact.count(),
      prisma.company.count(),
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
      prisma.deal.aggregate({
        where: { stage: { isWon: true } },
        _sum: { value: true },
      }),
      prisma.deal.count({
        where: {
          OR: [{ stage: { isWon: true } }, { stage: { isLost: true } }],
        },
      }),
      prisma.deal.count({
        where: { stage: { isWon: true } },
      }),
    ]);

    const pipelineValue = pipelineAgg._sum.value
      ? Number(pipelineAgg._sum.value)
      : 0;
    const wonDealsValue = wonAgg._sum.value
      ? Number(wonAgg._sum.value)
      : 0;
    const conversionRate =
      totalClosedDeals > 0
        ? Math.round((wonDealsCount / totalClosedDeals) * 100)
        : 0;

    return NextResponse.json({
      totalContacts,
      totalCompanies,
      activeDeals,
      pipelineValue,
      pendingQuotes,
      wonDealsValue,
      conversionRate,
    });
  } catch (error) {
    console.error("[Dashboard Stats] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
