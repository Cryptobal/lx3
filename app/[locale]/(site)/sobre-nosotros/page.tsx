import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { AnimateOnScroll } from "@/components/shared/AnimateOnScroll";
import { CTAButton } from "@/components/shared/CTAButton";
import { JsonLd } from "@/components/shared/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "en" ? "About Us | LX3" : "Nosotros | LX3",
    description:
      locale === "en"
        ? "A software studio, not a consultancy. We build, we ship, we stay as your technology partner."
        : "Un estudio de software, no una consultora. Construimos, entregamos y nos quedamos como tu partner tecnologico.",
  };
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "LX3",
  url: "https://www.lx3.ai",
  logo: "https://www.lx3.ai/logo/LX3_isotipo_512.png",
  description:
    "Estudio de software que disena y construye aplicaciones inteligentes para empresas.",
  foundingDate: "2024",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Santiago",
    addressCountry: "CL",
  },
  contactPoint: {
    "@type": "ContactPoint",
    email: "contacto@lx3.ai",
    contactType: "sales",
  },
};

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <JsonLd data={organizationSchema} />
      <AboutContent />
    </>
  );
}

function AboutContent() {
  const t = useTranslations("aboutPage");

  const principles = [
    {
      key: "p1",
      title: t("p1Title"),
      desc: t("p1Desc"),
      icon: (
        <svg
          className="h-6 w-6 text-[var(--accent)]"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
          />
        </svg>
      ),
    },
    {
      key: "p2",
      title: t("p2Title"),
      desc: t("p2Desc"),
      icon: (
        <svg
          className="h-6 w-6 text-[var(--accent)]"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
          />
        </svg>
      ),
    },
    {
      key: "p3",
      title: t("p3Title"),
      desc: t("p3Desc"),
      icon: (
        <svg
          className="h-6 w-6 text-[var(--accent)]"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
          />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Hero */}
      <SectionWrapper className="pt-32 pb-16">
        <AnimateOnScroll>
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-widest text-[var(--accent)]">
              {t("title")}
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-[var(--text-primary)] md:text-5xl lg:text-6xl">
              {t("headline")}
            </h1>
          </div>
        </AnimateOnScroll>

        <div className="mt-12 max-w-3xl space-y-6">
          <AnimateOnScroll delay={0.1}>
            <p className="text-lg leading-relaxed text-[var(--text-secondary)] md:text-xl">
              {t("mission")}
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll delay={0.2}>
            <p className="text-lg leading-relaxed text-[var(--text-secondary)] md:text-xl">
              {t("philosophy")}
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll delay={0.3}>
            <h2 className="mt-10 text-xl font-semibold text-[var(--text-primary)]">
              {t("differentiatorsTitle")}
            </h2>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-3 text-[var(--text-secondary)]">
                <span className="h-1.5 w-1.5 mt-2 shrink-0 rounded-full bg-[var(--accent)]" />
                {t("diff1")}
              </li>
              <li className="flex items-start gap-3 text-[var(--text-secondary)]">
                <span className="h-1.5 w-1.5 mt-2 shrink-0 rounded-full bg-[var(--accent)]" />
                {t("diff2")}
              </li>
            </ul>
          </AnimateOnScroll>
          <AnimateOnScroll delay={0.4}>
            <div className="mt-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6">
              <p className="text-sm text-[var(--text-tertiary)]">{t("techStack")}</p>
              <p className="mt-2 text-sm font-medium text-[var(--text-primary)]">{t("location")}</p>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll delay={0.5}>
            <p className="text-lg leading-relaxed text-[var(--text-secondary)] md:text-xl">
              {t("thesis1")}
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll delay={0.6}>
            <p className="text-lg leading-relaxed text-[var(--text-secondary)] md:text-xl">
              {t("thesis2")}
            </p>
          </AnimateOnScroll>
        </div>
      </SectionWrapper>

      {/* Principles */}
      <SectionWrapper className="py-20">
        <AnimateOnScroll>
          <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)] md:text-3xl">
            {t("principlesTitle")}
          </h2>
        </AnimateOnScroll>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {principles.map((principle, i) => (
            <AnimateOnScroll key={principle.key} delay={0.1 * (i + 1)}>
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-8 transition-colors hover:border-[var(--border-default)] hover:bg-[var(--bg-surface)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--accent)]/10">
                  {principle.icon}
                </div>
                <h3 className="mt-6 font-display text-lg font-semibold text-[var(--text-primary)]">
                  {principle.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {principle.desc}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </SectionWrapper>

      {/* CTA */}
      <SectionWrapper className="py-20">
        <AnimateOnScroll>
          <div className="flex flex-col items-center text-center">
            <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)] md:text-3xl">
              {t("principlesTitle") === "Principles"
                ? "Ready to build together?"
                : "Construyamos juntos"}
            </h2>
            <p className="mt-4 max-w-xl text-[var(--text-secondary)]">
              {t("principlesTitle") === "Principles"
                ? "Tell us about your project. We respond within 24 hours with an honest assessment."
                : "Cuentanos tu proyecto. Respondemos en menos de 24 horas con una evaluacion honesta."}
            </p>
            <div className="mt-8">
              <CTAButton href="/contacto" variant="primary" size="lg">
                {t("principlesTitle") === "Principles"
                  ? "Get in touch"
                  : "Hablemos"}
              </CTAButton>
            </div>
          </div>
        </AnimateOnScroll>
      </SectionWrapper>
    </>
  );
}
