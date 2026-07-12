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
        ? "Websites & Digital Platforms | LX3"
        : "Sitios Web | LX3",
    description:
      locale === "en"
        ? "High-performance, SEO-optimized websites and web applications. Designed to convert visitors, communicate your brand, and scale with your growth."
        : "Sitios web rapidos, modernos y optimizados para SEO. Disenados para convertir visitantes en clientes y escalar con tu negocio.",
    alternates: localeAlternates(locale, "/es/servicios/sitios-web", "/en/services/websites"),
  };
}

export default async function WebsitesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <WebsitesContent />;
}

function WebsitesContent() {
  const t = useTranslations("servicesPage");
  const tCotiza = useTranslations("cotizadorPage");

  const features = t.raw("websites.features") as string[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: t("websites.title"),
    description: t("websites.description"),
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
        title={t("websites.headline")}
        subtitle={t("websites.description")}
      />

      {/* Description + Features */}
      <SectionWrapper className="pt-0">
        <AnimateOnScroll>
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold text-[var(--text-primary)] md:text-3xl">
                {t("websites.title")}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)]">
                {t("websites.description")}
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
        serviceKey="websites"
        ctaKey="ctaWebsites"
        serviceName="Sitios web profesionales"
        showPricing
        priceRange="Desde $490.000 CLP"
        relatedLinks={[
          { path: { es: "blog/como-elegir-empresa-desarrollo-software", en: "blog/como-elegir-empresa-desarrollo-software" }, labelKey: "websites.related1Label" },
          { path: { es: "casos/gard-sitio-web", en: "cases/gard-website" }, labelKey: "websites.related2Label" },
        ]}
      />
    </>
  );
}
