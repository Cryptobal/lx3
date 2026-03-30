"use client";

import { useState, useMemo } from "react";
import {
  Search,
  LayoutGrid,
  List,
  TrendingUp,
  DollarSign,
  BarChart3,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatMoney } from "@/lib/growth-os/utils/format";
import { PipelineKanban } from "./PipelineKanban";
import { PipelineList } from "./PipelineList";
import type { DealCardData } from "./DealCard";

interface Stage {
  id: string;
  name: string;
  order: number;
  color: string | null;
  isWon: boolean;
  isLost: boolean;
  deals: DealCardData[];
}

interface PipelineViewProps {
  stages: Stage[];
}

export function PipelineView({ stages }: PipelineViewProps) {
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");

  // Compute metrics from all deals
  const metrics = useMemo(() => {
    const allDeals = stages.flatMap((s) => s.deals);
    const activeStages = stages.filter((s) => !s.isWon && !s.isLost);
    const activeDeals = activeStages.flatMap((s) => s.deals);
    const wonStage = stages.find((s) => s.isWon);
    const wonDeals = wonStage?.deals.length ?? 0;

    const totalValue = activeDeals.reduce(
      (sum, d) => sum + (d.value ? Number(d.value) : 0),
      0
    );
    const weightedValue = activeDeals.reduce(
      (sum, d) =>
        sum +
        (d.value ? Number(d.value) : 0) * ((d.probability ?? 50) / 100),
      0
    );
    const avgDealSize =
      activeDeals.filter((d) => d.value).length > 0
        ? totalValue / activeDeals.filter((d) => d.value).length
        : 0;
    const conversionRate =
      allDeals.length > 0
        ? Math.round((wonDeals / allDeals.length) * 100)
        : 0;

    return {
      totalDeals: allDeals.length,
      activeDeals: activeDeals.length,
      totalValue,
      weightedValue,
      avgDealSize,
      conversionRate,
      wonDeals,
    };
  }, [stages]);

  // Filter stages/deals by search and stage filter
  const filteredStages = useMemo(() => {
    const q = search.toLowerCase().trim();

    return stages
      .filter((s) => stageFilter === "all" || s.id === stageFilter)
      .map((stage) => {
        if (!q) return stage;
        const filteredDeals = stage.deals.filter((deal) => {
          const contactName = deal.contact
            ? `${deal.contact.firstName} ${deal.contact.lastName ?? ""}`.toLowerCase()
            : "";
          const companyName = deal.company?.name.toLowerCase() ?? "";
          return (
            deal.title.toLowerCase().includes(q) ||
            contactName.includes(q) ||
            companyName.includes(q)
          );
        });
        return { ...stage, deals: filteredDeals };
      });
  }, [stages, search, stageFilter]);

  return (
    <div className="space-y-4">
      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCard
          icon={DollarSign}
          label="Valor pipeline"
          value={formatMoney(metrics.totalValue, "CLP")}
          color="text-blue-500"
        />
        <MetricCard
          icon={TrendingUp}
          label="Valor ponderado"
          value={formatMoney(metrics.weightedValue, "CLP")}
          color="text-emerald-500"
        />
        <MetricCard
          icon={BarChart3}
          label="Ticket promedio"
          value={formatMoney(metrics.avgDealSize, "CLP")}
          color="text-amber-500"
        />
        <MetricCard
          icon={Target}
          label="Tasa conversion"
          value={`${metrics.conversionRate}%`}
          subtitle={`${metrics.wonDeals} ganado${metrics.wonDeals !== 1 ? "s" : ""} de ${metrics.totalDeals}`}
          color="text-purple-500"
        />
      </div>

      {/* Toolbar: search + filters + view toggle */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar deals..."
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 py-2 pl-10 pr-4 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Stage filter */}
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">Todas las etapas</option>
            {stages.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.deals.length})
              </option>
            ))}
          </select>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-0.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 p-0.5">
          <button
            onClick={() => setView("kanban")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              view === "kanban"
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
            )}
          >
            <LayoutGrid className="h-4 w-4" />
            Kanban
          </button>
          <button
            onClick={() => setView("list")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              view === "list"
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
            )}
          >
            <List className="h-4 w-4" />
            Lista
          </button>
        </div>
      </div>

      {/* View content */}
      {view === "kanban" ? (
        <PipelineKanban stages={filteredStages} />
      ) : (
        <PipelineList stages={filteredStages} />
      )}
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  subtitle,
  color,
}: {
  icon: typeof DollarSign;
  label: string;
  value: string;
  subtitle?: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
      <div className="flex items-center gap-2">
        <div className={cn("rounded-lg bg-zinc-50 dark:bg-zinc-800 p-2", color)}>
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {label}
        </span>
      </div>
      <p className="mt-2 text-lg font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
        {value}
      </p>
      {subtitle && (
        <p className="text-xs text-zinc-400 dark:text-zinc-500">{subtitle}</p>
      )}
    </div>
  );
}
