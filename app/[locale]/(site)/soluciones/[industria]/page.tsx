import { notFound } from 'next/navigation'
import { INDUSTRY_PAGES } from '@/data/keywords'
import { generateIndustryMetadata } from '@/lib/seo'
import IndustryHero from '@/components/soluciones/IndustryHero'
import IndustryCaseStudy from '@/components/soluciones/IndustryCaseStudy'
import IndustryServices from '@/components/soluciones/IndustryServices'
import ServiceCTA from '@/components/servicios/ServiceCTA'

export async function generateStaticParams() {
  return INDUSTRY_PAGES.map((i) => ({ industria: i.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ industria: string }> }) {
  const { industria } = await params
  const page = INDUSTRY_PAGES.find((i) => i.slug === industria)
  if (!page) return {}
  return generateIndustryMetadata(page)
}

export default async function SolucionPage({ params }: { params: Promise<{ industria: string }> }) {
  const { industria } = await params
  const page = INDUSTRY_PAGES.find((i) => i.slug === industria)
  if (!page) notFound()

  return (
    <>
      <IndustryHero page={page} />
      {page.caseStudy && <IndustryCaseStudy caseStudy={page.caseStudy} />}
      <IndustryServices industrySlug={page.slug} />
      <ServiceCTA slug={page.slug} />
    </>
  )
}
