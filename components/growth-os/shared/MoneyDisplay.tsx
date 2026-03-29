import { formatMoney } from "@/lib/growth-os/utils/format";

interface MoneyDisplayProps {
  amount: number;
  currency: "CLP" | "USD";
}

export function MoneyDisplay({ amount, currency }: MoneyDisplayProps) {
  return <span className="tabular-nums">{formatMoney(amount, currency)}</span>;
}
