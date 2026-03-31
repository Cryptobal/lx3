"use client";

import { SEOPageHero } from "./SEOPageHero";
import { FAQSection } from "./FAQSection";
import { InlineCTA } from "./InlineCTA";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { AnimateOnScroll } from "@/components/shared/AnimateOnScroll";
import { Link } from "@/lib/i18n/routing";
import { CheckCircle2 } from "lucide-react";

interface ServiceLink {
  href: string;
  label: string;
  description: string;
}

interface FAQ {
  question: string;
  answer: string;
}

export interface GeoPageData {
  slug: string;
  city: string;
  region?: string;
  serviceType: string;
  title: string;
  titleAccent?: string;
  subtitle: string;
  intro: string;
  reasons: string[];
  localFact?: string;
  services: ServiceLink[];
  faqs: FAQ[];
  ctaTitle: string;
}

export function GeoPageLayout({ data }: { data: GeoPageData }) {
  return (
    <>
      <SEOPageHero
        badge={`LX3 · ${data.city}, Chile`}
        title={data.title}
        titleAccent={data.titleAccent}
        subtitle={data.subtitle}
      />

      <SectionWrapper className="pt-0">
        <AnimateOnScroll>
          <p className="text-base leading-relaxed text-[var(--text-secondary)]">
            {data.intro}
          </p>
        </AnimateOnScroll>
      </SectionWrapper>

      {data.localFact && (
        <SectionWrapper className="pt-0">
          <AnimateOnScroll>
            <div className="rounded-xl border border-[var(--accent)]/20 bg-[var(--accent-light)] p-6">
              <p className="text-sm font-medium text-[var(--accent)]">{data.localFact}</p>
            </div>
          </AnimateOnScroll>
        </SectionWrapper>
      )}

      <SectionWrapper>
        <AnimateOnScroll>
          <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] md:text-3xl">
            ¿Por qué elegir LX3 para {data.serviceType} en {data.city}?
          </h2>
          <ul className="mt-6 space-y-4">
            {data.reasons.map((reason, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--coral)]" />
                <span className="text-base text-[var(--text-secondary)]">{reason}</span>
              </li>
            ))}
          </ul>
        </AnimateOnScroll>
      </SectionWrapper>

      <SectionWrapper>
        <AnimateOnScroll>
          <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] md:text-3xl">
            Servicios disponibles en {data.city}
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {data.services.map((service, i) => (
              <Link
                key={i}
                href={service.href as "/"}
                className="group rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6 transition-all hover:border-[var(--coral)]/40"
              >
                <h3 className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--coral)]">
                  {service.label}
                </h3>
                <p className="mt-2 text-xs text-[var(--text-tertiary)]">
                  {service.description}
                </p>
              </Link>
            ))}
          </div>
        </AnimateOnScroll>
      </SectionWrapper>

      <FAQSection faqs={data.faqs} />
      <InlineCTA title={data.ctaTitle} />
    </>
  );
}
