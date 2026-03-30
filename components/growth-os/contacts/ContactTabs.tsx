"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ContactTimeline } from "./ContactTimeline";
import { Badge } from "@/components/growth-os/shared/Badge";
import { formatMoney, formatRelativeTime } from "@/lib/growth-os/utils/format";
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

interface EmailItem {
  id: string;
  type: "sent" | "gmail";
  subject: string;
  from?: string;
  to?: string;
  direction?: string;
  snippet?: string;
  date: string;
}

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
  emails?: EmailItem[];
}

type TabKey = "timeline" | "deals" | "quotes" | "emails";

export function ContactTabs({ activities, deals, quotes, emails = [] }: ContactTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("timeline");

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: "timeline", label: "Timeline", count: activities.length },
    { key: "deals", label: "Deals", count: deals.length },
    { key: "quotes", label: "Cotizaciones", count: quotes.length },
    { key: "emails", label: "Emails", count: emails.length },
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800">
      {/* Tab headers */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-700 px-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "relative px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap",
              activeTab === tab.key
                ? "text-zinc-900 dark:text-zinc-100"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
            )}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-1.5 text-xs text-zinc-400 dark:text-zinc-500">
                ({tab.count})
              </span>
            )}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 dark:bg-zinc-100 rounded-full" />
            )}
          </button>
        ))}
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
                  <Link
                    key={deal.id}
                    href={`/admin/deals/${deal.id}`}
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
                  </Link>
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
                  <Link
                    key={quote.id}
                    href={`/admin/quotes/${quote.id}`}
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
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "emails" && (
          <div>
            {emails.length === 0 ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-8">
                No hay emails asociados. Conecta Gmail en Configuracion para sincronizar.
              </p>
            ) : (
              <div className="space-y-2">
                {emails.map((email) => (
                  <div
                    key={email.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <div className="mt-0.5">
                      {email.direction === "INBOUND" ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-900/20">
                          <ArrowDownLeft className="h-3.5 w-3.5 text-blue-500" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-900/20">
                          <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                        {email.subject}
                      </p>
                      {email.snippet && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                          {email.snippet}
                        </p>
                      )}
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                        {formatRelativeTime(email.date)}
                        {email.type === "sent" && (
                          <span className="ml-2 text-zinc-300 dark:text-zinc-600">via Resend</span>
                        )}
                        {email.type === "gmail" && (
                          <span className="ml-2 text-zinc-300 dark:text-zinc-600">via Gmail</span>
                        )}
                      </p>
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
