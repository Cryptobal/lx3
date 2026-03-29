import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Send,
  ExternalLink,
  Eye,
  Clock,
  Monitor,
  Globe,
} from "lucide-react";
import { getQuote } from "@/lib/growth-os/actions/quotes";
import { Badge } from "@/components/growth-os/shared/Badge";
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

export const metadata = { title: "Detalle cotizacion | Growth OS" };

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getQuote(id);

  if (!result.success) notFound();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const quote = result.data as any;
  const contact = quote.contact as any | null;
  const deal = quote.deal as any | null;
  const items = (quote.items ?? []) as any[];
  const viewLogs = (quote.viewLogs ?? []) as any[];
  const status = String(quote.status ?? "DRAFT");
  const currency = String(quote.currency ?? "CLP");
  const fmt = (n: number) => formatMoney(n, currency);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/quotes"
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {quote.quoteNumber as string}
              </h1>
              <Badge
                label={getStatusLabel(status)}
                color={statusColor[status] ?? "gray"}
                size="md"
              />
            </div>
            <p className="mt-0.5 text-sm text-gray-500">
              {quote.title as string}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {status === "DRAFT" && (
            <Link
              href={`/admin/quotes/${id}/edit`}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Edit className="h-4 w-4" />
              Editar
            </Link>
          )}
          {quote.trackingToken && (
            <Link
              href={`/q/${quote.trackingToken as string}`}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <ExternalLink className="h-4 w-4" />
              Ver como cliente
            </Link>
          )}
          {status === "DRAFT" && (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              <Send className="h-4 w-4" />
              Enviar
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Client info */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
              Cliente
            </h2>
            {contact ? (
              <div className="space-y-1 text-sm">
                <p className="font-medium text-gray-900">
                  {contact.firstName as string} {contact.lastName as string}
                </p>
                {contact.email && (
                  <p className="text-gray-600">{contact.email as string}</p>
                )}
                {(contact.company as Record<string, unknown> | null)?.name && (
                  <p className="text-gray-600">
                    {(contact.company as Record<string, unknown>).name as string}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-400">Sin contacto asignado</p>
            )}
            {deal && (
              <div className="mt-4 border-t border-gray-100 pt-3">
                <p className="text-xs font-medium uppercase text-gray-400">
                  Deal asociado
                </p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {deal.title as string}
                </p>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
              Items
            </h2>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-2 text-left text-xs font-medium uppercase text-gray-500">
                    Descripcion
                  </th>
                  <th className="pb-2 text-right text-xs font-medium uppercase text-gray-500">
                    Cant.
                  </th>
                  <th className="pb-2 text-right text-xs font-medium uppercase text-gray-500">
                    Precio Unit.
                  </th>
                  <th className="pb-2 text-right text-xs font-medium uppercase text-gray-500">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3 pr-4">
                      <p className="text-sm font-medium text-gray-900">
                        {item.description as string}
                      </p>
                      {item.details && (
                        <p className="mt-0.5 text-xs text-gray-500">
                          {item.details as string}
                        </p>
                      )}
                    </td>
                    <td className="py-3 text-right text-sm text-gray-700 tabular-nums">
                      {item.quantity as number}
                    </td>
                    <td className="py-3 text-right text-sm text-gray-700 tabular-nums">
                      {fmt(item.unitPrice as number)}
                    </td>
                    <td className="py-3 text-right text-sm font-medium text-gray-900 tabular-nums">
                      {fmt(item.total as number)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="mt-4 flex justify-end border-t border-gray-200 pt-4">
              <div className="w-64 space-y-1.5">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{fmt(quote.subtotal as number)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>IVA ({quote.taxRate as number ?? 19}%)</span>
                  <span className="tabular-nums">{fmt(quote.taxAmount as number)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-1.5 text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span className="tabular-nums">{fmt(quote.total as number)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes & Terms */}
          {(quote.notes || quote.terms) && (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              {quote.notes && (
                <div className="mb-4">
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
                    Notas
                  </h3>
                  <p className="whitespace-pre-line text-sm text-gray-700">
                    {quote.notes as string}
                  </p>
                </div>
              )}
              {quote.terms && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
                    Terminos y condiciones
                  </h3>
                  <p className="whitespace-pre-line text-sm text-gray-700">
                    {quote.terms as string}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Amount card */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">Monto total</p>
            <p className="mt-1 text-3xl font-bold text-gray-900 tabular-nums">
              {fmt(quote.total as number)}
            </p>
            <p className="mt-1 text-xs text-gray-400">{currency}</p>
          </div>

          {/* View stats */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
              <Eye className="h-4 w-4" />
              Tracking
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Total vistas</span>
                <span className="font-medium text-gray-900">
                  {(quote.viewCount as number) ?? 0}
                </span>
              </div>
              {quote.lastViewedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Ultima vista</span>
                  <span className="text-gray-700">
                    {new Date(quote.lastViewedAt as string).toLocaleString("es-CL")}
                  </span>
                </div>
              )}
              {quote.acceptedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Aceptada</span>
                  <span className="text-green-600 font-medium">
                    {new Date(quote.acceptedAt as string).toLocaleString("es-CL")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
              <Clock className="h-4 w-4" />
              Fechas
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Creada</span>
                <span className="text-gray-700">
                  {new Date(quote.createdAt as string).toLocaleDateString("es-CL")}
                </span>
              </div>
              {quote.validUntil && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Valida hasta</span>
                  <span className="text-gray-700">
                    {new Date(quote.validUntil as string).toLocaleDateString("es-CL")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* View logs */}
      {viewLogs.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
            <Monitor className="h-4 w-4" />
            Registro de vistas
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-2 text-left text-xs font-medium uppercase text-gray-500">
                    Fecha
                  </th>
                  <th className="pb-2 text-left text-xs font-medium uppercase text-gray-500">
                    IP
                  </th>
                  <th className="pb-2 text-left text-xs font-medium uppercase text-gray-500">
                    User Agent
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {viewLogs.map((log, idx) => (
                  <tr key={idx}>
                    <td className="py-2 text-sm text-gray-700">
                      {new Date(log.viewedAt as string).toLocaleString("es-CL")}
                    </td>
                    <td className="py-2 text-sm text-gray-500 font-mono">
                      <span className="inline-flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {(log.ipAddress as string) ?? "-"}
                      </span>
                    </td>
                    <td className="py-2 text-sm text-gray-500 max-w-xs truncate">
                      {(log.userAgent as string) ?? "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
