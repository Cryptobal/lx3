import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/shared/JsonLd";
import { SolutionPageLayout } from "@/components/seo-pages/SolutionPageLayout";
import { getSolutionPageData, getAllSolutionSlugs } from "@/data/solution-pages";

export async function generateStaticParams() {
  return getAllSolutionSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const data = getSolutionPageData(slug);
  if (!data) return {};

  return {
    title: `${data.title} | LX3`,
    description: data.subtitle,
    alternates: {
      canonical: `https://www.lx3.ai/${locale}/soluciones/${slug}`,
      languages: {
        es: `https://www.lx3.ai/es/soluciones/${slug}`,
        en: `https://www.lx3.ai/en/solutions/${slug}`,
        "x-default": `https://www.lx3.ai/es/soluciones/${slug}`,
      },
    },
  };
}

export default async function SolutionPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const data = getSolutionPageData(slug);
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
      "@type": "Country",
      name: "Chile",
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <SolutionPageLayout data={data} />
    </>
  );
}
