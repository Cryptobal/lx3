"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, RefreshCw, Unlink, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface GmailSettingsProps {
  syncStatus: {
    connected: boolean;
    emailAddress: string;
    lastSyncAt: string;
    totalEmails: number;
  } | null;
}

export function GmailSettings({ syncStatus }: GmailSettingsProps) {
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  const handleSync = async (initial = false) => {
    setSyncing(true);
    try {
      const res = await fetch("/api/growth-os/gmail/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initial }),
      });
      const data = await res.json();
      if (data.ok) {
        toast.success(
          `Sincronizacion completada: ${data.synced} email${data.synced !== 1 ? "s" : ""} procesado${data.synced !== 1 ? "s" : ""}`
        );
        router.refresh();
      } else {
        toast.error(data.error || "Error en la sincronizacion");
      }
    } catch {
      toast.error("Error de conexion");
    } finally {
      setSyncing(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("Desconectar la cuenta de Gmail? Los emails sincronizados se mantendran.")) return;

    setDisconnecting(true);
    try {
      const res = await fetch("/api/growth-os/gmail/disconnect", { method: "POST" });
      const data = await res.json();
      if (data.ok) {
        toast.success("Gmail desconectado");
        router.refresh();
      } else {
        toast.error("Error al desconectar");
      }
    } catch {
      toast.error("Error de conexion");
    } finally {
      setDisconnecting(false);
    }
  };

  if (!syncStatus) {
    // Not connected
    return (
      <div className="space-y-4">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Conecta tu cuenta de Gmail para sincronizar automaticamente los emails
          con tus contactos del CRM.
        </p>
        <a
          href="/api/growth-os/gmail/connect"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Mail className="h-4 w-4" />
          Conectar Gmail
        </a>
        <p className="text-xs text-zinc-500 dark:text-zinc-500">
          Se solicitara acceso de solo lectura a tu cuenta de Gmail (Google Workspace).
        </p>
      </div>
    );
  }

  // Connected
  const lastSync = new Date(syncStatus.lastSyncAt);
  const lastSyncFormatted = lastSync.toLocaleDateString("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="space-y-4">
      {/* Status */}
      <div className="flex items-center gap-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 px-4 py-3">
        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
            Conectado: {syncStatus.emailAddress}
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400">
            {syncStatus.totalEmails} emails sincronizados &middot; Ultima sync: {lastSyncFormatted}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleSync(false)}
          disabled={syncing}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-50"
        >
          {syncing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {syncing ? "Sincronizando..." : "Sincronizar ahora"}
        </button>

        {syncStatus.totalEmails === 0 && (
          <button
            onClick={() => handleSync(true)}
            disabled={syncing}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {syncing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Mail className="h-4 w-4" />
            )}
            Sync inicial (30 dias)
          </button>
        )}

        <button
          onClick={handleDisconnect}
          disabled={disconnecting}
          className="inline-flex items-center gap-2 rounded-lg border border-red-200 dark:border-red-800/50 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
        >
          {disconnecting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Unlink className="h-4 w-4" />
          )}
          Desconectar
        </button>
      </div>
    </div>
  );
}
