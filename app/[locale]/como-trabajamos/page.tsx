import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { CTAButton } from "@/components/shared/CTAButton";
import { Search, PenTool, Code2, BarChart3 } from "lucide-react";

const phaseIcons = [Search, PenTool, Code2, BarChart3];
const phaseKeys = ["phase1", "phase2", "phase3", "phase4"] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "en" ? "How We Work" : "Como trabajamos",
    description:
      locale === "en"
        ? "Four phases with concrete deliverables. From diagnostic to production system, no surprises."
        : "Cuatro fases con entregables concretos. Del diagnostico al sistema en produccion, sin sorpresas.",
  };
}

export default async function HowWeWorkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HowWeWorkContent />;
}

function HowWeWorkContent() {
  const t = useTranslations("howWeWork");

  return (
    <>
      <SectionWrapper className="pt-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl dark:text-white">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-foreground/60 dark:text-white/60">
            {t("subtitle")}
          </p>
          <p className="mt-6 text-base leading-relaxed text-foreground/50 dark:text-white/50">
            {t("intro")}
          </p>
        </div>
      </SectionWrapper>

      {phaseKeys.map((phase, i) => {
        const Icon = phaseIcons[i];
        const isEven = i % 2 === 0;

        return (
          <SectionWrapper
            key={phase}
            variant={isEven ? "default" : "accent"}
          >
            <div className="grid gap-8 md:grid-cols-2 md:items-start">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 dark:bg-accent/20">
                    <Icon className="h-6 w-6 text-accent" />
                  </div>
                  <span className="font-mono text-sm text-foreground/30 dark:text-white/30">
                    0{i + 1}
                  </span>
                </div>
                <h2 className="mt-4 text-2xl font-semibold text-foreground md:text-3xl dark:text-white">
                  {t(`${phase}Title`)}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-foreground/60 dark:text-white/60">
                  {t(`${phase}What`)}
                </p>
              </div>

              <div className="space-y-4 rounded-xl border border-foreground/5 bg-background p-6 dark:border-white/5 dark:bg-primary/50">
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-foreground/30 dark:text-white/30">
                    {t("labelWho")}
                  </span>
                  <p className="mt-1 text-sm text-foreground/60 dark:text-white/60">
                    {t(`${phase}Who`)}
                  </p>
                </div>
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-foreground/30 dark:text-white/30">
                    {t("labelDeliverable")}
                  </span>
                  <p className="mt-1 text-sm text-foreground/60 dark:text-white/60">
                    {t(`${phase}Deliverable`)}
                  </p>
                </div>
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-foreground/30 dark:text-white/30">
                    {t("labelTimeline")}
                  </span>
                  <p className="mt-1 text-sm text-foreground/60 dark:text-white/60">
                    {t(`${phase}Timeline`)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <CTAButton href="/diagnostico" variant="ghost">
                {t("cta")}
              </CTAButton>
            </div>
          </SectionWrapper>
        );
      })}
    </>
  );
}
