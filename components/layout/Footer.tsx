import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { EmailLink } from "@/components/shared/EmailLink";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tServices = useTranslations("services");

  const serviceLinks = [
    { href: "/servicios/aplicaciones-internas" as const, label: tServices("s1Title") },
    { href: "/servicios/automatizacion-ia" as const, label: tServices("s2Title") },
    { href: "/servicios/sitios-web" as const, label: tServices("s3Title") },
    { href: "/servicios/consultoria" as const, label: tServices("s4Title") },
  ];

  const companyLinks = [
    { href: "/sobre-nosotros" as const, label: tNav("about") },
    { href: "/casos" as const, label: tNav("cases") },
    { href: "/blog" as const, label: tNav("blog") },
    { href: "/contacto" as const, label: tNav("contact") },
  ];

  const baseSocialClass =
    "flex h-9 w-9 items-center justify-center rounded-lg text-white transition-colors duration-200";
  const socialColors: Record<string, string> = {
    instagram: "bg-[#E1306C] hover:bg-[#E1306C]/80",
    linkedin: "bg-[#0A66C2] hover:bg-[#0A66C2]/80",
  };

  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-deep)]">
      <div className="mx-auto max-w-6xl px-6 py-16">
        {/* Main grid */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1 — Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block">
              <img
                src="/logo/LX3_logotipo_dark-bg.svg"
                alt="LX3"
                className="h-6 w-auto opacity-80"
              />
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[var(--text-tertiary)]">
              {t("tagline")}
            </p>
            <p className="mt-4 text-sm text-[var(--text-tertiary)]">{t("location")}</p>
          </div>

          {/* Column 2 — Servicios */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
              {t("services")}
            </h4>
            <ul className="mt-4 flex flex-col gap-3">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--text-tertiary)] transition-colors duration-200 hover:text-[var(--text-primary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Empresa */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
              {t("company")}
            </h4>
            <ul className="mt-4 flex flex-col gap-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--text-tertiary)] transition-colors duration-200 hover:text-[var(--text-primary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Conecta */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
              {t("connect")}
            </h4>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <a
                  href="https://wa.me/56982307771"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="text-sm text-[var(--text-tertiary)] transition-colors duration-200 hover:text-[var(--text-primary)]"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <EmailLink
                  email="contacto@lx3.ai"
                  className="text-sm text-[var(--text-tertiary)] transition-colors duration-200 hover:text-[var(--text-primary)]"
                />
              </li>
            </ul>

            {/* Social media */}
            <div className="mt-6 flex gap-4">
              <a
                href="https://www.instagram.com/lx3_ai"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className={`${baseSocialClass} ${socialColors.instagram}`}
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/lx3-ai"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className={`${baseSocialClass} ${socialColors.linkedin}`}
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[var(--border-subtle)] pt-8 sm:flex-row">
          <p className="text-xs text-[var(--text-tertiary)]">{t("legal")}</p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-xs text-[var(--text-tertiary)] transition-colors duration-200 hover:text-[var(--text-secondary)]"
            >
              {t("privacy")}
            </a>
            <a
              href="#"
              className="text-xs text-[var(--text-tertiary)] transition-colors duration-200 hover:text-[var(--text-secondary)]"
            >
              {t("terms")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
