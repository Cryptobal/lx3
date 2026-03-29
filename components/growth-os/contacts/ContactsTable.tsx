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
  phone?: string | null;
  position: string | null;
  source: string;
  avatarUrl?: string | null;
  tags?: string[];
  createdAt: string;
  company?: { id: string; name: string } | null;
  companyName?: string | null;
}

interface ContactsTableProps {
  contacts: Contact[];
  total: number;
  page: number;
  pageSize: number;
  totalPages?: number;
  search?: string;
  source?: string;
  currentSearch?: string;
  currentSource?: string;
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
  search: searchProp,
  source: sourceProp,
  currentSearch,
  currentSource,
}: ContactsTableProps) {
  const initialSearch = searchProp ?? currentSearch ?? "";
  const initialSource = sourceProp ?? currentSource ?? "";
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
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o empresa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 py-2 pl-9 pr-3 text-sm text-zinc-100 placeholder-zinc-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </form>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <select
            value={initialSource}
            onChange={(e) => updateParams({ source: e.target.value })}
            className="appearance-none rounded-lg border border-zinc-700 bg-zinc-900 py-2 pl-9 pr-8 text-sm text-zinc-100 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
        className={`overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 transition-opacity ${
          isPending ? "opacity-60" : ""
        }`}
      >
        {contacts.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-zinc-500">
              No se encontraron contactos
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-800">
              <thead className="bg-zinc-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                    Nombre
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                    Empresa
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                    Cargo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                    Fuente
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                    Tags
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {contacts.map((contact) => (
                  <tr
                    key={contact.id}
                    onClick={() =>
                      router.push(`/admin/contacts/${contact.id}`)
                    }
                    className="cursor-pointer transition-colors hover:bg-zinc-800/50"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-zinc-100">
                      {contact.firstName} {contact.lastName ?? ""}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-400">
                      {contact.email ?? "-"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-400">
                      {contact.companyName ?? contact.company?.name ?? "-"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-400">
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
                        {(contact.tags ?? []).length > 0
                          ? (contact.tags ?? []).slice(0, 3).map((tag: string) => (
                              <Badge key={tag} label={tag} color="blue" size="sm" />
                            ))
                          : "-"}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-zinc-500">
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
          <p className="text-sm text-zinc-500">
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
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
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
