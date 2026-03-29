"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  createDeal,
  getPipelineStages,
  getCompaniesForSelect,
  getContactsForSelect,
} from "@/lib/growth-os/actions/deals";
import { toast } from "sonner";

interface Stage {
  id: string;
  name: string;
  order: number;
  isDefault: boolean;
}
interface Company {
  id: string;
  name: string;
}
interface Contact {
  id: string;
  firstName: string;
  lastName?: string;
  email?: string;
}

export default function NewDealPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [stages, setStages] = useState<Stage[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getPipelineStages(),
      getCompaniesForSelect(),
      getContactsForSelect(),
    ]).then(([s, co, ct]) => {
      setStages(s);
      setCompanies(co);
      setContacts(ct);
      setLoading(false);
    });
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    startTransition(async () => {
      const valueStr = form.get("value") as string;
      const probabilityStr = form.get("probability") as string;

      const result = await createDeal({
        title: form.get("title") as string,
        value: valueStr ? Number(valueStr) : undefined,
        currency: (form.get("currency") as string) || "CLP",
        probability: probabilityStr ? Number(probabilityStr) : undefined,
        stageId: form.get("stageId") as string,
        contactId: (form.get("contactId") as string) || undefined,
        companyId: (form.get("companyId") as string) || undefined,
        expectedClose: (form.get("expectedClose") as string) || undefined,
        notes: (form.get("notes") as string) || undefined,
      });

      if (result.success) {
        toast.success("Negocio creado exitosamente");
        router.push("/admin/deals");
      } else {
        toast.error(result.error);
      }
    });
  }

  const defaultStageId = stages.find((s) => s.isDefault)?.id ?? stages[0]?.id;

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/admin/deals"
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al pipeline
      </Link>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-xl font-bold text-gray-900">
          Nuevo negocio
        </h1>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Titulo *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Nombre del negocio"
              />
            </div>

            {/* Value & Currency */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label
                  htmlFor="value"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Valor
                </label>
                <input
                  id="value"
                  name="value"
                  type="number"
                  min="0"
                  step="any"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label
                  htmlFor="currency"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Moneda
                </label>
                <select
                  id="currency"
                  name="currency"
                  defaultValue="CLP"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="CLP">CLP</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>

            {/* Probability & Stage */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="probability"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Probabilidad (%)
                </label>
                <input
                  id="probability"
                  name="probability"
                  type="number"
                  min="0"
                  max="100"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="50"
                />
              </div>
              <div>
                <label
                  htmlFor="stageId"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Etapa *
                </label>
                <select
                  id="stageId"
                  name="stageId"
                  required
                  defaultValue={defaultStageId}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {stages.map((stage) => (
                    <option key={stage.id} value={stage.id}>
                      {stage.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Contact & Company */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="contactId"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Contacto
                </label>
                <select
                  id="contactId"
                  name="contactId"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Sin contacto</option>
                  {contacts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.firstName} {c.lastName ?? ""}{" "}
                      {c.email ? `(${c.email})` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="companyId"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Empresa
                </label>
                <select
                  id="companyId"
                  name="companyId"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Sin empresa</option>
                  {companies.map((co) => (
                    <option key={co.id} value={co.id}>
                      {co.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Expected close */}
            <div>
              <label
                htmlFor="expectedClose"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Fecha de cierre esperada
              </label>
              <input
                id="expectedClose"
                name="expectedClose"
                type="date"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Notes */}
            <div>
              <label
                htmlFor="notes"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Notas
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Notas adicionales..."
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-5">
              <Link
                href="/admin/deals"
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
              >
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Crear negocio
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
