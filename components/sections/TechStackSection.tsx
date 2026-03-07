import { useTranslations } from "next-intl";
import { SectionWrapper } from "@/components/shared/SectionWrapper";

const techStack = [
  { name: "Next.js", category: "Framework" },
  { name: "React", category: "UI" },
  { name: "TypeScript", category: "Language" },
  { name: "Tailwind CSS", category: "Styling" },
  { name: "PostgreSQL", category: "Database" },
  { name: "Claude AI", category: "AI" },
  { name: "Vercel", category: "Platform" },
];

export function TechStackSection() {
  const t = useTranslations("techStack");

  return (
    <SectionWrapper>
      <div className="text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
          {t("title")}
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-lg text-white/60">
          {t("subtitle")}
        </p>
      </div>

      <div className="mx-auto mt-14 flex max-w-3xl flex-wrap items-center justify-center gap-4">
        {techStack.map((tech) => (
          <div
            key={tech.name}
            className="group rounded-xl border border-white/5 bg-surface-elevated px-6 py-4 transition-all duration-300 hover:scale-105 hover:border-accent/20 hover:shadow-[0_0_20px_rgba(6,182,212,0.08)]"
          >
            <span className="block font-display text-base font-medium text-white/80 transition-colors group-hover:text-white">
              {tech.name}
            </span>
            <span className="mt-0.5 block font-mono text-xs text-white/30">
              {tech.category}
            </span>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
