"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { createCompany } from "@/lib/growth-os/actions/companies";
import { toast } from "sonner";

const SIZE_OPTIONS = [
  { value: "", label: "Seleccionar..." },
  { value: "1-10", label: "1-10 empleados" },
  { value: "11-50", label: "11-50 empleados" },
  { value: "51-200", label: "51-200 empleados" },
  { value: "201-500", label: "201-500 empleados" },
  { value: "501-1000", label: "501-1000 empleados" },
  { value: "1001+", label: "1001+ empleados" },
];

export default function NewCompanyPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [tagsInput, setTagsInput] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    startTransition(async () => {
      const result = await createCompany({
        name: form.get("name") as string,
        domain: (form.get("domain") as string) || undefined,
        industry: (form.get("industry") as string) || undefined,
        size: (form.get("size") as string) || undefined,
        country: (form.get("country") as string) || undefined,
        city: (form.get("city") as string) || undefined,
        website: (form.get("website") as string) || undefined,
        phone: (form.get("phone") as string) || undefined,
        linkedinUrl: (form.get("linkedinUrl") as string) || undefined,
        description: (form.get("description") as string) || undefined,
        tags: tags.length > 0 ? tags : undefined,
      });

      if (result.success) {
        toast.success("Empresa creada exitosamente");
        router.push("/admin/companies");
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/admin/companies"
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a empresas
      </Link>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-xl font-bold text-gray-900">
          Nueva empresa
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Nombre *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Nombre de la empresa"
            />
          </div>

          {/* Domain & Industry */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="domain"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Dominio
              </label>
              <input
                id="domain"
                name="domain"
                type="text"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="ejemplo.com"
              />
            </div>
            <div>
              <label
                htmlFor="industry"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Industria
              </label>
              <input
                id="industry"
                name="industry"
                type="text"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Tecnologia, Retail, etc."
              />
            </div>
          </div>

          {/* Size & Country */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="size"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Tamano
              </label>
              <select
                id="size"
                name="size"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {SIZE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="country"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Pais
              </label>
              <input
                id="country"
                name="country"
                type="text"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Chile"
              />
            </div>
          </div>

          {/* City & Phone */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="city"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Ciudad
              </label>
              <input
                id="city"
                name="city"
                type="text"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Santiago"
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Telefono
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="+56 9 1234 5678"
              />
            </div>
          </div>

          {/* Website & LinkedIn */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="website"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Sitio web
              </label>
              <input
                id="website"
                name="website"
                type="url"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="https://ejemplo.com"
              />
            </div>
            <div>
              <label
                htmlFor="linkedinUrl"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                LinkedIn URL
              </label>
              <input
                id="linkedinUrl"
                name="linkedinUrl"
                type="url"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="https://linkedin.com/company/..."
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Descripcion
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Descripcion de la empresa..."
            />
          </div>

          {/* Tags */}
          <div>
            <label
              htmlFor="tags"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Tags
            </label>
            <input
              id="tags"
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Separados por coma: SaaS, Enterprise, Chile"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-5">
            <Link
              href="/admin/companies"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Crear empresa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
