export type ServiceSlug =
  | 'desarrollo-web'
  | 'aplicaciones-ia'
  | 'software-a-medida'
  | 'crm-personalizado'
  | 'tienda-online'
  | 'posicionamiento-web'
  | 'automatizacion-ia'
  | 'landing-pages'
  | 'sistema-cotizaciones'
  | 'desarrollo-fullstack'
  | 'ecommerce-medida'
  | 'chatbot-ia'

export type IndustrySlug =
  | 'empresas-seguridad'
  | 'clinicas'
  | 'logistica'
  | 'pymes'
  | 'constructoras'
  | 'restaurantes'
  | 'retail'

export interface ServicePage {
  slug: ServiceSlug
  title: string
  metaTitle: string
  metaDescription: string
  h1: string
  keywords: string[]
  faq: { q: string; a: string }[]
  relatedSlugs: ServiceSlug[]
}

export interface IndustryPage {
  slug: IndustrySlug
  title: string
  metaTitle: string
  metaDescription: string
  h1: string
  keywords: string[]
  caseStudy?: { client: string; result: string }
}

export const SERVICE_PAGES: ServicePage[] = [
  {
    slug: 'desarrollo-web',
    title: 'Desarrollo Web Chile',
    metaTitle: 'Desarrollo Web Chile | Páginas y Aplicaciones Profesionales — LX3',
    metaDescription: 'Empresa de desarrollo web en Chile. Creamos sitios y aplicaciones web modernas con Next.js, React y TypeScript. Cotiza al instante sin formulario.',
    h1: 'Desarrollo web profesional en Chile',
    keywords: ['desarrollo web Chile', 'empresa de desarrollo web Santiago', 'desarrollo web full stack Chile', 'agencia de desarrollo web Chile'],
    faq: [
      { q: '¿Cuánto cuesta una página web en Chile?', a: 'El costo varía según complejidad. Una landing page parte desde $390.000 CLP y una aplicación web a medida desde $1.900.000 CLP. Usa nuestro cotizador instantáneo para obtener un precio en menos de 2 minutos.' },
      { q: '¿Cuánto demora el desarrollo web?', a: 'Una página corporativa toma 2-3 semanas. Una aplicación web completa entre 6-12 semanas dependiendo del alcance.' },
      { q: '¿Trabajan con empresas de todas las industrias?', a: 'Sí. Tenemos experiencia en seguridad, salud, logística, retail y pymes. Cada proyecto es personalizado.' },
    ],
    relatedSlugs: ['aplicaciones-ia', 'software-a-medida', 'posicionamiento-web'],
  },
  {
    slug: 'aplicaciones-ia',
    title: 'Aplicaciones con IA Chile',
    metaTitle: 'Aplicaciones con Inteligencia Artificial Chile | Desarrollo IA — LX3',
    metaDescription: 'Desarrollamos aplicaciones web con IA integrada en Chile. Chatbots, automatización, análisis de datos y más. Cotiza tu proyecto al instante.',
    h1: 'Aplicaciones web con inteligencia artificial en Chile',
    keywords: ['aplicaciones con IA Chile', 'página web con inteligencia artificial Chile', 'desarrollo software con IA', 'desarrollo con inteligencia artificial'],
    faq: [
      { q: '¿Qué tipo de IA se puede integrar en mi aplicación?', a: 'Trabajamos con modelos de lenguaje (GPT-4, Claude), análisis de imágenes, automatización de procesos y agentes IA. Todo adaptado a tu caso de uso específico.' },
      { q: '¿Necesito infraestructura especial para usar IA?', a: 'No. Nos encargamos de toda la arquitectura cloud. Tu equipo solo usa la aplicación final.' },
      { q: '¿Cuánto cuesta integrar IA en mi empresa?', a: 'Depende del alcance. Un chatbot básico parte desde $590.000 CLP. Proyectos más complejos se cotizan tras un diagnóstico técnico gratuito.' },
    ],
    relatedSlugs: ['chatbot-ia', 'automatizacion-ia', 'software-a-medida'],
  },
  {
    slug: 'software-a-medida',
    title: 'Software a Medida Chile',
    metaTitle: 'Software Personalizado para Empresas Chile | Sistemas a Medida — LX3',
    metaDescription: 'Desarrollo de software empresarial a medida en Chile. CRM, ERP, sistemas de gestión y plataformas digitales. Precio transparente, sin sorpresas.',
    h1: 'Software personalizado para empresas en Chile',
    keywords: ['software personalizado para empresas', 'desarrollo de software a medida Chile', 'empresa de software Chile', 'sistema web para empresas Chile', 'software empresarial a medida precio'],
    faq: [
      { q: '¿Qué es el software a medida y por qué lo necesito?', a: 'Es un sistema diseñado específicamente para tus procesos. A diferencia del software genérico (como SAP), se adapta exactamente a cómo opera tu empresa, reduciendo costos de capacitación y errores.' },
      { q: '¿Cuánto cuesta un sistema a medida en Chile?', a: 'Un sistema web básico parte desde $1.900.000 CLP. Sistemas empresariales complejos se presupuestan tras un diagnóstico.' },
      { q: '¿Me entregan el código fuente?', a: 'Sí. Tienes propiedad total del código. Puedes modificarlo o darle mantenimiento con cualquier desarrollador.' },
    ],
    relatedSlugs: ['crm-personalizado', 'desarrollo-web', 'sistema-cotizaciones'],
  },
  {
    slug: 'crm-personalizado',
    title: 'CRM Personalizado Chile',
    metaTitle: 'CRM Personalizado para Empresas Chile | Desarrollo CRM — LX3',
    metaDescription: 'Desarrollamos CRM a medida para empresas chilenas. Pipeline de ventas, gestión de leads, cotizaciones automáticas. Más barato y mejor que soluciones genéricas.',
    h1: 'CRM personalizado para empresas en Chile',
    keywords: ['CRM personalizado Chile', 'CRM barato para empresas Chile', 'CRM para pymes Chile', 'desarrollo CRM personalizado Chile', 'sistema de gestión comercial Chile'],
    faq: [
      { q: '¿Por qué un CRM a medida en vez de Salesforce o HubSpot?', a: 'Los CRM genéricos cobran por usuario mensualmente y tienen funciones que nunca usarás. Un CRM a medida se paga una vez, hace exactamente lo que necesitas y no tiene costos recurrentes de licencia.' },
      { q: '¿Incluye integración con email y WhatsApp?', a: 'Sí, podemos integrar envío de emails automáticos, notificaciones y seguimiento de comunicaciones.' },
      { q: '¿Cuánto cuesta un CRM a medida?', a: 'Nuestros CRM parten desde $1.490.000 CLP con setup fee + mantención mensual opcional.' },
    ],
    relatedSlugs: ['software-a-medida', 'sistema-cotizaciones', 'automatizacion-ia'],
  },
  {
    slug: 'tienda-online',
    title: 'Tienda Online Chile',
    metaTitle: 'Tienda Online Chile con Webpay | E-commerce Profesional — LX3',
    metaDescription: 'Creamos tiendas online profesionales en Chile con Webpay integrado. Next.js, diseño a medida, panel de administración incluido. Cotiza al instante.',
    h1: 'Tienda online profesional en Chile',
    keywords: ['tienda online con Webpay Chile', 'desarrollo e-commerce Chile', 'ecommerce a medida Chile', 'tienda online Chile precio', 'página web con carrito de compras Chile'],
    faq: [
      { q: '¿Incluye integración con Webpay?', a: 'Sí, todas nuestras tiendas online incluyen integración con Transbank Webpay Plus para pagos con tarjeta de crédito, débito y prepago.' },
      { q: '¿Puedo administrar los productos yo mismo?', a: 'Sí. Te entregamos un panel de administración donde puedes agregar, editar y gestionar productos, pedidos e inventario sin saber programar.' },
      { q: '¿Cuánto cuesta una tienda online en Chile?', a: 'Una tienda online parte desde $890.000 CLP. Incluye diseño, desarrollo, integración Webpay y capacitación.' },
    ],
    relatedSlugs: ['desarrollo-web', 'ecommerce-medida', 'aplicaciones-ia'],
  },
  {
    slug: 'posicionamiento-web',
    title: 'Posicionamiento Web Chile',
    metaTitle: 'Posicionamiento Web Chile | SEO para Empresas y Pymes — LX3',
    metaDescription: 'SEO técnico y posicionamiento web en Chile. Audit, optimización on-page, link building y contenido. Resultados medibles desde el mes 3.',
    h1: 'Posicionamiento web y SEO en Chile',
    keywords: ['posicionamiento web Chile', 'SEO para pymes Chile', 'agencia SEO Chile precio', 'optimización web Chile', 'cómo posicionar mi página web en Google Chile'],
    faq: [
      { q: '¿En cuánto tiempo se ven resultados SEO?', a: 'Los primeros movimientos de ranking se ven entre el mes 2 y 3. Resultados consolidados y tráfico significativo entre el mes 4 y 6.' },
      { q: '¿Qué incluye el servicio SEO?', a: 'Audit técnico inicial, optimización on-page, estrategia de contenido, link building y reportes mensuales.' },
      { q: '¿Cuánto cuesta el SEO mensual?', a: 'Nuestros planes SEO parten desde $290.000 CLP/mes. Cotiza según el tamaño y objetivos de tu sitio.' },
    ],
    relatedSlugs: ['desarrollo-web', 'landing-pages', 'aplicaciones-ia'],
  },
  {
    slug: 'landing-pages',
    title: 'Landing Pages Chile',
    metaTitle: 'Landing Pages Optimizadas Chile | Alta Conversión — LX3',
    metaDescription: 'Diseño y desarrollo de landing pages de alta conversión en Chile. A/B testing, integración con ads, velocidad máxima. Resultados medibles.',
    h1: 'Landing pages de alta conversión en Chile',
    keywords: ['landing page optimizada Chile', 'hacer página web barata Chile', 'crear página web Chile precio'],
    faq: [
      { q: '¿Qué diferencia una landing page de un sitio web?', a: 'Una landing page tiene un único objetivo de conversión (vender, captar leads, registrar usuarios). Un sitio web tiene múltiples páginas y propósitos. Para campañas de ads, siempre es mejor una landing dedicada.' },
      { q: '¿Incluyen A/B testing?', a: 'Sí en planes avanzados. Podemos crear variantes y medir cuál convierte mejor.' },
    ],
    relatedSlugs: ['desarrollo-web', 'posicionamiento-web'],
  },
  {
    slug: 'automatizacion-ia',
    title: 'Automatización con IA Chile',
    metaTitle: 'Automatización de Procesos con IA Chile | Empresas — LX3',
    metaDescription: 'Automatizamos procesos empresariales con inteligencia artificial en Chile. Reduce costos operativos, elimina tareas repetitivas. Cotiza tu diagnóstico.',
    h1: 'Automatización de procesos con IA para empresas en Chile',
    keywords: ['automatización con IA para negocios', 'automatización de procesos empresariales Chile', 'automatización de ventas Chile', 'implementar IA en mi empresa', 'inteligencia artificial para empresas Chile'],
    faq: [
      { q: '¿Qué procesos se pueden automatizar con IA?', a: 'Clasificación de documentos, respuesta a correos, generación de informes, calificación de leads, gestión de inventario, y cualquier proceso basado en reglas o patrones de datos.' },
      { q: '¿Necesito cambiar mis sistemas actuales?', a: 'No necesariamente. Podemos integrar automatizaciones sobre tu infraestructura existente.' },
    ],
    relatedSlugs: ['aplicaciones-ia', 'chatbot-ia', 'crm-personalizado'],
  },
  {
    slug: 'chatbot-ia',
    title: 'Chatbot con IA Chile',
    metaTitle: 'Chatbot con Inteligencia Artificial Chile | Para Empresas — LX3',
    metaDescription: 'Desarrollamos chatbots con IA para empresas chilenas. Atención 24/7, integración web y WhatsApp, entrenado con tu información. Cotiza al instante.',
    h1: 'Chatbot con inteligencia artificial para empresas en Chile',
    keywords: ['chatbot con inteligencia artificial Chile', 'agentes de IA para negocios'],
    faq: [
      { q: '¿El chatbot puede responder preguntas específicas de mi negocio?', a: 'Sí. Lo entrenamos con tu documentación, catálogo, FAQs y políticas. Responde según tu información.' },
      { q: '¿Se integra con WhatsApp?', a: 'Sí, mediante WhatsApp Business API. También se puede integrar en tu sitio web.' },
    ],
    relatedSlugs: ['automatizacion-ia', 'aplicaciones-ia'],
  },
  {
    slug: 'sistema-cotizaciones',
    title: 'Sistema de Cotizaciones Online',
    metaTitle: 'Sistema de Cotizaciones Online Chile | Para Empresas — LX3',
    metaDescription: 'Desarrollamos sistemas de cotización online para empresas chilenas. Cotizador instantáneo, PDF automático, integración CRM. Como el nuestro, para tu negocio.',
    h1: 'Sistema de cotizaciones online para empresas en Chile',
    keywords: ['sistema de cotizaciones online', 'cotización web online Chile'],
    faq: [
      { q: '¿Puedo tener un cotizador como el de lx3.ai en mi empresa?', a: 'Sí, exactamente. Desarrollamos cotizadores instantáneos adaptados a tu catálogo de productos o servicios.' },
      { q: '¿Genera PDFs automáticamente?', a: 'Sí. El sistema puede generar, enviar por email y archivar cotizaciones en PDF de forma automática.' },
    ],
    relatedSlugs: ['crm-personalizado', 'software-a-medida'],
  },
  {
    slug: 'desarrollo-fullstack',
    title: 'Desarrollo Full Stack Chile',
    metaTitle: 'Desarrollo Full Stack Chile | React, Next.js, Node.js — LX3',
    metaDescription: 'Desarrollo full stack en Chile con React, Next.js, TypeScript y Node.js. Aplicaciones escalables, APIs REST y sistemas en la nube. Equipo senior.',
    h1: 'Desarrollo full stack en Chile',
    keywords: ['desarrollo web full stack Chile', 'aplicaciones web con React y Next.js', 'desarrollo Next.js Chile', 'desarrollo React Chile', 'programador Node.js Chile'],
    faq: [
      { q: '¿Qué tecnologías usan?', a: 'Next.js, React, TypeScript, Node.js, PostgreSQL (Neon), Tailwind CSS, Prisma ORM y Vercel. Tecnologías modernas y mantenibles.' },
      { q: '¿Pueden mantener un proyecto existente?', a: 'Sí. También tomamos proyectos legados para modernizarlos o agregarles nuevas funcionalidades.' },
    ],
    relatedSlugs: ['desarrollo-web', 'software-a-medida', 'aplicaciones-ia'],
  },
  {
    slug: 'ecommerce-medida',
    title: 'E-commerce a Medida Chile',
    metaTitle: 'E-commerce a Medida Chile | Marketplace y Tiendas Avanzadas — LX3',
    metaDescription: 'Desarrollo de plataformas e-commerce y marketplace a medida en Chile. Multi-vendedor, integraciones logísticas y pagos. Escalable desde el primer día.',
    h1: 'E-commerce y marketplace a medida en Chile',
    keywords: ['ecommerce a medida Chile', 'marketplace a medida Chile', 'plataforma de ventas online Chile', 'desarrollo tienda online profesional'],
    faq: [
      { q: '¿Pueden hacer un marketplace multi-vendedor?', a: 'Sí. Desarrollamos plataformas donde múltiples vendedores publican sus productos, con gestión de comisiones y pagos separados.' },
      { q: '¿Qué diferencia un e-commerce a medida de Shopify?', a: 'Total control, sin cobros por transacción, funcionalidades exactas a tu negocio y propiedad del código. Shopify es ideal para comenzar; cuando crecer, necesitas solución propia.' },
    ],
    relatedSlugs: ['tienda-online', 'software-a-medida'],
  },
]

