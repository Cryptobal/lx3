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
  const tProof = useTranslations("proofBar");

  const proofMetrics = [
    { value: tProof("m1Value"), label: tProof("m1Label"), color: "var(--coral)" },
    { value: tProof("m2Value"), label: tProof("m2Label"), color: "var(--accent)" },
    { value: tProof("m3Value"), label: tProof("m3Label"), color: "var(--green)" },
    { value: tProof("m4Value"), label: tProof("m4Label"), color: "var(--accent)" },
  ];

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
              {t("badge")}
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
          <CTAButton href="/cotiza" variant="primary" size="lg">
            {t("ctaPrimary")}
          </CTAButton>
          <CTAButton href="/casos/opai-gard-security" variant="ghost" size="lg">
            {t("ctaSecondary")}
          </CTAButton>
        </motion.div>

        {/* Proof bar — AI in production */}
        <motion.div
          variants={item}
          className="mt-16 grid w-full max-w-3xl grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4"
        >
          {proofMetrics.map((m) => (
            <div key={m.label} className="flex flex-col items-center text-center">
              <span
                className="font-mono text-2xl font-bold"
                style={{ color: m.color }}
              >
                {m.value}
              </span>
              <span className="mt-1.5 text-xs leading-snug text-[var(--text-tertiary)]">
                {m.label}
              </span>
            </div>
          ))}
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
