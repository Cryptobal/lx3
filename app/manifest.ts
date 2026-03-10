import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LX3 — Software Studio",
    short_name: "LX3",
    description: "Software inteligente para empresas. Aplicaciones a medida, automatización con IA, sitios web y consultoría.",
    start_url: "/",
    display: "standalone",
    background_color: "#06080E",
    theme_color: "#06080E",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
