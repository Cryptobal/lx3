// @ts-nocheck
import { Settings, GitBranch, User, Bell } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PipelineSettings } from "@/components/growth-os/settings/PipelineSettings";

async function getPipelineStagesData() {
  if (!prisma) return [];

  const stages = await prisma.pipelineStage.findMany({
    include: {
      _count: {
        select: { deals: true },
      },
    },
    orderBy: { order: "asc" },
  });

  return stages.map((stage) => ({
    id: stage.id,
    name: stage.name,
    color: stage.color ?? "#6B7280",
    order: stage.order,
    isDefault: stage.isDefault ?? false,
    isWon: stage.isWon,
    isLost: stage.isLost,
    _count: { deals: stage._count?.deals ?? 0 },
  }));
}

export default async function SettingsPage() {
  const [session, stages] = await Promise.all([
    auth(),
    getPipelineStagesData().catch(() => []),
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">
          Configuración
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Ajusta la configuración de tu cuenta y del sistema
        </p>
      </div>

      {/* Pipeline Stages */}
      <section className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10">
            <GitBranch className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-zinc-100">
              Etapas del Pipeline
            </h2>
            <p className="text-sm text-zinc-400">
              Configura las etapas por las que pasan tus negocios
            </p>
          </div>
        </div>
        <div className="p-6">
          <PipelineSettings initialStages={stages} />
        </div>
      </section>

      {/* Profile */}
      <section className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-500/10">
            <User className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-zinc-100">
              Perfil
            </h2>
            <p className="text-sm text-zinc-400">
              Información de tu cuenta
            </p>
          </div>
        </div>
        <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">
                Nombre
              </label>
              <div className="px-3 py-2 text-sm bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100">
                {session?.user?.name || "—"}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">
                Email
              </label>
              <div className="px-3 py-2 text-sm bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100">
                {session?.user?.email || "—"}
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs text-zinc-400">
            Para cambiar tu nombre o contraseña, contacta al administrador del sistema.
          </p>
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10">
            <Bell className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-zinc-100">
              Notificaciones
            </h2>
            <p className="text-sm text-zinc-400">
              Configuración de notificaciones por email
            </p>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-zinc-100">
                  Email de notificaciones
                </h3>
                <p className="text-sm text-zinc-400 mt-0.5">
                  Las notificaciones de nuevos contactos, deals y actividad se envían al email configurado en las variables de entorno.
                </p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <code className="px-1.5 py-0.5 text-xs font-mono bg-zinc-700 rounded text-zinc-300">
                      NOTIFICATION_EMAIL
                    </code>
                    <span className="text-zinc-400">
                      — Destinatario de notificaciones
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <code className="px-1.5 py-0.5 text-xs font-mono bg-zinc-700 rounded text-zinc-300">
                      RESEND_API_KEY
                    </code>
                    <span className="text-zinc-400">
                      — API key de Resend para envío de emails
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <code className="px-1.5 py-0.5 text-xs font-mono bg-zinc-700 rounded text-zinc-300">
                      EMAIL_FROM
                    </code>
                    <span className="text-zinc-400">
                      — Dirección de envío (remitente)
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-zinc-500">
              Estas configuraciones se gestionan a nivel de servidor mediante variables de entorno.
              Contacta al administrador para modificarlas.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}