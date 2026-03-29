import { Users, Handshake, TrendingUp, FileText } from "lucide-react";
import { formatMoney } from "@/lib/growth-os/utils/format";

interface StatsCardsProps {
  totalContacts: number;
  activeDeals: number;
  pipelineValue: number;
  pendingQuotes: number;
}

const cards = [
  {
    key: "totalContacts",
    label: "Total Contactos",
    icon: Users,
    color: "bg-blue-500/10 text-blue-400",
    format: (v: number) => v.toLocaleString("es-CL"),
  },
  {
    key: "activeDeals",
    label: "Deals Activos",
    icon: Handshake,
    color: "bg-green-500/10 text-green-400",
    format: (v: number) => v.toLocaleString("es-CL"),
  },
  {
    key: "pipelineValue",
    label: "Valor Pipeline",
    icon: TrendingUp,
    color: "bg-purple-500/10 text-purple-400",
    format: (v: number) => formatMoney(v, "CLP"),
  },
  {
    key: "pendingQuotes",
    label: "Cotizaciones Pendientes",
    icon: FileText,
    color: "bg-amber-500/10 text-amber-400",
    format: (v: number) => v.toLocaleString("es-CL"),
  },
] as const;

export function StatsCards(props: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const value = props[card.key as keyof StatsCardsProps];
        return (
          <div
            key={card.key}
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-5"
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${card.color}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-100">
                  {card.format(value)}
                </p>
                <p className="text-sm text-zinc-400">{card.label}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
