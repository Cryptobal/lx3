// @ts-nocheck
import Link from "next/link";
import { Plus, Users, Search } from "lucide-react";
import { getContacts } from "@/lib/growth-os/actions/contacts";
import { ContactsTable } from "@/components/growth-os/contacts/ContactsTable";

interface ContactsPageProps {
  searchParams: Promise<{
    search?: string;
    source?: string;
    page?: string;
  }>;
}

export default async function ContactsPage({ searchParams }: ContactsPageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const source = params.source || "";
  const page = parseInt(params.page || "1", 10);

  let result = {
    data: [] as Awaited<ReturnType<typeof getContacts>>["data"],
    total: 0,
    page: 1,
    pageSize: 20,
    totalPages: 0,
  };

  try {
    result = await getContacts({
      search: search || undefined,
      source: source || undefined,
      page,
      pageSize: 20,
    });
  } catch {
    // Data will remain at defaults
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Contactos
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Gestiona tus contactos y prospectos
          </p>
        </div>
        <Link
          href="/admin/contacts/new"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo contacto
        </Link>
      </div>

      <ContactsTable
        contacts={result.data.map((c) => ({
          id: c.id,
          firstName: c.firstName,
          lastName: c.lastName,
          email: c.email,
          phone: c.phone,
          position: c.position,
          source: c.source,
          avatarUrl: c.avatarUrl,
          createdAt: c.createdAt.toISOString(),
          companyName: c.company?.name ?? null,
        }))}
        total={result.total}
        page={result.page}
        pageSize={result.pageSize}
        totalPages={result.totalPages}
        currentSearch={search}
        currentSource={source}
      />
    </div>
  );
}