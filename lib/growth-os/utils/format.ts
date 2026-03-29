import { format, formatDistanceToNow, parseISO } from "date-fns";
import { es } from "date-fns/locale";

function toDate(date: Date | string): Date {
  if (typeof date === "string") return parseISO(date);
  return date;
}

function toNumber(amount: number | { toNumber(): number }): number {
  if (typeof amount === "number") return amount;
  return amount.toNumber();
}

export function formatMoney(
  amount: number | { toNumber(): number },
  currency: string = "CLP"
): string {
  const num = toNumber(amount);

  if (currency === "CLP") {
    const rounded = Math.round(num);
    const formatted = rounded
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `$${formatted}`;
  }

  if (currency === "USD") {
    return `$${num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return `${currency} ${num.toLocaleString()}`;
}

export function formatDate(date: Date | string): string {
  return format(toDate(date), "d MMM yyyy", { locale: es });
}

export function formatDateTime(date: Date | string): string {
  return format(toDate(date), "d MMM yyyy, HH:mm", { locale: es });
}

export function formatRelativeTime(date: Date | string): string {
  return formatDistanceToNow(toDate(date), { addSuffix: true, locale: es });
}

export function formatPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("56") && digits.length === 11) {
    return `+56 ${digits.slice(2, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
  }

  if (digits.length === 9 && digits.startsWith("9")) {
    return `+56 ${digits.slice(0, 1)} ${digits.slice(1, 5)} ${digits.slice(5)}`;
  }

  if (digits.startsWith("1") && digits.length === 11) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }

  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  return phone;
}
