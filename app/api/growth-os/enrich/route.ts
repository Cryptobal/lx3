import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

const APOLLO_API_URL = "https://api.apollo.io/api/v1";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!prisma) {
    return NextResponse.json({ error: "DB not available" }, { status: 500 });
  }

  const apiKey = process.env.APOLLO_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Apollo API key not configured" },
      { status: 400 }
    );
  }

  try {
    const { type, contactId, companyId } = await request.json();

    if (type === "contact" && contactId) {
      const contact = await prisma.contact.findUnique({ where: { id: contactId } });
      if (!contact?.email) {
        return NextResponse.json({ error: "Contact has no email" }, { status: 400 });
      }

      const res = await fetch(`${APOLLO_API_URL}/people/match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: apiKey, email: contact.email }),
      });

      const data = await res.json();
      const person = data.person;

      if (person) {
        await prisma.contact.update({
          where: { id: contactId },
          data: {
            firstName: person.first_name || contact.firstName,
            lastName: person.last_name || contact.lastName,
            position: person.title || contact.position,
            linkedinUrl: person.linkedin_url || contact.linkedinUrl,
            phone: person.phone_numbers?.[0]?.sanitized_number || contact.phone,
            avatarUrl: person.photo_url || contact.avatarUrl,
            enrichedAt: new Date(),
            enrichmentData: data,
          },
        });

        await prisma.activity.create({
          data: {
            type: "NOTE",
            title: "Contacto enriquecido con Apollo",
            contactId,
            userId: session.user.id,
            metadata: { source: "apollo", enrichedFields: Object.keys(person) },
          },
        });
      }

      return NextResponse.json({ ok: true, enriched: !!person });
    }

    if (type === "company" && companyId) {
      const company = await prisma.company.findUnique({ where: { id: companyId } });
      if (!company?.domain) {
        return NextResponse.json({ error: "Company has no domain" }, { status: 400 });
      }

      const res = await fetch(`${APOLLO_API_URL}/organizations/enrich`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: apiKey, domain: company.domain }),
      });

      const data = await res.json();
      const org = data.organization;

      if (org) {
        const employeeCount = org.estimated_num_employees || 0;
        let size = null;
        if (employeeCount <= 10) size = "1-10";
        else if (employeeCount <= 50) size = "11-50";
        else if (employeeCount <= 200) size = "51-200";
        else if (employeeCount <= 500) size = "201-500";
        else size = "500+";

        await prisma.company.update({
          where: { id: companyId },
          data: {
            industry: org.industry || company.industry,
            size: size || company.size,
            country: org.country || company.country,
            city: org.city || company.city,
            website: org.website_url || company.website,
            linkedinUrl: org.linkedin_url || company.linkedinUrl,
            logoUrl: org.logo_url || company.logoUrl,
            description: org.short_description || company.description,
            enrichedAt: new Date(),
            enrichmentData: data,
          },
        });
      }

      return NextResponse.json({ ok: true, enriched: !!org });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error) {
    console.error("Enrichment error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
