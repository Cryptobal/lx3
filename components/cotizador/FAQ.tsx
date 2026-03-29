"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";

export function FAQ() {
  const t = useTranslations("cotizadorPage.faq");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const questions = t.raw("items") as Array<{ q: string; a: string }>;

  return (
    <div className="mt-8">
      <h3 className="text-base font-semibold text-[var(--text-primary)]">
        {t("title")}
      </h3>
      <div className="mt-4 space-y-2">
        {questions.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)]"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-3 p-4 text-left"
              >
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  {item.q}
                </span>
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--border-default)] text-sm text-[var(--text-tertiary)] transition-transform duration-200",
                    isOpen && "rotate-45"
                  )}
                >
                  +
                </span>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 pb-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
