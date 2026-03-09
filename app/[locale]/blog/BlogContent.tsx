"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { AnimateOnScroll } from "@/components/shared/AnimateOnScroll";
import { getCategoryClasses, getCategoryLabel } from "@/content/blog-categories";
import { Clock, ArrowUpRight } from "lucide-react";
import type { BlogArticle } from "@/content/blog";
type FilterCategory = "all" | string;

interface BlogContentProps {
  articles: BlogArticle[];
  locale: string;
}

export function BlogContent({ articles, locale }: BlogContentProps) {
  const t = useTranslations("blogPage");
  const lang = locale === "en" ? "en" : "es";
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");
  const categories = Array.from(new Set(articles.map((article) => article.category)));

  const filters: { key: FilterCategory; label: string }[] = [
    { key: "all", label: lang === "es" ? "Todos" : "All" },
    ...categories.map((category) => ({
      key: category,
      label: getCategoryLabel(category),
    })),
  ];

  const filtered =
    activeFilter === "all"
      ? articles
      : articles.filter((a) => a.category === activeFilter);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString(lang === "es" ? "es-CL" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <SectionWrapper className="pt-32 pb-20">
      {/* Hero */}
      <AnimateOnScroll>
        <div className="max-w-3xl">
          <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--text-primary)] md:text-5xl lg:text-6xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-[var(--text-secondary)] md:text-xl">
            {t("subtitle")}
          </p>
        </div>
      </AnimateOnScroll>

      {/* Filters */}
      <AnimateOnScroll delay={0.1}>
        <div className="mt-10 flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all duration-200 ${
                activeFilter === filter.key
                  ? "border-accent/40 bg-accent/10 text-accent"
                  : "border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--border-default)] hover:text-[var(--text-secondary)]"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </AnimateOnScroll>

      {/* Article Grid */}
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((article, i) => {
          return (
            <AnimateOnScroll key={article.slug} delay={0.1 + i * 0.05}>
              <Link href={`/blog/${article.slug}` as "/blog"}>
                <article className="group flex h-full cursor-pointer flex-col rounded-2xl border border-[var(--border-subtle)] bg-surface-elevated p-7 transition-all duration-300 hover:border-accent/20 hover:shadow-[0_0_30px_rgba(6,182,212,0.06)]">
                  {/* Category tag */}
                  <span
                    className={`inline-block w-fit rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-wider ${getCategoryClasses(article.category)}`}
                  >
                    {getCategoryLabel(article.category)}
                  </span>

                  {/* Title */}
                  <h2 className="mt-5 font-display text-lg font-semibold leading-snug text-[var(--text-primary)] transition-colors group-hover:text-accent">
                    {article.title[lang]}
                  </h2>

                  {/* Excerpt */}
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {article.excerpt[lang]}
                  </p>

                  {/* Date + read time + arrow */}
                  <div className="mt-6 flex items-center justify-between border-t border-[var(--border-subtle)] pt-4">
                    <div className="flex items-center gap-4 text-[var(--text-tertiary)]">
                      <span className="font-mono text-xs">
                        {formatDate(article.date)}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="font-mono text-xs">
                          {article.readTime} {t("readTime")}
                        </span>
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-[var(--text-tertiary)] transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
                  </div>
                </article>
              </Link>
            </AnimateOnScroll>
          );
        })}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="mt-20 text-center">
          <p className="text-lg text-[var(--text-tertiary)]">
            {lang === "es"
              ? "No hay articulos en esta categoria todavia."
              : "No articles in this category yet."}
          </p>
        </div>
      )}
    </SectionWrapper>
  );
}
