import { prisma } from "@/lib/db";

const FREE_EMAIL_DOMAINS = [
  "gmail.com",
  "hotmail.com",
  "yahoo.com",
  "outlook.com",
  "live.com",
  "hotmail.cl",
  "yahoo.cl",
  "icloud.com",
  "protonmail.com",
  "mail.com",
];

const SERVICE_PATHS = ["/servicios", "/services"];
const PRICING_PATHS = ["/cotiza", "/quote", "/cotizador"];

export async function calculateLeadScore(contactId: string): Promise<number> {
  if (!prisma) throw new Error("Database not available");

  const contact = await prisma.contact.findUnique({
    where: { id: contactId },
    include: {
      company: true,
      activities: true,
      visitorSessions: {
        include: { pageViews: true },
      },
    },
  });

  if (!contact) {
    throw new Error(`Contact with id ${contactId} not found`);
  }

  let score = 0;

  // +10 if corporate email (not a free email provider)
  if (contact.email) {
    const domain = contact.email.split("@")[1]?.toLowerCase();
    if (domain && !FREE_EMAIL_DOMAINS.includes(domain)) {
      score += 10;
    }
  }

  // Collect all page views across sessions
  const allPageViews = contact.visitorSessions.flatMap((s) => s.pageViews);

  // +15 if visited services page
  const visitedServices = allPageViews.some((pv) =>
    SERVICE_PATHS.some((sp) => pv.path.toLowerCase().startsWith(sp))
  );
  if (visitedServices) {
    score += 15;
  }

  // +20 if visited pricing/quote page
  const visitedPricing = allPageViews.some((pv) =>
    PRICING_PATHS.some((pp) => pv.path.toLowerCase().startsWith(pp))
  );
  if (visitedPricing) {
    score += 20;
  }

  // +10 per additional site visit (session), max +30
  const sessionCount = contact.visitorSessions.length;
  if (sessionCount > 1) {
    score += Math.min((sessionCount - 1) * 10, 30);
  }

  // +25 if submitted contact form
  const hasFormSubmission =
    contact.source === "WEBSITE_FORM" ||
    contact.source === "COTIZADOR" ||
    contact.activities.some((a) => a.type === "FORM_SUBMISSION");
  if (hasFormSubmission) {
    score += 25;
  }

  // +15 if enriched and matches ICP (Chilean company, medium size)
  if (contact.enrichedAt && contact.company) {
    const isChilean =
      contact.company.country?.toLowerCase() === "chile" ||
      contact.company.country?.toLowerCase() === "cl";
    const isMedium = contact.company.size === "medium";
    if (isChilean && isMedium) {
      score += 15;
    }
  }

  // +5 per page viewed, max +20
  const pageViewBonus = Math.min(allPageViews.length * 5, 20);
  score += pageViewBonus;

  // -10 if no activity in last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const lastSession = contact.visitorSessions
    .map((s) => s.lastActivityAt)
    .sort((a, b) => b.getTime() - a.getTime())[0];
  const lastActivity = contact.activities
    .map((a) => a.createdAt)
    .sort((a, b) => b.getTime() - a.getTime())[0];

  const mostRecentActivity = [lastSession, lastActivity]
    .filter((d): d is Date => d != null)
    .sort((a, b) => b.getTime() - a.getTime())[0];

  if (!mostRecentActivity || mostRecentActivity < thirtyDaysAgo) {
    score -= 10;
  }

  // Cap at 0-100
  return Math.max(0, Math.min(100, score));
}

export function getScoreLabel(score: number): {
  label: "Caliente" | "Tibio" | "Frio";
  color: "red" | "yellow" | "blue";
} {
  if (score >= 60) return { label: "Caliente", color: "red" };
  if (score >= 30) return { label: "Tibio", color: "yellow" };
  return { label: "Frio", color: "blue" };
}
