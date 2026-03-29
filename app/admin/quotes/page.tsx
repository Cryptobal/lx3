import Link from "next/link";
import { Plus } from "lucide-react";
import { getQuotes } from "@/lib/growth-os/actions/quotes";
import { PageHeader } from "@/components/growth-os/shared/PageHeader";
import { Badge } from "@/components/growth-os/shared/Badge";
import { MoneyDisplay } from "@/components/growth-os/shared/MoneyDisplay";
import { RelativeTime } from "@/components/growth-os/shared/RelativeTime";
import {
  formatMoney,
  getStatusLabel,
} from "@/lib/growth-os/utils/format";

const statusColor: Record<string, "gray" | "blue" | "yellow" | "green" | "red"> = {
  DRAFT: "gray",
  SENT: "blue",
  VIEWED: "yellow",
  ACCEPTED: "green",
  REJECTED: "red",
  EXPIRED: "gray",
};

export const metadata = { title: "Cotizaciones | Growth OS" };

export default async function QuotesPage() {
  const { data: quotes, total } = await getQuotes();

  return (
    <div>
      <PageHeader
        title="Cotizaciones"
        description={`${total} cotizaciones en total`}
        actions={
          <Link
            href="/admin/quotes/new"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Nueva cotizacion
          </Link>
        }
      />

      {quotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white py-16">
          <p className="text-sm text-gray-500">No hay cotizaciones todavia</p>
          <Link
            href="/admin/quotes/new"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Crear primera cotizacion
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Numero
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Titulo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Cliente
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Monto Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                    Vistas
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {quotes.map((quote: Record<string, unknown>) => {
                  const contact = quote.contact as Record<string, unknown> | null;
                  const status = (quote.status as string) ?? "DRAFT";
                  return (
                    <tr key={quote.id as string} className="transition-colors hover:bg-gray-50">
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <Link
                          href={`/admin/quotes/${quote.id}`}
                          className="font-medium text-blue-600 hover:text-blue-800"
                        >
                          {quote.quoteNumber as string}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {(quote.title as string) || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {contact
                          ? `${contact.firstName ?? ""} ${contact.lastName ?? ""}`.trim()
                          : "-"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-gray-900">
                        {formatMoney(
                          quote.total as number,
                          (quote.currency as string) ?? "CLP"
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Badge
                          label={getStatusLabel(status)}
                          color={statusColor[status] ?? "gray"}
                        />
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-500">
                        {(quote.viewCount as number) ?? 0}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <RelativeTime date={quote.createdAt as string} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
