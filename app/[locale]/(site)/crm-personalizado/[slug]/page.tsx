import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/shared/JsonLd";
import { GeoPageLayout } from "@/components/seo-pages/GeoPageLayout";
import { getGeoPageData, getAllGeoSlugs } from "@/data/geo-pages";
import { localeAlternates } from "@/lib/seo";

const SERVICE_TYPE = "crm-personalizado";
const EN_PREFIX = "custom-crm";

export async function generateStaticParams() {
  return getAllGeoSlugs(SERVICE_TYPE).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const data = getGeoPageData(SERVICE_TYPE, slug);
  if (!data) return {};

  return {
    title: `${data.title} | LX3`,
    description: data.subtitle,
    alternates: localeAlternates(locale, `/es/${SERVICE_TYPE}/${slug}`, `/en/${EN_PREFIX}/${slug}`),
  };
}

export default async function GeoPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const data = getGeoPageData(SERVICE_TYPE, slug);
  if (!data) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: data.title,
    description: data.subtitle,
    provider: {
      "@type": "Organization",
      name: "LX3",
      url: "https://www.lx3.ai",
    },
    areaServed: {
      "@type": "City",
      name: data.city,
      containedInPlace: {
        "@type": "Country",
        name: "Chile",
      },
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <GeoPageLayout data={data} />
    </>
  );
}
