// @ts-nocheck
import { getCompanies } from "@/lib/growth-os/actions/companies";
import { ContactForm } from "@/components/growth-os/contacts/ContactForm";

export default async function NewContactPage() {
  let companies: { id: string; name: string }[] = [];

  try {
    const result = await getCompanies({ pageSize: 200 });
    companies = result.data.map((c) => ({ id: c.id, name: c.name }));
  } catch {
    // Companies will remain empty
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Nuevo contacto
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Agrega un nuevo contacto a tu CRM
        </p>
      </div>

      <ContactForm companies={companies} />
    </div>
  );
}