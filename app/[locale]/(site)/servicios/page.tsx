import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { AnimateOnScroll } from "@/components/shared/AnimateOnScroll";
import { JsonLd } from "@/components/shared/JsonLd";
import { Link } from "@/lib/i18n/routing";
import { Blocks, BrainCircuit, Globe, MessageSquare } from "lucide-react";
import { ArrowRight } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "en" ? "Services | LX3" : "Servicios | LX3",
    description:
      locale === "en"
        ? "Custom internal apps, AI automation, websites, and tech consulting. Four specialized services for growing businesses."
        : "Aplicaciones internas a medida, automatizacion con IA, sitios web y consultoria tecnologica. Cuatro servicios especializados para empresas que quieren crecer.",
  };
}

const serviceCards = [
  {
    key: "internalApps" as const,
    href: "/servicios/aplicaciones-internas" as const,
    Icon: Blocks,
    titleKey: "s1Title",
    descKey: "s1Desc",
  },
  {
    key: "aiAutomation" as const,
    href: "/servicios/automatizacion-ia" as const,
    Icon: BrainCircuit,
    titleKey: "s2Title",
    descKey: "s2Desc",
  },
  {
    key: "websites" as const,
    href: "/servicios/sitios-web" as const,
    Icon: Globe,
    titleKey: "s3Title",
    descKey: "s3Desc",
  },
  {
    key: "consulting" as const,
    href: "/servicios/consultoria" as const,
    Icon: MessageSquare,
    titleKey: "s4Title",
    descKey: "s4Desc",
  },
];

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ServicesContent />;
}

function ServicesContent() {
  const t = useTranslations("servicesPage");
  const tServices = useTranslations("services");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "LX3 Software Studio — Services",
    provider: {
      "@type": "Organization",
      name: "LX3",
      url: "https://www.lx3.ai",
    },
    description: t("subtitle"),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services",
      itemListElement: serviceCards.map((s, i) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: tServices(s.titleKey),
          description: tServices(s.descKey),
        },
        position: i + 1,
      })),
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Hero */}
      <SectionWrapper className="pt-32">
        <div className="max-w-3xl">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-[var(--text-primary)] md:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-[var(--text-secondary)]">
            {t("subtitle")}
          </p>
          <p className="mt-6 text-base leading-relaxed text-[var(--text-tertiary)]">
            {t("intro")}
          </p>
        </div>
      </SectionWrapper>

      {/* Service Cards */}
      <SectionWrapper className="pt-0">
        <div className="grid gap-6 md:grid-cols-2">
          {serviceCards.map((service, i) => {
            const { Icon } = service;
            return (
              <AnimateOnScroll key={service.key} delay={i * 0.1}>
                <Link
                  href={service.href}
                  className="group flex h-full flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-8 transition-all duration-300 hover:border-[var(--border-default)] hover:bg-[var(--bg-surface)]"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)]/10">
                      <Icon className="h-6 w-6 text-[var(--accent)]" />
                    </div>
                    <span className="font-mono text-sm text-[var(--text-tertiary)]">
                      0{i + 1}
                    </span>
                  </div>

                  <h2 className="mt-5 text-xl font-semibold text-[var(--text-primary)]">
                    {tServices(service.titleKey)}
                  </h2>

                  <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {tServices(service.descKey)}
                  </p>

                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)] transition-colors group-hover:text-[var(--accent)]">
                    {t("learnMore")}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </AnimateOnScroll>
            );
          })}
        </div>
      </SectionWrapper>
    </>
  );
}
