import { useTranslations } from "next-intl";
import { SectionWrapper } from "@/components/shared/SectionWrapper";

const stepColors = [
  {
    border: "border-[var(--accent)]",
    glow: "shadow-[0_0_16px_rgba(58,139,253,0.4)]",
    text: "text-[var(--accent)]",
    bg: "bg-[var(--accent)]",
  },
  {
    border: "border-[var(--coral)]",
    glow: "shadow-[0_0_16px_rgba(251,146,60,0.4)]",
    text: "text-[var(--coral)]",
    bg: "bg-[var(--coral)]",
  },
  {
    border: "border-[var(--green)]",
    glow: "shadow-[0_0_16px_rgba(52,211,153,0.4)]",
    text: "text-[var(--green)]",
    bg: "bg-[var(--green)]",
  },
  {
    border: "border-[var(--accent)]",
    glow: "shadow-[0_0_16px_rgba(58,139,253,0.4)]",
    text: "text-[var(--accent)]",
    bg: "bg-[var(--accent)]",
  },
];

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
    <section className="bg-[var(--bg-primary)]">
      <SectionWrapper>
        {/* Section label */}
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--coral)]">
          PROCESO
        </span>

        {/* Title */}
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-[var(--text-primary)] md:text-4xl lg:text-5xl">
          {t("title")}
        </h2>

        {/* Desktop: horizontal timeline */}
        <div className="mt-16 hidden md:block">
          <div className="relative">
            {/* Connecting gradient line */}
            <div className="absolute top-6 left-[calc(12.5%-8px)] right-[calc(12.5%-8px)] h-px bg-gradient-to-r from-[var(--accent)] via-[var(--coral)] via-50% to-[var(--green)]" />

            <div className="grid grid-cols-4 gap-8">
              {steps.map((step, i) => {
                const color = stepColors[i];
                return (
                  <div key={i} className="relative">
                    {/* Numbered circle */}
                    <div
                      className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 ${color.border} ${color.glow} bg-[var(--bg-primary)]`}
                    >
                      <span className={`font-mono text-sm font-bold ${color.text}`}>
                        {step.num}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="mt-6 font-display text-lg font-semibold text-[var(--text-primary)]">
                      {step.title}
                    </h3>

                    {/* Time badge */}
                    <div
                      className={`mt-3 inline-flex rounded-full border ${color.border} px-3 py-1`}
                    >
                      <span className={`font-mono text-xs ${color.text}`}>
                        {step.time}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile: vertical timeline */}
        <div className="mt-12 md:hidden">
          <div className="relative space-y-10">
            {/* Vertical connecting line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--accent)] via-[var(--coral)] via-50% to-[var(--green)]" />

            {steps.map((step, i) => {
              const color = stepColors[i];
              return (
                <div key={i} className="relative flex gap-6">
                  {/* Numbered circle */}
                  <div
                    className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 ${color.border} ${color.glow} bg-[var(--bg-primary)]`}
                  >
                    <span className={`font-mono text-sm font-bold ${color.text}`}>
                      {step.num}
                    </span>
                  </div>

                  <div className="pb-2">
                    <h3 className="font-display text-lg font-semibold text-[var(--text-primary)]">
                      {step.title}
                    </h3>

                    {/* Time badge */}
                    <div
                      className={`mt-2 inline-flex rounded-full border ${color.border} px-3 py-1`}
                    >
                      <span className={`font-mono text-xs ${color.text}`}>
                        {step.time}
                      </span>
                    </div>

                    <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </SectionWrapper>
    </section>
  );
}
