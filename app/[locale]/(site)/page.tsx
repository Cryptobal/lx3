import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/shared/JsonLd";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Showcase } from "@/components/sections/Showcase";
import { Process } from "@/components/sections/Process";
import { TechStackSection } from "@/components/sections/TechStackSection";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { AnimateOnScroll } from "@/components/shared/AnimateOnScroll";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    es: "LX3 — Inteligencia Artificial aplicada a empresas | Software con IA en Chile",
    en: "LX3 — Applied AI for business | AI-powered software in Chile",
  };

  const descriptions: Record<string, string> = {
    es: "Construimos sistemas con inteligencia artificial que operan tu negocio: automatización de procesos, ERPs con IA y agentes que cotizan y deciden. Creadores de OPAI. Santiago, Chile.",
    en: "We build AI systems that run your business: process automation, AI-powered ERPs, and agents that quote and decide. Creators of OPAI. Santiago, Chile.",
  };

  const keywords = [
    "inteligencia artificial para empresas Chile",
    "automatización con IA Chile",
    "implementar IA en mi empresa",
    "agentes de IA para negocios",
    "software con inteligencia artificial Chile",
    "ERP con IA Chile",
  ];

  return {
    title: titles[locale] || titles.es,
    description: descriptions[locale] || descriptions.es,
    keywords,
    openGraph: {
      title: titles[locale] || titles.es,
      description: descriptions[locale] || descriptions.es,
      type: "website",
      locale: locale === "en" ? "en_US" : "es_CL",
      siteName: "LX3",
      url: locale === "en" ? "https://www.lx3.ai/en" : "https://www.lx3.ai/es",
    },
    twitter: {
      card: "summary_large_image",
      title: titles[locale] || titles.es,
      description: descriptions[locale] || descriptions.es,
    },
    alternates: {
      canonical: locale === "en" ? "https://www.lx3.ai/en" : "https://www.lx3.ai/es",
      languages: {
        es: "https://www.lx3.ai/es",
        en: "https://www.lx3.ai/en",
        "x-default": "https://www.lx3.ai/es",
      },
    },
  };
}

const HOME_FAQ: Record<string, { q: string; a: string }[]> = {
  es: [
    {
      q: "¿Cuánto cuesta implementar IA en mi empresa?",
      a: "Depende del alcance. Una automatización puntual con IA puede partir bajo el millón de pesos; un sistema o ERP a medida con IA parte desde $3.000.000 CLP. Puedes cotizar tu caso en 2 minutos con nuestro cotizador.",
    },
    {
      q: "¿Cuánto demora implementar IA?",
      a: "Entregamos un MVP funcionando en cerca de 30 días. Los proyectos más completos avanzan por módulos, con entregas cada 2 semanas.",
    },
    {
      q: "¿Sirve la IA para una pyme?",
      a: "Sí. Automatizar cotizaciones, respuestas a clientes o procesamiento de documentos genera ahorro real desde el primer mes, sin necesidad de un equipo técnico interno.",
    },
    {
      q: "¿Qué procesos puedo automatizar con IA?",
      a: "Cotizar, clasificar y procesar documentos, responder clientes, agendar turnos, calificar leads y generar reportes. Si es repetitivo y basado en datos o reglas, probablemente se puede automatizar.",
    },
    {
      q: "¿Necesito cambiar mis sistemas actuales?",
      a: "No. Integramos IA y automatización sobre tu infraestructura existente, te entregamos el código fuente y trabajamos con las herramientas que ya usas.",
    },
  ],
  en: [
    {
      q: "How much does it cost to implement AI in my company?",
      a: "It depends on scope. A focused AI automation can start small; a custom AI system or ERP starts from CLP $3,000,000. You can price your case in 2 minutes with our quote tool.",
    },
    {
      q: "How long does it take to implement AI?",
      a: "We ship a working MVP in about 30 days. Larger projects progress module by module, with deliveries every two weeks.",
    },
    {
      q: "Is AI worth it for a small business?",
      a: "Yes. Automating quotes, customer replies, or document processing pays off from month one, with no in-house tech team required.",
    },
    {
      q: "What processes can I automate with AI?",
      a: "Quoting, classifying and processing documents, answering customers, scheduling shifts, qualifying leads, and generating reports. If it's repetitive and based on data or rules, it can likely be automated.",
    },
    {
      q: "Do I need to replace my current systems?",
      a: "No. We layer AI and automation on top of your existing infrastructure, hand over the source code, and work with the tools you already use.",
    },
  ],
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const professionalService = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "LX3",
    url: "https://www.lx3.ai",
    description:
      "Inteligencia artificial aplicada a empresas. Automatización con IA, sistemas inteligentes a medida y agentes de IA para negocios.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Santiago",
      addressCountry: "CL",
    },
    areaServed: [
      { "@type": "City", name: "Santiago" },
      { "@type": "City", name: "Valparaíso" },
      { "@type": "City", name: "Concepción" },
      { "@type": "City", name: "Antofagasta" },
      { "@type": "City", name: "Temuco" },
      { "@type": "Country", name: "Chile" },
    ],
    knowsAbout: [
      "Inteligencia Artificial",
      "Automatización de procesos",
      "Desarrollo de software a medida",
      "ERP con IA",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicios",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: "Automatización con IA" },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Sistemas inteligentes a medida",
          },
          priceSpecification: {
            "@type": "PriceSpecification",
            price: "3000000",
            priceCurrency: "CLP",
            valueAddedTaxIncluded: false,
          },
        },
        {
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: "Sitios web" },
          priceSpecification: {
            "@type": "PriceSpecification",
            price: "490000",
            priceCurrency: "CLP",
          },
        },
      ],
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+56982307771",
      email: "contacto@lx3.ai",
      contactType: "sales",
      availableLanguage: ["es", "en"],
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (HOME_FAQ[locale] || HOME_FAQ.es).map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <>
      <JsonLd data={professionalService} />
      <JsonLd data={faqSchema} />
      <Hero />
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
        <FinalCTA />
      </AnimateOnScroll>
    </>
  );
}
