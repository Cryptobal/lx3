import { Link } from "@/lib/i18n/routing";

/**
 * Persistent bottom CTA for mobile. Hidden on lg+ (the header keeps its own
 * persistent CTA there). Right margin clears the floating chat/WhatsApp buttons.
 */
export function MobileCTABar() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border-subtle)] bg-[#06080E]/95 px-4 py-3 backdrop-blur-lg lg:hidden"
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <Link
        href="/cotiza"
        className="mr-20 flex items-center justify-center rounded-full bg-gradient-to-r from-[var(--coral)] to-[#f97316] px-5 py-3 text-sm font-semibold text-[#06080E] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--coral)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#06080E]"
      >
        Cotiza tu proyecto
      </Link>
    </div>
  );
}
