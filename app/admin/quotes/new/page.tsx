import { getContacts } from "@/lib/growth-os/actions/contacts";
import { getDeals } from "@/lib/growth-os/actions/deals";
import { PageHeader } from "@/components/growth-os/shared/PageHeader";
import { QuoteEditor } from "@/components/growth-os/quotes/QuoteEditor";

export const metadata = { title: "Nueva cotizacion | Growth OS" };

export default async function NewQuotePage() {
  const [contactsResult, dealsResult] = await Promise.all([
    getContacts({ pageSize: 200 }),
    getDeals(),
  ]);

  const contacts = (contactsResult.data ?? []).map(
    (c: Record<string, unknown>) => ({
      id: c.id as string,
      firstName: (c.firstName as string) ?? "",
      lastName: (c.lastName as string) ?? "",
      email: (c.email as string) ?? "",
    })
  );

  // Flatten deals from pipeline stages
  const deals: { id: string; title: string }[] = [];
  const stagesData = dealsResult.data;
  if (Array.isArray(stagesData)) {
    for (const stage of stagesData) {
      const s = stage as Record<string, unknown>;
      const stageDeals = s.deals as Record<string, unknown>[] | undefined;
      if (Array.isArray(stageDeals)) {
        for (const d of stageDeals) {
          deals.push({ id: d.id as string, title: d.title as string });
        }
      }
    }
  }

  return (
    <div>
      <PageHeader title="Nueva cotizacion" description="Crea una nueva cotizacion para un cliente" />
      <QuoteEditor contacts={contacts} deals={deals} />
    </div>
  );
}
