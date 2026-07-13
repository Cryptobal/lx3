# Cola editorial del blog LX3

> Libro de estados. Cada corrida de `docs/automations/BLOG_PIPELINE.md` reconcilia esta cola contra `content/blog-posts/`, `content/blog.ts` (legacy) y los PRs abiertos antes de agregar candidatos nuevos. Máximo 20 en estado `pendiente`.

## Conteo de pilares (corrida 2026-07-13, sobre 31 posts publicados: 28 en `content/blog-posts/` + 3 legacy en `content/blog.ts`)

1. IA aplicada: 7
2. Costos y decisión de compra: 12
3. **Sistemas por industria: 1** ← pilar más débil, prioridad para densificar
4. Tecnología: 6
5. Operación y transformación: 5

Mix de los últimos 3 publicados (26, 27, 28): los tres atacan intención de dinero (Costos y decisión de compra) — regla de mix cumplida de sobra; no hay restricción de pilar Tecnología para la próxima corrida.

## Temas

### en-PR

- **Automatización con IA en retail chileno: qué priorizar primero** — rama `content/blog-automatizacion-ia-retail-chile`, 2026-07-13.
  - Keyword objetivo: "automatización con IA en retail" / long-tail "qué automatizar primero en retail con IA Chile"
  - Pilar: Sistemas por industria (3) — score 8/10 (B2B 3, demanda/momentum 2, gap competitivo 1, pilar 2)
  - Enlaza a `/es/soluciones/retail`, `/es/servicios/automatizacion-ia`, `/es/casos/opai-gard-security`, `/es/cotiza`.
  - No cannibaliza: la página de industria `retail` ataca `ecommerce para retail Chile` / `plataforma de venta para retail Chile` / `creo tienda virtual Chile` — ninguna coincide con el keyword objetivo de este post (automatización de inventario/atención, no e-commerce transaccional).

### pendiente

- **IA para logística en Chile: qué automatizar primero sin perder el control de las rutas** — pilar Sistemas por industria (2), score preliminar 7. Cuidado: evitar solaparse con keyword de servicio `control de flota y rutas Chile` — angular hacia "qué automatizar primero" (long-tail informacional), no "sistema de gestión logística".
- **Agenda y recordatorios con IA en clínicas chilenas: cómo reduce el ausentismo** — pilar Sistemas por industria (2), score preliminar 7. Requiere cifra chilena verificable de tasa de inasistencia en salud antes de redactar (si no se encuentra fuente sólida, descartar o generalizar sin cifra local).
- **Chatbots vs agentes de IA: qué necesita realmente tu empresa en 2026** — pilar IA aplicada (1), score preliminar 6.
- **Seguridad de datos al implementar IA en tu empresa: qué preguntar antes de contratar** — pilar Tecnología (4), score preliminar 6. Recordar tope de mix: máx. 1 de cada 3 posts consecutivos en este pilar.
- **Gestión del cambio: cómo lograr que tu equipo adopte un sistema nuevo sin resistencia** — pilar Operación y transformación (5), score preliminar 6.
- **Cuánto cuesta implementar IA en una empresa chilena: rangos reales 2026** — pilar Costos y decisión de compra (2), score preliminar 6. Pilar ya sobrerrepresentado (12 posts) — bajar prioridad frente a los de Sistemas por industria mientras ese pilar no suba.

## Estacionales

- Planificación y presupuesto del año siguiente → ventana de publicación octubre-noviembre. Fuera de ventana hoy (julio).
- Cierre contable y digitalización → ventana diciembre-enero. Fuera de ventana.
- Postulaciones CORFO/SERCOTEC a fondos de digitalización → revisar calendario vigente en la próxima corrida; no verificado hoy por falta de fuente fresca confiable en esta corrida.
- Cyber y e-commerce (calendario CCS) → no se encontró fecha confirmada de próximo Cyber Chile en la búsqueda de esta corrida; revisar en próxima corrida.

## Notas de investigación (2026-07-13)

- GSC: sin credenciales (`GSC_SERVICE_ACCOUNT_EMAIL`/`KEY` no configuradas) — fase 1.0 saltada sin fallar, según lo documentado.
- Semrush `cl`: datos escasos para `phrase_related`/`phrase_questions` sobre semillas núcleo (confirma la nota de realidad del pipeline: dominio nuevo, orgánico cercano a cero). `domain_organic` sin resultados para `bemobile.cl`, `wolfsoft.cl`, `kunder.cl` en `cl`; `zeroq.cl` tiene tráfico pero es un competidor no relevante (gestión de filas, no desarrollo de software).
- Frescura: estudio Entel Digital + CENIA (2025) — 70% de pymes chilenas y 80%+ de grandes empresas ya usan IA; 40% señala la capacitación como principal barrera. Fuente: enteldigital.cl / cobertura en diarioconcepcion.cl, gerencia.cl, centrodeinnovacion.uc.cl (coincidente en múltiples medios).
- Retail Chile: nivel de quiebre de stock ~15.7%, con pérdidas estimadas entre 6-10% de ventas (revistaemprende.cl, vlnradio.cl, uchile.cl). E-commerce chileno alcanzó ~US$10.000 millones en 2025 (ccs.cl).
