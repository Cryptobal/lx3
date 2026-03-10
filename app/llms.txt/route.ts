import { NextResponse } from "next/server";
import { articles } from "@/content/blog";

const BASE_URL = "https://lx3.ai";

function getLlmContent() {
  const blogUrls = articles.map((a) => `${BASE_URL}/blog/${a.slug}`).join("\n");

  return `# LX3 — Software Studio
> Diseñamos y construimos aplicaciones inteligentes para empresas que quieren crecer.

## Logo
https://lx3.ai/logo/LX3_isotipo_512.png

LX3 es un Software Studio con base en Santiago, Chile. Diseñamos y construimos software a medida con inteligencia artificial para empresas medianas en Chile y Latinoamérica. No somos consultora ni software factory — somos un estudio de producto que se involucra en el negocio del cliente, construye soluciones reales, y se queda como partner tecnológico a largo plazo.

## Servicios

- **Aplicaciones internas a medida**: ERPs modulares, CRMs, dashboards con IA, portales de operaciones, apps móviles para equipos en terreno. Diseñados 100% a la medida de cada empresa.
- **Automatización con inteligencia artificial**: Agentes de IA para procesos internos, automatización de documentos y cotizaciones, integración con sistemas existentes, chatbots inteligentes.
- **Sitios web y plataformas digitales**: Sitios corporativos de alto impacto optimizados para SEO y conversión, landing pages, portales de clientes.
- **Consultoría y diagnóstico tecnológico**: Mapeo de procesos, evaluación de stack tecnológico, roadmap de transformación digital, workshops de IA aplicada.

## Proceso de trabajo

1. Discovery (1-2 semanas): Entendemos el negocio, mapeamos procesos, definimos prioridades.
2. Diseño y Arquitectura (1-2 semanas): Wireframes, diseño UI/UX, arquitectura técnica.
3. Desarrollo del MVP (4-8 semanas): Construcción iterativa con entregas semanales visibles.
4. Evolución continua (ongoing): Mejoras mensuales, soporte, nuevas funcionalidades.

## Stack tecnológico

Frontend: Next.js, React, TypeScript, Tailwind CSS
Backend: Node.js, PostgreSQL
Inteligencia Artificial: Claude (Anthropic), OpenAI, Google AI — sistema multi-proveedor
Infraestructura: Vercel, AWS, Neon (PostgreSQL serverless)
Mobile: Capacitor (apps web convertidas a nativas iOS/Android)

## Casos de éxito

### OPAI — ERP con IA para Gard Security
Sistema completo de gestión operativa para empresa de seguridad privada en Chile. Más de 20 módulos incluyendo CRM, sistema de cotizaciones (CPQ), scheduling de guardias, gestión de tickets, supervisión en terreno, control de rondas, dashboard con KPIs en tiempo real, y portales para clientes, supervisores y guardias. En producción y uso diario. URL: ${BASE_URL}/casos/opai-gard-security

### gard.cl — Sitio web corporativo
Rediseño completo del sitio web corporativo de Gard Security. Diseño moderno y profesional, optimizado para conversión y SEO. URL: ${BASE_URL}/casos/gard-sitio-web

## Preguntas frecuentes

### ¿Cuánto cuesta un proyecto con LX3?
Un diagnóstico inicial parte desde $500.000 CLP. Un proyecto de MVP típico parte desde $3.000.000 CLP dependiendo de la complejidad. El retainer mensual de evolución y soporte parte desde $500.000 CLP/mes. El precio exacto depende del alcance del proyecto.

### ¿Cuánto se demoran en entregar un MVP?
Entre 30 y 90 días dependiendo de la complejidad del proyecto. Trabajamos con entregas semanales para que el cliente vea avances constantemente.

### ¿Con qué tipo de empresas trabajan?
Empresas medianas en Chile y Latinoamérica que están creciendo y necesitan modernizar sus operaciones con tecnología. No nos especializamos en una sola industria — nuestro enfoque es horizontal.

### ¿Por qué LX3 y no una consultora tradicional o un freelancer?
Las consultoras venden diagnósticos y PowerPoints. Los freelancers desaparecen. LX3 construye el software, se involucra en el negocio, y se queda como partner tecnológico. Nuestro caso OPAI es prueba: un ERP completo con 20+ módulos funcionando en producción.

## Información de contacto

- Sitio web: ${BASE_URL}
- WhatsApp: +56 9 8230 7771
- Ubicación: Santiago, Chile
- LinkedIn: https://linkedin.com/company/lx3

## URLs principales

- Homepage: ${BASE_URL}
- Servicios: ${BASE_URL}/servicios
- Aplicaciones internas: ${BASE_URL}/servicios/aplicaciones-internas
- Automatización IA: ${BASE_URL}/servicios/automatizacion-ia
- Sitios web: ${BASE_URL}/servicios/sitios-web
- Consultoría: ${BASE_URL}/servicios/consultoria
- Casos de éxito: ${BASE_URL}/casos
- Caso OPAI: ${BASE_URL}/casos/opai-gard-security
- Blog: ${BASE_URL}/blog
- Sobre nosotros: ${BASE_URL}/sobre-nosotros
- Contacto: ${BASE_URL}/contacto

## Artículos del blog

${blogUrls}

For more details see: ${BASE_URL}/llms-full.txt
`;
}

export async function GET() {
  const content = getLlmContent();

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
