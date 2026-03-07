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
  },
});

export type Locale = (typeof routing.locales)[number];
export type Pathnames = keyof typeof routing.pathnames;

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
