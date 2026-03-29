import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  enrichContact,
  enrichCompany,
} from "@/lib/growth-os/services/apollo";

export async function POST(req: NextRequest) {
  if (!prisma) {
    return NextResponse.json(
      { error: "Database not available" },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const { contactId, companyId } = body as {
      contactId?: string;
      companyId?: string;
    };

    if (!contactId && !companyId) {
      return NextResponse.json(
        { error: "contactId or companyId is required" },
        { status: 400 }
      );
    }

    // ---- Contact enrichment ----
    if (contactId) {
      const contact = await prisma.contact.findUnique({
        where: { id: contactId },
      });

      if (!contact) {
        return NextResponse.json(
          { error: "Contact not found" },
          { status: 404 }
        );
      }

      if (!contact.email) {
        return NextResponse.json(
          { error: "Contact has no email for enrichment" },
          { status: 400 }
        );
      }

      const enriched = await enrichContact(contact.email);

      if (!enriched) {
        return NextResponse.json(
          { error: "No enrichment data found" },
          { status: 404 }
        );
      }

      const updatedContact = await prisma.contact.update({
        where: { id: contactId },
        data: {
          ...(enriched.firstName && !contact.firstName
            ? { firstName: enriched.firstName }
            : {}),
          ...(enriched.lastName && !contact.lastName
            ? { lastName: enriched.lastName }
            : {}),
          ...(enriched.title && !contact.position
            ? { position: enriched.title }
            : {}),
          ...(enriched.phone && !contact.phone
            ? { phone: enriched.phone }
            : {}),
          ...(enriched.linkedinUrl && !contact.linkedinUrl
            ? { linkedinUrl: enriched.linkedinUrl }
            : {}),
        },
      });

      // Create or link company if enrichment returned company data
      if (enriched.companyDomain && !contact.companyId) {
        let company = await prisma.company.findFirst({
          where: { domain: enriched.companyDomain },
        });

        if (!company && enriched.companyName) {
          company = await prisma.company.create({
            data: {
              name: enriched.companyName,
              domain: enriched.companyDomain,
            },
          });
        }

        if (company) {
          await prisma.contact.update({
            where: { id: contactId },
            data: { companyId: company.id },
          });
        }
      }

      return NextResponse.json({
        ok: true,
        type: "contact",
        data: JSON.parse(JSON.stringify(updatedContact)),
        enriched,
      });
    }

    // ---- Company enrichment ----
    if (companyId) {
      const company = await prisma.company.findUnique({
        where: { id: companyId },
      });

      if (!company) {
        return NextResponse.json(
          { error: "Company not found" },
          { status: 404 }
        );
      }

      if (!company.domain) {
        return NextResponse.json(
          { error: "Company has no domain for enrichment" },
          { status: 400 }
        );
      }

      const enriched = await enrichCompany(company.domain);

      if (!enriched) {
        return NextResponse.json(
          { error: "No enrichment data found" },
          { status: 404 }
        );
      }

      const updatedCompany = await prisma.company.update({
        where: { id: companyId },
        data: {
          ...(enriched.industry && !company.industry
            ? { industry: enriched.industry }
            : {}),
          ...(enriched.size && !company.size ? { size: enriched.size } : {}),
          ...(enriched.linkedinUrl && !company.linkedinUrl
            ? { linkedinUrl: enriched.linkedinUrl }
            : {}),
          ...(enriched.country && !company.country
            ? { country: enriched.country }
            : {}),
          ...(enriched.city && !company.city ? { city: enriched.city } : {}),
          ...(enriched.description && !company.description
            ? { description: enriched.description }
            : {}),
        },
      });

      return NextResponse.json({
        ok: true,
        type: "company",
        data: JSON.parse(JSON.stringify(updatedCompany)),
        enriched,
      });
    }

    return NextResponse.json({ error: "Unexpected" }, { status: 400 });
  } catch (error) {
    console.error("[Enrich] Error:", error);
    return NextResponse.json(
      { error: "Failed to enrich" },
      { status: 500 }
    );
  }
}
