"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils/cn";
import { Menu, X, ChevronDown } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mega-menu data                                                     */
/* ------------------------------------------------------------------ */

const megaMenuData = {
  servicios: {
    label: "Servicios",
    columns: [
      {
        title: "Desarrollo",
        links: [
          { href: "/servicios/sitios-web", label: "Sitios Web" },
          { href: "/servicios/desarrollo-web", label: "Desarrollo Web" },
          { href: "/servicios/landing-pages", label: "Landing Pages" },
          { href: "/servicios/desarrollo-fullstack", label: "Desarrollo Fullstack" },
          { href: "/servicios/tienda-online", label: "Tienda Online" },
          { href: "/servicios/ecommerce-medida", label: "E-commerce a Medida" },
        ],
      },
      {
        title: "Software & CRM",
        links: [
          { href: "/servicios/aplicaciones-internas", label: "Aplicaciones Internas" },
          { href: "/servicios/crm-personalizado", label: "CRM Personalizado" },
          { href: "/servicios/sistema-cotizaciones", label: "Sistema Cotizaciones" },
          { href: "/servicios/automatizacion-ia", label: "Automatización IA" },
        ],
      },
      {
        title: "Estrategia",
        links: [
          { href: "/servicios/posicionamiento-web", label: "Posicionamiento SEO" },
          { href: "/servicios/consultoria", label: "Consultoría" },
        ],
      },
    ],
  },
  soluciones: {
    label: "Soluciones",
    columns: [
      {
        title: "Por industria",
        links: [
          { href: "/soluciones/empresas-seguridad", label: "Empresas de Seguridad" },
          { href: "/soluciones/clinicas", label: "Clínicas y Salud" },
          { href: "/soluciones/logistica", label: "Logística y Transporte" },
          { href: "/soluciones/pymes", label: "PyMEs" },
          { href: "/soluciones/constructoras", label: "Constructoras" },
          { href: "/soluciones/restaurantes", label: "Restaurantes" },
          { href: "/soluciones/retail", label: "Retail y Comercio" },
        ],
      },
    ],
  },
  precios: {
    label: "Precios",
    columns: [
      {
        title: "Por servicio",
        links: [
          { href: "/precio/pagina-web", label: "Página Web" },
          { href: "/precio/desarrollo-web", label: "Aplicaciones Web" },
          { href: "/precio/software-empresarial", label: "Software Empresarial" },
          { href: "/precio/crm", label: "CRM" },
          { href: "/precio/tienda-online", label: "Tienda Online" },
          { href: "/precio/seo", label: "SEO Mensual" },
        ],
      },
    ],
  },
} as const;

type MegaKey = keyof typeof megaMenuData;

