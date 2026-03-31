"use client";

import { Link } from "@/lib/i18n/routing";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { AnimateOnScroll } from "@/components/shared/AnimateOnScroll";
import { MessageCircle } from "lucide-react";

interface InlineCTAProps {
  title: string;
  subtitle?: string;
  buttonText?: string;
  buttonHref?: string;
  showWhatsApp?: boolean;
}

export function InlineCTA({
  title,
  subtitle,
  buttonText = "Cotiza ahora",
  buttonHref = "/cotiza",
  showWhatsApp = true,
}: InlineCTAProps) {
  return (
    <SectionWrapper>
      <AnimateOnScroll>
        <div className="relative overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-8 text-center sm:p-12">
          <div className="absolute inset-0 mesh-gradient-intense opacity-40" />
          <div className="relative z-10">
            <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
              {title}
            </h2>
            {subtitle && (
              <p className="mx-auto mt-3 max-w-md text-base text-[var(--text-secondary)]">
                {subtitle}
              </p>
            )}
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={buttonHref as "/"}
                className="inline-flex rounded-full bg-gradient-to-r from-[var(--coral)] to-[#f97316] px-8 py-3.5 text-sm font-semibold text-[#06080E] transition-all hover:shadow-[0_0_24px_var(--coral-glow)]"
              >
                {buttonText}
              </Link>
              {showWhatsApp && (
                <a
                  href="https://wa.me/56982307771"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border-default)] bg-transparent px-8 py-3.5 text-sm font-medium text-[var(--text-primary)] transition-all duration-200 hover:border-[#25D366] hover:text-[#25D366]"
                >
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </AnimateOnScroll>
    </SectionWrapper>
  );
}
