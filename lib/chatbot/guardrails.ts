const PRICING_PATTERNS = [
  /\b(price|pricing|cost|costs|fee|fees|rate|rates|charge|charges)\b/i,
  /\b(precio|precios|costo|costos|tarifa|tarifas|cobro|cobros)\b/i,
  /\b(how much|cuanto cuesta|cuanto cobran|cuanto vale)\b/i,
  /\b(quote|quotation|estimate|cotizacion|presupuesto)\b/i,
  /\b(budget range|rango de presupuesto)\b/i,
  /\b(hourly|per hour|por hora|monthly|mensual)\b/i,
  /\$\d+/,
  /\d+\s*(usd|dollars|dolares|pesos)/i,
];

const COMPETITOR_PATTERNS = [
  /\b(accenture|mckinsey|deloitte|pwc|kpmg|ernst|ey|bain)\b/i,
  /\b(ibm|watson|google cloud ai|aws ai|azure ai|microsoft ai)\b/i,
  /\b(palantir|c3\.ai|datarobot|h2o\.ai|databricks)\b/i,
  /\b(openai|chatgpt|gemini|copilot|midjourney)\b/i,
  /\b(globant|endava|epam|wipro|infosys|tata|cognizant)\b/i,
  /\b(competitor|competencia|competidor|rival)\b/i,
];

const OFF_TOPIC_PATTERNS = [
  /\b(crypto|bitcoin|ethereum|nft|blockchain|web3)\b/i,
  /\b(stock|stocks|trading|forex|investment advice)\b/i,
  /\b(politic|religion|partido|iglesia)\b/i,
  /\b(personal advice|consejo personal)\b/i,
  /\b(joke|chiste|tell me something funny|dime algo gracioso)\b/i,
  /\b(write me a poem|escribeme un poema|story|historia|cuento)\b/i,
  /\b(hack|exploit|vulnerability|vulnerabilidad)\b/i,
];

const TECHNICAL_DETAIL_PATTERNS = [
  /\b(tech stack|stack tecnologico|framework|library|libreria)\b/i,
  /\b(python|javascript|typescript|java|golang|rust|react|angular|vue)\b/i,
  /\b(aws|azure|gcp|kubernetes|docker|terraform)\b/i,
  /\b(api endpoint|database schema|architecture diagram|diagrama de arquitectura)\b/i,
  /\b(source code|codigo fuente|github|repository|repositorio)\b/i,
];

const COMPETITOR_NAMES_OUTPUT = [
  'accenture', 'mckinsey', 'deloitte', 'pwc', 'kpmg', 'bain',
  'ibm watson', 'palantir', 'c3.ai', 'datarobot', 'h2o.ai',
  'globant', 'endava', 'epam', 'wipro', 'infosys', 'tata', 'cognizant',
];

const ROI_PROMISE_PATTERNS = [
  /\b\d+%\s*(roi|return|retorno|ahorro|savings|increase|incremento|reduccion|reduction)\b/i,
  /\b(guarantee|garantizo|garantizamos|promise|prometo|prometemos)\b/i,
  /\b(will save|ahorrara|will generate|generara|will increase|aumentara)\s+\$?\d+/i,
];

const PRICING_OUTPUT_PATTERNS = [
  /\$\s*\d{1,3}(,\d{3})*(\.\d{2})?/,
  /\d+\s*(usd|dollars|dolares|pesos|euros)\s*(per|por)/i,
  /\b(starts at|starting at|desde|a partir de)\s*\$?\d+/i,
  /\b(hourly rate|tarifa por hora|monthly fee|cuota mensual)\b/i,
];

type OffTopicCategory = 'pricing' | 'competitor' | 'off_topic' | 'technical';

function matchesPatterns(message: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(message));
}

function detectCategory(message: string): OffTopicCategory | null {
  if (matchesPatterns(message, PRICING_PATTERNS)) return 'pricing';
  if (matchesPatterns(message, COMPETITOR_PATTERNS)) return 'competitor';
  if (matchesPatterns(message, TECHNICAL_DETAIL_PATTERNS)) return 'technical';
  if (matchesPatterns(message, OFF_TOPIC_PATTERNS)) return 'off_topic';
  return null;
}

export function isOffTopic(message: string): boolean {
  return detectCategory(message) !== null;
}

