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

  const features = t.raw("internalApps.features") as string[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: t("internalApps.title"),
    description: t("internalApps.description"),
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
            <h1 className="font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">
              {t("internalApps.headline")}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/60">
              {t("internalApps.description")}
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
              <h2 className="text-2xl font-semibold text-white md:text-3xl">
                {t("internalApps.title")}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-white/50">
                {t("internalApps.description")}
              </p>
            </div>

            {/* Right: features */}
            <div>
              <h3 className="font-mono text-xs uppercase tracking-wider text-white/30">
                {t("featuresTitle")}
              </h3>
              <ul className="mt-4 space-y-3">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />
                    <span className="text-sm text-white/70">{feature}</span>
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
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-10 text-center md:p-16">
            <h2 className="font-display text-2xl font-semibold text-white md:text-3xl">
              {t("ctaInternalApps")}
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
