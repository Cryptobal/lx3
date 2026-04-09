import { notFound } from 'next/navigation'
import { BLOG_POSTS } from '@/data/blog-posts'
import type { Metadata } from 'next'
import BlogArticle from '@/components/blog/BlogArticle'

export async function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = BLOG_POSTS.find((p) => p.slug === slug)
  if (!post) return {}
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    keywords: [post.targetKeyword, ...post.secondaryKeywords],
    alternates: {
      canonical: `https://www.lx3.ai/es/seo-blog/${post.slug}`,
      languages: {
        es: `https://www.lx3.ai/es/seo-blog/${post.slug}`,
        en: `https://www.lx3.ai/en/seo-blog/${post.slug}`,
        'x-default': `https://www.lx3.ai/es/seo-blog/${post.slug}`,
      },
    },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      locale: 'es_CL',
    },
  }
}

export default async function SeoBlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { slug } = await params
  const post = BLOG_POSTS.find((p) => p.slug === slug)
  if (!post) notFound()

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { '@type': 'Organization', name: 'LX3', url: 'https://lx3.ai' },
    publisher: {
      '@type': 'Organization',
      name: 'LX3',
      logo: { '@type': 'ImageObject', url: 'https://lx3.ai/logo.png' },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://lx3.ai/blog/${post.slug}`,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <BlogArticle post={post} />
    </>
  )
}
