import { getCompanies } from "@/lib/growth-os/actions/companies";
import { PageHeader } from "@/components/growth-os/shared/PageHeader";
import { ContactForm } from "@/components/growth-os/contacts/ContactForm";

export default async function NewContactPage() {
  const { data: companies } = await getCompanies({ pageSize: 200 });

  return (
    <div>
      <PageHeader
        title="Nuevo Contacto"
        description="Agrega un nuevo contacto al CRM"
      />
      <div className="mx-auto max-w-2xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <ContactForm
          companies={companies.map((c: { id: string; name: string }) => ({
            id: c.id,
            name: c.name,
          }))}
        />
      </div>
    </div>
  );
}
