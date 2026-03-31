import Link from 'next/link'

interface PricePage {
  slug: string
  title: string
  keyword: string
  range: string
}

interface Tier {
  name: string
  price: string
  features: string[]
  popular?: boolean
}

const tiersBySlug: Record<string, Tier[]> = {
  'pagina-web': [
    { name: 'Basic', price: '$390.000', features: ['Landing page 1 página', 'Diseño responsive', 'Formulario de contacto', 'Hosting 1 año incluido'] },
    { name: 'Pro', price: '$790.000', features: ['Hasta 10 páginas', 'Diseño a medida', 'SEO on-page', 'Panel administración', 'Dominio + hosting'], popular: true },
    { name: 'Enterprise', price: '$1.490.000', features: ['Páginas ilimitadas', 'Integraciones API', 'Multilenguaje', 'Soporte prioritario', 'Optimización Core Web Vitals'] },
  ],
  'desarrollo-web': [
    { name: 'Basic', price: '$490.000', features: ['Sitio web corporativo', 'Hasta 5 páginas', 'Responsive design', 'SEO básico'] },
    { name: 'Pro', price: '$1.490.000', features: ['Aplicación web', 'Hasta 15 páginas', 'Panel de admin', 'Integraciones', 'Base de datos'], popular: true },
    { name: 'Enterprise', price: '$2.900.000', features: ['Plataforma completa', 'Funcionalidad a medida', 'API REST', 'CI/CD', 'Soporte 6 meses'] },
  ],
  'software-empresarial': [
    { name: 'Basic', price: '$1.900.000', features: ['Sistema web básico', 'Hasta 5 módulos', 'Panel admin', 'Base de datos', 'Deploy en Vercel'] },
    { name: 'Pro', price: '$4.900.000', features: ['Sistema empresarial', 'Módulos ilimitados', 'Integraciones', 'Roles y permisos', 'Reportes avanzados'], popular: true },
    { name: 'Enterprise', price: '$9.900.000', features: ['ERP completo', 'Multi-empresa', 'API pública', 'Migración de datos', 'Soporte 12 meses'] },
  ],
  crm: [
    { name: 'Basic', price: '$1.490.000', features: ['Pipeline de ventas', 'Gestión de contactos', 'Dashboard básico', 'Hasta 3 usuarios'] },
    { name: 'Pro', price: '$2.900.000', features: ['CRM completo', 'Email integrado', 'Automatizaciones', 'Reportes', 'Usuarios ilimitados'], popular: true },
    { name: 'Enterprise', price: '$4.900.000', features: ['Multi-pipeline', 'WhatsApp API', 'IA para scoring', 'API REST', 'Soporte dedicado'] },
  ],
  'tienda-online': [
    { name: 'Basic', price: '$890.000', features: ['Hasta 50 productos', 'Webpay integrado', 'Carrito de compras', 'Panel de productos'] },
    { name: 'Pro', price: '$1.690.000', features: ['Productos ilimitados', 'Gestión de inventario', 'Cupones y descuentos', 'Despacho integrado', 'SEO e-commerce'], popular: true },
    { name: 'Enterprise', price: '$2.900.000', features: ['Marketplace', 'Multi-vendedor', 'Analíticas avanzadas', 'ERP integración', 'Soporte 6 meses'] },
  ],
  seo: [
    { name: 'Basic', price: '$290.000/mes', features: ['Audit técnico', 'Optimización on-page', 'Reporte mensual', 'Hasta 10 keywords'] },
    { name: 'Pro', price: '$590.000/mes', features: ['Todo en Basic', 'Estrategia de contenido', 'Link building', 'Hasta 30 keywords', 'Google Search Console'], popular: true },
    { name: 'Enterprise', price: '$890.000/mes', features: ['Todo en Pro', 'Keywords ilimitadas', 'Contenido mensual', 'Competitive analysis', 'Consultor dedicado'] },
  ],
}

export default function PriceTable({ page }: { page: PricePage }) {
  const tiers = tiersBySlug[page.slug] || tiersBySlug['desarrollo-web']

  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-[1100px]">
        <div className="grid gap-8 md:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl border-2 p-8 ${
                tier.popular ? 'relative border-[#FF6B4A]' : 'border-gray-200'
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-semibold text-white" style={{ background: '#FF6B4A' }}>
                  Más popular
                </span>
              )}
              <h3 className="mb-2 text-xl font-bold text-gray-900">{tier.name}</h3>
              <p className="mb-6 text-3xl font-bold" style={{ color: '#0A0F1C' }}>
                {tier.price}
              </p>
              <ul className="mb-8 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                    <svg className="mt-0.5 h-4 w-4 shrink-0" style={{ color: '#FF6B4A' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/cotiza"
                className={`block rounded-lg py-3 text-center text-sm font-semibold transition-opacity hover:opacity-90 ${
                  tier.popular ? 'text-white' : 'border border-gray-300 text-gray-900'
                }`}
                style={tier.popular ? { background: '#FF6B4A' } : undefined}
              >
                Cotizar ahora
              </Link>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-gray-500">
          * Los precios son referenciales. El cotizador genera un precio exacto según tu proyecto.
        </p>
      </div>
    </section>
  )
}
