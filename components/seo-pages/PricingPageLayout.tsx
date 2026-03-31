"use client";

import { SEOPageHero } from "./SEOPageHero";
import { PricingCard } from "./PricingCard";
import { FAQSection } from "./FAQSection";
import { InlineCTA } from "./InlineCTA";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { AnimateOnScroll } from "@/components/shared/AnimateOnScroll";

interface PricingTier {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

interface FAQ {
  question: string;
  answer: string;
}

export interface PricingPageData {
  slug: string;
  badge?: string;
  title: string;
  titleAccent?: string;
  subtitle: string;
  priceRange: string;
  tiers: PricingTier[];
  detailsTitle?: string;
  detailsContent?: string;
  testimonial?: { quote: string; author: string; company: string };
  faqs: FAQ[];
  ctaTitle: string;
  ctaSubtitle?: string;
}

export function PricingPageLayout({ data }: { data: PricingPageData }) {
  return (
    <>
      <SEOPageHero
        title={data.title}
        titleAccent={data.titleAccent}
        subtitle={data.subtitle}
        priceRange={data.priceRange}
        badge={data.badge}
      />

      {/* Pricing cards */}
      <SectionWrapper className="pt-0">
        <AnimateOnScroll>
          <div className="grid gap-8 md:grid-cols-3">
            {data.tiers.map((tier, i) => (
              <PricingCard
                key={i}
                name={tier.name}
                price={tier.price}
                period={tier.period}
                description={tier.description}
                features={tier.features}
                recommended={tier.recommended}
                ctaText="Cotiza ahora"
              />
            ))}
          </div>
        </AnimateOnScroll>
      </SectionWrapper>

      {/* Updated badge */}
      <SectionWrapper className="pt-0">
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-2 text-xs text-[var(--text-tertiary)]">
            Precios actualizados 2026
          </span>
        </div>
      </SectionWrapper>

      {/* Details section */}
      {data.detailsContent && (
        <SectionWrapper>
          <AnimateOnScroll>
            <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] md:text-3xl">
              {data.detailsTitle || "¿Qué incluye cada plan?"}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)]">
              {data.detailsContent}
            </p>
          </AnimateOnScroll>
        </SectionWrapper>
      )}

      {/* Testimonial */}
      {data.testimonial && (
        <SectionWrapper>
          <AnimateOnScroll>
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-8 md:p-12">
              <div className="border-l-4 border-[var(--coral)] pl-6">
                <p className="text-lg italic leading-relaxed text-[var(--text-secondary)]">
                  &ldquo;{data.testimonial.quote}&rdquo;
                </p>
                <div className="mt-4">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    {data.testimonial.author}
                  </p>
                  <p className="text-sm text-[var(--text-tertiary)]">
                    {data.testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </SectionWrapper>
      )}

      <FAQSection faqs={data.faqs} />
      <InlineCTA title={data.ctaTitle} subtitle={data.ctaSubtitle} />
    </>
  );
}
