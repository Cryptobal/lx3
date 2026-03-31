import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  pathnames: {
    "/": "/",
    "/servicios": {
      es: "/servicios",
      en: "/services",
    },
    "/servicios/aplicaciones-internas": {
      es: "/servicios/aplicaciones-internas",
      en: "/services/internal-apps",
    },
    "/servicios/automatizacion-ia": {
      es: "/servicios/automatizacion-ia",
      en: "/services/ai-automation",
    },
    "/servicios/sitios-web": {
      es: "/servicios/sitios-web",
      en: "/services/websites",
    },
    "/servicios/consultoria": {
      es: "/servicios/consultoria",
      en: "/services/consulting",
    },
    "/casos": {
      es: "/casos",
      en: "/cases",
    },
    "/casos/opai-gard-security": {
      es: "/casos/opai-gard-security",
      en: "/cases/opai-gard-security",
    },
    "/casos/gard-sitio-web": {
      es: "/casos/gard-sitio-web",
      en: "/cases/gard-website",
    },
    "/blog": {
      es: "/blog",
      en: "/blog",
    },
    "/sobre-nosotros": {
      es: "/sobre-nosotros",
      en: "/about-us",
    },
    "/contacto": {
      es: "/contacto",
      en: "/contact",
    },
    "/cotiza": {
      es: "/cotiza",
      en: "/quote",
    },

    // Pricing pages
    "/precio/[slug]": { es: "/precio/[slug]", en: "/pricing/[slug]" },

    // Solution pages
    "/soluciones/[slug]": { es: "/soluciones/[slug]", en: "/solutions/[slug]" },

    // Geo pages
    "/desarrollo-web/[slug]": { es: "/desarrollo-web/[slug]", en: "/web-development/[slug]" },
    "/software-a-medida/[slug]": { es: "/software-a-medida/[slug]", en: "/custom-software/[slug]" },
    "/crm-personalizado/[slug]": { es: "/crm-personalizado/[slug]", en: "/custom-crm/[slug]" },

    // New service pages
    "/servicios/desarrollo-web": { es: "/servicios/desarrollo-web", en: "/services/web-development" },
    "/servicios/crm-personalizado": { es: "/servicios/crm-personalizado", en: "/services/custom-crm" },
    "/servicios/tienda-online": { es: "/servicios/tienda-online", en: "/services/online-store" },
    "/servicios/posicionamiento-web": { es: "/servicios/posicionamiento-web", en: "/services/seo" },
    "/servicios/landing-pages": { es: "/servicios/landing-pages", en: "/services/landing-pages" },
    "/servicios/sistema-cotizaciones": { es: "/servicios/sistema-cotizaciones", en: "/services/quoting-system" },
    "/servicios/desarrollo-fullstack": { es: "/servicios/desarrollo-fullstack", en: "/services/fullstack-development" },
    "/servicios/ecommerce-medida": { es: "/servicios/ecommerce-medida", en: "/services/custom-ecommerce" },
  },
});

export type Locale = (typeof routing.locales)[number];
export type Pathnames = keyof typeof routing.pathnames;

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
