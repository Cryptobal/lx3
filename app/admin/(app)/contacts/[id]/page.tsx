// @ts-nocheck
import { notFound } from "next/navigation";
import { getContact } from "@/lib/growth-os/actions/contacts";
import { ContactDetail } from "@/components/growth-os/contacts/ContactDetail";

interface ContactDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ContactDetailPage({ params }: ContactDetailPageProps) {
  const { id } = await params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let contact: any;

  try {
    const result = await getContact(id);
    if (!result.success) notFound();
    contact = result.data;
  } catch {
    notFound();
  }

  const serialized = {
    id: contact.id,
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.email,
    phone: contact.phone,
    position: contact.position,
    linkedinUrl: contact.linkedinUrl,
    avatarUrl: contact.avatarUrl,
    source: contact.source,
    tags: contact.tags,
    notes: contact.notes,
    createdAt: contact.createdAt.toISOString(),
    enrichedAt: contact.enrichedAt?.toISOString() ?? null,
    enrichmentData: contact.enrichmentData,
    company: contact.company
      ? { id: contact.company.id, name: contact.company.name }
      : null,
    deals: contact.deals.map((d: any) => ({
      id: d.id,
      title: d.title,
      value: d.value?.toNumber() ?? null,
      currency: d.currency,
      stage: { name: d.stage.name, color: d.stage.color },
      createdAt: d.createdAt.toISOString(),
    })),
    activities: contact.activities.map((a: any) => ({
      id: a.id,
      type: a.type,
      title: a.title,
      description: a.description,
      createdAt: a.createdAt.toISOString(),
    })),
    quotes: contact.quotes.map((q: any) => ({
      id: q.id,
      quoteNumber: q.quoteNumber,
      title: q.title,
      total: q.total.toNumber(),
      currency: q.currency,
      status: q.status,
      createdAt: q.createdAt.toISOString(),
    })),
  };

  return <ContactDetail contact={serialized} />;
}