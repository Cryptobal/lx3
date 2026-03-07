"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Nombre es requerido"),
  company: z.string().min(1, "Empresa es requerida"),
  email: z.string().email("Email invalido"),
  phone: z.string().optional(),
  message: z.string().min(1, "Mensaje es requerido"),
  source: z.string().optional(),
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
        <p className="mt-6 text-lg font-medium text-white">{t("formSuccess")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Nombre */}
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium text-white/70">
          {t("formName")} *
        </label>
        <input
          id="name"
          type="text"
          {...register("name", { required: true })}
          className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder-white/30 outline-none transition-colors focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
          placeholder={t("formName")}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-400">Campo requerido</p>
        )}
      </div>

      {/* Empresa */}
      <div>
        <label htmlFor="company" className="mb-2 block text-sm font-medium text-white/70">
          {t("formCompany")} *
        </label>
        <input
          id="company"
          type="text"
          {...register("company", { required: true })}
          className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder-white/30 outline-none transition-colors focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
          placeholder={t("formCompany")}
        />
        {errors.company && (
          <p className="mt-1 text-sm text-red-400">Campo requerido</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-white/70">
          {t("formEmail")} *
        </label>
        <input
          id="email"
          type="email"
          {...register("email", {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          })}
          className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder-white/30 outline-none transition-colors focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
          placeholder="tu@empresa.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-400">
            {errors.email.type === "pattern" ? "Email invalido" : "Campo requerido"}
          </p>
        )}
      </div>

      {/* Telefono */}
      <div>
        <label htmlFor="phone" className="mb-2 block text-sm font-medium text-white/70">
          {t("formPhone")}
        </label>
        <input
          id="phone"
          type="text"
          {...register("phone")}
          className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder-white/30 outline-none transition-colors focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
          placeholder="+56 9 1234 5678"
        />
      </div>

      {/* Mensaje */}
      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-medium text-white/70">
          {t("formMessage")} *
        </label>
        <textarea
          id="message"
          rows={4}
          {...register("message", { required: true })}
          className="w-full resize-none rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder-white/30 outline-none transition-colors focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
          placeholder={t("formMessage")}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-400">Campo requerido</p>
        )}
      </div>

      {/* Como nos encontraste */}
      <div>
        <label htmlFor="source" className="mb-2 block text-sm font-medium text-white/70">
          {t("formHow")}
        </label>
        <select
          id="source"
          {...register("source")}
          className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition-colors focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
          defaultValue=""
        >
          <option value="" disabled className="bg-[#0F1729] text-white/50">
            --
          </option>
          <option value="google" className="bg-[#0F1729]">
            {t("formHowOptions.google")}
          </option>
          <option value="linkedin" className="bg-[#0F1729]">
            {t("formHowOptions.linkedin")}
          </option>
          <option value="referral" className="bg-[#0F1729]">
            {t("formHowOptions.referral")}
          </option>
          <option value="other" className="bg-[#0F1729]">
            {t("formHowOptions.other")}
          </option>
        </select>
      </div>

      {/* Error message */}
      {status === "error" && errorMessage && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3">
          <p className="text-sm text-red-400">{errorMessage}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-lg bg-gradient-to-r from-[#06B6D4] to-[#3B82F6] px-6 py-3 text-sm font-medium text-white shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-cyan-500/30 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
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
