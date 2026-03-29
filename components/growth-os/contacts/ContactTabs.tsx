"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { ContactTimeline } from "./ContactTimeline";
import { Badge } from "@/components/growth-os/shared/Badge";
import { formatMoney } from "@/lib/growth-os/utils/format";
import type { ActivityType, QuoteStatus } from "@/lib/generated/prisma/client";

const QUOTE_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Borrador",
  SENT: "Enviada",
  VIEWED: "Vista",
  ACCEPTED: "Aceptada",
  REJECTED: "Rechazada",
  EXPIRED: "Expirada",
};

const QUOTE_STATUS_VARIANTS: Record<string, "default" | "success" | "warning" | "danger" | "info" | "purple"> = {
  DRAFT: "default",
  SENT: "info",
  VIEWED: "purple",
  ACCEPTED: "success",
  REJECTED: "danger",
  EXPIRED: "warning",
};

interface ContactTabsProps {
  activities: Array<{
    id: string;
    type: ActivityType;
    title: string;
    description: string | null;
    createdAt: string;
  }>;
  deals: Array<{
    id: string;
    title: string;
    value: number | null;
    currency: string;
    stage: { name: string; color: string | null };
    createdAt: string;
  }>;
  quotes: Array<{
    id: string;
    quoteNumber: string;
    title: string;
    total: number;
    currency: string;
    status: QuoteStatus;
    createdAt: string;
  }>;
}

type TabKey = "timeline" | "deals" | "quotes";

const TABS: { key: TabKey; label: string }[] = [
  { key: "timeline", label: "Timeline" },
  { key: "deals", label: "Deals" },
  { key: "quotes", label: "Cotizaciones" },
];

export function ContactTabs({ activities, deals, quotes }: ContactTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("timeline");

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800">
      {/* Tab headers */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-700 px-6">
        {TABS.map((tab) => {
          const count =
            tab.key === "timeline"
              ? activities.length
              : tab.key === "deals"
                ? deals.length
                : quotes.length;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "relative px-4 py-3 text-sm font-medium transition-colors",
                activeTab === tab.key
                  ? "text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
              )}
            >
              {tab.label}
              {count > 0 && (
                <span className="ml-1.5 text-xs text-zinc-400 dark:text-zinc-500">
                  ({count})
                </span>
              )}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 dark:bg-zinc-100 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="p-6">
        {activeTab === "timeline" && <ContactTimeline activities={activities} />}

        {activeTab === "deals" && (
          <div>
            {deals.length === 0 ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-8">
                No hay deals asociados
              </p>
            ) : (
              <div className="space-y-3">
                {deals.map((deal) => (
                  <div
                    key={deal.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: deal.stage.color ?? "#6366f1",
                        }}
                      />
                      <div>
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {deal.title}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {deal.stage.name}
                        </p>
                      </div>
                    </div>
                    {deal.value != null && (
                      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 tabular-nums">
                        {formatMoney(deal.value, deal.currency)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "quotes" && (
          <div>
            {quotes.length === 0 ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-8">
                No hay cotizaciones asociadas
              </p>
            ) : (
              <div className="space-y-3">
                {quotes.map((quote) => (
                  <div
                    key={quote.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {quote.title}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {quote.quoteNumber}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={QUOTE_STATUS_VARIANTS[quote.status] ?? "default"}
                      >
                        {QUOTE_STATUS_LABELS[quote.status] ?? quote.status}
                      </Badge>
                      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 tabular-nums">
                        {formatMoney(quote.total, quote.currency)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
