import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/growth-os/shared/PageHeader";
import { PipelineSettings } from "@/components/growth-os/settings/PipelineSettings";

export const metadata = { title: "Configuracion | Growth OS" };

export default async function SettingsPage() {
  const stages = await getPipelineStages();

  return (
    <>
      <PageHeader title="Configuracion" />
      <PipelineSettings initialStages={stages} />
    </>
  );
}

async function getPipelineStages() {
  if (!prisma) return [];

  try {
    const stages = await prisma.pipelineStage.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: { select: { deals: true } },
      },
    });

    return JSON.parse(JSON.stringify(stages));
  } catch (error) {
    console.error("getPipelineStages error:", error);
    return [];
  }
}
