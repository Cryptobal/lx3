"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { createDeal } from "@/lib/growth-os/actions/deals";

interface DealFormProps {
  stages: { id: string; name: string }[];
  contacts: { id: string; name: string }[];
  companies: { id: string; name: string }[];
  users: { id: string; name: string }[];
}

export function DealForm({ stages, contacts, companies, users }: DealFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    value: "",
    currency: "CLP",
    probability: "",
    expectedClose: "",
    stageId: stages[0]?.id ?? "",
    contactId: "",
    companyId: "",
    assignedToId: "",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("El titulo es requerido");
      return;
    }

    if (!form.stageId) {
      toast.error("La etapa es requerida");
      return;
    }

    setSubmitting(true);

    try {
      const value = form.value ? parseFloat(form.value) : undefined;
      const probability = form.probability
        ? parseInt(form.probability, 10)
        : undefined;

      await createDeal({
        title: form.title.trim(),
        value: value && !isNaN(value) ? value : undefined,
        currency: form.currency,
        probability:
          probability != null && !isNaN(probability)
            ? Math.min(100, Math.max(0, probability))
            : undefined,
        expectedClose: form.expectedClose || undefined,
        stageId: form.stageId,
        contactId: form.contactId || undefined,
        companyId: form.companyId || undefined,
        assignedToId: form.assignedToId || undefined,
        notes: form.notes.trim() || undefined,
      });

      toast.success("Deal creado exitosamente");
      router.push("/admin/deals");
    } catch {
      toast.error("Error al crear el deal");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10";

  const labelClass =
    "block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1";

  return (
    <div>
      <Link
        href="/admin/deals"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al pipeline
      </Link>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-6 space-y-5"
      >
        {/* Title */}
        <div>
          <label htmlFor="title" className={labelClass}>
            Titulo <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={form.title}
            onChange={handleChange}
            placeholder="Proyecto X para Empresa Y"
            className={inputClass}
          />
        </div>

        {/* Value & Currency */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label htmlFor="value" className={labelClass}>
              Valor
            </label>
            <input
              id="value"
              name="value"
              type="number"
              min="0"
              step="any"
              value={form.value}
              onChange={handleChange}
              placeholder="1000000"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="currency" className={labelClass}>
              Moneda
            </label>
            <select
              id="currency"
              name="currency"
              value={form.currency}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="CLP">CLP</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>

        {/* Probability & Expected close */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="probability" className={labelClass}>
              Probabilidad (0-100)
            </label>
            <input
              id="probability"
              name="probability"
              type="number"
              min="0"
              max="100"
              value={form.probability}
              onChange={handleChange}
              placeholder="50"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="expectedClose" className={labelClass}>
              Cierre esperado
            </label>
            <input
              id="expectedClose"
              name="expectedClose"
              type="date"
              value={form.expectedClose}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        {/* Stage */}
        <div>
          <label htmlFor="stageId" className={labelClass}>
            Etapa <span className="text-red-500">*</span>
          </label>
          <select
            id="stageId"
            name="stageId"
            required
            value={form.stageId}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Seleccionar etapa...</option>
            {stages.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.name}
              </option>
            ))}
          </select>
        </div>

        {/* Contact & Company */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contactId" className={labelClass}>
              Contacto
            </label>
            <select
              id="contactId"
              name="contactId"
              value={form.contactId}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Sin contacto</option>
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="companyId" className={labelClass}>
              Empresa
            </label>
            <select
              id="companyId"
              name="companyId"
              value={form.companyId}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Sin empresa</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Assigned to */}
        <div>
          <label htmlFor="assignedToId" className={labelClass}>
            Asignado a
          </label>
          <select
            id="assignedToId"
            name="assignedToId"
            value={form.assignedToId}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Sin asignar</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className={labelClass}>
            Notas
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            value={form.notes}
            onChange={handleChange}
            placeholder="Notas sobre el deal..."
            className={inputClass}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin/deals"
            className="px-4 py-2 text-sm font-medium rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitting ? "Creando..." : "Crear deal"}
          </button>
        </div>
      </form>
    </div>
  );
}
