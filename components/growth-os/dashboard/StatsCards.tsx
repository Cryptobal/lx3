import {
  Users,
  Handshake,
  TrendingUp,
  FileText,
  DollarSign,
  Clock,
  Target,
  CheckCircle2,
} from "lucide-react";
import { formatMoney } from "@/lib/growth-os/utils/format";

interface StatsCardsProps {
  totalContacts: number;
  activeDeals: number;
  pipelineValue: number;
  pendingQuotes: number;
  wonRevenue?: number;
  forecastRevenue?: number;
  avgDaysToClose?: number;
  quotesAccepted?: number;
}

export function StatsCards(props: StatsCardsProps) {
  const cards = [
    {
      label: "Contactos",
      value: props.totalContacts.toLocaleString("es-CL"),
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10 dark:bg-blue-500/10",
    },
    {
      label: "Deals Activos",
      value: props.activeDeals.toLocaleString("es-CL"),
      icon: Handshake,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10 dark:bg-emerald-500/10",
    },
    {
      label: "Valor Pipeline",
      value: formatMoney(props.pipelineValue, "CLP"),
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10 dark:bg-purple-500/10",
    },
    {
      label: "Cotizaciones Pendientes",
      value: props.pendingQuotes.toLocaleString("es-CL"),
      icon: FileText,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10 dark:bg-amber-500/10",
    },
  ];

  const extendedCards = [
    ...(props.wonRevenue != null
      ? [
          {
            label: "Revenue Ganado",
            value: formatMoney(props.wonRevenue, "CLP"),
            icon: DollarSign,
            color: "text-green-500",
            bgColor: "bg-green-500/10",
          },
        ]
      : []),
    ...(props.forecastRevenue != null
      ? [
          {
            label: "Forecast Ponderado",
            value: formatMoney(props.forecastRevenue, "CLP"),
            icon: Target,
            color: "text-cyan-500",
            bgColor: "bg-cyan-500/10",
          },
        ]
      : []),
    ...(props.avgDaysToClose != null && props.avgDaysToClose > 0
      ? [
          {
            label: "Dias Prom. Cierre",
            value: `${props.avgDaysToClose}d`,
            icon: Clock,
            color: "text-orange-500",
            bgColor: "bg-orange-500/10",
          },
        ]
      : []),
    ...(props.quotesAccepted != null
      ? [
          {
            label: "Cotiz. Aceptadas (mes)",
            value: props.quotesAccepted.toLocaleString("es-CL"),
            icon: CheckCircle2,
            color: "text-teal-500",
            bgColor: "bg-teal-500/10",
          },
        ]
      : []),
  ];

  const allCards = [...cards, ...extendedCards];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {allCards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${card.bgColor} ${card.color}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold tabular-nums text-zinc-900 dark:text-zinc-100 truncate">
                  {card.value}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                  {card.label}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
