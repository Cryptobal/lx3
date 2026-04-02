import type { ServicePage } from '@/data/keywords'
import Link from 'next/link'

const benefits = [
  {
    title: 'Velocidad',
    description: 'Entregamos proyectos en tiempo récord con metodología ágil y equipo dedicado.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: 'Calidad',
    description: 'Stack moderno con Next.js, React y TypeScript. Código limpio, testeado y documentado.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Precio transparente',
    description: 'Cotiza al instante sin reuniones ni formularios. Sabes cuánto pagas desde el día 1.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

const differentiators = [
  { title: 'Precio transparente', desc: 'Cotizas al instante, sin reunión previa' },
  { title: 'Stack moderno', desc: 'Next.js, React, TypeScript. No legacy.' },
  { title: 'Código tuyo', desc: 'Entregamos todo el source code' },
  { title: 'Resultados medibles', desc: 'KPIs definidos antes de empezar' },
]

export default function ServiceBody({ page }: { page: ServicePage }) {
  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-[1100px]">
        {/* Benefits grid */}
        <div className="mb-16 grid gap-8 md:grid-cols-3">
          {benefits.map((b) => (
            <div key={b.title} className="rounded-xl border border-gray-100 p-6">
              <div className="mb-4" style={{ color: '#FF6B4A' }}>{b.icon}</div>
              <h3 className="mb-2 text-lg font-bold text-gray-900">{b.title}</h3>
              <p className="text-gray-600">{b.description}</p>
            </div>
          ))}
        </div>

        {/* Why LX3 */}
        <div className="mb-16">
          <h2 className="mb-8 text-3xl font-bold text-gray-900">¿Por qué LX3?</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {differentiators.map((d) => (
              <div key={d.title} className="flex items-start gap-4">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ background: '#FF6B4A' }} />
                <div>
                  <p className="font-bold text-gray-900">{d.title}</p>
                  <p className="text-gray-600">{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Case study inline */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-8">
          <p className="text-gray-700">
            <span className="font-semibold">Gard Security</span> confió en LX3 para su sistema OPAI de gestión de seguridad privada.{' '}
            <Link href="/empresa" className="font-medium underline" style={{ color: '#FF6B4A' }}>
              Ver caso →
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
