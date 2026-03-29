"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getDeals() {
  if (!prisma) throw new Error("Database not available");

  try {
    const deals = await prisma.deal.findMany({
      include: {
        stage: true,
        contact: true,
        company: true,
        assignedTo: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return deals;
  } catch (error) {
    console.error("Failed to get deals:", error);
    throw new Error("Failed to get deals");
  }
}

export async function getDealsByStage() {
  if (!prisma) throw new Error("Database not available");

  try {
    const stages = await prisma.pipelineStage.findMany({
      include: {
        deals: {
          include: {
            contact: true,
            company: true,
            assignedTo: true,
            stage: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { order: "asc" },
    });

    return stages;
  } catch (error) {
    console.error("Failed to get deals by stage:", error);
    throw new Error("Failed to get deals by stage");
  }
}

export async function getDeal(id: string) {
  if (!prisma) throw new Error("Database not available");

  try {
    const deal = await prisma.deal.findUnique({
      where: { id },
      include: {
        stage: true,
        contact: true,
        company: true,
        assignedTo: true,
        activities: { orderBy: { createdAt: "desc" } },
        quotes: { include: { items: true } },
      },
    });

    if (!deal) throw new Error("Deal not found");

    return deal;
  } catch (error) {
    console.error("Failed to get deal:", error);
    throw new Error("Failed to get deal");
  }
}

export async function createDeal(data: {
  title: string;
  value?: number;
  currency?: string;
  probability?: number;
  expectedClose?: Date | string;
  stageId: string;
  contactId?: string;
  companyId?: string;
  assignedToId?: string;
  notes?: string;
}) {
  if (!prisma) throw new Error("Database not available");

  try {
    const deal = await prisma.deal.create({
      data: {
        title: data.title,
        value: data.value,
        currency: data.currency ?? "CLP",
        probability: data.probability,
        expectedClose: data.expectedClose
          ? new Date(data.expectedClose)
          : undefined,
        stageId: data.stageId,
        contactId: data.contactId,
        companyId: data.companyId,
        assignedToId: data.assignedToId,
        notes: data.notes,
      },
      include: { stage: true },
    });

    revalidatePath("/growth-os/deals");
    return deal;
  } catch (error) {
    console.error("Failed to create deal:", error);
    throw new Error("Failed to create deal");
  }
}

export async function updateDeal(
  id: string,
  data: {
    title?: string;
    value?: number;
    currency?: string;
    probability?: number;
    expectedClose?: Date | string | null;
    stageId?: string;
    contactId?: string | null;
    companyId?: string | null;
    assignedToId?: string | null;
    notes?: string;
    closedAt?: Date | string | null;
    lostReason?: string;
  }
) {
  if (!prisma) throw new Error("Database not available");

  try {
    const updateData: Record<string, unknown> = { ...data };
    if (data.expectedClose !== undefined) {
      updateData.expectedClose = data.expectedClose
        ? new Date(data.expectedClose)
        : null;
    }
    if (data.closedAt !== undefined) {
      updateData.closedAt = data.closedAt ? new Date(data.closedAt) : null;
    }

    const deal = await prisma.deal.update({
      where: { id },
      data: updateData,
      include: { stage: true },
    });

    revalidatePath("/growth-os/deals");
    revalidatePath(`/growth-os/deals/${id}`);
    return deal;
  } catch (error) {
    console.error("Failed to update deal:", error);
    throw new Error("Failed to update deal");
  }
}

export async function moveDealToStage(dealId: string, stageId: string) {
  if (!prisma) throw new Error("Database not available");

  try {
    const currentDeal = await prisma.deal.findUnique({
      where: { id: dealId },
      include: { stage: true },
    });

    if (!currentDeal) throw new Error("Deal not found");

    const newStage = await prisma.pipelineStage.findUnique({
      where: { id: stageId },
    });

    if (!newStage) throw new Error("Stage not found");

    const deal = await prisma.deal.update({
      where: { id: dealId },
      data: { stageId },
      include: { stage: true },
    });

    await prisma.activity.create({
      data: {
        type: "DEAL_STAGE_CHANGED",
        title: `Deal moved from "${currentDeal.stage.name}" to "${newStage.name}"`,
        dealId,
        contactId: currentDeal.contactId,
        metadata: {
          oldStageId: currentDeal.stageId,
          newStageId: stageId,
          oldStageName: currentDeal.stage.name,
          newStageName: newStage.name,
        },
      },
    });

    revalidatePath("/growth-os/deals");
    revalidatePath(`/growth-os/deals/${dealId}`);
    return deal;
  } catch (error) {
    console.error("Failed to move deal to stage:", error);
    throw new Error("Failed to move deal to stage");
  }
}

export async function deleteDeal(id: string) {
  if (!prisma) throw new Error("Database not available");

  try {
    await prisma.deal.delete({ where: { id } });

    revalidatePath("/growth-os/deals");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete deal:", error);
    throw new Error("Failed to delete deal");
  }
}
