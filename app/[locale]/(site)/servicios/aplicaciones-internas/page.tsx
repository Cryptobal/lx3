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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title:
      locale === "en"
        ? "Custom Internal Apps | LX3"
        : "Aplicaciones Internas a Medida | LX3",
    description:
      locale === "en"
        ? "We build tailored internal platforms: ERPs, CRMs, dashboards, and management systems designed around how your business actually operates."
        : "Construimos aplicaciones internas a medida: ERPs, CRMs, dashboards y sistemas de gestion disenados para tu flujo de trabajo especifico.",
  };
}

export default async function InternalAppsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <InternalAppsContent />;
}

function InternalAppsContent() {
  const t = useTranslations("servicesPage");
  const tCotiza = useTranslations("cotizadorPage");

  const features = t.raw("internalApps.features") as string[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: t("internalApps.title"),
    description: t("internalApps.description"),
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
        title={t("internalApps.headline")}
        subtitle={t("internalApps.description")}
      />

      {/* Description + Features */}
      <SectionWrapper className="pt-0">
        <AnimateOnScroll>
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold text-[var(--text-primary)] md:text-3xl">
                {t("internalApps.title")}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)]">
                {t("internalApps.description")}
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
        serviceKey="internalApps"
        ctaKey="ctaInternalApps"
        relatedLinks={[
          { path: { es: "blog/erp-a-medida-vs-sap-vs-odoo-comparativa", en: "blog/erp-a-medida-vs-sap-vs-odoo-comparativa" }, labelKey: "internalApps.related1Label" },
          { path: { es: "blog/cuanto-cuesta-desarrollo-software-a-medida", en: "blog/cuanto-cuesta-desarrollo-software-a-medida" }, labelKey: "internalApps.related2Label" },
          { path: { es: "casos/opai-gard-security", en: "cases/opai-gard-security" }, labelKey: "internalApps.related3Label" },
        ]}
      />
    </>
  );
}
