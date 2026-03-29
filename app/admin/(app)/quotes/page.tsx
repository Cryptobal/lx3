// @ts-nocheck
import Link from "next/link";
import { Plus, FileText, Eye } from "lucide-react";
import { getQuotes } from "@/lib/growth-os/actions/quotes";
import { Badge } from "@/components/growth-os/shared/Badge";
import { formatMoney, formatDate } from "@/lib/growth-os/utils/format";
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

interface QuotesPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    page?: string;
  }>;
}

export default async function QuotesPage({ searchParams }: QuotesPageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const status = params.status || "";
  const page = parseInt(params.page || "1", 10);

  let result = {
    data: [] as Awaited<ReturnType<typeof getQuotes>>["data"],
    total: 0,
    page: 1,
    pageSize: 20,
    totalPages: 0,
  };

  try {
    result = await getQuotes({
      search: search || undefined,
      status: status || undefined,
      page,
      pageSize: 20,
    });
  } catch {
    // Data will remain at defaults
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Cotizaciones
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Crea y gestiona cotizaciones para tus clientes
          </p>
        </div>
        <Link
          href="/admin/quotes/new"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva cotización
        </Link>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden">
        {result.data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-zinc-400" />
            </div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              No hay cotizaciones
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Crea tu primera cotización para comenzar
            </p>
            <Link
              href="/admin/quotes/new"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nueva cotización
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <th className="text-left px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                    Número
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                    Título
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                    Cliente
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                    Monto Total
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                    Estado
                  </th>
                  <th className="text-center px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                    Vistas
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {result.data.map((quote) => {
                  const cfg = STATUS_CONFIG[quote.status];
                  return (
                    <tr
                      key={quote.id}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/quotes/${quote.id}`}
                          className="font-mono text-xs font-medium text-zinc-900 dark:text-zinc-100 hover:underline"
                        >
                          {quote.quoteNumber}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/quotes/${quote.id}`}
                          className="text-zinc-900 dark:text-zinc-100 hover:underline font-medium"
                        >
                          {quote.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                        {quote.contact
                          ? `${quote.contact.firstName} ${quote.contact.lastName || ""}`.trim()
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-zinc-900 dark:text-zinc-100">
                        {formatMoney(quote.total, quote.currency)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={cfg.variant}>{cfg.label}</Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
                          <Eye className="w-3.5 h-3.5" />
                          {quote.viewCount}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">
                        {formatDate(quote.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {result.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-100 dark:border-zinc-800">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Mostrando {(result.page - 1) * result.pageSize + 1} -{" "}
              {Math.min(result.page * result.pageSize, result.total)} de{" "}
              {result.total}
            </p>
            <div className="flex gap-2">
              {result.page > 1 && (
                <Link
                  href={`/admin/quotes?page=${result.page - 1}${search ? `&search=${search}` : ""}${status ? `&status=${status}` : ""}`}
                  className="px-3 py-1 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Anterior
                </Link>
              )}
              {result.page < result.totalPages && (
                <Link
                  href={`/admin/quotes?page=${result.page + 1}${search ? `&search=${search}` : ""}${status ? `&status=${status}` : ""}`}
                  className="px-3 py-1 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Siguiente
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}