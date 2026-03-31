import type { ServiceSlug } from '@/data/keywords'
import { SERVICE_PAGES } from '@/data/keywords'
import Link from 'next/link'

export default function ServiceRelated({ slugs }: { slugs: ServiceSlug[] }) {
  const related = slugs
    .map((s) => SERVICE_PAGES.find((p) => p.slug === s))
    .filter(Boolean)

  if (related.length === 0) return null

  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-[1100px]">
        <h2 className="mb-10 text-2xl font-bold text-gray-900">Servicios relacionados</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {related.map((page) => (
            <Link
              key={page!.slug}
              href={`/servicios/${page!.slug}`}
              className="group rounded-xl border border-gray-200 p-6 transition-colors hover:border-gray-300"
            >
              <h3 className="mb-2 text-lg font-bold text-gray-900 group-hover:underline">
                {page!.title}
              </h3>
              <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                {page!.metaDescription}
              </p>
              <span className="text-sm font-medium" style={{ color: '#FF6B4A' }}>
                Ver servicio →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
