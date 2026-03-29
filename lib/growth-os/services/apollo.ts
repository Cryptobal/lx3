import { prisma } from "@/lib/db";

interface ApolloPersonResponse {
  person?: {
    first_name?: string;
    last_name?: string;
    title?: string;
    linkedin_url?: string;
    phone_numbers?: Array<{ sanitized_number?: string }>;
    organization?: {
      name?: string;
      primary_domain?: string;
    };
  };
}

interface ApolloOrganizationResponse {
  organization?: {
    name?: string;
    industry?: string;
    estimated_num_employees?: number;
    country?: string;
    city?: string;
    website_url?: string;
    linkedin_url?: string;
    short_description?: string;
    primary_domain?: string;
  };
}

function getApiKey(): string {
  const key = process.env.APOLLO_API_KEY;
  if (!key) {
    throw new Error(
      "APOLLO_API_KEY environment variable is not set. " +
        "Get your API key from https://app.apollo.io/ and add it to your .env file."
    );
  }
  return key;
}

function mapEmployeeCountToSize(count: number | undefined | null): string | null {
  if (count == null) return null;
  if (count <= 10) return "micro";
  if (count <= 50) return "small";
  if (count <= 250) return "medium";
  if (count <= 1000) return "large";
  return "enterprise";
}

export async function enrichContact(email: string) {
  if (!prisma) throw new Error("Database not available");

  const apiKey = getApiKey();

  const response = await fetch("https://api.apollo.io/api/v1/people/match", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      email,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Apollo People Enrichment API returned ${response.status}: ${response.statusText}`
    );
  }

  const data: ApolloPersonResponse = await response.json();
  const person = data.person;

  if (!person) {
    throw new Error(`No enrichment data found for email: ${email}`);
  }

  const contact = await prisma.contact.findUnique({ where: { email } });

  if (!contact) {
    throw new Error(`Contact with email ${email} not found in database`);
  }

  const enrichedContact = await prisma.contact.update({
    where: { id: contact.id },
    data: {
      firstName: person.first_name || contact.firstName,
      lastName: person.last_name || contact.lastName,
      position: person.title || contact.position,
      linkedinUrl: person.linkedin_url || contact.linkedinUrl,
      phone:
        person.phone_numbers?.[0]?.sanitized_number || contact.phone,
      enrichmentData: JSON.parse(JSON.stringify(data)),
      enrichedAt: new Date(),
    },
  });

  await prisma.activity.create({
    data: {
      type: "NOTE",
      title: `Contact enriched via Apollo`,
      description: `Enrichment data retrieved for ${email}`,
      contactId: contact.id,
      metadata: {
        source: "apollo",
        type: "people_enrichment",
        hasLinkedin: !!person.linkedin_url,
        hasPhone: !!person.phone_numbers?.length,
      },
    },
  });

  return enrichedContact;
}

export async function enrichCompany(domain: string) {
  if (!prisma) throw new Error("Database not available");

  const apiKey = getApiKey();

  const response = await fetch(
    "https://api.apollo.io/api/v1/organizations/enrich",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        domain,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Apollo Company Enrichment API returned ${response.status}: ${response.statusText}`
    );
  }

  const data: ApolloOrganizationResponse = await response.json();
  const org = data.organization;

  if (!org) {
    throw new Error(`No enrichment data found for domain: ${domain}`);
  }

  const existingCompany = await prisma.company.findUnique({
    where: { domain },
  });

  const companyData = {
    name: org.name || existingCompany?.name || domain,
    industry: org.industry || existingCompany?.industry,
    size: mapEmployeeCountToSize(org.estimated_num_employees) || existingCompany?.size,
    country: org.country || existingCompany?.country,
    city: org.city || existingCompany?.city,
    website: org.website_url || existingCompany?.website,
    linkedinUrl: org.linkedin_url || existingCompany?.linkedinUrl,
    description: org.short_description || existingCompany?.description,
    enrichmentData: JSON.parse(JSON.stringify(data)),
    enrichedAt: new Date(),
  };

  let company;
  if (existingCompany) {
    company = await prisma.company.update({
      where: { id: existingCompany.id },
      data: companyData,
    });
  } else {
    company = await prisma.company.create({
      data: {
        ...companyData,
        domain,
      },
    });
  }

  // Create activity for contacts linked to this company
  const contacts = await prisma.contact.findMany({
    where: { companyId: company.id },
    select: { id: true },
  });

  for (const contact of contacts) {
    await prisma.activity.create({
      data: {
        type: "NOTE",
        title: `Company enriched via Apollo`,
        description: `Enrichment data retrieved for ${domain}`,
        contactId: contact.id,
        metadata: {
          source: "apollo",
          type: "company_enrichment",
          companyId: company.id,
          domain,
        },
      },
    });
  }

  return company;
}
