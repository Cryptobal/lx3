import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  Linkedin,
  Tag,
  Brain,
  Globe,
} from "lucide-react";
import { getContact } from "@/lib/growth-os/actions/contacts";
import { getInitials, getSourceLabel, formatMoney } from "@/lib/growth-os/utils/format";
import { Badge } from "@/components/growth-os/shared/Badge";
import { RelativeTime } from "@/components/growth-os/shared/RelativeTime";
import { ContactTimeline } from "@/components/growth-os/contacts/ContactTimeline";

interface Props {
  params: Promise<{ id: string }>;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export default async function ContactDetailPage({ params }: Props) {
  const { id } = await params;
  const result = await getContact(id);

  if (!result.success) notFound();

  const contact = result.data as any;
  const company = contact.company as any | null;
  const deals = (contact.deals ?? []) as any[];
  const quotes = (contact.quotes ?? []) as any[];
  const activities = (contact.activities ?? []) as any[];
  const visitorSessions = (contact.visitorSessions ?? []) as any[];
  const enrichmentData = contact.enrichmentData as Record<string, unknown> | null;
  const tags: string[] = contact.tags ?? [];

  const fullName = `${contact.firstName}${contact.lastName ? ` ${contact.lastName}` : ""}`;
  const initials = getInitials(fullName);

  return (
    <div>
      {/* Back link */}
      <Link
        href="/admin/contacts"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a contactos
      </Link>

      {/* Header */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold text-gray-900">{fullName}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500">
              {contact.position && (
                <span>{String(contact.position)}</span>
              )}
              {company && (
                <>
                  {contact.position && <span>en</span>}
                  <Link
                    href={`/admin/companies/${String(company.id)}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {String(company.name)}
                  </Link>
                </>
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge
                label={getSourceLabel(String(contact.source))}
                color="blue"
              />
              {tags.map((tag) => (
                <Badge key={tag} label={tag} color="gray" size="sm" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column: info + enrichment */}
        <div className="space-y-6 lg:col-span-1">
          {/* Contact info */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-gray-700">
              Informacion de contacto
            </h2>
            <ul className="space-y-3">
              {contact.email && (
                <li className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <a
                    href={`mailto:${String(contact.email)}`}
                    className="text-blue-600 hover:underline"
                  >
                    {String(contact.email)}
                  </a>
                </li>
              )}
              {contact.phone && (
                <li className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">{String(contact.phone)}</span>
                </li>
              )}
              {contact.linkedinUrl && (
                <li className="flex items-center gap-2 text-sm">
                  <Linkedin className="h-4 w-4 text-gray-400" />
                  <a
                    href={String(contact.linkedinUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    LinkedIn
                  </a>
                </li>
              )}
              {!contact.email && !contact.phone && !contact.linkedinUrl && (
                <li className="text-sm text-gray-400">Sin datos de contacto</li>
              )}
            </ul>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Tag className="h-4 w-4" />
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} label={tag} color="blue" />
                ))}
              </div>
            </div>
          )}

          {/* Enrichment */}
          {enrichmentData && (
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Brain className="h-4 w-4" />
                Datos Enriquecidos
              </h2>
              {contact.enrichedAt && (
                <p className="mb-2 text-xs text-gray-400">
                  Enriquecido: <RelativeTime date={String(contact.enrichedAt)} />
                </p>
              )}
              <pre className="overflow-x-auto rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
                {JSON.stringify(enrichmentData, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Right column: timeline, deals, quotes, sessions */}
        <div className="space-y-6 lg:col-span-2">
          {/* Timeline */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-gray-700">
              Actividad
            </h2>
            <ContactTimeline activities={activities} />
          </div>

          {/* Deals */}
          {deals.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold text-gray-700">
                Deals Asociados
              </h2>
              <ul className="divide-y divide-gray-100">
                {deals.map((deal) => {
                  const stage = deal.stage;
                  return (
                    <li key={String(deal.id)} className="py-3">
                      <Link
                        href={`/admin/deals/${String(deal.id)}`}
                        className="-mx-2 flex items-center justify-between rounded-lg px-2 py-1 transition-colors hover:bg-gray-50"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {String(deal.title)}
                          </p>
                          {stage && (
                            <Badge
                              label={String(stage.name)}
                              color={String(stage.color ?? "gray")}
                              size="sm"
                            />
                          )}
                        </div>
                        {deal.value != null && (
                          <span className="text-sm font-medium tabular-nums text-gray-700">
                            {formatMoney(
                              Number(deal.value),
                              String(deal.currency ?? "CLP")
                            )}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Quotes */}
          {quotes.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold text-gray-700">
                Cotizaciones
              </h2>
              <ul className="divide-y divide-gray-100">
                {quotes.map((quote) => (
                  <li key={String(quote.id)} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {String(quote.quoteNumber)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {String(quote.title)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium tabular-nums text-gray-700">
                        {formatMoney(
                          Number(quote.total),
                          String(quote.currency ?? "CLP")
                        )}
                      </p>
                      <Badge
                        label={String(quote.status)}
                        color={
                          String(quote.status) === "ACCEPTED"
                            ? "green"
                            : String(quote.status) === "REJECTED"
                              ? "red"
                              : "blue"
                        }
                        size="sm"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Visitor sessions */}
          {visitorSessions.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Globe className="h-4 w-4" />
                Sesiones de Visita
              </h2>
              <ul className="divide-y divide-gray-100">
                {visitorSessions.map((session) => {
                  const pageViews = (session.pageViews ?? []) as any[];
                  return (
                    <li key={String(session.id)} className="py-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-700">
                            {pageViews.length} pagina{pageViews.length !== 1 ? "s" : ""} visitada{pageViews.length !== 1 ? "s" : ""}
                          </p>
                          <div className="mt-0.5 flex gap-2 text-xs text-gray-400">
                            {session.referrer && (
                              <span>Ref: {String(session.referrer)}</span>
                            )}
                            {session.utmSource && (
                              <span>UTM: {String(session.utmSource)}</span>
                            )}
                            {session.deviceType && (
                              <span>{String(session.deviceType)}</span>
                            )}
                          </div>
                        </div>
                        <span className="text-xs">
                          <RelativeTime date={String(session.startedAt)} />
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
