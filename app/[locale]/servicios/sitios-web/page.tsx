import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { AnimateOnScroll } from "@/components/shared/AnimateOnScroll";
import { CTAButton } from "@/components/shared/CTAButton";
import { JsonLd } from "@/components/shared/JsonLd";
import { CheckCircle2 } from "lucide-react";

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

  const features = t.raw("websites.features") as string[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: t("websites.title"),
    description: t("websites.description"),
    provider: {
      "@type": "Organization",
      name: "LX3",
      url: "https://lx3.ai",
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Hero */}
      <SectionWrapper className="pt-32">
        <div className="max-w-3xl">
          <AnimateOnScroll>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-[var(--text-primary)] md:text-5xl">
              {t("websites.headline")}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-[var(--text-secondary)]">
              {t("websites.description")}
            </p>
          </AnimateOnScroll>
        </div>
      </SectionWrapper>

      {/* Description + Features */}
      <SectionWrapper className="pt-0">
        <AnimateOnScroll>
          <div className="grid gap-12 md:grid-cols-2">
            {/* Left: extended description */}
            <div>
              <h2 className="text-2xl font-semibold text-[var(--text-primary)] md:text-3xl">
                {t("websites.title")}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)]">
                {t("websites.description")}
              </p>
            </div>

            {/* Right: features */}
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

      {/* CTA */}
      <SectionWrapper>
        <AnimateOnScroll>
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-10 text-center md:p-16">
            <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)] md:text-3xl">
              {t("ctaWebsites")}
            </h2>
            <div className="mt-8">
              <CTAButton href="/contacto" size="lg">
                {t("ctaButton")}
              </CTAButton>
            </div>
          </div>
        </AnimateOnScroll>
      </SectionWrapper>
    </>
  );
}
