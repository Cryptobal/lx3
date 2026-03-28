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
      ? "Get a Website Quote | LX3 Software Studio"
      : "Cotiza tu Sitio Web | LX3 Software Studio",
    description: isEn
      ? "Build your website step by step and get a real-time quote. Packages from $490,000 CLP. Landing pages, corporate sites and web platforms."
      : "Arma tu sitio web paso a paso y obtén un precio en tiempo real. Paquetes desde $490.000 CLP. Landing pages, sitios corporativos y plataformas web.",
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
    name: isEn ? "Website Development" : "Desarrollo de Sitios Web",
    description: isEn
      ? "Custom website development services with real-time pricing"
      : "Servicios de desarrollo de sitios web con precios en tiempo real",
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
        name: isEn ? "Web + Functionality" : "Web + Funcionalidad",
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
            <span className="text-sm font-medium text-[var(--text-tertiary)]">
              / {isEn ? "Quoter" : "Cotizador"}
            </span>
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
