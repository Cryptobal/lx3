import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/shared/JsonLd";
import { PricingPageLayout } from "@/components/seo-pages/PricingPageLayout";
import { getPricingPageData, getAllPricingSlugs } from "@/data/pricing-pages";

export async function generateStaticParams() {
  return getAllPricingSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const data = getPricingPageData(slug);
  if (!data) return {};

  return {
    title: `${data.title} | LX3`,
    description: data.subtitle,
    alternates: {
      canonical: `https://www.lx3.ai/${locale}/precio/${slug}`,
      languages: {
        es: `https://www.lx3.ai/es/precio/${slug}`,
        en: `https://www.lx3.ai/en/pricing/${slug}`,
        "x-default": `https://www.lx3.ai/es/precio/${slug}`,
      },
    },
  };
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const data = getPricingPageData(slug);
  if (!data) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: data.title,
    description: data.subtitle,
    offers: data.tiers.map((tier) => ({
      "@type": "Offer",
      name: tier.name,
      price: tier.price.replace(/[$.+]/g, "").replace(/\./g, ""),
      priceCurrency: "CLP",
      availability: "https://schema.org/InStock",
    })),
    provider: {
      "@type": "Organization",
      name: "LX3",
      url: "https://www.lx3.ai",
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <PricingPageLayout data={data} />
    </>
  );
}
