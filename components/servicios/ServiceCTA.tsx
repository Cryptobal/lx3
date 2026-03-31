import Link from 'next/link'

export default function ServiceCTA({ slug }: { slug: string }) {
  return (
    <section className="px-6 py-20" style={{ background: '#FF6B4A' }}>
      <div className="mx-auto max-w-[700px] text-center">
        <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
          ¿Listo para cotizar tu proyecto?
        </h2>
        <p className="mb-8 text-lg text-white/90">
          Sin formularios. Sin esperas. Precio en 2 minutos.
        </p>
        <Link
          href="/cotiza"
          className="inline-block rounded-lg bg-white px-8 py-4 text-base font-semibold transition-opacity hover:opacity-90"
          style={{ color: '#FF6B4A' }}
        >
          Cotiza ahora →
        </Link>
        <p className="mt-4 text-sm text-white/70">
          O escríbenos a contacto@lx3.ai
        </p>
      </div>
    </section>
  )
}
