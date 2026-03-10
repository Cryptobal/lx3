"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils/cn";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/servicios", key: "services" },
  { href: "/casos", key: "cases" },
  { href: "/blog", key: "blog" },
  { href: "/sobre-nosotros", key: "about" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-[var(--border-subtle)] bg-[#06080E]/90 backdrop-blur-lg"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* ---- Logo ---- */}
        <Link href="/" className="flex items-center">
          <img
            src="/logo/LX3_logotipo_dark-bg.svg"
            alt="LX3 — Software Studio"
            className="h-8 w-auto"
          />
        </Link>

        {/* ---- Desktop Nav ---- */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="relative text-sm text-[var(--text-secondary)] transition-colors duration-200 hover:text-[var(--text-primary)] after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-[var(--accent)] after:transition-all after:duration-300 hover:after:w-full"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        {/* ---- Right Side ---- */}
        <div className="flex items-center gap-4">
          {/* CTA Button - Desktop */}
          <Link
            href="/contacto"
            className="hidden rounded-[11px] bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-[var(--accent-hover)] hover:shadow-[0_0_20px_var(--accent-glow)] md:inline-flex"
          >
            {t("cta")}
          </Link>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="relative z-50 flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-elevated)] md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5 text-[var(--text-primary)]" />
            ) : (
              <Menu className="h-5 w-5 text-[var(--text-primary)]" />
            )}
          </button>
        </div>
      </div>

      {/* ---- Mobile Slide-Down Panel ---- */}
      <div
        className={cn(
          "fixed inset-x-0 top-0 z-40 overflow-hidden bg-[#06080E]/98 backdrop-blur-xl transition-all duration-500 ease-out md:hidden",
          mobileOpen
            ? "pointer-events-auto max-h-screen opacity-100"
            : "pointer-events-none max-h-0 opacity-0"
        )}
      >
        <nav className="flex flex-col items-center gap-6 px-6 pb-10 pt-24">
          {navLinks.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={closeMobile}
              className="text-lg font-medium text-[var(--text-secondary)] transition-colors duration-200 hover:text-[var(--text-primary)]"
            >
              {t(item.key)}
            </Link>
          ))}

          {/* Mobile CTA */}
          <Link
            href="/contacto"
            onClick={closeMobile}
            className="mt-4 w-full max-w-xs rounded-[11px] bg-[var(--accent)] px-6 py-3 text-center text-sm font-medium text-white transition-all duration-300 hover:bg-[var(--accent-hover)] hover:shadow-[0_0_20px_var(--accent-glow)]"
          >
            {t("cta")}
          </Link>
        </nav>
      </div>
    </header>
  );
}
