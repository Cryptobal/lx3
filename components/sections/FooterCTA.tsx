import { useTranslations } from "next-intl";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { CTAButton } from "@/components/shared/CTAButton";

export function FooterCTA() {
  const t = useTranslations("footerCta");

  return (
    <SectionWrapper>
      <div className="flex flex-col items-center text-center">
        <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-foreground md:text-4xl dark:text-white">
          {t("title")}
        </h2>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <CTAButton href="/contacto" variant="primary">
            {t("cta")}
          </CTAButton>
          <CTAButton
            href="mailto:hola@lx3.ai"
            variant="secondary"
            external
          >
            {t("email")}
          </CTAButton>
        </div>
      </div>
    </SectionWrapper>
  );
}