export function getOffTopicCategory(message: string): OffTopicCategory | null {
  return detectCategory(message);
}

const REDIRECT_MESSAGES: Record<OffTopicCategory, Record<string, string>> = {
  pricing: {
    en: 'Great question! Pricing depends on the scope and complexity of each engagement. Rather than giving you a generic number, I would recommend we schedule a call with our team so they can provide a tailored proposal based on what we have discussed. Would that work for you?',
    es: 'Excelente pregunta. Los costos dependen del alcance y complejidad de cada proyecto. En lugar de darle un numero generico, le recomendaria agendar una llamada con nuestro equipo para que puedan elaborar una propuesta personalizada basada en lo que hemos conversado. Le parece bien?',
  },
  competitor: {
    en: 'I appreciate the question, but I prefer to focus on what makes AI Factory unique rather than commenting on other firms. Our strength lies in our methodology — Diagnose, Co-Design, Build, Operate — which ensures alignment between AI capabilities and your specific business outcomes. Would you like to explore how that applies to your situation?',
    es: 'Agradezco la pregunta, pero prefiero enfocarme en lo que hace unica a AI Factory en lugar de comentar sobre otras firmas. Nuestra fortaleza esta en nuestra metodologia — Diagnosticar, Co-Disenar, Construir, Operar — que asegura alineacion entre las capacidades de IA y sus resultados de negocio especificos. Le gustaria explorar como eso se aplica a su situacion?',
  },
  technical: {
    en: 'That is an excellent technical question. The specific technology decisions are made during our Co-Design phase, where we evaluate the best tools for each unique situation. I would rather focus on understanding your business needs first — the technical architecture follows from there. Shall we continue exploring your current challenges?',
    es: 'Esa es una excelente pregunta tecnica. Las decisiones de tecnologia especifica se toman durante nuestra fase de Co-Diseno, donde evaluamos las mejores herramientas para cada situacion unica. Preferiria enfocarme primero en entender sus necesidades de negocio — la arquitectura tecnica se deriva de ahi. Continuamos explorando sus desafios actuales?',
  },
  off_topic: {
    en: 'I appreciate your curiosity! However, my expertise is focused on AI strategy and business transformation. Let me bring us back — we were exploring some interesting opportunities for your organization. Shall we continue with that?',
    es: 'Aprecio su curiosidad! Sin embargo, mi experiencia se enfoca en estrategia de IA y transformacion de negocios. Permitame retomar el hilo — estabamos explorando algunas oportunidades interesantes para su organizacion. Continuamos con eso?',
  },
};

export function getRedirectMessage(topic: string, language: string): string {
  const lang = language.startsWith('es') ? 'es' : 'en';
  const category = detectCategory(topic);

  if (category && REDIRECT_MESSAGES[category]) {
    return REDIRECT_MESSAGES[category][lang] || REDIRECT_MESSAGES[category]['en'];
  }

  return REDIRECT_MESSAGES.off_topic[lang];
}

export function sanitizeOutput(response: string): string {
  let sanitized = response;

  for (const name of COMPETITOR_NAMES_OUTPUT) {
    const regex = new RegExp(`\\b${name}\\b`, 'gi');
    sanitized = sanitized.replace(regex, '[industry competitor]');
  }

  if (matchesPatterns(sanitized, ROI_PROMISE_PATTERNS)) {
    sanitized = sanitized.replace(
      /\b(\d+%)\s*(roi|return|retorno|ahorro|savings|increase|incremento|reduccion|reduction)\b/gi,
      'significant $2'
    );
    sanitized = sanitized.replace(
      /\b(guarantee|garantizo|garantizamos|promise|prometo|prometemos)\b/gi,
      'based on our experience, we anticipate'
    );
  }

  if (matchesPatterns(sanitized, PRICING_OUTPUT_PATTERNS)) {
    sanitized = sanitized.replace(
      /\$\s*\d{1,3}(,\d{3})*(\.\d{2})?/g,
      '[pricing discussed on call]'
    );
    sanitized = sanitized.replace(
      /\b(starts at|starting at|desde|a partir de)\s*\$?\d+[^\s.]*/gi,
      '[pricing discussed on call]'
    );
  }

  return sanitized;
}
