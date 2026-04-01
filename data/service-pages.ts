export interface ServicePageData {
  slug: string;
  title: string;
  titleAccent?: string;
  subtitle: string;
  description: string;
  features: string[];
  priceRange?: string;
  forWho: string[];
  process: string[];
  techStack: string;
  faqs: { question: string; answer: string }[];
  relatedServices: { href: string; label: string }[];
  ctaTitle: string;
}

export const servicePages: Record<string, ServicePageData> = {
  "desarrollo-web": {
    slug: "desarrollo-web",
    title: "Desarrollo Web Profesional",
    titleAccent: "Desarrollo Web",
    subtitle:
      "Sitios web y aplicaciones web con Next.js, React y TypeScript. Velocidad de carga sub-segundo, SEO nativo, diseño a medida.",
    description: `En LX3 construimos sitios web con Next.js 16, React y TypeScript — la misma tecnología que usan empresas como Hulu, Nike y Vercel. Nuestro enfoque prioriza la velocidad de carga real (bajo 1 segundo en Core Web Vitals), el posicionamiento orgánico desde el primer día y un diseño responsivo que se adapta a cada dispositivo sin comprometer la identidad de marca.

Cada proyecto comienza con un proceso de discovery donde entendemos tus objetivos, audiencia y métricas de éxito. A partir de ahí, diseñamos en Figma con foco en conversión, desarrollamos con Tailwind CSS v4 para un diseño coherente y sin deuda técnica, e integramos las herramientas que ya usas: WhatsApp Business, Google Analytics, CRMs y plataformas de email marketing. El deploy final se realiza en Vercel, con CDN global, SSL automático y tiempos de respuesta sub-50ms.

A diferencia de agencias que usan WordPress o constructores de arrastrar y soltar, nosotros entregamos código limpio, mantenible y escalable. Esto significa que tu sitio puede crecer — agregar un blog, un sistema de cotizaciones, un área de clientes — sin necesitar rehacerlo desde cero. El resultado: un activo digital que trabaja para tu empresa 24/7, con rendimiento medible y costos de mantenimiento predecibles.`,
    features: [
      "Performance sub-segundo medido con Lighthouse y Core Web Vitals",
      "SEO técnico nativo: sitemap automático, metadatos dinámicos, schema markup",
      "Diseño responsive a medida basado en tu identidad de marca",
      "Panel de administración para editar contenido sin desarrolladores",
      "Integración con herramientas: WhatsApp Business, CRM, Google Analytics, email marketing",
      "Deploy automático en Vercel con CDN global y SSL incluido",
    ],
    priceRange: "$490.000 — $2.500.000 CLP",
    forWho: [
      "PyMEs que necesitan una presencia web profesional que genere leads",
      "Empresas en crecimiento que quieren un sitio escalable y fácil de actualizar",
      "Startups que validan producto y necesitan una landing page de alto impacto rápido",
      "Empresas que quieren migrar desde WordPress a una plataforma más rápida y segura",
    ],
    process: [
      "Diagnóstico y discovery: analizamos tus objetivos, competencia y audiencia objetivo",
      "Diseño UX/UI en Figma: wireframes, prototipo y aprobación antes de codificar",
      "Desarrollo e integraciones: Next.js, TypeScript, Tailwind CSS v4 con integraciones activas",
      "Lanzamiento y optimización: deploy en Vercel, configuración de analytics y métricas",
    ],
    techStack: "Next.js 16, React, TypeScript, Tailwind CSS v4, Vercel, PostgreSQL",
    faqs: [
      {
        question: "¿Por qué Next.js en lugar de WordPress?",
        answer:
          "WordPress es un CMS de 2003 construido con PHP. Next.js es un framework moderno de React que genera páginas estáticas ultrarápidas, tiene SEO nativo, seguridad superior y escala sin plugins. Sitios en Next.js cargan en menos de 1 segundo frente a los 3-5 segundos típicos de WordPress.",
      },
      {
        question: "¿Cuánto demora el desarrollo?",
        answer:
          "Una landing page toma 1-2 semanas. Un sitio corporativo de 5-10 páginas toma 3-5 semanas. Trabajamos con entregas parciales para que veas avances desde la primera semana.",
      },
      {
        question: "¿Puedo editar el contenido después?",
        answer:
          "Sí. Integramos un panel de administración donde puedes editar textos, imágenes y secciones del blog sin tocar código. También podemos conectar un CMS headless si el equipo de contenido es grande.",
      },
      {
        question: "¿El hosting está incluido?",
        answer:
          "El primer año de hosting en Vercel está incluido. El costo anual posterior es aproximadamente $60.000 — $120.000 CLP dependiendo del tráfico, mucho menor que los hostings compartidos con peor rendimiento.",
      },
      {
        question: "¿Pueden integrar mi sitio con WhatsApp o mi CRM?",
        answer:
          "Sí. Integramos botones de WhatsApp Business, formularios que envían leads a tu CRM (HubSpot, Pipedrive, nuestro CRM propio), y notificaciones automáticas por email o Slack cuando llega un contacto.",
      },
    ],
    relatedServices: [
      { href: "/servicios/sitios-web", label: "Sitios Web Corporativos" },
      { href: "/servicios/landing-pages", label: "Landing Pages" },
      { href: "/servicios/posicionamiento-web", label: "Posicionamiento Web SEO" },
    ],
    ctaTitle: "¿Listo para un sitio web que realmente convierta?",
  },

  "crm-personalizado": {
    slug: "crm-personalizado",
    title: "CRM Personalizado a Medida",
    titleAccent: "CRM Personalizado",
    subtitle:
      "Un CRM que se adapta a tu proceso comercial. Sin licencias por usuario, sin límites artificiales, con IA integrada.",
    description: `HubSpot cobra entre $45 y $120 USD por usuario al mes. Salesforce supera los $150 USD. Para un equipo comercial de 10 personas, eso equivale a más de $12.000.000 CLP al año solo en licencias — dinero que puedes invertir en un CRM propio que funciona exactamente como tu proceso, no al revés. En LX3 construimos CRMs personalizados que son propiedad de tu empresa, sin costo de licencia por usuario y sin funcionalidades que nunca vas a usar pero que igualmente pagas.

Nuestros CRMs incluyen pipeline visual con etapas definidas por tu equipo, gestión de contactos y empresas, sincronización bidireccional de email (Gmail y Outlook), integración con WhatsApp Business para seguimiento de conversaciones, y dashboards con métricas de conversión por etapa, vendedor y producto. Además, incorporamos automatizaciones de seguimiento: recordatorios automáticos cuando un prospecto no ha respondido, secuencias de email personalizadas y alertas para el equipo.

La principal ventaja del CRM a medida no es solo el ahorro en licencias — es que el sistema refleja tu proceso real, no un proceso genérico que Salesforce decidió que todos deberían usar. Esto se traduce en mayor adopción por parte del equipo de ventas, datos más limpios y reportes más accionables. Además, tienes control total sobre tus datos: nada está en servidores de terceros en condiciones que no controlás.`,
    features: [
      "Pipeline visual personalizable con etapas que reflejan tu proceso comercial real",
      "Integración de email nativa con Gmail y Outlook (sincronización bidireccional)",
      "WhatsApp Business API para seguimiento de conversaciones desde el CRM",
      "Automatizaciones de seguimiento: recordatorios, secuencias de email y alertas",
      "Reportes y forecasting con proyecciones de cierre y métricas por vendedor",
      "Usuarios ilimitados sin costo adicional por licencia",
    ],
    priceRange: "$1.490.000 — $4.900.000 CLP",
    forWho: [
      "Equipos comerciales de 5+ personas que gastan más en licencias que en desarrollo",
      "Empresas que pagan más de $500.000 CLP/mes en HubSpot, Salesforce o Pipedrive",
      "Empresas con procesos comerciales no estándar que no encajan en CRMs genéricos",
      "Empresas que necesitan integrar WhatsApp Business en su flujo de seguimiento",
    ],
    process: [
      "Mapeo del proceso comercial: documentamos tu pipeline, etapas y criterios de avance",
      "Diseño del CRM: estructura de datos, vistas, dashboards y automatizaciones definidas",
      "Desarrollo e integraciones: email, WhatsApp, firma electrónica y herramientas existentes",
      "Capacitación y lanzamiento: onboarding del equipo y migración de datos desde el CRM anterior",
    ],
    techStack:
      "Next.js 16, TypeScript, PostgreSQL, Prisma ORM, Gmail API, WhatsApp Business API, Vercel",
    faqs: [
      {
        question: "¿Cuánto me ahorro versus HubSpot o Salesforce?",
        answer:
          "Un equipo de 10 personas en HubSpot Professional paga ~$9.600 USD/año (~$9.000.000 CLP). Un CRM a medida tiene un costo único de desarrollo. A partir del segundo año, el ahorro supera el costo del proyecto.",
      },
      {
        question: "¿El CRM puede importar mis datos actuales?",
        answer:
          "Sí. Migramos datos desde HubSpot, Salesforce, Pipedrive, hojas de cálculo o cualquier sistema que exporte CSV o JSON. La migración incluye contactos, empresas, deals y actividades históricas.",
      },
      {
        question: "¿Qué pasa si necesito agregar funcionalidades después?",
        answer:
          "El código es tuyo. Podemos agregar módulos, integraciones o automatizaciones adicionales en cualquier momento. También ofrecemos un contrato de mantenimiento mensual para evolucionar el sistema con tu empresa.",
      },
      {
        question: "¿Incluye app móvil?",
        answer:
          "El CRM es una Progressive Web App (PWA) que funciona perfectamente en smartphones sin necesidad de instalar nada. Si necesitas notificaciones push o acceso offline, podemos construir una app nativa en React Native.",
      },
    ],
    relatedServices: [
      { href: "/servicios/automatizacion-ia", label: "Automatización con IA" },
      { href: "/servicios/aplicaciones-internas", label: "Software a Medida" },
      { href: "/servicios/desarrollo-fullstack", label: "Desarrollo Fullstack" },
    ],
    ctaTitle: "¿Cansado de pagar licencias por un CRM que no se adapta a tu negocio?",
  },

  "tienda-online": {
    slug: "tienda-online",
    title: "Tienda Online Profesional",
    titleAccent: "Tienda Online",
    subtitle:
      "E-commerce con Webpay, inventario, cupones y despacho integrado. Sin comisiones por venta.",
    description: `Shopify cobra entre 2% y 0.5% de comisión por venta además de la mensualidad en USD. WooCommerce parece gratuito hasta que sumas los plugins de pago, seguridad, rendimiento e inventario. En LX3 construimos tiendas online propias donde pagas el desarrollo una vez y retienes el 100% de tus ventas sin comisiones de plataforma.

Cada tienda incluye integración nativa con Webpay Plus (Transbank) y MercadoPago para maximizar la tasa de conversión en el mercado chileno, gestión de inventario por producto y variante (talla, color, etc.), cálculo automático de despacho con Starken y Chilexpress, cupones y promociones configurables, carrito y checkout optimizado para mobile y un panel de administración completo para gestionar pedidos, stock y clientes sin necesitar un desarrollador.

El rendimiento también es diferente: nuestras tiendas cargan en menos de 1 segundo, tienen SEO técnico nativo y están diseñadas para aparecer en Google Shopping. Una tienda que carga en 3 segundos pierde el 40% de sus visitas — cada milisegundo importa cuando hay dinero en juego. Además, al construir sobre Next.js, la tienda puede escalar: agregar más productos, variantes, categorías o incluso un marketplace sin necesidad de migrar de plataforma.`,
    features: [
      "Webpay Plus (Transbank) y MercadoPago integrados para el mercado chileno",
      "Gestión de inventario por producto, variante y bodega con alertas de stock bajo",
      "Cupones, descuentos y promociones por tiempo o categoría configurables",
      "Integración de despacho con Starken y Chilexpress con cotización automática",
      "Carrito y checkout optimizado para conversión en desktop y mobile",
      "Panel admin completo: pedidos, clientes, reportes de venta y exportación",
    ],
    priceRange: "$890.000 — $2.900.000 CLP",
    forWho: [
      "Negocios que venden productos físicos y quieren evitar las comisiones de Shopify",
      "Empresas que quieren vender B2B online con precios diferenciados por cliente",
      "Retailers que integran tienda física y online con inventario compartido",
      "Emprendedores con catálogo de 50+ productos que necesitan gestión seria",
    ],
    process: [
      "Catálogo y estructura: definimos categorías, variantes, precios y políticas de despacho",
      "Diseño de la tienda: maquetas de homepage, listado de productos y checkout",
      "Desarrollo e integraciones: Webpay, MercadoPago, couriers y sistemas de facturación",
      "Carga de productos y lanzamiento: subimos el catálogo, configuramos analytics y publicamos",
    ],
    techStack:
      "Next.js 16, TypeScript, PostgreSQL, Prisma ORM, Transbank SDK, MercadoPago API, Vercel",
    faqs: [
      {
        question: "¿Pagan comisión por venta?",
        answer:
          "No. El único costo es el desarrollo inicial. Transbank cobra su comisión estándar (alrededor del 1.49%) directamente a tu cuenta — nosotros no tomamos ningún porcentaje de tus ventas.",
      },
      {
        question: "¿Puedo emitir boletas o facturas automáticamente?",
        answer:
          "Sí. Podemos integrar con SII (boleta electrónica) o con plataformas de facturación como Bsale, Nubox o Defontana para emitir documentos tributarios automáticamente al confirmar el pago.",
      },
      {
        question: "¿Cuántos productos puedo tener?",
        answer:
          "No hay límite técnico. El sistema está diseñado para catálogos de cientos o miles de productos con filtros de búsqueda, categorías anidadas y variantes ilimitadas.",
      },
      {
        question: "¿Funciona también para ventas B2B?",
        answer:
          "Sí. Podemos configurar precios diferenciados por cliente o empresa, órdenes de compra, términos de pago netos y catálogos privados por segmento de cliente.",
      },
    ],
    relatedServices: [
      { href: "/servicios/ecommerce-medida", label: "E-commerce a Medida" },
      { href: "/servicios/posicionamiento-web", label: "Posicionamiento Web SEO" },
      { href: "/servicios/desarrollo-web", label: "Desarrollo Web Profesional" },
    ],
    ctaTitle: "¿Listo para vender online sin comisiones por venta?",
  },

  "posicionamiento-web": {
    slug: "posicionamiento-web",
    title: "Posicionamiento Web SEO",
    titleAccent: "Posicionamiento Web",
    subtitle:
      "Estrategia de contenido, optimización técnica y link building para que tu empresa aparezca primero en Google.",
    description: `El SEO en 2026 se basa en cinco pilares que deben funcionar juntos: fundamentos técnicos (velocidad, indexación, estructura), contenido de autoridad que responde preguntas reales, señales de experiencia de usuario (Core Web Vitals, tiempo en página, tasa de rebote), link building estratégico desde sitios relevantes, y optimización para búsqueda semántica e IA. Atacar solo uno de estos pilares produce resultados limitados — la ventaja de trabajar con LX3 es que manejamos los cinco simultáneamente.

Los resultados de SEO siguen una curva predecible. En los primeros 1-3 meses: auditoría técnica completa, corrección de errores críticos, estructura de keywords definida y primeras piezas de contenido publicadas. Entre los meses 3 y 6: las páginas optimizadas empiezan a rankear en posiciones 4-15 para keywords de mediana competencia, el tráfico orgánico crece entre 30% y 80%. Entre los meses 6 y 12: las páginas maduran, suben a posiciones 1-5 para keywords objetivo, y el volumen de leads orgánicos puede superar al de campañas pagadas.

En LX3 hacemos SEO diferente: no vendemos reportes de métricas de vanidad como "impresiones" o "visibilidad". Medimos leads generados, páginas de destino que convierten y revenue atribuible a búsqueda orgánica. Cada mes recibes un reporte con lo que se hizo, por qué, los resultados y el plan del próximo mes.`,
    features: [
      "Auditoría SEO técnica completa: rastreo, indexación, velocidad, Core Web Vitals y schema",
      "Investigación de keywords con IA: volumen, intención de búsqueda y dificultad real",
      "Contenido optimizado para conversión: artículos, landing pages y páginas de servicio",
      "Link building estratégico: menciones y backlinks de sitios relevantes en tu industria",
      "Reportes mensuales transparentes: tráfico, posiciones, leads y próximos pasos",
      "Schema markup avanzado: FAQ, artículos, empresas locales y servicios estructurados",
    ],
    priceRange: "$290.000 — $890.000 CLP/mes",
    forWho: [
      "Empresas que quieren generar leads orgánicos sin depender de Google Ads",
      "Empresas con sitio web existente pero sin tráfico orgánico relevante",
      "Empresas en mercados competitivos que necesitan diferenciarse en buscadores",
      "Empresas que gastan en Google Ads y quieren reducir ese costo con tráfico orgánico",
    ],
    process: [
      "Auditoría técnica y de contenido: mapeamos el estado actual, errores y oportunidades",
      "Estrategia de keywords y contenido: plan de 6-12 meses con prioridades definidas",
      "Implementación técnica y contenido: optimizaciones, artículos y link building mensual",
      "Medición y ajuste: reporte mensual con resultados y ajuste de estrategia según datos",
    ],
    techStack: "Ahrefs, Search Console, Screaming Frog, Next.js (para mejoras técnicas), schema.org",
    faqs: [
      {
        question: "¿En cuánto tiempo veo resultados de SEO?",
        answer:
          "Los primeros movimientos en rankings ocurren entre el mes 2 y 4. Resultados significativos en tráfico y leads se ven entre el mes 4 y 8. El SEO es una inversión a mediano plazo con ROI compuesto — a diferencia de los anuncios, los resultados no desaparecen cuando dejas de pagar.",
      },
      {
        question: "¿Necesito tener un blog?",
        answer:
          "Depende de tu industria y keywords objetivo. Para muchas empresas, optimizar las páginas de servicios y producto es suficiente para los primeros 6 meses. El blog acelera los resultados al capturar búsquedas informacionales y construir autoridad temática.",
      },
      {
        question: "¿Pueden hacer SEO local para aparecer en Google Maps?",
        answer:
          "Sí. Incluimos optimización de Google Business Profile, citations locales, schema markup para negocios locales y estrategia de reviews. Es especialmente relevante para empresas de servicios con cobertura geográfica específica.",
      },
      {
        question: "¿Qué pasa con mi SEO si cambio de sitio web?",
        answer:
          "Una migración mal planificada puede destruir años de SEO en días. Si estás migrando, gestionamos el proceso completo: mapeo de redirecciones 301, preservación de estructura de URLs, monitoreo post-migración y recuperación si hay caídas.",
      },
    ],
    relatedServices: [
      { href: "/servicios/sitios-web", label: "Sitios Web Corporativos" },
      { href: "/servicios/desarrollo-web", label: "Desarrollo Web Profesional" },
      { href: "/servicios/landing-pages", label: "Landing Pages de Alto Impacto" },
    ],
    ctaTitle: "¿Quieres que tu empresa aparezca primero en Google?",
  },

  "landing-pages": {
    slug: "landing-pages",
    title: "Landing Pages de Alto Impacto",
    titleAccent: "Landing Pages",
    subtitle:
      "Páginas de aterrizaje diseñadas para convertir. Velocidad sub-segundo, formularios inteligentes, A/B testing ready.",
    description: `Una landing page es una página con un único objetivo: convertir al visitante en lead o cliente. A diferencia de un sitio web completo, elimina las distracciones y guía al usuario hacia una sola acción. Son la herramienta fundamental para campañas de Google Ads, Meta Ads, LinkedIn Ads o cualquier acción de marketing donde quieres maximizar el retorno del gasto publicitario.

Una buena landing page tiene cinco elementos que trabajan en conjunto: un headline claro que comunica el valor en menos de 5 segundos, prueba social (testimonios, logos de clientes, métricas), una propuesta de valor específica con beneficios concretos, un formulario optimizado que pide solo lo necesario, y velocidad de carga sub-segundo que evita el abandono. En LX3 diseñamos cada landing page con estos principios, validados con datos reales de conversión.

Lo que nos diferencia es la combinación de velocidad técnica y diseño persuasivo. Nuestras landing pages cargan en menos de 0.8 segundos en mobile, tienen Google Analytics con eventos de conversión configurados desde el primer día, y están diseñadas para facilitar A/B testing de headlines, CTAs e imágenes. Además, están construidas para SEO, lo que significa que pueden generar tráfico orgánico además del de campaña.`,
    features: [
      "Diseño orientado a conversión basado en principios de CRO y psicología persuasiva",
      "Velocidad de carga sub-segundo: puntuación Lighthouse 90+ en mobile y desktop",
      "Formularios inteligentes con validación en tiempo real y notificaciones instantáneas",
      "Google Analytics 4 con eventos de conversión, scroll depth y heatmap configurados",
      "SEO on-page optimizado para capturar tráfico orgánico además del de campañas",
      "Hosting en Vercel con CDN global, 99.99% uptime y SSL incluido",
    ],
    priceRange: "$490.000 — $990.000 CLP",
    forWho: [
      "Empresas que lanzan un producto o servicio nuevo y necesitan validar la demanda",
      "Equipos de marketing con campañas en Google Ads o Meta Ads que quieren mejorar el ROAS",
      "Empresas que necesitan validar una idea antes de desarrollar el producto completo",
      "Organizadores de eventos o lanzamientos que necesitan captura de leads específica",
    ],
    process: [
      "Definición de objetivo y audiencia: qué queremos lograr y quién es el visitante ideal",
      "Copywriting y estructura: headline, beneficios, CTA y flujo de conversión definidos",
      "Diseño y desarrollo: maqueta aprobada en Figma y desarrollo en Next.js con Tailwind",
      "Integración y lanzamiento: analytics, CRM, formularios y prueba en dispositivos reales",
    ],
    techStack: "Next.js 16, React, TypeScript, Tailwind CSS v4, Vercel, Google Analytics 4",
    faqs: [
      {
        question: "¿Cuánto demora una landing page?",
        answer:
          "Una landing page estándar (una pantalla, formulario y secciones de valor) toma 5-8 días hábiles desde la aprobación del diseño. Si tienes urgencia por una campaña, podemos entregar en 3 días con alcance acordado.",
      },
      {
        question: "¿Puedo usar la landing page con Google Ads?",
        answer:
          "Sí, y está diseñada para eso. Configuramos seguimiento de conversiones de Google Ads, optimizamos el Quality Score y nos aseguramos de que el mensaje de la landing sea coherente con los anuncios para mejorar el nivel de calidad y bajar el costo por clic.",
      },
      {
        question: "¿Incluyen A/B testing?",
        answer:
          "La landing está preparada técnicamente para A/B testing, pero el servicio de gestión de experimentos es adicional. Podemos configurar Vercel Edge Config o Google Optimize para que tu equipo o el nuestro corra pruebas de forma autónoma.",
      },
      {
        question: "¿Puedo tener varias versiones para diferentes campañas?",
        answer:
          "Sí. Podemos crear variantes de la misma landing con mensajes diferentes para distintas audiencias, palabras clave o canales. Cada variante es una URL distinta con seguimiento separado.",
      },
    ],
    relatedServices: [
      { href: "/servicios/posicionamiento-web", label: "Posicionamiento Web SEO" },
      { href: "/servicios/desarrollo-web", label: "Desarrollo Web Profesional" },
      { href: "/servicios/sitios-web", label: "Sitios Web Corporativos" },
    ],
    ctaTitle: "¿Listo para una landing page que convierte visitas en clientes?",
  },

  "sistema-cotizaciones": {
    slug: "sistema-cotizaciones",
    title: "Sistema de Cotizaciones Online",
    titleAccent: "Cotizaciones Online",
    subtitle:
      "Automatiza tu proceso de cotización con un sistema web inteligente. PDF automático, CRM integrado, seguimiento por email.",
    description: `Si tu proceso de cotización actual implica recibir un email, copiar datos a una planilla, calcular precios manualmente y enviar un PDF adjunto — cada cotización te toma entre 15 y 45 minutos de trabajo operativo. Multiplica eso por el volumen de consultas que recibes y el costo real se vuelve evidente. Un sistema de cotizaciones online automatiza ese proceso completo: el cliente configura lo que necesita, el sistema calcula el precio, genera el PDF y lo envía automáticamente.

El propio cotizador de LX3 (disponible en nuestra web) es un ejemplo funcional: el prospecto selecciona el tipo de proyecto, las funcionalidades requeridas y el presupuesto estimado, y recibe un resumen detallado al instante. Detrás, el sistema registra el lead en nuestro CRM, notifica al equipo y activa una secuencia de seguimiento automática. El resultado: más leads calificados, menos trabajo manual y datos de conversión para optimizar precios y oferta.

Para tu empresa, construimos un sistema similar pero adaptado a tu catálogo, tu proceso comercial y tu identidad de marca. El sistema puede incluir lógica condicional (si selecciona X, mostrar opciones Y), descuentos por volumen, múltiples monedas, aprobación interna antes de enviar al cliente y firma electrónica del cotizador. Todo con analytics de conversión para saber qué configuraciones avanzan a venta y cuáles se abandonan.`,
    features: [
      "Cotizador web interactivo con lógica condicional y cálculo de precios en tiempo real",
      "Generación automática de PDF personalizado con tu marca y los detalles del proyecto",
      "Integración con CRM: cada cotización crea un deal con todos los datos del prospecto",
      "Notificaciones por email al equipo y confirmación automática al cliente",
      "Analytics de conversión por configuración, precio y fuente de tráfico",
      "Personalización total: productos, servicios, paquetes y lógica de descuentos a medida",
    ],
    priceRange: "$1.490.000 — $3.000.000 CLP",
    forWho: [
      "Empresas con proceso de cotización manual que consume horas de trabajo operativo",
      "Empresas que cotizan por email o teléfono y quieren capturar leads automáticamente",
      "Negocios con catálogo configurable donde el precio depende de múltiples variables",
      "Empresas que quieren medir la conversión de cotizaciones y optimizar su oferta",
    ],
    process: [
      "Mapeo del proceso actual: variables de precio, lógica de descuentos y flujo de aprobación",
      "Diseño del cotizador: pasos, opciones, visualización de precio y diseño del PDF",
      "Desarrollo e integraciones: cotizador web, generación de PDF, CRM y notificaciones",
      "Pruebas y lanzamiento: testing con casos reales, capacitación del equipo y publicación",
    ],
    techStack:
      "Next.js 16, TypeScript, PostgreSQL, Prisma ORM, PDFKit, Resend (email), Vercel",
    faqs: [
      {
        question: "¿El cotizador puede integrarse con mi sistema de precios actual?",
        answer:
          "Sí. Podemos conectar el cotizador a tu lista de precios en una hoja de cálculo, un ERP o una base de datos existente. Cuando actualizas tus precios en la fuente, el cotizador se actualiza automáticamente.",
      },
      {
        question: "¿El PDF tiene mi logo y diseño corporativo?",
        answer:
          "Sí. El PDF se genera con tu identidad visual: logo, colores, tipografía, datos de la empresa y los términos comerciales que definas. Cada cotización es un documento profesional listo para enviar.",
      },
      {
        question: "¿Puede requerir aprobación interna antes de enviarse al cliente?",
        answer:
          "Sí. Podemos agregar un flujo de aprobación donde el cotizador queda en estado 'pendiente' y un supervisor recibe una notificación para revisar y aprobar o ajustar antes de que el cliente la reciba.",
      },
      {
        question: "¿Incluye firma electrónica?",
        answer:
          "Podemos integrar firma electrónica simple (aceptación digital con email y timestamp) sin costo adicional. Para firma avanzada con validez tributaria en Chile, integramos con proveedores certificados como DocuSign o E-Cert.",
      },
    ],
    relatedServices: [
      { href: "/servicios/crm-personalizado", label: "CRM Personalizado" },
      { href: "/servicios/automatizacion-ia", label: "Automatización con IA" },
      { href: "/servicios/aplicaciones-internas", label: "Software a Medida" },
    ],
    ctaTitle: "¿Cuántas horas a la semana pierdes cotizando manualmente?",
  },

  "desarrollo-fullstack": {
    slug: "desarrollo-fullstack",
    title: "Desarrollo Fullstack a Medida",
    titleAccent: "Desarrollo Fullstack",
    subtitle:
      "APIs, dashboards, integraciones y sistemas completos. Stack moderno con Next.js, PostgreSQL y deploy en Vercel.",
    description: `El desarrollo fullstack en LX3 cubre el espectro completo: desde el diseño de la base de datos y la construcción de APIs hasta las interfaces de usuario, los dashboards de datos y las integraciones con sistemas externos. No somos una agencia de front-end que terceriza el back-end, ni un equipo de back-end que entrega productos sin interfaz. Manejamos el stack completo con el mismo estándar de calidad en cada capa.

Los tipos de proyectos que desarrollamos incluyen: APIs REST con autenticación JWT y roles granulares, dashboards interactivos con datos en tiempo real usando WebSockets o Server-Sent Events, portales de clientes con gestión de pedidos y facturación, integraciones entre sistemas que no se "hablan" entre sí (ERP con CRM, POS con e-commerce, sistema legacy con plataforma moderna), y herramientas internas que automatizan procesos que hoy hacen personas manualmente.

Nuestro stack — Next.js 16, TypeScript, PostgreSQL, Prisma ORM, Vercel — no es una elección arbitraria. Es la combinación que permite iterar rápido sin sacrificar calidad: TypeScript elimina una categoría entera de bugs en producción, Prisma hace que los cambios de base de datos sean seguros y auditables, y Vercel ofrece deploy instantáneo con rollback en 30 segundos si algo sale mal. Para tu empresa, esto significa menos bugs, entregas más frecuentes y la capacidad de cambiar de dirección sin reescribir todo.`,
    features: [
      "APIs REST y webhooks con documentación automática y autenticación robusta",
      "Dashboards interactivos con datos en tiempo real y visualizaciones configurables",
      "Integraciones con sistemas existentes: ERPs, CRMs, pasarelas de pago y APIs de terceros",
      "Base de datos PostgreSQL con Prisma ORM, migraciones versionadas y backups automáticos",
      "Autenticación y roles avanzados: SSO, SAML, permisos por recurso y auditoría de accesos",
      "Deploy automático con CI/CD, entornos de staging y rollback instantáneo en producción",
    ],
    priceRange: "$1.490.000 — $5.000.000+ CLP",
    forWho: [
      "Empresas que necesitan APIs para integraciones entre sistemas o para exponer datos a socios",
      "CTOs y equipos técnicos que buscan un partner de desarrollo con alto estándar de calidad",
      "Empresas con sistemas legacy que necesitan modernizar sin interrumpir la operación actual",
      "Startups y scale-ups que construyen su primer producto y necesitan un equipo completo",
    ],
    process: [
      "Arquitectura y diseño técnico: diagrama de datos, flujos, integraciones y stack definido",
      "Desarrollo incremental: sprints de 2 semanas con demos y entrega continua en staging",
      "Integración y pruebas: pruebas unitarias, de integración y QA en entorno de producción",
      "Lanzamiento y handover: deploy final, documentación técnica y capacitación del equipo",
    ],
    techStack:
      "Next.js 16, TypeScript, PostgreSQL, Prisma ORM, Redis, Vercel, GitHub Actions, Resend",
    faqs: [
      {
        question: "¿Quién es el dueño del código al final del proyecto?",
        answer:
          "Tu empresa. Entregamos el código fuente completo en un repositorio privado de tu cuenta de GitHub u organización. No hay lock-in: puedes continuar el desarrollo con tu equipo interno o con cualquier otro proveedor.",
      },
      {
        question: "¿Pueden trabajar con nuestro equipo de desarrollo interno?",
        answer:
          "Sí. Nos integramos al flujo de trabajo de tu equipo: usamos tu repositorio, tus convenciones de código y participamos en los rituales de desarrollo que ya tienen (standups, code reviews, sprints). Podemos ser un equipo de refuerzo o hacernos cargo de módulos específicos.",
      },
      {
        question: "¿Cómo manejan la seguridad y los datos sensibles?",
        answer:
          "Seguimos las prácticas de OWASP Top 10 como estándar mínimo: variables de entorno encriptadas, HTTPS forzado, validación de inputs, queries parametrizadas (sin SQL injection posible con Prisma), rate limiting y auditoría de accesos.",
      },
      {
        question: "¿Ofrecen contrato de mantención después del lanzamiento?",
        answer:
          "Sí. Ofrecemos contratos de mantención mensual que incluyen monitoreo proactivo, actualizaciones de dependencias de seguridad, soporte ante incidentes y horas de desarrollo para nuevas funcionalidades o ajustes.",
      },
    ],
    relatedServices: [
      { href: "/servicios/aplicaciones-internas", label: "Software a Medida" },
      { href: "/servicios/automatizacion-ia", label: "Automatización con IA" },
      { href: "/servicios/crm-personalizado", label: "CRM Personalizado" },
    ],
    ctaTitle: "¿Tienes un sistema complejo que construir? Hablemos.",
  },

  "ecommerce-medida": {
    slug: "ecommerce-medida",
    title: "E-commerce a Medida",
    titleAccent: "E-commerce a Medida",
    subtitle:
      "Marketplace, multi-vendedor, integraciones ERP y funcionalidades que Shopify no ofrece. Para operaciones complejas de e-commerce.",
    description: `Shopify es una excelente plataforma para empezar. Pero cuando tu operación crece — múltiples tiendas, varios vendedores, integración con ERP, facturación electrónica automática, lógica de precios por segmento de cliente — Shopify se convierte en un obstáculo. Cada funcionalidad adicional requiere un plugin de terceros que consume rendimiento, genera dependencia y cobra mensualidades. En un punto, la suma de limitaciones y costos supera el costo de construir algo propio.

El e-commerce a medida de LX3 está diseñado para operaciones complejas que los SaaS genéricos no pueden resolver. Marketplace con múltiples vendedores: cada vendedor gestiona su catálogo, sus pedidos y sus retiros de forma independiente, con comisiones configurables y dashboard propio. Múltiples bodegas: el stock se gestiona por ubicación y la lógica de fulfillment decide automáticamente desde qué bodega despachar según disponibilidad y costo de envío. Integración ERP: los pedidos fluyen automáticamente hacia SAP, Oracle o el ERP que uses, con conciliación contable y facturación electrónica integrada.

Para retailers con operaciones online y offline, construimos la integración POS-web: el inventario es único, la tienda física y la online consumen el mismo stock, y los programas de fidelización funcionan en ambos canales. La diferencia entre un e-commerce a medida y uno genérico no es estética — es operacional. Cada integración que automatizamos es horas-persona que liberas para actividades de mayor valor.`,
    features: [
      "Marketplace multi-vendedor con dashboards independientes, comisiones y pagos segregados",
      "Múltiples bodegas y sucursales con lógica de fulfillment automático por disponibilidad",
      "Integración ERP y facturación electrónica (SII, Bsale, Defontana, SAP Business One)",
      "Checkout personalizado con lógica de precios por cliente, volumen y condición de pago",
      "Programa de fidelización con puntos, niveles y recompensas integrado en todos los canales",
      "API para integraciones con POS, apps móviles y sistemas de terceros",
    ],
    priceRange: "$2.900.000 — $8.000.000+ CLP",
    forWho: [
      "Retailers con múltiples tiendas físicas que necesitan integrar inventario online y offline",
      "Empresas B2B con catálogos complejos y precios diferenciados por cliente o segmento",
      "Marketplaces con múltiples vendedores que necesitan gestión independiente por vendor",
      "Empresas que necesitan integrar su e-commerce con POS, ERP o sistemas de facturación",
    ],
    process: [
      "Arquitectura del sistema: flujo de pedidos, integraciones, roles y lógica de negocio mapeados",
      "Diseño de experiencia: storefront, checkout, dashboards de vendedor y panel de administración",
      "Desarrollo por módulos: backend, integraciones ERP/facturación, storefront y dashboards",
      "Migración y lanzamiento: datos desde sistema anterior, pruebas de carga y go-live planificado",
    ],
    techStack:
      "Next.js 16, TypeScript, PostgreSQL, Prisma ORM, Redis, Transbank, MercadoPago, REST APIs ERP, Vercel",
    faqs: [
      {
        question: "¿Cuándo tiene sentido un e-commerce a medida versus Shopify Plus?",
        answer:
          "Shopify Plus cuesta desde $2.300 USD/mes (~$2.200.000 CLP/mes) más comisiones. Si necesitas funcionalidades que Shopify no tiene nativamente, el costo de desarrollo se amortiza en 6-12 meses. Hacemos un análisis de costo-beneficio honesto antes de recomendar el enfoque.",
      },
      {
        question: "¿Pueden migrar mi tienda actual de Shopify o Magento?",
        answer:
          "Sí. Migramos catálogo, órdenes históricas, clientes, reviews y SEO (URLs y redirecciones). El proceso de migración es planificado para minimizar el tiempo de inactividad — en la mayoría de los casos, el cambio es transparente para los clientes.",
      },
      {
        question: "¿Cómo funciona el marketplace multi-vendedor?",
        answer:
          "Cada vendedor tiene su propio panel donde gestiona catálogo, stock, pedidos y retiros. El operador del marketplace configura las comisiones, aprueba productos y gestiona disputas. Los pagos se liquidan automáticamente en la frecuencia acordada.",
      },
      {
        question: "¿Pueden integrar con nuestro ERP actual?",
        answer:
          "Sí, si tiene API o exportación de datos estándar. Hemos integrado con SAP Business One, Bsale, Defontana, Nubox y sistemas propietarios. Si tu ERP no tiene API, evaluamos la integración vía archivos o consulta directa a base de datos.",
      },
    ],
    relatedServices: [
      { href: "/servicios/tienda-online", label: "Tienda Online Profesional" },
      { href: "/servicios/desarrollo-fullstack", label: "Desarrollo Fullstack" },
      { href: "/servicios/automatizacion-ia", label: "Automatización con IA" },
    ],
    ctaTitle: "¿Tu operación de e-commerce superó lo que Shopify puede ofrecer?",
  },
};

export function getServicePageData(slug: string): ServicePageData | undefined {
  return servicePages[slug];
}

export function getAllServicePageSlugs(): string[] {
  return Object.keys(servicePages);
}
