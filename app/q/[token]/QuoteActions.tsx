"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, MessageSquare, Download, X, Loader2 } from "lucide-react";
import { acceptQuote } from "@/lib/growth-os/actions/quotes";

interface QuoteActionsProps {
  token: string;
  status: string;
  validUntil?: string | null;
}

export function QuoteActions({ token, status, validUntil }: QuoteActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [accepted, setAccepted] = useState(status === "ACCEPTED");
  const [sendingFeedback, setSendingFeedback] = useState(false);

  const isExpired =
    validUntil && new Date(validUntil) < new Date() && status !== "ACCEPTED";

  if (accepted || status === "ACCEPTED") {
    return (
      <div className="rounded-xl border-2 border-green-200 bg-green-50 p-6 sm:p-8 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <Check className="h-7 w-7 text-green-600" />
        </div>
        <h3 className="text-lg font-bold text-green-800">
          Cotizacion aceptada
        </h3>
        <p className="mt-2 text-sm text-green-600">
          Gracias por tu confianza. Nos pondremos en contacto contigo pronto
          para comenzar.
        </p>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-6 sm:p-8 text-center">
        <h3 className="text-lg font-bold text-amber-800">
          Cotizacion expirada
        </h3>
        <p className="mt-2 text-sm text-amber-600">
          Esta cotizacion vencio el{" "}
          {new Date(validUntil!).toLocaleDateString("es-CL", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          . Contactanos en{" "}
          <a
            href="mailto:contacto@lx3.ai"
            className="font-medium underline"
          >
            contacto@lx3.ai
          </a>{" "}
          para solicitar una nueva.
        </p>
      </div>
    );
  }

  const handleAccept = () => {
    startTransition(async () => {
      const result = await acceptQuote(token);
      if (result.success) {
        setAccepted(true);
        router.refresh();
      }
    });
  };

  const handleSendFeedback = async () => {
    if (!feedbackText.trim()) return;
    setSendingFeedback(true);
    try {
      // We need the quote ID — get it from the token-based API
      const res = await fetch(`/api/growth-os/quotes/respond-by-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          action: "request_changes",
          message: feedbackText.trim(),
        }),
      });
      if (res.ok) {
        setShowFeedback(false);
        setFeedbackText("");
        // Show a success message inline
        router.refresh();
      }
    } catch {
      // silently fail
    } finally {
      setSendingFeedback(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <button
          type="button"
          onClick={handleAccept}
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-700 hover:shadow-md disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Check className="h-5 w-5" />
          )}
          {isPending ? "Procesando..." : "Aceptar cotizacion"}
        </button>

        <button
          type="button"
          onClick={() => setShowFeedback(!showFeedback)}
          className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow-md"
        >
          <MessageSquare className="h-5 w-5" />
          Solicitar cambios
        </button>

        <a
          href={`/api/growth-os/quotes/pdf-by-token/${token}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow-md"
        >
          <Download className="h-5 w-5" />
          Descargar PDF
        </a>
      </div>

      {showFeedback && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-700">
              Describe los cambios que necesitas
            </h4>
            <button
              type="button"
              onClick={() => setShowFeedback(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            rows={4}
            placeholder="Por ejemplo: necesito agregar un item adicional, cambiar el plazo de entrega, etc."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
          />
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={handleSendFeedback}
              disabled={sendingFeedback || !feedbackText.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {sendingFeedback && <Loader2 className="h-4 w-4 animate-spin" />}
              {sendingFeedback ? "Enviando..." : "Enviar solicitud"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
