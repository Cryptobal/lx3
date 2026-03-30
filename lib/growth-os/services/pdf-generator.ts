import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
  Font,
} from "@react-pdf/renderer";

// Register a clean sans-serif font
Font.register({
  family: "Inter",
  fonts: [
    { src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjQ.ttf", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fAZ9hjQ.ttf", fontWeight: 500 },
    { src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYAZ9hjQ.ttf", fontWeight: 600 },
    { src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYAZ9hjQ.ttf", fontWeight: 700 },
  ],
});

const colors = {
  primary: "#0f172a",
  accent: "#2563eb",
  text: "#334155",
  muted: "#64748b",
  light: "#94a3b8",
  border: "#e2e8f0",
  bgLight: "#f8fafc",
  white: "#ffffff",
};

const s = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 10,
    color: colors.text,
    paddingTop: 0,
    paddingBottom: 60,
    paddingHorizontal: 0,
  },
  // Header
  header: {
    backgroundColor: colors.primary,
    paddingVertical: 32,
    paddingHorizontal: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  logoText: {
    color: colors.white,
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: 1,
  },
  logoSub: {
    color: colors.light,
    fontSize: 10,
    marginTop: 2,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  quoteNumber: {
    color: "#93c5fd",
    fontSize: 11,
    fontWeight: 600,
  },
  headerDate: {
    color: colors.light,
    fontSize: 9,
    marginTop: 2,
  },
  // Body
  body: {
    paddingHorizontal: 48,
    paddingTop: 28,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    color: colors.primary,
    marginBottom: 6,
  },
  description: {
    fontSize: 10,
    color: colors.muted,
    lineHeight: 1.5,
    marginBottom: 20,
  },
  // Prepared for
  preparedFor: {
    backgroundColor: colors.bgLight,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  preparedLabel: {
    fontSize: 8,
    fontWeight: 600,
    color: colors.light,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  preparedName: {
    fontSize: 14,
    fontWeight: 600,
    color: colors.primary,
  },
  preparedCompany: {
    fontSize: 10,
    color: colors.muted,
    marginTop: 2,
  },
  // Table
  table: {
    marginBottom: 24,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tableHeaderText: {
    color: colors.white,
    fontSize: 8,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tableRowAlt: {
    backgroundColor: colors.bgLight,
  },
  colDesc: { flex: 3 },
  colQty: { width: 50, textAlign: "right" },
  colPrice: { width: 80, textAlign: "right" },
  colTotal: { width: 80, textAlign: "right" },
  cellText: { fontSize: 10, color: colors.text },
  cellDetail: { fontSize: 8, color: colors.muted, marginTop: 2 },
  cellBold: { fontSize: 10, fontWeight: 600, color: colors.primary },
  // Totals
  totalsContainer: {
    alignItems: "flex-end",
    marginBottom: 28,
  },
  totalsBox: {
    width: 220,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  totalsDivider: {
    borderTopWidth: 2,
    borderTopColor: colors.primary,
    marginTop: 6,
    paddingTop: 8,
  },
  totalLabel: { fontSize: 10, color: colors.muted },
  totalValue: { fontSize: 10, color: colors.text, fontWeight: 500 },
  totalGrandLabel: { fontSize: 13, fontWeight: 700, color: colors.primary },
  totalGrandValue: { fontSize: 13, fontWeight: 700, color: colors.accent },
  // Notes & Terms
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 600,
    color: colors.primary,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionText: {
    fontSize: 9,
    color: colors.muted,
    lineHeight: 1.6,
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 24,
    left: 48,
    right: 48,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 8,
    color: colors.light,
  },
});

function formatCLP(amount: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

interface QuoteItem {
  description: string;
  details?: string | null;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface QuotePDFData {
  quoteNumber: string;
  title: string;
  description?: string | null;
  createdAt: string | Date;
  validUntil?: string | Date | null;
  contactName?: string | null;
  companyName?: string | null;
  items: QuoteItem[];
  subtotal: number;
  taxRate?: number | null;
  taxAmount?: number | null;
  total: number;
  currency: string;
  notes?: string | null;
  terms?: string | null;
}

function QuotePDFDocument({ data }: { data: QuotePDFData }) {
  const dateStr = new Date(data.createdAt).toLocaleDateString("es-CL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const fmt = (n: number) =>
    data.currency === "CLP" ? formatCLP(n) : `$${n.toLocaleString("es-CL")}`;

  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: "A4", style: s.page },
      // Header
      React.createElement(
        View,
        { style: s.header },
        React.createElement(
          View,
          null,
          React.createElement(Text, { style: s.logoText }, "LX3"),
          React.createElement(
            Text,
            { style: s.logoSub },
            "Software Studio"
          )
        ),
        React.createElement(
          View,
          { style: s.headerRight },
          React.createElement(
            Text,
            { style: s.quoteNumber },
            data.quoteNumber
          ),
          React.createElement(Text, { style: s.headerDate }, dateStr)
        )
      ),
      // Body
      React.createElement(
        View,
        { style: s.body },
        // Title
        React.createElement(Text, { style: s.title }, data.title),
        data.description
          ? React.createElement(Text, { style: s.description }, data.description)
          : null,
        // Prepared for
        (data.contactName || data.companyName)
          ? React.createElement(
              View,
              { style: s.preparedFor },
              React.createElement(
                Text,
                { style: s.preparedLabel },
                "Preparada para"
              ),
              data.contactName
                ? React.createElement(
                    Text,
                    { style: s.preparedName },
                    data.contactName
                  )
                : null,
              data.companyName
                ? React.createElement(
                    Text,
                    { style: s.preparedCompany },
                    data.companyName
                  )
                : null
            )
          : null,
        // Items table
        React.createElement(
          View,
          { style: s.table },
          // Header row
          React.createElement(
            View,
            { style: s.tableHeader },
            React.createElement(
              Text,
              { style: [s.tableHeaderText, s.colDesc] },
              "Descripcion"
            ),
            React.createElement(
              Text,
              { style: [s.tableHeaderText, s.colQty] },
              "Cant."
            ),
            React.createElement(
              Text,
              { style: [s.tableHeaderText, s.colPrice] },
              "Precio"
            ),
            React.createElement(
              Text,
              { style: [s.tableHeaderText, s.colTotal] },
              "Total"
            )
          ),
          // Data rows
          ...data.items.map((item, idx) =>
            React.createElement(
              View,
              {
                key: idx,
                style: idx % 2 === 1 ? [s.tableRow, s.tableRowAlt] : s.tableRow,
              },
              React.createElement(
                View,
                { style: s.colDesc },
                React.createElement(
                  Text,
                  { style: s.cellText },
                  item.description
                ),
                item.details
                  ? React.createElement(
                      Text,
                      { style: s.cellDetail },
                      item.details
                    )
                  : null
              ),
              React.createElement(
                Text,
                { style: [s.cellText, s.colQty] },
                String(item.quantity)
              ),
              React.createElement(
                Text,
                { style: [s.cellText, s.colPrice] },
                fmt(item.unitPrice)
              ),
              React.createElement(
                Text,
                { style: [s.cellBold, s.colTotal] },
                fmt(item.total)
              )
            )
          )
        ),
        // Totals
        React.createElement(
          View,
          { style: s.totalsContainer },
          React.createElement(
            View,
            { style: s.totalsBox },
            React.createElement(
              View,
              { style: s.totalsRow },
              React.createElement(Text, { style: s.totalLabel }, "Subtotal"),
              React.createElement(
                Text,
                { style: s.totalValue },
                fmt(data.subtotal)
              )
            ),
            data.taxRate
              ? React.createElement(
                  View,
                  { style: s.totalsRow },
                  React.createElement(
                    Text,
                    { style: s.totalLabel },
                    `IVA (${data.taxRate}%)`
                  ),
                  React.createElement(
                    Text,
                    { style: s.totalValue },
                    fmt(data.taxAmount ?? 0)
                  )
                )
              : null,
            React.createElement(
              View,
              { style: [s.totalsRow, s.totalsDivider] },
              React.createElement(
                Text,
                { style: s.totalGrandLabel },
                "Total"
              ),
              React.createElement(
                Text,
                { style: s.totalGrandValue },
                fmt(data.total)
              )
            )
          )
        ),
        // Notes
        data.notes
          ? React.createElement(
              View,
              { style: s.section },
              React.createElement(Text, { style: s.sectionTitle }, "Notas"),
              React.createElement(Text, { style: s.sectionText }, data.notes)
            )
          : null,
        // Terms
        data.terms
          ? React.createElement(
              View,
              { style: s.section },
              React.createElement(
                Text,
                { style: s.sectionTitle },
                "Terminos y condiciones"
              ),
              React.createElement(Text, { style: s.sectionText }, data.terms)
            )
          : null
      ),
      // Footer
      React.createElement(
        View,
        { style: s.footer, fixed: true },
        React.createElement(
          Text,
          { style: s.footerText },
          `LX3 Software Studio`
        ),
        data.validUntil
          ? React.createElement(
              Text,
              { style: s.footerText },
              `Valida hasta ${new Date(data.validUntil).toLocaleDateString(
                "es-CL",
                { year: "numeric", month: "long", day: "numeric" }
              )}`
            )
          : React.createElement(
              Text,
              { style: s.footerText },
              data.quoteNumber
            )
      )
    )
  );
}

export async function generateQuotePDF(
  data: QuotePDFData
): Promise<Buffer> {
  const doc = React.createElement(QuotePDFDocument, { data }) as any;
  const buffer = await renderToBuffer(doc);
  return Buffer.from(buffer);
}

export type { QuotePDFData };
