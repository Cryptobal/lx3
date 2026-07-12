import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { AnimateOnScroll } from "@/components/shared/AnimateOnScroll";
import { JsonLd } from "@/components/shared/JsonLd";
import { CITIES } from "@/data/cities";

interface ServiceCoverageProps {
  /** Short service label, e.g. "Desarrollo Web Profesional". */
  service: string;
}

/**
 * Single strong local signal instead of 15 thin geo pages: one prose section
 * that names the main Chilean cities + a LocalBusiness schema with areaServed.
 */
export function ServiceCoverage({ service }: ServiceCoverageProps) {
  const cityNames = CITIES.map((c) => c.name);
  const prose = `${cityNames.slice(0, -1).join(", ")} y ${cityNames[cityNames.length - 1]}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "LX3",
    description: `${service} para empresas en todo Chile.`,
    url: "https://www.lx3.ai",
    telephone: "+56982307771",
    email: "contacto@lx3.ai",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Santiago",
      addressRegion: "Región Metropolitana",
      addressCountry: "CL",
    },
    areaServed: [
      ...CITIES.map((c) => ({ "@type": "City", name: c.name })),
      { "@type": "Country", name: "Chile" },
    ],
  };

  return (
    <SectionWrapper>
      <JsonLd data={schema} />
      <AnimateOnScroll>
        <div className="max-w-3xl">
          <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] md:text-3xl">
            Trabajamos con empresas en todo Chile
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)]">
            Operamos 100% en remoto con procesos pensados para equipos
            distribuidos, lo que nos permite acompañar a empresas de {prose} y del
            resto del país con el mismo estándar. Ya sea que estés en la Región
            Metropolitana o en regiones, coordinamos por videollamada, entregamos
            en ciclos cortos y cuando el proyecto lo amerita nos reunimos
            presencialmente en Santiago. La distancia no cambia la calidad: cambia
            la logística, y esa la resolvemos nosotros.
          </p>
        </div>
      </AnimateOnScroll>
    </SectionWrapper>
  );
}
