import type { Package, Addon, MonthlyPlan } from "./types";

export const packages: Package[] = [
  {
    id: "landing",
    nameKey: "packages.landing.name",
    descriptionKey: "packages.landing.description",
    includesKey: "packages.landing.includes",
    price: 490000,
    priceLabel: "$490.000 CLP",
    color: "var(--accent)",
  },
  {
    id: "corporate",
    nameKey: "packages.corporate.name",
    descriptionKey: "packages.corporate.description",
    includesKey: "packages.corporate.includes",
    price: 1490000,
    priceLabel: "$1.490.000 CLP",
    badge: "popular",
    color: "var(--coral)",
  },
  {
    id: "platform",
    nameKey: "packages.platform.name",
    descriptionKey: "packages.platform.description",
    includesKey: "packages.platform.includes",
    price: 2500000,
    priceLabel: "Desde $2.500.000 CLP",
    badge: "premium",
    color: "var(--green)",
  },
];

export const addons: Addon[] = [
  { id: "extra-page", nameKey: "addons.extraPage", price: 60000, type: "counter" },
  { id: "blog", nameKey: "addons.blog", price: 120000, type: "toggle" },
  { id: "whatsapp", nameKey: "addons.whatsapp", price: 45000, type: "toggle" },
  { id: "payments", nameKey: "addons.payments", price: 150000, type: "toggle" },
  { id: "catalog", nameKey: "addons.catalog", price: 180000, type: "toggle" },
  { id: "forms", nameKey: "addons.forms", price: 60000, type: "toggle" },
  { id: "chatbot", nameKey: "addons.chatbot", price: 350000, type: "toggle" },
  { id: "multilang", nameKey: "addons.multilang", price: 200000, type: "toggle" },
];

export const monthlyPlans: MonthlyPlan[] = [
  {
    id: "basic",
    nameKey: "plans.basic.name",
    descriptionKey: "plans.basic.description",
    featuresKey: "plans.basic.features",
    price: 49000,
  },
  {
    id: "growth",
    nameKey: "plans.growth.name",
    descriptionKey: "plans.growth.description",
    featuresKey: "plans.growth.features",
    price: 149000,
    badge: "recommended",
  },
  {
    id: "pro",
    nameKey: "plans.pro.name",
    descriptionKey: "plans.pro.description",
    featuresKey: "plans.pro.features",
    price: 349000,
  },
];

export function formatCLP(amount: number): string {
  return `$${new Intl.NumberFormat("es-CL").format(amount)} CLP`;
}
