"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Send, FileText, Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { QuoteStatus } from "@/lib/generated/prisma/client";

interface QuoteActionsProps {
  quoteId: string;
  status: QuoteStatus;
}

export function QuoteActions({ quoteId, status }: QuoteActionsProps) {
  const router = useRouter();
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!confirm("¿Enviar esta cotización al cliente por email?")) return;

    setSending(true);
    try {
      const res = await fetch(`/api/growth-os/quotes/${quoteId}/send`, {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al enviar");
      }

      toast.success("Cotización enviada al cliente");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al enviar la cotización";
      toast.error(message);
    } finally {
      setSending(false);
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
        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        onClick={() => toast.info("Generación de PDF próximamente")}
      >
        <FileText className="w-4 h-4" />
        Generar PDF
      </button>
    </div>
  );
}
