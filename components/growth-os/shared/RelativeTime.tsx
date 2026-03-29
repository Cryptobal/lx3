"use client";

import { useEffect, useState } from "react";
import { formatRelativeTime, formatDateTime } from "@/lib/growth-os/utils/format";

interface RelativeTimeProps {
  date: Date | string;
}

export function RelativeTime({ date }: RelativeTimeProps) {
  const [text, setText] = useState(() => formatRelativeTime(date));

  useEffect(() => {
    setText(formatRelativeTime(date));

    const interval = setInterval(() => {
      setText(formatRelativeTime(date));
    }, 60_000);

    return () => clearInterval(interval);
  }, [date]);

  return (
    <time
      dateTime={typeof date === "string" ? date : date.toISOString()}
      title={formatDateTime(date)}
      className="text-zinc-500 dark:text-zinc-400"
    >
      {text}
    </time>
  );
}
