"use client";

import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { formatMoney } from "@/lib/growth-os/utils/format";

export interface QuoteItemRow {
  id: string;
  description: string;
  details: string;
  quantity: number;
  unitPrice: number;
}

interface QuoteItemsTableProps {
  items: QuoteItemRow[];
  onChange: (items: QuoteItemRow[]) => void;
  currency: string;
}

let nextId = 0;
export function makeItemId() {
  return `new-${++nextId}-${Date.now()}`;
}

export function QuoteItemsTable({
  items,
  onChange,
  currency,
}: QuoteItemsTableProps) {
  const updateItem = (index: number, field: keyof QuoteItemRow, value: string | number) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const addItem = () => {
    onChange([
      ...items,
      {
        id: makeItemId(),
        description: "",
        details: "",
        quantity: 1,
        unitPrice: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const updated = [...items];
    [updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]];
    onChange(updated);
  };

  const inputClass =
    "w-full px-2 py-1.5 text-sm border border-zinc-200 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10";

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-700">
              <th className="text-left py-2 px-2 font-medium text-zinc-500 dark:text-zinc-400 w-8">
                #
              </th>
              <th className="text-left py-2 px-2 font-medium text-zinc-500 dark:text-zinc-400">
                Descripción
              </th>
              <th className="text-left py-2 px-2 font-medium text-zinc-500 dark:text-zinc-400 w-40">
                Detalles
              </th>
              <th className="text-right py-2 px-2 font-medium text-zinc-500 dark:text-zinc-400 w-24">
                Cantidad
              </th>
              <th className="text-right py-2 px-2 font-medium text-zinc-500 dark:text-zinc-400 w-32">
                Precio Unit.
              </th>
              <th className="text-right py-2 px-2 font-medium text-zinc-500 dark:text-zinc-400 w-32">
                Total
              </th>
              <th className="w-20" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {items.map((item, index) => {
              const lineTotal = item.quantity * item.unitPrice;
              return (
                <tr key={item.id}>
                  <td className="py-2 px-2 text-zinc-400">
                    <div className="flex flex-col items-center gap-0.5">
                      <button
                        type="button"
                        onClick={() => moveItem(index, -1)}
                        disabled={index === 0}
                        className="text-zinc-400 hover:text-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs">{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => moveItem(index, 1)}
                        disabled={index === items.length - 1}
                        className="text-zinc-400 hover:text-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(index, "description", e.target.value)}
                      placeholder="Descripción del item"
                      className={inputClass}
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      value={item.details}
                      onChange={(e) => updateItem(index, "details", e.target.value)}
                      placeholder="Detalles"
                      className={inputClass}
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="number"
                      min={0}
                      step="any"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(index, "quantity", parseFloat(e.target.value) || 0)
                      }
                      className={`${inputClass} text-right`}
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="number"
                      min={0}
                      step="any"
                      value={item.unitPrice}
                      onChange={(e) =>
                        updateItem(index, "unitPrice", parseFloat(e.target.value) || 0)
                      }
                      className={`${inputClass} text-right`}
                    />
                  </td>
                  <td className="py-2 px-2 text-right font-medium text-zinc-900 dark:text-zinc-100">
                    {formatMoney(lineTotal, currency)}
                  </td>
                  <td className="py-2 px-2 text-center">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="p-1 text-zinc-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {items.length === 0 && (
        <div className="text-center py-8 text-sm text-zinc-400">
          No hay items. Agrega uno para comenzar.
        </div>
      )}

      <button
        type="button"
        onClick={addItem}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Agregar item
      </button>
    </div>
  );
}
