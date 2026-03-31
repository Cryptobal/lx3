import { notFound } from 'next/navigation'
import { CITIES, GEO_SERVICES } from '@/data/cities'
import { SERVICE_PAGES } from '@/data/keywords'
import type { Metadata } from 'next'
import Link from 'next/link'

export async function generateStaticParams() {
  const params = []
  for (const servicio of GEO_SERVICES) {
    for (const city of CITIES) {
      params.push({ servicio, ciudad: city.slug })
    }
  }
  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; servicio: string; ciudad: string }>
}): Promise<Metadata> {
  const { servicio, ciudad } = await params
  const city = CITIES.find((c) => c.slug === ciudad)
  const service = SERVICE_PAGES.find((s) => s.slug === servicio)
  if (!city || !service) return {}

  const title = `${service.title} en ${city.name} | LX3`
  const description = `${service.metaDescription.replace('en Chile', `en ${city.name}, ${city.region}`)} Cotiza al instante.`

  return {
    title,
    description,
    alternates: { canonical: `https://lx3.ai/${servicio}/${ciudad}` },
    openGraph: { title, description, locale: 'es_CL', type: 'website' },
  }
}

export default async function GeoServicePage({
  params,
}: {
  params: Promise<{ locale: string; servicio: string; ciudad: string }>
}) {
  const { servicio, ciudad } = await params
  const city = CITIES.find((c) => c.slug === ciudad)
  const service = SERVICE_PAGES.find((s) => s.slug === servicio)
  if (!city || !service) notFound()

  return (
    <section
      className="relative min-h-[400px] overflow-hidden px-6 py-20"
      style={{ background: '#0A0F1C' }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="relative mx-auto max-w-[900px]">
        <p className="mb-4 text-sm font-medium" style={{ color: '#FF6B4A' }}>
          LX3 · {city.name}, {city.region}
        </p>
        <h1 className="mb-5 text-4xl font-bold text-white md:text-6xl">
          {service.title} en {city.name}
        </h1>
        <p className="mb-8 max-w-[600px] text-lg text-white/70">
          {service.metaDescription.replace('en Chile', `en ${city.name}`)}
        </p>
        <Link
          href="/cotiza"
          className="inline-block rounded-lg px-7 py-3.5 text-base font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: '#FF6B4A' }}
        >
          Cotiza ahora →
        </Link>
      </div>
    </section>
  )
}
