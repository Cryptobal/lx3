"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { toast } from "sonner";
import { KanbanColumn, type KanbanStage } from "./KanbanColumn";
import { DealCard, type DealCardData } from "./DealCard";

interface PipelineStageWithDeals extends KanbanStage {
  deals: DealCardData[];
}

interface PipelineKanbanProps {
  stages: PipelineStageWithDeals[];
}

export function PipelineKanban({ stages: initialStages }: PipelineKanbanProps) {
  const [stages, setStages] = useState(initialStages);
  const [activeDeal, setActiveDeal] = useState<DealCardData | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const deal = event.active.data.current?.deal as DealCardData | undefined;
    if (deal) {
      setActiveDeal(deal);
    }
  }, []);

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveDeal(null);

      if (!over) return;

      const dealId = active.id as string;
      const newStageId = over.id as string;

      // Find the deal and its current stage
      let currentStageId: string | null = null;
      for (const stage of stages) {
        const found = stage.deals.find((d) => d.id === dealId);
        if (found) {
          currentStageId = stage.id;
          break;
        }
      }

      if (!currentStageId || currentStageId === newStageId) return;

      // Optimistic update: move card immediately
      const previousStages = stages;
      setStages((prev) => {
        const next = prev.map((stage) => ({
          ...stage,
          deals: [...stage.deals],
        }));

        const sourceStage = next.find((s) => s.id === currentStageId);
        const targetStage = next.find((s) => s.id === newStageId);

        if (!sourceStage || !targetStage) return prev;

        const dealIndex = sourceStage.deals.findIndex((d) => d.id === dealId);
        if (dealIndex === -1) return prev;

        const [movedDeal] = sourceStage.deals.splice(dealIndex, 1);
        const updatedDeal = { ...movedDeal, stageId: newStageId };
        targetStage.deals.unshift(updatedDeal);

        return next;
      });

      // Call API
      try {
        const res = await fetch(`/api/growth-os/deals/${dealId}/stage`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stageId: newStageId }),
        });

        if (!res.ok) {
          throw new Error("Failed to update deal stage");
        }

        const targetStageName =
          stages.find((s) => s.id === newStageId)?.name ?? "nueva etapa";
        toast.success(`Deal movido a "${targetStageName}"`);
      } catch {
        // Revert on error
        setStages(previousStages);
        toast.error("Error al mover el deal. Intenta de nuevo.");
      }
    },
    [stages]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-220px)]">
        {stages.map((stage) => (
          <KanbanColumn
            key={stage.id}
            stage={stage}
            deals={stage.deals}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={null}>
        {activeDeal ? (
          <div className="w-[264px]">
            <DealCard deal={activeDeal} isDragOverlay />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
