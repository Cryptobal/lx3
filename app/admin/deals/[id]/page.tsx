import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Building2,
  User,
  UserCircle,
  FileText,
  Clock,
} from "lucide-react";
import { getDeal } from "@/lib/growth-os/actions/deals";
import { Badge } from "@/components/growth-os/shared/Badge";
import { MoneyDisplay } from "@/components/growth-os/shared/MoneyDisplay";
import { RelativeTime } from "@/components/growth-os/shared/RelativeTime";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DealDetailPage({ params }: Props) {
  const { id } = await params;
  const result = await getDeal(id);

  if (!result.success) notFound();

  const deal = result.data as any;

  const probabilityColor =
    deal.probability != null
      ? deal.probability >= 70
        ? "green"
        : deal.probability >= 40
          ? "yellow"
          : "red"
      : "gray";

  return (
    <div>
      {/* Back link */}
      <Link
        href="/admin/deals"
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al pipeline
      </Link>

      {/* Header */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{deal.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              {deal.stage && (
                <Badge
                  label={deal.stage.name}
                  color={deal.stage.color || "gray"}
                  size="md"
                />
              )}
              {deal.value != null && (
                <span className="text-lg font-semibold tabular-nums text-gray-900">
                  <MoneyDisplay
                    amount={Number(deal.value)}
                    currency={deal.currency}
                  />
                </span>
              )}
              {deal.probability != null && (
                <Badge
                  label={`${deal.probability}% probabilidad`}
                  color={probabilityColor}
                />
              )}
            </div>
          </div>
          <Link
            href={`/admin/deals/${id}/edit`}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Editar
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Info */}
        <div className="space-y-6 lg:col-span-1">
          {/* Contact & Company */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
              Asociaciones
            </h2>
            <dl className="space-y-3">
              {deal.contact && (
                <div>
                  <dt className="flex items-center gap-1.5 text-xs text-gray-400">
                    <User className="h-3.5 w-3.5" />
                    Contacto
                  </dt>
                  <dd className="mt-0.5">
                    <Link
                      href={`/admin/contacts/${deal.contact.id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      {deal.contact.firstName} {deal.contact.lastName ?? ""}
                    </Link>
                    {deal.contact.email && (
                      <p className="text-xs text-gray-400">
                        {deal.contact.email}
                      </p>
                    )}
                  </dd>
                </div>
              )}
              {deal.company && (
                <div>
                  <dt className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Building2 className="h-3.5 w-3.5" />
                    Empresa
                  </dt>
                  <dd className="mt-0.5">
                    <Link
                      href={`/admin/companies/${deal.company.id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      {deal.company.name}
                    </Link>
                  </dd>
                </div>
              )}
              {deal.assignedTo && (
                <div>
                  <dt className="flex items-center gap-1.5 text-xs text-gray-400">
                    <UserCircle className="h-3.5 w-3.5" />
                    Asignado a
                  </dt>
                  <dd className="mt-0.5 text-sm text-gray-700">
                    {deal.assignedTo.name ?? deal.assignedTo.email}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Dates */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
              Fechas
            </h2>
            <dl className="space-y-3">
              <div>
                <dt className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Calendar className="h-3.5 w-3.5" />
                  Creado
                </dt>
                <dd className="mt-0.5 text-sm text-gray-700">
                  <RelativeTime date={deal.createdAt} />
                </dd>
              </div>
              {deal.expectedClose && (
                <div>
                  <dt className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Clock className="h-3.5 w-3.5" />
                    Cierre esperado
                  </dt>
                  <dd className="mt-0.5 text-sm text-gray-700">
                    {new Date(deal.expectedClose).toLocaleDateString("es-CL")}
                  </dd>
                </div>
              )}
              {deal.closedAt && (
                <div>
                  <dt className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Clock className="h-3.5 w-3.5" />
                    Cerrado
                  </dt>
                  <dd className="mt-0.5 text-sm text-gray-700">
                    {new Date(deal.closedAt).toLocaleDateString("es-CL")}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Notes */}
          {deal.notes && (
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
                Notas
              </h2>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                {deal.notes}
              </p>
            </div>
          )}
        </div>

        {/* Right: Quotes & Activity */}
        <div className="space-y-6 lg:col-span-2">
          {/* Quotes */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FileText className="h-4 w-4 text-gray-400" />
                Cotizaciones
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                  {deal.quotes?.length ?? 0}
                </span>
              </h2>
            </div>
            {deal.quotes?.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {deal.quotes.map((quote: any) => (
                  <Link
                    key={quote.id}
                    href={`/admin/quotes/${quote.id}`}
                    className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-gray-50"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {quote.number || quote.id.slice(0, 8)}
                      </p>
                      <p className="text-xs text-gray-500">
                        <Badge
                          label={quote.status}
                          color={
                            quote.status === "ACCEPTED"
                              ? "green"
                              : quote.status === "SENT"
                                ? "blue"
                                : "gray"
                          }
                        />
                      </p>
                    </div>
                    {quote.total != null && (
                      <span className="text-sm font-semibold tabular-nums text-gray-700">
                        <MoneyDisplay
                          amount={Number(quote.total)}
                          currency={quote.currency ?? "CLP"}
                        />
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="px-5 py-8 text-center text-sm text-gray-400">
                No hay cotizaciones asociadas
              </div>
            )}
          </div>

          {/* Activity Timeline */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-5 py-4">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Clock className="h-4 w-4 text-gray-400" />
                Actividad
              </h2>
            </div>
            {deal.activities?.length > 0 ? (
              <div className="px-5 py-4">
                <ol className="relative border-l border-gray-200">
                  {deal.activities.map((activity: any) => (
                    <li key={activity.id} className="mb-6 ml-6 last:mb-0">
                      <div className="absolute -left-1.5 mt-1 h-3 w-3 rounded-full border-2 border-white bg-gray-300" />
                      <div>
                        <p className="text-sm text-gray-700">
                          {activity.title}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-400">
                          <RelativeTime date={activity.createdAt} />
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            ) : (
              <div className="px-5 py-8 text-center text-sm text-gray-400">
                No hay actividad registrada
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
