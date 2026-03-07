import { useTranslations } from "next-intl";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { Link } from "@/lib/i18n/routing";
import { ArrowRight } from "lucide-react";

const metrics = [
  { value: "20+", label: "Módulos", color: "var(--accent)" },
  { value: "100%", label: "En producción", color: "var(--coral)" },
  { value: "90", label: "Días a MVP", color: "var(--green)" },
  { value: "24/7", label: "IA integrada", color: "var(--accent)" },
];

const techBadges = [
  "Next.js",
  "React",
  "TypeScript",
  "PostgreSQL",
  "Claude AI",
  "Tailwind",
];

export function Showcase() {
  const t = useTranslations("showcase");

  return (
    <section className="relative">
      {/* Top gradient line */}
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-[var(--accent)] to-[var(--coral)]" />

      <SectionWrapper>
        {/* Badge pill */}
        <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-[var(--coral)]/20 bg-[var(--coral)]/5 px-4 py-1.5">
          <span className="font-mono text-xs font-medium tracking-widest text-[var(--coral)]">
            Caso de &eacute;xito
          </span>
        </div>

        {/* Main grid */}
        <div className="grid items-center gap-12 lg:grid-cols-[55%_45%] lg:gap-16">
          {/* ── Left: Browser mockup ── */}
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-[0_0_60px_-12px_var(--accent)]">
            {/* Browser top bar */}
            <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                <div className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
                <div className="h-3 w-3 rounded-full bg-[#28C840]" />
              </div>
              <span className="ml-2 font-mono text-xs text-[var(--text-tertiary)]">
                OPAI &mdash; Dashboard
              </span>
            </div>

            {/* Dashboard content */}
            <div className="p-5 sm:p-6">
              {/* KPI row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-[var(--accent)]/10 px-4 py-3 text-center">
                  <p className="font-mono text-2xl font-bold text-[var(--accent)]">142</p>
                  <p className="mt-0.5 text-[10px] text-[var(--text-tertiary)]">Guardias</p>
                </div>
                <div className="rounded-lg bg-[var(--coral)]/10 px-4 py-3 text-center">
                  <p className="font-mono text-2xl font-bold text-[var(--coral)]">8</p>
                  <p className="mt-0.5 text-[10px] text-[var(--text-tertiary)]">Contratos</p>
                </div>
                <div className="rounded-lg bg-[var(--green)]/10 px-4 py-3 text-center">
                  <p className="font-mono text-2xl font-bold text-[var(--green)]">38</p>
                  <p className="mt-0.5 text-[10px] text-[var(--text-tertiary)]">Reportes</p>
                </div>
              </div>

              {/* Bar chart placeholder */}
              <div className="mt-5 flex items-end justify-center gap-3">
                <div className="h-16 w-10 rounded-t-md bg-gradient-to-t from-[var(--accent)] to-[var(--coral)] opacity-80" />
                <div className="h-24 w-10 rounded-t-md bg-gradient-to-t from-[var(--accent)] to-[var(--coral)] opacity-90" />
                <div className="h-12 w-10 rounded-t-md bg-gradient-to-t from-[var(--accent)] to-[var(--coral)] opacity-70" />
              </div>
            </div>
          </div>

          {/* ── Right: Text content ── */}
          <div>
            {/* Title with "Gard Security" in coral */}
            <h2 className="font-display text-3xl font-bold tracking-tight text-[var(--text-primary)] md:text-4xl">
              {t("subtitle")}{" "}
              <span className="text-[var(--coral)]">Gard Security</span>
            </h2>

            {/* Description */}
            <p className="mt-6 text-base leading-relaxed text-[var(--text-secondary)]">
              {t("description")}
            </p>

            {/* Metrics 2x2 */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              {metrics.map((m, i) => (
                <div key={i} className="flex items-baseline gap-2">
                  <span
                    className="font-mono text-lg font-bold"
                    style={{ color: m.color }}
                  >
                    {m.value}
                  </span>
                  <span className="text-sm text-[var(--text-secondary)]">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Tech badges */}
            <div className="mt-8 flex flex-wrap gap-2">
              {techBadges.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1.5 font-mono text-xs text-[var(--text-tertiary)]"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-10">
              <Link
                href={"/casos/opai-gard-security" as "/"}
                className="inline-flex items-center gap-2 font-medium text-[var(--coral)] transition-colors hover:text-[var(--coral)]/80"
              >
                <span>{t("cta")}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </section>
  );
}
