"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

type ActionResult<T = unknown> = { success: true; data: T } | { success: false; error: string };

export async function getPipelineStages() {
  if (!prisma) return { data: [] };

  try {
    const stages = await prisma.pipelineStage.findMany({
      orderBy: { order: "asc" },
      include: { _count: { select: { deals: true } } },
    });

    return { data: JSON.parse(JSON.stringify(stages)) };
  } catch (error) {
    console.error("getPipelineStages error:", error);
    return { data: [] };
  }
}

export async function createPipelineStage(data: {
  name: string;
  color?: string;
  isDefault?: boolean;
  isWon?: boolean;
  isLost?: boolean;
}): Promise<ActionResult> {
  if (!prisma) return { success: false, error: "Database not available" };

  try {
    const maxOrder = await prisma.pipelineStage.aggregate({ _max: { order: true } });
    const nextOrder = (maxOrder._max.order ?? -1) + 1;

    const stage = await prisma.pipelineStage.create({
      data: {
        name: data.name,
        order: nextOrder,
        color: data.color,
        isDefault: data.isDefault ?? false,
        isWon: data.isWon ?? false,
        isLost: data.isLost ?? false,
      },
    });

    revalidatePath("/admin/settings");
    revalidatePath("/admin/deals");
    return { success: true, data: JSON.parse(JSON.stringify(stage)) };
  } catch (error) {
    console.error("createPipelineStage error:", error);
    return { success: false, error: "Failed to create pipeline stage" };
  }
}

export async function updatePipelineStage(
  id: string,
  data: {
    name?: string;
    color?: string;
    isDefault?: boolean;
    isWon?: boolean;
    isLost?: boolean;
  }
): Promise<ActionResult> {
  if (!prisma) return { success: false, error: "Database not available" };

  try {
    const stage = await prisma.pipelineStage.update({
      where: { id },
      data,
    });

    revalidatePath("/admin/settings");
    revalidatePath("/admin/deals");
    return { success: true, data: JSON.parse(JSON.stringify(stage)) };
  } catch (error) {
    console.error("updatePipelineStage error:", error);
    return { success: false, error: "Failed to update pipeline stage" };
  }
}

export async function deletePipelineStage(id: string): Promise<ActionResult> {
  if (!prisma) return { success: false, error: "Database not available" };

  try {
    const stage = await prisma.pipelineStage.findUnique({
      where: { id },
      include: { _count: { select: { deals: true } } },
    });

    if (!stage) return { success: false, error: "Stage not found" };
    if (stage._count.deals > 0) {
      return { success: false, error: `Cannot delete stage "${stage.name}" — it has ${stage._count.deals} deal(s). Move them first.` };
    }

    await prisma.pipelineStage.delete({ where: { id } });

    revalidatePath("/admin/settings");
    revalidatePath("/admin/deals");
    return { success: true, data: null };
  } catch (error) {
    console.error("deletePipelineStage error:", error);
    return { success: false, error: "Failed to delete pipeline stage" };
  }
}

export async function reorderPipelineStages(orderedIds: string[]): Promise<ActionResult> {
  if (!prisma) return { success: false, error: "Database not available" };

  try {
    await Promise.all(
      orderedIds.map((id, index) =>
        prisma!.pipelineStage.update({
          where: { id },
          data: { order: index },
        })
      )
    );

    revalidatePath("/admin/settings");
    revalidatePath("/admin/deals");
    return { success: true, data: null };
  } catch (error) {
    console.error("reorderPipelineStages error:", error);
    return { success: false, error: "Failed to reorder stages" };
  }
}
