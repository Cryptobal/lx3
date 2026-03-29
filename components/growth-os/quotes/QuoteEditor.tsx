"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { createQuote } from "@/lib/growth-os/actions/quotes";
import { formatMoney } from "@/lib/growth-os/utils/format";
import {
  QuoteItemsTable,
  makeItemId,
  type QuoteItemRow,
} from "@/components/growth-os/quotes/QuoteItemsTable";

interface QuoteEditorProps {
  contacts: { id: string; name: string }[];
  deals: { id: string; title: string }[];
  initialData?: {
    title: string;
    description: string;
    contactId: string;
    dealId: string;
    currency: string;
    taxRate: number;
    validUntil: string;
    notes: string;
    terms: string;
    items: QuoteItemRow[];
  };
}

export function QuoteEditor({ contacts, deals, initialData }: QuoteEditorProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [contactSearch, setContactSearch] = useState("");

  const [form, setForm] = useState({
    title: initialData?.title ?? "",
    description: initialData?.description ?? "",
    contactId: initialData?.contactId ?? "",
    dealId: initialData?.dealId ?? "",
    currency: initialData?.currency ?? "CLP",
    taxRate: initialData?.taxRate ?? 19,
    validUntil: initialData?.validUntil ?? "",
    notes: initialData?.notes ?? "",
    terms:
      initialData?.terms ??
      "Cotización válida por 30 días desde la fecha de emisión.",
  });

  const [items, setItems] = useState<QuoteItemRow[]>(
    initialData?.items ?? [
      {
        id: makeItemId(),
        description: "",
        details: "",
        quantity: 1,
        unitPrice: 0,
      },
    ]
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "taxRate" ? parseFloat(value) || 0 : value,
    }));
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const taxAmount = subtotal * (form.taxRate / 100);
  const total = subtotal + taxAmount;

  const filteredContacts = contactSearch
    ? contacts.filter((c) =>
        c.name.toLowerCase().includes(contactSearch.toLowerCase())
      )
    : contacts;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("El título es requerido");
      return;
    }

    if (items.length === 0 || items.every((i) => !i.description.trim())) {
      toast.error("Agrega al menos un item con descripción");
      return;
    }

    setSubmitting(true);

    try {
      const validItems = items
        .filter((i) => i.description.trim())
        .map((item, index) => ({
          description: item.description.trim(),
          details: item.details.trim() || undefined,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          order: index,
        }));

      const quote = await createQuote({
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        contactId: form.contactId || undefined,
        dealId: form.dealId || undefined,
        currency: form.currency,
        taxRate: form.taxRate,
        validUntil: form.validUntil || undefined,
        notes: form.notes.trim() || undefined,
        terms: form.terms.trim() || undefined,
        items: validItems,
      });

      toast.success("Cotización creada exitosamente");
      router.push(`/admin/quotes/${quote.id}`);
    } catch {
      toast.error("Error al crear la cotización");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10";
  const labelClass =
    "block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Back button */}
      <Link
        href="/admin/quotes"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a cotizaciones
      </Link>

      {/* Basic info */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
          Información general
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="title" className={labelClass}>
              Título <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="Ej: Desarrollo de sitio web corporativo"
              className={inputClass}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className={labelClass}>
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Descripción general de la cotización..."
              rows={3}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="contactId" className={labelClass}>
              Cliente
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar contacto..."
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
                className={`${inputClass} ${form.contactId ? "hidden" : ""}`}
              />
              {form.contactId && (
                <div className="flex items-center justify-between px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900">
                  <span className="text-zinc-900 dark:text-zinc-100">
                    {contacts.find((c) => c.id === form.contactId)?.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({ ...prev, contactId: "" }));
                      setContactSearch("");
                    }}
                    className="text-zinc-400 hover:text-zinc-600 text-xs"
                  >
                    Cambiar
                  </button>
                </div>
              )}
              {!form.contactId && contactSearch && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredContacts.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-zinc-400">
                      Sin resultados
                    </div>
                  ) : (
                    filteredContacts.slice(0, 20).map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setForm((prev) => ({ ...prev, contactId: c.id }));
                          setContactSearch("");
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                      >
                        {c.name}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="dealId" className={labelClass}>
              Negocio (opcional)
            </label>
            <select
              id="dealId"
              name="dealId"
              value={form.dealId}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Sin negocio asociado</option>
              {deals.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title}
                </option>
              ))}
            </select>
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
              <option value="CLP">CLP - Peso chileno</option>
              <option value="USD">USD - Dólar estadounidense</option>
            </select>
          </div>

          <div>
            <label htmlFor="taxRate" className={labelClass}>
              Tasa de impuesto (%)
            </label>
            <input
              id="taxRate"
              name="taxRate"
              type="number"
              min={0}
              max={100}
              step="any"
              value={form.taxRate}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="validUntil" className={labelClass}>
              Válida hasta
            </label>
            <input
              id="validUntil"
              name="validUntil"
              type="date"
              value={form.validUntil}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
          Items
        </h2>

        <QuoteItemsTable
          items={items}
          onChange={setItems}
          currency={form.currency}
        />

        {/* Totals */}
        <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4 mt-4">
          <div className="flex flex-col items-end gap-1 text-sm">
            <div className="flex items-center gap-8">
              <span className="text-zinc-500 dark:text-zinc-400">Subtotal</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100 w-32 text-right">
                {formatMoney(subtotal, form.currency)}
              </span>
            </div>
            <div className="flex items-center gap-8">
              <span className="text-zinc-500 dark:text-zinc-400">
                IVA ({form.taxRate}%)
              </span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100 w-32 text-right">
                {formatMoney(taxAmount, form.currency)}
              </span>
            </div>
            <div className="flex items-center gap-8 pt-2 border-t border-zinc-200 dark:border-zinc-700">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                Total
              </span>
              <span className="font-bold text-lg text-zinc-900 dark:text-zinc-100 w-32 text-right">
                {formatMoney(total, form.currency)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes and terms */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
          Notas y condiciones
        </h2>

        <div>
          <label htmlFor="notes" className={labelClass}>
            Notas
          </label>
          <textarea
            id="notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Notas adicionales para el cliente..."
            rows={3}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="terms" className={labelClass}>
            Términos y condiciones
          </label>
          <textarea
            id="terms"
            name="terms"
            value={form.terms}
            onChange={handleChange}
            placeholder="Términos y condiciones de la cotización..."
            rows={3}
            className={inputClass}
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3">
        <Link
          href="/admin/quotes"
          className="px-4 py-2 text-sm font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
        >
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Crear cotización
        </button>
      </div>
    </form>
  );
}
