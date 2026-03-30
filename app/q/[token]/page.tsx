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

  const dateFormatted = new Date(quote.createdAt as string).toLocaleDateString(
    "es-CL",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header bar */}
      <div className="bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/logo/LX3_logotipo_dark-bg.svg"
                alt="LX3"
                width={96}
                height={28}
                className="h-7 w-auto"
              />
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-blue-300">
                {quote.quoteNumber as string}
              </p>
              <p className="text-xs text-slate-400">{dateFormatted}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-8 -mt-1">
        {/* Title card */}
        <div className="rounded-xl bg-white shadow-sm border border-zinc-200 overflow-hidden">
          {/* Blue accent line */}
          <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-400" />

          <div className="p-6 sm:p-8">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              {quote.title as string}
            </h1>

            {(contactName || company) && (
              <div className="mt-5 flex items-start gap-4 rounded-lg bg-slate-50 border border-slate-100 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm font-bold">
                  {contactName
                    ? contactName
                        .split(" ")
                        .map((w: string) => w[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    : "CL"}
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Preparada para
                  </p>
                  {contactName && (
                    <p className="mt-0.5 text-base font-semibold text-slate-900">
                      {contactName}
                    </p>
                  )}
                  {company?.name && (
                    <p className="text-sm text-slate-500">
                      {company.name as string}
                    </p>
                  )}
                </div>
              </div>
            )}

            {quote.description && (
              <p className="mt-5 text-sm leading-relaxed text-slate-600">
                {quote.description as string}
              </p>
            )}
          </div>
        </div>

        {/* Items table */}
        <div className="mt-6 rounded-xl bg-white shadow-sm border border-zinc-200 overflow-hidden">
          <div className="px-6 pt-6 sm:px-8 sm:pt-8">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Detalle de servicios
            </h2>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-y border-slate-100 bg-slate-50/50">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-8">
                    Descripcion
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Cant.
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Precio unit.
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-8">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item: any, idx: number) => (
                  <tr key={idx} className={idx % 2 === 1 ? "bg-slate-50/30" : ""}>
                    <td className="px-6 py-4 sm:px-8">
                      <p className="text-sm font-medium text-slate-900">
                        {item.description as string}
                      </p>
                      {item.details && (
                        <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                          {item.details as string}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right text-sm tabular-nums text-slate-700">
                      {item.quantity as number}
                    </td>
                    <td className="px-4 py-4 text-right text-sm tabular-nums text-slate-700">
                      {fmt(item.unitPrice as number)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-semibold tabular-nums text-slate-900 sm:px-8">
                      {fmt(item.total as number)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="border-t border-slate-200 bg-slate-50 px-6 py-5 sm:px-8">
            <div className="flex justify-end">
              <div className="w-72 space-y-2">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal</span>
                  <span className="tabular-nums font-medium">
                    {fmt(quote.subtotal as number)}
                  </span>
                </div>
                {(quote.taxRate as number) > 0 && (
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>IVA ({quote.taxRate as number}%)</span>
                    <span className="tabular-nums font-medium">
                      {fmt(quote.taxAmount as number)}
                    </span>
                  </div>
                )}
                <div className="border-t-2 border-slate-300 pt-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-base font-bold text-slate-900">
                      Total
                    </span>
                    <span className="text-2xl font-bold tabular-nums text-blue-600">
                      {fmt(quote.total as number)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes & Terms */}
        {(quote.notes || quote.terms) && (
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {quote.notes && (
              <div className="rounded-xl bg-white shadow-sm border border-zinc-200 p-6 sm:p-8">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                  Notas
                </h3>
                <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
                  {quote.notes as string}
                </p>
              </div>
            )}
            {quote.terms && (
              <div className="rounded-xl bg-white shadow-sm border border-zinc-200 p-6 sm:p-8">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                  Terminos y condiciones
                </h3>
                <p className="whitespace-pre-line text-xs leading-relaxed text-slate-500">
                  {quote.terms as string}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-8">
          <QuoteActions
            token={token}
            status={status}
            validUntil={quote.validUntil as string | null | undefined}
          />
        </div>

        {/* Footer */}
        <div className="mt-12 mb-8 border-t border-slate-200 pt-6 text-center">
          {quote.validUntil && status !== "ACCEPTED" && status !== "EXPIRED" && (
            <p className="mb-3 text-xs text-slate-400">
              Esta cotizacion es valida hasta el{" "}
              {new Date(quote.validUntil as string).toLocaleDateString("es-CL", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
          <div className="flex items-center justify-center gap-2">
            <img
              src="/logo/LX3_isotipo.svg"
              alt="LX3"
              width={20}
              height={20}
              className="h-5 w-5 opacity-40"
            />
            <p className="text-xs text-slate-400">
              LX3 Software Studio &mdash; Software a medida con inteligencia artificial
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
