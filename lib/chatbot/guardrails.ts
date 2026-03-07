const OFF_TOPIC_PATTERNS = [
  /\b(crypto|bitcoin|ethereum|nft|blockchain|web3)\b/i,
  /\b(stock|stocks|trading|forex|investment advice)\b/i,
  /\b(politic|religion|partido|iglesia)\b/i,
  /\b(personal advice|consejo personal)\b/i,
  /\b(joke|chiste|tell me something funny|dime algo gracioso)\b/i,
  /\b(write me a poem|escribeme un poema|story|historia|cuento)\b/i,
  /\b(hack|exploit|vulnerability|vulnerabilidad)\b/i,
  /\b(tarea|homework|ayudame con mi tarea|help me with my homework)\b/i,
];

const COMPETITOR_NAMES_OUTPUT = [
  'thoughtworks', 'globant', 'endava', 'epam', 'accenture', 'deloitte',
  'wipro', 'infosys', 'tata', 'cognizant', 'neoris', 'bairesdev',
  'toptal', 'upwork', 'fiverr',
];

const ROI_PROMISE_PATTERNS = [
  /\b\d+%\s*(roi|return|retorno|ahorro|savings|increase|incremento|reduccion|reduction)\b/i,
  /\b(guarantee|garantizo|garantizamos|promise|prometo|prometemos)\b/i,
  /\b(will save|ahorrara|will generate|generara|will increase|aumentara)\s+\$?\d+/i,
];

function matchesPatterns(message: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(message));
}

export function isOffTopic(message: string): boolean {
  return matchesPatterns(message, OFF_TOPIC_PATTERNS);
}

export function getRedirectMessage(language: string): string {
  if (language.startsWith('es')) {
    return 'Mi especialidad es ayudarte con soluciones de software e IA para tu empresa. En que te puedo ayudar con eso?';
  }
  return 'My specialty is helping with software and AI solutions for your business. How can I help you with that?';
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

  return sanitized;
}
