import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ContactContent } from "./ContactContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "en" ? "Contact" : "Contacto",
    description:
      locale === "en"
        ? "Tell us what problem you're trying to solve. We respond within 24 hours with an honest initial assessment."
        : "Cuentanos que problema estas tratando de resolver. Respondemos en menos de 24 horas con una evaluacion inicial honesta.",
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ContactContent />;
}
