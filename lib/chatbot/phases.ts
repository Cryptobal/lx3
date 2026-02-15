import { ConversationPhase, type LeadData, type PhaseGuidance } from './types';

function countUserMessages(messages: Array<{ role: string }>): number {
  return messages.filter((m) => m.role === 'user').length;
}

function hasMinimumContext(leadData: Partial<LeadData>, fields: (keyof LeadData)[]): boolean {
  return fields.filter((field) => leadData[field] && String(leadData[field]).trim() !== '').length >= 2;
}

export function determineNextPhase(
  currentPhase: ConversationPhase,
  messageCount: number,
  leadData: Partial<LeadData>
): ConversationPhase {
  const userMessageCount = messageCount;

  switch (currentPhase) {
    case ConversationPhase.GREETING: {
      if (userMessageCount >= 1) {
        return ConversationPhase.BUSINESS_CONTEXT;
      }
      return ConversationPhase.GREETING;
    }

    case ConversationPhase.BUSINESS_CONTEXT: {
      const hasContext = hasMinimumContext(leadData, ['company', 'industry', 'size', 'role']);
      if (hasContext || userMessageCount >= 4) {
        return ConversationPhase.DIAGNOSTIC_DEPTH;
      }
      return ConversationPhase.BUSINESS_CONTEXT;
    }

    case ConversationPhase.DIAGNOSTIC_DEPTH: {
      const hasDiagnosticData = hasMinimumContext(leadData, ['painPoint', 'previousAttempts']);
      if (hasDiagnosticData || userMessageCount >= 8) {
        return ConversationPhase.QUALIFICATION;
      }
      return ConversationPhase.DIAGNOSTIC_DEPTH;
    }

    case ConversationPhase.QUALIFICATION: {
      const hasQualificationData = leadData.decisionMakers && String(leadData.decisionMakers).trim() !== '';
      if (hasQualificationData || userMessageCount >= 10) {
        return ConversationPhase.SUMMARY;
      }
      return ConversationPhase.QUALIFICATION;
    }

    case ConversationPhase.SUMMARY: {
      if (userMessageCount >= 11) {
        return ConversationPhase.CONVERSION;
      }
      return ConversationPhase.SUMMARY;
    }

    case ConversationPhase.CONVERSION: {
      return ConversationPhase.CONVERSION;
    }

    default:
      return currentPhase;
  }
}

export function getPhaseGuidance(phase: ConversationPhase): PhaseGuidance {
  const guidance: Record<ConversationPhase, PhaseGuidance> = {
    [ConversationPhase.GREETING]: {
      focus: 'Welcome the visitor and establish rapport. Set the tone for a strategic diagnostic conversation.',
      sampleQuestions: [
        'What is your name and company?',
        'What brings you to explore AI solutions today?',
      ],
      transitionSignals: [
        'User provides name or company',
        'User states a reason for visiting',
        'User asks what AI Factory does',
      ],
    },

    [ConversationPhase.BUSINESS_CONTEXT]: {
      focus: 'Understand the business landscape: company, industry, role, and general area of interest in AI.',
      sampleQuestions: [
        'What does your company do and what is your role?',
        'How large is your organization in terms of employees?',
        'What area of your business are you looking to improve with AI?',
        'What triggered your interest in AI right now?',
      ],
      transitionSignals: [
        'Company and role identified',
        'Industry understood',
        'General challenge area mentioned',
        'Urgency signal detected',
      ],
    },

    [ConversationPhase.DIAGNOSTIC_DEPTH]: {
      focus: 'Deep-dive into the specific business problem. Understand impact, previous attempts, and stakeholder landscape.',
      sampleQuestions: [
        'Can you walk me through how this process works today?',
        'What is the business impact of this challenge — in terms of time, cost, or customer experience?',
        'Have you tried to solve this before? What happened?',
        'Who else in your organization is affected by this challenge?',
      ],
      transitionSignals: [
        'Specific pain point articulated',
        'Business impact quantified or described',
        'Previous attempts discussed',
        'Multiple stakeholders identified',
      ],
    },

    [ConversationPhase.QUALIFICATION]: {
      focus: 'Assess decision-making process, timeline expectations, and organizational readiness.',
      sampleQuestions: [
        'Who would be involved in the decision to move forward with an AI initiative?',
        'Is there a timeline you are working toward?',
        'How would you describe your organization\'s data maturity?',
      ],
      transitionSignals: [
        'Decision-makers identified',
        'Timeline mentioned',
        'Budget awareness indicated',
        'Technical readiness assessed',
      ],
    },

    [ConversationPhase.SUMMARY]: {
      focus: 'Deliver a concise diagnostic summary with identified opportunities and recommended next steps.',
      sampleQuestions: [],
      transitionSignals: [
        'Summary delivered',
        'User acknowledges the summary',
        'User asks about next steps',
      ],
    },

    [ConversationPhase.CONVERSION]: {
      focus: 'Convert the conversation into a scheduled call. Capture email and confirm next steps.',
      sampleQuestions: [
        'May I have your email so we can send you this diagnostic summary?',
        'Would you be available for a 30-minute deep-dive call this week?',
      ],
      transitionSignals: [
        'Email captured',
        'Call scheduled',
        'User declines — close gracefully',
      ],
    },
  };

  return guidance[phase];
}

export function getPhaseIndex(phase: ConversationPhase): number {
  const order: ConversationPhase[] = [
    ConversationPhase.GREETING,
    ConversationPhase.BUSINESS_CONTEXT,
    ConversationPhase.DIAGNOSTIC_DEPTH,
    ConversationPhase.QUALIFICATION,
    ConversationPhase.SUMMARY,
    ConversationPhase.CONVERSION,
  ];
  return order.indexOf(phase);
}

export function isPhaseAfter(phase: ConversationPhase, reference: ConversationPhase): boolean {
  return getPhaseIndex(phase) > getPhaseIndex(reference);
}
