// @ts-nocheck
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  DollarSign,
  User,
  Building2,
  Calendar,
  Clock,
  FileText,
  MessageSquare,
  Target,
  Pencil,
} from "lucide-react";
import { getDeal } from "@/lib/growth-os/actions/deals";
import { Badge } from "@/components/growth-os/shared/Badge";
import {
  formatDate,
  formatMoney,
  formatRelativeTime,
} from "@/lib/growth-os/utils/format";

interface DealDetailPageProps {
  params: Promise<{ id: string }>;
}

const STAGE_VARIANT_MAP: Record<
  string,
  "default" | "success" | "warning" | "danger" | "info" | "purple"
> = {
  green: "success",
  emerald: "success",
  blue: "info",
  yellow: "warning",
  amber: "warning",
  red: "danger",
  purple: "purple",
};

function stageVariant(
  color: string | null
): "default" | "success" | "warning" | "danger" | "info" | "purple" {
  if (!color) return "default";
  const lower = color.toLowerCase();
  for (const [key, variant] of Object.entries(STAGE_VARIANT_MAP)) {
    if (lower.includes(key)) return variant;
  }
  return "default";
}

const ACTIVITY_LABELS: Record<string, string> = {
  NOTE: "Nota",
  EMAIL_SENT: "Email enviado",
  EMAIL_OPENED: "Email abierto",
  EMAIL_CLICKED: "Email clic",
  CALL: "Llamada",
  MEETING: "Reunion",
  QUOTE_SENT: "Cotizacion enviada",
  QUOTE_VIEWED: "Cotizacion vista",
  QUOTE_ACCEPTED: "Cotizacion aceptada",
  QUOTE_REJECTED: "Cotizacion rechazada",
  DEAL_STAGE_CHANGED: "Cambio de etapa",
  CONTACT_CREATED: "Contacto creado",
  FORM_SUBMISSION: "Formulario",
  WEBSITE_VISIT: "Visita web",
  CHATBOT_CONVERSATION: "Chatbot",
};

const QUOTE_STATUS_VARIANT: Record<
  string,
  "default" | "success" | "warning" | "danger" | "info" | "purple"
> = {
  DRAFT: "default",
  SENT: "info",
  VIEWED: "purple",
  ACCEPTED: "success",
  REJECTED: "danger",
  EXPIRED: "warning",
};

const QUOTE_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Borrador",
  SENT: "Enviada",
  VIEWED: "Vista",
  ACCEPTED: "Aceptada",
  REJECTED: "Rechazada",
  EXPIRED: "Expirada",
};

