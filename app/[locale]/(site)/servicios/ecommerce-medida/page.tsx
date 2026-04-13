import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/shared/JsonLd";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { AnimateOnScroll } from "@/components/shared/AnimateOnScroll";
import { SEOPageHero } from "@/components/seo-pages/SEOPageHero";
import { FAQSection } from "@/components/seo-pages/FAQSection";
import { InlineCTA } from "@/components/seo-pages/InlineCTA";
import { Link } from "@/lib/i18n/routing";
import { CheckCircle2 } from "lucide-react";
import { getServicePageData } from "@/data/service-pages";
import { localeAlternates, SERVICE_EN_SLUGS } from "@/lib/seo";

const SLUG = "ecommerce-medida";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const data = getServicePageData(SLUG);
  if (!data) return {};

  const enSlug = SERVICE_EN_SLUGS[SLUG] ?? SLUG;
  return {
    title: `${data.title} | LX3`,
    description: data.subtitle,
    alternates: localeAlternates(locale, `/es/servicios/${SLUG}`, `/en/services/${enSlug}`),
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const data = getServicePageData(SLUG);
  if (!data) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: data.title,
    description: data.subtitle,
    provider: {
      "@type": "Organization",
      name: "LX3",
      url: "https://www.lx3.ai",
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      <SEOPageHero
        title={data.title}
        titleAccent={data.titleAccent}
        subtitle={data.subtitle}
        priceRange={data.priceRange}
      />

      {/* Description */}
      <SectionWrapper className="pt-0">
        <AnimateOnScroll>
          <div className="max-w-3xl">
            <p className="text-base leading-relaxed text-[var(--text-secondary)] whitespace-pre-line">
              {data.description}
            </p>
          </div>
        </AnimateOnScroll>
      </SectionWrapper>

      {/* Features */}
      <SectionWrapper>
        <AnimateOnScroll>
          <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] md:text-3xl">
            Lo que incluye
          </h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {data.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--coral)]" />
                <span className="text-sm text-[var(--text-secondary)]">{feature}</span>
              </li>
            ))}
          </ul>
        </AnimateOnScroll>
      </SectionWrapper>

      {/* For who */}
      <SectionWrapper>
        <AnimateOnScroll>
          <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] md:text-3xl">
            ¿Para quién es este servicio?
          </h2>
          <ul className="mt-6 space-y-3">
            {data.forWho.map((profile, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent)]" />
                <span className="text-sm text-[var(--text-secondary)]">{profile}</span>
              </li>
            ))}
          </ul>
        </AnimateOnScroll>
      </SectionWrapper>

      {/* Process */}
      <SectionWrapper>
        <AnimateOnScroll>
          <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] md:text-3xl">
            Nuestro proceso
          </h2>
          <ol className="mt-6 space-y-4">
            {data.process.map((step, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--coral-light)] text-sm font-bold text-[var(--coral)]">
                  {i + 1}
                </span>
                <span className="pt-1 text-sm text-[var(--text-secondary)]">{step}</span>
              </li>
            ))}
          </ol>
        </AnimateOnScroll>
      </SectionWrapper>

      {/* Tech stack */}
      <SectionWrapper>
        <AnimateOnScroll>
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6">
            <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
              Stack tecnológico
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
              {data.techStack}
            </p>
          </div>
        </AnimateOnScroll>
      </SectionWrapper>

      {/* FAQs */}
      <FAQSection faqs={data.faqs} />

      {/* Related services */}
      <SectionWrapper>
        <AnimateOnScroll>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            Servicios relacionados
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {data.relatedServices.map((service, i) => (
              <Link
                key={i}
                href={service.href as "/"}
                className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-2 text-sm text-[var(--text-secondary)] transition-all hover:border-[var(--coral)]/40 hover:text-[var(--coral)]"
              >
                {service.label}
              </Link>
            ))}
          </div>
        </AnimateOnScroll>
      </SectionWrapper>

      {/* CTA */}
      <InlineCTA title={data.ctaTitle} />
    </>
  );
}
