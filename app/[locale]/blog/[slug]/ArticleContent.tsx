"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { AnimateOnScroll } from "@/components/shared/AnimateOnScroll";
import { JsonLd } from "@/components/shared/JsonLd";
import { CTAButton } from "@/components/shared/CTAButton";
import { MarkdownRenderer, extractHeadings } from "@/content/markdown";
import { ArrowLeft, Clock, Linkedin, ArrowUpRight, Link2 } from "lucide-react";
import type { BlogArticle } from "@/content/blog";

const categoryConfig = {
  estrategia: {
    label: { es: "Estrategia", en: "Strategy" },
    color: "text-[var(--accent)] border-[var(--accent)]/20 bg-[var(--accent)]/5",
  },
  tecnologia: {
    label: { es: "Tecnologia", en: "Technology" },
    color: "text-[var(--coral)] border-[var(--coral)]/20 bg-[var(--coral)]/5",
  },
  operaciones: {
    label: { es: "Operaciones", en: "Operations" },
    color: "text-[var(--green)] border-[var(--green)]/20 bg-[var(--green)]/5",
  },
} as const;

interface ArticleContentProps {
  article: BlogArticle;
  relatedArticles: BlogArticle[];
  locale: string;
}

export function ArticleContent({
  article,
  relatedArticles,
  locale,
}: ArticleContentProps) {
  const t = useTranslations("blogPage");
  const lang = (locale === "en" ? "en" : "es") as "es" | "en";
  const cat = categoryConfig[article.category];
  const content = article.content[lang];
  const headings = extractHeadings(content);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString(lang === "es" ? "es-CL" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const articleUrl =
    typeof window !== "undefined" ? window.location.href : "";

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const shareOnLinkedIn = () => {
    if (typeof window !== "undefined") {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
        "_blank"
      );
    }
  };

  const shareOnTwitter = () => {
    if (typeof window !== "undefined") {
      window.open(
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title[lang])}`,
        "_blank"
      );
    }
  };

  return (
    <>
      {/* JSON-LD */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title[lang],
          description: article.excerpt[lang],
          datePublished: article.date,
          author: {
            "@type": "Organization",
            name: "LX3",
            url: "https://lx3.ai",
          },
          publisher: {
            "@type": "Organization",
            name: "LX3",
            url: "https://lx3.ai",
          },
          mainEntityOfPage: articleUrl || `https://lx3.ai/blog/${article.slug}`,
          image: article.ogImage || "https://lx3.ai/og-default.jpg",
        }}
      />

      <SectionWrapper className="pt-32 pb-20">
        <div className="mx-auto max-w-4xl">
          {/* Back to blog */}
          <AnimateOnScroll>
            <Link
              href="/blog"
              className="mb-10 inline-flex items-center gap-2 text-sm text-[var(--text-tertiary)] transition-colors hover:text-[var(--accent)]"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("backToBlog")}
            </Link>
          </AnimateOnScroll>

          {/* Article header */}
          <AnimateOnScroll delay={0.05}>
            <header className="mb-12">
              {/* Category tag */}
              <span
                className={`inline-block rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-wider ${cat.color}`}
              >
                {cat.label[lang]}
              </span>

              {/* Title */}
              <h1 className="mt-6 font-display text-3xl font-bold leading-tight tracking-tight text-[var(--text-primary)] md:text-4xl lg:text-5xl">
                {article.title[lang]}
              </h1>

              {/* Meta */}
              <div className="mt-6 flex items-center gap-4 text-[var(--text-tertiary)]">
                <span className="font-mono text-sm">
                  {formatDate(article.date)}
                </span>
                <span className="h-1 w-1 rounded-full bg-[var(--text-tertiary)]" />
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="font-mono text-sm">
                    {article.readTime} {t("readTime")}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="mt-8 border-t border-[var(--border-subtle)]" />
            </header>
          </AnimateOnScroll>

          {/* Content layout: Article + Sidebar */}
          <div className="flex gap-12">
            {/* Main article content */}
            <AnimateOnScroll delay={0.1} className="min-w-0 flex-1">
              <MarkdownRenderer content={content} />
            </AnimateOnScroll>

            {/* Sidebar: Table of Contents (desktop) */}
            {headings.length > 0 && (
              <aside className="hidden w-56 shrink-0 lg:block">
                <div className="sticky top-32">
                  <p className="mb-4 font-mono text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
                    {lang === "es" ? "Contenido" : "Contents"}
                  </p>
                  <nav className="space-y-2">
                    {headings.map((heading) => (
                      <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        className={`block text-sm leading-snug text-[var(--text-tertiary)] transition-colors hover:text-[var(--accent)] ${
                          heading.level === 3 ? "pl-3" : ""
                        }`}
                      >
                        {heading.text}
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>
            )}
          </div>

          {/* Share buttons */}
          <AnimateOnScroll>
            <div className="mt-16 border-t border-[var(--border-subtle)] pt-8">
              <p className="mb-4 font-mono text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
                {t("shareTitle")}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={shareOnLinkedIn}
                  className="flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-2.5 text-sm text-[var(--text-secondary)] transition-all hover:border-[var(--accent)]/30 hover:text-[var(--accent)]"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </button>
                <button
                  onClick={shareOnTwitter}
                  className="flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-2.5 text-sm text-[var(--text-secondary)] transition-all hover:border-[var(--accent)]/30 hover:text-[var(--accent)]"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  X
                </button>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-2.5 text-sm text-[var(--text-secondary)] transition-all hover:border-[var(--accent)]/30 hover:text-[var(--accent)]"
                >
                  <Link2 className="h-4 w-4" />
                  {lang === "es" ? "Copiar enlace" : "Copy link"}
                </button>
              </div>
            </div>
          </AnimateOnScroll>

          {/* CTA */}
          <AnimateOnScroll>
            <div className="mt-16 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-8 text-center md:p-12">
              <h3 className="font-display text-2xl font-bold text-[var(--text-primary)] md:text-3xl">
                {lang === "es"
                  ? "¿Quieres hablar sobre esto?"
                  : "Want to discuss this?"}
              </h3>
              <p className="mx-auto mt-3 max-w-md text-[var(--text-secondary)]">
                {lang === "es"
                  ? "Nuestro equipo puede ayudarte a evaluar cómo estos conceptos aplican a tu operación."
                  : "Our team can help you evaluate how these concepts apply to your operation."}
              </p>
              <div className="mt-6">
                <CTAButton href="/contacto" variant="primary" size="lg">
                  {lang === "es"
                    ? "Conversemos sobre tu proyecto"
                    : "Schedule a conversation"}
                </CTAButton>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <AnimateOnScroll>
              <div className="mt-20">
                <h3 className="font-display text-2xl font-bold text-[var(--text-primary)]">
                  {t("relatedArticles")}
                </h3>
                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  {relatedArticles.map((related) => {
                    const relCat = categoryConfig[related.category];
                    return (
                      <Link
                        key={related.slug}
                        href={`/blog/${related.slug}` as "/blog"}
                      >
                        <article className="group flex h-full cursor-pointer flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-7 transition-all duration-300 hover:border-[var(--accent)]/20 hover:shadow-[0_0_30px_rgba(58,139,253,0.06)]">
                          <span
                            className={`inline-block w-fit rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-wider ${relCat.color}`}
                          >
                            {relCat.label[lang]}
                          </span>
                          <h4 className="mt-4 font-display text-lg font-semibold leading-snug text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)]">
                            {related.title[lang]}
                          </h4>
                          <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                            {related.excerpt[lang]}
                          </p>
                          <div className="mt-5 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-[var(--text-tertiary)]">
                              <Clock className="h-3.5 w-3.5" />
                              <span className="font-mono text-xs">
                                {related.readTime} {t("readTime")}
                              </span>
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-[var(--text-tertiary)] transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--accent)]" />
                          </div>
                        </article>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </AnimateOnScroll>
          )}
        </div>
      </SectionWrapper>
    </>
  );
}
