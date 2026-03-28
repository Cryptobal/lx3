"use client";

import { cn } from "@/lib/utils/cn";
import { formatCLP } from "./data";

interface AddonItemProps {
  name: string;
  price: number;
  type: "toggle" | "counter";
  count: number;
  onChange: (count: number) => void;
}

export function AddonItem({ name, price, type, count, onChange }: AddonItemProps) {
  const active = count > 0;

  if (type === "counter") {
    return (
      <div
        className={cn(
          "flex items-center justify-between gap-3 rounded-xl border p-4 transition-all duration-200",
          active
            ? "border-[var(--accent)] bg-[var(--accent-light)]"
            : "border-[var(--border-default)] bg-[var(--bg-elevated)]"
        )}
      >
        <div className="flex-1">
          <p className="text-sm font-medium text-[var(--text-primary)]">{name}</p>
          <p className="text-xs text-[var(--text-tertiary)]">{formatCLP(price)} c/u</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChange(Math.max(0, count - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-default)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)] active:scale-95"
          >
            −
          </button>
          <span className="w-6 text-center text-sm font-semibold text-[var(--text-primary)]">
            {count}
          </span>
          <button
            type="button"
            onClick={() => onChange(count + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-default)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)] active:scale-95"
          >
            +
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onChange(active ? 0 : 1)}
      className={cn(
        "flex w-full items-center justify-between gap-3 rounded-xl border p-4 text-left transition-all duration-200",
        active
          ? "border-[var(--accent)] bg-[var(--accent-light)]"
          : "border-[var(--border-default)] bg-[var(--bg-elevated)] hover:border-[var(--border-strong)]"
      )}
    >
      <div className="flex-1">
        <p className="text-sm font-medium text-[var(--text-primary)]">{name}</p>
        <p className="text-xs text-[var(--text-tertiary)]">{formatCLP(price)}</p>
      </div>
      {/* Toggle switch */}
      <div
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors duration-200",
          active ? "bg-[var(--accent)]" : "bg-[var(--bg-hover)]"
        )}
      >
        <div
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200",
            active ? "translate-x-5.5" : "translate-x-0.5"
          )}
        />
      </div>
    </button>
  );
}
