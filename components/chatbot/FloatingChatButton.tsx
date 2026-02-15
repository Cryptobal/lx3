"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { MessageCircle, X } from "lucide-react";
import { ChatWindow } from "./ChatWindow";

export function FloatingChatButton() {
  const t = useTranslations("chatbot");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Don't show on the dedicated diagnostic page (chatbot is already there)
  const isDiagnosticPage = pathname.includes("/diagnostico");
  if (isDiagnosticPage) return null;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close chat" : t("placeholder")}
        className="fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg transition-all hover:bg-accent/90 hover:shadow-xl"
      >
        {open ? (
          <X className="h-5 w-5" />
        ) : (
          <MessageCircle className="h-5 w-5" />
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed right-6 bottom-24 z-50 w-[min(400px,calc(100vw-3rem))] animate-in fade-in slide-in-from-bottom-4">
          <ChatWindow />
        </div>
      )}
    </>
  );
}
