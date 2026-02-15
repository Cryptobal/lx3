import { useTranslations } from "next-intl";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { ProgressiveDisclosure } from "@/components/shared/ProgressiveDisclosure";
import { Workflow, BrainCircuit, Users, Blocks } from "lucide-react";

const capIcons = [Workflow, BrainCircuit, Users, Blocks];

export function CapabilitiesShowcase() {
  const t = useTranslations("capabilities");

  const caps = [
    {
      title: t("cap1Title"),
      problem: t("cap1Problem"),
      approach: t("cap1Approach"),
      impact: t("cap1Impact"),
    },
    {
      title: t("cap2Title"),
      problem: t("cap2Problem"),
      approach: t("cap2Approach"),
      impact: t("cap2Impact"),
    },
    {
      title: t("cap3Title"),
      problem: t("cap3Problem"),
      approach: t("cap3Approach"),
      impact: t("cap3Impact"),
    },
    {
      title: t("cap4Title"),
      problem: t("cap4Problem"),
      approach: t("cap4Approach"),
      impact: t("cap4Impact"),
    },
  ];

  return (
    <SectionWrapper>
      <div className="max-w-2xl">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl dark:text-white">
          {t("title")}
        </h2>
        <p className="mt-4 text-lg text-foreground/60 dark:text-white/60">
          {t("subtitle")}
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {caps.map((cap, i) => {
          const Icon = capIcons[i];
          return (
            <div
              key={i}
              className="rounded-xl border border-foreground/5 p-6 dark:border-white/5"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 dark:bg-accent/20">
                  <Icon className="h-5 w-5 text-accent" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-foreground dark:text-white">
                    {cap.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/50 dark:text-white/50">
                    {cap.problem}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <ProgressiveDisclosure
                  trigger={
                    <span className="text-accent">
                      Ver enfoque y resultado
                    </span>
                  }
                >
                  <div className="space-y-3">
                    <div>
                      <span className="font-mono text-xs uppercase tracking-wider text-foreground/30 dark:text-white/30">
                        Enfoque
                      </span>
                      <p className="mt-1">{cap.approach}</p>
                    </div>
                    <div>
                      <span className="font-mono text-xs uppercase tracking-wider text-foreground/30 dark:text-white/30">
                        Impacto
                      </span>
                      <p className="mt-1">{cap.impact}</p>
                    </div>
                  </div>
                </ProgressiveDisclosure>
              </div>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
