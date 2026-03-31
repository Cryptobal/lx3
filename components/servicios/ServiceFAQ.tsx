'use client'

import { useState } from 'react'

export default function ServiceFAQ({ faq }: { faq: { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="bg-gray-50 px-6 py-20">
      <div className="mx-auto max-w-[800px]">
        <h2 className="mb-10 text-3xl font-bold text-gray-900">Preguntas frecuentes</h2>
        <div className="divide-y divide-gray-200">
          {faq.map((item, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between py-5 text-left"
              >
                <span className="pr-4 text-base font-medium text-gray-900">{item.q}</span>
                <svg
                  className={`h-5 w-5 shrink-0 text-gray-500 transition-transform ${openIndex === i ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === i && (
                <p className="pb-5 text-gray-600">{item.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
