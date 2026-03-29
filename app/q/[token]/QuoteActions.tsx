"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, MessageSquare, Download, X } from "lucide-react";
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

  const isExpired =
    validUntil && new Date(validUntil) < new Date() && status !== "ACCEPTED";

  if (accepted || status === "ACCEPTED") {
    return (
      <div className="rounded-xl border-2 border-green-200 bg-green-50 p-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-green-800">
          Cotizacion aceptada
        </h3>
        <p className="mt-1 text-sm text-green-600">
          Gracias por tu confianza. Nos pondremos en contacto contigo pronto.
        </p>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-6 text-center">
        <h3 className="text-lg font-semibold text-amber-800">
          Cotizacion expirada
        </h3>
        <p className="mt-1 text-sm text-amber-600">
          Esta cotizacion vencio el{" "}
          {new Date(validUntil!).toLocaleDateString("es-CL", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          . Contactanos para solicitar una nueva cotizacion.
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleAccept}
          disabled={isPending}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
        >
          <Check className="h-5 w-5" />
          {isPending ? "Procesando..." : "Aceptar cotizacion"}
        </button>

        <button
          type="button"
          onClick={() => setShowFeedback(!showFeedback)}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
        >
          <MessageSquare className="h-5 w-5" />
          Solicitar cambios
        </button>

        <button
          type="button"
          disabled
          className="group relative inline-flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-gray-50 px-6 py-3 text-sm font-semibold text-gray-400 cursor-not-allowed"
          title="Proximamente"
        >
          <Download className="h-5 w-5" />
          Descargar PDF
          <span className="absolute -top-2 right-2 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-600">
            Pronto
          </span>
        </button>
      </div>

      {showFeedback && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-700">
              Solicitar cambios
            </h4>
            <button
              type="button"
              onClick={() => setShowFeedback(false)}
              className="rounded p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            rows={4}
            placeholder="Describe los cambios que necesitas..."
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={() => {
                setShowFeedback(false);
                setFeedbackText("");
              }}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Enviar solicitud
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
