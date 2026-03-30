"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { createDeal, updateDeal } from "@/lib/growth-os/actions/deals";
import { Combobox } from "@/components/growth-os/shared/Combobox";
import {
  inputClass,
  labelClass,
  cardClass,
  cancelBtnClass,
  submitBtnClass,
} from "@/lib/utils/form-styles";

interface DealFormProps {
  stages: { id: string; name: string }[];
  contacts: { id: string; name: string }[];
  companies: { id: string; name: string }[];
  users: { id: string; name: string }[];
  initialData?: {
    id: string;
    title: string;
    value: string;
    currency: string;
    probability: string;
    expectedClose: string;
    stageId: string;
    contactId: string;
    companyId: string;
    assignedToId: string;
    notes: string;
  };
}

export function DealForm({ stages, contacts, companies, users, initialData }: DealFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const isEdit = !!initialData;

  const [form, setForm] = useState({
    title: initialData?.title ?? "",
    value: initialData?.value ?? "",
    currency: initialData?.currency ?? "CLP",
    probability: initialData?.probability ?? "",
    expectedClose: initialData?.expectedClose ?? "",
    stageId: initialData?.stageId ?? stages[0]?.id ?? "",
    contactId: initialData?.contactId ?? "",
    companyId: initialData?.companyId ?? "",
    assignedToId: initialData?.assignedToId ?? "",
    notes: initialData?.notes ?? "",
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

      const payload = {
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
      };

      if (isEdit) {
        await updateDeal(initialData.id, payload);
        toast.success("Deal actualizado exitosamente");
      } else {
        await createDeal(payload);
        toast.success("Deal creado exitosamente");
      }
      router.push("/admin/deals");
    } catch {
      toast.error(isEdit ? "Error al actualizar el deal" : "Error al crear el deal");
    } finally {
      setSubmitting(false);
    }
  };

  const contactOptions = contacts.map((c) => ({ value: c.id, label: c.name }));
  const companyOptions = companies.map((c) => ({ value: c.id, label: c.name }));
  const userOptions = users.map((u) => ({ value: u.id, label: u.name }));

  return (
    <div>
      <Link
        href="/admin/deals"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al pipeline
      </Link>

      <form onSubmit={handleSubmit} className={cardClass}>
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
            <label className={labelClass}>Contacto</label>
            <Combobox
              options={contactOptions}
              value={form.contactId}
              onChange={(val) => setForm((prev) => ({ ...prev, contactId: val }))}
              placeholder="Buscar contacto..."
              emptyLabel="Sin contacto"
            />
          </div>
          <div>
            <label className={labelClass}>Empresa</label>
            <Combobox
              options={companyOptions}
              value={form.companyId}
              onChange={(val) => setForm((prev) => ({ ...prev, companyId: val }))}
              placeholder="Buscar empresa..."
              emptyLabel="Sin empresa"
            />
          </div>
        </div>

        {/* Assigned to */}
        <div>
          <label className={labelClass}>Asignado a</label>
          <Combobox
            options={userOptions}
            value={form.assignedToId}
            onChange={(val) => setForm((prev) => ({ ...prev, assignedToId: val }))}
            placeholder="Buscar usuario..."
            emptyLabel="Sin asignar"
          />
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
          <Link href="/admin/deals" className={cancelBtnClass}>
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className={submitBtnClass}
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitting
              ? isEdit ? "Actualizando..." : "Creando..."
              : isEdit ? "Guardar cambios" : "Crear deal"}
          </button>
        </div>
      </form>
    </div>
  );
}
