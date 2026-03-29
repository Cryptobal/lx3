import Link from "next/link";
import { Plus } from "lucide-react";
import { getContacts } from "@/lib/growth-os/actions/contacts";
import { PageHeader } from "@/components/growth-os/shared/PageHeader";
import { ContactsTable } from "@/components/growth-os/contacts/ContactsTable";

interface Props {
  searchParams: Promise<{
    search?: string;
    source?: string;
    page?: string;
  }>;
}

export default async function ContactsPage({ searchParams }: Props) {
  const params = await searchParams;
  const search = params.search ?? "";
  const source = params.source ?? "";
  const page = Number(params.page) || 1;
  const pageSize = 20;

  const { data: contacts, total } = await getContacts({
    search: search || undefined,
    source: source || undefined,
    page,
    pageSize,
  });

  return (
    <div>
      <PageHeader
        title="Contactos"
        description={`${total} contacto${total !== 1 ? "s" : ""} registrado${total !== 1 ? "s" : ""}`}
        actions={
          <Link
            href="/admin/contacts/new"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Nuevo contacto
          </Link>
        }
      />
      <ContactsTable
        contacts={contacts}
        total={total}
        page={page}
        pageSize={pageSize}
        search={search}
        source={source}
      />
    </div>
  );
}
