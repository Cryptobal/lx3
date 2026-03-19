import type { LeadData } from './types';

const CAPABILITY_KEYWORDS = [
  'automation', 'automate', 'automatizar', 'automatizacion',
  'document', 'documento', 'processing', 'procesamiento',
  'workflow', 'flujo',
  'predict', 'prediccion', 'forecast', 'pronostico',
  'analytics', 'analitica', 'data', 'datos',
  'risk', 'riesgo', 'scoring',
  'recommendation', 'recomendacion',
  'chatbot', 'conversational', 'conversacional',
  'sentiment', 'sentimiento',
  'personalization', 'personalizacion',
  'customer experience', 'experiencia del cliente',
  'computer vision', 'vision artificial',
  'nlp', 'natural language', 'lenguaje natural',
  'generative', 'generativa',
  'ai', 'ia', 'inteligencia artificial', 'artificial intelligence',
  'machine learning', 'aprendizaje automatico',
];

const BUDGET_TIMELINE_KEYWORDS = [
  'budget', 'presupuesto',
  'timeline', 'plazo', 'tiempo',
  'quarter', 'trimestre',
  'deadline', 'fecha limite',
  'invest', 'inversion', 'invertir',
  'allocated', 'asignado',
  'approved', 'aprobado',
  'fiscal year', 'ano fiscal',
  'this year', 'este ano',
  'next quarter', 'proximo trimestre',
  'ready to start', 'listos para empezar',
  'as soon as possible', 'lo antes posible',
  'cotizacion', 'cotizar', 'cotizaciones', 'quote', 'quotation', 'estimate', 'estimacion',
  'propuesta', 'proposal', 'presupuesto',
];

const C_LEVEL_TITLES = [
  'ceo', 'cto', 'cfo', 'coo', 'cio', 'cdo', 'cmo',
  'chief', 'founder', 'co-founder', 'fundador', 'cofundador',
  'president', 'presidente',
  'owner', 'propietario', 'dueno',
  'partner', 'socio',
  'managing director', 'director general',
  'general manager', 'gerente general',
  'vp', 'vice president', 'vicepresidente',
];

const DIRECTOR_TITLES = [
  'director', 'directora',
  'head of', 'jefe de', 'jefa de',
  'senior manager', 'gerente senior',
  'lead', 'lider',
  'principal',
  'senior vice president', 'svp',
];

function normalizeText(text: string): string {
  return text.toLowerCase().trim();
}

function containsAny(text: string, keywords: string[]): boolean {
  const normalized = normalizeText(text);
  return keywords.some((keyword) => normalized.includes(keyword.toLowerCase()));
}

function parseCompanySize(size: string): number {
  const normalized = normalizeText(size);
  const numberMatch = normalized.match(/(\d+)/);
  if (numberMatch) {
    return parseInt(numberMatch[1], 10);
  }

  if (normalized.includes('small') || normalized.includes('pequen')) return 25;
  if (normalized.includes('medium') || normalized.includes('median')) return 150;
  if (normalized.includes('large') || normalized.includes('grand')) return 500;
  if (normalized.includes('enterprise') || normalized.includes('empresa')) return 1000;

  return 0;
}

function isRoleCLevel(role: string): boolean {
  return containsAny(role, C_LEVEL_TITLES);
}

function isRoleDirector(role: string): boolean {
  return containsAny(role, DIRECTOR_TITLES);
}

export function calculateLeadScore(leadData: Partial<LeadData>): number {
  let score = 0;

  if (leadData.size) {
    const companySize = parseCompanySize(leadData.size);
    if (companySize >= 50 && companySize <= 500) {
      score += 15;
    } else if (companySize > 500) {
      score += 15;
    } else if (companySize >= 20 && companySize < 50) {
      score += 5;
    }
  }

  if (leadData.role) {
    if (isRoleCLevel(leadData.role)) {
      score += 20;
    } else if (isRoleDirector(leadData.role)) {
      score += 10;
    } else if (leadData.role.trim() !== '') {
      score += 3;
    }
  }

  if (leadData.painPoint && leadData.painPoint.trim() !== '') {
    score += 15;

    if (containsAny(leadData.painPoint, CAPABILITY_KEYWORDS)) {
      score += 10;
    }
  }

  const allText = [
    leadData.painPoint || '',
    leadData.previousAttempts || '',
    leadData.decisionMakers || '',
    leadData.service || '',
  ].join(' ');

  if (containsAny(allText, BUDGET_TIMELINE_KEYWORDS)) {
    score += 10;
  }

  // Solicitud explícita de cotización/propuesta (service suele contener esto)
  if (leadData.service && containsAny(leadData.service, ['cotiz', 'quote', 'propuesta', 'presupuesto', 'estimate'])) {
    score += 25;
  }

  if (leadData.painPoint && leadData.previousAttempts && leadData.decisionMakers) {
    score += 10;
  }

  if (leadData.email && leadData.email.includes('@')) {
    score += 5;
  }

  return Math.min(score, 100);
}

export function getLeadTier(score: number): 'hot' | 'warm' | 'cold' {
  if (score >= 60) return 'hot';
  if (score >= 30) return 'warm';
  return 'cold';
}

export function getScoreBreakdown(leadData: Partial<LeadData>): Record<string, number> {
  const breakdown: Record<string, number> = {};

  if (leadData.size) {
    const companySize = parseCompanySize(leadData.size);
    if (companySize >= 50) breakdown['Company Size (50+)'] = 15;
    else if (companySize >= 20) breakdown['Company Size (20-49)'] = 5;
  }

  if (leadData.role) {
    if (isRoleCLevel(leadData.role)) breakdown['C-Level Role'] = 20;
    else if (isRoleDirector(leadData.role)) breakdown['Director-Level Role'] = 10;
    else if (leadData.role.trim() !== '') breakdown['Other Role'] = 3;
  }

  if (leadData.painPoint && leadData.painPoint.trim() !== '') {
    breakdown['Problem Identified'] = 15;
    if (containsAny(leadData.painPoint, CAPABILITY_KEYWORDS)) {
      breakdown['Problem Aligned to Capabilities'] = 10;
    }
  }

  const allText = [
    leadData.painPoint || '',
    leadData.previousAttempts || '',
    leadData.decisionMakers || '',
    leadData.service || '',
  ].join(' ');
  if (containsAny(allText, BUDGET_TIMELINE_KEYWORDS)) {
    breakdown['Budget/Timeline Mentioned'] = 10;
  }

  if (leadData.service && containsAny(leadData.service, ['cotiz', 'quote', 'propuesta', 'presupuesto', 'estimate'])) {
    breakdown['Quote/Proposal Request'] = 25;
  }

  if (leadData.painPoint && leadData.previousAttempts && leadData.decisionMakers) {
    breakdown['Completed Diagnostic'] = 10;
  }

  if (leadData.email && leadData.email.includes('@')) {
    breakdown['Email Captured'] = 5;
  }

  return breakdown;
}
