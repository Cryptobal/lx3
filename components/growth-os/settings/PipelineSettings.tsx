"use client";

import { useState, useTransition } from "react";
import {
  GripVertical,
  Plus,
  Pencil,
  Trash2,
  Trophy,
  XCircle,
  X,
} from "lucide-react";
import { Badge } from "@/components/growth-os/shared/Badge";
import { toast } from "sonner";

interface Stage {
  id: string;
  name: string;
  order: number;
  color: string | null;
  isDefault?: boolean;
  isWon: boolean;
  isLost: boolean;
  _count?: { deals: number };
}

interface PipelineSettingsProps {
  initialStages: Stage[];
}

interface StageFormData {
  name: string;
  color: string;
  isWon: boolean;
  isLost: boolean;
}

const DEFAULT_COLORS = [
  "#6B7280",
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
];

export function PipelineSettings({ initialStages }: PipelineSettingsProps) {
  const [stages, setStages] = useState<Stage[]>(initialStages);
  const [showModal, setShowModal] = useState(false);
  const [editingStage, setEditingStage] = useState<Stage | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState<StageFormData>({
    name: "",
    color: "#3B82F6",
    isWon: false,
    isLost: false,
  });

  function openAddModal() {
    setEditingStage(null);
    setForm({ name: "", color: "#3B82F6", isWon: false, isLost: false });
    setShowModal(true);
  }

  function openEditModal(stage: Stage) {
    setEditingStage(stage);
    setForm({
      name: stage.name,
      color: stage.color ?? "#6B7280",
      isWon: stage.isWon,
      isLost: stage.isLost,
    });
    setShowModal(true);
  }

  function handleSave() {
    if (!form.name.trim()) {
      toast.error("El nombre es requerido");
      return;
    }

    startTransition(async () => {
      try {
        const url = editingStage
          ? `/api/growth-os/settings/stages/${editingStage.id}`
          : "/api/growth-os/settings/stages";

        const method = editingStage ? "PUT" : "POST";
        const body = editingStage
          ? { ...form }
          : { ...form, order: stages.length };

        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error ?? "Error al guardar");
        }

        const { data } = await res.json();

        if (editingStage) {
          setStages((prev) =>
            prev.map((s) => (s.id === editingStage.id ? { ...s, ...data } : s))
          );
          toast.success("Etapa actualizada");
        } else {
          setStages((prev) => [...prev, { ...data, _count: { deals: 0 } }]);
          toast.success("Etapa creada");
        }

        setShowModal(false);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Error al guardar"
        );
      }
    });
  }

  function handleDelete(stageId: string) {
    startTransition(async () => {
      try {
        const res = await fetch(
          `/api/growth-os/settings/stages/${stageId}`,
          { method: "DELETE" }
        );

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error ?? "Error al eliminar");
        }

        setStages((prev) => prev.filter((s) => s.id !== stageId));
        setDeleteConfirm(null);
        toast.success("Etapa eliminada");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Error al eliminar"
        );
      }
    });
  }

  const dealCount = (stage: Stage) => stage._count?.deals ?? 0;

  return (
    <div>
      <div className="rounded-lg border border-zinc-800 bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">
              Etapas del Pipeline
            </h2>
            <p className="mt-0.5 text-sm text-zinc-400">
              Configura las etapas por las que pasan los negocios
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" />
            Agregar etapa
          </button>
        </div>

        <div className="divide-y divide-zinc-800">
          {stages.map((stage) => (
            <div
              key={stage.id}
              className="flex items-center gap-4 px-6 py-3 transition-colors hover:bg-zinc-800/50"
            >
              <GripVertical className="h-4 w-4 shrink-0 text-zinc-600" />

              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: stage.color ?? "#6B7280" }}
              />

              <span className="min-w-[140px] font-medium text-zinc-100">
                {stage.name}
              </span>

              <span className="text-xs text-zinc-500">#{stage.order}</span>

              <div className="flex items-center gap-1.5">
                {stage.isWon && (
                  <Badge label="Ganado" color="green" size="sm" />
                )}
                {stage.isLost && (
                  <Badge label="Perdido" color="red" size="sm" />
                )}
                {stage.isDefault && (
                  <Badge label="Default" color="blue" size="sm" />
                )}
              </div>

              <span className="ml-auto text-xs text-zinc-500">
                {dealCount(stage)} negocios
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(stage)}
                  className="rounded p-1 text-zinc-500 transition-colors hover:bg-zinc-700 hover:text-zinc-300"
                  title="Editar"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirm(stage.id)}
                  disabled={dealCount(stage) > 0}
                  className="rounded p-1 text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-30"
                  title={
                    dealCount(stage) > 0
                      ? "No se puede eliminar: tiene negocios asociados"
                      : "Eliminar"
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          {stages.length === 0 && (
            <div className="px-6 py-8 text-center text-sm text-zinc-500">
              No hay etapas configuradas. Agrega una para comenzar.
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-zinc-100">
              Eliminar etapa
            </h3>
            <p className="mt-2 text-sm text-zinc-400">
              Esta accion no se puede deshacer. La etapa sera eliminada
              permanentemente.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="rounded-lg border border-zinc-700 px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={isPending}
                className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500 disabled:opacity-50"
              >
                {isPending ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-zinc-100">
                {editingStage ? "Editar etapa" : "Nueva etapa"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-300">
                  Nombre
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Ej: Negociacion"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-300">
                  Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setForm((prev) => ({ ...prev, color: c }))}
                      className={`h-8 w-8 rounded-full border-2 transition-all ${
                        form.color === c
                          ? "border-zinc-100 scale-110"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm text-zinc-300">
                  <input
                    type="checkbox"
                    checked={form.isWon}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        isWon: e.target.checked,
                        isLost: e.target.checked ? false : prev.isLost,
                      }))
                    }
                    className="rounded border-zinc-600 bg-zinc-800"
                  />
                  <Trophy className="h-4 w-4 text-green-400" />
                  Etapa ganada
                </label>
                <label className="flex items-center gap-2 text-sm text-zinc-300">
                  <input
                    type="checkbox"
                    checked={form.isLost}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        isLost: e.target.checked,
                        isWon: e.target.checked ? false : prev.isWon,
                      }))
                    }
                    className="rounded border-zinc-600 bg-zinc-800"
                  />
                  <XCircle className="h-4 w-4 text-red-400" />
                  Etapa perdida
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-zinc-700 px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={isPending}
                className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
              >
                {isPending ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
