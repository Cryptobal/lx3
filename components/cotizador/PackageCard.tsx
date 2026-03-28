"use client";

import { cn } from "@/lib/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import type { Package } from "./types";

interface PackageCardProps {
  pkg: Package;
  selected: boolean;
  onSelect: () => void;
  name: string;
  description: string;
  includes: string[];
  badgeLabel?: string;
}

export function PackageCard({
  pkg,
  selected,
  onSelect,
  name,
  description,
  includes,
  badgeLabel,
}: PackageCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      className={cn(
        "relative w-full cursor-pointer rounded-2xl border p-5 text-left transition-all duration-300 sm:p-6",
        selected
          ? "border-transparent shadow-[0_0_24px_var(--accent-glow)]"
          : "border-[var(--border-default)] hover:border-[var(--border-strong)]"
      )}
      style={{
        background: selected
          ? `linear-gradient(var(--bg-elevated), var(--bg-elevated)) padding-box, linear-gradient(135deg, ${pkg.color}, var(--bg-surface)) border-box`
          : "var(--bg-elevated)",
        borderColor: selected ? "transparent" : undefined,
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Badge */}
      {badgeLabel && (
        <span
          className="absolute -top-3 right-4 rounded-full px-3 py-0.5 text-xs font-bold text-[#06080E]"
          style={{ backgroundColor: pkg.color }}
        >
          {badgeLabel}
        </span>
      )}

      <div className="flex items-start gap-3">
        {/* Radio */}
        <div
          className={cn(
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
            selected ? "border-transparent" : "border-[var(--border-strong)]"
          )}
          style={selected ? { backgroundColor: pkg.color } : {}}
        >
          {selected && (
            <div className="h-2 w-2 rounded-full bg-[#06080E]" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-base font-semibold text-[var(--text-primary)] sm:text-lg">
              {name}
            </h3>
            <span
              className="text-lg font-bold sm:text-xl"
              style={{ color: pkg.color }}
            >
              {pkg.priceLabel}
            </span>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
            {description}
          </p>
        </div>
      </div>

      {/* Expanded includes list */}
      <AnimatePresence>
        {selected && includes.length > 0 && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 space-y-2 overflow-hidden border-t border-[var(--border-subtle)] pt-4"
          >
            {includes.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0"
                  style={{ color: pkg.color }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
