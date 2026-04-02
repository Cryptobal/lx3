import type { MetadataRoute } from "next";
import { articles } from "@/content/blog";
import { SERVICE_PAGES, INDUSTRY_PAGES, PRICE_PAGES } from "@/data/keywords";
import { CITIES, GEO_SERVICES } from "@/data/cities";
import { BLOG_POSTS } from "@/data/blog-posts";

const BASE_URL = "https://www.lx3.ai";

const staticRoutes: { es: string; en: string; priority?: number }[] = [
  { es: "/es", en: "/en" },
  { es: "/es/servicios", en: "/en/services" },
  { es: "/es/servicios/aplicaciones-internas", en: "/en/services/internal-apps" },
  { es: "/es/servicios/automatizacion-ia", en: "/en/services/ai-automation" },
  { es: "/es/servicios/sitios-web", en: "/en/services/websites" },
  { es: "/es/servicios/consultoria", en: "/en/services/consulting" },
  { es: "/es/casos", en: "/en/cases" },
  { es: "/es/casos/opai-gard-security", en: "/en/cases/opai-gard-security" },
  { es: "/es/casos/gard-sitio-web", en: "/en/cases/gard-website" },
  { es: "/es/casos/casa-orfebre", en: "/en/cases/casa-orfebre" },
  { es: "/es/blog", en: "/en/blog" },
  { es: "/es/sobre-nosotros", en: "/en/about-us" },
  { es: "/es/contacto", en: "/en/contact" },

  // Service pages (priority 0.8)
  { es: "/es/servicios/desarrollo-web", en: "/en/services/web-development", priority: 0.8 },
  { es: "/es/servicios/crm-personalizado", en: "/en/services/custom-crm", priority: 0.8 },
  { es: "/es/servicios/tienda-online", en: "/en/services/online-store", priority: 0.8 },
  { es: "/es/servicios/posicionamiento-web", en: "/en/services/seo", priority: 0.8 },
  { es: "/es/servicios/landing-pages", en: "/en/services/landing-pages", priority: 0.8 },
  { es: "/es/servicios/sistema-cotizaciones", en: "/en/services/quoting-system", priority: 0.8 },
  { es: "/es/servicios/desarrollo-fullstack", en: "/en/services/fullstack-development", priority: 0.8 },
  { es: "/es/servicios/ecommerce-medida", en: "/en/services/custom-ecommerce", priority: 0.8 },

  // Pricing pages (priority 0.8)
  { es: "/es/precio/pagina-web", en: "/en/pricing/pagina-web", priority: 0.8 },
  { es: "/es/precio/desarrollo-web", en: "/en/pricing/desarrollo-web", priority: 0.8 },
  { es: "/es/precio/software-empresarial", en: "/en/pricing/software-empresarial", priority: 0.8 },
  { es: "/es/precio/crm", en: "/en/pricing/crm", priority: 0.8 },
  { es: "/es/precio/tienda-online", en: "/en/pricing/tienda-online", priority: 0.8 },
  { es: "/es/precio/seo", en: "/en/pricing/seo", priority: 0.8 },

  // Solution pages (priority 0.7)
  { es: "/es/soluciones/empresas-seguridad", en: "/en/solutions/empresas-seguridad", priority: 0.7 },
  { es: "/es/soluciones/clinicas", en: "/en/solutions/clinicas", priority: 0.7 },
  { es: "/es/soluciones/logistica", en: "/en/solutions/logistica", priority: 0.7 },
  { es: "/es/soluciones/pymes", en: "/en/solutions/pymes", priority: 0.7 },
  { es: "/es/soluciones/constructoras", en: "/en/solutions/constructoras", priority: 0.7 },
  { es: "/es/soluciones/restaurantes", en: "/en/solutions/restaurantes", priority: 0.7 },
  { es: "/es/soluciones/retail", en: "/en/solutions/retail", priority: 0.7 },

  // Geo pages — desarrollo-web (priority 0.6)
  { es: "/es/desarrollo-web/santiago", en: "/en/web-development/santiago", priority: 0.6 },
  { es: "/es/desarrollo-web/valparaiso", en: "/en/web-development/valparaiso", priority: 0.6 },
  { es: "/es/desarrollo-web/concepcion", en: "/en/web-development/concepcion", priority: 0.6 },
  { es: "/es/desarrollo-web/antofagasta", en: "/en/web-development/antofagasta", priority: 0.6 },
  { es: "/es/desarrollo-web/temuco", en: "/en/web-development/temuco", priority: 0.6 },

  // Geo pages — software-a-medida (priority 0.6)
  { es: "/es/software-a-medida/santiago", en: "/en/custom-software/santiago", priority: 0.6 },
  { es: "/es/software-a-medida/valparaiso", en: "/en/custom-software/valparaiso", priority: 0.6 },
  { es: "/es/software-a-medida/concepcion", en: "/en/custom-software/concepcion", priority: 0.6 },
  { es: "/es/software-a-medida/antofagasta", en: "/en/custom-software/antofagasta", priority: 0.6 },
  { es: "/es/software-a-medida/temuco", en: "/en/custom-software/temuco", priority: 0.6 },

  // Geo pages — crm-personalizado (priority 0.6)
  { es: "/es/crm-personalizado/santiago", en: "/en/custom-crm/santiago", priority: 0.6 },
  { es: "/es/crm-personalizado/valparaiso", en: "/en/custom-crm/valparaiso", priority: 0.6 },
  { es: "/es/crm-personalizado/concepcion", en: "/en/custom-crm/concepcion", priority: 0.6 },
  { es: "/es/crm-personalizado/antofagasta", en: "/en/custom-crm/antofagasta", priority: 0.6 },
  { es: "/es/crm-personalizado/temuco", en: "/en/custom-crm/temuco", priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = staticRoutes.map(({ es, en, priority: routePriority }) => ({
    url: `${BASE_URL}${es}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority:
      routePriority !== undefined
        ? routePriority
        : es === "/es"
        ? 1
        : es.includes("/servicios") || es.includes("/casos")
        ? 0.8
        : 0.7,
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
