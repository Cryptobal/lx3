/**
 * Ejecutar con: pnpm prisma db seed
 * Requiere DATABASE_URL (p. ej. desde .env.local o Vercel env pull).
 */
import { config } from "dotenv";

config({ path: ".env.local" });
config();

import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { seedGrowthOs } from "../lib/growth-os/seed-growth-os";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required for prisma db seed");
  }

  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });

  try {
    const results = await seedGrowthOs(prisma);
    console.log(results.join("\n"));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
