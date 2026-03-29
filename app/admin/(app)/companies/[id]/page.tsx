// @ts-nocheck
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Globe,
  Phone,
  Linkedin,
  Tag,
  MapPin,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { getCompany } from "@/lib/growth-os/actions/companies";
import { Badge } from "@/components/growth-os/shared/Badge";
import { formatDate, formatMoney, formatRelativeTime } from "@/lib/growth-os/utils/format";

interface CompanyDetailPageProps {
  params: Promise<{ id: string }>;
}

const STAGE_VARIANT_MAP: Record<string, "default" | "success" | "warning" | "danger" | "info" | "purple"> = {
  green: "success",
  emerald: "success",
  blue: "info",
  yellow: "warning",
  amber: "warning",
  red: "danger",
  purple: "purple",
};

function stageVariant(color: string | null): "default" | "success" | "warning" | "danger" | "info" | "purple" {
  if (!color) return "default";
  const lower = color.toLowerCase();
  for (const [key, variant] of Object.entries(STAGE_VARIANT_MAP)) {
    if (lower.includes(key)) return variant;
  }
  return "default";
}

export default async function CompanyDetailPage({ params }: CompanyDetailPageProps) {
  const { id } = await params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let company: any;

  try {
    const result = await getCompany(id);
    if (!result.success) notFound();
    company = result.data;
  } catch {
    notFound();
  }

  const initials = company.name.slice(0, 2).toUpperCase();
  const location = [company.city, company.country].filter(Boolean).join(", ");

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/admin/companies"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a empresas
      </Link>

      {/* Company header */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-6">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-lg font-bold uppercase shrink-0">
            {company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={company.name}
                className="w-14 h-14 rounded-xl object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {company.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {company.domain && (
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" />
                  {company.domain}
                </span>
              )}
              {company.industry && (
                <Badge variant="info">{company.industry}</Badge>
              )}
              {company.size && (
                <Badge variant="default">{company.size}</Badge>
              )}
              {location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {location}
                </span>
              )}
            </div>
          </div>
          <div className="text-xs text-zinc-400 dark:text-zinc-500 shrink-0">
            Creada {formatRelativeTime(company.createdAt)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
              Informacion
            </h2>

            {company.website && (
              <div className="flex items-start gap-2 text-sm">
                <Globe className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 break-all"
                >
                  {company.website}
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
            )}

            {company.phone && (
              <div className="flex items-start gap-2 text-sm">
                <Phone className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                <span className="text-zinc-700 dark:text-zinc-300">{company.phone}</span>
              </div>
            )}

            {company.linkedinUrl && (
              <div className="flex items-start gap-2 text-sm">
                <Linkedin className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                <a
                  href={company.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 break-all"
                >
                  LinkedIn
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
            )}

            {company.description && (
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {company.description}
                </p>
              </div>
            )}

            {company.tags && company.tags.length > 0 && (
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-1.5 mb-2">
                  <Tag className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase">
                    Tags
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {company.tags.map((tag: string) => (
                    <Badge key={tag} variant="default" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Enrichment */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                Enriquecimiento
              </h2>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            {company.enrichedAt ? (
              <div className="space-y-2">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Enriquecido {formatRelativeTime(company.enrichedAt)}
                </p>
                {company.enrichmentData && (
                  <pre className="text-xs bg-zinc-50 dark:bg-zinc-800 p-3 rounded-lg overflow-auto max-h-48 text-zinc-600 dark:text-zinc-400">
                    {JSON.stringify(company.enrichmentData, null, 2)}
                  </pre>
                )}
              </div>
            ) : (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Esta empresa aun no ha sido enriquecida.
              </p>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contacts */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800">
            <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Contactos ({company.contacts.length})
              </h2>
            </div>
            {company.contacts.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                No hay contactos asociados a esta empresa.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-700">
                      <th className="px-5 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-5 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-5 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Cargo
                      </th>
                      <th className="px-5 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Telefono
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {company.contacts.map((contact: any) => (
                      <tr
                        key={contact.id}
                        className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                      >
                        <td className="px-5 py-3">
                          <Link
                            href={`/admin/contacts/${contact.id}`}
                            className="font-medium text-zinc-900 dark:text-zinc-100 hover:underline"
                          >
                            {contact.firstName} {contact.lastName ?? ""}
                          </Link>
                        </td>
                        <td className="px-5 py-3 text-zinc-600 dark:text-zinc-400">
                          {contact.email ?? "---"}
                        </td>
                        <td className="px-5 py-3 text-zinc-600 dark:text-zinc-400">
                          {contact.position ?? "---"}
                        </td>
                        <td className="px-5 py-3 text-zinc-600 dark:text-zinc-400">
                          {contact.phone ?? "---"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Deals */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800">
            <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Deals ({company.deals.length})
              </h2>
            </div>
            {company.deals.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                No hay deals asociados a esta empresa.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-700">
                      <th className="px-5 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Titulo
                      </th>
                      <th className="px-5 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Etapa
                      </th>
                      <th className="px-5 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Valor
                      </th>
                      <th className="px-5 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Probabilidad
                      </th>
                      <th className="px-5 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Creado
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {company.deals.map((deal: any) => (
                      <tr
                        key={deal.id}
                        className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                      >
                        <td className="px-5 py-3">
                          <Link
                            href={`/admin/deals/${deal.id}`}
                            className="font-medium text-zinc-900 dark:text-zinc-100 hover:underline"
                          >
                            {deal.title}
                          </Link>
                        </td>
                        <td className="px-5 py-3">
                          <Badge variant={stageVariant(deal.stage.color)}>
                            {deal.stage.name}
                          </Badge>
                        </td>
                        <td className="px-5 py-3 text-zinc-600 dark:text-zinc-400">
                          {deal.value
                            ? formatMoney(deal.value, deal.currency)
                            : "---"}
                        </td>
                        <td className="px-5 py-3 text-zinc-600 dark:text-zinc-400">
                          {deal.probability != null ? `${deal.probability}%` : "---"}
                        </td>
                        <td className="px-5 py-3 text-zinc-600 dark:text-zinc-400">
                          {formatDate(deal.createdAt)}
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