import type { SolutionPageData } from "@/components/seo-pages/SolutionPageLayout";

const solutionPages: SolutionPageData[] = [
  {
    slug: "empresas-seguridad",
    title: "Soluciones para Empresas de Seguridad",
    titleAccent: "Empresas de Seguridad",
    subtitle:
      "Software a medida para gestionar guardias, turnos, rondas y reportes operativos en tiempo real. Reemplaza las planillas Excel por un ERP que se adapta a tu operación.",
    statistic:
      "El 73% de las empresas de seguridad en Chile aún gestionan turnos y rondas con planillas Excel, generando errores operativos que afectan la calidad del servicio.",
    problems: [
      "Gestión manual de turnos y guardias en planillas que se desactualizan",
      "Sin visibilidad en tiempo real del estado y ubicación de las rondas",
      "Reportes operativos manuales que llegan tarde al cliente",
      "Coordinación por WhatsApp sin trazabilidad ni historial",
      "Alta rotación de personal sin control ni registro centralizado",
    ],
    problemsSolutions: [
      {
        problem: "Gestión manual de turnos y guardias en planillas que se desactualizan",
        solution:
          "Implementamos un módulo de programación de turnos con asignación automática, alertas de cobertura y vista semanal/mensual por cliente y ubicación.",
      },
      {
        problem: "Sin visibilidad en tiempo real del estado y ubicación de las rondas",
        solution:
          "Desarrollamos un sistema de monitoreo de rondas con geolocalización, checkpoints con QR y dashboard en tiempo real para supervisores y clientes.",
      },
      {
        problem: "Reportes operativos manuales que llegan tarde al cliente",
        solution:
          "Automatizamos la generación y envío de reportes por turno, incidente y cliente, con firma digital y entrega inmediata vía email o portal web.",
      },
      {
        problem: "Coordinación por WhatsApp sin trazabilidad ni historial",
        solution:
          "Creamos un módulo de comunicaciones interno con notificaciones push, registro de novedades y flujos de escalada para emergencias.",
      },
      {
        problem: "Alta rotación de personal sin control ni registro centralizado",
        solution:
          "Implementamos un módulo de RRHH con perfiles de guardias, documentación, certificaciones, historial de asignaciones y alertas de vencimiento.",
      },
    ],
    caseStudy: {
      title: "OPAI para Gard Security",
      description:
        "Desarrollamos un ERP de más de 20 módulos para gestionar más de 200 guardias, turnos, rondas con geolocalización, reportes automáticos y un portal de clientes. El sistema reemplazó completamente las planillas Excel y redujo los errores operativos en un 60%.",
      href: "/casos/opai-gard-security",
    },
    stack: ["Next.js", "React", "PostgreSQL", "Prisma", "Vercel", "WhatsApp API"],
    investmentRange: "$3.000.000 — $10.000.000 CLP",
    services: [
      {
        href: "/servicios/aplicaciones-internas",
        label: "Aplicaciones Internas",
        description:
          "ERPs y sistemas operativos a medida para gestionar toda tu operación de seguridad.",
      },
      {
        href: "/servicios/automatizacion-ia",
        label: "Automatización e IA",
        description:
          "Automatiza reportes, alertas y comunicaciones para reducir la carga operativa.",
      },
      {
        href: "/servicios/crm-personalizado",
        label: "CRM Personalizado",
        description:
          "Gestiona contratos, renovaciones y relación con clientes desde una sola plataforma.",
      },
    ],
    faqs: [
      {
        question: "¿Pueden integrarse con las rondas y checkpoints que ya tenemos?",
        answer:
          "Sí. Diseñamos el sistema para adaptarse a tu operación actual. Podemos integrar lectores QR, NFC o GPS existentes y migrar el historial de rondas desde tus planillas actuales.",
      },
      {
        question: "¿Los clientes pueden ver el estado de su servicio en tiempo real?",
        answer:
          "Absolutamente. Desarrollamos un portal de clientes donde pueden consultar turnos activos, rondas completadas, incidentes y descargar reportes sin necesidad de contactar a operaciones.",
      },
      {
        question: "¿Cómo manejan la trazabilidad de incidentes y novedades?",
        answer:
          "Cada novedad o incidente queda registrado con timestamp, guardia responsable, ubicación y fotos. Los supervisores reciben alertas inmediatas y el historial queda disponible para auditorías.",
      },
      {
        question: "¿Cuánto tiempo toma implementar un sistema de este tipo?",
        answer:
          "Dependiendo del alcance, entre 2 y 5 meses. Comenzamos con los módulos de mayor impacto (turnos y rondas) y vamos incorporando funcionalidades según las prioridades de tu operación.",
      },
    ],
    ctaTitle: "¿Listo para digitalizar tu operación de seguridad?",
  },

  {
    slug: "clinicas",
    title: "Soluciones para Clínicas y Centros Médicos",
    titleAccent: "Clínicas",
    subtitle:
      "Software médico a medida que digitaliza agendas, fichas clínicas, integración con Fonasa/Isapre y comunicación con pacientes. Construido para la realidad del sistema de salud chileno.",
    statistic:
      "El 60% de las clínicas en Chile pierden hasta 15% de sus citas por no-shows, un problema solucionable con recordatorios automáticos y gestión digital.",
    problems: [
      "Agenda manual que genera doble-booking y errores de coordinación",
      "Ficha clínica en papel: lenta, ilegible y difícil de compartir",
      "Integración con Fonasa e Isapres manual y propensa a errores",
      "Farmacia o bodega de insumos sin control de stock en tiempo real",
      "Pacientes sin acceso a resultados, recetas ni historial online",
    ],
    problemsSolutions: [
      {
        problem: "Agenda manual que genera doble-booking y errores de coordinación",
        solution:
          "Desarrollamos un sistema de agendamiento online con disponibilidad en tiempo real, confirmación automática por WhatsApp o email y recordatorios 24 horas antes de la cita.",
      },
      {
        problem: "Ficha clínica en papel: lenta, ilegible y difícil de compartir",
        solution:
          "Creamos fichas clínicas digitales estructuradas por especialidad, con historial completo del paciente, adjuntos de exámenes y acceso controlado por rol.",
      },
      {
        problem: "Integración con Fonasa e Isapres manual y propensa a errores",
        solution:
          "Implementamos validación automática de cobertura y cálculo de copago en el momento de la atención, reduciendo rechazos y errores de facturación.",
      },
      {
        problem: "Farmacia o bodega de insumos sin control de stock en tiempo real",
        solution:
          "Desarrollamos un módulo de inventario con alertas de stock mínimo, trazabilidad de consumo por paciente y generación automática de órdenes de reposición.",
      },
      {
        problem: "Pacientes sin acceso a resultados, recetas ni historial online",
        solution:
          "Creamos un portal de pacientes donde pueden ver resultados, descargar recetas, solicitar horas y comunicarse con su médico de forma segura.",
      },
    ],
    stack: ["Next.js", "React", "PostgreSQL", "HL7/FHIR", "Vercel"],
    investmentRange: "$3.000.000 — $8.000.000 CLP",
    services: [
      {
        href: "/servicios/software-a-medida",
        label: "Software a Medida",
        description:
          "Sistemas clínicos diseñados para tu especialidad y flujos de atención específicos.",
      },
      {
        href: "/servicios/automatizacion-ia",
        label: "Automatización e IA",
        description:
          "Recordatorios automáticos, triaje digital y reducción de no-shows con IA.",
      },
      {
        href: "/servicios/sitios-web",
        label: "Sitio Web Profesional",
        description:
          "Presencia digital con información de especialistas, agendamiento online y SEO local.",
      },
    ],
    faqs: [
      {
        question: "¿El sistema cumple con las normativas del Minsal para fichas clínicas digitales?",
        answer:
          "Sí. El sistema está diseñado bajo los estándares HL7/FHIR y cumple con los requisitos de integridad, confidencialidad y disponibilidad exigidos por el Minsal para fichas clínicas electrónicas.",
      },
      {
        question: "¿Pueden integrar el sistema con laboratorios externos o radiólogos?",
        answer:
          "Sí. Desarrollamos integraciones con laboratorios y centros de imagen para recibir resultados automáticamente y asociarlos a la ficha del paciente sin intervención manual.",
      },
      {
        question: "¿Cómo manejan la migración de fichas clínicas existentes en papel?",
        answer:
          "Definimos un plan de migración gradual. Las fichas históricas se digitalizan como documentos adjuntos y los nuevos registros pasan completamente al sistema digital.",
      },
      {
        question: "¿El sistema funciona para múltiples sedes o sucursales?",
        answer:
          "Sí. Diseñamos el sistema con soporte multi-sede, permitiendo ver disponibilidad y fichas de pacientes entre sucursales con permisos configurables por especialista.",
      },
    ],
    ctaTitle: "¿Listo para digitalizar tu clínica?",
  },

  {
    slug: "logistica",
    title: "Soluciones para Empresas de Logística y Transporte",
    titleAccent: "Logística",
    subtitle:
      "Plataformas digitales para optimizar rutas, trackear envíos en tiempo real e integrar tus operaciones con las principales empresas de transporte en Chile.",
    statistic:
      "Las empresas de logística en Chile que digitalizan sus operaciones reducen tiempos de entrega hasta un 25% y errores de despacho en un 40%.",
    problems: [
      "Tracking manual de envíos sin visibilidad en tiempo real para clientes",
      "Rutas no optimizadas que generan costos innecesarios de combustible",
      "Inventario en bodega desactualizado con diferencias frecuentes",
      "Integraciones manuales con Starken, Chilexpress u otros operadores",
      "Clientes que llaman para consultar estado de sus pedidos",
    ],
    problemsSolutions: [
      {
        problem: "Tracking manual de envíos sin visibilidad en tiempo real para clientes",
        solution:
          "Desarrollamos un portal de tracking con actualizaciones en tiempo real por GPS, notificaciones automáticas de estado y estimación de entrega precisa.",
      },
      {
        problem: "Rutas no optimizadas que generan costos innecesarios de combustible",
        solution:
          "Implementamos un módulo de optimización de rutas que considera ventanas horarias, capacidad de vehículos y restricciones de tráfico, reduciendo kilómetros recorridos.",
      },
      {
        problem: "Inventario en bodega desactualizado con diferencias frecuentes",
        solution:
          "Creamos un WMS (sistema de gestión de bodegas) con control en tiempo real por código de barras o QR, ajustes de inventario auditables y alertas de discrepancias.",
      },
      {
        problem: "Integraciones manuales con Starken, Chilexpress u otros operadores",
        solution:
          "Desarrollamos integraciones automáticas con las APIs de los principales operadores logísticos nacionales para generar guías, consultar estados y conciliar datos.",
      },
      {
        problem: "Clientes que llaman para consultar estado de sus pedidos",
        solution:
          "Implementamos un portal de autoservicio para clientes con historial de pedidos, tracking en tiempo real y descarga de documentos sin necesidad de contactar a soporte.",
      },
    ],
    stack: ["Next.js", "React", "PostgreSQL", "APIs de transporte", "Vercel"],
    investmentRange: "$2.500.000 — $8.000.000 CLP",
    services: [
      {
        href: "/servicios/aplicaciones-internas",
        label: "Aplicaciones Internas",
        description:
          "TMS, WMS y sistemas de despacho adaptados a tu operación logística.",
      },
      {
        href: "/servicios/desarrollo-fullstack",
        label: "Desarrollo Full-Stack",
        description:
          "Plataformas completas con backend robusto, APIs y frontends para operadores y clientes.",
      },
      {
        href: "/servicios/automatizacion-ia",
        label: "Automatización e IA",
        description:
          "Optimización de rutas, predicción de demanda y alertas inteligentes de operación.",
      },
    ],
    faqs: [
      {
        question: "¿Pueden integrarse con nuestro ERP o sistema contable actual?",
        answer:
          "Sí. Desarrollamos conectores con los principales ERPs usados en Chile (SAP, ERP Chile, Defontana) para sincronizar pedidos, facturas y datos de clientes automáticamente.",
      },
      {
        question: "¿Cómo manejan la trazabilidad de productos con temperatura controlada o perecibles?",
        answer:
          "Podemos integrar sensores de temperatura e IoT al sistema de tracking para registrar la cadena de frío y generar alertas cuando se detectan desvíos fuera de rango.",
      },
      {
        question: "¿El sistema escala para operaciones con cientos de envíos diarios?",
        answer:
          "Absolutamente. Construimos sobre infraestructura cloud escalable en Vercel y PostgreSQL con índices optimizados para manejar grandes volúmenes de operaciones sin degradación.",
      },
      {
        question: "¿Cuánto tiempo toma implementar el módulo de tracking?",
        answer:
          "Un módulo de tracking básico puede estar operativo en 4 a 6 semanas. Para integraciones con operadores logísticos externos, el plazo varía según la disponibilidad de sus APIs.",
      },
    ],
    ctaTitle: "¿Listo para digitalizar tu operación logística?",
  },

  {
    slug: "pymes",
    title: "Soluciones Tecnológicas para PyMEs",
    titleAccent: "PyMEs",
    subtitle:
      "Tecnología accesible y a medida para pequeñas y medianas empresas chilenas. Desde tu primer sitio web profesional hasta sistemas que automatizan tus operaciones diarias.",
    statistic:
      "Solo el 30% de las PyMEs chilenas tienen un sitio web profesional, y menos del 10% usan herramientas digitales para gestionar sus operaciones.",
    problems: [
      "Depender de Excel y cuadernos para gestionar ventas, clientes e inventario",
      "No tener presencia web profesional que genere confianza y clientes",
      "Procesos manuales que no escalan a medida que crece el negocio",
      "Perder clientes potenciales por no responder rápido o estar disponible 24/7",
      "No medir resultados: sin datos no hay decisiones informadas",
    ],
    problemsSolutions: [
      {
        problem: "Depender de Excel y cuadernos para gestionar ventas, clientes e inventario",
        solution:
          "Desarrollamos sistemas simples y fáciles de usar, diseñados específicamente para tu negocio, que centralizan clientes, ventas e inventario sin la complejidad de un ERP genérico.",
      },
      {
        problem: "No tener presencia web profesional que genere confianza y clientes",
        solution:
          "Creamos sitios web profesionales, rápidos y optimizados para Google, que muestran tu negocio de la mejor forma y convierten visitantes en contactos y ventas.",
      },
      {
        problem: "Procesos manuales que no escalan a medida que crece el negocio",
        solution:
          "Identificamos los procesos que más tiempo consumen y los automatizamos: cotizaciones, recordatorios, facturación y seguimiento de clientes sin esfuerzo extra.",
      },
      {
        problem: "Perder clientes potenciales por no responder rápido o estar disponible 24/7",
        solution:
          "Implementamos formularios inteligentes, chatbots básicos y automatizaciones de WhatsApp que responden consultas y capturan leads mientras tú te dedicas al negocio.",
      },
      {
        problem: "No medir resultados: sin datos no hay decisiones informadas",
        solution:
          "Configuramos dashboards simples con los indicadores que importan para tu negocio: ventas, visitas al sitio, conversiones y más, en un solo lugar.",
      },
    ],
    stack: ["Next.js", "React", "PostgreSQL", "Vercel"],
    investmentRange: "$490.000 — $3.000.000 CLP",
    services: [
      {
        href: "/servicios/sitios-web",
        label: "Sitio Web Profesional",
        description:
          "Tu primera presencia digital: rápida, moderna y optimizada para que te encuentren en Google.",
      },
      {
        href: "/servicios/landing-pages",
        label: "Landing Pages",
        description:
          "Páginas de conversión para campañas, lanzamientos o captación de leads.",
      },
      {
        href: "/servicios/tienda-online",
        label: "Tienda Online",
        description:
          "Vende tus productos en internet con pagos seguros y gestión simple de inventario.",
      },
    ],
    faqs: [
      {
        question: "¿Tengo que saber de tecnología para usar el sistema?",
        answer:
          "No. Diseñamos todo pensando en personas de negocio, no en técnicos. Además, entregamos capacitación y documentación simple, y ofrecemos soporte para que nunca te quedes solo.",
      },
      {
        question: "¿Puedo empezar con algo pequeño y crecer después?",
        answer:
          "Absolutamente. Comenzamos con lo que más necesitas ahora —un sitio web, un sistema de cotizaciones o una tienda online— y construimos sobre esa base cuando el negocio lo requiera.",
      },
      {
        question: "¿Cuánto tiempo tarda en estar listo mi sitio web o sistema?",
        answer:
          "Un sitio web profesional puede estar listo en 2 a 4 semanas. Los sistemas más complejos, como una tienda online o un sistema de gestión, tardan entre 4 y 8 semanas.",
      },
      {
        question: "¿Qué pasa si necesito hacer cambios después de lanzar?",
        answer:
          "Entregamos los sistemas con un período de garantía y ajustes post-lanzamiento incluidos. Después, ofrecemos planes de mantenimiento y mejoras continuas según tus necesidades.",
      },
    ],
    ctaTitle: "¿Listo para darle tecnología a tu PyME?",
  },

  {
    slug: "constructoras",
    title: "Soluciones para Constructoras e Inmobiliarias",
    titleAccent: "Constructoras",
    subtitle:
      "Software de gestión de obra y proyectos que reemplaza el papel y las planillas por visibilidad en tiempo real, coordinación eficiente y reportes ejecutivos automáticos.",
    statistic:
      "El 45% de los proyectos de construcción en Chile sufren retrasos por falta de visibilidad en el avance de obra y coordinación deficiente entre subcontratistas.",
    problems: [
      "Control de avance de obra en papel o planillas sin visibilidad centralizada",
      "Presupuestos y proyecciones de costos que no se actualizan en tiempo real",
      "Gestión de subcontratistas por email y WhatsApp sin trazabilidad",
      "Documentación del proyecto dispersa en carpetas, correos y Dropbox",
      "Reportes ejecutivos que tardan días en prepararse manualmente",
    ],
    problemsSolutions: [
      {
        problem: "Control de avance de obra en papel o planillas sin visibilidad centralizada",
        solution:
          "Desarrollamos un sistema de control de avance con hitos, partidas y estados actualizables desde terreno (móvil), con dashboard en tiempo real para la gerencia.",
      },
      {
        problem: "Presupuestos y proyecciones de costos que no se actualizan en tiempo real",
        solution:
          "Creamos un módulo de gestión de costos que compara presupuesto inicial vs. gasto real, proyecta el costo final y alerta cuando una partida supera el presupuesto.",
      },
      {
        problem: "Gestión de subcontratistas por email y WhatsApp sin trazabilidad",
        solution:
          "Implementamos un portal de subcontratistas para asignación de trabajos, entrega de documentos, registro de avance y aprobación de estados de pago.",
      },
      {
        problem: "Documentación del proyecto dispersa en carpetas, correos y Dropbox",
        solution:
          "Centralizamos toda la documentación del proyecto (planos, permisos, contratos, actas) en un repositorio estructurado con control de versiones y acceso por rol.",
      },
      {
        problem: "Reportes ejecutivos que tardan días en prepararse manualmente",
        solution:
          "Automatizamos los reportes de avance, costos y proyecciones que se generan periódicamente y se envían por email a la gerencia sin intervención del equipo de obra.",
      },
    ],
    stack: ["Next.js", "React", "PostgreSQL", "Prisma", "Vercel"],
    investmentRange: "$3.000.000 — $10.000.000 CLP",
    services: [
      {
        href: "/servicios/software-a-medida",
        label: "Software a Medida",
        description:
          "Sistemas de gestión de obra y proyectos diseñados para tu metodología y tipo de proyectos.",
      },
      {
        href: "/servicios/aplicaciones-internas",
        label: "Aplicaciones Internas",
        description:
          "Herramientas para equipos de obra, administración y gerencia con acceso desde cualquier dispositivo.",
      },
      {
        href: "/servicios/automatizacion-ia",
        label: "Automatización e IA",
        description:
          "Reportes automáticos, alertas de desviación y predicción de riesgos en proyectos.",
      },
    ],
    faqs: [
      {
        question: "¿El sistema funciona en terreno con conexión limitada o sin internet?",
        answer:
          "Sí. Diseñamos funcionalidad offline para el módulo de terreno, permitiendo registrar avances y fotos sin conexión. Los datos se sincronizan automáticamente cuando hay internet disponible.",
      },
      {
        question: "¿Pueden integrarse con AutoCAD, Revit u otras herramientas BIM?",
        answer:
          "Podemos integrar con plataformas BIM para vincular planos y modelos 3D al sistema de gestión, permitiendo asociar avances e incidencias directamente a elementos del modelo.",
      },
      {
        question: "¿Cómo manejan los proyectos con múltiples frentes de obra simultáneos?",
        answer:
          "El sistema soporta múltiples frentes, etapas y subproyectos con vistas consolidadas y desglosadas, permitiendo ver tanto el avance global como el detalle por frente.",
      },
      {
        question: "¿Los subcontratistas necesitan capacitación especial para usar el portal?",
        answer:
          "No. El portal de subcontratistas es deliberadamente simple, accesible desde cualquier dispositivo y no requiere instalación. Solo necesitan un link y sus credenciales.",
      },
    ],
    ctaTitle: "¿Listo para digitalizar la gestión de tus proyectos?",
  },

  {
    slug: "restaurantes",
    title: "Soluciones para Restaurantes y Foodservice",
    titleAccent: "Restaurantes",
    subtitle:
      "Tecnología gastronómica a medida: carta digital, pedidos online, reservas, KDS para cocina y sistema de delivery integrado. Todo conectado para mejorar la experiencia y aumentar ventas.",
    statistic:
      "Los restaurantes chilenos que implementan carta digital y pedidos online aumentan su ticket promedio hasta un 20% gracias a recomendaciones inteligentes.",
    problems: [
      "Carta en papel que no se actualiza y genera confusión con platos agotados",
      "Pedidos por teléfono o WhatsApp con errores de transcripción frecuentes",
      "Sin sistema de reservas online: los clientes llaman y pierden el tiempo",
      "Cocina trabaja con papeles que se pierden, manchan o llegan tarde",
      "Delivery sin integración: Uber Eats, Rappi y web son sistemas separados",
    ],
    problemsSolutions: [
      {
        problem: "Carta en papel que no se actualiza y genera confusión con platos agotados",
        solution:
          "Desarrollamos una carta digital interactiva actualizable en tiempo real desde el celular, con fotos, descripciones, alérgenos y disponibilidad por turno.",
      },
      {
        problem: "Pedidos por teléfono o WhatsApp con errores de transcripción frecuentes",
        solution:
          "Creamos un sistema de pedidos online y en mesa (QR) donde el cliente arma su pedido directamente, eliminando intermediarios y errores.",
      },
      {
        problem: "Sin sistema de reservas online: los clientes llaman y pierden el tiempo",
        solution:
          "Implementamos un sistema de reservas online con disponibilidad en tiempo real, confirmación automática y recordatorio previo a la visita.",
      },
      {
        problem: "Cocina trabaja con papeles que se pierden, manchan o llegan tarde",
        solution:
          "Desarrollamos un KDS (Kitchen Display System) que muestra los pedidos en pantalla en cocina con priorización, temporizadores y estados de preparación.",
      },
      {
        problem: "Delivery sin integración: Uber Eats, Rappi y web son sistemas separados",
        solution:
          "Centralizamos todos los canales de pedido en un solo panel para cocina y administración, con sincronización de disponibilidad y reportes unificados.",
      },
    ],
    stack: ["Next.js", "React", "PostgreSQL", "WebSocket", "Vercel"],
    investmentRange: "$1.500.000 — $5.000.000 CLP",
    services: [
      {
        href: "/servicios/sitios-web",
        label: "Sitio Web con Carta Digital",
        description:
          "Presencia web profesional con carta digital, reservas y pedidos integrados.",
      },
      {
        href: "/servicios/tienda-online",
        label: "Pedidos y Delivery Online",
        description:
          "Sistema de pedidos online con pagos integrados, delivery y retiro en local.",
      },
      {
        href: "/servicios/automatizacion-ia",
        label: "Automatización e IA",
        description:
          "Recomendaciones inteligentes, gestión de stock automática y análisis de ventas.",
      },
    ],
    faqs: [
      {
        question: "¿Pueden integrarse con nuestro POS actual (Toast, Aloha, etc.)?",
        answer:
          "Dependiendo del POS, sí. Muchos sistemas tienen APIs disponibles. Evaluamos la integración en la etapa de diseño para determinar el nivel de sincronización posible.",
      },
      {
        question: "¿El sistema de reservas envía recordatorios automáticos para reducir no-shows?",
        answer:
          "Sí. El sistema envía recordatorios por WhatsApp o email según la preferencia del cliente con opciones de confirmar o cancelar, reduciendo los no-shows hasta un 40%.",
      },
      {
        question: "¿Cómo funciona el KDS si se cae el internet del local?",
        answer:
          "Implementamos un modo offline que mantiene los pedidos activos durante cortes de conexión y sincroniza automáticamente cuando se restablece, evitando pérdida de información.",
      },
      {
        question: "¿Pueden implementar el sistema para una cadena con múltiples locales?",
        answer:
          "Sí. Diseñamos el sistema con soporte multi-local, centralización de menú, reportes por sucursal y vista consolidada para la administración central.",
      },
    ],
    ctaTitle: "¿Listo para modernizar tu restaurante?",
  },

  {
    slug: "retail",
    title: "Soluciones para Retail y Comercio",
    titleAccent: "Retail",
    subtitle:
      "Plataformas de comercio unificado que conectan tu tienda física y online, sincronizan inventario en tiempo real e integran con Transbank y las principales plataformas de e-commerce.",
    statistic:
      "El 55% de los retailers en Chile que integran sus canales online y offline reportan un aumento del 30% en ventas totales.",
    problems: [
      "Inventario desincronizado entre tiendas físicas y tienda online",
      "POS de tienda sin integración con e-commerce: doble ingreso de ventas",
      "Sin datos unificados de clientes entre canales online y offline",
      "Gestión de promociones y precios manual en cada canal por separado",
      "Sin visibilidad consolidada de ventas e inventario multi-local",
    ],
    problemsSolutions: [
      {
        problem: "Inventario desincronizado entre tiendas físicas y tienda online",
        solution:
          "Desarrollamos un sistema de inventario centralizado que actualiza el stock en todos los canales en tiempo real cuando ocurre una venta, devolución o ajuste.",
      },
      {
        problem: "POS de tienda sin integración con e-commerce: doble ingreso de ventas",
        solution:
          "Integramos el POS físico con la tienda online para que todas las transacciones fluyan a un sistema único, eliminando el doble ingreso y los errores asociados.",
      },
      {
        problem: "Sin datos unificados de clientes entre canales online y offline",
        solution:
          "Implementamos un CRM de clientes que unifica el historial de compras online y en tienda, permitiendo programas de fidelización y comunicación personalizada.",
      },
      {
        problem: "Gestión de promociones y precios manual en cada canal por separado",
        solution:
          "Creamos un módulo de gestión de precios y promociones que se aplica simultáneamente en todos los canales desde una sola interfaz con control de vigencia y segmentación.",
      },
      {
        problem: "Sin visibilidad consolidada de ventas e inventario multi-local",
        solution:
          "Desarrollamos un dashboard ejecutivo con ventas, stock, rotación y márgenes consolidados por local, canal y categoría en tiempo real.",
      },
    ],
    stack: ["Next.js", "React", "PostgreSQL", "Transbank API", "Vercel"],
    investmentRange: "$2.500.000 — $8.000.000 CLP",
    services: [
      {
        href: "/servicios/tienda-online",
        label: "Tienda Online",
        description:
          "E-commerce profesional con integración Transbank, gestión de inventario y experiencia de compra optimizada.",
      },
      {
        href: "/servicios/ecommerce-medida",
        label: "E-commerce a Medida",
        description:
          "Plataformas de comercio electrónico con funcionalidades específicas para tu tipo de retail.",
      },
      {
        href: "/servicios/crm-personalizado",
        label: "CRM Personalizado",
        description:
          "Gestión de clientes unificada con historial de compras, segmentación y programas de fidelización.",
      },
    ],
    faqs: [
      {
        question: "¿Pueden integrarse con Shopify, WooCommerce u otras plataformas existentes?",
        answer:
          "Sí. Podemos integrar con las principales plataformas de e-commerce existentes mediante APIs para sincronizar inventario, pedidos y clientes sin necesidad de migrar toda la plataforma.",
      },
      {
        question: "¿Cómo manejan la integración con Transbank para pagos en tienda y online?",
        answer:
          "Integramos directamente con la API de Transbank para procesar pagos con WebPay en la tienda online y POS integrado, con conciliación automática de transacciones.",
      },
      {
        question: "¿El sistema maneja variantes de productos (talla, color) en múltiples bodegas?",
        answer:
          "Sí. El sistema de inventario soporta productos con múltiples variantes y los controla por bodega o local, con transferencias entre locales y reposición automática.",
      },
      {
        question: "¿Pueden implementar un programa de puntos o fidelización de clientes?",
        answer:
          "Absolutamente. Diseñamos el programa de fidelización según tu modelo: puntos por compra, niveles de cliente, descuentos automáticos o beneficios exclusivos, integrado en todos los canales.",
      },
    ],
    ctaTitle: "¿Listo para unificar tu operación de retail?",
  },
];

export function getSolutionPageData(slug: string): SolutionPageData | undefined {
  return solutionPages.find((page) => page.slug === slug);
}

export function getAllSolutionSlugs(): string[] {
  return solutionPages.map((page) => page.slug);
}
