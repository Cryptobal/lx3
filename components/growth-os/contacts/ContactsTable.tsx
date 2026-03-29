"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, Filter } from "lucide-react";
import { Badge } from "@/components/growth-os/shared/Badge";
import { RelativeTime } from "@/components/growth-os/shared/RelativeTime";
import { getSourceLabel } from "@/lib/growth-os/utils/format";

interface Contact {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string | null;
  position: string | null;
  source: string;
  tags: string[];
  createdAt: string;
  company: { id: string; name: string } | null;
}

interface ContactsTableProps {
  contacts: Contact[];
  total: number;
  page: number;
  pageSize: number;
  search: string;
  source: string;
}

const SOURCES = [
  { value: "", label: "Todas las fuentes" },
  { value: "MANUAL", label: "Manual" },
  { value: "WEBSITE_FORM", label: "Formulario web" },
  { value: "COTIZADOR", label: "Cotizador" },
  { value: "CHATBOT", label: "Chatbot" },
  { value: "APOLLO", label: "Apollo" },
  { value: "IMPORT", label: "Importado" },
  { value: "REFERRAL", label: "Referido" },
];

const SOURCE_COLORS: Record<string, "blue" | "green" | "yellow" | "red" | "gray"> = {
  MANUAL: "gray",
  WEBSITE_FORM: "blue",
  COTIZADOR: "green",
  CHATBOT: "blue",
  APOLLO: "yellow",
  IMPORT: "gray",
  REFERRAL: "green",
};

export function ContactsTable({
  contacts,
  total,
  page,
  pageSize,
  search: initialSearch,
  source: initialSource,
}: ContactsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(initialSearch);

  const totalPages = Math.ceil(total / pageSize);

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    // Reset to page 1 on filter change
    if (!updates.page) params.delete("page");
    startTransition(() => {
      router.push(`/admin/contacts?${params.toString()}`);
    });
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateParams({ search });
  }

  return (
    <div>
      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o empresa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </form>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <select
            value={initialSource}
            onChange={(e) => updateParams({ source: e.target.value })}
            className="appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-8 text-sm text-gray-700 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {SOURCES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div
        className={`overflow-hidden rounded-lg border border-gray-200 bg-white transition-opacity ${
          isPending ? "opacity-60" : ""
        }`}
      >
        {contacts.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-gray-500">
              No se encontraron contactos
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Nombre
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Empresa
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Cargo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Fuente
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Tags
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {contacts.map((contact) => (
                  <tr
                    key={contact.id}
                    onClick={() =>
                      router.push(`/admin/contacts/${contact.id}`)
                    }
                    className="cursor-pointer transition-colors hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                      {contact.firstName} {contact.lastName ?? ""}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      {contact.email ?? "-"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      {contact.company?.name ?? "-"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      {contact.position ?? "-"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <Badge
                        label={getSourceLabel(contact.source)}
                        color={SOURCE_COLORS[contact.source] ?? "gray"}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {contact.tags.length > 0
                          ? contact.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} label={tag} color="blue" size="sm" />
                            ))
                          : "-"}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs">
                      <RelativeTime date={contact.createdAt} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {total} contacto{total !== 1 ? "s" : ""} en total
          </p>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => updateParams({ page: String(p) })}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  p === page
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
