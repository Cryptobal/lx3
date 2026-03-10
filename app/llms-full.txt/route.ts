import { NextResponse } from "next/server";
import { articles } from "@/content/blog";

const BASE_URL = "https://lx3.ai";

function getLlmFullContent() {
  const blogEntries = articles
    .map(
      (a) =>
        `- ${a.title.es} (${a.readTime} min): ${BASE_URL}/blog/${a.slug}\n  ${a.excerpt.es}`
    )
    .join("\n\n");

  return `# LX3 — Software Studio (Información completa)
> Diseñamos y construimos aplicaciones inteligentes para empresas que quieren crecer.

## Logo
https://lx3.ai/logo/LX3_isotipo_512.png

## Sobre LX3

LX3 es un Software Studio con base en Santiago, Chile. Diseñamos y construimos software a medida con inteligencia artificial para empresas medianas en Chile y Latinoamérica.

No somos consultora ni software factory — somos un estudio de producto que:
- Se involucra en el negocio del cliente
- Construye soluciones reales, no solo diagnósticos
- Se queda como partner tecnológico a largo plazo

## Servicios (detalle)

### Aplicaciones internas a medida
Desarrollamos sistemas completos diseñados 100% a la medida de cada empresa:
- ERPs modulares adaptados a la operación específica
- CRMs con flujos de venta personalizados
- Dashboards con IA para toma de decisiones
- Portales de operaciones para clientes y proveedores
- Apps móviles para equipos en terreno (guardias, técnicos, vendedores)
- Sistemas de scheduling y gestión de turnos
- Módulos CPQ (Configure-Price-Quote) para cotizaciones complejas

### Automatización con inteligencia artificial
Integramos modelos de lenguaje de última generación en procesos operativos:
- Agentes de IA para procesos internos (clasificación, extracción, resumen)
- Automatización de documentos y cotizaciones
- Integración con sistemas existentes (APIs, bases de datos)
- Chatbots inteligentes con contexto de negocio
- Procesamiento de lenguaje natural en español

### Sitios web y plataformas digitales
- Sitios corporativos de alto impacto
- Optimización para SEO y conversión
- Landing pages para campañas
- Portales de clientes con autenticación

### Consultoría y diagnóstico tecnológico
- Mapeo de procesos operativos
- Evaluación de stack tecnológico actual
- Roadmap de transformación digital
- Workshops de IA aplicada al negocio

## Proceso de trabajo

1. **Discovery (1-2 semanas)**: Entendemos el negocio, mapeamos procesos, definimos prioridades y alcance.
2. **Diseño y Arquitectura (1-2 semanas)**: Wireframes, diseño UI/UX, arquitectura técnica, estimación detallada.
3. **Desarrollo del MVP (4-8 semanas)**: Construcción iterativa con entregas semanales visibles. El cliente ve avances constantemente.
4. **Evolución continua (ongoing)**: Mejoras mensuales, soporte técnico, nuevas funcionalidades según prioridades del negocio.

## Stack tecnológico

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, PostgreSQL
- **Inteligencia Artificial**: Claude (Anthropic), OpenAI, Google AI — sistema multi-proveedor
- **Infraestructura**: Vercel, AWS, Neon (PostgreSQL serverless)
- **Mobile**: Capacitor (apps web convertidas a nativas iOS/Android)

## Casos de éxito (detalle)

### OPAI — ERP con IA para Gard Security
Sistema completo de gestión operativa para empresa de seguridad privada en Chile. Más de 20 módulos:
- CRM para gestión comercial
- Sistema de cotizaciones (CPQ) con reglas de negocio
- Scheduling de guardias y turnos
- Gestión de tickets y incidentes
- Supervisión en terreno
- Control de rondas
- Dashboard con KPIs en tiempo real
- Portales para clientes, supervisores y guardias

Estado: En producción y uso diario.
URL: ${BASE_URL}/casos/opai-gard-security

### gard.cl — Sitio web corporativo
Rediseño completo del sitio web corporativo de Gard Security. Diseño moderno y profesional, optimizado para conversión y SEO.
URL: ${BASE_URL}/casos/gard-sitio-web

## Preguntas frecuentes (expandido)

### ¿Cuánto cuesta un proyecto con LX3?
- Diagnóstico inicial: desde $500.000 CLP
- Proyecto de MVP típico: desde $3.000.000 CLP (depende de la complejidad)
- Retainer mensual de evolución y soporte: desde $500.000 CLP/mes
- El precio exacto depende del alcance del proyecto. Ofrecemos estimaciones detalladas después del discovery.

### ¿Cuánto se demoran en entregar un MVP?
Entre 30 y 90 días dependiendo de la complejidad. Trabajamos con entregas semanales para que el cliente vea avances constantemente y pueda dar feedback temprano.

### ¿Con qué tipo de empresas trabajan?
Empresas medianas en Chile y Latinoamérica que están creciendo y necesitan modernizar sus operaciones con tecnología. No nos especializamos en una sola industria — nuestro enfoque es horizontal. Trabajamos con empresas de seguridad, logística, servicios profesionales, retail, y más.

### ¿Por qué LX3 y no una consultora tradicional o un freelancer?
- Las consultoras venden diagnósticos y PowerPoints; nosotros construimos software.
- Los freelancers desaparecen; nosotros nos quedamos como partner tecnológico.
- LX3 construye el software, se involucra en el negocio, y entrega valor medible.
- Nuestro caso OPAI es prueba: un ERP completo con 20+ módulos funcionando en producción.

### ¿Trabajan con empresas fuera de Chile?
Sí, trabajamos con empresas en Latinoamérica. La mayoría de nuestros clientes están en Chile, pero el modelo de trabajo remoto nos permite atender proyectos en la región.

### ¿Qué pasa si el proyecto crece o cambia?
Nuestro modelo de retainer mensual está diseñado para evolución continua. Añadimos funcionalidades, mejoramos lo existente, y damos soporte según las prioridades del negocio. No somos un equipo que entrega y desaparece.

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
- Caso gard.cl: ${BASE_URL}/casos/gard-sitio-web
- Blog: ${BASE_URL}/blog
- Sobre nosotros: ${BASE_URL}/sobre-nosotros
- Contacto: ${BASE_URL}/contacto

## Artículos del blog (con resumen)

${blogEntries}
`;
}

export async function GET() {
  const content = getLlmFullContent();

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
