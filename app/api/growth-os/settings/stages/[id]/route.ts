import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!prisma) {
    return NextResponse.json(
      { error: "Database not available" },
      { status: 503 }
    );
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { name, color, isWon, isLost } = body as {
      name?: string;
      color?: string;
      isWon?: boolean;
      isLost?: boolean;
    };

    const stage = await prisma.pipelineStage.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name: name.trim() } : {}),
        ...(color !== undefined ? { color } : {}),
        ...(isWon !== undefined ? { isWon } : {}),
        ...(isLost !== undefined ? { isLost } : {}),
      },
    });

    return NextResponse.json({ data: stage });
  } catch (error) {
    console.error("[Stages] Update error:", error);
    return NextResponse.json(
      { error: "Failed to update stage" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!prisma) {
    return NextResponse.json(
      { error: "Database not available" },
      { status: 503 }
    );
  }

  try {
    const { id } = await params;

    // Check if stage has deals
    const dealCount = await prisma.deal.count({
      where: { stageId: id },
    });

    if (dealCount > 0) {
      return NextResponse.json(
        { error: "No se puede eliminar: la etapa tiene negocios asociados" },
        { status: 400 }
      );
    }

    await prisma.pipelineStage.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[Stages] Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete stage" },
      { status: 500 }
    );
  }
}
