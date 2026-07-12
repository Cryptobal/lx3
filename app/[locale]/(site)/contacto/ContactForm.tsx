"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { z } from "zod";

// Low-friction form: only the 3 fields that matter (name, email, the ask).
const contactSchema = z.object({
  name: z.string().min(1, "Nombre es requerido"),
  email: z.string().email("Email invalido"),
  message: z.string().min(1, "Mensaje es requerido"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const t = useTranslations("contactPage");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>();

  async function onSubmit(data: ContactFormData) {
    setStatus("loading");
    setErrorMessage("");

    try {
      const parsed = contactSchema.safeParse(data);
      if (!parsed.success) {
        setStatus("error");
        setErrorMessage("Por favor revisa los campos del formulario.");
        return;
      }

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Error al enviar el mensaje.");
      }

      setStatus("success");
      reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Error inesperado. Intenta de nuevo."
      );
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-8 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
          <svg
            className="h-8 w-8 text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>
        <p className="mt-6 text-lg font-medium text-[var(--text-primary)]">{t("formSuccess")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Nombre */}
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">
          {t("formName")} *
        </label>
        <input
          id="name"
          type="text"
          {...register("name", { required: true })}
          className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-tertiary)] outline-none transition-colors focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
          placeholder={t("formName")}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-400">Campo requerido</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">
          {t("formEmail")} *
        </label>
        <input
          id="email"
          type="email"
          {...register("email", {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          })}
          className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-tertiary)] outline-none transition-colors focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
          placeholder="tu@empresa.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-400">
            {errors.email.type === "pattern" ? "Email invalido" : "Campo requerido"}
          </p>
        )}
      </div>

      {/* ¿Qué quieres resolver / automatizar? */}
      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">
          {t("formMessage")} *
        </label>
        <textarea
          id="message"
          rows={4}
          {...register("message", { required: true })}
          className="w-full resize-none rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-tertiary)] outline-none transition-colors focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
          placeholder={t("formMessage")}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-400">Campo requerido</p>
        )}
      </div>

      {/* Error message */}
      {status === "error" && errorMessage && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3">
          <p className="text-sm text-red-400">{errorMessage}</p>
        </div>
      )}

      {/* Social proof over the CTA */}
      <p className="text-sm text-[var(--text-tertiary)]">
        El equipo que construyó OPAI — 500+ guardias gestionados con IA.
      </p>

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-lg bg-gradient-to-r from-[var(--accent)] to-[var(--coral)] px-6 py-3 text-sm font-medium text-[var(--text-primary)] shadow-lg shadow-[var(--accent-glow)] transition-all duration-200 hover:shadow-xl hover:shadow-[var(--accent-glow)] hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "loading" ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="h-4 w-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Enviando...
          </span>
        ) : (
          t("formSubmit")
        )}
      </button>
    </form>
  );
}
