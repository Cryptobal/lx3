"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Building2, User, Clock } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatMoney } from "@/lib/growth-os/utils/format";

export interface DealCardData {
  id: string;
  title: string;
  value: number | null;
  currency: string;
  probability: number | null;
  createdAt: string;
  contact: { id: string; firstName: string; lastName: string | null } | null;
  company: { id: string; name: string } | null;
  stageId: string;
}

interface DealCardProps {
  deal: DealCardData;
  isDragOverlay?: boolean;
}

function getDaysInStage(createdAt: string): number {
  const now = new Date();
  const created = new Date(createdAt);
  return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
}

function probabilityColor(probability: number | null): string {
  if (probability == null) return "bg-zinc-300 dark:bg-zinc-600";
  if (probability >= 60) return "bg-emerald-500";
  if (probability >= 30) return "bg-amber-500";
  return "bg-red-500";
}

export function DealCard({ deal, isDragOverlay = false }: DealCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: deal.id,
      data: { deal },
    });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined;

  const days = getDaysInStage(deal.createdAt);
  const contactName = deal.contact
    ? `${deal.contact.firstName} ${deal.contact.lastName ?? ""}`.trim()
    : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 p-3 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow select-none",
        isDragging && "opacity-30",
        isDragOverlay && "shadow-lg ring-2 ring-zinc-900/10 dark:ring-zinc-100/10 rotate-2"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-snug">
          {deal.title}
        </h4>
        <span
          className={cn("w-2 h-2 rounded-full shrink-0 mt-1", probabilityColor(deal.probability))}
          title={deal.probability != null ? `${deal.probability}% probabilidad` : "Sin probabilidad"}
        />
      </div>

      {(contactName || deal.company) && (
        <div className="space-y-1 mb-2">
          {contactName && (
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
              <User className="w-3 h-3 shrink-0" />
              <span className="truncate">{contactName}</span>
            </div>
          )}
          {deal.company && (
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
              <Building2 className="w-3 h-3 shrink-0" />
              <span className="truncate">{deal.company.name}</span>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        {deal.value != null ? (
          <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
            {formatMoney(deal.value, deal.currency)}
          </span>
        ) : (
          <span className="text-xs text-zinc-400">Sin valor</span>
        )}
        <div className="flex items-center gap-1 text-xs text-zinc-400">
          <Clock className="w-3 h-3" />
          <span>{days}d</span>
        </div>
      </div>
    </div>
  );
}
