"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { createCompany } from "@/lib/growth-os/actions/companies";

const SIZE_OPTIONS = [
  { value: "", label: "Seleccionar..." },
  { value: "1-10", label: "1-10 empleados" },
  { value: "11-50", label: "11-50 empleados" },
  { value: "51-200", label: "51-200 empleados" },
  { value: "201-500", label: "201-500 empleados" },
  { value: "501-1000", label: "501-1000 empleados" },
  { value: "1001-5000", label: "1001-5000 empleados" },
  { value: "5001+", label: "5001+ empleados" },
];

export function CompanyForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    domain: "",
    industry: "",
    size: "",
    country: "",
    city: "",
    website: "",
    linkedinUrl: "",
    phone: "",
    description: "",
    tags: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("El nombre es requerido");
      return;
    }

    setSubmitting(true);

    try {
      const tags = form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      await createCompany({
        name: form.name.trim(),
        domain: form.domain.trim() || undefined,
        industry: form.industry.trim() || undefined,
        size: form.size || undefined,
        country: form.country.trim() || undefined,
        city: form.city.trim() || undefined,
        website: form.website.trim() || undefined,
        linkedinUrl: form.linkedinUrl.trim() || undefined,
        phone: form.phone.trim() || undefined,
        description: form.description.trim() || undefined,
        tags: tags.length > 0 ? tags : undefined,
      });

      toast.success("Empresa creada exitosamente");
      router.push("/admin/companies");
    } catch {
      toast.error("Error al crear la empresa");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10";

  const labelClass =
    "block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1";

  return (
    <div>
      <Link
        href="/admin/companies"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a empresas
      </Link>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-6 space-y-5"
      >
        {/* Name & Domain */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className={labelClass}>
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Acme Corp"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="domain" className={labelClass}>
              Dominio
            </label>
            <input
              id="domain"
              name="domain"
              type="text"
              value={form.domain}
              onChange={handleChange}
              placeholder="acme.com"
              className={inputClass}
            />
          </div>
        </div>

        {/* Industry & Size */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="industry" className={labelClass}>
              Industria
            </label>
            <input
              id="industry"
              name="industry"
              type="text"
              value={form.industry}
              onChange={handleChange}
              placeholder="Tecnologia"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="size" className={labelClass}>
              Tamano
            </label>
            <select
              id="size"
              name="size"
              value={form.size}
              onChange={handleChange}
              className={inputClass}
            >
              {SIZE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Country & City */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="country" className={labelClass}>
              Pais
            </label>
            <input
              id="country"
              name="country"
              type="text"
              value={form.country}
              onChange={handleChange}
              placeholder="Chile"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="city" className={labelClass}>
              Ciudad
            </label>
            <input
              id="city"
              name="city"
              type="text"
              value={form.city}
              onChange={handleChange}
              placeholder="Santiago"
              className={inputClass}
            />
          </div>
        </div>

        {/* Website & LinkedIn */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="website" className={labelClass}>
              Sitio web
            </label>
            <input
              id="website"
              name="website"
              type="url"
              value={form.website}
              onChange={handleChange}
              placeholder="https://acme.com"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="linkedinUrl" className={labelClass}>
              LinkedIn URL
            </label>
            <input
              id="linkedinUrl"
              name="linkedinUrl"
              type="url"
              value={form.linkedinUrl}
              onChange={handleChange}
              placeholder="https://linkedin.com/company/..."
              className={inputClass}
            />
          </div>
        </div>

        {/* Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className={labelClass}>
              Telefono
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="+56 2 1234 5678"
              className={inputClass}
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className={labelClass}>
            Tags
          </label>
          <input
            id="tags"
            name="tags"
            type="text"
            value={form.tags}
            onChange={handleChange}
            placeholder="tecnologia, saas, startup (separados por coma)"
            className={inputClass}
          />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Separa los tags con comas
          </p>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className={labelClass}>
            Descripcion
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            placeholder="Descripcion de la empresa..."
            className={inputClass}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin/companies"
            className="px-4 py-2 text-sm font-medium rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitting ? "Creando..." : "Crear empresa"}
          </button>
        </div>
      </form>
    </div>
  );
}
