import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { articles } from "@/content/blog";
import { BlogContent } from "./BlogContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    es: "Blog | LX3",
    en: "Blog | LX3",
  };

  const descriptions: Record<string, string> = {
    es: "Pensamiento tecnico y estrategico del equipo de LX3. Articulos sobre IA, automatizacion, y software para empresas.",
    en: "Technical and strategic insights from the LX3 team. Articles on AI, automation, and software for business.",
  };

  return {
    title: titles[locale] || titles.es,
    description: descriptions[locale] || descriptions.es,
    openGraph: {
      title: titles[locale] || titles.es,
      description: descriptions[locale] || descriptions.es,
      type: "website",
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <BlogContent articles={articles} locale={locale} />;
}
