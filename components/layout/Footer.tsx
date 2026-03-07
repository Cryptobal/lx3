import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";

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

  return (
    <footer className="border-t border-white/5 bg-[#0A0A0A]">
      <div className="mx-auto max-w-6xl px-6 py-16">
        {/* Main grid */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1 — Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="font-display text-xl font-bold text-white">LX3</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/50">
              {t("tagline")}
            </p>
            <p className="mt-4 text-sm text-white/30">{t("location")}</p>
          </div>

          {/* Column 2 — Servicios */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/70">
              {t("services")}
            </h4>
            <ul className="mt-4 flex flex-col gap-3">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Empresa */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/70">
              {t("company")}
            </h4>
            <ul className="mt-4 flex flex-col gap-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Conecta */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/70">
              {t("connect")}
            </h4>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <a
                  href="https://wa.me/56982307771"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/50 transition-colors duration-200 hover:text-white"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="mailto:hola@lx3.ai"
                  className="text-sm text-white/50 transition-colors duration-200 hover:text-white"
                >
                  hola@lx3.ai
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-xs text-white/30">{t("legal")}</p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-xs text-white/30 transition-colors duration-200 hover:text-white/60"
            >
              {t("privacy")}
            </a>
            <a
              href="#"
              className="text-xs text-white/30 transition-colors duration-200 hover:text-white/60"
            >
              {t("terms")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
