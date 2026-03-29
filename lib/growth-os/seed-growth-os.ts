import type { PrismaClient } from "@/lib/generated/prisma/client";
import { hash } from "bcryptjs";

const PIPELINE_STAGES = [
  { name: "Prospecto", order: 1, color: "#6B7280", isDefault: true },
  { name: "Contactado", order: 2, color: "#3B82F6" },
  { name: "Reunión Agendada", order: 3, color: "#8B5CF6" },
  { name: "Cotización Enviada", order: 4, color: "#F59E0B" },
  { name: "Negociación", order: 5, color: "#EF4444" },
  { name: "Ganado", order: 6, color: "#10B981", isWon: true },
  { name: "Perdido", order: 7, color: "#6B7280", isLost: true },
];

const DEFAULT_ADMIN = {
  name: "Carlos Irigoyen",
  email: "carlos.irigoyen@lx3.ai",
  passwordPlain: "admin123",
};

/**
 * Crea etapas del pipeline y usuario admin (credentials).
 * Idempotente: puede ejecutarse varias veces.
 */
export async function seedGrowthOs(prisma: PrismaClient): Promise<string[]> {
  const results: string[] = [];

  for (const stage of PIPELINE_STAGES) {
    await prisma.pipelineStage.upsert({
      where: { id: `stage-${stage.order}` },
      update: stage,
      create: { id: `stage-${stage.order}`, ...stage },
    });
  }
  results.push("7 pipeline stages OK");

  const hashedPassword = await hash(DEFAULT_ADMIN.passwordPlain, 12);
  const user = await prisma.user.upsert({
    where: { email: DEFAULT_ADMIN.email },
    update: { password: hashedPassword, role: "ADMIN" },
    create: {
      name: DEFAULT_ADMIN.name,
      email: DEFAULT_ADMIN.email,
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  results.push(`Admin user OK: ${user.email}`);

  return results;
}
