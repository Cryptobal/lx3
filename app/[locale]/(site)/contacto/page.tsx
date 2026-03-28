import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/shared/JsonLd";
import { ContactContent } from "./ContactContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonicalEs = "https://www.lx3.ai/es/contacto";
  const canonicalEn = "https://www.lx3.ai/en/contact";
  return {
    title: locale === "en" ? "Contact" : "Contacto",
    description:
      locale === "en"
        ? "Tell us what problem you're trying to solve. We respond within 24 hours with an honest initial assessment."
        : "Cuentanos que problema estas tratando de resolver. Respondemos en menos de 24 horas con una evaluacion inicial honesta.",
    alternates: {
      canonical: locale === "en" ? canonicalEn : canonicalEs,
      languages: {
        es: canonicalEs,
        en: canonicalEn,
        "x-default": canonicalEs,
      },
    },
  };
}

const contactPointSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPoint",
  contactType: "sales",
  email: "contacto@lx3.ai",
  telephone: "+56982307771",
  url: "https://www.lx3.ai/es/contacto",
  availableLanguage: ["Spanish", "English"],
};

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <JsonLd data={contactPointSchema} />
      <ContactContent />
    </>
  );
}
