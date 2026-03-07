import { useTranslations } from "next-intl";
import { CTAButton } from "@/components/shared/CTAButton";
import { MessageCircle } from "lucide-react";

export function FinalCTA() {
  const t = useTranslations("finalCta");

  return (
    <section className="relative overflow-hidden">
      {/* Intense mesh gradient background */}
      <div className="absolute inset-0 mesh-gradient-intense" />

      {/* Grid pattern overlay (subtle dots) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,_#ffffff06_1px,_transparent_1px)] bg-[size:32px_32px]" />

      {/* Radial fade at edges */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--bg-deep)_75%)]" />

      <div className="relative mx-auto max-w-4xl px-6 py-24 text-center md:py-32">
        {/* Title */}
        <h2 className="font-display text-3xl font-bold tracking-tight text-[var(--text-primary)] md:text-4xl lg:text-5xl">
          {t("title")}
        </h2>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-lg text-lg text-[var(--text-secondary)]">
          {t("subtitle")}
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          {/* Primary CTA with glow pulse */}
          <CTAButton
            href="/contacto"
            variant="primary"
            size="lg"
            className="animate-[glow-pulse_3s_ease-in-out_infinite] shadow-[0_0_20px_rgba(58,139,253,0.3)]"
          >
            {t("cta")}
          </CTAButton>

          {/* WhatsApp ghost CTA */}
          <a
            href="https://wa.me/56982307771"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-[11px] border border-[var(--border-default)] bg-transparent px-8 py-4 text-base font-medium text-[var(--text-primary)] transition-all duration-200 hover:border-[#25D366] hover:text-[#25D366]"
          >
            <MessageCircle className="h-5 w-5" />
            {t("whatsapp")}
          </a>
        </div>
      </div>
    </section>
  );
}
