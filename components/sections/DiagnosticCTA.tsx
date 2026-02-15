import { useTranslations } from "next-intl";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { CTAButton } from "@/components/shared/CTAButton";
import { ArrowRight } from "lucide-react";

export function DiagnosticCTA() {
  const t = useTranslations("diagnosticCta");

  return (
    <SectionWrapper variant="dark">
      <div className="flex flex-col items-center text-center">
        <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-white md:text-4xl">
          {t("title")}
        </h2>
        <p className="mt-4 max-w-lg text-lg text-white/60">
          {t("subtitle")}
        </p>
        <div className="mt-8">
          <CTAButton
            href="/diagnostico"
            className="bg-white text-primary hover:bg-white/90 dark:bg-white dark:text-primary dark:hover:bg-white/90"
          >
            {t("cta")}
            <ArrowRight className="h-4 w-4" />
          </CTAButton>
        </div>
      </div>
    </SectionWrapper>
  );
}
