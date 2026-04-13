import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { AnimateOnScroll } from "@/components/shared/AnimateOnScroll";
import { JsonLd } from "@/components/shared/JsonLd";
import { ServicePageSections } from "@/components/sections/ServicePageSections";
import { CheckCircle2 } from "lucide-react";
import { SEOPageHero } from "@/components/seo-pages/SEOPageHero";
import { InlineCTA } from "@/components/seo-pages/InlineCTA";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title:
      locale === "en"
        ? "Tech Consulting | LX3"
        : "Consultoria Tecnologica | LX3",
    description:
      locale === "en"
        ? "Strategic advisory on architecture, stack selection, and digital transformation. We help mid-market companies make the right technology decisions."
        : "Consultoria estrategica en arquitectura, seleccion de tecnologia y transformacion digital. Te ayudamos a tomar las decisiones tecnologicas correctas.",
    alternates: localeAlternates(locale, "/es/servicios/consultoria", "/en/services/consulting"),
  };
}

export default async function ConsultingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ConsultingContent />;
}

function ConsultingContent() {
  const t = useTranslations("servicesPage");
  const tCotiza = useTranslations("cotizadorPage");

  const features = t.raw("consulting.features") as string[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: t("consulting.title"),
    description: t("consulting.description"),
    provider: {
      "@type": "Organization",
      name: "LX3",
      url: "https://www.lx3.ai",
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Hero */}
      <SEOPageHero
        title={t("consulting.headline")}
        subtitle={t("consulting.description")}
      />

      {/* Description + Features */}
      <SectionWrapper className="pt-0">
        <AnimateOnScroll>
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold text-[var(--text-primary)] md:text-3xl">
                {t("consulting.title")}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)]">
                {t("consulting.description")}
              </p>
            </div>
            <div>
              <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
                {t("featuresTitle")}
              </h3>
              <ul className="mt-4 space-y-3">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent)]" />
                    <span className="text-sm text-[var(--text-secondary)]">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </AnimateOnScroll>
      </SectionWrapper>

      {/* CTA to Cotizador */}
      <InlineCTA
        title={tCotiza("ctaSection.title")}
        subtitle={tCotiza("ctaSection.subtitle")}
        buttonText={tCotiza("ctaSection.button")}
      />

      <ServicePageSections
        serviceKey="consulting"
        ctaKey="ctaConsulting"
        relatedLinks={[
          { path: { es: "blog/software-a-medida-vs-saas-que-conviene", en: "blog/software-a-medida-vs-saas-que-conviene" }, labelKey: "consulting.related1Label" },
          { path: { es: "blog/no-code-low-code-vs-desarrollo-a-medida", en: "blog/no-code-low-code-vs-desarrollo-a-medida" }, labelKey: "consulting.related2Label" },
        ]}
      />
    </>
  );
}
