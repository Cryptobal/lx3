import type { Package, Addon, MonthlyPlan, ProductType } from "./types";

/* ─── Web Packages ──────────────────────────────────────── */

export const webPackages: Package[] = [
  {
    id: "landing",
    nameKey: "packages.landing.name",
    descriptionKey: "packages.landing.description",
    includesKey: "packages.landing.includes",
    price: 490000,
    priceLabel: "$490.000 CLP",
    color: "var(--accent)",
    includedAddons: [],
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
    includedAddons: ["blog", "whatsapp"],
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
    includedAddons: ["blog", "whatsapp", "mercadopago", "catalogo", "forms"],
  },
];

/* ─── Software Packages ─────────────────────────────────── */

export const softwarePackages: Package[] = [
  {
    id: "mvp",
    nameKey: "packages.mvp.name",
    descriptionKey: "packages.mvp.description",
    includesKey: "packages.mvp.includes",
    price: 3000000,
    priceLabel: "$3.000.000 CLP",
    color: "var(--accent)",
    includedAddons: [],
  },
  {
    id: "business",
    nameKey: "packages.business.name",
    descriptionKey: "packages.business.description",
    includesKey: "packages.business.includes",
    price: 8000000,
    priceLabel: "$8.000.000 CLP",
    badge: "popular",
    color: "var(--coral)",
    includedAddons: ["roles", "dashboard", "api"],
  },
  {
    id: "enterprise",
    nameKey: "packages.enterprise.name",
    descriptionKey: "packages.enterprise.description",
    includesKey: "packages.enterprise.includes",
    price: 15000000,
    priceLabel: "Desde $15.000.000 CLP",
    badge: "premium",
    color: "var(--green)",
    includedAddons: ["roles", "dashboard", "api", "mobile", "chatbot-ai"],
  },
];

/* ─── Web Add-ons ───────────────────────────────────────── */

export const webAddons: Addon[] = [
  { id: "extra-page", nameKey: "addons.extraPage", price: 60000, type: "counter", infoKey: "addonInfo.extraPage" },
  { id: "blog", nameKey: "addons.blog", price: 120000, type: "toggle", infoKey: "addonInfo.blog" },
  { id: "whatsapp", nameKey: "addons.whatsapp", price: 45000, type: "toggle", infoKey: "addonInfo.whatsapp" },
  { id: "mercadopago", nameKey: "addons.mercadopago", price: 150000, type: "toggle", infoKey: "addonInfo.mercadopago" },
  { id: "catalogo", nameKey: "addons.catalogo", price: 180000, type: "toggle", infoKey: "addonInfo.catalogo" },
  { id: "forms", nameKey: "addons.forms", price: 60000, type: "toggle", infoKey: "addonInfo.forms" },
  { id: "chatbot", nameKey: "addons.chatbot", price: 350000, type: "toggle", infoKey: "addonInfo.chatbot" },
  { id: "multilang", nameKey: "addons.multilang", price: 200000, type: "toggle", infoKey: "addonInfo.multilang" },
];

/* ─── Software Add-ons ──────────────────────────────────── */

export const softwareAddons: Addon[] = [
  { id: "crm", nameKey: "addons.crm", price: 2500000, type: "toggle", infoKey: "addonInfo.crm" },
  { id: "cotizaciones", nameKey: "addons.cotizaciones", price: 2000000, type: "toggle", infoKey: "addonInfo.cotizaciones" },
  { id: "roles", nameKey: "addons.roles", price: 800000, type: "toggle", infoKey: "addonInfo.roles" },
  { id: "api", nameKey: "addons.api", price: 600000, type: "counter", infoKey: "addonInfo.api" },
  { id: "mobile", nameKey: "addons.mobile", price: 3000000, type: "toggle", infoKey: "addonInfo.mobile" },
  { id: "dashboard", nameKey: "addons.dashboard", price: 1500000, type: "toggle", infoKey: "addonInfo.dashboard" },
  { id: "chatbot-ai", nameKey: "addons.chatbotAi", price: 2000000, type: "toggle", infoKey: "addonInfo.chatbotAi" },
  { id: "extra-module", nameKey: "addons.extraModule", price: 1500000, type: "counter", infoKey: "addonInfo.extraModule" },
];

/* ─── Web Monthly Plans ─────────────────────────────────── */

export const webPlans: MonthlyPlan[] = [
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

/* ─── Software Monthly Plans ────────────────────────────── */

export const softwarePlans: MonthlyPlan[] = [
  {
    id: "support",
    nameKey: "plans.support.name",
    descriptionKey: "plans.support.description",
    featuresKey: "plans.support.features",
    price: 249000,
  },
  {
    id: "evolution",
    nameKey: "plans.evolution.name",
    descriptionKey: "plans.evolution.description",
    featuresKey: "plans.evolution.features",
    price: 590000,
    badge: "recommended",
  },
  {
    id: "dedicated",
    nameKey: "plans.dedicated.name",
    descriptionKey: "plans.dedicated.description",
    featuresKey: "plans.dedicated.features",
    price: 1490000,
  },
];

/* ─── Helpers ───────────────────────────────────────────── */

export function getPackages(product: ProductType): Package[] {
  return product === "web" ? webPackages : softwarePackages;
}

export function getAddons(product: ProductType): Addon[] {
  return product === "web" ? webAddons : softwareAddons;
}

export function getPlans(product: ProductType): MonthlyPlan[] {
  return product === "web" ? webPlans : softwarePlans;
}

export function formatCLP(amount: number): string {
  return `$${new Intl.NumberFormat("es-CL").format(amount)} CLP`;
}
