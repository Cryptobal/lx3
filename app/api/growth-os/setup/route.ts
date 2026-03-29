import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { seedGrowthOs } from "@/lib/growth-os/seed-growth-os";

/**
 * Inicialización única en producción: crea pipeline + usuario admin.
 * GET /api/growth-os/setup?key=...
 *
 * Configura GROWTH_OS_SETUP_KEY en Vercel y usa ese valor en lugar del default.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  const expectedKey =
    process.env.GROWTH_OS_SETUP_KEY ?? "lx3-setup-2024";

  if (key !== expectedKey) {
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
    const results = await seedGrowthOs(prisma);

    return NextResponse.json({
      success: true,
      results,
      message:
        "Setup complete. Login at /admin with carlos.irigoyen@lx3.ai / admin123 (change password after first login).",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    if (message.includes("does not exist") || message.includes("relation")) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Tables don't exist yet. Run `pnpm prisma migrate deploy` (or db push) first.",
          detail: message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
