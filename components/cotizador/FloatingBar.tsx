"use client";

import { formatCLP } from "./data";
import { motion } from "framer-motion";

interface FloatingBarProps {
  totalOneTime: number;
  totalMonthly: number;
  labelOneTime: string;
  labelMonthly: string;
}

export function FloatingBar({ totalOneTime, totalMonthly, labelOneTime, labelMonthly }: FloatingBarProps) {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border-subtle)] bg-[var(--bg-deep)]/90 px-4 py-3 backdrop-blur-xl min-[900px]:hidden"
    >
      <div className="mx-auto flex max-w-lg items-center justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-tertiary)]">
            {labelOneTime}
          </p>
          <p className="text-lg font-bold text-[var(--accent)]">
            {formatCLP(totalOneTime)}
          </p>
        </div>
        {totalMonthly > 0 && (
          <div className="text-right">
            <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-tertiary)]">
              {labelMonthly}
            </p>
            <p className="text-lg font-bold text-[var(--coral)]">
              {formatCLP(totalMonthly)}/mes
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
