"use client";

import { SEOPageHero } from "./SEOPageHero";
import { FAQSection } from "./FAQSection";
import { InlineCTA } from "./InlineCTA";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { AnimateOnScroll } from "@/components/shared/AnimateOnScroll";
import { Link } from "@/lib/i18n/routing";
import { CheckCircle2, AlertTriangle } from "lucide-react";

interface ProblemSolution {
  problem: string;
  solution: string;
}

interface ServiceLink {
  href: string;
  label: string;
  description: string;
}

interface FAQ {
  question: string;
  answer: string;
}

export interface SolutionPageData {
  slug: string;
  title: string;
  titleAccent?: string;
  subtitle: string;
  statistic?: string;
  problems: string[];
  problemsSolutions: ProblemSolution[];
  caseStudy?: { title: string; description: string; href: string };
  stack?: string[];
  investmentRange?: string;
  services: ServiceLink[];
  faqs: FAQ[];
  ctaTitle: string;
}

export function SolutionPageLayout({ data }: { data: SolutionPageData }) {
  return (
    <>
      <SEOPageHero
        title={data.title}
        titleAccent={data.titleAccent}
        subtitle={data.subtitle}
      />

      {data.statistic && (
        <SectionWrapper className="pt-0">
          <AnimateOnScroll>
            <div className="rounded-xl border border-[var(--coral)]/20 bg-[var(--coral-light)] p-6">
              <p className="text-sm font-medium leading-relaxed text-[var(--coral)]">
                {data.statistic}
              </p>
            </div>
          </AnimateOnScroll>
        </SectionWrapper>
      )}

      <SectionWrapper>
        <AnimateOnScroll>
          <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] md:text-3xl">
            Problemas comunes en tu industria
          </h2>
          <ul className="mt-6 space-y-4">
            {data.problems.map((problem, i) => (
              <li key={i} className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--warning)]" />
                <span className="text-base text-[var(--text-secondary)]">{problem}</span>
              </li>
            ))}
          </ul>
        </AnimateOnScroll>
      </SectionWrapper>

      <SectionWrapper>
        <AnimateOnScroll>
          <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] md:text-3xl">
            Cómo LX3 los resuelve
          </h2>
          <div className="mt-8 space-y-6">
            {data.problemsSolutions.map((ps, i) => (
              <div
                key={i}
                className="grid gap-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6 md:grid-cols-2"
              >
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
                    Problema
                  </span>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">{ps.problem}</p>
                </div>
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-[var(--coral)]">
                    Solución
                  </span>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">{ps.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimateOnScroll>
      </SectionWrapper>

      {data.caseStudy && (
        <SectionWrapper>
          <AnimateOnScroll>
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-8">
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--coral)]">
                Caso de éxito
              </span>
              <h3 className="mt-2 text-xl font-semibold text-[var(--text-primary)]">
                {data.caseStudy.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                {data.caseStudy.description}
              </p>
              <Link
                href={data.caseStudy.href as "/"}
                className="mt-4 inline-block text-sm font-medium text-[var(--coral)] underline decoration-[var(--coral)]/30 underline-offset-4 hover:decoration-[var(--coral)]"
              >
                Ver caso completo →
              </Link>
            </div>
          </AnimateOnScroll>
        </SectionWrapper>
      )}

      {(data.stack || data.investmentRange) && (
        <SectionWrapper>
          <AnimateOnScroll>
            <div className="grid gap-8 md:grid-cols-2">
              {data.stack && (
                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6">
                  <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
                    Stack recomendado
                  </h3>
                  <ul className="mt-4 space-y-2">
                    {data.stack.map((tech, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[var(--accent)]" />
                        <span className="text-sm text-[var(--text-secondary)]">{tech}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {data.investmentRange && (
                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6">
                  <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
                    Rango de inversión referencial
                  </h3>
                  <p className="mt-4 text-2xl font-bold text-[var(--coral)]">
                    {data.investmentRange}
                  </p>
                  <p className="mt-2 text-xs text-[var(--text-tertiary)]">
                    Depende del alcance, integraciones y complejidad del proyecto.
                  </p>
                </div>
              )}
            </div>
          </AnimateOnScroll>
        </SectionWrapper>
      )}

      <SectionWrapper>
        <AnimateOnScroll>
          <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] md:text-3xl">
            Servicios disponibles
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {data.services.map((service, i) => (
              <Link
                key={i}
                href={service.href as "/"}
                className="group rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6 transition-all hover:border-[var(--coral)]/40"
              >
                <h3 className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--coral)]">
                  {service.label}
                </h3>
                <p className="mt-2 text-xs text-[var(--text-tertiary)]">
                  {service.description}
                </p>
              </Link>
            ))}
          </div>
        </AnimateOnScroll>
      </SectionWrapper>

      <FAQSection faqs={data.faqs} />
      <InlineCTA title={data.ctaTitle} />
    </>
  );
}
