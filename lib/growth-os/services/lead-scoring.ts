const FREE_EMAIL_DOMAINS = [
  "gmail.com",
  "hotmail.com",
  "yahoo.com",
  "outlook.com",
  "live.com",
  "hotmail.cl",
  "yahoo.es",
  "outlook.es",
  "icloud.com",
  "protonmail.com",
  "mail.com",
];

interface LeadScoreParams {
  email?: string | null;
  pageViews?: { path: string }[];
  totalVisits?: number;
  hasFilledForm?: boolean;
  enriched?: boolean;
  companySize?: string | null;
  country?: string | null;
  daysSinceLastVisit?: number;
}

interface LeadScoreResult {
  score: number;
  breakdown: { label: string; points: number }[];
}

export function calculateLeadScore(params: LeadScoreParams): LeadScoreResult {
  const breakdown: { label: string; points: number }[] = [];

  // +10 corporate email
  if (params.email) {
    const domain = params.email.split("@")[1]?.toLowerCase();
    if (domain && !FREE_EMAIL_DOMAINS.includes(domain)) {
      breakdown.push({ label: "Email corporativo", points: 10 });
    }
  }

  // +15 visited /servicios
  if (params.pageViews?.some((pv) => pv.path.startsWith("/servicios"))) {
    breakdown.push({ label: "Visito /servicios", points: 15 });
  }

  // +20 visited /contacto or /cotizador
  if (
    params.pageViews?.some(
      (pv) => pv.path.startsWith("/contacto") || pv.path.startsWith("/cotizador"),
    )
  ) {
    breakdown.push({ label: "Visito /contacto o /cotizador", points: 20 });
  }

  // +10 per additional visit (max +20)
  if (params.totalVisits && params.totalVisits > 1) {
    const additionalVisits = params.totalVisits - 1;
    const visitPoints = Math.min(additionalVisits * 10, 20);
    breakdown.push({
      label: `${additionalVisits} visita(s) adicional(es)`,
      points: visitPoints,
    });
  }

  // +25 filled a form
  if (params.hasFilledForm) {
    breakdown.push({ label: "Lleno un formulario", points: 25 });
  }

  // +15 enriched + company size 11-500 + country Chile
  if (params.enriched && params.country && params.companySize) {
    const isChile = params.country.toLowerCase() === "chile" || params.country === "CL";
    const sizeRanges = ["11-50", "51-200", "201-500"];
    const isMidSize = sizeRanges.includes(params.companySize);
    if (isChile && isMidSize) {
      breakdown.push({
        label: "Empresa chilena mediana (enriquecido)",
        points: 15,
      });
    }
  }

  // +5 per page view (max +20)
  if (params.pageViews && params.pageViews.length > 0) {
    const pvPoints = Math.min(params.pageViews.length * 5, 20);
    breakdown.push({ label: `${params.pageViews.length} pagina(s) vista(s)`, points: pvPoints });
  }

  // -10 if no visit in 30 days
  if (params.daysSinceLastVisit !== undefined && params.daysSinceLastVisit > 30) {
    breakdown.push({ label: "Sin visita en 30+ dias", points: -10 });
  }

  const rawScore = breakdown.reduce((sum, item) => sum + item.points, 0);
  const score = Math.max(0, Math.min(100, rawScore));

  return { score, breakdown };
}
