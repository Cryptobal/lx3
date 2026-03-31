import { notFound } from 'next/navigation'
import { PRICE_PAGES } from '@/data/keywords'
import { generatePriceMetadata } from '@/lib/seo'
import PriceHero from '@/components/precio/PriceHero'
import PriceTable from '@/components/precio/PriceTable'
import PriceCTA from '@/components/precio/PriceCTA'

export async function generateStaticParams() {
  return PRICE_PAGES.map((p) => ({ servicio: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ servicio: string }> }) {
  const { servicio } = await params
  const page = PRICE_PAGES.find((p) => p.slug === servicio)
  if (!page) return {}
  return generatePriceMetadata(page)
}

export default async function PrecioPage({ params }: { params: Promise<{ servicio: string }> }) {
  const { servicio } = await params
  const page = PRICE_PAGES.find((p) => p.slug === servicio)
  if (!page) notFound()

  return (
    <>
      <PriceHero page={page} />
      <PriceTable page={page} />
      <PriceCTA />
    </>
  )
}
