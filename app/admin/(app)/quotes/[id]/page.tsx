import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, Clock } from "lucide-react";
import { getQuote } from "@/lib/growth-os/actions/quotes";
import { Badge } from "@/components/growth-os/shared/Badge";
import { formatMoney, formatDate, formatDateTime } from "@/lib/growth-os/utils/format";
import { QuoteActions } from "@/components/growth-os/quotes/QuoteActions";
import type { QuoteStatus } from "@/lib/generated/prisma/client";

const STATUS_CONFIG: Record<
  QuoteStatus,
  { label: string; variant: "default" | "info" | "purple" | "success" | "danger" }
> = {
  DRAFT: { label: "Borrador", variant: "default" },
  SENT: { label: "Enviada", variant: "info" },
  VIEWED: { label: "Vista", variant: "purple" },
  ACCEPTED: { label: "Aceptada", variant: "success" },
  REJECTED: { label: "Rechazada", variant: "danger" },
  EXPIRED: { label: "Expirada", variant: "default" },
};

interface QuoteDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function QuoteDetailPage({ params }: QuoteDetailPageProps) {
  const { id } = await params;

  let quote: Awaited<ReturnType<typeof getQuote>>;

  try {
    quote = await getQuote(id);
  } catch {
    notFound();
  }

  const cfg = STATUS_CONFIG[quote.status];

  const contactName = quote.contact
    ? `${quote.contact.firstName} ${quote.contact.lastName || ""}`.trim()
    : null;

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/admin/quotes"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a cotizaciones
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {quote.quoteNumber}
            </h1>
            <Badge variant={cfg.variant} size="md">
              {cfg.label}
            </Badge>
          </div>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            {quote.title}
          </p>
        </div>

