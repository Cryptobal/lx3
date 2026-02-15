import { useTranslations } from "next-intl";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { CTAButton } from "@/components/shared/CTAButton";
import { Search, PenTool, Code2, BarChart3 } from "lucide-react";

const phaseIcons = [Search, PenTool, Code2, BarChart3];

export function MethodologyPreview() {
  const t = useTranslations("methodology");

  const phases = [
    { title: t("phase1Title"), desc: t("phase1Desc"), num: "01" },
    { title: t("phase2Title"), desc: t("phase2Desc"), num: "02" },
    { title: t("phase3Title"), desc: t("phase3Desc"), num: "03" },
    { title: t("phase4Title"), desc: t("phase4Desc"), num: "04" },
  ];

  return (
    <SectionWrapper variant="accent">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl dark:text-white">
          {t("title")}
        </h2>
        <p className="mt-4 text-lg text-foreground/60 dark:text-white/60">
          {t("subtitle")}
        </p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-4">
        {phases.map((phase, i) => {
          const Icon = phaseIcons[i];
          return (
            <div key={i} className="relative">
              {/* Connector line */}
              {i < 3 && (
                <div className="absolute right-0 top-8 hidden h-px w-full translate-x-1/2 bg-foreground/10 md:block dark:bg-white/10" />
              )}
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 dark:bg-accent/20">
                  <Icon className="h-5 w-5 text-accent" />
                </div>
                <span className="mt-4 block font-mono text-xs text-foreground/30 dark:text-white/30">
                  {phase.num}
                </span>
                <h3 className="mt-1 text-base font-medium text-foreground dark:text-white">
                  {phase.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/50 dark:text-white/50">
                  {phase.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12">
        <CTAButton href="/como-trabajamos" variant="secondary">
          {t("cta")}
        </CTAButton>
      </div>
    </SectionWrapper>
  );
}
