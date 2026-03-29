"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { Search, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { Badge } from "@/components/growth-os/shared/Badge";
import { EmptyState } from "@/components/growth-os/shared/EmptyState";
import type { ContactSource } from "@/lib/generated/prisma/client";

const SOURCE_LABELS: Record<string, string> = {
  MANUAL: "Manual",
  WEBSITE_FORM: "Formulario Web",
  COTIZADOR: "Cotizador",
  CHATBOT: "Chatbot",
  APOLLO: "Apollo",
  IMPORT: "Importado",
  REFERRAL: "Referido",
};

const SOURCE_VARIANTS: Record<string, "default" | "success" | "warning" | "danger" | "info" | "purple"> = {
  MANUAL: "default",
  WEBSITE_FORM: "info",
  COTIZADOR: "success",
  CHATBOT: "warning",
  APOLLO: "danger",
  IMPORT: "purple",
  REFERRAL: "success",
};

interface SerializedContact {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  position: string | null;
  source: ContactSource;
  avatarUrl: string | null;
  createdAt: string;
  companyName: string | null;
}

interface ContactsTableProps {
  contacts: SerializedContact[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  currentSearch: string;
  currentSource: string;
}

export function ContactsTable({
  contacts,
  total,
  page,
  pageSize,
  totalPages,
  currentSearch,
  currentSource,
}: ContactsTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState(currentSearch);

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams();
      const merged = {
        search: currentSearch,
        source: currentSource,
        page: String(page),
        ...updates,
      };
      Object.entries(merged).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
      // Reset page when search/source changes
      if (updates.search !== undefined || updates.source !== undefined) {
        params.delete("page");
      }
      router.push(`/admin/contacts?${params.toString()}`);
    },
    [router, currentSearch, currentSource, page]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("es-CL", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o telefono..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10"
            />
          </div>
        </form>
        <select
          value={currentSource}
          onChange={(e) => updateParams({ source: e.target.value })}
          className="px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10"
        >
          <option value="">Todas las fuentes</option>
          {Object.entries(SOURCE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden">
        {contacts.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No se encontraron contactos"
            description="Crea un nuevo contacto o ajusta los filtros de busqueda."
            action={{ label: "Nuevo contacto", href: "/admin/contacts/new" }}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-700">
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider hidden md:table-cell">
                      Empresa
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider hidden lg:table-cell">
                      Cargo
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Fuente
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider hidden sm:table-cell">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr
                      key={contact.id}
                      onClick={() => router.push(`/admin/contacts/${contact.id}`)}
                      className="border-b border-zinc-100 dark:border-zinc-800 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-medium text-zinc-600 dark:text-zinc-400">
                            {contact.firstName[0]}
                            {contact.lastName?.[0] ?? ""}
                          </div>
                          <span className="font-medium text-zinc-900 dark:text-zinc-100">
                            {contact.firstName} {contact.lastName ?? ""}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                        {contact.email ?? "\u2014"}
                      </td>
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 hidden md:table-cell">
                        {contact.companyName ?? "\u2014"}
                      </td>
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 hidden lg:table-cell">
                        {contact.position ?? "\u2014"}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={SOURCE_VARIANTS[contact.source] ?? "default"}>
                          {SOURCE_LABELS[contact.source] ?? contact.source}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400 hidden sm:table-cell">
                        {formatDate(contact.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-100 dark:border-zinc-800">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Mostrando {(page - 1) * pageSize + 1} a{" "}
                  {Math.min(page * pageSize, total)} de {total} contactos
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateParams({ page: String(page - 1) })}
                    disabled={page <= 1}
                    className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
                    )
                    .reduce<(number | "...")[]>((acc, p, i, arr) => {
                      if (i > 0 && p - (arr[i - 1] ?? 0) > 1) acc.push("...");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === "..." ? (
                        <span key={`ellipsis-${i}`} className="px-2 text-zinc-400 text-sm">
                          ...
                        </span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => updateParams({ page: String(p) })}
                          className={`px-2.5 py-1 text-sm rounded-md transition-colors ${
                            p === page
                              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                              : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}
                  <button
                    onClick={() => updateParams({ page: String(page + 1) })}
                    disabled={page >= totalPages}
                    className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