export const INDUSTRY_PAGES: IndustryPage[] = [
  {
    slug: 'empresas-seguridad',
    title: 'Software para Empresas de Seguridad Chile',
    metaTitle: 'Software para Empresas de Seguridad Chile | Sistemas a Medida — LX3',
    metaDescription: 'Sistemas web para empresas de seguridad privada en Chile. Control de guardias, gestión de turnos, reportes móviles. Experiencia real con Gard Security.',
    h1: 'Software a medida para empresas de seguridad en Chile',
    keywords: ['software para empresas de seguridad Chile', 'sistema web para guardias de seguridad', 'página web empresa de seguridad Chile'],
    caseStudy: { client: 'Gard Security', result: 'Sistema OPAI: gestión integral de operaciones de seguridad privada para una de las empresas líderes del rubro en Chile.' },
  },
  {
    slug: 'clinicas',
    title: 'Sistema Web para Clínicas Chile',
    metaTitle: 'Sistema Web para Clínicas y Centros Médicos Chile — LX3',
    metaDescription: 'Desarrollamos sistemas web para clínicas, dentistas y centros médicos en Chile. Agenda online, ficha clínica digital, pagos integrados.',
    h1: 'Software para clínicas y centros médicos en Chile',
    keywords: ['sistema web para clínica Chile'],
  },
  {
    slug: 'logistica',
    title: 'Software para Logística Chile',
    metaTitle: 'Software para Empresas de Logística Chile | Sistemas a Medida — LX3',
    metaDescription: 'Sistemas de gestión logística a medida en Chile. Control de flota, rutas, inventario y entregas. Integración con plataformas existentes.',
    h1: 'Software de logística a medida en Chile',
    keywords: ['software para logística Chile', 'automatización de procesos empresariales Chile'],
  },
  {
    slug: 'pymes',
    title: 'Software para Pymes Chile',
    metaTitle: 'Software y Páginas Web para Pymes Chile | Soluciones Asequibles — LX3',
    metaDescription: 'Soluciones digitales para pymes chilenas. Páginas web, CRM, tiendas online y automatización a precios accesibles. Cotiza al instante.',
    h1: 'Soluciones digitales para pymes en Chile',
    keywords: ['CRM para pymes Chile', 'SEO para pymes Chile', 'plataforma de ventas para pymes', 'soluciones de IA para pymes'],
  },
  {
    slug: 'constructoras',
    title: 'Página Web para Constructoras Chile',
    metaTitle: 'Páginas Web y Software para Constructoras Chile — LX3',
    metaDescription: 'Desarrollamos páginas web y sistemas de gestión para constructoras e inmobiliarias en Chile. Proyectos, cotizaciones y clientes en un solo lugar.',
    h1: 'Páginas web y software para constructoras en Chile',
    keywords: ['página web para constructora Chile'],
  },
  {
    slug: 'restaurantes',
    title: 'Página Web para Restaurantes Chile',
    metaTitle: 'Páginas Web para Restaurantes Chile | Carta Digital y Pedidos — LX3',
    metaDescription: 'Diseño web para restaurantes en Chile. Carta digital, reservas online, pedidos a domicilio. Presencia profesional sin costos exagerados.',
    h1: 'Páginas web para restaurantes en Chile',
    keywords: ['página web para restaurante Chile'],
  },
  {
    slug: 'retail',
    title: 'E-commerce para Retail Chile',
    metaTitle: 'E-commerce para Retail Chile | Tiendas Online Profesionales — LX3',
    metaDescription: 'Plataformas de venta online para retail en Chile. Webpay, gestión de inventario, despacho integrado. Escala sin límites.',
    h1: 'E-commerce y retail digital en Chile',
    keywords: ['tienda online con Webpay Chile', 'ecommerce a medida Chile', 'creo tienda virtual Chile'],
  },
]

export const PRICE_PAGES = [
  { slug: 'pagina-web', title: 'Precio Página Web Chile', keyword: 'precio página web corporativa Chile', range: '$390.000 — $1.490.000 CLP' },
  { slug: 'desarrollo-web', title: 'Precio Desarrollo Web Chile', keyword: 'cuánto cuesta una página web en Chile', range: '$490.000 — $2.900.000 CLP' },
  { slug: 'software-empresarial', title: 'Precio Software Empresarial Chile', keyword: 'software empresarial a medida precio', range: '$1.900.000 — $9.900.000 CLP' },
  { slug: 'crm', title: 'Precio CRM Personalizado Chile', keyword: 'CRM barato para empresas Chile', range: '$1.490.000 — $4.900.000 CLP' },
  { slug: 'tienda-online', title: 'Precio Tienda Online Chile', keyword: 'tienda online Chile precio', range: '$890.000 — $2.900.000 CLP' },
  { slug: 'seo', title: 'Precio SEO Chile', keyword: 'agencia SEO Chile precio', range: '$290.000 — $890.000 CLP/mes' },
]
