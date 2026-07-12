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
        ? "AI Automation | LX3"
        : "Automatizacion con IA | LX3",
    description:
      locale === "en"
        ? "AI-powered workflows that automate document processing, decision-making, and data extraction. Built on your data, integrated with your systems."
        : "Automatizacion inteligente con IA: procesamiento de documentos, decisiones automaticas, chatbots especializados e integracion de LLMs en tus flujos de trabajo.",
    alternates: localeAlternates(locale, "/es/servicios/automatizacion-ia", "/en/services/ai-automation"),
  };
}

export default async function AiAutomationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AiAutomationContent />;
}

function AiAutomationContent() {
  const t = useTranslations("servicesPage");
  const tCotiza = useTranslations("cotizadorPage");

  const features = t.raw("aiAutomation.features") as string[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: t("aiAutomation.title"),
    description: t("aiAutomation.description"),
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
        title={t("aiAutomation.headline")}
        subtitle={t("aiAutomation.description")}
      />

      {/* Description + Features */}
      <SectionWrapper className="pt-0">
        <AnimateOnScroll>
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold text-[var(--text-primary)] md:text-3xl">
                {t("aiAutomation.title")}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)]">
                {t("aiAutomation.description")}
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
        serviceKey="aiAutomation"
        serviceName="Automatización con IA"
        ctaKey="ctaAiAutomation"
        relatedLinks={[
          { path: { es: "blog/agentes-de-ia-para-empresas-casos-uso", en: "blog/agentes-de-ia-para-empresas-casos-uso" }, labelKey: "aiAutomation.related1Label" },
          { path: { es: "blog/automatizacion-procesos-inteligencia-artificial-empresas", en: "blog/automatizacion-procesos-inteligencia-artificial-empresas" }, labelKey: "aiAutomation.related2Label" },
          { path: { es: "casos/opai-gard-security", en: "cases/opai-gard-security" }, labelKey: "aiAutomation.related3Label" },
        ]}
      />
    </>
  );
}
