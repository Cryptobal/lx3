"use client";

import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export function StepIndicator({ currentStep, totalSteps, labels }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-0 px-2">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;

        return (
          <div key={step} className="flex items-center">
            {/* Step circle + label */}
            <div className="flex flex-col items-center">
              <motion.div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors duration-300 sm:h-10 sm:w-10",
                  isCompleted
                    ? "border-[var(--green)] bg-[var(--green)] text-[#06080E]"
                    : isActive
                      ? "border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent)]"
                      : "border-[var(--border-default)] bg-transparent text-[var(--text-tertiary)]"
                )}
                animate={isActive ? { scale: [1, 1.08, 1] } : {}}
                transition={{ duration: 0.4 }}
              >
                {isCompleted ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step
                )}
              </motion.div>
              <span
                className={cn(
                  "mt-1.5 hidden text-[11px] font-medium sm:block",
                  isActive
                    ? "text-[var(--accent)]"
                    : isCompleted
                      ? "text-[var(--green)]"
                      : "text-[var(--text-tertiary)]"
                )}
              >
                {labels[i]}
              </span>
            </div>

            {/* Connector line */}
            {i < totalSteps - 1 && (
              <div
                className={cn(
                  "mx-1.5 h-0.5 w-6 rounded-full sm:mx-3 sm:w-12",
                  step < currentStep
                    ? "bg-[var(--green)]"
                    : "bg-[var(--border-default)]"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
