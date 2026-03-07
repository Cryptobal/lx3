import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/shared/JsonLd";
import { Hero } from "@/components/sections/Hero";
import { SocialProof } from "@/components/sections/SocialProof";
import { Services } from "@/components/sections/Services";
import { Showcase } from "@/components/sections/Showcase";
import { Process } from "@/components/sections/Process";
import { TechStackSection } from "@/components/sections/TechStackSection";
import { BlogPreview } from "@/components/sections/BlogPreview";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { AnimateOnScroll } from "@/components/shared/AnimateOnScroll";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    es: "LX3 — Software Studio | Aplicaciones inteligentes para empresas",
    en: "LX3 — Software Studio | Intelligent apps for businesses",
  };

  const descriptions: Record<string, string> = {
    es: "Diseñamos y construimos software inteligente para empresas. Aplicaciones a medida, automatización con IA, sitios web y consultoría tecnológica en Santiago, Chile.",
    en: "We design and build intelligent software for businesses. Custom applications, AI automation, websites, and technology consulting from Santiago, Chile.",
  };

  return {
    title: titles[locale] || titles.es,
    description: descriptions[locale] || descriptions.es,
    openGraph: {
      title: titles[locale] || titles.es,
      description: descriptions[locale] || descriptions.es,
      type: "website",
      locale: locale === "en" ? "en_US" : "es_CL",
      siteName: "LX3",
      url: "https://lx3.ai",
    },
    twitter: {
      card: "summary_large_image",
      title: titles[locale] || titles.es,
      description: descriptions[locale] || descriptions.es,
    },
    alternates: {
      canonical: "https://lx3.ai",
      languages: {
        es: "https://lx3.ai",
        en: "https://lx3.ai/en",
      },
    },
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
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "LX3",
          url: "https://lx3.ai",
          description:
            "Software Studio que diseña y construye aplicaciones inteligentes para empresas",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Santiago",
            addressCountry: "CL",
          },
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+56982307771",
            contactType: "sales",
          },
        }}
      />
      <Hero />
      <AnimateOnScroll>
        <SocialProof />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <Services />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <Showcase />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <Process />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <TechStackSection />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <BlogPreview />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <FinalCTA />
      </AnimateOnScroll>
    </>
  );
}
