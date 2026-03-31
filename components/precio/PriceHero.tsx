import Link from 'next/link'

interface PricePage {
  slug: string
  title: string
  keyword: string
  range: string
}

export default function PriceHero({ page }: { page: PricePage }) {
  return (
    <section className="px-6 py-20" style={{ background: '#0A0F1C', minHeight: '400px' }}>
      <div className="mx-auto max-w-[900px]">
        <p className="mb-4 text-sm font-medium" style={{ color: '#FF6B4A' }}>
          Precios reales · Actualizado 2026
        </p>
        <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl">
          {page.title} en Chile
        </h1>
        <p className="mb-4 text-3xl font-bold md:text-4xl" style={{ color: '#FF6B4A' }}>
          {page.range}
        </p>
        <p className="mb-8 max-w-[600px] text-lg text-white/70">
          Precios reales para proyectos reales. Sin letra chica, sin costos ocultos.
        </p>
        <Link
          href="/cotiza"
          className="inline-block rounded-lg px-7 py-3.5 text-base font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: '#FF6B4A' }}
        >
          Cotiza tu caso específico →
        </Link>
      </div>
    </section>
  )
}
