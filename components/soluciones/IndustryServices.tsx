import { SERVICE_PAGES } from '@/data/keywords'
import type { IndustrySlug } from '@/data/keywords'
import Link from 'next/link'

const servicesByIndustry: Record<string, string[]> = {
  'empresas-seguridad': ['software-a-medida', 'crm-personalizado', 'sistema-cotizaciones'],
  clinicas: ['desarrollo-web', 'sistema-cotizaciones', 'automatizacion-ia'],
  logistica: ['software-a-medida', 'automatizacion-ia', 'desarrollo-fullstack'],
  pymes: ['crm-personalizado', 'tienda-online', 'posicionamiento-web'],
  constructoras: ['desarrollo-web', 'software-a-medida', 'sistema-cotizaciones'],
  restaurantes: ['desarrollo-web', 'tienda-online', 'landing-pages'],
  retail: ['tienda-online', 'ecommerce-medida', 'posicionamiento-web'],
}

export default function IndustryServices({ industrySlug }: { industrySlug: string }) {
  const slugs = servicesByIndustry[industrySlug] || []
  const services = slugs
    .map((s) => SERVICE_PAGES.find((p) => p.slug === s))
    .filter(Boolean)

  if (services.length === 0) return null

  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-[1100px]">
        <h2 className="mb-10 text-3xl font-bold text-gray-900">
          Servicios recomendados
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {services.map((svc) => (
            <Link
              key={svc!.slug}
              href={`/servicios/${svc!.slug}`}
              className="group rounded-xl border border-gray-200 p-6 transition-colors hover:border-gray-300"
            >
              <h3 className="mb-2 text-lg font-bold text-gray-900 group-hover:underline">
                {svc!.title}
              </h3>
              <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                {svc!.metaDescription}
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
