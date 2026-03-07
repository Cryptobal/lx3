"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { AnimateOnScroll } from "@/components/shared/AnimateOnScroll";
import { Clock, ArrowUpRight } from "lucide-react";
import type { BlogArticle } from "@/content/blog";

const categoryConfig = {
  estrategia: {
    label: { es: "Estrategia", en: "Strategy" },
    color: "text-cyan-400 border-cyan-400/20 bg-cyan-400/5",
  },
  tecnologia: {
    label: { es: "Tecnologia", en: "Technology" },
    color: "text-blue-400 border-blue-400/20 bg-blue-400/5",
  },
  operaciones: {
    label: { es: "Operaciones", en: "Operations" },
    color: "text-emerald-400 border-emerald-400/20 bg-emerald-400/5",
  },
} as const;

type FilterCategory = "all" | BlogArticle["category"];

interface BlogContentProps {
  articles: BlogArticle[];
  locale: string;
}

export function BlogContent({ articles, locale }: BlogContentProps) {
  const t = useTranslations("blogPage");
  const lang = locale === "en" ? "en" : "es";
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");

  const filters: { key: FilterCategory; label: string }[] = [
    { key: "all", label: lang === "es" ? "Todos" : "All" },
    {
      key: "estrategia",
      label: categoryConfig.estrategia.label[lang],
    },
    {
      key: "tecnologia",
      label: categoryConfig.tecnologia.label[lang],
    },
    {
      key: "operaciones",
      label: categoryConfig.operaciones.label[lang],
    },
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
          <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-white/60 md:text-xl">
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
                  : "border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white/70"
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
          const cat = categoryConfig[article.category];
          return (
            <AnimateOnScroll key={article.slug} delay={0.1 + i * 0.05}>
              <Link href={`/blog/${article.slug}` as "/blog"}>
                <article className="group flex h-full cursor-pointer flex-col rounded-2xl border border-white/5 bg-surface-elevated p-7 transition-all duration-300 hover:border-accent/20 hover:shadow-[0_0_30px_rgba(6,182,212,0.06)]">
                  {/* Category tag */}
                  <span
                    className={`inline-block w-fit rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-wider ${cat.color}`}
                  >
                    {cat.label[lang]}
                  </span>

                  {/* Title */}
                  <h2 className="mt-5 font-display text-lg font-semibold leading-snug text-white transition-colors group-hover:text-accent">
                    {article.title[lang]}
                  </h2>

                  {/* Excerpt */}
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-white/50">
                    {article.excerpt[lang]}
                  </p>

                  {/* Date + read time + arrow */}
                  <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                    <div className="flex items-center gap-4 text-white/30">
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
                    <ArrowUpRight className="h-4 w-4 text-white/20 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
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
          <p className="text-lg text-white/40">
            {lang === "es"
              ? "No hay articulos en esta categoria todavia."
              : "No articles in this category yet."}
          </p>
        </div>
      )}
    </SectionWrapper>
  );
}
