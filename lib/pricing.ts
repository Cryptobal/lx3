// ── Canonical pricing — single source of truth ─────────────────────────────
// Any price shown on the marketing site for these products must match this file.

export interface CanonicalPrice {
  name: string;
  price: string;
  description: string;
}

export const CANONICAL_PRICING: CanonicalPrice[] = [
  {
    name: "Landing Pro",
    price: "$490.000",
    description: "Landing page de alta conversión, lista en días.",
  },
  {
    name: "Web Corporativa",
    price: "$1.490.000",
    description: "Sitio corporativo multipágina, editable y optimizado para SEO.",
  },
  {
    name: "Web a Medida",
    price: "Desde $2.500.000",
    description: "Plataforma o aplicación web a la medida de tu operación.",
  },
  {
    name: "Software a medida",
    price: "Desde $3.000.000",
    description: "Sistemas, ERPs y plataformas con IA integrada en el núcleo.",
  },
];
