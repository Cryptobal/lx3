import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { ProblemStatement } from "@/components/sections/ProblemStatement";
import { FactoryModel } from "@/components/sections/FactoryModel";
import { MethodologyPreview } from "@/components/sections/MethodologyPreview";
import { CapabilitiesShowcase } from "@/components/sections/CapabilitiesShowcase";
import { DiagnosticCTA } from "@/components/sections/DiagnosticCTA";
import { DepthIndicators } from "@/components/sections/DepthIndicators";
import { InsightsPreview } from "@/components/sections/InsightsPreview";
import { FooterCTA } from "@/components/sections/FooterCTA";
import { AnimateOnScroll } from "@/components/shared/AnimateOnScroll";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title:
      locale === "en"
        ? "LX3 — AI Factory for Enterprises"
        : "LX3 — AI Factory para Empresas",
    description:
      locale === "en"
        ? "We build custom AI software that turns your operational complexity into competitive advantage. No slides. No abandoned prototypes. Production systems."
        : "Construimos software de IA a medida que convierte la complejidad operativa de tu empresa en ventaja competitiva. No slides. No prototipos abandonados. Sistemas en produccion.",
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <AnimateOnScroll>
        <ProblemStatement />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <FactoryModel />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <MethodologyPreview />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <CapabilitiesShowcase />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <DiagnosticCTA />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <DepthIndicators />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <InsightsPreview />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <FooterCTA />
      </AnimateOnScroll>
    </>
  );
}
