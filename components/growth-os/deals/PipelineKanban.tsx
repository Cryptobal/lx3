"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { ChevronRight } from "lucide-react";
import { moveDealToStage } from "@/lib/growth-os/actions/deals";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";
import { DealCard, type DealCardData } from "./DealCard";
import { SortableDealCard } from "./SortableDealCard";
import { formatMoney } from "@/lib/growth-os/utils/format";

interface Stage {
  id: string;
  name: string;
  order: number;
  color: string | null;
  isWon: boolean;
  isLost: boolean;
  deals: DealCardData[];
}

interface PipelineKanbanProps {
  stages: Stage[];
}

export function PipelineKanban({ stages: initialStages }: PipelineKanbanProps) {
  const [stages, setStages] = useState<Stage[]>(initialStages);
  const [activeDeal, setActiveDeal] = useState<DealCardData | null>(null);
  const [collapsedColumns, setCollapsedColumns] = useState<Set<string>>(
    new Set()
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor)
  );

  const toggleCollapse = useCallback((stageId: string) => {
    setCollapsedColumns((prev) => {
      const next = new Set(prev);
      if (next.has(stageId)) {
        next.delete(stageId);
      } else {
        next.add(stageId);
      }
      return next;
    });
  }, []);

  const findDealById = useCallback(
    (id: string): { deal: DealCardData; stageId: string } | null => {
      for (const stage of stages) {
        const deal = stage.deals.find((d) => d.id === id);
        if (deal) return { deal, stageId: stage.id };
      }
      return null;
    },
    [stages]
  );

  function handleDragStart(event: DragStartEvent) {
    const result = findDealById(event.active.id as string);
    if (result) setActiveDeal(result.deal);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeResult = findDealById(activeId);
    if (!activeResult) return;

    let targetStageId: string;
    const overResult = findDealById(overId);
    if (overResult) {
      targetStageId = overResult.stageId;
    } else {
      targetStageId = overId;
    }

    if (activeResult.stageId === targetStageId) return;

    setStages((prev) => {
      const newStages = prev.map((s) => ({ ...s, deals: [...s.deals] }));
      const sourceStage = newStages.find((s) => s.id === activeResult.stageId);
      const targetStage = newStages.find((s) => s.id === targetStageId);
      if (!sourceStage || !targetStage) return prev;

      const dealIndex = sourceStage.deals.findIndex((d) => d.id === activeId);
      if (dealIndex === -1) return prev;

      const [movedDeal] = sourceStage.deals.splice(dealIndex, 1);
      movedDeal.stageId = targetStageId;
      targetStage.deals.push(movedDeal);

      return newStages;
    });
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveDeal(null);

    if (!over) return;

    const activeId = active.id as string;
    const result = findDealById(activeId);
    if (!result) return;

    let originalStageId: string | null = null;
    for (const stage of initialStages) {
      if (stage.deals.find((d) => d.id === activeId)) {
        originalStageId = stage.id;
        break;
      }
    }

    if (originalStageId && result.stageId !== originalStageId) {
      const response = await moveDealToStage(activeId, result.stageId);
      if (!response.success) {
        toast.error("Error al mover el negocio");
        setStages(initialStages);
      } else {
        toast.success("Negocio movido exitosamente");
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="-mx-4 overflow-x-auto px-4 pb-4">
        <div className="inline-flex gap-3" style={{ minWidth: "100%" }}>
          {stages.map((stage) => (
            <StageColumn
              key={stage.id}
              stage={stage}
              collapsed={collapsedColumns.has(stage.id)}
              onToggleCollapse={() => toggleCollapse(stage.id)}
            />
          ))}
        </div>
      </div>

      <DragOverlay dropAnimation={{ duration: 200, easing: "ease" }}>
        {activeDeal ? <DealCard deal={activeDeal} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}

function StageColumn({
  stage,
  collapsed,
  onToggleCollapse,
}: {
  stage: Stage;
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id });

  const totalValue = stage.deals.reduce(
    (sum, d) => sum + (d.value ? Number(d.value) : 0),
    0
  );

  const stageColor = stage.color || "#6B7280";

  // Collapsed column: vertical strip
  if (collapsed) {
    return (
      <div
        ref={setNodeRef}
        className={cn(
          "flex w-10 flex-shrink-0 flex-col items-center rounded-xl border transition-colors cursor-pointer",
          isOver
            ? "border-blue-300 dark:border-blue-600 bg-blue-50/50 dark:bg-blue-900/20"
            : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50"
        )}
        style={{ minHeight: 400 }}
        onClick={onToggleCollapse}
        title={`Expandir ${stage.name}`}
      >
        <div className="flex flex-col items-center gap-2 py-3">
          <div
            className="h-2.5 w-2.5 rounded-full shrink-0"
            style={{ backgroundColor: stageColor }}
          />
          <span className="rounded-full bg-zinc-100 dark:bg-zinc-700 px-1.5 py-0.5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
            {stage.deals.length}
          </span>
          <ChevronRight className="h-3 w-3 text-zinc-400" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <span
            className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap"
            style={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              transform: "rotate(180deg)",
            }}
          >
            {stage.name}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex w-72 flex-shrink-0 flex-col"
      style={{ minHeight: 400, maxHeight: "calc(100vh - 280px)" }}
    >
      {/* Column header */}
      <div className="mb-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 px-3 py-2.5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={onToggleCollapse}
              className="rounded p-0.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors shrink-0"
              title="Colapsar columna"
            >
              <ChevronRight className="h-3.5 w-3.5 rotate-180" />
            </button>
            <div
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: stageColor }}
            />
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
              {stage.name}
            </h3>
            <span className="rounded-full bg-zinc-100 dark:bg-zinc-700 px-2 py-0.5 text-xs font-medium text-zinc-500 dark:text-zinc-400 shrink-0">
              {stage.deals.length}
            </span>
          </div>
        </div>
        {totalValue > 0 && (
          <p className="mt-1 ml-6 text-xs tabular-nums text-zinc-400 dark:text-zinc-500">
            {formatMoney(totalValue, "CLP")}
          </p>
        )}
      </div>

      {/* Droppable area with vertical scroll */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-1 flex-col gap-2 rounded-xl border-2 border-dashed p-2 transition-colors overflow-y-auto",
          isOver
            ? "border-blue-300 dark:border-blue-600 bg-blue-50/50 dark:bg-blue-900/20"
            : "border-transparent bg-transparent"
        )}
      >
        <SortableContext
          items={stage.deals.map((d) => d.id)}
          strategy={verticalListSortingStrategy}
        >
          {stage.deals.map((deal) => (
            <SortableDealCard key={deal.id} deal={deal} />
          ))}
        </SortableContext>

        {stage.deals.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-lg py-8">
            <p className="text-xs text-zinc-300 dark:text-zinc-600">
              Arrastra negocios aqui
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
