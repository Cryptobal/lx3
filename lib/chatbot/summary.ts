import type { LeadData } from './types';

function buildSituationContext(leadData: Partial<LeadData>): string {
  const parts: string[] = [];

  if (leadData.company) parts.push(`Company: ${leadData.company}`);
  if (leadData.industry) parts.push(`Industry: ${leadData.industry}`);
  if (leadData.size) parts.push(`Company Size: ${leadData.size}`);
  if (leadData.role) parts.push(`Contact Role: ${leadData.role}`);
  if (leadData.painPoint) parts.push(`Primary Challenge: ${leadData.painPoint}`);
  if (leadData.previousAttempts) parts.push(`Previous Attempts: ${leadData.previousAttempts}`);
  if (leadData.decisionMakers) parts.push(`Decision-Making Context: ${leadData.decisionMakers}`);

  return parts.join('\n');
}

export function generateSummaryPrompt(leadData: Partial<LeadData>, language: string): string {
  const context = buildSituationContext(leadData);
  const isSpanish = language.startsWith('es');
  const today = new Date().toISOString().split('T')[0];

  if (isSpanish) {
    return `Basandote en la siguiente informacion recopilada durante nuestra conversacion diagnostica, genera un resumen ejecutivo en formato markdown.

INFORMACION DEL PROSPECTO:
${context}

FECHA: ${today}

INSTRUCCIONES:
Genera el resumen siguiendo EXACTAMENTE esta estructura en markdown:

# Resumen Diagnostico — ${leadData.company || 'Empresa'}

**Fecha:** ${today}
**Preparado por:** AI Factory — Equipo de Diagnostico

---

## Resumen de Situacion
Escribe 2-3 parrafos resumiendo la situacion actual del negocio, los desafios identificados y el contexto organizacional. Se especifico basandote en lo que el prospecto compartio.

## Areas de Oportunidad Identificadas

Para cada oportunidad (identifica 2-3), usa este formato:

### 1. [Nombre del Area de Oportunidad]
- **Descripcion:** Explicacion breve de la oportunidad
- **Impacto Potencial:** Alto / Medio / Bajo — con una linea explicando por que
- **Complejidad de Implementacion:** Alta / Media / Baja — con una linea explicando por que

### 2. [Nombre del Area de Oportunidad]
(mismo formato)

### 3. [Nombre del Area de Oportunidad]
(mismo formato, si aplica)

## Siguiente Paso Recomendado
Describe el siguiente paso recomendado: una sesion de descubrimiento profunda de 30 minutos con un estratega senior de AI Factory para validar estas oportunidades y definir un plan de accion.

---

> **Nota:** Este es un diagnostico preliminar basado en una conversacion inicial. Las recomendaciones especificas, estimaciones de esfuerzo y analisis de retorno de inversion requieren una evaluacion mas profunda durante nuestra fase de Diagnostico formal.

---

Las oportunidades deben estar alineadas con las capacidades de AI Factory:
- Automatizacion de Procesos
- Inteligencia de Decision
- IA para Experiencia del Cliente
- Aplicaciones de IA Personalizadas

No incluyas precios, estimaciones de costos, porcentajes de ROI especificos, nombres de competidores ni detalles tecnicos de implementacion.`;
  }

  return `Based on the following information gathered during our diagnostic conversation, generate an executive summary in markdown format.

PROSPECT INFORMATION:
${context}

DATE: ${today}

INSTRUCTIONS:
Generate the summary following EXACTLY this structure in markdown:

# Diagnostic Summary — ${leadData.company || 'Company'}

**Date:** ${today}
**Prepared by:** AI Factory — Diagnostic Team

---

## Situation Summary
Write 2-3 paragraphs summarizing the current business situation, the challenges identified, and the organizational context. Be specific based on what the prospect shared.

## Identified Opportunity Areas

For each opportunity (identify 2-3), use this format:

### 1. [Opportunity Area Name]
- **Description:** Brief explanation of the opportunity
- **Potential Impact:** High / Medium / Low — with one line explaining why
- **Implementation Complexity:** High / Medium / Low — with one line explaining why

### 2. [Opportunity Area Name]
(same format)

### 3. [Opportunity Area Name]
(same format, if applicable)

## Recommended Next Step
Describe the recommended next step: a 30-minute deep-dive discovery session with a senior AI Factory strategist to validate these opportunities and define an action plan.

---

> **Note:** This is a preliminary diagnostic based on an initial conversation. Specific recommendations, effort estimates, and ROI analysis require a deeper evaluation during our formal Diagnose phase.

---

The opportunities must be aligned with AI Factory's capability areas:
- Process Automation
- Decision Intelligence
- CX AI
- Custom AI Apps

Do not include pricing, cost estimates, specific ROI percentages, competitor names, or technical implementation details.`;
}
