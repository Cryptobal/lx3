// @ts-nocheck
import { notFound } from "next/navigation";
import { getQuote } from "@/lib/growth-os/actions/quotes";
import { getContacts } from "@/lib/growth-os/actions/contacts";
import { getDeals } from "@/lib/growth-os/actions/deals";
import { QuoteEditor } from "@/components/growth-os/quotes/QuoteEditor";

export default async function EditQuotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const result = await getQuote(id);
  if (!result.success) notFound();

  const quote = result.data as any;

  let contacts: any[] = [];
  let deals: { id: string; title: string }[] = [];

  try {
    const contactResult = await getContacts({ pageSize: 500 });
    contacts = contactResult.data.map((c: any) => ({
      id: c.id,
      firstName: c.firstName,
      lastName: c.lastName ?? "",
      email: c.email ?? "",
    }));
  } catch {
    // Contacts will remain empty
  }

  try {
    const dealResult = await getDeals();
    deals = dealResult.map((d: any) => ({ id: d.id, title: d.title }));
  } catch {
    // Deals will remain empty
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Editar cotizacion
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {quote.quoteNumber} — {quote.title}
        </p>
      </div>

      <QuoteEditor
        contacts={contacts}
        deals={deals}
        initialData={{
          id: quote.id,
          title: quote.title,
          description: quote.description ?? "",
          contactId: quote.contactId ?? "",
          dealId: quote.dealId ?? "",
          items: (quote.items ?? []).map((item: any) => ({
            id: item.id,
            description: item.description,
            details: item.details ?? "",
            quantity: Number(item.quantity),
            unitPrice: Number(item.unitPrice),
            total: Number(item.total),
          })),
          taxRate: quote.taxRate ? Number(quote.taxRate) : 19,
          validUntil: quote.validUntil
            ? new Date(quote.validUntil).toISOString().split("T")[0]
            : "",
          notes: quote.notes ?? "",
          terms: quote.terms ?? "",
          currency: quote.currency ?? "CLP",
        }}
      />
    </div>
  );
}
