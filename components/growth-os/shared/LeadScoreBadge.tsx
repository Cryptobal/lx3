"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { Flame } from "lucide-react";

interface LeadScoreBadgeProps {
  score: number;
  breakdown?: { label: string; points: number }[];
  size?: "sm" | "md";
}

function getScoreConfig(score: number) {
  if (score >= 70) return { label: "Hot", color: "text-red-500", bg: "bg-red-500/10 dark:bg-red-500/15", ring: "ring-red-500/20" };
  if (score >= 40) return { label: "Warm", color: "text-amber-500", bg: "bg-amber-500/10 dark:bg-amber-500/15", ring: "ring-amber-500/20" };
  if (score >= 20) return { label: "Cool", color: "text-blue-500", bg: "bg-blue-500/10 dark:bg-blue-500/15", ring: "ring-blue-500/20" };
  return { label: "Cold", color: "text-zinc-400", bg: "bg-zinc-100 dark:bg-zinc-800", ring: "ring-zinc-500/20" };
}

export function LeadScoreBadge({ score, breakdown, size = "sm" }: LeadScoreBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const config = getScoreConfig(score);

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        onMouseEnter={() => breakdown && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={cn(
          "inline-flex items-center gap-1 rounded-full font-semibold tabular-nums ring-1",
          config.bg,
          config.color,
          config.ring,
          size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm"
        )}
      >
        <Flame className={cn(size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5")} />
        {score}
      </button>

      {showTooltip && breakdown && breakdown.length > 0 && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-56 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-3 shadow-lg">
          <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
            Lead Score: {score}/100
          </p>
          <ul className="space-y-1">
            {breakdown.map((item, i) => (
              <li key={i} className="flex items-center justify-between text-xs">
                <span className="text-zinc-600 dark:text-zinc-400 truncate mr-2">
                  {item.label}
                </span>
                <span
                  className={cn(
                    "font-medium tabular-nums shrink-0",
                    item.points > 0
                      ? "text-emerald-500"
                      : item.points < 0
                        ? "text-red-500"
                        : "text-zinc-400"
                  )}
                >
                  {item.points > 0 ? "+" : ""}{item.points}
                </span>
              </li>
            ))}
          </ul>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
            <div className="h-2 w-2 rotate-45 border-b border-r border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800" />
          </div>
        </div>
      )}
    </div>
  );
}
