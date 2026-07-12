import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import bundleAnalyzer from "@next/bundle-analyzer";

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  experimental: {
    // Inline CSS crítico para reducir render-blocking (alternativa a critters, compatible con App Router)
    inlineCss: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    // ── SEO consolidation redirects (permanent / 308) ──────────────────────
    // Kill thin geo pages, orphan price pages, and merged duplicate services.
    // Destinations must use the *localized* canonical service URLs: static
    // service folders get EN slugs via next-intl (/en/services/web-development),
    // while the dynamic "software-a-medida" stays unlocalized
    // (/en/servicios/software-a-medida). Sending EN redirects to /en/services/<es-slug>
    // would 404, so every EN destination below is the real localized URL.
    const cities = ["santiago", "valparaiso", "concepcion", "antofagasta", "temuco"];

    // Canonical destination service URLs, keyed by the ES service slug.
    const dest: Record<string, { es: string; en: string }> = {
      "sitios-web": { es: "/es/servicios/sitios-web", en: "/en/services/websites" },
      "desarrollo-web": { es: "/es/servicios/desarrollo-web", en: "/en/services/web-development" },
      "software-a-medida": { es: "/es/servicios/software-a-medida", en: "/en/servicios/software-a-medida" },
      "crm-personalizado": { es: "/es/servicios/crm-personalizado", en: "/en/services/custom-crm" },
      "tienda-online": { es: "/es/servicios/tienda-online", en: "/en/services/online-store" },
      "posicionamiento-web": { es: "/es/servicios/posicionamiento-web", en: "/en/services/seo" },
    };

    const out: { source: string; destination: string; permanent: boolean }[] = [];
    const add = (source: string, target: string, locale: "es" | "en") =>
      out.push({ source, destination: dest[target][locale], permanent: true });

    // Geo (thin content) → parent service. ES sources use the es-slug prefix,
    // EN sources use the localized prefix the old routes were served under.
    const geo: { es: string; en: string; target: string }[] = [
      { es: "desarrollo-web", en: "web-development", target: "desarrollo-web" },
      { es: "software-a-medida", en: "custom-software", target: "software-a-medida" },
      { es: "crm-personalizado", en: "custom-crm", target: "crm-personalizado" },
    ];
    for (const g of geo) {
      for (const city of cities) {
        add(`/es/${g.es}/${city}`, g.target, "es");
        add(`/en/${g.en}/${city}`, g.target, "en");
      }
    }

    // Orphan price pages → service page (which now carries the pricing block).
    const priceMap: Record<string, string> = {
      "pagina-web": "sitios-web",
      "desarrollo-web": "desarrollo-web",
      "software-empresarial": "software-a-medida",
      crm: "crm-personalizado",
      "tienda-online": "tienda-online",
      seo: "posicionamiento-web",
    };
    for (const [from, target] of Object.entries(priceMap)) {
      add(`/es/precio/${from}`, target, "es");
      add(`/en/pricing/${from}`, target, "en");
    }

    // Merged duplicate services (old EN URLs were localized too).
    add("/es/servicios/desarrollo-fullstack", "desarrollo-web", "es");
    add("/en/services/fullstack-development", "desarrollo-web", "en");
    add("/es/servicios/ecommerce-medida", "tienda-online", "es");
    add("/en/services/custom-ecommerce", "tienda-online", "en");

    return [
      ...out,
      {
        source: "/:path*",
        has: [{ type: "host", value: "lx3.ai" }],
        destination: "https://www.lx3.ai/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/llms.txt",
        headers: [
          { key: "X-Robots-Tag", value: "all" },
          { key: "Cache-Control", value: "public, max-age=86400" },
        ],
      },
      {
        source: "/llms-full.txt",
        headers: [
          { key: "X-Robots-Tag", value: "all" },
          { key: "Cache-Control", value: "public, max-age=86400" },
        ],
      },
      {
        source: "/cdn-cgi/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default withBundleAnalyzer(withNextIntl(nextConfig));
