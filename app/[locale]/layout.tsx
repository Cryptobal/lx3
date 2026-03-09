import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { routing } from "@/lib/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingChatButton } from "@/components/chatbot/FloatingChatButton";
import { Analytics } from "@vercel/analytics/next";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    es: "LX3 — Software Studio | Software inteligente para empresas",
    en: "LX3 — Software Studio | Intelligent software for businesses",
  };

  const descriptions: Record<string, string> = {
    es: "Diseñamos y construimos software inteligente para empresas que quieren crecer. Aplicaciones a medida, automatización con IA, sitios web y consultoría tecnológica.",
    en: "We design and build intelligent software for growing businesses. Custom applications, AI automation, websites, and technology consulting.",
  };

  return {
    title: {
      default: titles[locale] || titles.es,
      template: `%s | LX3`,
    },
    description: descriptions[locale] || descriptions.es,
    openGraph: {
      type: "website",
      locale: locale === "en" ? "en_US" : "es_CL",
      siteName: "LX3",
      images: [{ url: "/og-default.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
    },
    alternates: {
      languages: {
        es: "/",
        en: "/en",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "es" | "en")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link
          rel="alternate"
          type="text/plain"
          href="/llms.txt"
          title="LLM Information"
        />
      </head>
      <body
        className={`${jakarta.variable} ${inter.variable} ${jetbrains.variable} grain-overlay min-h-screen bg-background font-sans text-foreground antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main>{children}</main>
          <Footer />
          <FloatingChatButton />
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
