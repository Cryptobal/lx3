import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  pathnames: {
    "/": "/",
    "/como-trabajamos": {
      es: "/como-trabajamos",
      en: "/how-we-work",
    },
    "/capacidades": {
      es: "/capacidades",
      en: "/capabilities",
    },
    "/diagnostico": {
      es: "/diagnostico",
      en: "/diagnostic",
    },
    "/perspectivas": {
      es: "/perspectivas",
      en: "/insights",
    },
    "/nosotros": {
      es: "/nosotros",
      en: "/about",
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
