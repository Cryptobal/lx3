"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

type ActionResult<T = unknown> = { success: true; data: T } | { success: false; error: string };

export async function getPipelineStages() {
  if (!prisma) return [];

  try {
    const stages = await prisma.pipelineStage.findMany({
      orderBy: { order: "asc" },
    });
    return JSON.parse(JSON.stringify(stages));
  } catch (error) {
    console.error("getPipelineStages error:", error);
    return [];
  }
}

export async function getCompaniesForSelect() {
  if (!prisma) return [];

  try {
    const companies = await prisma.company.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
      take: 200,
    });
    return JSON.parse(JSON.stringify(companies));
  } catch (error) {
    console.error("getCompaniesForSelect error:", error);
    return [];
  }
}

export async function getContactsForSelect() {
  if (!prisma) return [];

  try {
    const contacts = await prisma.contact.findMany({
      select: { id: true, firstName: true, lastName: true, email: true },
      orderBy: { firstName: "asc" },
      take: 200,
    });
    return JSON.parse(JSON.stringify(contacts));
  } catch (error) {
    console.error("getContactsForSelect error:", error);
    return [];
  }
}

export async function getDeals() {
  if (!prisma) return { data: [] };

  try {
    const stages = await prisma.pipelineStage.findMany({
      orderBy: { order: "asc" },
      include: {
        deals: {
          include: {
            contact: true,
            company: true,
            assignedTo: true,
          },
          orderBy: { updatedAt: "desc" },
        },
      },
    });

    return { data: JSON.parse(JSON.stringify(stages)) };
  } catch (error) {
    console.error("getDeals error:", error);
    return { data: [] };
  }
}

export async function getDeal(id: string): Promise<ActionResult> {
  if (!prisma) return { success: false, error: "Database not available" };

  try {
    const deal = await prisma.deal.findUnique({
      where: { id },
      include: {
        stage: true,
        contact: true,
        company: true,
        assignedTo: true,
        quotes: true,
        activities: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!deal) return { success: false, error: "Deal not found" };
    return { success: true, data: JSON.parse(JSON.stringify(deal)) };
  } catch (error) {
    console.error("getDeal error:", error);
    return { success: false, error: "Failed to fetch deal" };
  }
}

export async function createDeal(data: {
  title: string;
  value?: number;
  currency?: string;
  probability?: number;
  expectedClose?: string;
  stageId: string;
  contactId?: string;
  companyId?: string;
  assignedToId?: string;
  notes?: string;
}): Promise<ActionResult> {
  if (!prisma) return { success: false, error: "Database not available" };

  try {
    const deal = await prisma.deal.create({
      data: {
        title: data.title,
        value: data.value,
        currency: data.currency ?? "CLP",
        probability: data.probability,
        expectedClose: data.expectedClose ? new Date(data.expectedClose) : undefined,
        stageId: data.stageId,
        contactId: data.contactId || undefined,
        companyId: data.companyId || undefined,
        assignedToId: data.assignedToId || undefined,
        notes: data.notes,
      },
    });

    await prisma.activity.create({
      data: {
        type: "DEAL_STAGE_CHANGED",
        title: `Deal created: ${data.title}`,
        dealId: deal.id,
        contactId: data.contactId || undefined,
      },
    });

    revalidatePath("/admin/deals");
    return { success: true, data: JSON.parse(JSON.stringify(deal)) };
  } catch (error) {
    console.error("createDeal error:", error);
    return { success: false, error: "Failed to create deal" };
  }
}

export async function updateDeal(
  id: string,
  data: {
    title?: string;
    value?: number;
    currency?: string;
    probability?: number;
    expectedClose?: string | null;
    closedAt?: string | null;
    lostReason?: string;
    stageId?: string;
    contactId?: string | null;
    companyId?: string | null;
    assignedToId?: string | null;
    notes?: string;
  }
): Promise<ActionResult> {
  if (!prisma) return { success: false, error: "Database not available" };

  try {
    const updateData: Record<string, unknown> = { ...data };

    if (data.expectedClose !== undefined) {
      updateData.expectedClose = data.expectedClose ? new Date(data.expectedClose) : null;
    }
    if (data.closedAt !== undefined) {
      updateData.closedAt = data.closedAt ? new Date(data.closedAt) : null;
    }

    const deal = await prisma.deal.update({ where: { id }, data: updateData });

    revalidatePath("/admin/deals");
    revalidatePath(`/admin/deals/${id}`);
    return { success: true, data: JSON.parse(JSON.stringify(deal)) };
  } catch (error) {
    console.error("updateDeal error:", error);
    return { success: false, error: "Failed to update deal" };
  }
}

export async function moveDealToStage(
  dealId: string,
  stageId: string
): Promise<ActionResult> {
  if (!prisma) return { success: false, error: "Database not available" };

  try {
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      include: { stage: true },
    });
    if (!deal) return { success: false, error: "Deal not found" };

    const newStage = await prisma.pipelineStage.findUnique({ where: { id: stageId } });
    if (!newStage) return { success: false, error: "Stage not found" };

    const updated = await prisma.deal.update({
      where: { id: dealId },
      data: {
        stageId,
        closedAt: newStage.isWon || newStage.isLost ? new Date() : null,
      },
    });

    await prisma.activity.create({
      data: {
        type: "DEAL_STAGE_CHANGED",
        title: `Deal moved from "${deal.stage.name}" to "${newStage.name}"`,
        dealId,
        contactId: deal.contactId || undefined,
        metadata: {
          fromStageId: deal.stageId,
          fromStageName: deal.stage.name,
          toStageId: stageId,
          toStageName: newStage.name,
        },
      },
    });

    revalidatePath("/admin/deals");
    revalidatePath(`/admin/deals/${dealId}`);
    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error) {
    console.error("moveDealToStage error:", error);
    return { success: false, error: "Failed to move deal" };
  }
}

export async function deleteDeal(id: string): Promise<ActionResult> {
  if (!prisma) return { success: false, error: "Database not available" };

  try {
    await prisma.deal.delete({ where: { id } });
    revalidatePath("/admin/deals");
    return { success: true, data: null };
  } catch (error) {
    console.error("deleteDeal error:", error);
    return { success: false, error: "Failed to delete deal" };
  }
}
