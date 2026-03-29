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
import { moveDealToStage } from "@/lib/growth-os/actions/deals";
import { toast } from "sonner";
import { DealCard } from "./DealCard";
import { SortableDealCard } from "./SortableDealCard";
import { formatMoney } from "@/lib/growth-os/utils/format";

interface Deal {
  id: string;
  title: string;
  value: number | null;
  currency: string;
  probability: number | null;
  createdAt: string;
  updatedAt: string;
  stageId: string;
  contact?: { firstName: string; lastName?: string } | null;
  company?: { name: string } | null;
}

interface Stage {
  id: string;
  name: string;
  order: number;
  color: string | null;
  isWon: boolean;
  isLost: boolean;
  deals: Deal[];
}

interface PipelineKanbanProps {
  stages: Stage[];
}

export function PipelineKanban({ stages: initialStages }: PipelineKanbanProps) {
  const [stages, setStages] = useState<Stage[]>(initialStages);
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor)
  );

  const findDealById = useCallback(
    (id: string): { deal: Deal; stageId: string } | null => {
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

    // Determine target stage: either hovering over a stage column or a deal in a stage
    let targetStageId: string;
    const overResult = findDealById(overId);
    if (overResult) {
      targetStageId = overResult.stageId;
    } else {
      // overId is a stage id
      targetStageId = overId;
    }

    if (activeResult.stageId === targetStageId) return;

    // Move deal between columns optimistically during drag
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

    // Find the original stage from initialStages
    let originalStageId: string | null = null;
    for (const stage of initialStages) {
      if (stage.deals.find((d) => d.id === activeId)) {
        originalStageId = stage.id;
        break;
      }
    }

    if (originalStageId && result.stageId !== originalStageId) {
      // Persist the move
      const response = await moveDealToStage(activeId, result.stageId);
      if (!response.success) {
        toast.error("Error al mover el negocio");
        // Revert
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
        <div className="inline-flex gap-4" style={{ minWidth: "100%" }}>
          {stages.map((stage) => (
            <StageColumn key={stage.id} stage={stage} />
          ))}
        </div>
      </div>

      <DragOverlay dropAnimation={{ duration: 200, easing: "ease" }}>
        {activeDeal ? <DealCard deal={activeDeal} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}

function StageColumn({ stage }: { stage: Stage }) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id });

  const totalValue = stage.deals.reduce(
    (sum, d) => sum + (d.value ? Number(d.value) : 0),
    0
  );

  const stageColor = stage.color || "#6B7280";

  return (
    <div
      className="flex w-72 flex-shrink-0 flex-col"
      style={{ minHeight: 400 }}
    >
      {/* Column header */}
      <div className="mb-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: stageColor }}
            />
            <h3 className="text-sm font-semibold text-gray-900">
              {stage.name}
            </h3>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
              {stage.deals.length}
            </span>
          </div>
        </div>
        {totalValue > 0 && (
          <p className="mt-1 text-xs tabular-nums text-gray-400">
            {formatMoney(totalValue, "CLP")}
          </p>
        )}
      </div>

      {/* Droppable area */}
      <div
        ref={setNodeRef}
        className={`flex flex-1 flex-col gap-2 rounded-xl border-2 border-dashed p-2 transition-colors ${
          isOver
            ? "border-blue-300 bg-blue-50/50"
            : "border-transparent bg-transparent"
        }`}
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
            <p className="text-xs text-gray-300">Arrastra negocios aqui</p>
          </div>
        )}
      </div>
    </div>
  );
}
