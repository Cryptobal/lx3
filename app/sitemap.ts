import type { MetadataRoute } from "next";
import { articles } from "@/content/blog";

const BASE_URL = "https://www.lx3.ai";

const staticRoutes: { es: string; en: string }[] = [
  { es: "/es", en: "/en" },
  { es: "/es/servicios", en: "/en/services" },
  { es: "/es/servicios/aplicaciones-internas", en: "/en/services/internal-apps" },
  { es: "/es/servicios/automatizacion-ia", en: "/en/services/ai-automation" },
  { es: "/es/servicios/sitios-web", en: "/en/services/websites" },
  { es: "/es/servicios/consultoria", en: "/en/services/consulting" },
  { es: "/es/casos", en: "/en/cases" },
  { es: "/es/casos/opai-gard-security", en: "/en/cases/opai-gard-security" },
  { es: "/es/casos/gard-sitio-web", en: "/en/cases/gard-website" },
  { es: "/es/blog", en: "/en/blog" },
  { es: "/es/sobre-nosotros", en: "/en/about-us" },
  { es: "/es/contacto", en: "/en/contact" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = staticRoutes.map(({ es, en }) => ({
    url: `${BASE_URL}${es}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: es === "/es" ? 1 : es.includes("/servicios") || es.includes("/casos") ? 0.8 : 0.7,
    alternates: {
      languages: {
        es: `${BASE_URL}${es}`,
        en: `${BASE_URL}${en}`,
        "x-default": `${BASE_URL}${es}`,
      },
    },
  }));

  const blogPosts: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${BASE_URL}/es/blog/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
    alternates: {
      languages: {
        es: `${BASE_URL}/es/blog/${article.slug}`,
        en: `${BASE_URL}/en/blog/${article.slug}`,
        "x-default": `${BASE_URL}/es/blog/${article.slug}`,
      },
    },
  }));

  return [...staticPages, ...blogPosts];
}
