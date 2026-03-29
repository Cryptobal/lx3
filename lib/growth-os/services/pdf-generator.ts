import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  renderToBuffer,
} from "@react-pdf/renderer";
import type { QuoteWithRelations, Company } from "@/lib/growth-os/types";

/** Extended quote type that may include contact.company when populated. */
type QuotePDFInput = QuoteWithRelations & {
  contact?: (QuoteWithRelations["contact"] & { company?: Company | null }) | null;
};

// ---------- styles ----------

const colors = {
  primary: "#0f172a",
  accent: "#2563eb",
  textDark: "#1e293b",
  textMuted: "#64748b",
  border: "#e2e8f0",
  backgroundLight: "#f8fafc",
  white: "#ffffff",
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 40,
    color: colors.textDark,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  headerLeft: {},
  companyName: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    color: colors.primary,
    letterSpacing: 2,
  },
  companyTagline: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 2,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  quoteLabel: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: colors.accent,
  },
  quoteNumber: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  quoteDate: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 2,
  },

  // Info rows
  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  infoBlock: {
    width: "48%",
  },
  infoBlockTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: colors.accent,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  infoRow: {
    fontSize: 10,
    lineHeight: 1.6,
    color: colors.textDark,
  },
  infoLabel: {
    fontFamily: "Helvetica-Bold",
  },

  // Description
  descriptionSection: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: colors.backgroundLight,
    borderRadius: 4,
  },
  descriptionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: colors.textDark,
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 10,
    color: colors.textMuted,
    lineHeight: 1.5,
  },

  // Table
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: colors.white,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tableRowAlt: {
    backgroundColor: colors.backgroundLight,
  },
  tableCell: {
    fontSize: 10,
    color: colors.textDark,
  },
  tableCellDetails: {
    fontSize: 8,
    color: colors.textMuted,
    marginTop: 2,
  },
  colDescription: { width: "45%" },
  colQuantity: { width: "15%", textAlign: "center" },
  colUnitPrice: { width: "20%", textAlign: "right" },
  colTotal: { width: "20%", textAlign: "right" },

  // Totals
  totalsSection: {
    alignItems: "flex-end",
    marginBottom: 24,
  },
  totalsTable: {
    width: 240,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  totalsLabel: {
    fontSize: 10,
    color: colors.textMuted,
  },
  totalsValue: {
    fontSize: 10,
    color: colors.textDark,
    fontFamily: "Helvetica-Bold",
  },
  totalsDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginVertical: 4,
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderTopWidth: 2,
    borderTopColor: colors.primary,
  },
  grandTotalLabel: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: colors.primary,
  },
  grandTotalValue: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: colors.primary,
  },

  // Notes & terms
  notesSection: {
    marginBottom: 16,
  },
  notesSectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: colors.accent,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 9,
    color: colors.textMuted,
    lineHeight: 1.5,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: colors.textMuted,
  },
});

// ---------- helpers ----------

function formatDecimal(value: unknown): number {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "object" && value !== null && "toNumber" in value) {
    return (value as { toNumber(): number }).toNumber();
  }
  return Number(value) || 0;
}

