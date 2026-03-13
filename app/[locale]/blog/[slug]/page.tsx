import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { articles, getArticleBySlug, getRelatedArticles } from "@/content/blog";
import { ArticleContent } from "./ArticleContent";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) return {};

  const lang = (locale === "en" ? "en" : "es") as "es" | "en";
  const baseTitle = article.title[lang];
  const description = article.description?.[lang] || article.excerpt[lang];
  const canonicalEs = `https://www.lx3.ai/es/blog/${slug}`;
  const canonicalEn = `https://www.lx3.ai/en/blog/${slug}`;

  return {
    title: baseTitle,
    description,
    alternates: {
      canonical: lang === "en" ? canonicalEn : canonicalEs,
      languages: {
        es: canonicalEs,
        en: canonicalEn,
        "x-default": canonicalEs,
      },
    },
    openGraph: {
      title: baseTitle,
      description,
      type: "article",
      publishedTime: article.date,
      authors: [article.author || "LX3"],
      images: article.ogImage ? [{ url: article.ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: baseTitle,
      description,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const related = getRelatedArticles(slug);

  return <ArticleContent article={article} relatedArticles={related} locale={locale} />;
}
