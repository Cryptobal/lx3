import { useTranslations } from "next-intl";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { CTAButton } from "@/components/shared/CTAButton";
import { ArrowRight } from "lucide-react";

export function Showcase() {
  const t = useTranslations("showcase");

  const metrics = [
    { label: t("metric1Label"), value: t("metric1Value") },
    { label: t("metric2Label"), value: t("metric2Value") },
    { label: t("metric3Label"), value: t("metric3Value") },
  ];

  const techBadges = t("techStack").split(" · ").length > 1
    ? t("techStack").split(" · ")
    : t("techStack").split(", ");

  return (
    <SectionWrapper id="casos">
      {/* Section label */}
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5">
        <span className="font-mono text-xs font-medium tracking-widest text-accent uppercase">
          {t("title")}
        </span>
      </div>

      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
        {/* Left side: Title + description */}
        <div>
          <h2 className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
            {t("subtitle")}
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-white/60">
            {t("description")}
          </p>

          {/* Tech stack badges */}
          <div className="mt-8 flex flex-wrap gap-2">
            {techBadges.map((tech, i) => (
              <span
                key={i}
                className="rounded-lg border border-white/5 bg-surface-elevated px-3 py-1.5 font-mono text-xs text-white/50"
              >
                {tech.trim()}
              </span>
            ))}
          </div>

          <div className="mt-10">
            <CTAButton href="/casos/opai-gard-security" variant="primary">
              {t("cta")}
              <ArrowRight className="h-4 w-4" />
            </CTAButton>
          </div>
        </div>

        {/* Right side: Metric cards */}
        <div className="space-y-4">
          {metrics.map((metric, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/5 bg-surface-elevated p-6 transition-all duration-300 hover:border-accent/20"
            >
              <p className="font-display text-4xl font-bold gradient-text md:text-5xl">
                {metric.value}
              </p>
              <p className="mt-2 text-sm text-white/50">
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
