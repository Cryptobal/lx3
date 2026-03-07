import { useTranslations } from "next-intl";
import { CTAButton } from "@/components/shared/CTAButton";
import { MessageCircle } from "lucide-react";

export function FinalCTA() {
  const t = useTranslations("finalCta");

  return (
    <section className="relative overflow-hidden">
      {/* Mesh gradient background */}
      <div className="absolute inset-0 mesh-gradient" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0B1120_80%)]" />

      {/* Grid pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative mx-auto max-w-4xl px-6 py-24 text-center md:py-32">
        <h2 className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
          {t("title")}
        </h2>

        <p className="mx-auto mt-6 max-w-lg text-lg text-white/60">
          {t("subtitle")}
        </p>

        <div className="mt-10 flex flex-col items-center gap-6">
          <CTAButton href="/contacto" variant="primary" size="lg">
            {t("cta")}
          </CTAButton>

          <a
            href="https://wa.me/56982307771"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-accent"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{t("whatsapp")}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
