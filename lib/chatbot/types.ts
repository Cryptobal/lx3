export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface LeadData {
  name: string;
  company: string;
  industry: string;
  size: string;
  role: string;
  painPoint: string;
  previousAttempts: string;
  decisionMakers: string;
  email: string;
  phone: string;
  website: string;
  service: string;
  score: number;
}

export interface ConversationState {
  leadData: Partial<LeadData>;
  language: string;
}