export default async function DealDetailPage({ params }: DealDetailPageProps) {
  const { id } = await params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let deal: any;

  try {
    const result = await getDeal(id);
    if (!result.success) notFound();
    deal = result.data;
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/admin/deals"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al pipeline
      </Link>

      {/* Deal header */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {deal.title}
              </h1>
              <Link
                href={`/admin/deals/${deal.id}/edit`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 px-2.5 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <Pencil className="h-3 w-3" />
                Editar
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <Badge
                variant={stageVariant(deal.stage.color)}
                size="md"
              >
                {deal.stage.name}
              </Badge>
              {deal.value && (
                <span className="flex items-center gap-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  <DollarSign className="w-4 h-4" />
                  {formatMoney(deal.value, deal.currency)}
                </span>
              )}
              {deal.probability != null && (
                <span className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400">
                  <Target className="w-4 h-4" />
                  {deal.probability}% probabilidad
                </span>
              )}
            </div>
          </div>
          <div className="text-xs text-zinc-400 dark:text-zinc-500 shrink-0">
            Creado {formatRelativeTime(deal.createdAt)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info grid */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
              Informacion
            </h2>

            <div className="space-y-3">
              {/* Contact */}
              <div className="flex items-start gap-2 text-sm">
                <User className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 block">
                    Contacto
                  </span>
                  {deal.contact ? (
                    <Link
                      href={`/admin/contacts/${deal.contact.id}`}
                      className="text-zinc-900 dark:text-zinc-100 hover:underline"
                    >
                      {deal.contact.firstName}{" "}
                      {deal.contact.lastName ?? ""}
                    </Link>
                  ) : (
                    <span className="text-zinc-400">Sin contacto</span>
                  )}
                </div>
              </div>

              {/* Company */}
              <div className="flex items-start gap-2 text-sm">
                <Building2 className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 block">
                    Empresa
                  </span>
                  {deal.company ? (
                    <Link
                      href={`/admin/companies/${deal.company.id}`}
                      className="text-zinc-900 dark:text-zinc-100 hover:underline"
                    >
                      {deal.company.name}
                    </Link>
                  ) : (
                    <span className="text-zinc-400">Sin empresa</span>
                  )}
                </div>
              </div>

              {/* Assigned to */}
              <div className="flex items-start gap-2 text-sm">
                <User className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 block">
                    Asignado a
                  </span>
                  <span className="text-zinc-900 dark:text-zinc-100">
                    {deal.assignedTo?.name ?? deal.assignedTo?.email ?? "Sin asignar"}
                  </span>
                </div>
              </div>

              {/* Expected close */}
              <div className="flex items-start gap-2 text-sm">
                <Calendar className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 block">
                    Cierre esperado
                  </span>
                  <span className="text-zinc-900 dark:text-zinc-100">
                    {deal.expectedClose
                      ? formatDate(deal.expectedClose)
                      : "Sin fecha"}
                  </span>
                </div>
              </div>

              {/* Created / Updated */}
              <div className="flex items-start gap-2 text-sm">
                <Clock className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 block">
                    Creado
                  </span>
                  <span className="text-zinc-900 dark:text-zinc-100">
                    {formatDate(deal.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-sm">
                <Clock className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 block">
                    Actualizado
                  </span>
                  <span className="text-zinc-900 dark:text-zinc-100">
                    {formatRelativeTime(deal.updatedAt)}
                  </span>
                </div>
              </div>

              {deal.closedAt && (
                <div className="flex items-start gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 block">
                      Cerrado
                    </span>
                    <span className="text-zinc-900 dark:text-zinc-100">
                      {formatDate(deal.closedAt)}
                    </span>
                  </div>
                </div>
              )}

              {deal.lostReason && (
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 block mb-1">
                    Razon de perdida
                  </span>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">
                    {deal.lostReason}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {deal.notes && (
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-zinc-400" />
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                  Notas
                </h2>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap">
                {deal.notes}
              </p>
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Activities timeline */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800">
            <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Actividad ({deal.activities.length})
              </h2>
            </div>
            {deal.activities.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                No hay actividades registradas.
              </div>
            ) : (
              <div className="p-5">
                <div className="relative space-y-4">
                  {/* Vertical line */}
                  <div className="absolute left-3 top-2 bottom-2 w-px bg-zinc-200 dark:bg-zinc-700" />

                  {deal.activities.map((activity: any) => (
                    <div key={activity.id} className="relative flex gap-3 pl-1">
                      <div className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-600 shrink-0 z-10 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <Badge variant="default" size="sm">
                            {ACTIVITY_LABELS[activity.type] ?? activity.type}
                          </Badge>
                          <span className="text-xs text-zinc-400 dark:text-zinc-500">
                            {formatRelativeTime(activity.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-zinc-700 dark:text-zinc-300">
                          {activity.title}
                        </p>
                        {activity.description && (
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                            {activity.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Linked quotes */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800">
            <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-zinc-400" />
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Cotizaciones ({deal.quotes.length})
                </h2>
              </div>
            </div>
            {deal.quotes.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                No hay cotizaciones asociadas.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-700">
                      <th className="px-5 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Numero
                      </th>
                      <th className="px-5 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Titulo
                      </th>
                      <th className="px-5 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-5 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-5 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Fecha
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {deal.quotes.map((quote: any) => (
                      <tr
                        key={quote.id}
                        className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                      >
                        <td className="px-5 py-3">
                          <Link
                            href={`/admin/quotes/${quote.id}`}
                            className="font-medium text-zinc-900 dark:text-zinc-100 hover:underline"
                          >
                            {quote.quoteNumber}
                          </Link>
                        </td>
                        <td className="px-5 py-3 text-zinc-600 dark:text-zinc-400">
                          {quote.title}
                        </td>
                        <td className="px-5 py-3 text-zinc-900 dark:text-zinc-100 font-medium">
                          {formatMoney(quote.total, quote.currency)}
                        </td>
                        <td className="px-5 py-3">
                          <Badge
                            variant={
                              QUOTE_STATUS_VARIANT[quote.status] ?? "default"
                            }
                          >
                            {QUOTE_STATUS_LABELS[quote.status] ?? quote.status}
                          </Badge>
                        </td>
                        <td className="px-5 py-3 text-zinc-600 dark:text-zinc-400">
                          {formatDate(quote.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}