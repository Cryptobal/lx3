"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { Link } from "@/lib/i18n/routing";
import { ArrowRight, ImageIcon } from "lucide-react";

const metrics = [
  { value: "20+", label: "Módulos", color: "var(--accent)" },
  { value: "100%", label: "En producción", color: "var(--coral)" },
  { value: "500+", label: "Guardias gestionados", color: "var(--green)" },
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

// OPAI product modules. Real screenshots go in /public/images/opai/ and are
// wired via `src`. Until they exist we render an honest placeholder — never a
// fake CSS mockup of the product.
// TODO: Carlos — colocar capturas reales en public/images/opai/ y setear `src`:
//   opai-dashboard.webp · opai-cotizador-ia.webp · opai-scheduling.webp · opai-rondas-gps.webp
interface OpaiModule {
  key: string;
  label: string;
  alt: string;
  src?: string; // e.g. "/images/opai/opai-dashboard.webp"
}

const opaiModules: OpaiModule[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    alt: "Dashboard de OPAI, ERP con inteligencia artificial para Gard Security",
    // src: "/images/opai/opai-dashboard.webp",
  },
  {
    key: "cotizador",
    label: "Cotizador IA",
    alt: "Cotizador con IA de OPAI generando una propuesta automáticamente",
    // src: "/images/opai/opai-cotizador-ia.webp",
  },
  {
    key: "scheduling",
    label: "Turnos",
    alt: "Módulo de turnos de OPAI gestionando 500+ guardias de Gard Security",
    // src: "/images/opai/opai-scheduling.webp",
  },
  {
    key: "rondas",
    label: "Rondas GPS",
    alt: "Rondas de seguridad en tiempo real con GPS en OPAI",
    // src: "/images/opai/opai-rondas-gps.webp",
  },
];

export function Showcase() {
  const t = useTranslations("showcase");
  const [active, setActive] = useState(0);
  const current = opaiModules[active];

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
          {/* ── Left: OPAI module viewer (real screenshots or honest placeholder) ── */}
          <div>
            {/* Tabs */}
            <div
              role="tablist"
              aria-label="Módulos de OPAI"
              className="mb-4 flex flex-wrap gap-2"
            >
              {opaiModules.map((mod, i) => (
                <button
                  key={mod.key}
                  role="tab"
                  aria-selected={active === i}
                  aria-controls={`opai-panel-${mod.key}`}
                  id={`opai-tab-${mod.key}`}
                  onClick={() => setActive(i)}
                  className={`rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)] ${
                    active === i
                      ? "border-[var(--coral)] bg-[var(--coral)]/10 text-[var(--coral)]"
                      : "border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                  }`}
                >
                  {mod.label}
                </button>
              ))}
            </div>

            {/* Panel */}
            <div
              role="tabpanel"
              id={`opai-panel-${current.key}`}
              aria-labelledby={`opai-tab-${current.key}`}
              className="relative aspect-[16/10] overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-[0_0_60px_-12px_var(--accent)]"
            >
              {current.src ? (
                <Image
                  src={current.src}
                  alt={current.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  quality={85}
                  loading="lazy"
                  className="object-cover"
                />
              ) : (
                // Honest placeholder — intentionally NOT a simulated screenshot.
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center">
                  <ImageIcon
                    className="h-8 w-8 text-[var(--text-tertiary)]"
                    aria-hidden="true"
                  />
                  <p className="text-sm font-medium text-[var(--text-secondary)]">
                    OPAI · {current.label}
                  </p>
                  <p className="max-w-xs text-xs text-[var(--text-tertiary)]">
                    Captura real del producto en producción — próximamente.
                  </p>
                </div>
              )}
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
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              <Link
                href={"/casos/opai-gard-security" as "/"}
                className="inline-flex items-center gap-2 font-medium text-[var(--coral)] transition-colors hover:text-[var(--coral)]/80"
              >
                <span>{t("cta")}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={"/casos" as "/"}
                className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-primary)]"
              >
                <span>{t("ctaAll")}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </section>
  );
}
