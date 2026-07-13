# Cola editorial del blog LX3

> Libro de estados. Cada corrida de `docs/automations/BLOG_PIPELINE.md` reconcilia esta cola contra `content/blog-posts/`, `content/blog.ts` (legacy) y los PRs abiertos antes de agregar candidatos nuevos. Máximo 20 en estado `pendiente`.

## Conteo de pilares (corrida 2026-07-13 #2, sobre 31 posts publicados: 28 en `content/blog-posts/` + 3 legacy en `content/blog.ts`)

1. IA aplicada: 7
2. Costos y decisión de compra: 12
3. **Sistemas por industria: 1** ← pilar más débil; 2 posts en camino (`en-PR`, ver abajo) lo densifican apenas se mergeen
4. Tecnología: 6
5. Operación y transformación: 5

Mix de los últimos 3 publicados (26, 27, 28): los tres atacan intención de dinero (Costos y decisión de compra) — regla de mix cumplida de sobra; no hay restricción de pilar Tecnología para la próxima corrida.

## Temas

### en-PR

- **Automatización con IA en retail chileno: qué priorizar primero** — rama `content/blog-automatizacion-ia-retail-chile`, PR #12, 2026-07-13.
  - Keyword objetivo: "automatización con IA en retail" / long-tail "qué automatizar primero en retail con IA Chile"
  - Pilar: Sistemas por industria (3) — score 8/10.
  - Enlaza a `/es/soluciones/retail`, `/es/servicios/automatizacion-ia`, `/es/casos/opai-gard-security`, `/es/cotiza`.

- **IA en logística Chile: qué automatizar primero sin perder control** — rama `claude/vigilant-fermat-2upm4f`, 2026-07-13 (corrida #2 del día).
  - Slug: `ia-logistica-chile-que-automatizar-primero`
  - Keyword objetivo: "IA en logística Chile" / long-tail "qué automatizar primero en logística con IA"
  - Pilar: Sistemas por industria (3) — score 8/10 (B2B 3, demanda/momentum 2, gap competitivo 1, pilar 2)
  - Enlaza a `/es/casos/opai-gard-security`, `/es/servicios/automatizacion-ia`, `/es/servicios/aplicaciones-internas`, `/es/cotiza`.
  - No cannibaliza: la página de industria `/es/soluciones/logistica` ataca `software para logística Chile` / `sistema de gestión logística Chile` / `control de flota y rutas Chile` — este post ataca la long-tail informacional "qué automatizar primero", sin competir por esos head terms, y enlaza hacia `/es/servicios/aplicaciones-internas` (no existe página de servicio dedicada a logística, solo la de solución por industria, que no se enlazó para evitar canibalizar su propio head term con un anchor genérico).
  - Fuentes: [Conecta Logística — Radar Logístico de Chile, Revista Logistec 2026-06-30](https://www.revistalogistec.com/index.php/2026/06/30/conecta-logistica-lanza-el-radar-logistico-de-chile-el-primer-retrato-integral-de-un-sector-que-mueve-el-4-del-pib/) (4% del PIB), [Gartner press release 2026-06-15](https://www.gartner.com/en/newsroom/press-releases/2026-06-15-gartner-says-there-is-an-outsized-need-for-ai-talent-in-supply-chain) (387% demanda de talento IA en supply chain, Q1 2023→Q1 2026).

## Backlog abierto en esta corrida

**2 PRs de blog abiertos sin mergear tras esta corrida** (PR #12 + este). Próxima corrida: si ambos siguen abiertos, **NO publicar un tercero** — notificar por Fase 6 que la revisión está atascada, con los links de ambos PRs pendientes.

### pendiente

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

## Notas de investigación (2026-07-13, corrida #2)

- GSC: sin credenciales (`GSC_SERVICE_ACCOUNT_EMAIL`/`KEY` no configuradas) — fase 1.0 saltada sin fallar.
- Semrush `cl`: `phrase_related` sin resultados ("NOTHING FOUND") para `software para logística Chile` y `automatizar procesos empresa` — confirma la nota de realidad del pipeline (dominio nuevo, orgánico cercano a cero, cobertura de keyword de nicho escasa en Semrush `cl`).
- Frescura: Radar Logístico de Chile (Conecta Logística, jun-2026) — logística ≈ 4% del PIB. Gartner (jun-2026) — demanda de roles de supply chain con habilidades de IA +387% entre Q1 2023 y Q1 2026 (35M+ postings analizados). Múltiples medios chilenos (Soychile, T13, Logística 360, FleetUp, Revista Logistec) cubriendo IA aplicada a logística/flotas en 2026 — momentum real, sin ser aún un pico noticioso puntual.
- PAA/autosuggest (lunes, fase 1.4): búsquedas sobre "qué automatizar primero" e "implementar IA pyme logística Chile" devuelven consenso en fuentes de terceros sobre secuencia de implementación (ruteo primero, bodega compleja después) — usado como guía editorial, no como cifra citada (se evitaron números de costo/ahorro de blogs de terceros no verificables, p. ej. cifras de "ahorro promedio" sin fuente primaria).
- `WebFetch` devolvió 403 en el dominio probado (`infobae.com`) — mismo patrón que la corrida anterior; verificación hecha con snippets de `WebSearch` coincidentes en múltiples medios (Revista Logistec citando el mismo informe de Conecta Logística).
