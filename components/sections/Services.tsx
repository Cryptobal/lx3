import { useTranslations } from "next-intl";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { Link } from "@/lib/i18n/routing";
import { Cpu, Zap, Globe, Compass, ArrowUpRight } from "lucide-react";

const cards = [
  {
    icon: Zap,
    titleKey: "s1Title" as const,
    descKey: "s1Desc" as const,
    link: "/servicios/automatizacion-ia" as const,
    accent: "var(--coral)",
  },
  {
    icon: Cpu,
    titleKey: "s2Title" as const,
    descKey: "s2Desc" as const,
    link: "/servicios/software-a-medida" as const,
    accent: "var(--accent)",
  },
  {
    icon: Globe,
    titleKey: "s3Title" as const,
    descKey: "s3Desc" as const,
    link: "/servicios/sitios-web" as const,
    accent: "var(--green)",
  },
  {
    icon: Compass,
    titleKey: "s4Title" as const,
    descKey: "s4Desc" as const,
    link: "/servicios/consultoria" as const,
    accent: "var(--accent)",
  },
];

export function Services() {
  const t = useTranslations("services");

  return (
    <section className="bg-[var(--bg-primary)]">
      <SectionWrapper>
        {/* Section label */}
        <span className="font-mono text-xs font-medium uppercase tracking-widest text-[var(--coral)]">
          SERVICIOS
        </span>

        {/* Title */}
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-[var(--text-primary)] md:text-4xl lg:text-5xl">
          {t("title")}
        </h2>

        {/* Cards grid */}
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <Link
                key={i}
                href={card.link as "/"}
                className="group relative rounded-[14px] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-8 transition-all duration-300 hover:-translate-y-1"
                style={
                  {
                    "--card-accent": card.accent,
                  } as React.CSSProperties
                }
              >
                {/* Hover border + glow */}
                <div className="pointer-events-none absolute inset-0 rounded-[14px] border border-transparent transition-all duration-300 group-hover:border-[var(--card-accent)] group-hover:shadow-[0_0_24px_-4px_var(--card-accent)]" />

                {/* Icon */}
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full"
                  style={{ backgroundColor: `color-mix(in srgb, ${card.accent} 12%, transparent)` }}
                >
                  <Icon
                    className="h-6 w-6"
                    style={{ color: card.accent }}
                  />
                </div>

                {/* Title */}
                <h3 className="mt-6 font-display text-xl font-semibold text-[var(--text-primary)]">
                  {t(card.titleKey)}
                </h3>

                {/* Description */}
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {t(card.descKey)}
                </p>

                {/* Hover CTA */}
                <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ color: card.accent }}>
                  <span>Explorar</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </SectionWrapper>
    </section>
  );
}
