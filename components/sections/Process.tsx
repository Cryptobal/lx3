import { useTranslations } from "next-intl";
import { SectionWrapper } from "@/components/shared/SectionWrapper";

export function Process() {
  const t = useTranslations("process");

  const steps = [
    {
      num: "01",
      title: t("step1Title"),
      desc: t("step1Desc"),
      time: t("step1Time"),
    },
    {
      num: "02",
      title: t("step2Title"),
      desc: t("step2Desc"),
      time: t("step2Time"),
    },
    {
      num: "03",
      title: t("step3Title"),
      desc: t("step3Desc"),
      time: t("step3Time"),
    },
    {
      num: "04",
      title: t("step4Title"),
      desc: t("step4Desc"),
      time: t("step4Time"),
    },
  ];

  return (
    <SectionWrapper>
      <div className="max-w-2xl">
        <h2 className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
          {t("title")}
        </h2>
        <p className="mt-4 text-lg text-white/60">
          {t("subtitle")}
        </p>
      </div>

      {/* Timeline */}
      <div className="mt-14">
        {/* Desktop: horizontal timeline */}
        <div className="hidden md:block">
          {/* Connecting line */}
          <div className="relative mb-10">
            <div className="absolute top-3 left-0 right-0 h-px bg-gradient-to-r from-accent/40 via-accent-secondary/30 to-transparent" />
            <div className="grid grid-cols-4 gap-8">
              {steps.map((step, i) => (
                <div key={i} className="relative">
                  {/* Dot on the line */}
                  <div className="relative z-10 mb-8 flex h-6 w-6 items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-accent shadow-[0_0_12px_rgba(6,182,212,0.5)]" />
                  </div>

                  {/* Step number */}
                  <span className="font-display text-3xl font-bold gradient-text">
                    {step.num}
                  </span>

                  {/* Title */}
                  <h3 className="mt-3 font-display text-lg font-semibold text-white">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-sm leading-relaxed text-white/50">
                    {step.desc}
                  </p>

                  {/* Time estimate */}
                  <div className="mt-4 inline-flex rounded-full border border-white/5 bg-surface-elevated px-3 py-1">
                    <span className="font-mono text-xs text-accent">
                      {step.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: vertical timeline */}
        <div className="md:hidden">
          <div className="relative space-y-8">
            {/* Vertical connecting line */}
            <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-accent/40 via-accent-secondary/30 to-transparent" />

            {steps.map((step, i) => (
              <div key={i} className="relative flex gap-6">
                {/* Dot */}
                <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-accent shadow-[0_0_12px_rgba(6,182,212,0.5)]" />
                </div>

                <div className="pb-2">
                  <span className="font-display text-2xl font-bold gradient-text">
                    {step.num}
                  </span>
                  <h3 className="mt-1 font-display text-lg font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/50">
                    {step.desc}
                  </p>
                  <div className="mt-3 inline-flex rounded-full border border-white/5 bg-surface-elevated px-3 py-1">
                    <span className="font-mono text-xs text-accent">
                      {step.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
