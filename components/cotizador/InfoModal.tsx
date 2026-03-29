"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface InfoModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  closeLabel: string;
}

export function InfoModal({ open, onClose, title, description, closeLabel }: InfoModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Mobile: bottom sheet / Desktop: centered popover */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 350 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-2xl border-t border-[var(--border-default)] bg-[var(--bg-elevated)] p-6 min-[900px]:inset-auto min-[900px]:left-1/2 min-[900px]:top-1/2 min-[900px]:max-w-md min-[900px]:-translate-x-1/2 min-[900px]:-translate-y-1/2 min-[900px]:rounded-2xl min-[900px]:border"
          >
            {/* Drag handle (mobile) */}
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[var(--border-strong)] min-[900px]:hidden" />

            <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">
              {title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
              {description}
            </p>

            <button
              onClick={onClose}
              className="mt-6 w-full rounded-xl border border-[var(--border-default)] py-3 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
            >
              {closeLabel}
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
