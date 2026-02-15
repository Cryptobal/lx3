import { useTranslations } from "next-intl";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { AlertTriangle, Users, Puzzle } from "lucide-react";

const icons = [AlertTriangle, Users, Puzzle];

export function ProblemStatement() {
  const t = useTranslations("problem");

  const pains = [
    { title: t("pain1Title"), desc: t("pain1Desc") },
    { title: t("pain2Title"), desc: t("pain2Desc") },
    { title: t("pain3Title"), desc: t("pain3Desc") },
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

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {pains.map((pain, i) => {
          const Icon = icons[i];
          return (
            <div
              key={i}
              className="rounded-xl border border-foreground/5 bg-foreground/[0.02] p-6 dark:border-white/5 dark:bg-white/[0.02]"
            >
              <Icon className="h-5 w-5 text-foreground/30 dark:text-white/30" />
              <h3 className="mt-4 text-base font-medium text-foreground dark:text-white">
                {pain.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/50 dark:text-white/50">
                {pain.desc}
              </p>
            </div>
          );
        })}
      </div>

      <p className="mt-12 text-lg font-medium text-foreground dark:text-white">
        {t("pivot")}
      </p>
    </SectionWrapper>
  );
}
