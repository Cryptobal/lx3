import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { routing } from "@/lib/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { FloatingChatButton } from "@/components/chatbot/FloatingChatButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    es: "LX3 — AI Factory para empresas",
    en: "LX3 — AI Factory for enterprises",
  };

  const descriptions: Record<string, string> = {
    es: "Diseñamos y construimos software a medida con IA que resuelve los problemas más caros de tu operación.",
    en: "We design and build custom AI software that solves your most expensive operational problems.",
  };

  return {
    title: {
      default: titles[locale] || titles.es,
      template: `%s | LX3`,
    },
    description: descriptions[locale] || descriptions.es,
    openGraph: {
      type: "website",
      locale: locale === "en" ? "en_US" : "es_MX",
      siteName: "LX3",
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
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans text-foreground antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <Header />
            <main className="pt-16">{children}</main>
            <Footer />
            <FloatingChatButton />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
