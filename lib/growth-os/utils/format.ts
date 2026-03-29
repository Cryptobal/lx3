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
 * Format a date for display (e.g. "29 mar 2026").
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

/**
 * Format a date with time (e.g. "29 mar 2026, 17:04").
 */
export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

/**
 * Format a date as relative time (e.g. "hace 3 días").
 */
export function formatRelativeTime(date: string | Date): string {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 30) return formatDate(date);
  if (diffDay > 0) return `hace ${diffDay} día${diffDay !== 1 ? "s" : ""}`;
  if (diffHour > 0) return `hace ${diffHour} hora${diffHour !== 1 ? "s" : ""}`;
  if (diffMin > 0) return `hace ${diffMin} minuto${diffMin !== 1 ? "s" : ""}`;
  return "hace un momento";
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
