import { useTranslations } from "next-intl";

export function SocialProof() {
  const t = useTranslations("socialProof");

  const metrics = [
    t("metric1"),
    t("metric2"),
    t("metric3"),
  ];

  return (
    <section className="border-y border-white/5">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col items-center justify-center gap-6 md:flex-row md:gap-0">
          {metrics.map((metric, i) => (
            <div key={i} className="flex items-center gap-6 md:gap-0">
              <p className="whitespace-nowrap font-mono text-sm tracking-wide text-white/40">
                {metric}
              </p>
              {i < metrics.length - 1 && (
                <div className="hidden h-4 w-px bg-white/10 md:mx-12 md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
