"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils/cn";
import { Navigation } from "./Navigation";
import { LanguageToggle } from "./LanguageToggle";
import { DarkModeToggle } from "./DarkModeToggle";

export function Header() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-foreground/5 bg-background/80 backdrop-blur-lg dark:border-white/5 dark:bg-primary/80"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo / Brand */}
        <Link href="/" className="text-lg font-semibold tracking-tight text-foreground dark:text-white">
          LX3
        </Link>

        {/* Center Nav */}
        <Navigation />

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <DarkModeToggle />
          <LanguageToggle />
          <Link
            href="/diagnostico"
            className="hidden rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90 md:inline-flex"
          >
            {t("cta")}
          </Link>
        </div>
      </div>
    </header>
  );
}
