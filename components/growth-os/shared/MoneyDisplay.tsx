import { cn } from "@/lib/utils/cn";
import { formatMoney } from "@/lib/growth-os/utils/format";

interface MoneyDisplayProps {
  amount: number;
  currency?: string;
  className?: string;
}

export function MoneyDisplay({
  amount,
  currency = "CLP",
  className,
}: MoneyDisplayProps) {
  return (
    <span className={cn("tabular-nums", className)}>
      {formatMoney(amount, currency)}
    </span>
  );
}
