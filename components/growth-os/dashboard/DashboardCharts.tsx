"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { formatMoney } from "@/lib/growth-os/utils/format";

interface PipelineStageData {
  stageName: string;
  color: string | null;
  count: number;
  totalValue: number;
}

interface LeadSourceData {
  source: string;
  count: number;
}

const SOURCE_COLORS: Record<string, string> = {
  MANUAL: "#6366f1",
  WEBSITE_FORM: "#3b82f6",
  COTIZADOR: "#10b981",
  CHATBOT: "#f59e0b",
  APOLLO: "#ef4444",
  IMPORT: "#8b5cf6",
  REFERRAL: "#ec4899",
};

const SOURCE_LABELS: Record<string, string> = {
  MANUAL: "Manual",
  WEBSITE_FORM: "Formulario Web",
  COTIZADOR: "Cotizador",
  CHATBOT: "Chatbot",
  APOLLO: "Apollo",
  IMPORT: "Importado",
  REFERRAL: "Referido",
};

function PipelineBarTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: PipelineStageData }> }) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="rounded-lg bg-zinc-800 shadow-lg border border-zinc-700 px-3 py-2 text-sm">
      <p className="font-medium text-zinc-100">{data.stageName}</p>
      <p className="text-zinc-400">
        {data.count} deals - {formatMoney(data.totalValue, "CLP")}
      </p>
    </div>
  );
}

export function PipelineChart({ data }: { data: PipelineStageData[] }) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-zinc-500 dark:text-zinc-400">
        No hay datos de pipeline disponibles
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
        Resumen Pipeline
      </h3>
      <div className="h-64" style={{ minHeight: 200, minWidth: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <XAxis
              dataKey="stageName"
              tick={{ fontSize: 12, fill: "#71717a" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#71717a" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => formatMoney(v, "CLP")}
            />
            <Tooltip content={<PipelineBarTooltip />} />
            <Bar dataKey="totalValue" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color || "#6366f1"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function LeadSourceTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: LeadSourceData & { fill: string } }> }) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="rounded-lg bg-zinc-800 shadow-lg border border-zinc-700 px-3 py-2 text-sm">
      <p className="font-medium text-zinc-100">
        {SOURCE_LABELS[data.source] || data.source}
      </p>
      <p className="text-zinc-400">{data.count} contactos</p>
    </div>
  );
}

export function LeadSourceChart({ data }: { data: LeadSourceData[] }) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-zinc-500 dark:text-zinc-400">
        No hay datos de fuentes disponibles
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
        Fuentes de Leads
      </h3>
      <div className="h-64" style={{ minHeight: 200, minWidth: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              dataKey="count"
              nameKey="source"
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={SOURCE_COLORS[entry.source] || "#94a3b8"}
                />
              ))}
            </Pie>
            <Tooltip content={<LeadSourceTooltip />} />
            <Legend
              formatter={(value: string) => SOURCE_LABELS[value] || value}
              wrapperStyle={{ fontSize: "12px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
