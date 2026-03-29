"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getPipelineStages() {
  if (!prisma) throw new Error("Database not available");

  try {
    const stages = await prisma.pipelineStage.findMany({
      include: {
        _count: {
          select: { deals: true },
        },
      },
      orderBy: { order: "asc" },
    });

    return stages;
  } catch (error) {
    console.error("Failed to get pipeline stages:", error);
    throw new Error("Failed to get pipeline stages");
  }
}

export async function createPipelineStage(data: {
  name: string;
  color?: string;
  order?: number;
}) {
  if (!prisma) throw new Error("Database not available");

  try {
    // If no order provided, put it at the end
    let order = data.order;
    if (order === undefined) {
      const lastStage = await prisma.pipelineStage.findFirst({
        orderBy: { order: "desc" },
      });
      order = (lastStage?.order ?? -1) + 1;
    }

    const stage = await prisma.pipelineStage.create({
      data: {
        name: data.name,
        color: data.color ?? "#6B7280",
        order,
      },
    });

    revalidatePath("/admin/settings");
    revalidatePath("/admin/deals");
    return stage;
  } catch (error) {
    console.error("Failed to create pipeline stage:", error);
    throw new Error("Failed to create pipeline stage");
  }
}

export async function updatePipelineStage(
  id: string,
  data: {
    name?: string;
    color?: string;
    order?: number;
    isWon?: boolean;
    isLost?: boolean;
  }
) {
  if (!prisma) throw new Error("Database not available");

  try {
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.color !== undefined) updateData.color = data.color;
    if (data.order !== undefined) updateData.order = data.order;
    if (data.isWon !== undefined) updateData.isWon = data.isWon;
    if (data.isLost !== undefined) updateData.isLost = data.isLost;

    // If setting isWon, clear isLost and vice versa
    if (data.isWon) updateData.isLost = false;
    if (data.isLost) updateData.isWon = false;

    const stage = await prisma.pipelineStage.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/settings");
    revalidatePath("/admin/deals");
    return stage;
  } catch (error) {
    console.error("Failed to update pipeline stage:", error);
    throw new Error("Failed to update pipeline stage");
  }
}

export async function deletePipelineStage(id: string) {
  if (!prisma) throw new Error("Database not available");

  try {
    // Check if stage has deals
    const stage = await prisma.pipelineStage.findUnique({
      where: { id },
      include: { _count: { select: { deals: true } } },
    });

    if (!stage) throw new Error("Stage not found");

    if (stage._count.deals > 0) {
      throw new Error(
        `No se puede eliminar esta etapa porque tiene ${stage._count.deals} negocio(s) asociado(s)`
      );
    }

    await prisma.pipelineStage.delete({ where: { id } });

    revalidatePath("/admin/settings");
    revalidatePath("/admin/deals");
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message.includes("No se puede")) {
      throw error;
    }
    console.error("Failed to delete pipeline stage:", error);
    throw new Error("Failed to delete pipeline stage");
  }
}

export async function reorderPipelineStages(
  stages: Array<{ id: string; order: number }>
) {
  if (!prisma) throw new Error("Database not available");

  try {
    await Promise.all(
      stages.map((s) =>
        prisma!.pipelineStage.update({
          where: { id: s.id },
          data: { order: s.order },
        })
      )
    );

    revalidatePath("/admin/settings");
    revalidatePath("/admin/deals");
    return { success: true };
  } catch (error) {
    console.error("Failed to reorder pipeline stages:", error);
    throw new Error("Failed to reorder pipeline stages");
  }
}
