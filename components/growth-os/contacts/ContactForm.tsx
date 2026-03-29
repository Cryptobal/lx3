"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { createContact } from "@/lib/growth-os/actions/contacts";

interface Company {
  id: string;
  name: string;
}

interface ContactFormProps {
  companies: Company[];
}

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  companyId: string;
  source: string;
  tags: string;
  notes: string;
}

const SOURCES = [
  { value: "MANUAL", label: "Manual" },
  { value: "WEBSITE_FORM", label: "Formulario web" },
  { value: "COTIZADOR", label: "Cotizador" },
  { value: "CHATBOT", label: "Chatbot" },
  { value: "APOLLO", label: "Apollo" },
  { value: "IMPORT", label: "Importado" },
  { value: "REFERRAL", label: "Referido" },
];

export function ContactForm({ companies }: ContactFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      position: "",
      companyId: "",
      source: "MANUAL",
      tags: "",
      notes: "",
    },
  });

  function onSubmit(data: FormValues) {
    setServerError("");
    startTransition(async () => {
      const tags = data.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const result = await createContact({
        firstName: data.firstName,
        lastName: data.lastName || undefined,
        email: data.email || undefined,
        phone: data.phone || undefined,
        position: data.position || undefined,
        companyId: data.companyId || undefined,
        source: data.source || undefined,
        tags,
        notes: data.notes || undefined,
      });

      if (result.success) {
        toast.success("Contacto creado exitosamente");
        router.push("/admin/contacts");
      } else {
        setServerError(result.error);
        toast.error(result.error);
      }
    });
  }

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const errorClass = "mt-1 text-xs text-red-500";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            {...register("firstName", { required: "El nombre es obligatorio" })}
            placeholder="Nombre"
            className={inputClass}
            disabled={isPending}
          />
          {errors.firstName && (
            <p className={errorClass}>{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>Apellido</label>
          <input
            {...register("lastName")}
            placeholder="Apellido"
            className={inputClass}
            disabled={isPending}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Email</label>
          <input
            {...register("email", {
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Email invalido",
              },
            })}
            type="email"
            placeholder="correo@empresa.cl"
            className={inputClass}
            disabled={isPending}
          />
          {errors.email && (
            <p className={errorClass}>{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>Telefono</label>
          <input
            {...register("phone")}
            type="tel"
            placeholder="+56 9 1234 5678"
            className={inputClass}
            disabled={isPending}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Cargo</label>
        <input
          {...register("position")}
          placeholder="Ej: Gerente de TI"
          className={inputClass}
          disabled={isPending}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Empresa</label>
          <select
            {...register("companyId")}
            className={inputClass}
            disabled={isPending}
          >
            <option value="">Sin empresa</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Fuente</label>
          <select
            {...register("source")}
            className={inputClass}
            disabled={isPending}
          >
            {SOURCES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Tags</label>
        <input
          {...register("tags")}
          placeholder="Separados por coma: marketing, enterprise, chile"
          className={inputClass}
          disabled={isPending}
        />
        <p className="mt-1 text-xs text-gray-400">
          Separa los tags con comas
        </p>
      </div>

      <div>
        <label className={labelClass}>Notas</label>
        <textarea
          {...register("notes")}
          rows={3}
          placeholder="Notas adicionales sobre el contacto..."
          className={inputClass}
          disabled={isPending}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          disabled={isPending}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? "Guardando..." : "Crear Contacto"}
        </button>
      </div>
    </form>
  );
}
