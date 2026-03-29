export interface Package {
  id: string;
  nameKey: string;
  descriptionKey: string;
  includesKey: string;
  socialProofKey: string;
  price: number;
  priceLabel: string;
  badge?: string;
  color: string;
  includedAddons: string[];
  highlightKey?: string;
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
  source: string;
  notes: string;
}

export interface CotizadorState {
  step: number;
  selectedPackage: string | null;
  addonCounts: Record<string, number>;
  monthlyPlan: string | null;
  formData: FormData;
}

export type ActiveTab = "web" | "software";

export interface DiagnosticFormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  description: string;
}

export interface DiagnosticState {
  step: number;
  needs: string[];
  needsOther: string;
  userCount: string;
  currentTools: string[];
  currentToolsOther: string;
  hasTechTeam: string;
  budget: string;
  formData: DiagnosticFormData;
}
