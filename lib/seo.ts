import type { Metadata } from 'next'

const BASE_URL = 'https://www.lx3.ai'
const SITE_NAME = 'LX3 — Desarrollo Web & Software Chile'

// ── EN slug mappings (shared with sitemap.ts) ──────────────────────────────
export const SERVICE_EN_SLUGS: Record<string, string> = {
  'desarrollo-web': 'web-development',
  'crm-personalizado': 'custom-crm',
  'tienda-online': 'online-store',
  'posicionamiento-web': 'seo',
  'landing-pages': 'landing-pages',
  'sistema-cotizaciones': 'quoting-system',
  'aplicaciones-internas': 'internal-apps',
  'automatizacion-ia': 'ai-automation',
  'sitios-web': 'websites',
  'consultoria': 'consulting',
}

/** Build self-referencing canonical + hreflang alternates for any page pair */
export function localeAlternates(
  locale: string,
  esPath: string,
  enPath: string,
) {
  const canonical =
    locale === 'en' ? `${BASE_URL}${enPath}` : `${BASE_URL}${esPath}`
  return {
    canonical,
    languages: {
      es: `${BASE_URL}${esPath}`,
      en: `${BASE_URL}${enPath}`,
      'x-default': `${BASE_URL}${esPath}`,
    },
  }
}

export function generateServiceMetadata(
  page: {
    metaTitle: string
    metaDescription: string
    slug: string
    keywords: string[]
  },
  locale = 'es',
): Metadata {
  const enSlug = SERVICE_EN_SLUGS[page.slug] ?? page.slug
  const esPath = `/es/servicios/${page.slug}`
  const enPath = `/en/services/${enSlug}`
  const alts = localeAlternates(locale, esPath, enPath)
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    keywords: page.keywords,
    alternates: alts,
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: alts.canonical,
      siteName: SITE_NAME,
      locale: locale === 'en' ? 'en_US' : 'es_CL',
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

export function generateIndustryMetadata(
  page: {
    metaTitle: string
    metaDescription: string
    slug: string
    keywords: string[]
  },
  locale = 'es',
): Metadata {
  const esPath = `/es/soluciones/${page.slug}`
  const enPath = `/en/solutions/${page.slug}`
  const alts = localeAlternates(locale, esPath, enPath)
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    keywords: page.keywords,
    alternates: alts,
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: alts.canonical,
      siteName: SITE_NAME,
      locale: locale === 'en' ? 'en_US' : 'es_CL',
      type: 'website',
      images: [{ url: `${BASE_URL}/og/soluciones/${page.slug}.png`, width: 1200, height: 630 }],
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
    image: `${BASE_URL}/opengraph-image`,
    telephone: '+56982307771',
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
    sameAs: [
      'https://www.linkedin.com/company/lx3-ai',
      'https://www.instagram.com/lx3_ai',
    ],
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
    url: `${BASE_URL}/es/servicios/${page.slug}`,
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
