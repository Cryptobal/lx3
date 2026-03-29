export type ProductType = "web" | "software";

export interface Package {
  id: string;
  nameKey: string;
  descriptionKey: string;
  includesKey: string;
  price: number;
  priceLabel: string;
  badge?: string;
  color: string;
  includedAddons: string[];
}

export interface Addon {
  id: string;
  nameKey: string;
  price: number;
  type: "toggle" | "counter";
  infoKey: string;
}

export interface MonthlyPlan {
  id: string;
  nameKey: string;
  descriptionKey: string;
  featuresKey: string;
  price: number;
  badge?: string;
}

export interface FormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  notes: string;
}

export interface CotizadorState {
  product: ProductType;
  step: number;
  selectedPackage: string | null;
  addonCounts: Record<string, number>;
  monthlyPlan: string | null;
  formData: FormData;
}
