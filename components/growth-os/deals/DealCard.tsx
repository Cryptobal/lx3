"use client";

import Link from "next/link";
import { Building2, User, Clock } from "lucide-react";
import { formatMoney } from "@/lib/growth-os/utils/format";

export interface DealCardData {
  id: string;
  title: string;
  value: number | null;
  currency: string;
  probability: number | null;
  createdAt: string;
  updatedAt?: string;
  stageId: string;
  contact?: { id?: string; firstName: string; lastName?: string | null } | null;
  company?: { id?: string; name: string } | null;
}

type Deal = DealCardData;

interface DealCardProps {
  deal: Deal;
  isOverlay?: boolean;
}

export function DealCard({ deal, isOverlay = false }: DealCardProps) {
  const daysSinceUpdate = Math.floor(
    (Date.now() - new Date(deal.updatedAt ?? deal.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  const probabilityColor =
    deal.probability != null
      ? deal.probability >= 70
        ? "bg-green-500"
        : deal.probability >= 40
          ? "bg-yellow-500"
          : "bg-red-500"
      : "bg-zinc-300 dark:bg-zinc-600";

  const card = (
    <div
      className={`rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-3 shadow-sm transition-shadow hover:shadow-md ${
        isOverlay ? "rotate-2 shadow-lg ring-2 ring-blue-300 dark:ring-blue-600" : ""
      }`}
    >
      {/* Title */}
      <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {deal.title}
      </p>

      {/* Contact / Company */}
      <div className="mt-1.5 space-y-1">
        {deal.contact && (
          <p className="flex items-center gap-1 truncate text-xs text-zinc-500 dark:text-zinc-400">
            <User className="h-3 w-3 flex-shrink-0" />
            {deal.contact.firstName} {deal.contact.lastName ?? ""}
          </p>
        )}
        {deal.company && (
          <p className="flex items-center gap-1 truncate text-xs text-zinc-500 dark:text-zinc-400">
            <Building2 className="h-3 w-3 flex-shrink-0" />
            {deal.company.name}
          </p>
        )}
      </div>

      {/* Bottom row: value, days, probability */}
      <div className="mt-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {deal.value != null && (
            <span className="text-xs font-semibold tabular-nums text-zinc-800 dark:text-zinc-200">
              {formatMoney(Number(deal.value), deal.currency)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-0.5 text-xs text-zinc-400 dark:text-zinc-500">
            <Clock className="h-3 w-3" />
            {daysSinceUpdate}d
          </span>
          {deal.probability != null && (
            <div className="flex items-center gap-1">
              <div
                className={`h-1.5 w-1.5 rounded-full ${probabilityColor}`}
              />
              <span className="text-xs tabular-nums text-zinc-400 dark:text-zinc-500">
                {deal.probability}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isOverlay) return card;

  return (
    <Link href={`/admin/deals/${deal.id}`} className="block">
      {card}
    </Link>
  );
}
