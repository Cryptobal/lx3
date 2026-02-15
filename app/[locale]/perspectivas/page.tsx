import type { Metadata } from "next";
import { useTranslations, useLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/routing";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { ArrowUpRight } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "en" ? "Insights" : "Perspectivas",
    description:
      locale === "en"
        ? "Technical and operational analysis from our team. No marketing. No clickbait."
        : "Analisis tecnicos y operativos de nuestro equipo. Sin marketing. Sin clickbait.",
  };
}

const articles = [
  {
    slug: "herramientas-genericas-ai",
    categoryKey: "strategy",
    date: "2025-02",
    readTime: "8 min",
    titleEs: "Por que las herramientas genericas de AI no resuelven problemas especificos",
    titleEn: "Why generic AI tools don't solve specific problems",
    excerptEs:
      "Las empresas invierten en herramientas genericas esperando resultados especificos. Este desajuste explica por que el 70% de los proyectos de AI no llegan a produccion.",
    excerptEn:
      "Companies invest in generic tools expecting specific results. This mismatch explains why 70% of AI projects never make it to production.",
  },
  {
    slug: "costo-no-automatizar",
    categoryKey: "operations",
    date: "2025-01",
    readTime: "6 min",
    titleEs: "El verdadero costo de no automatizar: como calcularlo",
    titleEn: "The real cost of not automating: how to calculate it",
    excerptEs:
      "No automatizar tiene un costo compuesto que la mayoria de empresas no calculan correctamente.",
    excerptEn:
      "Not automating has a compound cost that most companies don't calculate correctly.",
  },
  {
    slug: "decision-intelligence",
    categoryKey: "technical",
    date: "2025-01",
    readTime: "10 min",
    titleEs: "Decision Intelligence: cuando tus datos existen pero no deciden",
    titleEn: "Decision Intelligence: when your data exists but doesn't decide",
    excerptEs:
      "Tus datos ya estan ahi. El problema es que no estan conectados al punto de decision.",
    excerptEn:
      "Your data is already there. The problem is it's not connected to the decision point.",
  },
];

const categoryLabels: Record<string, Record<string, string>> = {
  strategy: { es: "Estrategia AI", en: "AI Strategy" },
  operations: { es: "Operaciones", en: "Operations" },
  technical: { es: "Deep-Dive Tecnico", en: "Technical Deep-Dive" },
};

export default async function InsightsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <InsightsContent />;
}

function InsightsContent() {
  const t = useTranslations("insightsPreview");
  const locale = useLocale();
  const lang = locale === "en" ? "en" : "es";

  return (
    <SectionWrapper className="pt-32">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl dark:text-white">
          {t("title")}
        </h1>
        <p className="mt-4 text-lg text-foreground/60 dark:text-white/60">
          {t("subtitle")}
        </p>
      </div>

      <div className="mt-12 space-y-6">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/perspectivas/${article.slug}` as "/perspectivas"}
          >
            <article className="group cursor-pointer rounded-xl border border-foreground/5 p-6 transition-all hover:border-accent/20 hover:shadow-sm dark:border-white/5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs uppercase tracking-wider text-accent">
                      {categoryLabels[article.categoryKey]?.[lang] ??
                        article.categoryKey}
                    </span>
                    <span className="text-xs text-foreground/30 dark:text-white/30">
                      {article.readTime}
                    </span>
                  </div>
                  <h2 className="mt-2 text-xl font-semibold text-foreground group-hover:text-accent dark:text-white">
                    {lang === "en" ? article.titleEn : article.titleEs}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/50 dark:text-white/50">
                    {lang === "en" ? article.excerptEn : article.excerptEs}
                  </p>
                  <span className="mt-4 inline-block text-sm text-foreground/30 dark:text-white/30">
                    {article.date}
                  </span>
                </div>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-foreground/20 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent dark:text-white/20" />
              </div>
            </article>
          </Link>
        ))}
      </div>
    </SectionWrapper>
  );
}
