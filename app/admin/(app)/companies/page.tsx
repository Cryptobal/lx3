// @ts-nocheck
import Link from "next/link";
import { Building2, Plus, Search } from "lucide-react";
import { getCompanies } from "@/lib/growth-os/actions/companies";
import { EmptyState } from "@/components/growth-os/shared/EmptyState";
import { Pagination } from "@/components/growth-os/shared/Pagination";

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const search = params.search ?? "";
  const page = parseInt(params.page ?? "1", 10);

  const pageSize = 20;
  let rawResult: { data: any[]; total: number } = { data: [], total: 0 };
  try {
    rawResult = await getCompanies({ search: search || undefined, page, pageSize });
  } catch {
    // Data will remain at defaults
  }

  const companies = rawResult.data;
  const total = rawResult.total;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Empresas
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            {total} empresa{total !== 1 ? "s" : ""} registrada{total !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/companies/new"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
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
          className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
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
        <div className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-800/50">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Dominio
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Industria
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Tamano
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Contactos
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Deals
                </th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr
                  key={company.id}
                  className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/companies/${company.id}`}
                      className="flex items-center gap-3 group"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800 text-zinc-400 text-xs font-bold uppercase shrink-0">
                        {company.name.slice(0, 2)}
                      </div>
                      <span className="font-medium text-zinc-100 group-hover:underline">
                        {company.name}
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">
                    {company.domain ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-400">
                    {company.industry ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-400">
                    {company.size ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-400">
                    {company._count.contacts}
                  </td>
                  <td className="px-4 py-3 text-zinc-400">
                    {company._count.deals}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={pageSize}
        basePath="/admin/companies"
        extraParams={search ? { search } : {}}
        itemLabel="empresas"
      />
    </div>
  );
}