"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { AnimateOnScroll } from "@/components/shared/AnimateOnScroll";
import { JsonLd } from "@/components/shared/JsonLd";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title?: string;
  faqs: FAQ[];
}

export function FAQSection({ title = "Preguntas frecuentes", faqs }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <JsonLd data={faqSchema} />
      <SectionWrapper>
        <AnimateOnScroll>
          <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] md:text-3xl">
            {title}
          </h2>
          <div className="mt-8 space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="flex w-full items-center justify-between p-5 text-left"
                >
                  <span className="pr-4 text-sm font-medium text-[var(--text-primary)]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-[var(--text-tertiary)] transition-transform duration-200 ${
                      openIndex === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openIndex === i && (
                  <div className="border-t border-[var(--border-subtle)] px-5 pb-5 pt-4">
                    <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </AnimateOnScroll>
      </SectionWrapper>
    </>
  );
}
