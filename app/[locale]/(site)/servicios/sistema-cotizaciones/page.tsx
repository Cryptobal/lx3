import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { StaticServicePage } from "@/components/servicios/StaticServicePage";
import { getServicePageData } from "@/data/service-pages";
import { localeAlternates, SERVICE_EN_SLUGS } from "@/lib/seo";

const SLUG = "sistema-cotizaciones";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const data = getServicePageData(SLUG);
  if (!data) return {};

  const enSlug = SERVICE_EN_SLUGS[SLUG] ?? SLUG;
  return {
    title: `${data.title} | LX3`,
    description: data.subtitle,
    alternates: localeAlternates(locale, `/es/servicios/${SLUG}`, `/en/services/${enSlug}`),
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const data = getServicePageData(SLUG);
  if (!data) notFound();

  return <StaticServicePage data={data} />;
}
