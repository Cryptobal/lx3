import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { ChatWindow } from "@/components/chatbot/ChatWindow";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "en" ? "AI Diagnostic" : "Diagnostico de IA",
    description:
      locale === "en"
        ? "Answer 8 questions about your operation. Our system identifies where AI can generate measurable impact. Results in 3 minutes."
        : "Responde 8 preguntas sobre tu operacion. Nuestro sistema identifica donde la IA puede generar impacto medible. Resultado en 3 minutos.",
  };
}

export default async function DiagnosticPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <DiagnosticContent />;
}

function DiagnosticContent() {
  const t = useTranslations("diagnosticPage");

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center px-6 pt-24 pb-12">
      <div className="mb-8 max-w-lg text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl dark:text-white">
          {t("title")}
        </h1>
        <p className="mt-3 text-base text-foreground/60 dark:text-white/60">
          {t("subtitle")}
        </p>
      </div>

      <div className="w-full max-w-2xl flex-1">
        <ChatWindow />
      </div>
    </div>
  );
}
