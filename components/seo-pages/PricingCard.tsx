"use client";

import { CheckCircle2 } from "lucide-react";
import { Link } from "@/lib/i18n/routing";

interface PricingCardProps {
  name: string;
  price: string;
  currency?: string;
  period?: string;
  description: string;
  features: string[];
  recommended?: boolean;
  ctaText: string;
  ctaHref?: string;
}

export function PricingCard({
  name,
  price,
  currency = "CLP",
  period,
  description,
  features,
  recommended = false,
  ctaText,
  ctaHref = "/cotiza",
}: PricingCardProps) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-8 transition-all duration-300 ${
        recommended
          ? "border-[var(--coral)] bg-gradient-to-b from-[var(--coral-light)] to-[var(--bg-elevated)] shadow-[0_0_40px_var(--coral-glow)]"
          : "border-[var(--border-subtle)] bg-[var(--bg-elevated)] hover:border-[var(--border-default)]"
      }`}
    >
      {recommended && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--coral)] px-4 py-1 text-xs font-bold text-[#06080E]">
          Recomendado
        </span>
      )}

      <h3 className="font-display text-lg font-semibold text-[var(--text-primary)]">
        {name}
      </h3>

      <div className="mt-4 flex items-baseline gap-1">
        <span className="font-display text-4xl font-bold text-[var(--text-primary)]">
          {price}
        </span>
        <span className="text-sm text-[var(--text-tertiary)]">
          {currency}
          {period && ` ${period}`}
        </span>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
        {description}
      </p>

      <ul className="mt-6 flex-1 space-y-3">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--coral)]" />
            <span className="text-sm text-[var(--text-secondary)]">{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href={ctaHref as "/"}
        className={`mt-8 block rounded-full py-3.5 text-center text-sm font-semibold transition-all ${
          recommended
            ? "bg-gradient-to-r from-[var(--coral)] to-[#f97316] text-[#06080E] hover:shadow-[0_0_24px_var(--coral-glow)]"
            : "border border-[var(--border-default)] text-[var(--text-primary)] hover:border-[var(--coral)] hover:text-[var(--coral)]"
        }`}
      >
        {ctaText}
      </Link>
    </div>
  );
}
