import type { MetadataRoute } from "next";

// Solo directivas estándar: User-agent, Allow, Disallow, Sitemap.
// NO usar Content-Signal (search=yes, ai-train=no): Google lo marca como error.

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/admin/", "/q/"],
      },
      // Bots de IA — PERMITIR TODOS explícitamente
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Bingbot", allow: "/" },
      { userAgent: "Amazonbot", allow: "/" },
      { userAgent: "FacebookBot", allow: "/" },
      { userAgent: "Applebot", allow: "/" },
      { userAgent: "cohere-ai", allow: "/" },
    ],
    sitemap: "https://www.lx3.ai/sitemap.xml",
  };
}
