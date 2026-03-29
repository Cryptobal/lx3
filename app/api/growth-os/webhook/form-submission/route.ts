import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { linkVisitorSessions } from "@/lib/growth-os/services/tracking-service";
import { sendNewLeadNotification } from "@/lib/growth-os/services/email-service";

interface FormSubmissionPayload {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  service?: string;
  visitorId?: string;
  source?: string;
}

export async function POST(req: NextRequest) {
  if (!prisma) {
    return NextResponse.json(
      { error: "Database not available" },
      { status: 503 }
    );
  }

  try {
    const body: FormSubmissionPayload = await req.json();

    if (!body.name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    // Parse name into first/last
    const nameParts = body.name.trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : null;

    // Determine contact source
    const contactSource =
      body.source === "cotizador" ? "COTIZADOR" : "WEBSITE_FORM";

    // Find or create contact
    let contact;
    if (body.email) {
      contact = await prisma.contact.findFirst({
        where: { email: body.email },
      });
    }

    if (!contact) {
      contact = await prisma.contact.create({
        data: {
          firstName,
          lastName,
          email: body.email ?? undefined,
          phone: body.phone ?? undefined,
          source: contactSource,
          tags: body.service ? [body.service] : [],
        },
      });
    }

    // Link visitor sessions if visitorId provided
    if (body.visitorId) {
      await linkVisitorSessions(body.visitorId, contact.id);
    }

    // Create or find company if provided
    if (body.company) {
      let company = await prisma.company.findFirst({
        where: { name: { equals: body.company, mode: "insensitive" } },
      });

      if (!company) {
        company = await prisma.company.create({
          data: { name: body.company },
        });
      }

      if (!contact.companyId) {
        await prisma.contact.update({
          where: { id: contact.id },
          data: { companyId: company.id },
        });
      }
    }

    // Create activity
    await prisma.activity.create({
      data: {
        type: "FORM_SUBMISSION",
        title: `Formulario recibido: ${body.name}${body.service ? ` (${body.service})` : ""}`,
        contactId: contact.id,
        metadata: {
          source: body.source ?? "website",
          service: body.service ?? null,
          visitorId: body.visitorId ?? null,
        },
      },
    });

    // If source is "cotizador", create a Deal in default stage
    if (body.source === "cotizador") {
      const defaultStage = await prisma.pipelineStage.findFirst({
        where: { isDefault: true },
      });

      if (defaultStage) {
        const deal = await prisma.deal.create({
          data: {
            title: `Cotizacion: ${body.name}${body.service ? ` - ${body.service}` : ""}`,
            stageId: defaultStage.id,
            contactId: contact.id,
            companyId: contact.companyId ?? undefined,
          },
        });

        await prisma.activity.create({
          data: {
            type: "DEAL_STAGE_CHANGED",
            title: `Deal creado desde cotizador: ${deal.title}`,
            dealId: deal.id,
            contactId: contact.id,
          },
        });
      }
    }

    // Send new lead notification email (fire and forget)
    sendNewLeadNotification({
      contactName: body.name,
      email: body.email,
      source: contactSource,
    }).catch((err) =>
      console.error("[FormSubmission] Notification error:", err)
    );

    return NextResponse.json({
      ok: true,
      contactId: contact.id,
    });
  } catch (error) {
    console.error("[FormSubmission] Error:", error);
    return NextResponse.json(
      { error: "Failed to process form submission" },
      { status: 500 }
    );
  }
}
