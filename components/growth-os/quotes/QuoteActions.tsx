"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Send, FileText, Pencil, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import type { QuoteStatus } from "@/lib/generated/prisma/client";

interface QuoteActionsProps {
  quoteId: string;
  status: QuoteStatus;
  trackingToken?: string | null;
}

export function QuoteActions({ quoteId, status, trackingToken }: QuoteActionsProps) {
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const handleSend = async () => {
    if (!confirm("Enviar esta cotizacion al cliente por email?")) return;

    setSending(true);
    try {
      const res = await fetch(`/api/growth-os/quotes/${quoteId}/send`, {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al enviar");
      }

      toast.success("Cotizacion enviada al cliente");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al enviar la cotizacion";
      toast.error(message);
    } finally {
      setSending(false);
    }
  };

  const handlePdf = async () => {
    setGeneratingPdf(true);
    try {
      window.open(`/api/growth-os/quotes/${quoteId}/pdf`, "_blank");
    } finally {
      setTimeout(() => setGeneratingPdf(false), 1500);
    }
  };

  const canSend = status === "DRAFT" || status === "VIEWED";
  const canEdit = status === "DRAFT";

  return (
    <div className="flex items-center gap-2">
      {canEdit && (
        <Link
          href={`/admin/quotes/${quoteId}/edit`}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          <Pencil className="w-4 h-4" />
          Editar
        </Link>
      )}

      {trackingToken && (
        <a
          href={`/q/${trackingToken}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Preview
        </a>
      )}

      {canSend && (
        <button
          onClick={handleSend}
          disabled={sending}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {sending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          Enviar al cliente
        </button>
      )}

      <button
        onClick={handlePdf}
        disabled={generatingPdf}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
      >
        {generatingPdf ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileText className="w-4 h-4" />
        )}
        Descargar PDF
      </button>
    </div>
  );
}
