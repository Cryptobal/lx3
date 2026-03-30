"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ThemeToggleProps {
  collapsed?: boolean;
}

export function ThemeToggle({ collapsed }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className={cn("h-9", collapsed ? "w-9" : "w-[72px]")} />;
  }

  const isDark = resolvedTheme === "dark";

  if (collapsed) {
    return (
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 dark:text-zinc-400 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200"
        title={isDark ? "Modo claro" : "Modo oscuro"}
      >
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-100/50 dark:bg-zinc-800/50 p-0.5">
      <button
        onClick={() => setTheme("light")}
        className={cn(
          "rounded-md p-1.5 text-zinc-400 dark:text-zinc-500 transition-colors hover:text-zinc-700 dark:hover:text-zinc-300",
          theme === "light" && "bg-white dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 shadow-sm"
        )}
        title="Modo claro"
        aria-label="Modo claro"
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={cn(
          "rounded-md p-1.5 text-zinc-400 dark:text-zinc-500 transition-colors hover:text-zinc-700 dark:hover:text-zinc-300",
          (theme === "dark" || theme === "system") && "bg-white dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 shadow-sm"
        )}
        title="Modo oscuro"
        aria-label="Modo oscuro"
      >
        <Moon className="h-4 w-4" />
      </button>
    </div>
  );
}
