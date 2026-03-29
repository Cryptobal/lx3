"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils/cn";
import { formatMoney } from "@/lib/growth-os/utils/format";
import { DealCard, type DealCardData } from "./DealCard";

export interface KanbanStage {
  id: string;
  name: string;
  color: string | null;
  order: number;
  isWon: boolean;
  isLost: boolean;
}

interface KanbanColumnProps {
  stage: KanbanStage;
  deals: DealCardData[];
}

export function KanbanColumn({ stage, deals }: KanbanColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: stage.id,
  });

  const totalValue = deals.reduce((sum, d) => sum + (d.value != null ? Number(d.value) : 0), 0);

  const headerColor = stage.color ?? "#71717a";

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col min-w-[280px] w-[280px] bg-zinc-50 dark:bg-zinc-800/50 rounded-xl shrink-0 transition-colors",
        isOver && "bg-zinc-100 dark:bg-zinc-800 ring-2 ring-zinc-300 dark:ring-zinc-600"
      )}
    >
      {/* Column header */}
      <div className="px-3 py-3 border-b border-zinc-200 dark:border-zinc-700">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: headerColor }}
          />
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
            {stage.name}
          </h3>
          <span className="ml-auto text-xs font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-200 dark:bg-zinc-700 px-1.5 py-0.5 rounded-full">
            {deals.length}
          </span>
        </div>
        {totalValue > 0 && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 pl-4.5">
            {formatMoney(totalValue, "CLP")}
          </p>
        )}
      </div>

      {/* Cards list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[120px]">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
        {deals.length === 0 && (
          <div className="flex items-center justify-center h-20 text-xs text-zinc-400 dark:text-zinc-500">
            Sin deals
          </div>
        )}
      </div>
    </div>
  );
}
