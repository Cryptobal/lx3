"use client";

import { AnimateOnScroll } from "@/components/shared/AnimateOnScroll";
import { SectionWrapper } from "@/components/shared/SectionWrapper";

interface SEOPageHeroProps {
  badge?: string;
  title: string;
  titleAccent?: string; // portion of title to highlight in coral
  subtitle: string;
  priceRange?: string; // e.g. "$490.000 — $1.490.000 CLP"
}

export function SEOPageHero({
  badge = "LX3 · Santiago, Chile",
  title,
  titleAccent,
  subtitle,
  priceRange,
}: SEOPageHeroProps) {
  let titleParts: { before: string; accent: string; after: string } | null = null;
  if (titleAccent) {
    const idx = title.toLowerCase().indexOf(titleAccent.toLowerCase());
    if (idx !== -1) {
      titleParts = {
        before: title.slice(0, idx),
        accent: title.slice(idx, idx + titleAccent.length),
        after: title.slice(idx + titleAccent.length),
      };
    }
  }

  return (
    <section className="relative overflow-hidden pt-32 pb-16">
      <div className="absolute inset-0 mesh-gradient opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg-deep)]" />

      <SectionWrapper className="relative z-10">
        <AnimateOnScroll>
          <div className="max-w-3xl">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/60 px-4 py-1.5 text-xs font-medium text-[var(--text-secondary)] backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--coral)]" />
              {badge}
            </span>

            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-[var(--text-primary)] md:text-5xl lg:text-6xl">
              {titleParts ? (
                <>
                  {titleParts.before}
                  <span className="text-[var(--coral)]">{titleParts.accent}</span>
                  {titleParts.after}
                </>
              ) : (
                title
              )}
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-[var(--text-secondary)] md:text-xl">
              {subtitle}
            </p>

            {priceRange && (
              <div className="mt-8 inline-flex items-center gap-2 rounded-lg border border-[var(--coral)]/20 bg-[var(--coral-light)] px-5 py-2.5">
                <span className="text-sm font-semibold text-[var(--coral)]">
                  {priceRange}
                </span>
              </div>
            )}
          </div>
        </AnimateOnScroll>
      </SectionWrapper>
    </section>
  );
}
