import type {
  Contact, Company, Deal, PipelineStage, Quote, QuoteItem,
  Activity, VisitorSession, PageView, EmailLog, User,
  ContactSource, QuoteStatus, ActivityType, EmailStatus, UserRole
} from "@/lib/generated/prisma/client";

// Re-export Prisma types for convenience
export type {
  Contact, Company, Deal, PipelineStage, Quote, QuoteItem,
  Activity, VisitorSession, PageView, EmailLog, User,
  ContactSource, QuoteStatus, ActivityType, EmailStatus, UserRole
};

// Extended types with relations
export type ContactWithRelations = Contact & {
  company?: Company | null;
  deals?: Deal[];
  activities?: Activity[];
  quotes?: Quote[];
};

export type DealWithRelations = Deal & {
  stage: PipelineStage;
  contact?: Contact | null;
  company?: Company | null;
  assignedTo?: User | null;
};

export type QuoteWithRelations = Quote & {
  items: QuoteItem[];
  contact?: Contact | null;
  deal?: Deal | null;
  createdBy?: User | null;
};

export type StageWithDeals = PipelineStage & {
  deals: DealWithRelations[];
};

// Pagination
export type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
