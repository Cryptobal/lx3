import { useTranslations } from "next-intl";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { cn } from "@/lib/utils/cn";

export function FactoryModel() {
  const t = useTranslations("factory");

  const models = [
    {
      title: t("agencyTitle"),
      desc: t("agencyDesc"),
      highlight: false,
    },
    {
      title: t("consultancyTitle"),
      desc: t("consultancyDesc"),
      highlight: false,
    },
    {
      title: t("factoryTitle"),
      desc: t("factoryDesc"),
      highlight: true,
    },
  ];

  return (
    <SectionWrapper id="modelo">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl dark:text-white">
          {t("title")}
        </h2>
        <p className="mt-4 text-lg text-foreground/60 dark:text-white/60">
          {t("subtitle")}
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {models.map((model, i) => (
          <div
            key={i}
            className={cn(
              "relative rounded-xl border p-6 transition-all",
              model.highlight
                ? "border-accent/30 bg-accent/5 ring-1 ring-accent/20 dark:border-accent/40 dark:bg-accent/10"
                : "border-foreground/5 bg-foreground/[0.02] dark:border-white/5 dark:bg-white/[0.02]"
            )}
          >
            {model.highlight && (
              <div className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-0.5 text-xs font-medium text-white">
                AI Factory
              </div>
            )}
            <h3
              className={cn(
                "text-lg font-semibold",
                model.highlight
                  ? "text-accent"
                  : "text-foreground/70 dark:text-white/70"
              )}
            >
              {model.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-foreground/50 dark:text-white/50">
              {model.desc}
            </p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
