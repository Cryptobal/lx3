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
    return [
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
