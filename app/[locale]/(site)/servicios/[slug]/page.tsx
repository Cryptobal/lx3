import { notFound } from 'next/navigation'
import { SERVICE_PAGES } from '@/data/keywords'
import { generateServiceMetadata, generateServiceSchema, generateFAQSchema } from '@/lib/seo'
import ServiceHero from '@/components/servicios/ServiceHero'
import ServiceBody from '@/components/servicios/ServiceBody'
import ServiceFAQ from '@/components/servicios/ServiceFAQ'
import ServiceCTA from '@/components/servicios/ServiceCTA'
import ServiceRelated from '@/components/servicios/ServiceRelated'

// Filter out slugs that conflict with existing static directories
const EXISTING_STATIC_DIRS = ['aplicaciones-internas', 'automatizacion-ia', 'consultoria', 'sitios-web']

export async function generateStaticParams() {
  return SERVICE_PAGES
    .filter((s) => !EXISTING_STATIC_DIRS.includes(s.slug))
    .map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = SERVICE_PAGES.find((s) => s.slug === slug)
  if (!page) return {}
  return generateServiceMetadata(page)
}

export default async function ServicioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = SERVICE_PAGES.find((s) => s.slug === slug)
  if (!page) notFound()

  const serviceSchema = generateServiceSchema(page)
  const faqSchema = generateFAQSchema(page.faq)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <ServiceHero page={page} />
      <ServiceBody page={page} />
      <ServiceFAQ faq={page.faq} />
      <ServiceCTA slug={page.slug} />
      <ServiceRelated slugs={page.relatedSlugs} />
    </>
  )
}
