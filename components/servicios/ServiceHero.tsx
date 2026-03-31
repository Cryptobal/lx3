import type { ServicePage } from '@/data/keywords'
import Link from 'next/link'

export default function ServiceHero({ page }: { page: ServicePage }) {
  return (
    <section
      className="relative min-h-[480px] overflow-hidden px-6 py-20"
      style={{ background: '#0A0F1C' }}
    >
      {/* Grid pattern decoration */}
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
          LX3 · Santiago, Chile
        </p>
        <h1 className="mb-5 text-4xl font-bold text-white md:text-6xl">
          {page.h1}
        </h1>
        <p className="mb-8 max-w-[600px] text-lg text-white/70">
          {page.metaDescription}
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/cotiza"
            className="inline-block rounded-lg px-7 py-3.5 text-base font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: '#FF6B4A' }}
          >
            Cotiza ahora →
          </Link>
          <Link
            href="/empresa"
            className="inline-block rounded-lg border border-white px-7 py-3.5 text-base font-semibold text-white transition-opacity hover:opacity-80"
          >
            Ver casos de éxito
          </Link>
        </div>
      </div>
    </section>
  )
}
