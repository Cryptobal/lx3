// @ts-nocheck
import Link from "next/link";
import { Mail, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { getEmailLogs, getGmailEmails } from "@/lib/growth-os/actions/emails";
import { Badge } from "@/components/growth-os/shared/Badge";
import { EmptyState } from "@/components/growth-os/shared/EmptyState";
import { Pagination } from "@/components/growth-os/shared/Pagination";
import { formatDate, formatRelativeTime } from "@/lib/growth-os/utils/format";
import { cn } from "@/lib/utils/cn";
import type { EmailStatus } from "@/lib/growth-os/types";

interface EmailsPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    tab?: string;
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
  const tab = params.tab || "sent";
  const page = parseInt(params.page || "1", 10);
  const pageSize = 20;

  // Fetch data based on active tab
  let sentResult = { data: [] as any[], total: 0, page: 1, pageSize: 20, totalPages: 0 };
  let gmailResult = { data: [] as any[], total: 0, page: 1, pageSize: 20, totalPages: 0 };

  try {
    if (tab === "sent" || tab === "all") {
      sentResult = await getEmailLogs({
        search: search || undefined,
        status: status || undefined,
        page: tab === "sent" ? page : 1,
        pageSize,
      });
    }
    if (tab === "gmail" || tab === "all") {
      gmailResult = await getGmailEmails({
        search: search || undefined,
        page: tab === "gmail" ? page : 1,
        pageSize,
      });
    }
  } catch {
    // Data will remain at defaults
  }

  const activeResult = tab === "gmail" ? gmailResult : sentResult;

  const tabs = [
    { key: "sent", label: "Enviados", count: sentResult.total },
    { key: "gmail", label: "Gmail", count: gmailResult.total },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Emails
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Historial de emails enviados y sincronizados
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-zinc-200 dark:border-zinc-800">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={`/admin/emails?tab=${t.key}${search ? `&search=${search}` : ""}`}
            className={cn(
              "px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px",
              tab === t.key
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
            )}
          >
            {t.label}
            {t.count > 0 && (
              <span className="ml-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 text-xs">
                {t.count}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Search */}
      <form className="relative max-w-md">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          name="search"
          defaultValue={search}
          placeholder={tab === "gmail" ? "Buscar en Gmail..." : "Buscar por email o asunto..."}
          className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
        <input type="hidden" name="tab" value={tab} />
      </form>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {tab === "sent" && (
          <SentEmailsTable emails={sentResult.data} />
        )}

        {tab === "gmail" && (
          <GmailEmailsTable emails={gmailResult.data} />
        )}

        {/* Pagination */}
        <div className="px-4">
          <Pagination
            page={activeResult.page}
            totalPages={activeResult.totalPages}
            total={activeResult.total}
            pageSize={activeResult.pageSize}
            basePath="/admin/emails"
            extraParams={Object.fromEntries(
              [
                ["tab", tab],
                search && ["search", search],
                status && ["status", status],
              ].filter(Boolean) as [string, string][]
            )}
            itemLabel="emails"
          />
        </div>
      </div>
    </div>
  );
}

function SentEmailsTable({ emails }: { emails: any[] }) {
  if (emails.length === 0) {
    return (
      <EmptyState
        icon={Mail}
        title="Sin emails enviados"
        description="Los emails que envies desde el sistema apareceran aqui."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
            <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Destinatario
            </th>
            <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Asunto
            </th>
            <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Enviado por
            </th>
            <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Fecha
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {emails.map((email: any) => {
            const config = statusConfig[email.status as EmailStatus];
            return (
              <tr
                key={email.id}
                className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <span className="text-zinc-900 dark:text-zinc-100 font-medium">
                    {email.to}
                  </span>
                  {email.contact && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {email.contact.firstName} {email.contact.lastName}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300 max-w-[300px] truncate">
                  {email.subject}
                </td>
                <td className="px-4 py-3">
                  {config && (
                    <Badge variant={config.variant}>{config.label}</Badge>
                  )}
                </td>
                <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">
                  {email.sentBy?.name || "—"}
                </td>
                <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">
                  {email.sentAt
                    ? formatDate(email.sentAt)
                    : formatRelativeTime(email.createdAt)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function GmailEmailsTable({ emails }: { emails: any[] }) {
  if (emails.length === 0) {
    return (
      <EmptyState
        icon={Mail}
        title="Sin emails de Gmail"
        description="Conecta tu cuenta de Gmail en Configuracion para sincronizar emails."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
            <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider w-10">
              Dir.
            </th>
            <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              De / Para
            </th>
            <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Asunto
            </th>
            <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Contacto
            </th>
            <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Fecha
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {emails.map((email: any) => (
            <tr
              key={email.id}
              className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <td className="px-4 py-3">
                {email.direction === "INBOUND" ? (
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-900/20" title="Recibido">
                    <ArrowDownLeft className="h-3.5 w-3.5 text-blue-500" />
                  </span>
                ) : (
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-900/20" title="Enviado">
                    <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-zinc-900 dark:text-zinc-100 max-w-[200px] truncate">
                {email.from}
              </td>
              <td className="px-4 py-3">
                <p className="text-zinc-700 dark:text-zinc-300 max-w-[300px] truncate font-medium">
                  {email.subject}
                </p>
                {email.snippet && (
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 max-w-[300px] truncate mt-0.5">
                    {email.snippet}
                  </p>
                )}
              </td>
              <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">
                {email.contact ? (
                  <Link
                    href={`/admin/contacts/${email.contact.id}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {email.contact.firstName} {email.contact.lastName}
                  </Link>
                ) : (
                  "—"
                )}
              </td>
              <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                {formatRelativeTime(email.receivedAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
