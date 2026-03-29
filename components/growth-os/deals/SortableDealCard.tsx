"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DealCard } from "./DealCard";

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

interface SortableDealCardProps {
  deal: Deal;
}

export function SortableDealCard({ deal }: SortableDealCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: deal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <DealCard deal={deal} />
    </div>
  );
}
