import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { SectionWrapper } from "@/components/shared/SectionWrapper";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "en" ? "About" : "Nosotros",
    description:
      locale === "en"
        ? "We built a factory because manufacturing is different from advising. Meet the team behind AI Factory."
        : "Construimos una fabrica porque fabricar es diferente a asesorar. Conoce al equipo detras de AI Factory.",
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AboutContent />;
}

function AboutContent() {
  const t = useTranslations("aboutPage");

  const principles = [
    { title: t("p1Title"), desc: t("p1Desc") },
    { title: t("p2Title"), desc: t("p2Desc") },
    { title: t("p3Title"), desc: t("p3Desc") },
  ];

  // Placeholder team - would be data-driven later
  const team = [
    { name: "Fundador", role: "CEO & AI Architect", credential: "Ex-FAANG, 15+ años en ingeniería de software" },
    { name: "CTO", role: "Technical Lead", credential: "Ex-startup unicornio, ML Engineer" },
    { name: "Head of Product", role: "Product Strategy", credential: "Ex-consultora Big 4, MBA" },
  ];

  return (
    <>
      <SectionWrapper className="pt-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl dark:text-white">
            {t("title")}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-foreground/60 dark:text-white/60">
            {t("thesis1")}
          </p>
          <p className="mt-4 text-lg leading-relaxed text-foreground/60 dark:text-white/60">
            {t("thesis2")}
          </p>
        </div>
      </SectionWrapper>

      {/* Team */}
      <SectionWrapper variant="accent">
        <h2 className="text-2xl font-semibold text-foreground md:text-3xl dark:text-white">
          {t("teamTitle")}
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {team.map((member, i) => (
            <div
              key={i}
              className="rounded-xl border border-foreground/5 bg-background p-6 dark:border-white/5 dark:bg-primary/50"
            >
              <div className="h-12 w-12 rounded-full bg-foreground/10 dark:bg-white/10" />
              <h3 className="mt-4 text-base font-medium text-foreground dark:text-white">
                {member.name}
              </h3>
              <p className="text-sm text-accent">{member.role}</p>
              <p className="mt-2 text-sm text-foreground/50 dark:text-white/50">
                {member.credential}
              </p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Principles */}
      <SectionWrapper>
        <h2 className="text-2xl font-semibold text-foreground md:text-3xl dark:text-white">
          {t("principlesTitle")}
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {principles.map((principle, i) => (
            <div key={i}>
              <h3 className="text-base font-medium text-foreground dark:text-white">
                {principle.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/50 dark:text-white/50">
                {principle.desc}
              </p>
            </div>
          ))}
        </div>
      </SectionWrapper>
    </>
  );
}
