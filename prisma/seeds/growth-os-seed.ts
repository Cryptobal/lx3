import { PrismaClient } from "../../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL not set");
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Create default pipeline stages
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
      create: {
        id: `stage-${stage.order}`,
        ...stage,
      },
    });
  }

  console.log("✅ Pipeline stages created");

  // Create admin user
  const hashedPassword = await hash("admin123", 12);

  await prisma.user.upsert({
    where: { email: "carlos.irigoyen@gmail.com" },
    update: {},
    create: {
      name: "Carlos Irigoyen",
      email: "carlos.irigoyen@gmail.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Admin user created");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
