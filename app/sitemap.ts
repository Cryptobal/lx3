import type { MetadataRoute } from "next";
import { articles } from "@/content/blog";
import { SERVICE_PAGES, INDUSTRY_PAGES, PRICE_PAGES } from "@/data/keywords";
import { CITIES, GEO_SERVICES } from "@/data/cities";
import { BLOG_POSTS } from "@/data/blog-posts";

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
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = staticRoutes.map(({ es, en }) => ({
    url: `${BASE_URL}${es}`,
    lastModified: now,
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
    lastModified: now,
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

  // SEO programmatic service pages
  const serviceRoutes: MetadataRoute.Sitemap = SERVICE_PAGES.map((s) => ({
    url: `${BASE_URL}/es/servicios/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  // SEO industry/solution pages
  const industryRoutes: MetadataRoute.Sitemap = INDUSTRY_PAGES.map((i) => ({
    url: `${BASE_URL}/es/soluciones/${i.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // SEO price pages
  const priceRoutes: MetadataRoute.Sitemap = PRICE_PAGES.map((p) => ({
    url: `${BASE_URL}/es/precio/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  // Geo service pages (city × service combinations)
  const geoRoutes: MetadataRoute.Sitemap = GEO_SERVICES.flatMap((servicio) =>
    CITIES.map((city) => ({
      url: `${BASE_URL}/es/${servicio}/${city.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    }))
  );

  // SEO programmatic blog posts
  const seoBlogRoutes: MetadataRoute.Sitemap = BLOG_POSTS.map((p) => ({
    url: `${BASE_URL}/es/seo-blog/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...blogPosts,
    ...serviceRoutes,
    ...industryRoutes,
    ...priceRoutes,
    ...geoRoutes,
    ...seoBlogRoutes,
  ];
}
