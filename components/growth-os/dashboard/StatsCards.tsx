import {
  Users,
  Handshake,
  DollarSign,
  FileText,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatMoney } from "@/lib/growth-os/utils/format";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

function StatCard({ label, value, icon: Icon, iconBg, iconColor }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "flex items-center justify-center w-12 h-12 rounded-full",
            iconBg
          )}
        >
          <Icon className={cn("w-6 h-6", iconColor)} />
        </div>
        <div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {value}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
        </div>
      </div>
    </div>
  );
}

interface StatsCardsProps {
  totalContacts: number;
  activeDeals: number;
  pipelineValue: number;
  pendingQuotes: number;
}

export function StatsCards({
  totalContacts,
  activeDeals,
  pipelineValue,
  pendingQuotes,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Contactos"
        value={totalContacts}
        icon={Users}
        iconBg="bg-blue-50 dark:bg-blue-950"
        iconColor="text-blue-600 dark:text-blue-400"
      />
      <StatCard
        label="Deals Activos"
        value={activeDeals}
        icon={Handshake}
        iconBg="bg-purple-50 dark:bg-purple-950"
        iconColor="text-purple-600 dark:text-purple-400"
      />
      <StatCard
        label="Valor Pipeline"
        value={formatMoney(pipelineValue)}
        icon={DollarSign}
        iconBg="bg-emerald-50 dark:bg-emerald-950"
        iconColor="text-emerald-600 dark:text-emerald-400"
      />
      <StatCard
        label="Cotizaciones Pendientes"
        value={pendingQuotes}
        icon={FileText}
        iconBg="bg-amber-50 dark:bg-amber-950"
        iconColor="text-amber-600 dark:text-amber-400"
      />
    </div>
  );
}
