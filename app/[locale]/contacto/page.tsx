import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { AnimateOnScroll } from "@/components/shared/AnimateOnScroll";
import { JsonLd } from "@/components/shared/JsonLd";
import { ContactForm } from "./ContactForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "en" ? "Contact | LX3" : "Contacto | LX3",
    description:
      locale === "en"
        ? "Tell us what problem you're trying to solve. We respond within 24 hours with an honest initial assessment."
        : "Cuentanos que problema estas tratando de resolver. Respondemos en menos de 24 horas con una evaluacion inicial honesta.",
  };
}

const contactPointSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPoint",
  contactType: "sales",
  email: "hola@lx3.ai",
  telephone: "+56982307771",
  url: "https://lx3.ai/contacto",
  availableLanguage: ["Spanish", "English"],
};

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <JsonLd data={contactPointSchema} />
      <ContactContent />
    </>
  );
}

function ContactContent() {
  const t = useTranslations("contactPage");

  return (
    <SectionWrapper className="pt-32 pb-20">
      <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
        {/* Left: Form */}
        <div>
          <AnimateOnScroll>
            <p className="text-sm font-medium uppercase tracking-widest text-cyan-400">
              {t("title")}
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-4 text-lg text-white/60">
              {t("subtitle")}
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll delay={0.15}>
            <div className="mt-10">
              <ContactForm />
            </div>
          </AnimateOnScroll>
        </div>

        {/* Right: Alternative contact methods */}
        <div className="lg:pt-24">
          <AnimateOnScroll delay={0.2}>
            <div className="space-y-6">
              <p className="text-sm font-medium uppercase tracking-widest text-white/40">
                {t("alternatives")}
              </p>

              {/* WhatsApp */}
              <a
                href="https://wa.me/56982307771"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.03] p-5 transition-colors hover:border-white/10 hover:bg-white/[0.05]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10">
                  <svg
                    className="h-6 w-6 text-emerald-400"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-white">{t("whatsapp")}</p>
                  <p className="text-sm text-white/40">+56 9 8230 7771</p>
                </div>
                <svg
                  className="ml-auto h-5 w-5 text-white/20"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </a>

              {/* Email */}
              <a
                href="mailto:hola@lx3.ai"
                className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.03] p-5 transition-colors hover:border-white/10 hover:bg-white/[0.05]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                  <svg
                    className="h-6 w-6 text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-white">{t("email")}</p>
                  <p className="text-sm text-white/40">hola@lx3.ai</p>
                </div>
                <svg
                  className="ml-auto h-5 w-5 text-white/20"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </a>

              {/* Calendly */}
              <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.03] p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
                  <svg
                    className="h-6 w-6 text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-white">{t("calendly")}</p>
                  <p className="text-sm text-white/40">Calendly (pronto)</p>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </SectionWrapper>
  );
}
