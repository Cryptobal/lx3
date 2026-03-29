import { getContacts } from "@/lib/growth-os/actions/contacts";
import { getDeals } from "@/lib/growth-os/actions/deals";
import { QuoteEditor } from "@/components/growth-os/quotes/QuoteEditor";

export default async function NewQuotePage() {
  let contacts: { id: string; name: string }[] = [];
  let deals: { id: string; title: string }[] = [];

  try {
    const result = await getContacts({ pageSize: 500 });
    contacts = result.data.map((c) => ({
      id: c.id,
      name: `${c.firstName} ${c.lastName || ""}`.trim(),
    }));
  } catch {
    // Contacts will remain empty
  }

  try {
    const result = await getDeals();
    deals = result.map((d) => ({ id: d.id, title: d.title }));
  } catch {
    // Deals will remain empty
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Nueva cotización
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Crea una nueva cotización para enviar a un cliente
        </p>
      </div>

      <QuoteEditor contacts={contacts} deals={deals} />
    </div>
  );
}
