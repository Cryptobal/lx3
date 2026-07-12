"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { AnimateOnScroll } from "@/components/shared/AnimateOnScroll";
import { CTAButton } from "@/components/shared/CTAButton";
import { ServicePricing } from "@/components/shared/ServicePricing";
import { ServiceCoverage } from "@/components/shared/ServiceCoverage";
import { CheckCircle2, MessageCircle } from "lucide-react";

type ServiceKey = "internalApps" | "aiAutomation" | "websites" | "consulting";

interface RelatedLink {
  path: { es: string; en: string };
  labelKey: string;
}

interface ServicePageSectionsProps {
  serviceKey: ServiceKey;
  ctaKey: string;
  relatedLinks: RelatedLink[];
  /** Human-readable service name, used in the coverage schema. */
  serviceName?: string;
  /** Render the canonical pricing block (for pages with a price intent). */
  showPricing?: boolean;
  priceRange?: string;
}

export function ServicePageSections({
  serviceKey,
  ctaKey,
  relatedLinks,
  serviceName,
  showPricing = false,
  priceRange,
}: ServicePageSectionsProps) {
  const t = useTranslations("servicesPage");
  const locale = useLocale() as "es" | "en";
  const forWho = t.raw(`${serviceKey}.forWho`) as string[];
  const process = t.raw(`${serviceKey}.process`) as string[];

  return (
    <>
      {/* Intro expanded */}
      <SectionWrapper className="pt-0">
        <AnimateOnScroll>
          <p className="text-base leading-relaxed text-[var(--text-secondary)]">
            {t(`${serviceKey}.introExpanded`)}
          </p>
        </AnimateOnScroll>
      </SectionWrapper>

      {/* For who + Process */}
      <SectionWrapper className="pt-0">
        <AnimateOnScroll>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                {t(`${serviceKey}.forWhoTitle`)}
              </h2>
              <ul className="mt-4 space-y-3">
                {forWho.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent)]" />
                    <span className="text-sm text-[var(--text-secondary)]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                {t(`${serviceKey}.processTitle`)}
              </h2>
              <ol className="mt-4 space-y-3">
                {process.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/20 text-xs font-medium text-[var(--accent)]">
                      {i + 1}
                    </span>
                    <span className="text-sm text-[var(--text-secondary)]">{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </AnimateOnScroll>
      </SectionWrapper>

      {/* Tech stack */}
      <SectionWrapper className="pt-0">
        <AnimateOnScroll>
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6">
            <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
              {t(`${serviceKey}.techStackTitle`)}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
              {t(`${serviceKey}.techStack`)}
            </p>
          </div>
        </AnimateOnScroll>
      </SectionWrapper>

      {/* Pricing block (canonical pricing + cotizador CTA) */}
      {showPricing && <ServicePricing priceRange={priceRange} />}

      {/* Chile-wide coverage + LocalBusiness schema */}
      <ServiceCoverage service={serviceName ?? "Software y desarrollo a medida"} />

      {/* Related links */}
      {relatedLinks.length > 0 && (
        <SectionWrapper className="pt-0">
          <AnimateOnScroll>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              {t(`${serviceKey}.relatedTitle`)}
            </h3>
            <ul className="mt-4 space-y-2">
              {relatedLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    href={`/${locale}/${link.path[locale]}`}
                    className="text-sm text-[var(--accent)] underline decoration-[var(--accent)]/30 underline-offset-4 transition-colors hover:text-[var(--accent)]"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </AnimateOnScroll>
        </SectionWrapper>
      )}

      {/* CTA with WhatsApp */}
      <SectionWrapper>
        <AnimateOnScroll>
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-10 text-center md:p-16">
            <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)] md:text-3xl">
              {t(ctaKey)}
            </h2>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <CTAButton href="/contacto" size="lg">
                {t("ctaButton")}
              </CTAButton>
              <a
                href="https://wa.me/56982307771"
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-[11px] border border-[var(--border-default)] bg-transparent px-8 py-4 text-base font-medium text-[var(--text-primary)] transition-all duration-200 hover:border-[#25D366] hover:text-[#25D366]"
              >
                <MessageCircle className="h-5 w-5" />
                {t("ctaWhatsApp")}
              </a>
            </div>
          </div>
        </AnimateOnScroll>
      </SectionWrapper>
    </>
  );
}
