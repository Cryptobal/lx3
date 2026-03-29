"use client";

import { cn } from "@/lib/utils/cn";
import { formatCLP } from "./data";
import { Info } from "lucide-react";

interface AddonItemProps {
  name: string;
  price: number;
  type: "toggle" | "counter";
  count: number;
  onChange: (count: number) => void;
  included?: boolean;
  includedLabel?: string;
  onInfoClick?: () => void;
}

export function AddonItem({
  name,
  price,
  type,
  count,
  onChange,
  included,
  includedLabel,
  onInfoClick,
}: AddonItemProps) {
  const active = count > 0;

  // Included addon - disabled, informational only
  if (included) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--green)]/20 bg-[var(--green)]/5 p-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-[var(--text-primary)]">{name}</p>
          <p className="text-xs text-[var(--green)]">{includedLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          {onInfoClick && (
            <button
              type="button"
              onClick={onInfoClick}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-tertiary)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-secondary)]"
              aria-label="Info"
            >
              <Info className="h-4 w-4" />
            </button>
          )}
          <svg className="h-5 w-5 text-[var(--green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
    );
  }

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
          {onInfoClick && (
            <button
              type="button"
              onClick={onInfoClick}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-tertiary)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-secondary)]"
              aria-label="Info"
            >
              <Info className="h-4 w-4" />
            </button>
          )}
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
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-xl border p-4 transition-all duration-200",
        active
          ? "border-[var(--accent)] bg-[var(--accent-light)]"
          : "border-[var(--border-default)] bg-[var(--bg-elevated)]"
      )}
    >
      <button
        type="button"
        onClick={() => onChange(active ? 0 : 1)}
        className="flex flex-1 items-center gap-3 text-left"
      >
        <div className="flex-1">
          <p className="text-sm font-medium text-[var(--text-primary)]">{name}</p>
          <p className="text-xs text-[var(--text-tertiary)]">{formatCLP(price)}</p>
        </div>
      </button>
      <div className="flex items-center gap-2">
        {onInfoClick && (
          <button
            type="button"
            onClick={onInfoClick}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-tertiary)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-secondary)]"
            aria-label="Info"
          >
            <Info className="h-4 w-4" />
          </button>
        )}
        {/* Toggle switch */}
        <button
          type="button"
          onClick={() => onChange(active ? 0 : 1)}
          className={cn(
            "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200",
            active ? "bg-[var(--accent)]" : "bg-[var(--bg-hover)]"
          )}
        >
          <div
            className={cn(
              "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200",
              active ? "translate-x-5.5" : "translate-x-0.5"
            )}
          />
        </button>
      </div>
    </div>
  );
}
