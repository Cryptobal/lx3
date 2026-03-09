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
  const title = baseTitle.includes("2026")
    ? `${baseTitle} | LX3`
    : `${baseTitle} 2026 | LX3`;
  const description = article.description?.[lang] || article.excerpt[lang];

  return {
    title,
    description,
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
