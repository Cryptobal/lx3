import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json({ error: "DB not available" }, { status: 500 });
  }

  try {
    const body = await request.json();
    const {
      visitorId,
      firstName,
      lastName,
      email,
      phone,
      company: companyName,
      position,
      message,
      source = "WEBSITE_FORM",
    } = body;

    // Create or find contact
    let contact = email
      ? await prisma.contact.findUnique({ where: { email } })
      : null;

    if (!contact) {
      contact = await prisma.contact.create({
        data: {
          firstName: firstName || "Sin nombre",
          lastName,
          email,
          phone,
          position,
          source: source as "WEBSITE_FORM" | "COTIZADOR" | "CHATBOT",
          notes: message,
        },
      });

      // Create activity
      await prisma.activity.create({
        data: {
          type: "CONTACT_CREATED",
          title: `Nuevo contacto desde ${source === "COTIZADOR" ? "cotizador" : source === "CHATBOT" ? "chatbot" : "formulario web"}`,
          contactId: contact.id,
          metadata: { source, message },
        },
      });
    }

    // Create form submission activity
    await prisma.activity.create({
      data: {
        type: "FORM_SUBMISSION",
        title: `Formulario recibido: ${firstName || ""} ${lastName || ""}`.trim(),
        description: message,
        contactId: contact.id,
        metadata: { source, companyName, visitorId },
      },
    });

    // Link company if provided
    if (companyName && !contact.companyId) {
      let company = await prisma.company.findFirst({
        where: { name: { equals: companyName, mode: "insensitive" } },
      });

      if (!company) {
        company = await prisma.company.create({
          data: { name: companyName },
        });
      }

      await prisma.contact.update({
        where: { id: contact.id },
        data: { companyId: company.id },
      });
    }

    // Link visitor sessions to contact
    if (visitorId) {
      await prisma.visitorSession.updateMany({
        where: { visitorId, contactId: null },
        data: { contactId: contact.id },
      });
    }

    // If source is COTIZADOR, create a deal
    if (source === "COTIZADOR") {
      const defaultStage = await prisma.pipelineStage.findFirst({
        where: { isDefault: true },
      });

      if (defaultStage) {
        await prisma.deal.create({
          data: {
            title: `Cotización - ${firstName || ""} ${lastName || ""}`.trim(),
            stageId: defaultStage.id,
            contactId: contact.id,
            companyId: contact.companyId,
          },
        });
      }
    }

    return NextResponse.json({ ok: true, contactId: contact.id });
  } catch (error) {
    console.error("Form submission webhook error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
