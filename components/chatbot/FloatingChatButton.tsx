"use client";

import { useState } from "react";
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

  const isDiagnosticPage = pathname.includes("/diagnostico");

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

      {/* Floating button — mismo tamaño y forma circular que WhatsApp */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close chat" : t("placeholder")}
        className="fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/25 transition-all hover:bg-accent-hover hover:shadow-xl hover:shadow-accent/30 active:scale-95"
      >
        {open ? (
          <X className="h-5 w-5 transition-transform duration-200" />
        ) : (
          <MessageCircle className="h-5 w-5 transition-transform duration-200" />
        )}
      </button>

      {/* Chat panel — fullscreen on mobile, floating panel on desktop (por encima de los dos FAB) */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-50 flex flex-col sm:hidden"
            style={{
              height: "100dvh",
              maxHeight: "-webkit-fill-available",
              paddingBottom: "env(safe-area-inset-bottom, 0px)",
            }}
          >
            <ChatWindow onClose={() => setOpen(false)} />
          </div>
          <div className="fixed right-6 bottom-[10rem] z-50 hidden h-[600px] w-[420px] drop-shadow-2xl sm:block">
            <ChatWindow onClose={() => setOpen(false)} />
          </div>
        </>
      )}
    </>
  );
}
