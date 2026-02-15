import { useTranslations } from "next-intl";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { CTAButton } from "@/components/shared/CTAButton";
import { ArrowUpRight } from "lucide-react";

export function InsightsPreview() {
  const t = useTranslations("insightsPreview");

  // Placeholder articles - these would come from MDX/CMS later
  const articles = [
    {
      title: "Por qué las herramientas genéricas de AI no resuelven problemas específicos",
      category: "Estrategia AI",
      date: "2025-02",
    },
    {
      title: "El verdadero costo de no automatizar: cómo calcularlo",
      category: "Operaciones",
      date: "2025-01",
    },
    {
      title: "Decision Intelligence: cuando tus datos existen pero no deciden",
      category: "Deep-Dive Técnico",
      date: "2025-01",
    },
  ];

  return (
    <SectionWrapper variant="accent">
      <div className="flex items-end justify-between">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl dark:text-white">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-foreground/60 dark:text-white/60">
            {t("subtitle")}
          </p>
        </div>
        <div className="hidden md:block">
          <CTAButton href="/perspectivas" variant="ghost">
            {t("cta")}
          </CTAButton>
        </div>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {articles.map((article, i) => (
          <article
            key={i}
            className="group cursor-pointer rounded-xl border border-foreground/5 bg-background p-6 transition-all hover:border-accent/20 hover:shadow-sm dark:border-white/5 dark:bg-primary/50"
          >
            <span className="font-mono text-xs uppercase tracking-wider text-accent">
              {article.category}
            </span>
            <h3 className="mt-3 text-base font-medium leading-snug text-foreground group-hover:text-accent dark:text-white">
              {article.title}
            </h3>
            <div className="mt-4 flex items-center gap-1 text-sm text-foreground/40 dark:text-white/40">
              <span>{article.date}</span>
              <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 md:hidden">
        <CTAButton href="/perspectivas" variant="ghost">
          {t("cta")}
        </CTAButton>
      </div>
    </SectionWrapper>
  );
}
