import { useTranslations } from "next-intl";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { Lightbulb } from "lucide-react";

export function DepthIndicators() {
  const t = useTranslations("depth");

  const patterns = [
    { title: t("pattern1Title"), desc: t("pattern1Desc") },
    { title: t("pattern2Title"), desc: t("pattern2Desc") },
    { title: t("pattern3Title"), desc: t("pattern3Desc") },
  ];

  return (
    <SectionWrapper>
      <div className="max-w-2xl">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl dark:text-white">
          {t("title")}
        </h2>
      </div>

      <div className="mt-12 space-y-6">
        {patterns.map((pattern, i) => (
          <div
            key={i}
            className="flex gap-5 rounded-xl border border-foreground/5 p-6 dark:border-white/5"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 dark:bg-accent/20">
              <Lightbulb className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="text-base font-medium text-foreground dark:text-white">
                {pattern.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/50 dark:text-white/50">
                {pattern.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
