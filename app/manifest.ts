import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LX3 Growth OS — CRM",
    short_name: "LX3 CRM",
    description:
      "Plataforma de gestión comercial: contactos, empresas, pipeline, cotizaciones y más.",
    start_url: "/admin",
    scope: "/admin",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    orientation: "any",
    categories: ["business", "productivity"],
    icons: [
      {
        src: "/logo/LX3_isotipo.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/pwa-icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/pwa-icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
