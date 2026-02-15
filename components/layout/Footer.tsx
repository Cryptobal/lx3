import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  return (
    <footer className="border-t border-foreground/5 bg-background px-6 py-12 dark:border-white/5 dark:bg-primary">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <p className="text-lg font-semibold text-foreground dark:text-white">
              LX3
            </p>
            <p className="mt-2 text-sm text-foreground/50 dark:text-white/50">
              {t("tagline")}
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-3">
            <Link
              href="/como-trabajamos"
              className="text-sm text-foreground/50 transition-colors hover:text-foreground dark:text-white/50 dark:hover:text-white"
            >
              {tNav("howWeWork")}
            </Link>
            <Link
              href="/capacidades"
              className="text-sm text-foreground/50 transition-colors hover:text-foreground dark:text-white/50 dark:hover:text-white"
            >
              {tNav("capabilities")}
            </Link>
            <Link
              href="/perspectivas"
              className="text-sm text-foreground/50 transition-colors hover:text-foreground dark:text-white/50 dark:hover:text-white"
            >
              {tNav("insights")}
            </Link>
            <Link
              href="/contacto"
              className="text-sm text-foreground/50 transition-colors hover:text-foreground dark:text-white/50 dark:hover:text-white"
            >
              {tNav("contact")}
            </Link>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-3">
            <a
              href="/privacidad"
              className="text-sm text-foreground/50 transition-colors hover:text-foreground dark:text-white/50 dark:hover:text-white"
            >
              {t("privacy")}
            </a>
            <a
              href="/terminos"
              className="text-sm text-foreground/50 transition-colors hover:text-foreground dark:text-white/50 dark:hover:text-white"
            >
              {t("terms")}
            </a>
          </div>
        </div>

        <div className="mt-12 border-t border-foreground/5 pt-6 dark:border-white/5">
          <p className="text-xs text-foreground/30 dark:text-white/30">
            {t("legal")}
          </p>
        </div>
      </div>
    </footer>
  );
}
