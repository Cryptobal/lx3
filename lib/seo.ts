import type { Metadata } from 'next'

const BASE_URL = 'https://lx3.ai'
const SITE_NAME = 'LX3 — Desarrollo Web & Software Chile'
const DEFAULT_OG_IMAGE = '/og-default.png'

export function generateServiceMetadata(page: {
  metaTitle: string
  metaDescription: string
  slug: string
  keywords: string[]
}): Metadata {
  const url = `${BASE_URL}/servicios/${page.slug}`
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    keywords: page.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url,
      siteName: SITE_NAME,
      locale: 'es_CL',
      type: 'website',
      images: [{ url: `${BASE_URL}/og/servicios/${page.slug}.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.metaTitle,
      description: page.metaDescription,
    },
  }
}

export function generateIndustryMetadata(page: {
  metaTitle: string
  metaDescription: string
  slug: string
  keywords: string[]
}): Metadata {
  const url = `${BASE_URL}/soluciones/${page.slug}`
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    keywords: page.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url,
      siteName: SITE_NAME,
      locale: 'es_CL',
      type: 'website',
      images: [{ url: `${BASE_URL}/og/soluciones/${page.slug}.png`, width: 1200, height: 630 }],
    },
  }
}

export function generatePriceMetadata(page: {
  title: string
  slug: string
  keyword: string
  range: string
}): Metadata {
  const description = `${page.title} en Chile. ${page.range}. Precios transparentes, sin letra chica. Cotiza al instante en lx3.ai.`
  const url = `${BASE_URL}/precio/${page.slug}`
  return {
    title: `${page.title} 2026 | Precios Reales — LX3`,
    description,
    keywords: [page.keyword, `precio ${page.slug} Chile`, `cuánto cuesta ${page.slug} Chile`],
    alternates: { canonical: url },
    openGraph: {
      title: `${page.title} 2026 | Precios Reales — LX3`,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'es_CL',
      type: 'website',
    },
  }
}

export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'LX3',
    description: 'Software studio especializado en desarrollo web, aplicaciones con IA y software a medida en Chile.',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    image: `${BASE_URL}/og-default.png`,
    telephone: '+56-9-XXXXXXXX',
    email: 'contacto@lx3.ai',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Santiago',
      addressRegion: 'Región Metropolitana',
      addressCountry: 'CL',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -33.4489,
      longitude: -70.6693,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Chile',
    },
    priceRange: '$$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    sameAs: ['https://www.linkedin.com/company/lx3ai'],
  }
}

export function generateServiceSchema(page: {
  title: string
  metaDescription: string
  slug: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: page.title,
    description: page.metaDescription,
    provider: {
      '@type': 'LocalBusiness',
      name: 'LX3',
      url: BASE_URL,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Chile',
    },
    url: `${BASE_URL}/servicios/${page.slug}`,
  }
}

export function generateFAQSchema(faq: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }
}
