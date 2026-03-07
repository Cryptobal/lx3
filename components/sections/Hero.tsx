"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { CTAButton } from "@/components/shared/CTAButton";
import { ChevronDown } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.4, 0.25, 1] as const },
  },
};

export function Hero() {
  const t = useTranslations("hero");
  const tSocial = useTranslations("socialProof");

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* ── Background layers ── */}
      <div className="pointer-events-none absolute inset-0 mesh-gradient mesh-animate" />

      {/* Dot grid pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,#ffffff06_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* Radial fade at edges */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#06080E_75%)]" />

      {/* ── Content ── */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 text-center"
      >
        {/* Badge pill */}
        <motion.div variants={item}>
          <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-[var(--coral)]/20 bg-[var(--coral)]/5 px-5 py-2">
            <div className="pulse-dot h-2 w-2 rounded-full bg-[var(--coral)]" />
            <span className="font-mono text-xs font-medium tracking-widest text-[var(--coral)]">
              Software Studio &middot; Santiago, Chile
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={item}
          className="text-hero font-display font-bold"
        >
          {t("headline")}{" "}
          <span className="gradient-text">{t("headlineAccent")}</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={item}
          className="mt-8 max-w-[520px] text-lg leading-relaxed text-[var(--text-secondary)]"
        >
          {t("subheadline")}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          variants={item}
          className="mt-12 flex flex-col gap-4 sm:flex-row"
        >
          <CTAButton href="/contacto" variant="primary" size="lg">
            {t("ctaPrimary")}
          </CTAButton>
          <CTAButton href="/casos" variant="ghost" size="lg">
            {t("ctaSecondary")}
          </CTAButton>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          variants={item}
          className="mt-16 flex flex-col items-center gap-6 sm:flex-row sm:gap-0"
        >
          {/* Metric 1 - blue */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-semibold text-[var(--accent)]">
              2+ a&ntilde;os
            </span>
            <span className="text-sm text-[var(--text-tertiary)]">
              {tSocial("metric1").replace(/^2\+\s*años\s*/, "")}
            </span>
          </div>

          <div className="hidden h-4 w-px bg-[var(--border-default)] sm:mx-10 sm:block" />

          {/* Metric 2 - coral */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-semibold text-[var(--coral)]">
              20+ m&oacute;dulos
            </span>
            <span className="text-sm text-[var(--text-tertiary)]">
              {tSocial("metric2").replace(/^20\+\s*módulos\s*/, "")}
            </span>
          </div>

          <div className="hidden h-4 w-px bg-[var(--border-default)] sm:mx-10 sm:block" />

          {/* Metric 3 - green */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-semibold text-[var(--green)]">
              30 d&iacute;as
            </span>
            <span className="text-sm text-[var(--text-tertiary)]">
              MVP
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="scroll-indicator absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-6 w-6 text-[var(--text-tertiary)]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
