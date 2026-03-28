"use client";

import { formatCLP } from "./data";
import { packages, addons, monthlyPlans } from "./data";
import type { CotizadorState } from "./types";

interface PriceSummaryProps {
  state: CotizadorState;
  totalOneTime: number;
  totalMonthly: number;
  t: (key: string) => string;
  tRaw: (key: string) => unknown;
}

export function PriceSummary({ state, totalOneTime, totalMonthly, t }: PriceSummaryProps) {
  const pkg = packages.find((p) => p.id === state.selectedPackage);
  const plan = monthlyPlans.find((p) => p.id === state.monthlyPlan);

  const activeAddons = addons.filter((a) => (state.addonCounts[a.id] ?? 0) > 0);

  return (
    <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-6">
      <h3 className="text-base font-semibold text-[var(--text-primary)]">
        {t("summary.title")}
      </h3>

      <div className="mt-4 space-y-3">
        {/* Package */}
        {pkg && (
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm text-[var(--text-secondary)]">
              {t(pkg.nameKey)}
            </span>
            <span className="shrink-0 text-sm font-medium text-[var(--text-primary)]">
              {formatCLP(pkg.price)}
            </span>
          </div>
        )}

        {/* Addons */}
        {activeAddons.map((addon) => {
          const count = state.addonCounts[addon.id] ?? 0;
          return (
            <div key={addon.id} className="flex items-start justify-between gap-2">
              <span className="text-sm text-[var(--text-secondary)]">
                {t(addon.nameKey)}
                {count > 1 && ` ×${count}`}
              </span>
              <span className="shrink-0 text-sm font-medium text-[var(--text-primary)]">
                {formatCLP(addon.price * count)}
              </span>
            </div>
          );
        })}

        {/* Divider */}
        <div className="border-t border-[var(--border-subtle)] pt-3">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              {t("summary.totalOneTime")}
            </span>
            <span className="text-xl font-bold text-[var(--accent)]">
              {formatCLP(totalOneTime)}
            </span>
          </div>
        </div>

        {/* Monthly */}
        {plan && (
          <div className="border-t border-[var(--border-subtle)] pt-3">
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm text-[var(--text-secondary)]">
                {t(plan.nameKey)}
              </span>
              <span className="shrink-0 text-sm font-medium text-[var(--text-primary)]">
                {formatCLP(plan.price)}/mes
              </span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-sm font-semibold text-[var(--text-primary)]">
                {t("summary.totalMonthly")}
              </span>
              <span className="text-lg font-bold text-[var(--coral)]">
                {formatCLP(totalMonthly)}/mes
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
