import type { IndustryPage } from '@/data/keywords'
import Link from 'next/link'

export default function IndustryHero({ page }: { page: IndustryPage }) {
  return (
    <section
      className="relative min-h-[480px] overflow-hidden px-6 py-20"
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
        <span
          className="mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-semibold text-white"
          style={{ background: '#0D9488' }}
        >
          Soluciones para {page.title.toLowerCase()}
        </span>
        <h1 className="mb-5 text-4xl font-bold text-white md:text-6xl">
          {page.h1}
        </h1>
        <p className="mb-6 max-w-[600px] text-lg text-white/70">
          {page.metaDescription}
        </p>
        <p className="mb-8 text-sm text-white/50">
          Empresas en Chile ya confían en LX3 para su transformación digital
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
