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
  { href: "/contacto", key: "contact" },
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
          ? "border-b border-white/5 bg-[#0B1120]/90 backdrop-blur-lg"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* ---- Logo ---- */}
        <Link
          href="/"
          className="group relative font-display text-xl font-bold tracking-tight text-white transition-all duration-300"
        >
          <span className="bg-gradient-to-r from-white to-white bg-clip-text text-transparent transition-all duration-300 group-hover:from-accent group-hover:to-accent-secondary">
            LX3
          </span>
        </Link>

        {/* ---- Desktop Nav ---- */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="relative text-sm text-white/60 transition-colors duration-200 hover:text-white after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-gradient-to-r after:from-accent after:to-accent-secondary after:transition-all after:duration-300 hover:after:w-full"
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
            className="group relative hidden overflow-hidden rounded-lg bg-gradient-to-r from-accent to-accent-secondary px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:shadow-[0_0_24px_rgba(6,182,212,0.25),0_0_64px_rgba(6,182,212,0.1)] md:inline-flex"
          >
            <span className="relative z-10">{t("cta")}</span>
            <span className="absolute inset-0 bg-gradient-to-r from-accent/80 to-accent-secondary/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </Link>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="relative z-50 flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-white/5 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5 text-white" />
            ) : (
              <Menu className="h-5 w-5 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* ---- Mobile Slide-Down Panel ---- */}
      <div
        className={cn(
          "fixed inset-x-0 top-0 z-40 overflow-hidden bg-[#0B1120]/98 backdrop-blur-xl transition-all duration-500 ease-out md:hidden",
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
              className="text-lg font-medium text-white/80 transition-colors duration-200 hover:text-white"
            >
              {t(item.key)}
            </Link>
          ))}

          {/* Mobile CTA */}
          <Link
            href="/contacto"
            onClick={closeMobile}
            className="mt-4 w-full max-w-xs rounded-lg bg-gradient-to-r from-accent to-accent-secondary px-6 py-3 text-center text-sm font-medium text-white transition-all duration-300 hover:shadow-[0_0_24px_rgba(6,182,212,0.25),0_0_64px_rgba(6,182,212,0.1)]"
          >
            {t("cta")}
          </Link>
        </nav>
      </div>
    </header>
  );
}
