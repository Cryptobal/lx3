import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/routing";
import { CotizadorWrapper } from "@/components/cotizador/CotizadorWrapper";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  return {
    title: isEn
      ? "Get a Quote — Website & Software | LX3"
      : "Cotiza tu Proyecto — Web y Software | LX3",
    description: isEn
      ? "Build your website step by step and get a real-time quote. Or request a free software diagnostic. Websites from $490,000 CLP."
      : "Arma tu sitio web paso a paso y obtén un precio en tiempo real. O solicita un diagnóstico gratuito de software. Sitios desde $490.000 CLP.",
    openGraph: {
      type: "website",
      locale: isEn ? "en_US" : "es_CL",
      siteName: "LX3",
    },
  };
}

export default async function CotizaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isEn = locale === "en";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: isEn ? "Web & Software Development" : "Desarrollo Web y Software",
    description: isEn
      ? "Custom website development with real-time pricing, and software diagnostic service"
      : "Desarrollo de sitios web con precios en tiempo real, y servicio de diagnóstico de software",
    provider: {
      "@type": "Organization",
      name: "LX3 Software Studio",
      url: "https://www.lx3.ai",
    },
    offers: [
      {
        "@type": "Offer",
        name: "Landing Pro",
        price: "490000",
        priceCurrency: "CLP",
      },
      {
        "@type": "Offer",
        name: isEn ? "Corporate Website" : "Web Corporativa",
        price: "1490000",
        priceCurrency: "CLP",
      },
      {
        "@type": "Offer",
        name: isEn ? "Custom Web" : "Web a Medida",
        price: "2500000",
        priceCurrency: "CLP",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Mini header */}
      <header className="border-b border-[var(--border-subtle)] bg-[var(--bg-deep)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/">
              <img
                src="/logo/LX3_logotipo_dark-bg.svg"
                alt="LX3"
                width={100}
                height={28}
                className="h-7 w-auto"
              />
            </Link>
          </div>
          <Link
            href="/"
            className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          >
            ← {isEn ? "Back to lx3.ai" : "Volver a lx3.ai"}
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="py-8 sm:py-12">
        <CotizadorWrapper />
      </main>

      {/* Mini footer */}
      <footer className="border-t border-[var(--border-subtle)] py-6 text-center">
        <p className="text-xs text-[var(--text-tertiary)]">
          © {new Date().getFullYear()} LX3 Software Studio —{" "}
          <a href="https://www.lx3.ai" className="underline hover:text-[var(--text-secondary)]">
            lx3.ai
          </a>
        </p>
      </footer>
    </>
  );
}
