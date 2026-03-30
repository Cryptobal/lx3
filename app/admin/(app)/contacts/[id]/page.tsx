// @ts-nocheck
import { notFound } from "next/navigation";
import { getContact } from "@/lib/growth-os/actions/contacts";
import { getContactEmails } from "@/lib/growth-os/actions/emails";
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

  // Fetch email history for this contact
  let emailItems: any[] = [];
  try {
    const { sent, gmail } = await getContactEmails(id);

    const sentMapped = sent.map((e: any) => ({
      id: e.id,
      type: "sent" as const,
      subject: e.subject,
      from: "growth@lx3.ai",
      to: e.to,
      direction: "OUTBOUND",
      snippet: null,
      date: e.sentAt || e.createdAt,
    }));

    const gmailMapped = gmail.map((e: any) => ({
      id: e.id,
      type: "gmail" as const,
      subject: e.subject,
      from: e.from,
      to: e.to?.[0],
      direction: e.direction,
      snippet: e.snippet,
      date: e.receivedAt,
    }));

    emailItems = [...sentMapped, ...gmailMapped].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch {
    // Emails will remain empty
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
    emails: emailItems,
  };

  return <ContactDetail contact={serialized} />;
}
