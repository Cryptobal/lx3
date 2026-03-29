// @ts-nocheck
import { Mail } from "lucide-react";
import { getEmailLogs } from "@/lib/growth-os/actions/emails";
import { Badge } from "@/components/growth-os/shared/Badge";
import { EmptyState } from "@/components/growth-os/shared/EmptyState";
import { formatDate, formatRelativeTime } from "@/lib/growth-os/utils/format";
import type { EmailStatus } from "@/lib/growth-os/types";

interface EmailsPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    page?: string;
  }>;
}

const statusConfig: Record<
  EmailStatus,
  { label: string; variant: "default" | "info" | "success" | "purple" | "danger" }
> = {
  QUEUED: { label: "En cola", variant: "default" },
  SENT: { label: "Enviado", variant: "info" },
  DELIVERED: { label: "Entregado", variant: "success" },
  OPENED: { label: "Abierto", variant: "purple" },
  CLICKED: { label: "Click", variant: "info" },
  BOUNCED: { label: "Rebotado", variant: "danger" },
  FAILED: { label: "Fallido", variant: "danger" },
};

export default async function EmailsPage({ searchParams }: EmailsPageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const status = params.status || "";
  const page = parseInt(params.page || "1", 10);

  let result = {
    data: [] as Awaited<ReturnType<typeof getEmailLogs>>["data"],
    total: 0,
    page: 1,
    pageSize: 20,
    totalPages: 0,
  };

  try {
    result = await getEmailLogs({
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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">
          Emails Enviados
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Historial y estado de los emails enviados desde el sistema
        </p>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        {result.data.length === 0 ? (
          <EmptyState
            icon={Mail}
            title="Sin emails enviados"
            description="Los emails que envíes desde el sistema aparecerán aquí con su estado de entrega."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Destinatario
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Asunto
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Enviado por
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Fecha de envío
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Fecha de apertura
                  </th>
                </tr>
              </thead>
              <tbody>
                {result.data.map((email) => {
                  const config = statusConfig[email.status];
                  return (
                    <tr
                      key={email.id}
                      className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div>
                          <span className="text-zinc-100 font-medium">
                            {email.to}
                          </span>
                          {email.contact && (
                            <p className="text-xs text-zinc-400">
                              {email.contact.firstName} {email.contact.lastName}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-zinc-300 max-w-[300px] truncate">
                        {email.subject}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={config.variant}>{config.label}</Badge>
                      </td>
                      <td className="px-4 py-3 text-zinc-400">
                        {email.sentBy?.name || "—"}
                      </td>
                      <td className="px-4 py-3 text-zinc-400">
                        {email.sentAt
                          ? formatDate(email.sentAt)
                          : formatRelativeTime(email.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-zinc-400">
                        {email.openedAt ? formatDate(email.openedAt) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {result.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-800">
            <p className="text-sm text-zinc-400">
              Mostrando {(result.page - 1) * result.pageSize + 1} a{" "}
              {Math.min(result.page * result.pageSize, result.total)} de{" "}
              {result.total} emails
            </p>
            <div className="flex items-center gap-2">
              {result.page > 1 && (
                <a
                  href={`/admin/emails?page=${result.page - 1}${search ? `&search=${search}` : ""}${status ? `&status=${status}` : ""}`}
                  className="px-3 py-1.5 text-sm font-medium rounded-md border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors"
                >
                  Anterior
                </a>
              )}
              {result.page < result.totalPages && (
                <a
                  href={`/admin/emails?page=${result.page + 1}${search ? `&search=${search}` : ""}${status ? `&status=${status}` : ""}`}
                  className="px-3 py-1.5 text-sm font-medium rounded-md border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors"
                >
                  Siguiente
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}