"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowUpDown, User, Building2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatMoney, formatRelativeTime } from "@/lib/growth-os/utils/format";
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

type SortKey = "title" | "value" | "probability" | "stage" | "createdAt";
type SortDir = "asc" | "desc";

interface FlatDeal extends DealCardData {
  stageName: string;
  stageColor: string;
  stageOrder: number;
}

export function PipelineList({ stages }: { stages: Stage[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("stage");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const flatDeals: FlatDeal[] = useMemo(() => {
    return stages.flatMap((stage) =>
      stage.deals.map((deal) => ({
        ...deal,
        stageName: stage.name,
        stageColor: stage.color || "#6B7280",
        stageOrder: stage.order,
      }))
    );
  }, [stages]);

  const sortedDeals = useMemo(() => {
    const sorted = [...flatDeals].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "title":
          cmp = a.title.localeCompare(b.title);
          break;
        case "value":
          cmp = (a.value ?? 0) - (b.value ?? 0);
          break;
        case "probability":
          cmp = (a.probability ?? 0) - (b.probability ?? 0);
          break;
        case "stage":
          cmp = a.stageOrder - b.stageOrder;
          break;
        case "createdAt":
          cmp =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [flatDeals, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "value" || key === "probability" ? "desc" : "asc");
    }
  }

  if (sortedDeals.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-16">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No se encontraron deals
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
              <SortableHeader
                label="Deal"
                sortKey="title"
                currentKey={sortKey}
                direction={sortDir}
                onSort={toggleSort}
              />
              <SortableHeader
                label="Etapa"
                sortKey="stage"
                currentKey={sortKey}
                direction={sortDir}
                onSort={toggleSort}
              />
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Contacto / Empresa
              </th>
              <SortableHeader
                label="Valor"
                sortKey="value"
                currentKey={sortKey}
                direction={sortDir}
                onSort={toggleSort}
                align="right"
              />
              <SortableHeader
                label="Prob."
                sortKey="probability"
                currentKey={sortKey}
                direction={sortDir}
                onSort={toggleSort}
                align="right"
              />
              <SortableHeader
                label="Creado"
                sortKey="createdAt"
                currentKey={sortKey}
                direction={sortDir}
                onSort={toggleSort}
                align="right"
              />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {sortedDeals.map((deal) => (
              <tr
                key={deal.id}
                className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/deals/${deal.id}`}
                    className="font-medium text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {deal.title}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: deal.stageColor }}
                    />
                    <span className="text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
                      {deal.stageName}
                    </span>
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="space-y-0.5">
                    {deal.contact && (
                      <p className="flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-400">
                        <User className="h-3 w-3 shrink-0" />
                        {deal.contact.firstName} {deal.contact.lastName ?? ""}
                      </p>
                    )}
                    {deal.company && (
                      <p className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-500">
                        <Building2 className="h-3 w-3 shrink-0" />
                        {deal.company.name}
                      </p>
                    )}
                    {!deal.contact && !deal.company && (
                      <span className="text-xs text-zinc-400 dark:text-zinc-600">
                        —
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-zinc-900 dark:text-zinc-100 font-medium whitespace-nowrap">
                  {deal.value != null
                    ? formatMoney(Number(deal.value), deal.currency)
                    : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  {deal.probability != null ? (
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          deal.probability >= 70
                            ? "bg-green-500"
                            : deal.probability >= 40
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        )}
                      />
                      <span className="tabular-nums text-zinc-700 dark:text-zinc-300">
                        {deal.probability}%
                      </span>
                    </span>
                  ) : (
                    <span className="text-zinc-400 dark:text-zinc-600">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                  {formatRelativeTime(deal.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SortableHeader({
  label,
  sortKey,
  currentKey,
  direction,
  onSort,
  align = "left",
}: {
  label: string;
  sortKey: SortKey;
  currentKey: SortKey;
  direction: SortDir;
  onSort: (key: SortKey) => void;
  align?: "left" | "right";
}) {
  const isActive = currentKey === sortKey;
  return (
    <th
      className={cn(
        "px-4 py-3 text-xs font-medium uppercase tracking-wider cursor-pointer select-none transition-colors hover:text-zinc-700 dark:hover:text-zinc-300",
        align === "right" ? "text-right" : "text-left",
        isActive
          ? "text-zinc-900 dark:text-zinc-100"
          : "text-zinc-500 dark:text-zinc-400"
      )}
      onClick={() => onSort(sortKey)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <ArrowUpDown
          className={cn(
            "h-3 w-3 transition-opacity",
            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50"
          )}
        />
        {isActive && (
          <span className="text-[10px]">{direction === "asc" ? "↑" : "↓"}</span>
        )}
      </span>
    </th>
  );
}
