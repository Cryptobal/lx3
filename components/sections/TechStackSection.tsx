import { useTranslations } from "next-intl";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { Link } from "@/lib/i18n/routing";
import { ArrowUpRight } from "lucide-react";

const technologies = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "PostgreSQL",
  "Vercel",
  "Claude AI",
  "Node.js",
];

export function TechStackSection() {
  const t = useTranslations("techStack");
  const tb = useTranslations("blogPreview");

  const articles = [
    {
      title: tb("article1Title"),
      category: tb("article1Category"),
    },
    {
      title: tb("article2Title"),
      category: tb("article2Category"),
    },
    {
      title: tb("article3Title"),
      category: tb("article3Category"),
    },
  ];

  return (
    <section className="border-t border-[var(--border-subtle)] bg-[var(--bg-primary)]">
      <SectionWrapper>
        <div className="grid gap-16 md:grid-cols-2 md:gap-12">
          {/* Left side: Tech Stack */}
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
              STACK
            </span>

            <div className="mt-8 grid grid-cols-2 gap-3">
              {technologies.map((tech) => (
                <div
                  key={tech}
                  className="flex items-center gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-5 py-3 transition-colors hover:border-[var(--border-default)]"
                >
                  <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--coral)]" />
                  <span className="font-sans text-sm text-[var(--text-primary)]">
                    {tech}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right side: Blog Preview */}
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--coral)]">
              PERSPECTIVAS
            </span>

            <div className="mt-8 space-y-0 divide-y divide-[var(--border-subtle)]">
              {articles.map((article, i) => (
                <div
                  key={i}
                  className="group flex cursor-pointer items-start justify-between gap-4 py-5 first:pt-0 last:pb-0"
                >
                  <div>
                    <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
                      {article.category}
                    </span>
                    <h3 className="mt-1 font-display text-base font-semibold text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)]">
                      {article.title}
                    </h3>
                  </div>
                  <ArrowUpRight className="mt-5 h-4 w-4 shrink-0 text-[var(--text-tertiary)] transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--accent)]" />
                </div>
              ))}
            </div>

            <Link
              href={"/blog" as "/"}
              className="mt-6 inline-flex items-center gap-1 font-sans text-sm text-[var(--coral)] transition-colors hover:text-[var(--accent)]"
            >
              Ver todos los artículos
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </SectionWrapper>
    </section>
  );
}
