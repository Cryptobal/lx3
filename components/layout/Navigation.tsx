"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils/cn";
import { Menu, X } from "lucide-react";

const navItems = [
  { href: "/servicios" as const, key: "services" },
  { href: "/casos" as const, key: "cases" },
  { href: "/blog" as const, key: "blog" },
  { href: "/sobre-nosotros" as const, key: "about" },
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
            className="text-sm text-white/60 transition-colors hover:text-white"
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
          <X className="h-5 w-5 text-white" />
        ) : (
          <Menu className="h-5 w-5 text-white" />
        )}
      </button>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/95 backdrop-blur-sm transition-all duration-300 md:hidden",
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
              className="text-lg font-medium text-white transition-colors hover:text-accent"
            >
              {t(item.key)}
            </Link>
          ))}
          <Link
            href="/contacto"
            onClick={() => setMobileOpen(false)}
            className="mt-4 rounded-lg bg-gradient-to-r from-accent to-accent-secondary px-6 py-3 text-sm font-medium text-white transition-colors hover:brightness-110"
          >
            {t("cta")}
          </Link>
        </nav>
      </div>
    </>
  );
}
