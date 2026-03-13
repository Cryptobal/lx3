"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { MessageCircle, X } from "lucide-react";

const ChatWindow = dynamic(() => import("./ChatWindow").then((m) => ({ default: m.ChatWindow })), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center rounded-2xl border border-white/10 bg-surface">
      <div className="h-8 w-8 animate-pulse rounded-full bg-accent/20" />
    </div>
  ),
});

export function FloatingChatButton() {
  const t = useTranslations("chatbot");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const isDiagnosticPage = pathname.includes("/diagnostico");

  // Show proactive tooltip after 8 seconds — diferido con requestIdleCallback para no bloquear el hilo principal
  useEffect(() => {
    if (isDiagnosticPage || open || showTooltip) return;

    let timer: ReturnType<typeof setTimeout>;
    let idleId: number | undefined;
    const schedule = () => {
      timer = setTimeout(() => setShowTooltip(true), 8000);
    };
    if (typeof window !== "undefined" && window.requestIdleCallback) {
      idleId = window.requestIdleCallback(schedule, { timeout: 1000 });
    } else {
      schedule();
    }
    return () => {
      if (typeof idleId === "number") window.cancelIdleCallback?.(idleId);
      if (timer) clearTimeout(timer);
    };
  }, [open, isDiagnosticPage, showTooltip]);

  // Dismiss tooltip on scroll
  useEffect(() => {
    if (!showTooltip) return;
    const dismiss = () => setShowTooltip(false);
    window.addEventListener("scroll", dismiss, { once: true });
    return () => window.removeEventListener("scroll", dismiss);
  }, [showTooltip]);

  if (isDiagnosticPage) return null;

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm sm:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Proactive tooltip */}
      {showTooltip && !open && (
        <div className="fixed right-6 bottom-[5.5rem] z-50 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <button
            onClick={() => {
              setShowTooltip(false);
              setOpen(true);
            }}
            className="group relative rounded-xl border border-white/10 bg-surface-elevated px-4 py-3 text-left shadow-xl transition-colors hover:border-accent/30"
          >
            <p className="text-sm text-white/90">{t("tooltip")}</p>
            {/* Arrow */}
            <div className="absolute -bottom-1.5 right-6 h-3 w-3 rotate-45 border-r border-b border-white/10 bg-surface-elevated" />
          </button>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => {
          setShowTooltip(false);
          setOpen(!open);
        }}
        aria-label={open ? "Close chat" : t("placeholder")}
        className="fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/25 transition-all hover:bg-accent-hover hover:shadow-xl hover:shadow-accent/30 active:scale-95"
      >
        {open ? (
          <X className="h-5 w-5 transition-transform duration-200" />
        ) : (
          <MessageCircle className="h-5 w-5 transition-transform duration-200" />
        )}
      </button>

      {/* Chat panel — fullscreen on mobile, floating panel on desktop */}
      {open && (
        <>
          {/* Mobile: fullscreen overlay */}
          <div className="fixed inset-0 z-50 flex flex-col sm:hidden">
            <ChatWindow onClose={() => setOpen(false)} />
          </div>
          {/* Desktop: floating panel on right side */}
          <div className="fixed right-6 bottom-24 z-50 hidden h-[600px] w-[420px] drop-shadow-2xl sm:block">
            <ChatWindow onClose={() => setOpen(false)} />
          </div>
        </>
      )}
    </>
  );
}
