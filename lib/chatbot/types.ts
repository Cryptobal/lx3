export enum ConversationPhase {
  GREETING = 'greeting',
  BUSINESS_CONTEXT = 'business_context',
  DIAGNOSTIC_DEPTH = 'diagnostic_depth',
  QUALIFICATION = 'qualification',
  SUMMARY = 'summary',
  CONVERSION = 'conversion',
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface LeadData {
  company: string;
  industry: string;
  size: string;
  role: string;
  painPoint: string;
  previousAttempts: string;
  decisionMakers: string;
  email: string;
  score: number;
}

export interface OpportunityArea {
  area: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  complexity: 'high' | 'medium' | 'low';
}

export interface DiagnosticSummary {
  company: string;
  date: string;
  situationSummary: string;
  opportunities: OpportunityArea[];
  recommendedNextStep: string;
}

export interface ConversationState {
  phase: ConversationPhase;
  messages: ChatMessage[];
  leadData: Partial<LeadData>;
  language: string;
}

export interface ChatRequestBody {
  messages: ChatMessage[];
  conversationState: ConversationState;
}

export interface PhaseGuidance {
  focus: string;
  sampleQuestions: string[];
  transitionSignals: string[];
}
