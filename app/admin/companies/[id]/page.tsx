import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Globe,
  Phone,
  Linkedin,
  MapPin,
  Users,
  Tag,
  Sparkles,
} from "lucide-react";
import { getCompany } from "@/lib/growth-os/actions/companies";
import { Badge } from "@/components/growth-os/shared/Badge";
import { RelativeTime } from "@/components/growth-os/shared/RelativeTime";
import { MoneyDisplay } from "@/components/growth-os/shared/MoneyDisplay";
import { getInitials } from "@/lib/growth-os/utils/format";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CompanyDetailPage({ params }: Props) {
  const { id } = await params;
  const result = await getCompany(id);

  if (!result.success) notFound();

  const company = result.data as any;

  return (
    <div>
      {/* Back link */}
      <Link
        href="/admin/companies"
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a empresas
      </Link>

      {/* Header */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          {company.logoUrl ? (
            <img
              src={company.logoUrl}
              alt={company.name}
              className="h-16 w-16 rounded-xl object-contain"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-100 text-xl font-bold text-blue-700">
              {getInitials(company.name)}
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {company.name}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-500">
              {company.domain && (
                <span className="inline-flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5" />
                  {company.domain}
                </span>
              )}
              {company.industry && (
                <Badge label={company.industry} color="blue" />
              )}
              {company.size && <Badge label={company.size} color="gray" />}
            </div>
          </div>
          <Link
            href={`/admin/companies/${id}/edit`}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Editar
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: Info */}
        <div className="space-y-6 lg:col-span-1">
          {/* Company info */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
              Informacion
            </h2>
            <dl className="space-y-3">
              {company.website && (
                <div>
                  <dt className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Globe className="h-3.5 w-3.5" />
                    Sitio web
                  </dt>
                  <dd className="mt-0.5 text-sm text-blue-600">
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {company.website}
                    </a>
                  </dd>
                </div>
              )}
              {company.phone && (
                <div>
                  <dt className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Phone className="h-3.5 w-3.5" />
                    Telefono
                  </dt>
                  <dd className="mt-0.5 text-sm text-gray-700">
                    {company.phone}
                  </dd>
                </div>
              )}
              {company.linkedinUrl && (
                <div>
                  <dt className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Linkedin className="h-3.5 w-3.5" />
                    LinkedIn
                  </dt>
                  <dd className="mt-0.5 text-sm text-blue-600">
                    <a
                      href={company.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver perfil
                    </a>
                  </dd>
                </div>
              )}
              {(company.country || company.city) && (
                <div>
                  <dt className="flex items-center gap-1.5 text-xs text-gray-400">
                    <MapPin className="h-3.5 w-3.5" />
                    Ubicacion
                  </dt>
                  <dd className="mt-0.5 text-sm text-gray-700">
                    {[company.city, company.country]
                      .filter(Boolean)
                      .join(", ")}
                  </dd>
                </div>
              )}
              {company.size && (
                <div>
                  <dt className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Building2 className="h-3.5 w-3.5" />
                    Tamano
                  </dt>
                  <dd className="mt-0.5 text-sm text-gray-700">
                    {company.size}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Tags */}
          {company.tags?.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-gray-500">
                <Tag className="h-3.5 w-3.5" />
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {company.tags.map((tag: string) => (
                  <Badge key={tag} label={tag} color="blue" />
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {company.description && (
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
                Descripcion
              </h2>
              <p className="text-sm leading-relaxed text-gray-700">
                {company.description}
              </p>
            </div>
          )}

          {/* Enrichment */}
          {company.enrichmentData && (
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-gray-500">
                <Sparkles className="h-3.5 w-3.5" />
                Datos enriquecidos
              </h2>
              {company.enrichedAt && (
                <p className="mb-2 text-xs text-gray-400">
                  Actualizado: <RelativeTime date={company.enrichedAt} />
                </p>
              )}
              <pre className="max-h-60 overflow-auto rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
                {JSON.stringify(company.enrichmentData, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Right column: Contacts & Deals */}
        <div className="space-y-6 lg:col-span-2">
          {/* Contacts */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Users className="h-4 w-4 text-gray-400" />
                Contactos
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                  {company.contacts?.length ?? 0}
                </span>
              </h2>
            </div>
            {company.contacts?.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {company.contacts.map((contact: any) => (
                  <Link
                    key={contact.id}
                    href={`/admin/contacts/${contact.id}`}
                    className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                      {getInitials(
                        `${contact.firstName} ${contact.lastName ?? ""}`
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {contact.firstName} {contact.lastName}
                      </p>
                      {contact.email && (
                        <p className="truncate text-xs text-gray-500">
                          {contact.email}
                        </p>
                      )}
                    </div>
                    {contact.position && (
                      <span className="text-xs text-gray-400">
                        {contact.position}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="px-5 py-8 text-center text-sm text-gray-400">
                No hay contactos asociados
              </div>
            )}
          </div>

          {/* Deals */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Building2 className="h-4 w-4 text-gray-400" />
                Negocios
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                  {company.deals?.length ?? 0}
                </span>
              </h2>
              <Link
                href="/admin/deals/new"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                + Nuevo
              </Link>
            </div>
            {company.deals?.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {company.deals.map((deal: any) => (
                  <Link
                    key={deal.id}
                    href={`/admin/deals/${deal.id}`}
                    className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-gray-50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {deal.title}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2">
                        {deal.stage && (
                          <Badge
                            label={deal.stage.name}
                            color={deal.stage.color || "gray"}
                          />
                        )}
                        {deal.contact && (
                          <span className="text-xs text-gray-400">
                            {deal.contact.firstName} {deal.contact.lastName}
                          </span>
                        )}
                      </div>
                    </div>
                    {deal.value != null && (
                      <span className="ml-4 text-sm font-semibold tabular-nums text-gray-900">
                        <MoneyDisplay
                          amount={Number(deal.value)}
                          currency={deal.currency}
                        />
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="px-5 py-8 text-center text-sm text-gray-400">
                No hay negocios asociados
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
