import { useTranslations } from "next-intl";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { CTAButton } from "@/components/shared/CTAButton";
import { ArrowUpRight, Clock } from "lucide-react";

export function BlogPreview() {
  const t = useTranslations("blogPreview");

  const articles = [
    {
      category: t("article1Category"),
      title: t("article1Title"),
      excerpt: t("article1Excerpt"),
      readTime: t("article1ReadTime"),
    },
    {
      category: t("article2Category"),
      title: t("article2Title"),
      excerpt: t("article2Excerpt"),
      readTime: t("article2ReadTime"),
    },
    {
      category: t("article3Category"),
      title: t("article3Title"),
      excerpt: t("article3Excerpt"),
      readTime: t("article3ReadTime"),
    },
  ];

  return (
    <SectionWrapper>
      <div className="flex items-end justify-between">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-white/60">
            {t("subtitle")}
          </p>
        </div>
        <div className="hidden md:block">
          <CTAButton href="/blog" variant="ghost">
            {t("cta")}
            <ArrowUpRight className="h-4 w-4" />
          </CTAButton>
        </div>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {articles.map((article, i) => (
          <article
            key={i}
            className="group cursor-pointer rounded-2xl border border-white/5 bg-surface-elevated p-7 transition-all duration-300 hover:border-accent/20 hover:shadow-[0_0_30px_rgba(6,182,212,0.06)]"
          >
            {/* Category tag */}
            <span className="inline-block rounded-full border border-accent/20 bg-accent/5 px-3 py-1 font-mono text-xs uppercase tracking-wider text-accent">
              {article.category}
            </span>

            {/* Title */}
            <h3 className="mt-5 font-display text-lg font-semibold leading-snug text-white transition-colors group-hover:text-accent">
              {article.title}
            </h3>

            {/* Excerpt */}
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              {article.excerpt}
            </p>

            {/* Read time + arrow */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-white/30">
                <Clock className="h-3.5 w-3.5" />
                <span className="font-mono text-xs">{article.readTime}</span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-white/20 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 text-center md:hidden">
        <CTAButton href="/blog" variant="ghost">
          {t("cta")}
          <ArrowUpRight className="h-4 w-4" />
        </CTAButton>
      </div>
    </SectionWrapper>
  );
}
