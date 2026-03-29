import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!prisma) {
    return NextResponse.json({ error: "DB not available" }, { status: 500 });
  }

  try {
    const [totalContacts, activeDeals, pendingQuotes, pipelineStages] =
      await Promise.all([
        prisma.contact.count(),
        prisma.deal.count({
          where: { stage: { isWon: false, isLost: false } },
        }),
        prisma.quote.count({
          where: { status: { in: ["SENT", "VIEWED"] } },
        }),
        prisma.pipelineStage.findMany({
          where: { isWon: false, isLost: false },
          include: { deals: { select: { value: true } } },
        }),
      ]);

    const pipelineValue = pipelineStages.reduce((sum, stage) => {
      return (
        sum +
        stage.deals.reduce(
          (s, d) => s + (d.value ? Number(d.value) : 0),
          0
        )
      );
    }, 0);

    return NextResponse.json({
      totalContacts,
      activeDeals,
      pipelineValue,
      pendingQuotes,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
