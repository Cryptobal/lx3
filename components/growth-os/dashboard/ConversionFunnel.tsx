"use client";

import { cn } from "@/lib/utils/cn";

interface FunnelStage {
  name: string;
  color: string;
  count: number;
  percentage: number;
  isWon: boolean;
  isLost: boolean;
}

interface ConversionFunnelProps {
  data: FunnelStage[];
}

export function ConversionFunnel({ data }: ConversionFunnelProps) {
  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Funnel de Conversion
        </h3>
        <div className="flex h-32 items-center justify-center text-sm text-zinc-500 dark:text-zinc-400">
          Sin datos
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-5">
        Funnel de Conversion
      </h3>
      <div className="space-y-3">
        {data.map((stage) => {
          const barWidth = Math.max((stage.count / maxCount) * 100, 4);
          return (
            <div key={stage.name} className="group">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: stage.color }}
                  />
                  <span
                    className={cn(
                      "text-sm font-medium",
                      stage.isWon
                        ? "text-emerald-600 dark:text-emerald-400"
                        : stage.isLost
                          ? "text-red-500 dark:text-red-400"
                          : "text-zinc-700 dark:text-zinc-300"
                    )}
                  >
                    {stage.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
                    {stage.count}
                  </span>
                  <span className="text-xs tabular-nums text-zinc-400 dark:text-zinc-500 w-8 text-right">
                    {stage.percentage}%
                  </span>
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${barWidth}%`,
                    backgroundColor: stage.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
