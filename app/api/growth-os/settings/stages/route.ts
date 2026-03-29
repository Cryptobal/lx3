import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  if (!prisma) {
    return NextResponse.json(
      { error: "Database not available" },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const { name, color, order, isWon, isLost } = body as {
      name: string;
      color?: string;
      order?: number;
      isWon?: boolean;
      isLost?: boolean;
    };

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const stage = await prisma.pipelineStage.create({
      data: {
        name: name.trim(),
        color: color ?? "#6B7280",
        order: order ?? 0,
        isWon: isWon ?? false,
        isLost: isLost ?? false,
      },
    });

    return NextResponse.json({ data: stage });
  } catch (error) {
    console.error("[Stages] Create error:", error);
    return NextResponse.json(
      { error: "Failed to create stage" },
      { status: 500 }
    );
  }
}
