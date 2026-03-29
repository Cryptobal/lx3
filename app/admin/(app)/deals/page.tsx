import Link from "next/link";
import { Plus, Kanban } from "lucide-react";
import { getDealsByStage } from "@/lib/growth-os/actions/deals";
import { EmptyState } from "@/components/growth-os/shared/EmptyState";
import { PipelineKanban } from "@/components/growth-os/deals/PipelineKanban";
import type { DealCardData } from "@/components/growth-os/deals/DealCard";

export default async function DealsPage() {
  let stages: Awaited<ReturnType<typeof getDealsByStage>> = [];

  try {
    stages = await getDealsByStage();
  } catch {
    // stages remain empty
  }

  const totalDeals = stages.reduce((sum, s) => sum + s.deals.length, 0);

  // Serialize for client component
  const serializedStages = stages.map((stage) => ({
    id: stage.id,
    name: stage.name,
    color: stage.color,
    order: stage.order,
    isWon: stage.isWon,
    isLost: stage.isLost,
    deals: stage.deals.map(
      (deal): DealCardData => ({
        id: deal.id,
        title: deal.title,
        value: deal.value?.toNumber() ?? null,
        currency: deal.currency,
        probability: deal.probability,
        createdAt: deal.createdAt.toISOString(),
        stageId: deal.stageId,
        contact: deal.contact
          ? {
              id: deal.contact.id,
              firstName: deal.contact.firstName,
              lastName: deal.contact.lastName,
            }
          : null,
        company: deal.company
          ? { id: deal.company.id, name: deal.company.name }
          : null,
      })
    ),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Pipeline
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {totalDeals} deal{totalDeals !== 1 ? "s" : ""} en {stages.length} etapa
            {stages.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/deals/new"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo deal
        </Link>
      </div>

      {/* Kanban */}
      {stages.length === 0 ? (
        <EmptyState
          icon={Kanban}
          title="Sin pipeline"
          description="Configura las etapas de tu pipeline para comenzar a gestionar deals."
        />
      ) : (
        <PipelineKanban stages={serializedStages} />
      )}
    </div>
  );
}
