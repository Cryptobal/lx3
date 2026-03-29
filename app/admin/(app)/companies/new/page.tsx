// @ts-nocheck
import { CompanyForm } from "@/components/growth-os/companies/CompanyForm";

export default function NewCompanyPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Nueva empresa
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Agrega una nueva empresa a tu CRM
        </p>
      </div>

      <CompanyForm />
    </div>
  );
}