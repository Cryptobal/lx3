"use client";

import { useTranslations } from "next-intl";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { CTAButton } from "@/components/shared/CTAButton";

export function ContactContent() {
  const t = useTranslations("contactPage");

  return (
    <SectionWrapper className="pt-32">
      <div className="grid gap-12 md:grid-cols-2">
        {/* Form */}
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl dark:text-white">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-foreground/60 dark:text-white/60">
            {t("subtitle")}
          </p>

          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              // TODO: Integrate with CRM / API
            }}
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-foreground/70 dark:text-white/70"
              >
                {t("formName")}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 w-full rounded-lg border border-foreground/10 bg-transparent px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent dark:border-white/10 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground/70 dark:text-white/70"
              >
                {t("formEmail")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 w-full rounded-lg border border-foreground/10 bg-transparent px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent dark:border-white/10 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="company"
                className="block text-sm font-medium text-foreground/70 dark:text-white/70"
              >
                {t("formCompany")}
              </label>
              <input
                id="company"
                name="company"
                type="text"
                required
                className="mt-1 w-full rounded-lg border border-foreground/10 bg-transparent px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent dark:border-white/10 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="problem"
                className="block text-sm font-medium text-foreground/70 dark:text-white/70"
              >
                {t("formProblem")}
              </label>
              <textarea
                id="problem"
                name="problem"
                required
                rows={3}
                className="mt-1 w-full resize-none rounded-lg border border-foreground/10 bg-transparent px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent dark:border-white/10 dark:text-white"
              />
            </div>

            <CTAButton variant="primary" className="w-full">
              {t("formSubmit")}
            </CTAButton>
          </form>
        </div>

        {/* Calendly placeholder */}
        <div>
          <h2 className="text-xl font-semibold text-foreground dark:text-white">
            {t("calendlyTitle")}
          </h2>
          <div className="mt-4 flex h-96 items-center justify-center rounded-xl border border-foreground/5 bg-foreground/[0.02] dark:border-white/5 dark:bg-white/[0.02]">
            <p className="text-sm text-foreground/30 dark:text-white/30">
              Calendly embed will go here
            </p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
