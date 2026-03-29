import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

/**
 * TEMPORARY setup route — creates database tables and seeds admin user.
 * Visit /api/growth-os/setup?key=lx3-setup-2024 to run.
 * DELETE THIS FILE after initial setup.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  // Simple protection so bots can't trigger it
  if (key !== "lx3-setup-2024") {
    return NextResponse.json({ error: "Invalid setup key" }, { status: 403 });
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return NextResponse.json(
      { error: "DATABASE_URL not configured" },
      { status: 500 }
    );
  }

  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });

  try {
    const results: string[] = [];

    // Create pipeline stages
    const stages = [
      { name: "Prospecto", order: 1, color: "#6B7280", isDefault: true },
      { name: "Contactado", order: 2, color: "#3B82F6" },
      { name: "Reunión Agendada", order: 3, color: "#8B5CF6" },
      { name: "Cotización Enviada", order: 4, color: "#F59E0B" },
      { name: "Negociación", order: 5, color: "#EF4444" },
      { name: "Ganado", order: 6, color: "#10B981", isWon: true },
      { name: "Perdido", order: 7, color: "#6B7280", isLost: true },
    ];

    for (const stage of stages) {
      await prisma.pipelineStage.upsert({
        where: { id: `stage-${stage.order}` },
        update: stage,
        create: { id: `stage-${stage.order}`, ...stage },
      });
    }
    results.push("✅ 7 pipeline stages created/updated");

    // Create admin user
    const hashedPassword = await hash("admin123", 12);

    const user = await prisma.user.upsert({
      where: { email: "carlos.irigoyen@lx3.ai" },
      update: { password: hashedPassword },
      create: {
        name: "Carlos Irigoyen",
        email: "carlos.irigoyen@lx3.ai",
        password: hashedPassword,
        role: "ADMIN",
      },
    });
    results.push(`✅ Admin user ready: ${user.email} (id: ${user.id})`);

    return NextResponse.json({
      success: true,
      results,
      message: "Setup complete! You can now login at /admin with carlos.irigoyen@lx3.ai / admin123. DELETE this route after setup.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    // Check if tables don't exist yet
    if (message.includes("does not exist") || message.includes("relation")) {
      return NextResponse.json({
        success: false,
        error: "Tables don't exist yet. You need to run 'npx prisma db push' first to create the database schema.",
        detail: message,
      }, { status: 500 });
    }

    return NextResponse.json({
      success: false,
      error: message,
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
