"use client";

import { useState, useTransition } from "react";
import {
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Trophy,
  XCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/growth-os/shared/Badge";
import {
  createPipelineStage,
  updatePipelineStage,
  deletePipelineStage,
  reorderPipelineStages,
} from "@/lib/growth-os/actions/settings";
import { toast } from "sonner";

interface StageData {
  id: string;
  name: string;
  color: string | null;
  order: number;
  isWon: boolean;
  isLost: boolean;
  dealCount: number;
}

interface PipelineSettingsProps {
  initialStages: StageData[];
}

const PRESET_COLORS = [
  "#6B7280",
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#F97316",
  "#14B8A6",
];

export function PipelineSettings({ initialStages }: PipelineSettingsProps) {
  const [stages, setStages] = useState<StageData[]>(initialStages);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#3B82F6");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleAdd() {
    if (!newName.trim()) return;

    startTransition(async () => {
      try {
        const stage = await createPipelineStage({
          name: newName.trim(),
          color: newColor,
        });
        setStages((prev) => [
          ...prev,
          {
            id: stage.id,
            name: stage.name,
            color: stage.color,
            order: stage.order,
            isWon: stage.isWon,
            isLost: stage.isLost,
            dealCount: 0,
          },
        ]);
        setNewName("");
        toast.success("Etapa creada");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Error al crear etapa"
        );
      }
    });
  }

  function handleStartEdit(stage: StageData) {
    setEditingId(stage.id);
    setEditName(stage.name);
    setEditColor(stage.color || "#6B7280");
  }

  function handleSaveEdit(id: string) {
    if (!editName.trim()) return;

    startTransition(async () => {
      try {
        await updatePipelineStage(id, {
          name: editName.trim(),
          color: editColor,
        });
        setStages((prev) =>
          prev.map((s) =>
            s.id === id ? { ...s, name: editName.trim(), color: editColor } : s
          )
        );
        setEditingId(null);
        toast.success("Etapa actualizada");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Error al actualizar"
        );
      }
    });
  }

  function handleToggleWon(stage: StageData) {
    startTransition(async () => {
      try {
        const newIsWon = !stage.isWon;
        await updatePipelineStage(stage.id, {
          isWon: newIsWon,
          isLost: false,
        });
        setStages((prev) =>
          prev.map((s) =>
            s.id === stage.id
              ? { ...s, isWon: newIsWon, isLost: false }
              : s
          )
        );
        toast.success(newIsWon ? "Marcada como ganada" : "Desmarcada");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Error al actualizar"
        );
      }
    });
  }

  function handleToggleLost(stage: StageData) {
    startTransition(async () => {
      try {
        const newIsLost = !stage.isLost;
        await updatePipelineStage(stage.id, {
          isLost: newIsLost,
          isWon: false,
        });
        setStages((prev) =>
          prev.map((s) =>
            s.id === stage.id
              ? { ...s, isLost: newIsLost, isWon: false }
              : s
          )
        );
        toast.success(newIsLost ? "Marcada como perdida" : "Desmarcada");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Error al actualizar"
        );
      }
    });
  }

  function handleDelete(stage: StageData) {
    if (stage.dealCount > 0) {
      toast.error(
        `No se puede eliminar: tiene ${stage.dealCount} negocio(s) asociado(s)`
      );
      return;
    }

    startTransition(async () => {
      try {
        await deletePipelineStage(stage.id);
        setStages((prev) => prev.filter((s) => s.id !== stage.id));
        toast.success("Etapa eliminada");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Error al eliminar"
        );
      }
    });
  }

  function handleMoveUp(index: number) {
    if (index === 0) return;

    const updated = [...stages];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];

    const reordered = updated.map((s, i) => ({ ...s, order: i }));
    setStages(reordered);

    startTransition(async () => {
      try {
        await reorderPipelineStages(
          reordered.map((s) => ({ id: s.id, order: s.order }))
        );
      } catch (error) {
        setStages(stages); // revert
        toast.error("Error al reordenar");
      }
    });
  }

  function handleMoveDown(index: number) {
    if (index === stages.length - 1) return;

    const updated = [...stages];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];

    const reordered = updated.map((s, i) => ({ ...s, order: i }));
    setStages(reordered);

    startTransition(async () => {
      try {
        await reorderPipelineStages(
          reordered.map((s) => ({ id: s.id, order: s.order }))
        );
      } catch (error) {
        setStages(stages); // revert
        toast.error("Error al reordenar");
      }
    });
  }

  return (
    <div className="space-y-4">
      {/* Stages list */}
      <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {stages.map((stage, index) => (
          <div
            key={stage.id}
            className="flex items-center gap-3 py-3 px-1"
          >
            {/* Color dot */}
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: stage.color ?? "#6B7280" }}
            />

            {/* Name / Edit */}
            {editingId === stage.id ? (
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 px-2 py-1 text-sm border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEdit(stage.id);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  autoFocus
                />
                <div className="flex items-center gap-1">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setEditColor(c)}
                      className={cn(
                        "w-5 h-5 rounded-full border-2 transition-colors",
                        editColor === c
                          ? "border-zinc-900 dark:border-zinc-100"
                          : "border-transparent"
                      )}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => handleSaveEdit(stage.id)}
                  disabled={isPending}
                  className="px-2 py-1 text-xs font-medium rounded-md bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="px-2 py-1 text-xs font-medium rounded-md text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleStartEdit(stage)}
                className="flex-1 text-left text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {stage.name}
              </button>
            )}

            {/* Badges */}
            {editingId !== stage.id && (
              <div className="flex items-center gap-1.5">
                {stage.isWon && (
                  <Badge variant="success" size="sm">Ganada</Badge>
                )}
                {stage.isLost && (
                  <Badge variant="danger" size="sm">Perdida</Badge>
                )}
                {stage.dealCount > 0 && (
                  <Badge variant="default" size="sm">
                    {stage.dealCount} deal{stage.dealCount !== 1 ? "s" : ""}
                  </Badge>
                )}
              </div>
            )}

            {/* Actions */}
            {editingId !== stage.id && (
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0 || isPending}
                  className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Mover arriba"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveDown(index)}
                  disabled={index === stages.length - 1 || isPending}
                  className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Mover abajo"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleWon(stage)}
                  disabled={isPending}
                  className={cn(
                    "p-1.5 transition-colors",
                    stage.isWon
                      ? "text-emerald-500 hover:text-emerald-600"
                      : "text-zinc-400 hover:text-emerald-500"
                  )}
                  title={stage.isWon ? "Desmarcar como ganada" : "Marcar como ganada"}
                >
                  <Trophy className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleLost(stage)}
                  disabled={isPending}
                  className={cn(
                    "p-1.5 transition-colors",
                    stage.isLost
                      ? "text-red-500 hover:text-red-600"
                      : "text-zinc-400 hover:text-red-500"
                  )}
                  title={stage.isLost ? "Desmarcar como perdida" : "Marcar como perdida"}
                >
                  <XCircle className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(stage)}
                  disabled={isPending || stage.dealCount > 0}
                  className="p-1.5 text-zinc-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title={
                    stage.dealCount > 0
                      ? "No se puede eliminar: tiene deals asociados"
                      : "Eliminar etapa"
                  }
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {stages.length === 0 && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-6">
          No hay etapas configuradas. Agrega la primera etapa de tu pipeline.
        </p>
      )}

      {/* Add new stage */}
      <div className="flex items-center gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-700">
        <div className="flex items-center gap-1.5">
          {PRESET_COLORS.slice(0, 6).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setNewColor(c)}
              className={cn(
                "w-5 h-5 rounded-full border-2 transition-colors",
                newColor === c
                  ? "border-zinc-900 dark:border-zinc-100"
                  : "border-transparent"
              )}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nombre de nueva etapa..."
          className="flex-1 px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAdd();
          }}
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!newName.trim() || isPending}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          Agregar
        </button>
      </div>
    </div>
  );
}
