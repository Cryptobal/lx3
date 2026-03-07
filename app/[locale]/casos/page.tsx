import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/routing";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { AnimateOnScroll } from "@/components/shared/AnimateOnScroll";
import { ArrowUpRight } from "lucide-react";

const cases = [
  {
    key: "opai" as const,
    href: "/casos/opai-gard-security" as const,
  },
  {
    key: "gard" as const,
    href: "/casos/gard-sitio-web" as const,
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return {
    title: isEn ? "Cases | LX3" : "Casos de Éxito | LX3",
    description: isEn
      ? "Real projects with measurable results. See what we have built for our clients."
      : "Proyectos reales con resultados medibles. Conoce lo que hemos construido para nuestros clientes.",
    openGraph: {
      title: isEn ? "Cases | LX3" : "Casos de Éxito | LX3",
      description: isEn
        ? "Real projects with measurable results."
        : "Proyectos reales con resultados medibles.",
      type: "website",
      locale: isEn ? "en_US" : "es_CL",
      siteName: "LX3",
    },
  };
}

export default async function CasesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <CasesContent />;
}

function CasesContent() {
  const t = useTranslations("casesPage");

  return (
    <SectionWrapper className="pt-32">
      <AnimateOnScroll>
        <div className="max-w-3xl">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-[var(--text-primary)] md:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-[var(--text-secondary)]">
            {t("subtitle")}
          </p>
        </div>
      </AnimateOnScroll>

      <div className="mt-16 grid gap-8 md:grid-cols-2">
        {cases.map((caseItem, i) => (
          <AnimateOnScroll key={caseItem.key} delay={i * 0.15}>
            <Link href={caseItem.href}>
              <article className="group relative flex h-full flex-col rounded-2xl border border-[var(--border-subtle)] bg-surface-elevated p-8 transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)] transition-colors group-hover:text-accent">
                      {t(`${caseItem.key}.title`)}
                    </h2>
                    <p className="mt-2 text-sm font-medium text-accent/80">
                      {t(`${caseItem.key}.subtitle`)}
                    </p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-[var(--text-tertiary)] transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
                </div>

                <p className="mt-6 flex-1 text-base leading-relaxed text-[var(--text-secondary)]">
                  {t(`${caseItem.key}.description`)}
                </p>

                <div className="mt-8 border-t border-[var(--border-subtle)] pt-6">
                  <span className="text-sm font-medium text-[var(--text-tertiary)] transition-colors group-hover:text-accent/70">
                    {t(`${caseItem.key}.subtitle`)}
                  </span>
                </div>
              </article>
            </Link>
          </AnimateOnScroll>
        ))}
      </div>
    </SectionWrapper>
  );
}
