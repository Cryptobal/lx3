import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { CTAButton } from "@/components/shared/CTAButton";
import { ProgressiveDisclosure } from "@/components/shared/ProgressiveDisclosure";
import { Workflow, BrainCircuit, Users, Blocks } from "lucide-react";

const capIcons = [Workflow, BrainCircuit, Users, Blocks];
const capKeys = ["cap1", "cap2", "cap3", "cap4"] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "en" ? "Capabilities" : "Capacidades",
    description:
      locale === "en"
        ? "Four technical disciplines executed with specialist depth. Automated decisions, document processing, operational intelligence, conversational AI."
        : "Cuatro disciplinas tecnicas ejecutadas con profundidad de especialista. Decisiones automatizadas, procesamiento de documentos, inteligencia operativa, IA conversacional.",
  };
}

export default async function CapabilitiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <CapabilitiesContent />;
}

function CapabilitiesContent() {
  const t = useTranslations("capabilities");
  const tPage = useTranslations("capabilitiesPage");

  return (
    <SectionWrapper className="pt-32">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl dark:text-white">
          {tPage("title")}
        </h1>
        <p className="mt-4 text-lg text-foreground/60 dark:text-white/60">
          {tPage("subtitle")}
        </p>
      </div>

      <div className="mt-16 space-y-12">
        {capKeys.map((cap, i) => {
          const Icon = capIcons[i];
          return (
            <div
              key={cap}
              className="rounded-2xl border border-foreground/5 p-8 dark:border-white/5"
            >
              <div className="flex items-start gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 dark:bg-accent/20">
                  <Icon className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground dark:text-white">
                    {t(`${cap}Title`)}
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-foreground/60 dark:text-white/60">
                    {t(`${cap}Problem`)}
                  </p>
                </div>
              </div>

              <div className="mt-6 ml-0 md:ml-[4.25rem]">
                <ProgressiveDisclosure
                  trigger={
                    <span className="text-accent">
                      {tPage("showTechnical")}
                    </span>
                  }
                >
                  <div className="space-y-4">
                    <div>
                      <span className="font-mono text-xs uppercase tracking-wider text-foreground/30 dark:text-white/30">
                        {tPage("labelApproach")}
                      </span>
                      <p className="mt-1">{t(`${cap}Approach`)}</p>
                    </div>
                    <div>
                      <span className="font-mono text-xs uppercase tracking-wider text-foreground/30 dark:text-white/30">
                        {tPage("labelImpact")}
                      </span>
                      <p className="mt-1">{t(`${cap}Impact`)}</p>
                    </div>
                  </div>
                </ProgressiveDisclosure>
              </div>

              <div className="mt-6 ml-0 md:ml-[4.25rem]">
                <CTAButton href="/diagnostico" variant="ghost" className="text-sm">
                  {tPage("ctaCard")}
                </CTAButton>
              </div>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
