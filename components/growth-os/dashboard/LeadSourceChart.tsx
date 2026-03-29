"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getSourceLabel } from "@/lib/growth-os/utils/format";

interface LeadSourceChartProps {
  data: { source: string; count: number; color: string }[];
}

export function LeadSourceChart({ data }: LeadSourceChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-400">
        Sin datos de fuentes
      </div>
    );
  }

  const labeled = data.map((d) => ({
    ...d,
    label: getSourceLabel(d.source),
    value: d.count,
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={labeled}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
            nameKey="label"
          >
            {labeled.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #E5E7EB",
              fontSize: 13,
            }}
          />
          <Legend
            formatter={(value: string) => (
              <span className="text-xs text-gray-600">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
