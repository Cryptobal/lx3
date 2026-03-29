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
      : "bg-gray-300";

  const card = (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md ${
        isOverlay ? "rotate-2 shadow-lg ring-2 ring-blue-200" : ""
      }`}
    >
      {/* Title */}
      <p className="truncate text-sm font-medium text-gray-900">
        {deal.title}
      </p>

      {/* Contact / Company */}
      <div className="mt-1.5 space-y-1">
        {deal.contact && (
          <p className="flex items-center gap-1 truncate text-xs text-gray-500">
            <User className="h-3 w-3 flex-shrink-0" />
            {deal.contact.firstName} {deal.contact.lastName ?? ""}
          </p>
        )}
        {deal.company && (
          <p className="flex items-center gap-1 truncate text-xs text-gray-500">
            <Building2 className="h-3 w-3 flex-shrink-0" />
            {deal.company.name}
          </p>
        )}
      </div>

      {/* Bottom row: value, days, probability */}
      <div className="mt-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {deal.value != null && (
            <span className="text-xs font-semibold tabular-nums text-gray-800">
              {formatMoney(Number(deal.value), deal.currency)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-0.5 text-xs text-gray-400">
            <Clock className="h-3 w-3" />
            {daysSinceUpdate}d
          </span>
          {deal.probability != null && (
            <div className="flex items-center gap-1">
              <div
                className={`h-1.5 w-1.5 rounded-full ${probabilityColor}`}
              />
              <span className="text-xs tabular-nums text-gray-400">
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
