"use client";

import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface RelativeTimeProps {
  date: Date | string;
}

export function RelativeTime({ date }: RelativeTimeProps) {
  const d = typeof date === "string" ? new Date(date) : date;

  return (
    <time
      dateTime={d.toISOString()}
      title={d.toLocaleString("es-CL")}
      className="text-gray-500"
    >
      {formatDistanceToNow(d, { addSuffix: true, locale: es })}
    </time>
  );
}
