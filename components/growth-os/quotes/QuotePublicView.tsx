"use client";

import { useState } from "react";
import { CheckCircle, MessageSquare, Download, Loader2 } from "lucide-react";

interface QuotePublicViewProps {
  quoteId: string;
  status: string;
}

export function QuotePublicView({ quoteId, status }: QuotePublicViewProps) {
  const [showChangesForm, setShowChangesForm] = useState(false);
  const [changesMessage, setChangesMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [accepted, setAccepted] = useState(status === "ACCEPTED");
  const [changesRequested, setChangesRequested] = useState(false);

  async function handleAccept() {
    if (!confirm("¿Confirmas que deseas aceptar esta cotización?")) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/growth-os/quotes/${quoteId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "accept" }),
      });
      if (res.ok) {
        setAccepted(true);
      }
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRequestChanges() {
    if (!changesMessage.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/growth-os/quotes/${quoteId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "request_changes",
          message: changesMessage,
        }),
      });
      if (res.ok) {
        setChangesRequested(true);
        setShowChangesForm(false);
      }
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
    }
  }

  if (accepted) {
    return (
      <div className="text-center py-2">
        <CheckCircle className="h-10 w-10 text-emerald-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-emerald-800">
          Cotización Aceptada
        </h3>
        <p className="text-sm text-emerald-600 mt-1">
          Hemos recibido tu aceptación. Nos pondremos en contacto pronto.
        </p>
      </div>
    );
  }

  if (changesRequested) {
    return (
      <div className="text-center py-2">
        <MessageSquare className="h-10 w-10 text-blue-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-blue-800">
          Solicitud Enviada
        </h3>
        <p className="text-sm text-blue-600 mt-1">
          Hemos recibido tu solicitud de cambios. Te contactaremos pronto.
        </p>
      </div>
    );
  }

  if (status === "REJECTED" || status === "EXPIRED") {
    return (
      <div className="text-center py-2">
        <p className="text-sm text-zinc-500">
          Esta cotización ya no está disponible para acciones.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() =>
            window.alert("Descarga de PDF disponible próximamente")
          }
          className="flex-1 flex items-center justify-center gap-2 border border-zinc-300 text-zinc-700 px-6 py-3 rounded-lg font-medium hover:bg-zinc-100 transition-colors"
        >
          <Download className="h-5 w-5" />
          Descargar PDF
        </button>
        <button
          onClick={handleAccept}
          disabled={submitting}
          className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
        >
          {submitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <CheckCircle className="h-5 w-5" />
          )}
          Aceptar Cotización
        </button>
        <button
          onClick={() => setShowChangesForm(!showChangesForm)}
          disabled={submitting}
          className="flex-1 flex items-center justify-center gap-2 border border-zinc-300 text-zinc-700 px-6 py-3 rounded-lg font-medium hover:bg-zinc-100 disabled:opacity-50 transition-colors"
        >
          <MessageSquare className="h-5 w-5" />
          Solicitar Cambios
        </button>
      </div>

      {showChangesForm && (
        <div className="border border-zinc-200 rounded-lg p-4 space-y-3">
          <label className="block text-sm font-medium text-zinc-700">
            Describe los cambios que necesitas
          </label>
          <textarea
            value={changesMessage}
            onChange={(e) => setChangesMessage(e.target.value)}
            placeholder="Ej: Necesito agregar un servicio adicional de mantenimiento..."
            className="w-full border border-zinc-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 resize-none"
            rows={4}
          />
          <div className="flex items-center gap-3">
            <button
              onClick={handleRequestChanges}
              disabled={submitting || !changesMessage.trim()}
              className="inline-flex items-center gap-2 bg-zinc-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800 disabled:opacity-50 transition-colors"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              Enviar Solicitud
            </button>
            <button
              onClick={() => {
                setShowChangesForm(false);
                setChangesMessage("");
              }}
              className="text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
