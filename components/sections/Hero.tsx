"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { CTAButton } from "@/components/shared/CTAButton";

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
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] as const },
  },
};

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-6">
      {/* Mesh gradient background */}
      <div className="pointer-events-none absolute inset-0 mesh-gradient" />

      {/* Subtle grid pattern overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* Radial fade at edges */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0B1120_75%)]" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto max-w-6xl"
      >
        <div className="max-w-3xl">
          {/* Accent tag badge */}
          <motion.div variants={item}>
            <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-accent/20 bg-accent/5 px-5 py-2">
              <div className="h-2 w-2 rounded-full bg-accent shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
              <span className="font-mono text-xs font-medium tracking-widest text-accent">
                {t("tag")}
              </span>
            </div>
          </motion.div>

          {/* Giant headline */}
          <motion.h1
            variants={item}
            className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {t("headline")}{" "}
            <span className="gradient-text">{t("headlineAccent")}</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={item}
            className="mt-8 max-w-xl text-lg leading-relaxed text-white/60 md:text-xl"
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
            <CTAButton href="/casos" variant="secondary" size="lg">
              {t("ctaSecondary")}
            </CTAButton>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
