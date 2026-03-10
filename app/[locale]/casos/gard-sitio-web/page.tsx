import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/routing";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { AnimateOnScroll } from "@/components/shared/AnimateOnScroll";
import { CTAButton } from "@/components/shared/CTAButton";
import { JsonLd } from "@/components/shared/JsonLd";
import { ArrowLeft, AlertTriangle, Lightbulb, TrendingUp } from "lucide-react";

const GARD_WEBSITE_URL = "https://gard.cl";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  const title = isEn
    ? "Gard Security — Corporate Website | LX3"
    : "Gard Security — Sitio Web Corporativo | LX3";
  const description = isEn
    ? "A modern, high-performance corporate website designed to position Gard as a leading security company in Chile."
    : "Sitio web corporativo moderno y de alto rendimiento, diseñado para posicionar a Gard como empresa líder en seguridad en Chile.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      locale: isEn ? "en_US" : "es_CL",
      siteName: "LX3",
    },
  };
}

export default async function GardWebsiteCasePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <GardWebsiteCaseContent locale={locale} />;
}

function GardWebsiteCaseContent({ locale }: { locale: string }) {
  const t = useTranslations("casesPage");

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Article",
    additionalType: "CaseStudy",
    headline: t("gard.title"),
    description: t("gard.description"),
    author: {
      "@type": "Organization",
      name: "LX3 Software Studio",
      url: "https://lx3.ai",
    },
    publisher: {
      "@type": "Organization",
      name: "LX3 Software Studio",
      url: "https://lx3.ai",
    },
    inLanguage: locale === "en" ? "en" : "es",
  };

  const sections = [
    {
      key: "challenge",
      icon: AlertTriangle,
      titleKey: "challengeTitle" as const,
      contentKey: "gard.challenge" as const,
    },
    {
      key: "solution",
      icon: Lightbulb,
      titleKey: "solutionTitle" as const,
      contentKey: "gard.solution" as const,
    },
    {
      key: "results",
      icon: TrendingUp,
      titleKey: "resultsTitle" as const,
      contentKey: "gard.results" as const,
    },
  ];

  return (
    <>
      <JsonLd data={jsonLdData} />

      {/* Hero */}
      <SectionWrapper className="pt-32 pb-12">
        <AnimateOnScroll>
          <Link
            href="/casos"
            className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-primary)]"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("backToCases")}
          </Link>

          <div className="max-w-3xl">
            <h1 className="font-display text-4xl font-semibold tracking-tight text-[var(--text-primary)] md:text-5xl">
              <a
                href={GARD_WEBSITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-accent hover:underline"
              >
                {t("gard.title")}
              </a>
            </h1>
            <p className="mt-4 text-lg text-accent/80">
              {t("gard.subtitle")}
            </p>
            <p className="mt-6 text-base leading-relaxed text-[var(--text-secondary)]">
              {t("gard.description")}
            </p>
          </div>
        </AnimateOnScroll>
      </SectionWrapper>

      {/* Challenge / Solution / Results */}
      <SectionWrapper className="py-12">
        <div className="space-y-16">
          {sections.map((section, i) => {
            const Icon = section.icon;
            return (
              <AnimateOnScroll key={section.key} delay={i * 0.1}>
                <div className="rounded-2xl border border-[var(--border-subtle)] bg-surface-elevated p-8 md:p-10">
                  <div className="flex items-start gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                      <Icon className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] md:text-2xl">
                        {t(section.titleKey)}
                      </h2>
                      <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)]">
                        {t(section.contentKey)}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>
      </SectionWrapper>

      {/* CTA */}
      <SectionWrapper className="py-20">
        <AnimateOnScroll>
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-surface-elevated/50 p-10 text-center md:p-16">
            <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)] md:text-3xl">
              {t("ctaTitle")}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-[var(--text-secondary)]">
              {t("ctaSubtitle")}
            </p>
            <div className="mt-8">
              <CTAButton href="/contacto" variant="primary" size="lg">
                {t("ctaButton")}
              </CTAButton>
            </div>
          </div>
        </AnimateOnScroll>
      </SectionWrapper>
    </>
  );
}
