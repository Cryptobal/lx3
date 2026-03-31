import type { PricingPageData } from "@/components/seo-pages/PricingPageLayout";

export const pricingPages: Record<string, PricingPageData> = {
  "pagina-web": {
    slug: "pagina-web",
    title: "Precio Página Web Chile 2026",
    titleAccent: "Página Web",
    subtitle: "Sitios web profesionales con Next.js, optimizados para SEO, velocidad y conversión. Desde landing pages hasta sitios corporativos completos.",
    priceRange: "$490.000 — $1.490.000 CLP",
    tiers: [
      {
        name: "Landing Pro",
        price: "$490.000",
        description: "1 página profesional, diseño responsive, formulario de contacto, SEO on-page, hosting 1 año.",
        features: ["1 página responsive de alto impacto", "Diseño profesional con tu marca", "Formulario de contacto funcional", "SEO básico on-page", "Google Analytics configurado", "Hosting y dominio 1 año incluido"],
      },
      {
        name: "Web Profesional",
        price: "$990.000",
        recommended: true,
        description: "Hasta 5 páginas, diseño a medida, SEO on-page completo, panel de administración.",
        features: ["Hasta 5 páginas diseñadas", "Diseño 100% a medida", "SEO on-page completo", "Panel admin para editar contenido", "Blog integrado", "Formularios inteligentes", "Hosting y dominio 1 año incluido"],
      },
      {
        name: "Web Corporativa",
        price: "$1.490.000",
        description: "Páginas ilimitadas, integraciones, multi-idioma, soporte prioritario. Para empresas que necesitan escalar.",
        features: ["Páginas ilimitadas", "Integraciones (WhatsApp, CRM, email)", "Multi-idioma (next-intl)", "Soporte prioritario 6 meses", "Chatbot IA opcional", "Optimización de conversión", "Hosting y dominio 1 año incluido"],
      },
    ],
    testimonial: {
      quote: "LX3 nos entregó un sitio web que carga en menos de 1 segundo y generó leads desde la primera semana.",
      author: "Gard Security",
      company: "gard.cl",
    },
    faqs: [
      { question: "¿Cuánto demora tener mi página web lista?", answer: "Una landing page toma 1-2 semanas. Un sitio corporativo 2-4 semanas. Trabajamos con entregas parciales para que veas avances desde la primera semana." },
      { question: "¿El precio incluye hosting y dominio?", answer: "Sí, el primer año está incluido. Después, el costo anual no supera los $50.000 CLP en la mayoría de los casos." },
      { question: "¿Puedo editar el contenido yo mismo?", answer: "Sí. Dependiendo del plan, te entregamos acceso para editar textos, imágenes y contenido del blog sin necesidad de un desarrollador." },
      { question: "¿Usan WordPress?", answer: "No. Construimos con Next.js + React, la misma tecnología que usan Hulu, TikTok y Nike. Esto garantiza velocidad de carga sub-segundo, SEO técnico nativo y cero dependencia de plugins." },
    ],
    ctaTitle: "¿Listo para tu página web profesional?",
    ctaSubtitle: "Cotiza en 2 minutos con nuestro cotizador inteligente.",
  },

  "desarrollo-web": {
    slug: "desarrollo-web",
    title: "Precio Desarrollo de Aplicaciones Web Chile 2026",
    titleAccent: "Aplicaciones Web",
    subtitle: "Aplicaciones web a medida con panel admin, base de datos, roles y integraciones. Para empresas que necesitan más que un sitio web.",
    priceRange: "$1.490.000 — $5.000.000+ CLP",
    tiers: [
      {
        name: "App Web Simple",
        price: "$1.490.000",
        description: "Hasta 5 módulos, panel admin, base de datos, autenticación.",
        features: ["Hasta 5 módulos funcionales", "Panel de administración", "Base de datos PostgreSQL", "Autenticación de usuarios", "Diseño responsive", "Deploy en Vercel"],
      },
      {
        name: "App Web Completa",
        price: "$3.000.000",
        recommended: true,
        description: "Módulos ilimitados, integraciones, roles y permisos, reportes.",
        features: ["Módulos ilimitados", "Roles y permisos granulares", "Integraciones (API, email, WhatsApp)", "Dashboard con reportes", "Notificaciones automáticas", "Soporte 6 meses incluido"],
      },
      {
        name: "Plataforma",
        price: "$5.000.000+",
        description: "API REST completa, multi-empresa, IA integrada, arquitectura escalable.",
        features: ["API REST documentada", "Arquitectura multi-empresa", "IA integrada (chatbot, búsqueda, automatización)", "Infraestructura escalable", "Monitoreo y observabilidad", "Soporte y evolución continua"],
      },
    ],
    faqs: [
      { question: "¿Cuál es la diferencia entre una página web y una aplicación web?", answer: "Una página web muestra información. Una aplicación web tiene lógica de negocio: usuarios, datos, procesos, formularios inteligentes, dashboards. Si necesitas que tu equipo inicie sesión y trabaje en un sistema, necesitas una aplicación web." },
      { question: "¿Qué tecnologías usan?", answer: "Next.js, React, TypeScript, PostgreSQL, Prisma, Tailwind CSS, Vercel. El mismo stack que usan startups de Silicon Valley." },
      { question: "¿Cuánto demora desarrollar una aplicación web?", answer: "Un MVP funcional toma 4-8 semanas. Una aplicación completa 2-4 meses. Siempre empezamos por el flujo crítico para que tengas valor desde el primer mes." },
      { question: "¿Incluye soporte después del lanzamiento?", answer: "Sí. Todos los planes incluyen soporte post-lanzamiento. Además ofrecemos planes de mantenimiento mensual para evolución continua." },
    ],
    ctaTitle: "¿Necesitas una aplicación web a medida?",
    ctaSubtitle: "Cuéntanos tu proyecto y te damos una estimación en 48 horas.",
  },

  "software-empresarial": {
    slug: "software-empresarial",
    title: "Precio Software Empresarial a Medida Chile 2026",
    titleAccent: "Software Empresarial",
    subtitle: "Sistemas ERP, plataformas operativas y software de gestión diseñados para la realidad de tu empresa.",
    priceRange: "$3.000.000 — $10.000.000+ CLP",
    tiers: [
      {
        name: "MVP",
        price: "$3.000.000",
        description: "3-5 módulos core, validación rápida, base para iterar.",
        features: ["3-5 módulos funcionales", "MVP funcional en 30-60 días", "Diseño UX profesional", "Base de datos empresarial", "Autenticación + roles básicos", "Deploy y hosting incluido"],
      },
      {
        name: "Sistema Empresarial",
        price: "$5.000.000",
        recommended: true,
        description: "5-10 módulos, integraciones profundas, reportes avanzados, multi-usuario.",
        features: ["5-10 módulos integrados", "Integraciones (ERP, CRM, facturación)", "Reportes y dashboards ejecutivos", "Roles y permisos avanzados", "Auditoría y trazabilidad", "Soporte y evolución 6 meses"],
      },
      {
        name: "ERP Completo",
        price: "$10.000.000+",
        description: "10+ módulos, IA integrada, multi-empresa, operación completa.",
        features: ["10+ módulos completos", "IA integrada (automatización, predicción)", "Multi-empresa / multi-sucursal", "API REST para integraciones", "Infraestructura enterprise", "Equipo dedicado de evolución"],
      },
    ],
    testimonial: {
      quote: "OPAI unificó toda nuestra operación en una sola plataforma. 20+ módulos, cientos de usuarios, tiempo real.",
      author: "Gard Security",
      company: "Caso OPAI",
    },
    faqs: [
      { question: "¿Cuánto tiempo toma desarrollar un ERP a medida?", answer: "Un MVP toma 1-2 meses. Un sistema completo 3-6 meses. Siempre empezamos por un MVP para validar antes de escalar." },
      { question: "¿Es más caro que comprar SAP u Odoo?", answer: "A corto plazo, puede parecer más caro. A 3 años, el costo total de propiedad suele ser menor porque no pagas licencias por usuario y el sistema se adapta 100% a tu operación." },
      { question: "¿Pueden integrar con mi sistema actual?", answer: "Sí. Integramos con ERPs, CRMs, sistemas de facturación, WhatsApp, email y cualquier API. La integración es parte del desarrollo." },
      { question: "¿Qué pasa si necesito más módulos después?", answer: "La arquitectura está diseñada para crecer. Puedes agregar módulos progresivamente con nuestro plan de retainer mensual." },
    ],
    ctaTitle: "¿Tu empresa necesita software a medida?",
    ctaSubtitle: "Agenda una consulta gratuita y te ayudamos a definir el alcance.",
  },

  crm: {
    slug: "crm",
    title: "Precio CRM Personalizado Chile 2026",
    titleAccent: "CRM Personalizado",
    subtitle: "CRM a medida que se adapta a tu proceso comercial, no al revés. Sin licencias por usuario, sin límites artificiales.",
    priceRange: "$1.490.000 — $4.900.000 CLP",
    tiers: [
      {
        name: "CRM Básico",
        price: "$1.490.000",
        description: "Pipeline de ventas + gestión de contactos.",
        features: ["Pipeline de ventas visual", "Gestión de contactos y empresas", "Historial de interacciones", "Formularios de captura de leads", "Dashboard de métricas básicas", "Usuarios ilimitados"],
      },
      {
        name: "CRM Completo",
        price: "$2.900.000",
        recommended: true,
        description: "Email integrado, automatizaciones, reportes avanzados, cotizaciones.",
        features: ["Todo lo del plan Básico", "Integración email (Gmail/Outlook)", "Automatizaciones de seguimiento", "Sistema de cotizaciones con PDF", "Reportes avanzados y forecasting", "API para integraciones externas"],
      },
      {
        name: "CRM Enterprise",
        price: "$4.900.000",
        description: "WhatsApp Business API, IA integrada, multi-equipo, scoring de leads.",
        features: ["Todo lo del plan Completo", "WhatsApp Business API integrado", "IA para scoring de leads", "Multi-equipo con permisos", "Chatbot de captación automática", "Integraciones con ERP/facturación"],
      },
    ],
    faqs: [
      { question: "¿Por qué un CRM a medida en vez de Salesforce o HubSpot?", answer: "Con un CRM a medida no pagas licencias por usuario ($25-150 USD/mes/usuario en Salesforce), tienes control total de tus datos, y el sistema se adapta a tu proceso comercial exacto. A partir de 10 usuarios, el costo total de propiedad es menor." },
      { question: "¿Pueden migrar mis datos desde HubSpot/Salesforce?", answer: "Sí. Migramos contactos, deals, historial y archivos. El proceso toma 1-2 semanas dependiendo del volumen de datos." },
      { question: "¿El CRM funciona en celular?", answer: "Sí. Todos nuestros CRM son responsive y funcionan perfectamente en celular y tablet. Tu equipo comercial puede actualizar deals desde cualquier dispositivo." },
      { question: "¿Incluye integración con WhatsApp?", answer: "El plan Enterprise incluye WhatsApp Business API con historial completo de conversaciones en el CRM. Los planes Básico y Completo incluyen link directo a WhatsApp." },
    ],
    ctaTitle: "¿Necesitas un CRM que se adapte a ti?",
    ctaSubtitle: "Cotiza tu CRM personalizado sin compromiso.",
  },

  "tienda-online": {
    slug: "tienda-online",
    title: "Precio Tienda Online Chile 2026",
    titleAccent: "Tienda Online",
    subtitle: "E-commerce profesional con Webpay, inventario, cupones y despacho integrado. Sin comisiones por venta.",
    priceRange: "$890.000 — $2.900.000 CLP",
    tiers: [
      {
        name: "Tienda Básica",
        price: "$890.000",
        description: "Hasta 50 productos, Webpay integrado, diseño profesional.",
        features: ["Hasta 50 productos", "Webpay / MercadoPago integrado", "Carrito de compras", "Diseño responsive profesional", "Panel admin para productos", "SEO básico"],
      },
      {
        name: "Tienda Pro",
        price: "$1.690.000",
        recommended: true,
        description: "Inventario, cupones, despacho, productos ilimitados, reportes de ventas.",
        features: ["Productos ilimitados", "Gestión de inventario", "Sistema de cupones y descuentos", "Integración despacho (Starken, Chilexpress)", "Reportes de ventas y métricas", "Email de confirmación automático"],
      },
      {
        name: "Marketplace / Enterprise",
        price: "$2.900.000",
        description: "Multi-vendedor, ERP integrado, múltiples bodegas, IA para recomendaciones.",
        features: ["Todo lo del plan Pro", "Multi-vendedor / marketplace", "Múltiples bodegas / sucursales", "Integración ERP / facturación electrónica", "Recomendaciones con IA", "API REST para integraciones"],
      },
    ],
    faqs: [
      { question: "¿Cobran comisión por venta?", answer: "No. LX3 no cobra comisiones por venta. Solo pagas el desarrollo y el plan de mantenimiento opcional. Las comisiones de Webpay/MercadoPago son aparte (2.49%-3.49%)." },
      { question: "¿Puedo usar Webpay y MercadoPago juntos?", answer: "Sí. Configuramos múltiples pasarelas de pago para que tus clientes elijan cómo pagar." },
      { question: "¿Incluye facturación electrónica?", answer: "El plan Enterprise incluye integración con facturación electrónica. Para los otros planes, se puede agregar como add-on." },
      { question: "¿Es mejor que Shopify?", answer: "Depende. Shopify es más rápido de montar pero cobras comisiones y tienes limitaciones. Una tienda a medida es tuya, sin comisiones, y se integra con tus sistemas internos." },
    ],
    ctaTitle: "¿Listo para vender online?",
    ctaSubtitle: "Cotiza tu tienda online profesional sin compromiso.",
  },

  seo: {
    slug: "seo",
    title: "Precio SEO Mensual Chile 2026",
    titleAccent: "SEO Mensual",
    subtitle: "Posicionamiento web orgánico con estrategia de contenido, optimización técnica y link building. Resultados medibles desde el mes 3.",
    priceRange: "$290.000 — $890.000 CLP/mes",
    tiers: [
      {
        name: "SEO Básico",
        price: "$290.000",
        period: "/mes",
        description: "Para empresas que inician su presencia orgánica.",
        features: ["Auditoría SEO inicial", "Optimización on-page (5 páginas)", "2 artículos de blog al mes", "Investigación de keywords", "Reporte mensual de posiciones", "Google Search Console configurado"],
      },
      {
        name: "SEO Pro",
        price: "$590.000",
        period: "/mes",
        recommended: true,
        description: "Para empresas que quieren competir en keywords difíciles.",
        features: ["Todo lo del plan Básico", "Optimización on-page (15 páginas)", "4 artículos de blog al mes", "Link building activo", "Optimización de velocidad", "Schema markup avanzado", "Análisis de competencia mensual"],
      },
      {
        name: "SEO Enterprise",
        price: "$890.000",
        period: "/mes",
        description: "Para empresas con alta competencia que necesitan dominar su vertical.",
        features: ["Todo lo del plan Pro", "Páginas ilimitadas optimizadas", "8+ artículos de blog al mes", "Link building premium", "Contenido con IA optimizado", "Geo pages y landing pages SEO", "Llamada estratégica semanal"],
      },
    ],
    faqs: [
      { question: "¿Cuánto tarda el SEO en dar resultados?", answer: "Los primeros resultados se ven entre el mes 2-3. Resultados significativos (primeras posiciones en keywords relevantes) toman 4-6 meses. El SEO es una inversión a mediano plazo que se acumula." },
      { question: "¿Garantizan posición #1 en Google?", answer: "Nadie puede garantizar posiciones en Google. Lo que sí garantizamos es un proceso profesional, métricas transparentes y mejora continua medible mes a mes." },
      { question: "¿Puedo cancelar cuando quiera?", answer: "Sí. No hay contratos de permanencia. Recomendamos un mínimo de 6 meses para ver resultados reales, pero puedes cancelar mes a mes." },
      { question: "¿Qué tipo de contenido crean?", answer: "Artículos de blog optimizados para keywords de tu industria, guías, comparativas, y contenido educativo que posiciona y genera confianza." },
    ],
    ctaTitle: "¿Quieres aparecer primero en Google?",
    ctaSubtitle: "Agenda una consulta SEO gratuita y analizamos tu situación actual.",
  },
};

export function getPricingPageData(slug: string): PricingPageData | undefined {
  return pricingPages[slug];
}

export function getAllPricingSlugs(): string[] {
  return Object.keys(pricingPages);
}