function formatMoney(amount: number, currency: string): string {
  if (currency === "CLP") {
    const rounded = Math.round(amount);
    const formatted = rounded
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `$${formatted}`;
  }
  if (currency === "USD") {
    return `US$${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return `${currency} ${amount.toLocaleString()}`;
}

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ---------- document component ----------

function QuotePDFDocument({ quote }: { quote: QuotePDFInput }) {
  const currency = quote.currency || "CLP";
  const subtotal = formatDecimal(quote.subtotal);
  const taxAmount = formatDecimal(quote.taxAmount);
  const total = formatDecimal(quote.total);
  const taxRate = formatDecimal(quote.taxRate);

  const contactName = [quote.contact?.firstName, quote.contact?.lastName]
    .filter(Boolean)
    .join(" ") || "-";

  const sortedItems = [...quote.items].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: "A4", style: styles.page },

      // --- Header ---
      React.createElement(
        View,
        { style: styles.header },
        React.createElement(
          View,
          { style: styles.headerLeft },
          React.createElement(Text, { style: styles.companyName }, "LX3"),
          React.createElement(
            Text,
            { style: styles.companyTagline },
            "Soluciones Digitales"
          )
        ),
        React.createElement(
          View,
          { style: styles.headerRight },
          React.createElement(
            Text,
            { style: styles.quoteLabel },
            "COTIZACION"
          ),
          React.createElement(
            Text,
            { style: styles.quoteNumber },
            `N\u00b0 ${quote.quoteNumber}`
          ),
          React.createElement(
            Text,
            { style: styles.quoteDate },
            `Fecha: ${formatDate(quote.createdAt)}`
          )
        )
      ),

      // --- Client / Quote info ---
      React.createElement(
        View,
        { style: styles.infoSection },
        React.createElement(
          View,
          { style: styles.infoBlock },
          React.createElement(
            Text,
            { style: styles.infoBlockTitle },
            "Cliente"
          ),
          React.createElement(
            Text,
            { style: styles.infoRow },
            contactName
          ),
          quote.contact?.email
            ? React.createElement(
                Text,
                { style: styles.infoRow },
                quote.contact.email
              )
            : null,
          quote.contact?.phone
            ? React.createElement(
                Text,
                { style: styles.infoRow },
                quote.contact.phone
              )
            : null,
          quote.contact?.company?.name
            ? React.createElement(
                Text,
                { style: styles.infoRow },
                quote.contact.company?.name
              )
            : null
        ),
        React.createElement(
          View,
          { style: styles.infoBlock },
          React.createElement(
            Text,
            { style: styles.infoBlockTitle },
            "Detalles"
          ),
          React.createElement(
            Text,
            { style: styles.infoRow },
            `Estado: ${quote.status}`
          ),
          React.createElement(
            Text,
            { style: styles.infoRow },
            `Moneda: ${currency}`
          ),
          quote.validUntil
            ? React.createElement(
                Text,
                { style: styles.infoRow },
                `Valida hasta: ${formatDate(quote.validUntil)}`
              )
            : null
        )
      ),

      // --- Description ---
      quote.description
        ? React.createElement(
            View,
            { style: styles.descriptionSection },
            React.createElement(
              Text,
              { style: styles.descriptionTitle },
              quote.title
            ),
            React.createElement(
              Text,
              { style: styles.descriptionText },
              quote.description
            )
          )
        : null,

      // --- Items table ---
      React.createElement(
        View,
        { style: styles.table },

        // Table header
        React.createElement(
          View,
          { style: styles.tableHeader },
          React.createElement(
            Text,
            { style: { ...styles.tableHeaderCell, ...styles.colDescription } },
            "Descripcion"
          ),
          React.createElement(
            Text,
            { style: { ...styles.tableHeaderCell, ...styles.colQuantity } },
            "Cantidad"
          ),
          React.createElement(
            Text,
            { style: { ...styles.tableHeaderCell, ...styles.colUnitPrice } },
            "Precio Unit."
          ),
          React.createElement(
            Text,
            { style: { ...styles.tableHeaderCell, ...styles.colTotal } },
            "Total"
          )
        ),

        // Table rows
        ...sortedItems.map((item, idx) =>
          React.createElement(
            View,
            {
              key: item.id,
              style: [styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : {}],
            },
            React.createElement(
              View,
              { style: styles.colDescription },
              React.createElement(
                Text,
                { style: styles.tableCell },
                item.description
              ),
              item.details
                ? React.createElement(
                    Text,
                    { style: styles.tableCellDetails },
                    item.details
                  )
                : null
            ),
            React.createElement(
              Text,
              { style: { ...styles.tableCell, ...styles.colQuantity } },
              formatDecimal(item.quantity).toString()
            ),
            React.createElement(
              Text,
              { style: { ...styles.tableCell, ...styles.colUnitPrice } },
              formatMoney(formatDecimal(item.unitPrice), currency)
            ),
            React.createElement(
              Text,
              { style: { ...styles.tableCell, ...styles.colTotal } },
              formatMoney(formatDecimal(item.total), currency)
            )
          )
        )
      ),

      // --- Totals ---
      React.createElement(
        View,
        { style: styles.totalsSection },
        React.createElement(
          View,
          { style: styles.totalsTable },
          React.createElement(
            View,
            { style: styles.totalsRow },
            React.createElement(
              Text,
              { style: styles.totalsLabel },
              "Subtotal"
            ),
            React.createElement(
              Text,
              { style: styles.totalsValue },
              formatMoney(subtotal, currency)
            )
          ),
          taxRate > 0
            ? React.createElement(
                View,
                { style: styles.totalsRow },
                React.createElement(
                  Text,
                  { style: styles.totalsLabel },
                  `IVA (${taxRate}%)`
                ),
                React.createElement(
                  Text,
                  { style: styles.totalsValue },
                  formatMoney(taxAmount, currency)
                )
              )
            : null,
          React.createElement(View, { style: styles.totalsDivider }),
          React.createElement(
            View,
            { style: styles.grandTotalRow },
            React.createElement(
              Text,
              { style: styles.grandTotalLabel },
              "TOTAL"
            ),
            React.createElement(
              Text,
              { style: styles.grandTotalValue },
              formatMoney(total, currency)
            )
          )
        )
      ),

      // --- Notes ---
      quote.notes
        ? React.createElement(
            View,
            { style: styles.notesSection },
            React.createElement(
              Text,
              { style: styles.notesSectionTitle },
              "Notas"
            ),
            React.createElement(
              Text,
              { style: styles.notesText },
              quote.notes
            )
          )
        : null,

      // --- Terms ---
      quote.terms
        ? React.createElement(
            View,
            { style: styles.notesSection },
            React.createElement(
              Text,
              { style: styles.notesSectionTitle },
              "Terminos y Condiciones"
            ),
            React.createElement(
              Text,
              { style: styles.notesText },
              quote.terms
            )
          )
        : null,

      // --- Footer ---
      React.createElement(
        View,
        { style: styles.footer, fixed: true },
        React.createElement(
          Text,
          { style: styles.footerText },
          `Cotizacion ${quote.quoteNumber}${
            quote.validUntil
              ? ` | Valida hasta: ${formatDate(quote.validUntil)}`
              : ""
          }`
        ),
        React.createElement(
          Text,
          { style: styles.footerText },
          "LX3 Soluciones Digitales | lx3.ai"
        )
      )
    )
  );
}

// ---------- public API ----------

export async function generateQuotePDF(
  quote: QuoteWithRelations
): Promise<Buffer> {
  const document = React.createElement(QuotePDFDocument, {
    quote: quote as QuotePDFInput,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(document as any);
  return Buffer.from(buffer);
}
