"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils/cn";
import { Menu, X } from "lucide-react";

const navItems = [
  { href: "/como-trabajamos" as const, key: "howWeWork" },
  { href: "/capacidades" as const, key: "capabilities" },
  { href: "/perspectivas" as const, key: "insights" },
  { href: "/nosotros" as const, key: "about" },
] as const;

export function Navigation() {
  const t = useTranslations("nav");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop Nav */}
      <nav className="hidden items-center gap-8 md:flex">
        {navItems.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className="text-sm text-foreground/60 transition-colors hover:text-foreground dark:text-white/60 dark:hover:text-white"
          >
            {t(item.key)}
          </Link>
        ))}
      </nav>

      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="relative z-50 md:hidden"
        aria-label="Toggle menu"
      >
        {mobileOpen ? (
          <X className="h-5 w-5 text-foreground dark:text-white" />
        ) : (
          <Menu className="h-5 w-5 text-foreground dark:text-white" />
        )}
      </button>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/95 backdrop-blur-sm transition-all duration-300 md:hidden dark:bg-primary/95",
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        )}
      >
        <nav className="flex h-full flex-col items-center justify-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="text-lg font-medium text-foreground transition-colors hover:text-accent dark:text-white"
            >
              {t(item.key)}
            </Link>
          ))}
          <Link
            href="/diagnostico"
            onClick={() => setMobileOpen(false)}
            className="mt-4 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent/90"
          >
            {t("cta")}
          </Link>
        </nav>
      </div>
    </>
  );
}
