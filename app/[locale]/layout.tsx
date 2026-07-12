import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { routing } from "@/lib/i18n/routing";
import { Analytics } from "@vercel/analytics/next";
import { MotionConfig } from "framer-motion";
import { generateLocalBusinessSchema } from "@/lib/seo";

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
    icons: {
      icon: [{ url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },
    openGraph: {
      type: "website",
      locale: locale === "en" ? "en_US" : "es_CL",
      siteName: "LX3",
      images: [
        { url: "/opengraph-image", width: 1200, height: 630 },
        { url: "/logo/LX3_logotipo_dark-bg_1400x400.png", width: 1400, height: 400 },
      ],
    },
    twitter: {
      card: "summary_large_image",
    },
    alternates: {
      languages: {
        es: "https://www.lx3.ai/es",
        en: "https://www.lx3.ai/en",
        "x-default": "https://www.lx3.ai/es",
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
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
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
          <MotionConfig reducedMotion="user">{children}</MotionConfig>
        </NextIntlClientProvider>
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateLocalBusinessSchema()),
          }}
        />
      </body>
    </html>
  );
}
