import Link from 'next/link'
import { BLOG_POSTS } from '@/data/blog-posts'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog SEO | Guías, Precios y Tecnología — LX3',
  description:
    'Artículos sobre desarrollo web, software a medida, precios reales y tecnología en Chile. Guías prácticas para empresas.',
}

const categoryLabels: Record<string, string> = {
  precios: 'Precios',
  guias: 'Guías',
  tecnologia: 'Tecnología',
  ia: 'Inteligencia Artificial',
}

export default function SeoBlogIndexPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
        Blog
      </h1>
      <p className="mb-10 text-gray-500">
        Guías, precios reales y recursos para empresas en Chile.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {BLOG_POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/seo-blog/${post.slug}`}
            className="group rounded-xl border border-gray-200 p-6 transition-shadow hover:shadow-md"
          >
            <span
              className="mb-3 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
              style={{ background: '#FF6B4A' }}
            >
              {categoryLabels[post.category] || post.category}
            </span>
            <h2 className="mb-2 text-lg font-bold text-gray-900 group-hover:underline">
              {post.title}
            </h2>
            <p className="mb-3 line-clamp-2 text-sm text-gray-500">
              {post.metaDescription}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString('es-CL', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </time>
              <span>·</span>
              <span>{post.readingTime} min</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
