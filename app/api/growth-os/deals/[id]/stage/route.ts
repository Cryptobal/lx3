import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!prisma) {
    return NextResponse.json({ error: "DB not available" }, { status: 500 });
  }

  try {
    const { id } = await params;
    const { stageId } = await request.json();

    const deal = await prisma.deal.findUnique({
      where: { id },
      include: { stage: true },
    });

    if (!deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    const newStage = await prisma.pipelineStage.findUnique({
      where: { id: stageId },
    });

    if (!newStage) {
      return NextResponse.json({ error: "Stage not found" }, { status: 404 });
    }

    // Update deal stage
    const updated = await prisma.deal.update({
      where: { id },
      data: {
        stageId,
        closedAt: newStage.isWon || newStage.isLost ? new Date() : null,
      },
      include: { stage: true, contact: true, company: true },
    });

    // Record activity
    await prisma.activity.create({
      data: {
        type: "DEAL_STAGE_CHANGED",
        title: `Deal movido de "${deal.stage.name}" a "${newStage.name}"`,
        dealId: id,
        contactId: deal.contactId,
        userId: session.user.id,
        metadata: {
          oldStageId: deal.stageId,
          newStageId: stageId,
          oldStageName: deal.stage.name,
          newStageName: newStage.name,
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Move deal error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
