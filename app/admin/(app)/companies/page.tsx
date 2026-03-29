import Link from "next/link";
import { redirect } from "next/navigation";
import { Building2, Plus, Search } from "lucide-react";
import { getCompanies } from "@/lib/growth-os/actions/companies";
import { EmptyState } from "@/components/growth-os/shared/EmptyState";

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const search = params.search ?? "";
  const page = parseInt(params.page ?? "1", 10);

  let result;
  try {
    result = await getCompanies({ search: search || undefined, page, pageSize: 20 });
  } catch {
    result = { data: [], total: 0, page: 1, pageSize: 20, totalPages: 0 };
  }

  const { data: companies, total, totalPages } = result;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Empresas
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {total} empresa{total !== 1 ? "s" : ""} registrada{total !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/companies/new"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva empresa
        </Link>
      </div>

      {/* Search */}
      <form className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          name="search"
          defaultValue={search}
          placeholder="Buscar por nombre o dominio..."
          className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10"
        />
      </form>

      {/* Table */}
      {companies.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="Sin empresas"
          description={
            search
              ? "No se encontraron empresas con esa busqueda."
              : "Agrega tu primera empresa para comenzar."
          }
          action={
            search
              ? undefined
              : { label: "Nueva empresa", href: "/admin/companies/new" }
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Dominio
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Industria
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Tamano
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Contactos
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Deals
                </th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr
                  key={company.id}
                  className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/companies/${company.id}`}
                      className="flex items-center gap-3 group"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase shrink-0">
                        {company.name.slice(0, 2)}
                      </div>
                      <span className="font-medium text-zinc-900 dark:text-zinc-100 group-hover:underline">
                        {company.name}
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {company.domain ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {company.industry ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {company.size ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {company._count.contacts}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {company._count.deals}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Pagina {page} de {totalPages}
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/admin/companies?page=${page - 1}${search ? `&search=${search}` : ""}`}
                className="px-3 py-1.5 text-sm rounded-md border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Anterior
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/admin/companies?page=${page + 1}${search ? `&search=${search}` : ""}`}
                className="px-3 py-1.5 text-sm rounded-md border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Siguiente
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
