"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-9 w-9" />;
  }

  const options = [
    { value: "light", icon: Sun, label: "Modo claro" },
    { value: "dark", icon: Moon, label: "Modo oscuro" },
    { value: "system", icon: Monitor, label: "Sistema" },
  ] as const;

  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-gray-200 p-0.5 dark:border-zinc-700">
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={cn(
            "rounded-md p-1.5 text-gray-400 transition-colors hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300",
            theme === value &&
              "bg-gray-100 text-gray-700 dark:bg-zinc-700 dark:text-zinc-200"
          )}
          title={label}
          aria-label={label}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}
