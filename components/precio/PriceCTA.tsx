import Link from 'next/link'

export default function PriceCTA() {
  return (
    <section className="bg-gray-50 px-6 py-20">
      <div className="mx-auto max-w-[700px] text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          El precio exacto para tu proyecto está a 2 minutos
        </h2>
        <p className="mb-8 text-lg text-gray-600">
          Nuestro cotizador genera un presupuesto personalizado al instante. Sin reuniones, sin esperas.
        </p>
        <Link
          href="/cotiza"
          className="inline-block rounded-lg px-8 py-4 text-base font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: '#FF6B4A' }}
        >
          Cotiza tu proyecto →
        </Link>
        <p className="mt-8 text-sm italic text-gray-500">
          &ldquo;Gard Security obtuvo su cotización en minutos y comenzamos en una semana.&rdquo;
        </p>
      </div>
    </section>
  )
}
