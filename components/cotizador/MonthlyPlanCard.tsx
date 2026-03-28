"use client";

import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";
import { formatCLP } from "./data";

interface MonthlyPlanCardProps {
  planId: string;
  name: string;
  features: string[];
  price: number;
  selected: boolean;
  onSelect: () => void;
  badgeLabel?: string;
}

export function MonthlyPlanCard({
  name,
  features,
  price,
  selected,
  onSelect,
  badgeLabel,
}: MonthlyPlanCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      className={cn(
        "relative w-full cursor-pointer rounded-2xl border p-5 text-left transition-all duration-300",
        selected
          ? "border-[var(--accent)] bg-[var(--accent-light)] shadow-[0_0_20px_var(--accent-glow)]"
          : "border-[var(--border-default)] bg-[var(--bg-elevated)] hover:border-[var(--border-strong)]"
      )}
      whileTap={{ scale: 0.98 }}
    >
      {badgeLabel && (
        <span className="absolute -top-3 right-4 rounded-full bg-[var(--accent)] px-3 py-0.5 text-xs font-bold text-white">
          {badgeLabel}
        </span>
      )}

      <div className="flex items-start gap-3">
        {/* Radio */}
        <div
          className={cn(
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
            selected
              ? "border-[var(--accent)] bg-[var(--accent)]"
              : "border-[var(--border-strong)]"
          )}
        >
          {selected && <div className="h-2 w-2 rounded-full bg-white" />}
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-base font-semibold text-[var(--text-primary)]">{name}</h3>
            <span className="text-lg font-bold text-[var(--accent)]">
              {formatCLP(price)}<span className="text-sm font-normal text-[var(--text-tertiary)]">/mes</span>
            </span>
          </div>

          <ul className="mt-3 space-y-1.5">
            {features.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.button>
  );
}
