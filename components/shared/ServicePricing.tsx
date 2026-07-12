import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { AnimateOnScroll } from "@/components/shared/AnimateOnScroll";
import { CTAButton } from "@/components/shared/CTAButton";
import { Link } from "@/lib/i18n/routing";
import { CANONICAL_PRICING } from "@/lib/pricing";

interface ServicePricingProps {
  /** Service-specific headline price, e.g. "Desde $1.490.000 CLP". */
  priceRange?: string;
}

/**
 * Real pricing block embedded inside every service page. Replaces the old
 * orphaned /precio pages: it satisfies "how much does X cost" intent right on
 * the service page and funnels transactional intent to the cotizador.
 */
export function ServicePricing({ priceRange }: ServicePricingProps) {
  return (
    <SectionWrapper>
      <AnimateOnScroll>
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-8 md:p-10">
          <span className="font-mono text-xs font-medium uppercase tracking-widest text-[var(--coral)]">
            Inversión
          </span>
          <h2 className="mt-3 font-display text-2xl font-bold text-[var(--text-primary)] md:text-3xl">
            Precios transparentes, sin letra chica
          </h2>
          {priceRange && (
            <p className="mt-4 text-lg text-[var(--text-primary)]">
              Este servicio:{" "}
              <span className="font-semibold text-[var(--coral)]">{priceRange}</span>
            </p>
          )}

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CANONICAL_PRICING.map((plan) => (
              <div
                key={plan.name}
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5"
              >
                <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
                  {plan.name}
                </p>
                <p className="mt-2 font-display text-xl font-bold text-[var(--text-primary)]">
                  {plan.price}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {plan.description}
                </p>
              </div>
            ))}
          </div>

          {/* Social proof over the CTA — links to the OPAI case study */}
          <p className="mt-8 text-sm text-[var(--text-tertiary)]">
            El equipo que construyó{" "}
            <Link
              href={"/casos/opai-gard-security" as "/"}
              className="text-[var(--coral)] underline decoration-[var(--coral)]/40 underline-offset-4 hover:decoration-[var(--coral)]"
            >
              OPAI
            </Link>{" "}
            — 500+ guardias gestionados con IA.
          </p>
          <div className="mt-3">
            <CTAButton href="/cotiza" size="lg">
              Cotiza tu proyecto
            </CTAButton>
          </div>
        </div>
      </AnimateOnScroll>
    </SectionWrapper>
  );
}
