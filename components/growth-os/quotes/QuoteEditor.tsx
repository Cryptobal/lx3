"use client";

import { useState, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save, Send } from "lucide-react";
import { createQuote, updateQuote } from "@/lib/growth-os/actions/quotes";
import { toast } from "sonner";
import {
  inputClass,
  labelClass,
  cardClass,
  cancelBtnClass,
  submitBtnClass,
} from "@/lib/utils/form-styles";

interface QuoteItem {
  id?: string;
  description: string;
  details: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Deal {
  id: string;
  title: string;
}

interface QuoteData {
  id?: string;
  title: string;
  description: string;
  contactId: string;
  dealId: string;
  items: QuoteItem[];
  taxRate: number;
  validUntil: string;
  notes: string;
  terms: string;
  currency: string;
}

interface QuoteEditorProps {
  initialData?: QuoteData;
  contacts: Contact[];
  deals: Deal[];
}

const DEFAULT_TERMS = `1. Esta cotizacion tiene validez por 30 dias a partir de la fecha de emision.
2. Los precios estan expresados en pesos chilenos (CLP) e incluyen IVA donde corresponda.
3. El plazo de entrega sera acordado una vez aceptada la cotizacion.
4. Forma de pago: 50% al inicio del proyecto, 50% contra entrega.
5. Cualquier trabajo adicional fuera del alcance sera cotizado por separado.`;

function emptyItem(): QuoteItem {
  return { description: "", details: "", quantity: 1, unitPrice: 0, total: 0 };
}

const cellInputClass =
  "w-full rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none";

export function QuoteEditor({ initialData, contacts, deals }: QuoteEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [contactId, setContactId] = useState(initialData?.contactId ?? "");
  const [dealId, setDealId] = useState(initialData?.dealId ?? "");
  const [items, setItems] = useState<QuoteItem[]>(
    initialData?.items?.length ? initialData.items : [emptyItem()]
  );
  const [taxRate, setTaxRate] = useState(initialData?.taxRate ?? 19);
  const [validUntil, setValidUntil] = useState(initialData?.validUntil ?? "");
  const [notes, setNotes] = useState(initialData?.notes ?? "");
  const [terms, setTerms] = useState(initialData?.terms ?? DEFAULT_TERMS);

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = Math.round(subtotal * (taxRate / 100));
  const total = subtotal + taxAmount;

  const updateItem = useCallback((index: number, field: keyof QuoteItem, value: string | number) => {
    setItems((prev) => {
      const updated = [...prev];
      const item = { ...updated[index], [field]: value };
      if (field === "quantity" || field === "unitPrice") {
        item.total = Math.round(item.quantity * item.unitPrice);
      }
      updated[index] = item;
      return updated;
    });
  }, []);

  const addItem = useCallback(() => {
    setItems((prev) => [...prev, emptyItem()]);
  }, []);

  const removeItem = useCallback((index: number) => {
    setItems((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const handleSubmit = useCallback(
    (sendAfterSave: boolean) => {
      if (!title.trim()) {
        toast.error("El titulo es obligatorio");
        return;
      }
      if (items.every((item) => !item.description.trim())) {
        toast.error("Agrega al menos un item con descripcion");
        return;
      }

      startTransition(async () => {
        const payload = {
          title: title.trim(),
          description: description.trim() || undefined,
          contactId: contactId || undefined,
          dealId: dealId || undefined,
          subtotal,
          taxRate,
          taxAmount,
          total,
          currency: "CLP",
          validUntil: validUntil || undefined,
          notes: notes.trim() || undefined,
          terms: terms.trim() || undefined,
          items: items
            .filter((item) => item.description.trim())
            .map((item, idx) => ({
              description: item.description,
              details: item.details || undefined,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              total: item.total,
              order: idx,
            })),
        };

        let result;
        if (initialData?.id) {
          result = await updateQuote(initialData.id, {
            ...payload,
            status: sendAfterSave ? "SENT" : undefined,
          });
        } else {
          result = await createQuote(payload);
          if (result.success && sendAfterSave) {
            const created = result.data as { id: string };
            await updateQuote(created.id, { status: "SENT" });
          }
        }

        if (result.success) {
          toast.success(
            sendAfterSave ? "Cotizacion guardada y enviada" : "Cotizacion guardada"
          );
          router.push("/admin/quotes");
        } else {
          toast.error(result.error);
        }
      });
    },
    [title, description, contactId, dealId, items, subtotal, taxRate, taxAmount, total, validUntil, notes, terms, initialData, router]
  );

  const formatNumber = (n: number) =>
    new Intl.NumberFormat("es-CL").format(n);

  return (
    <div className="space-y-6">
      {/* Basic info */}
      <div className={cardClass}>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Informacion general
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass}>Titulo *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Desarrollo plataforma web"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Contacto</label>
            <select
              value={contactId}
              onChange={(e) => setContactId(e.target.value)}
              className={inputClass}
            >
              <option value="">Seleccionar contacto...</option>
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.firstName} {c.lastName} — {c.email}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Deal (opcional)</label>
            <select
              value={dealId}
              onChange={(e) => setDealId(e.target.value)}
              className={inputClass}
            >
              <option value="">Sin deal asociado</option>
              {deals.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Descripcion</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Descripcion general de la cotizacion..."
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Items */}
      <div className={cardClass}>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Items
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
                <th className="pb-2 text-left text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400">
                  Descripcion
                </th>
                <th className="pb-2 text-left text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400">
                  Detalle
                </th>
                <th className="pb-2 text-right text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400 w-24">
                  Cant.
                </th>
                <th className="pb-2 text-right text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400 w-36">
                  Precio Unit.
                </th>
                <th className="pb-2 text-right text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400 w-36">
                  Total
                </th>
                <th className="pb-2 w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {items.map((item, idx) => (
                <tr key={idx} className="group">
                  <td className="py-2 pr-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(idx, "description", e.target.value)}
                      placeholder="Descripcion del item"
                      className={cellInputClass}
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <input
                      type="text"
                      value={item.details}
                      onChange={(e) => updateItem(idx, "details", e.target.value)}
                      placeholder="Detalles opcionales"
                      className={cellInputClass}
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(idx, "quantity", Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className={`${cellInputClass} text-right`}
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <input
                      type="number"
                      min={0}
                      value={item.unitPrice}
                      onChange={(e) =>
                        updateItem(idx, "unitPrice", Math.max(0, parseInt(e.target.value) || 0))
                      }
                      className={`${cellInputClass} text-right`}
                    />
                  </td>
                  <td className="py-2 pr-2 text-right text-sm font-medium text-zinc-900 dark:text-zinc-100 tabular-nums">
                    ${formatNumber(item.total)}
                  </td>
                  <td className="py-2">
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      disabled={items.length <= 1}
                      className="rounded p-1 text-zinc-400 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
                      title="Eliminar item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-600 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400 transition-colors hover:border-blue-400 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400"
        >
          <Plus className="h-4 w-4" />
          Agregar item
        </button>

        {/* Totals */}
        <div className="mt-6 flex justify-end">
          <div className="w-72 space-y-2">
            <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
              <span>Subtotal</span>
              <span className="tabular-nums">${formatNumber(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400">
              <span className="flex items-center gap-2">
                IVA
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={taxRate}
                  onChange={(e) => setTaxRate(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-16 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2 py-0.5 text-right text-sm text-zinc-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none"
                />
                %
              </span>
              <span className="tabular-nums">${formatNumber(taxAmount)}</span>
            </div>
            <div className="border-t border-zinc-200 dark:border-zinc-700 pt-2">
              <div className="flex justify-between text-lg font-bold text-zinc-900 dark:text-zinc-100">
                <span>Total</span>
                <span className="tabular-nums">${formatNumber(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Extra fields */}
      <div className={cardClass}>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Detalles adicionales
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Valida hasta</label>
            <input
              type="date"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              className={inputClass}
            />
          </div>
          <div />
          <div className="sm:col-span-2">
            <label className={labelClass}>Notas</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Notas internas o para el cliente..."
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Terminos y condiciones</label>
            <textarea
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              rows={6}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/admin/quotes")}
          className={cancelBtnClass}
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={() => handleSubmit(false)}
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isPending ? "Guardando..." : "Guardar borrador"}
        </button>
        <button
          type="button"
          onClick={() => handleSubmit(true)}
          disabled={isPending}
          className={submitBtnClass}
        >
          <Send className="h-4 w-4" />
          {isPending ? "Enviando..." : "Guardar y enviar"}
        </button>
      </div>
    </div>
  );
}
