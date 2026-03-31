'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { BlogPost, BlogSection } from '@/data/blog-posts'

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function TableOfContents({ sections }: { sections: BlogSection[] }) {
  const h2s = sections.filter((s) => s.type === 'h2' && s.heading)
  if (h2s.length === 0) return null

  return (
    <nav className="mb-10 rounded-lg border border-gray-200 bg-gray-50 p-6">
      <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
        Contenido
      </p>
      <ul className="space-y-2">
        {h2s.map((section) => (
          <li key={section.heading}>
            <a
              href={`#${slugify(section.heading!)}`}
              className="text-sm text-gray-700 underline-offset-2 hover:underline"
              style={{ color: '#FF6B4A' }}
            >
              {section.heading}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left font-medium text-gray-900"
      >
        {question}
        <span className="ml-4 shrink-0 text-gray-400">{open ? '−' : '+'}</span>
      </button>
      {open && <p className="pb-4 text-gray-600">{answer}</p>}
    </div>
  )
}

function SectionRenderer({ section }: { section: BlogSection }) {
  switch (section.type) {
    case 'intro':
      return (
        <p
          className="mb-8 border-l-4 pl-5 text-lg leading-relaxed text-gray-700"
          style={{ borderColor: '#FF6B4A' }}
        >
          {section.text}
        </p>
      )
    case 'h2':
      return (
        <>
          <h2
            id={section.heading ? slugify(section.heading) : undefined}
            className="mb-4 mt-10 text-2xl font-bold text-gray-900"
          >
            {section.heading}
          </h2>
          {section.text && <p className="mb-4 text-gray-600">{section.text}</p>}
        </>
      )
    case 'h3':
      return (
        <h3 className="mb-3 mt-6 text-xl font-semibold text-gray-900">
          {section.heading}
        </h3>
      )
    case 'p':
      return <p className="mb-4 text-gray-600 leading-relaxed">{section.text}</p>
    case 'list':
      return (
        <ul className="mb-6 ml-1 space-y-2">
          {section.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-600">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: '#FF6B4A' }} />
              {item}
            </li>
          ))}
        </ul>
      )
    case 'table':
      return (
        <div className="mb-6 overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-left text-sm">
            {section.headers && (
              <thead>
                <tr style={{ background: '#0A0F1C' }}>
                  {section.headers.map((h) => (
                    <th key={h} className="px-4 py-3 font-semibold text-white whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {section.rows?.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-3 text-gray-700 whitespace-nowrap">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case 'cta':
      return (
        <div
          className="my-10 rounded-xl p-8 text-center"
          style={{ background: '#FF6B4A' }}
        >
          <p className="mb-4 text-xl font-bold text-white">{section.text}</p>
          <Link
            href="/cotiza"
            className="inline-block rounded-lg bg-white px-8 py-3 font-semibold transition-opacity hover:opacity-90"
            style={{ color: '#FF6B4A' }}
          >
            Ir al cotizador →
          </Link>
        </div>
      )
    case 'faq':
      return (
        <FAQItem
          question={section.question || ''}
          answer={section.answer || ''}
        />
      )
    default:
      return null
  }
}

const categoryLabels: Record<string, string> = {
  precios: 'Precios',
  guias: 'Guías',
  tecnologia: 'Tecnología',
  ia: 'Inteligencia Artificial',
}

export default function BlogArticle({ post }: { post: BlogPost }) {
  return (
    <article className="mx-auto max-w-[780px] px-6 py-16">
      {/* Header */}
      <header className="mb-10">
        <span
          className="mb-4 inline-block rounded-full px-3 py-1 text-xs font-semibold text-white"
          style={{ background: '#FF6B4A' }}
        >
          {categoryLabels[post.category] || post.category}
        </span>
        <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
          {post.title}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <span>Equipo LX3</span>
          <span>·</span>
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString('es-CL', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <span>·</span>
          <span>{post.readingTime} min de lectura</span>
        </div>
      </header>

      {/* Table of Contents */}
      <TableOfContents sections={post.content} />

      {/* Content */}
      <div>
        {post.content.map((section, i) => (
          <SectionRenderer key={i} section={section} />
        ))}
      </div>
    </article>
  )
}
