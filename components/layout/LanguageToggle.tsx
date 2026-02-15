"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils/cn";

export function LanguageToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale(newLocale: "es" | "en") {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <div className="flex items-center gap-1 text-sm font-medium">
      <button
        onClick={() => switchLocale("es")}
        className={cn(
          "rounded px-2 py-1 transition-colors",
          locale === "es"
            ? "text-foreground dark:text-white"
            : "text-foreground/40 hover:text-foreground/70 dark:text-white/40 dark:hover:text-white/70"
        )}
      >
        ES
      </button>
      <span className="text-foreground/20 dark:text-white/20">|</span>
      <button
        onClick={() => switchLocale("en")}
        className={cn(
          "rounded px-2 py-1 transition-colors",
          locale === "en"
            ? "text-foreground dark:text-white"
            : "text-foreground/40 hover:text-foreground/70 dark:text-white/40 dark:hover:text-white/70"
        )}
      >
        EN
      </button>
    </div>
  );
}
