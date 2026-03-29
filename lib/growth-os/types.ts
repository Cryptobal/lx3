// ---- Base interfaces (mirror Prisma models for client usage) ----

export interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: "ADMIN" | "MEMBER" | "VIEWER";
}

export interface Company {
  id: string;
  name: string;
  domain: string | null;
  industry: string | null;
  size: string | null;
  country: string | null;
  city: string | null;
  website: string | null;
  linkedinUrl: string | null;
  logoUrl: string | null;
  phone: string | null;
  description: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  position: string | null;
  linkedinUrl: string | null;
  avatarUrl: string | null;
  source: ContactSource;
  tags: string[];
  notes: string | null;
  companyId: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ContactSource =
  | "MANUAL"
  | "WEBSITE_FORM"
  | "COTIZADOR"
  | "CHATBOT"
  | "APOLLO"
  | "IMPORT"
  | "REFERRAL";

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  color: string | null;
  isDefault: boolean;
  isWon: boolean;
  isLost: boolean;
}

export interface Deal {
  id: string;
  title: string;
  value: number | null;
  currency: string;
  probability: number | null;
  expectedClose: string | null;
  closedAt: string | null;
  lostReason: string | null;
  notes: string | null;
  stageId: string;
  contactId: string | null;
  companyId: string | null;
  assignedToId: string | null;
  createdAt: string;
  updatedAt: string;
}

export type QuoteStatus =
  | "DRAFT"
  | "SENT"
  | "VIEWED"
  | "ACCEPTED"
  | "REJECTED"
  | "EXPIRED";

export interface Quote {
  id: string;
  quoteNumber: string;
  version: number;
  status: QuoteStatus;
  title: string;
  description: string | null;
  subtotal: number;
  taxRate: number | null;
  taxAmount: number | null;
  total: number;
  currency: string;
  validUntil: string | null;
  notes: string | null;
  terms: string | null;
  pdfUrl: string | null;
  trackingToken: string | null;
  viewCount: number;
  lastViewedAt: string | null;
  sentAt: string | null;
  acceptedAt: string | null;
  rejectedAt: string | null;
  dealId: string | null;
  contactId: string | null;
  createdById: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface QuoteItem {
  id: string;
  description: string;
  details: string | null;
  quantity: number;
  unitPrice: number;
  total: number;
  order: number;
  quoteId: string;
}

// ---- Composite types ----

export interface ContactWithCompany extends Contact {
  company: Company | null;
}

export interface DealWithRelations extends Deal {
  stage: PipelineStage;
  contact: Contact | null;
  company: Company | null;
  assignedTo: User | null;
}

export interface QuoteWithItems extends Quote {
  items: QuoteItem[];
  contact: Contact | null;
  deal: Deal | null;
}

export interface DashboardStats {
  totalContacts: number;
  totalCompanies: number;
  openDeals: number;
  openDealsValue: number;
  wonDealsValue: number;
  quotesThisMonth: number;
  conversionRate: number;
  recentActivities: {
    id: string;
    type: string;
    title: string;
    createdAt: string;
  }[];
}

export interface PipelineColumn {
  stage: PipelineStage;
  deals: DealWithRelations[];
  totalValue: number;
}