        <QuoteActions quoteId={quote.id} status={quote.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          {quote.description && (
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-6">
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-3">
                Descripción
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
                {quote.description}
              </p>
            </div>
          )}

          {/* Items table */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden">
            <div className="p-6 pb-0">
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                Items
              </h2>
            </div>
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <th className="text-left px-6 py-3 font-medium text-zinc-500 dark:text-zinc-400 w-10">
                      #
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                      Descripción
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 w-24">
                      Cantidad
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 w-32">
                      Precio Unit.
                    </th>
                    <th className="text-right px-6 py-3 font-medium text-zinc-500 dark:text-zinc-400 w-32">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {quote.items.map((item, index) => (
                    <tr key={item.id}>
                      <td className="px-6 py-3 text-zinc-400">{index + 1}</td>
                      <td className="px-4 py-3">
                        <div className="text-zinc-900 dark:text-zinc-100 font-medium">
                          {item.description}
                        </div>
                        {item.details && (
                          <div className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">
                            {item.details}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-zinc-600 dark:text-zinc-400">
                        {Number(item.quantity)}
                      </td>
                      <td className="px-4 py-3 text-right text-zinc-600 dark:text-zinc-400">
                        {formatMoney(item.unitPrice, quote.currency)}
                      </td>
                      <td className="px-6 py-3 text-right font-medium text-zinc-900 dark:text-zinc-100">
                        {formatMoney(item.total, quote.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="border-t border-zinc-100 dark:border-zinc-800 px-6 py-4">
              <div className="flex flex-col items-end gap-1 text-sm">
                <div className="flex items-center gap-8">
                  <span className="text-zinc-500 dark:text-zinc-400">
                    Subtotal
                  </span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100 w-32 text-right">
                    {formatMoney(quote.subtotal, quote.currency)}
                  </span>
                </div>
                {quote.taxRate && (
                  <div className="flex items-center gap-8">
                    <span className="text-zinc-500 dark:text-zinc-400">
                      IVA ({Number(quote.taxRate)}%)
                    </span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100 w-32 text-right">
                      {formatMoney(quote.taxAmount ?? 0, quote.currency)}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-8 pt-2 border-t border-zinc-200 dark:border-zinc-700 mt-1">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Total
                  </span>
                  <span className="font-bold text-lg text-zinc-900 dark:text-zinc-100 w-32 text-right">
                    {formatMoney(quote.total, quote.currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes and terms */}
          {(quote.notes || quote.terms) && (
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-6 space-y-4">
              {quote.notes && (
                <div>
                  <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-2">
                    Notas
                  </h2>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
                    {quote.notes}
                  </p>
                </div>
              )}
              {quote.terms && (
                <div>
                  <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-2">
                    Términos y condiciones
                  </h2>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
                    {quote.terms}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* View logs */}
          {quote.viewLogs.length > 0 && (
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden">
              <div className="p-6 pb-0">
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                  Registro de vistas
                </h2>
              </div>
              <div className="overflow-x-auto mt-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-100 dark:border-zinc-800">
                      <th className="text-left px-6 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                        Fecha
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                        IP
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                        User Agent
                      </th>
                      <th className="text-right px-6 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                        Duración
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {quote.viewLogs.map((log) => (
                      <tr key={log.id}>
                        <td className="px-6 py-3 text-zinc-900 dark:text-zinc-100">
                          {formatDateTime(log.viewedAt)}
                        </td>
                        <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400 font-mono text-xs">
                          {log.ipAddress || "—"}
                        </td>
                        <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400 text-xs max-w-xs truncate">
                          {log.userAgent || "—"}
                        </td>
                        <td className="px-6 py-3 text-right text-zinc-500 dark:text-zinc-400">
                          {log.duration ? `${log.duration}s` : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Info card */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
              Detalles
            </h2>

            <dl className="space-y-3 text-sm">
              {contactName && (
                <div>
                  <dt className="text-zinc-500 dark:text-zinc-400">Cliente</dt>
                  <dd className="mt-0.5 font-medium text-zinc-900 dark:text-zinc-100">
                    <Link
                      href={`/admin/contacts/${quote.contactId}`}
                      className="hover:underline"
                    >
                      {contactName}
                    </Link>
                    {quote.contact?.email && (
                      <div className="text-xs text-zinc-500 dark:text-zinc-400 font-normal mt-0.5">
                        {quote.contact.email}
                      </div>
                    )}
                  </dd>
                </div>
              )}

              {quote.deal && (
                <div>
                  <dt className="text-zinc-500 dark:text-zinc-400">Negocio</dt>
                  <dd className="mt-0.5 font-medium text-zinc-900 dark:text-zinc-100">
                    {quote.deal.title}
                  </dd>
                </div>
              )}

              {quote.createdBy && (
                <div>
                  <dt className="text-zinc-500 dark:text-zinc-400">
                    Creado por
                  </dt>
                  <dd className="mt-0.5 font-medium text-zinc-900 dark:text-zinc-100">
                    {quote.createdBy.name || quote.createdBy.email}
                  </dd>
                </div>
              )}

              <div>
                <dt className="text-zinc-500 dark:text-zinc-400">Moneda</dt>
                <dd className="mt-0.5 font-medium text-zinc-900 dark:text-zinc-100">
                  {quote.currency}
                </dd>
              </div>

              {quote.validUntil && (
                <div>
                  <dt className="text-zinc-500 dark:text-zinc-400">
                    Válida hasta
                  </dt>
                  <dd className="mt-0.5 font-medium text-zinc-900 dark:text-zinc-100">
                    {formatDate(quote.validUntil)}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Timeline */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
              Fechas
            </h2>
            <dl className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-zinc-400 shrink-0" />
                <div>
                  <dt className="text-zinc-500 dark:text-zinc-400">Creada</dt>
                  <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                    {formatDateTime(quote.createdAt)}
                  </dd>
                </div>
              </div>

              {quote.sentAt && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                  <div>
                    <dt className="text-zinc-500 dark:text-zinc-400">Enviada</dt>
                    <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                      {formatDateTime(quote.sentAt)}
                    </dd>
                  </div>
                </div>
              )}

              {quote.lastViewedAt && (
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-purple-400 shrink-0" />
                  <div>
                    <dt className="text-zinc-500 dark:text-zinc-400">
                      Última vista
                    </dt>
                    <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                      {formatDateTime(quote.lastViewedAt)}
                      <span className="text-xs text-zinc-400 ml-1">
                        ({quote.viewCount} {quote.viewCount === 1 ? "vista" : "vistas"})
                      </span>
                    </dd>
                  </div>
                </div>
              )}

              {quote.acceptedAt && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <dt className="text-zinc-500 dark:text-zinc-400">
                      Aceptada
                    </dt>
                    <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                      {formatDateTime(quote.acceptedAt)}
                    </dd>
                  </div>
                </div>
              )}

              {quote.rejectedAt && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-red-400 shrink-0" />
                  <div>
                    <dt className="text-zinc-500 dark:text-zinc-400">
                      Rechazada
                    </dt>
                    <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                      {formatDateTime(quote.rejectedAt)}
                    </dd>
                  </div>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
