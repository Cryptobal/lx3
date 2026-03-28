export interface Package {
  id: string;
  nameKey: string;
  descriptionKey: string;
  includesKey: string;
  price: number;
  priceLabel: string;
  badge?: string;
  color: string;
}

export interface Addon {
  id: string;
  nameKey: string;
  price: number;
  type: "toggle" | "counter";
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
}

export interface CotizadorState {
  step: number;
  selectedPackage: string | null;
  addonCounts: Record<string, number>;
  monthlyPlan: string | null;
  formData: FormData;
}
