export default function IndustryCaseStudy({
  caseStudy,
}: {
  caseStudy: { client: string; result: string }
}) {
  return (
    <section className="px-6 py-20" style={{ background: '#0A0F1C' }}>
      <div className="mx-auto max-w-[800px] text-center">
        <p className="mb-6 text-sm font-medium uppercase tracking-wider" style={{ color: '#FF6B4A' }}>
          Caso de éxito
        </p>
        <blockquote className="mb-6 text-2xl font-bold text-white md:text-3xl">
          &ldquo;LX3 desarrolló OPAI, el sistema de gestión operacional de {caseStudy.client}&rdquo;
        </blockquote>
        <p className="mb-8 text-lg text-white/70">{caseStudy.result}</p>
        <div className="flex items-center justify-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white">
            {caseStudy.client.charAt(0)}
          </div>
          <span className="font-medium text-white">{caseStudy.client}</span>
        </div>
      </div>
    </section>
  )
}
