import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { QuotePublicView } from "@/components/growth-os/quotes/QuotePublicView";
import { formatMoney, formatDate } from "@/lib/growth-os/utils/format";

export default async function PublicQuotePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  if (!prisma) return notFound();

  const { token } = await params;

  const quote = await prisma.quote.findUnique({
    where: { trackingToken: token },
    include: {
      items: { orderBy: { order: "asc" } },
      contact: { include: { company: true } },
    },
  });

  if (!quote) return notFound();

  // Record view
  const headersList = await headers();
  const ipAddress =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
  const userAgent = headersList.get("user-agent") || null;

  try {
    await prisma.quoteViewLog.create({
      data: {
        quoteId: quote.id,
        ipAddress,
        userAgent,
      },
    });

    await prisma.quote.update({
      where: { id: quote.id },
      data: {
        viewCount: { increment: 1 },
        lastViewedAt: new Date(),
        ...(quote.status === "SENT" ? { status: "VIEWED" } : {}),
      },
    });

    await prisma.activity.create({
      data: {
        type: "QUOTE_VIEWED",
        title: `Cotización ${quote.quoteNumber} vista`,
        contactId: quote.contactId,
        dealId: quote.dealId,
        metadata: { quoteId: quote.id, ipAddress },
      },
    });
  } catch (error) {
    console.error("Failed to record quote view:", error);
  }

  // Serialize for client
  const contactName = quote.contact
    ? `${quote.contact.firstName} ${quote.contact.lastName || ""}`.trim()
    : null;
  const contactEmail = quote.contact?.email || null;
  const companyName = quote.contact?.company?.name || null;

  const serializedItems = quote.items.map((item, index) => ({
    index: index + 1,
    description: item.description,
    details: item.details,
    quantity: Number(item.quantity),
    unitPrice: formatMoney(item.unitPrice, quote.currency),
    total: formatMoney(item.total, quote.currency),
  }));

  const subtotal = formatMoney(quote.subtotal, quote.currency);
  const taxAmount = quote.taxAmount
    ? formatMoney(quote.taxAmount, quote.currency)
    : null;
  const taxRate = quote.taxRate ? Number(quote.taxRate) : null;
  const total = formatMoney(quote.total, quote.currency);
  const validUntil = quote.validUntil ? formatDate(quote.validUntil) : null;
  const createdDate = formatDate(quote.createdAt);

  return (
    <div className="min-h-screen py-8 px-4 sm:py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
            LX3
          </h1>
          <p className="text-sm text-zinc-500 mt-1">Software Studio</p>
        </div>

        {/* Quote card */}
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
          {/* Title section */}
          <div className="px-8 pt-8 pb-6 border-b border-zinc-100">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider">
                  Cotización
                </p>
                <h2 className="text-xl font-bold text-zinc-900 mt-1">
                  {quote.quoteNumber}
                </h2>
                <p className="text-zinc-600 mt-1">{quote.title}</p>
              </div>
              <div className="text-sm text-zinc-500 sm:text-right space-y-1">
                <p>Fecha: {createdDate}</p>
                {validUntil && <p>Válida hasta: {validUntil}</p>}
              </div>
            </div>
          </div>

          {/* Client info */}
          {contactName && (
            <div className="px-8 py-4 bg-zinc-50 border-b border-zinc-100">
              <p className="text-sm text-zinc-500">Para:</p>
              <p className="font-medium text-zinc-900">{contactName}</p>
              {companyName && (
                <p className="text-sm text-zinc-600">{companyName}</p>
              )}
              {contactEmail && (
                <p className="text-sm text-zinc-500">{contactEmail}</p>
              )}
            </div>
          )}

          {/* Description */}
          {quote.description && (
            <div className="px-8 py-4 border-b border-zinc-100">
              <p className="text-sm text-zinc-600 whitespace-pre-wrap">
                {quote.description}
              </p>
            </div>
          )}

          {/* Items */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  <th className="text-left px-8 py-3 font-medium text-zinc-500 w-10">
                    #
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-500">
                    Descripción
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-zinc-500 w-20">
                    Cant.
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-zinc-500 w-32">
                    Precio Unit.
                  </th>
                  <th className="text-right px-8 py-3 font-medium text-zinc-500 w-32">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {serializedItems.map((item) => (
                  <tr key={item.index}>
                    <td className="px-8 py-4 text-zinc-400">{item.index}</td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-zinc-900">
                        {item.description}
                      </div>
                      {item.details && (
                        <div className="text-xs text-zinc-500 mt-0.5">
                          {item.details}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right text-zinc-600">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-4 text-right text-zinc-600">
                      {item.unitPrice}
                    </td>
                    <td className="px-8 py-4 text-right font-medium text-zinc-900">
                      {item.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="border-t border-zinc-200 px-8 py-6">
            <div className="flex flex-col items-end gap-2 text-sm">
              <div className="flex items-center gap-8">
                <span className="text-zinc-500">Subtotal</span>
                <span className="font-medium text-zinc-900 w-36 text-right">
                  {subtotal}
                </span>
              </div>
              {taxRate !== null && taxAmount && (
                <div className="flex items-center gap-8">
                  <span className="text-zinc-500">IVA ({taxRate}%)</span>
                  <span className="font-medium text-zinc-900 w-36 text-right">
                    {taxAmount}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-8 pt-3 border-t border-zinc-200 mt-1">
                <span className="font-bold text-zinc-900 text-base">Total</span>
                <span className="font-bold text-xl text-zinc-900 w-36 text-right">
                  {total}
                </span>
              </div>
            </div>
          </div>

          {/* Notes and terms */}
          {(quote.notes || quote.terms) && (
            <div className="border-t border-zinc-200 px-8 py-6 space-y-4">
              {quote.notes && (
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900 mb-1">
                    Notas
                  </h3>
                  <p className="text-sm text-zinc-600 whitespace-pre-wrap">
                    {quote.notes}
                  </p>
                </div>
              )}
              {quote.terms && (
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900 mb-1">
                    Términos y condiciones
                  </h3>
                  <p className="text-sm text-zinc-600 whitespace-pre-wrap">
                    {quote.terms}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="border-t border-zinc-200 px-8 py-6 bg-zinc-50">
            <QuotePublicView quoteId={quote.id} status={quote.status} />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-zinc-400">
            LX3 Software Studio &middot; contacto@lx3.ai
          </p>
        </div>
      </div>
    </div>
  );
}
