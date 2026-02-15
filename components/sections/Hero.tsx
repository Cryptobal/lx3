import { useTranslations } from "next-intl";
import { CTAButton } from "@/components/shared/CTAButton";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative flex min-h-[90vh] items-center px-6">
      {/* Subtle grid background */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="max-w-3xl">
          {/* Accent tag */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="text-xs font-medium tracking-wide text-accent">
              AI FACTORY
            </span>
          </div>

          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl dark:text-white">
            {t("headline")}
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground/60 dark:text-white/60">
            {t("subheadline")}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <CTAButton href="/diagnostico" variant="primary">
              {t("ctaPrimary")}
            </CTAButton>
            <CTAButton href="#modelo" variant="secondary">
              {t("ctaSecondary")}
            </CTAButton>
          </div>
        </div>
      </div>
    </section>
  );
}
