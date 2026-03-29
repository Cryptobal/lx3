const APOLLO_API_BASE = "https://api.apollo.io/v1";

/**
 * Check whether Apollo.io integration is configured.
 */
export function isConfigured(): boolean {
  return Boolean(process.env.APOLLO_API_KEY);
}

// ---------------------------------------------------------------------------
// People enrichment
// ---------------------------------------------------------------------------

interface EnrichedContact {
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  title: string | null;
  email: string | null;
  phone: string | null;
  linkedinUrl: string | null;
  city: string | null;
  country: string | null;
  companyName: string | null;
  companyDomain: string | null;
}

export async function enrichContact(email: string): Promise<EnrichedContact | null> {
  if (!isConfigured()) {
    console.warn("[Apollo] APOLLO_API_KEY not configured");
    return null;
  }

  try {
    const res = await fetch(`${APOLLO_API_BASE}/people/match`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": process.env.APOLLO_API_KEY!,
      },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      console.error("[Apollo] enrichContact failed:", res.status, await res.text());
      return null;
    }

    const data = await res.json();
    const person = data.person;

    if (!person) return null;

    return {
      firstName: person.first_name ?? null,
      lastName: person.last_name ?? null,
      fullName: person.name ?? null,
      title: person.title ?? null,
      email: person.email ?? null,
      phone: person.phone_number ?? person.sanitized_phone ?? null,
      linkedinUrl: person.linkedin_url ?? null,
      city: person.city ?? null,
      country: person.country ?? null,
      companyName: person.organization?.name ?? null,
      companyDomain: person.organization?.primary_domain ?? null,
    };
  } catch (error) {
    console.error("[Apollo] enrichContact error:", error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Company enrichment
// ---------------------------------------------------------------------------

interface EnrichedCompany {
  name: string | null;
  domain: string | null;
  industry: string | null;
  size: string | null;
  employeeCount: number | null;
  linkedinUrl: string | null;
  city: string | null;
  country: string | null;
  description: string | null;
  foundedYear: number | null;
  annualRevenue: string | null;
  technologies: string[];
}

export async function enrichCompany(domain: string): Promise<EnrichedCompany | null> {
  if (!isConfigured()) {
    console.warn("[Apollo] APOLLO_API_KEY not configured");
    return null;
  }

  try {
    const res = await fetch(`${APOLLO_API_BASE}/organizations/enrich`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": process.env.APOLLO_API_KEY!,
      },
      body: JSON.stringify({ domain }),
    });

    if (!res.ok) {
      console.error("[Apollo] enrichCompany failed:", res.status, await res.text());
      return null;
    }

    const data = await res.json();
    const org = data.organization;

    if (!org) return null;

    return {
      name: org.name ?? null,
      domain: org.primary_domain ?? org.website_url ?? null,
      industry: org.industry ?? null,
      size: org.estimated_num_employees
        ? categorizeSize(org.estimated_num_employees)
        : null,
      employeeCount: org.estimated_num_employees ?? null,
      linkedinUrl: org.linkedin_url ?? null,
      city: org.city ?? null,
      country: org.country ?? null,
      description: org.short_description ?? null,
      foundedYear: org.founded_year ?? null,
      annualRevenue: org.annual_revenue_printed ?? null,
      technologies: Array.isArray(org.current_technologies)
        ? org.current_technologies.map((t: { name?: string }) => t.name).filter(Boolean)
        : [],
    };
  } catch (error) {
    console.error("[Apollo] enrichCompany error:", error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function categorizeSize(employees: number): string {
  if (employees <= 10) return "1-10";
  if (employees <= 50) return "11-50";
  if (employees <= 200) return "51-200";
  if (employees <= 500) return "201-500";
  if (employees <= 1000) return "501-1000";
  return "1000+";
}