const simpleLinks = [
  { href: "/casos", key: "cases" },
  { href: "/blog", key: "blog" },
  { href: "/sobre-nosotros", key: "about" },
] as const;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function Header() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMega, setOpenMega] = useState<MegaKey | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<MegaKey | null>(null);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    setMobileExpanded(null);
  }, []);

  const handleMegaEnter = useCallback((key: MegaKey) => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setOpenMega(key);
  }, []);

  const handleMegaLeave = useCallback(() => {
    closeTimeout.current = setTimeout(() => setOpenMega(null), 150);
  }, []);

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
            width={140}
            height={40}
            className="h-8 w-auto"
          />
        </Link>

        {/* ---- Desktop Nav ---- */}
        <nav className="hidden items-center gap-6 lg:flex">
          {/* Mega-menu triggers */}
          {(Object.keys(megaMenuData) as MegaKey[]).map((key) => (
            <div
              key={key}
              className="relative"
              onMouseEnter={() => handleMegaEnter(key)}
              onMouseLeave={handleMegaLeave}
            >
              <button
                className={cn(
                  "flex items-center gap-1 text-sm transition-colors duration-200",
                  openMega === key
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
              >
                {megaMenuData[key].label}
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-200",
                    openMega === key && "rotate-180"
                  )}
                />
              </button>

              {/* Mega dropdown */}
              <div
                className={cn(
                  "absolute left-1/2 top-full pt-3 transition-all duration-200",
                  openMega === key
                    ? "pointer-events-auto translate-y-0 opacity-100"
                    : "pointer-events-none -translate-y-2 opacity-0"
                )}
                style={{ transform: openMega === key ? "translateX(-50%)" : "translateX(-50%) translateY(-8px)" }}
              >
                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]/95 p-5 shadow-2xl backdrop-blur-xl">
                  <div className="flex gap-8">
                    {megaMenuData[key].columns.map((col) => (
                      <div key={col.title} className="min-w-[180px]">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-tertiary)]">
                          {col.title}
                        </span>
                        <ul className="mt-2.5 space-y-1">
                          {col.links.map((link) => (
                            <li key={link.href}>
                              <Link
                                href={link.href as "/"}
                                onClick={() => setOpenMega(null)}
                                className="block rounded-md px-2.5 py-1.5 text-sm text-[var(--text-secondary)] transition-all duration-150 hover:bg-[var(--coral-light)] hover:text-[var(--coral)]"
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Simple links */}
          {simpleLinks.map((item) => (
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
        <div className="flex items-center gap-3">
          <Link
            href="/cotiza"
            className="hidden rounded-full bg-gradient-to-r from-[var(--coral)] to-[#f97316] px-5 py-2.5 text-sm font-semibold text-[#06080E] transition-all duration-300 hover:shadow-[0_0_20px_var(--coral-glow)] lg:inline-flex"
          >
            {t("cotizaTuWeb")}
          </Link>

          <Link
            href={{ pathname: "/cotiza", query: { tab: "software" } }}
            className="hidden rounded-[11px] bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-[var(--accent-hover)] hover:shadow-[0_0_20px_var(--accent-glow)] lg:inline-flex"
          >
            {t("ctaSoftware")}
          </Link>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="relative z-50 flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-elevated)] lg:hidden"
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
          "fixed inset-x-0 top-0 z-40 overflow-y-auto bg-[#06080E]/98 backdrop-blur-xl transition-all duration-500 ease-out lg:hidden",
          mobileOpen
            ? "pointer-events-auto max-h-screen opacity-100"
            : "pointer-events-none max-h-0 opacity-0"
        )}
        style={{ maxHeight: mobileOpen ? "100vh" : 0 }}
      >
        <nav className="flex flex-col gap-2 px-6 pb-10 pt-24">
          {/* Mega sections as accordion */}
          {(Object.keys(megaMenuData) as MegaKey[]).map((key) => (
            <div key={key}>
              <button
                onClick={() =>
                  setMobileExpanded(mobileExpanded === key ? null : key)
                }
                className="flex w-full items-center justify-between py-3 text-lg font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
              >
                {megaMenuData[key].label}
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    mobileExpanded === key && "rotate-180"
                  )}
                />
              </button>
              {mobileExpanded === key && (
                <div className="mb-2 ml-2 space-y-4 border-l border-[var(--border-subtle)] pl-4">
                  {megaMenuData[key].columns.map((col) => (
                    <div key={col.title}>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-tertiary)]">
                        {col.title}
                      </span>
                      <ul className="mt-1.5 space-y-1">
                        {col.links.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href as "/"}
                              onClick={closeMobile}
                              className="block py-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--coral)]"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Simple links */}
          {simpleLinks.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={closeMobile}
              className="py-3 text-lg font-medium text-[var(--text-secondary)] transition-colors duration-200 hover:text-[var(--text-primary)]"
            >
              {t(item.key)}
            </Link>
          ))}

          {/* Mobile CTAs */}
          <Link
            href="/cotiza"
            onClick={closeMobile}
            className="mt-4 w-full rounded-full bg-gradient-to-r from-[var(--coral)] to-[#f97316] px-6 py-3 text-center text-sm font-semibold text-[#06080E] transition-all duration-300 hover:shadow-[0_0_20px_var(--coral-glow)]"
          >
            {t("cotizaTuWeb")}
          </Link>

          <Link
            href={{ pathname: "/cotiza", query: { tab: "software" } }}
            onClick={closeMobile}
            className="w-full rounded-[11px] bg-[var(--accent)] px-6 py-3 text-center text-sm font-medium text-white transition-all duration-300 hover:bg-[var(--accent-hover)] hover:shadow-[0_0_20px_var(--accent-glow)]"
          >
            {t("ctaSoftware")}
          </Link>
        </nav>
      </div>
    </header>
  );
}
