import Link from "next/link";
import { Plus, Building2, Globe, Users } from "lucide-react";
import { getCompanies } from "@/lib/growth-os/actions/companies";
import { PageHeader } from "@/components/growth-os/shared/PageHeader";
import { Badge } from "@/components/growth-os/shared/Badge";
import { RelativeTime } from "@/components/growth-os/shared/RelativeTime";
import { CompaniesSearch } from "./companies-search";

interface Props {
  searchParams: Promise<{ search?: string; page?: string }>;
}

export default async function CompaniesPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const { data: companies, total } = await getCompanies({
    search: params.search,
    page,
    pageSize: 20,
  });
  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      <PageHeader
        title="Empresas"
        description={`${total} empresa${total !== 1 ? "s" : ""} registrada${total !== 1 ? "s" : ""}`}
        actions={
          <Link
            href="/admin/companies/new"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Nueva empresa
          </Link>
        }
      />

      <CompaniesSearch defaultSearch={params.search} />

      {companies.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <Building2 className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900">
            No hay empresas
          </h3>
          <p className="mt-1 max-w-sm text-sm text-gray-500">
            {params.search
              ? "No se encontraron resultados para tu busqueda."
              : "Comienza agregando tu primera empresa."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Nombre
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Dominio
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Industria
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Tamano
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Pais
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Contactos
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {companies.map((company: any) => (
                  <tr
                    key={company.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <Link
                        href={`/admin/companies/${company.id}`}
                        className="flex items-center gap-3"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700">
                          {company.name
                            .split(" ")
                            .slice(0, 2)
                            .map((w: string) => w[0]?.toUpperCase())
                            .join("")}
                        </div>
                        <span className="font-medium text-gray-900">
                          {company.name}
                        </span>
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                      {company.domain ? (
                        <span className="inline-flex items-center gap-1">
                          <Globe className="h-3.5 w-3.5" />
                          {company.domain}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      {company.industry ? (
                        <Badge label={company.industry} color="blue" />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      {company.size ?? "-"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      {company.country ?? "-"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      <span className="inline-flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 text-gray-400" />
                        {company._count?.contacts ?? 0}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <RelativeTime date={company.createdAt} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
              <p className="text-sm text-gray-500">
                Pagina {page} de {totalPages}
              </p>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link
                    href={`/admin/companies?page=${page - 1}${params.search ? `&search=${params.search}` : ""}`}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Anterior
                  </Link>
                )}
                {page < totalPages && (
                  <Link
                    href={`/admin/companies?page=${page + 1}${params.search ? `&search=${params.search}` : ""}`}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Siguiente
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
