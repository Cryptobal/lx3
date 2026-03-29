import { notFound } from "next/navigation";
import { headers } from "next/headers";
import {
  getQuoteByToken,
  recordQuoteView,
} from "@/lib/growth-os/actions/quotes";
import { formatMoney } from "@/lib/growth-os/utils/format";
import { QuoteActions } from "./QuoteActions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const result = await getQuoteByToken(token);
  if (!result.success) return { title: "Cotizacion no encontrada" };
  const quote = result.data as Record<string, unknown>;
  return {
    title: `Cotizacion ${quote.quoteNumber} | LX3`,
  };
}

export default async function PublicQuotePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const result = await getQuoteByToken(token);

  if (!result.success) notFound();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const quote = result.data as any;
  const contact = quote.contact as any | null;
  const company = contact?.company as any | null;
  const items = (quote.items ?? []) as any[];
  const status = String(quote.status ?? "DRAFT");
  const currency = String(quote.currency ?? "CLP");
  const fmt = (n: number) => formatMoney(n, currency);

  // Record view (best-effort, non-blocking)
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    undefined;
  const userAgent = headersList.get("user-agent") ?? undefined;
  recordQuoteView(token, ip, userAgent).catch(() => {});

  const contactName = contact
    ? `${(contact.firstName as string) ?? ""} ${(contact.lastName as string) ?? ""}`.trim()
    : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Logo */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
            <span className="text-lg font-bold text-white">L</span>
          </div>
          <span className="text-xl font-bold text-gray-900">
            LX3 <span className="font-normal text-gray-500">Software Studio</span>
          </span>
        </div>
      </div>

      {/* Quote header */}
      <div className="mb-8">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">
              {quote.quoteNumber as string}
            </p>
            <h1 className="mt-1 text-2xl font-bold text-gray-900">
              {quote.title as string}
            </h1>
          </div>
          <div className="text-sm text-gray-500">
            {new Date(quote.createdAt as string).toLocaleDateString("es-CL", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        {(contactName || company) && (
          <div className="mt-4 rounded-lg bg-gray-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Preparada para
            </p>
            {contactName && (
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {contactName}
              </p>
            )}
            {company?.name && (
              <p className="text-sm text-gray-600">
                {company.name as string}
              </p>
            )}
          </div>
        )}

        {quote.description && (
          <p className="mt-4 text-sm leading-relaxed text-gray-600">
            {quote.description as string}
          </p>
        )}
      </div>

      {/* Items table */}
      <div className="mb-8 overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Descripcion
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                Cant.
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                Precio
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item, idx) => (
              <tr key={idx}>
                <td className="px-4 py-4">
                  <p className="text-sm font-medium text-gray-900">
                    {item.description as string}
                  </p>
                  {item.details && (
                    <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
                      {item.details as string}
                    </p>
                  )}
                </td>
                <td className="px-4 py-4 text-right text-sm text-gray-700 tabular-nums">
                  {item.quantity as number}
                </td>
                <td className="px-4 py-4 text-right text-sm text-gray-700 tabular-nums">
                  {fmt(item.unitPrice as number)}
                </td>
                <td className="px-4 py-4 text-right text-sm font-medium text-gray-900 tabular-nums">
                  {fmt(item.total as number)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-4">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="tabular-nums">{fmt(quote.subtotal as number)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>IVA ({quote.taxRate as number ?? 19}%)</span>
                <span className="tabular-nums">{fmt(quote.taxAmount as number)}</span>
              </div>
              <div className="border-t border-gray-300 pt-2">
                <div className="flex justify-between">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-blue-600 tabular-nums">
                    {fmt(quote.total as number)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {quote.notes && (
        <div className="mb-6 rounded-xl border border-gray-200 p-5">
          <h3 className="mb-2 text-sm font-semibold text-gray-700">Notas</h3>
          <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600">
            {quote.notes as string}
          </p>
        </div>
      )}

      {/* Terms */}
      {quote.terms && (
        <div className="mb-8 rounded-xl border border-gray-200 p-5">
          <h3 className="mb-2 text-sm font-semibold text-gray-700">
            Terminos y condiciones
          </h3>
          <p className="whitespace-pre-line text-xs leading-relaxed text-gray-500">
            {quote.terms as string}
          </p>
        </div>
      )}

      {/* Actions */}
      <QuoteActions
        token={token}
        status={status}
        validUntil={quote.validUntil as string | null | undefined}
      />

      {/* Footer */}
      <div className="mt-12 border-t border-gray-100 pt-6 text-center">
        {quote.validUntil && status !== "ACCEPTED" && status !== "EXPIRED" && (
          <p className="mb-3 text-xs text-gray-400">
            Esta cotizacion es valida hasta el{" "}
            {new Date(quote.validUntil as string).toLocaleDateString("es-CL", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}
        <p className="text-xs text-gray-400">
          LX3 Software Studio &mdash; Soluciones de software a medida con inteligencia artificial
        </p>
      </div>
    </div>
  );
}
