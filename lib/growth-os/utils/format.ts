/**
 * Format a monetary amount for display.
 */
export function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "CLP" ? 0 : 2,
    maximumFractionDigits: currency === "CLP" ? 0 : 2,
  }).format(amount);
}

/**
 * Generate a formatted quote number like "LX3-2026-001".
 */
export function formatQuoteNumber(year: number, seq: number): string {
  return `LX3-${year}-${String(seq).padStart(3, "0")}`;
}

/**
 * Extract initials from a full name (up to 2 characters).
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

/**
 * Human-readable Spanish label for contact sources.
 */
export function getSourceLabel(source: string): string {
  const map: Record<string, string> = {
    MANUAL: "Manual",
    WEBSITE_FORM: "Formulario web",
    COTIZADOR: "Cotizador",
    CHATBOT: "Chatbot",
    APOLLO: "Apollo",
    IMPORT: "Importado",
    REFERRAL: "Referido",
  };
  return map[source] ?? source;
}

/**
 * Human-readable Spanish label for statuses (quotes, deals, etc.).
 */
export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    DRAFT: "Borrador",
    SENT: "Enviada",
    VIEWED: "Vista",
    ACCEPTED: "Aceptada",
    REJECTED: "Rechazada",
    EXPIRED: "Expirada",
    QUEUED: "En cola",
    DELIVERED: "Entregado",
    OPENED: "Abierto",
    CLICKED: "Clic",
    BOUNCED: "Rebotado",
    FAILED: "Fallido",
  };
  return map[status] ?? status;
}

/**
 * Color associated with a status for badges.
 */
export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    DRAFT: "#6B7280",
    SENT: "#3B82F6",
    VIEWED: "#8B5CF6",
    ACCEPTED: "#10B981",
    REJECTED: "#EF4444",
    EXPIRED: "#F59E0B",
    QUEUED: "#6B7280",
    DELIVERED: "#3B82F6",
    OPENED: "#8B5CF6",
    CLICKED: "#10B981",
    BOUNCED: "#F59E0B",
    FAILED: "#EF4444",
  };
  return map[status] ?? "#6B7280";
}
