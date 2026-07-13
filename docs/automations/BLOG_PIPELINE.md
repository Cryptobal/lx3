# BLOG_PIPELINE — Rutina remota de generación de contenido SEO/GEO para lx3.ai

> **Contexto de ejecución:** rutina remota de Claude Code en la nube de Anthropic. El repo `Cryptobal/lx3` ya está clonado; trabajas desde su raíz. No necesitas clonar nada.
> **Modo:** 100% autónomo. Si un guardrail bloquea, NO publiques y termina reportando el motivo — eso es un resultado correcto.
> **Cierre obligatorio v1:** SIEMPRE terminar en **Pull Request**. Prohibido hacer merge a `main`. (Cuando Carlos apruebe 3 corridas consecutivas, él cambiará esta regla.)
> **Principio rector:** calidad > cadencia. Un post mediocre daña más que no publicar.

## Variables de entorno esperadas (configuradas en el entorno cloud "LX3 Web")

**Secretos (configurar en el entorno):**
- `CF_IMAGES_TOKEN` — token de Cloudflare con permisos **Workers AI: Read** (generación) e **Images: Edit** (subida). **Es el mismo token que usa Gard** — misma cuenta.
- `SLACK_WEBHOOK_URL` — webhook entrante de Slack del canal `#lx3-web-blog`
- `GSC_SERVICE_ACCOUNT_EMAIL` y `GSC_SERVICE_ACCOUNT_KEY` — credenciales de la service account de Search Console (la SA debe ser Owner de la propiedad). Sin ellas, la fase 1.0 se salta sin fallar.

**Constantes de Cloudflare — ya verificadas, van literales en los curls (NO son variables):**
- Account ID: `e56e6231ebbfb3edd31e85df0a7092bc` (la misma cuenta de Gard)
- Account hash de Images: `gGw8cfmEZedi85dYm6qcFw`
- URL pública de una imagen: `https://imagedelivery.net/gGw8cfmEZedi85dYm6qcFw/<uuid>/public`

Si una variable falta, no falles la corrida completa: aplica el fallback documentado en cada fase y déjalo anotado en el PR.

---

## GUARDRAILS INNEGOCIABLES

1. **IA-first, B2B, PYME chilena.** El post apunta a un DECISOR de empresa mediana chilena (gerente general, gerente de operaciones, dueño de PYME) que evalúa automatizar procesos con IA. **Prohibido** en título, slug, H2s y keyword objetivo: contenido para desarrolladores buscando tutoriales (`cómo programar`, `tutorial React`, `aprender Python`), contenido para estudiantes, y toda variante job-seeker (`trabajo de programador`, `sueldo desarrollador`). No somos un blog técnico ni una bolsa de empleo: somos un estudio que vende sistemas con IA a empresas.

2. **Cero datos inventados.** Toda cifra externa lleva fuente verificable enlazada (INE, Banco Central, Subtel, CORFO, ASECH, prensa seria, papers). Sin fuente, la cifra no existe. **Prohibido inventar clientes, casos o métricas.**

3. **Precios canónicos — única fuente de verdad `lib/pricing.ts`** (leerlo en cada corrida):
   - Landing Pro: $490.000 CLP
   - Web Corporativa: $1.490.000 CLP
   - Web a Medida: desde $2.500.000 CLP
   - Software a medida: desde $3.000.000 CLP

   Cualquier otro precio en un post es un BUG. Si el tema exige rangos de mercado, cítalos como rangos de la industria con fuente, nunca como precios de LX3.

4. **La única prueba social real es OPAI.** ERP con 20+ módulos e IA integrada que opera 500+ guardias en Gard Security, en producción: cotiza con IA, agenda turnos, controla rondas GPS, procesa documentos. Es el ancla de credibilidad de todo el blog. **No inventar otros clientes.**

5. **Sin claims no verificables** ("#1", "la mejor", "líder", "revolucionario"). Permitido: hechos verificables (OPAI en producción, 500+ personas gestionadas, 20+ módulos).

6. **No canibalizar.** Acabamos de eliminar 10 keywords canibalizadas (commit `ce05597`) — no las reintroduzcas. Antes de elegir tema:
   - Listar keywords de las páginas comerciales: `grep -h -oE "keywords?: *\[[^]]*\]" data/keywords.ts data/service-pages.ts data/solution-pages.ts`
   - Listar slugs y keywords de posts existentes: `ls content/blog-posts/` + `grep -h -E '^(title|slug|tags):' content/blog-posts/*.md`
   - **Si la keyword objetivo del candidato ya la ataca una página de servicio o un post, cambiar de ángulo o descartar.** Los posts atacan long-tail informacional y **enlazan hacia** las páginas de servicio — nunca compiten con ellas por el mismo head term.

7. **Español de Chile, tuteo. Voseo argentino PROHIBIDO.** Nunca `cotizás`, `podés`, `tenés`, `querés`, `necesitás`, `cotizá`, `mirá`. Usa `cotizas`, `puedes`, `tienes`, `quieres`, `necesitas`, `cotiza`, `mira`.

8. **Enlaces internos solo a rutas vigentes**, verificadas contra `https://www.lx3.ai/sitemap.xml`. Rutas en formato **relativo con prefijo de locale** (`](/es/servicios/...)`, nunca `https://www.lx3.ai/...`).

---

## FASE 0 — Contexto

0.1 `git pull origin main` para asegurar el estado más reciente.
0.2 Leer: `lib/pricing.ts`, `data/keywords.ts`, `content/blog-markdown.ts` (el parser — define el contrato del frontmatter) y, si existe, `docs/seo/blog-topic-queue.md` (cola editorial).
0.3 Listar los slugs existentes: `ls content/blog-posts/`.
0.4 Descargar rutas vigentes: `curl -s https://www.lx3.ai/sitemap.xml` → lista para el interlinking.
0.5 **Trabajo en vuelo (anti-duplicados):** listar ramas y PRs de blog NO mergeados: `git ls-remote origin 'refs/heads/content/blog-*'` y `gh pr list --state open`. Sus temas y slugs cuentan como YA CUBIERTOS, igual que los posts en `main` — un post esperando revisión sigue siendo un post existente. **Tope de backlog:** si hay 2 o más PRs de blog abiertos sin mergear, NO publicar otro: notificar por la Fase 6 que la revisión está atascada (con los links pendientes) y terminar la corrida.

## FASE 1 — Investigación

1.0 **Google Search Console (si existen `GSC_SERVICE_ACCOUNT_EMAIL`/`KEY` — la fuente de mayor ROI):** consultar la propiedad de `lx3.ai` y filtrar queries con impresiones ≥ 10 y posición promedio 8-25 que NO tengan URL dedicada en el sitemap: cada una es un "quick win" — Google ya nos considera relevantes, falta la página que capture el clic — y entra a la cola con demanda = 3.
   > **Nota de realidad:** lx3.ai es un dominio nuevo con presencia orgánica cercana a cero (Semrush `cl` = sin datos). Al principio GSC devolverá poco o nada. Eso es esperable, no un error. Si no hay datos, saltar sin fallar y apoyarse en las fases 1.1-1.4.

1.1 **Semrush (conector MCP disponible; base de datos siempre `'cl'`):**
   - `phrase_related` sobre 2-3 semillas rotativas IA-first: `inteligencia artificial para empresas`, `automatizar procesos empresa`, `software a medida empresas`, `agentes de IA negocios`, `ERP con inteligencia artificial` — volumen ≥ 10, descartando intención de estudiante/desarrollador.
   - `phrase_questions` sobre la semilla del día → candidatos a FAQ y títulos informacionales.
   - `domain_organic` de 2 competidores rotativos (`bemobile.cl`, `nisum.com`, `kunder.cl`, `imagemaker.com`, `wolfsoft.cl`, `zeroq.cl`) → gaps informacionales donde ellos rankean y lx3.ai no.

1.2 **Frescura:** revisar noticias de IA aplicada a negocios en Chile/LATAM de los últimos 7 días (adopción de IA en PYMEs, regulación de IA, casos de automatización, lanzamientos relevantes). Lo noticioso con ángulo B2B puntúa alto.

1.3 Mantener `docs/seo/blog-topic-queue.md` como **libro de estados**, no una lista simple. Cada tema lleva: `estado: pendiente | en-PR (rama, fecha) | publicado (slug, fecha) | descartado (motivo)`. Al iniciar cada corrida, reconciliar la cola contra `content/blog-posts/` y contra los PRs del paso 0.5: un tema cuyo slug ya existe en `main` pasa a `publicado`; uno con PR abierto queda `en-PR`. Agregar candidatos nuevos con su score; máximo 20 en estado `pendiente`.
   > Si el archivo no existe (primera corrida), **créalo** con los candidatos que encuentres en esta fase.

1.4 **PAA y autosuggest reales (solo lunes):** con las herramientas web de la sesión, revisar las SERPs de Google Chile de las 5 keywords núcleo (`inteligencia artificial para empresas Chile`, `automatización con IA`, `implementar IA en mi empresa`, `software a medida Chile`, `cuánto cuesta un sistema a medida`) y cosechar los "Otras preguntas de los usuarios" (PAA) y autosuggest no cubiertos — Semrush tarda meses en indexar estas preguntas frescas.

1.5 **Estacionalidad chilena:** la cola mantiene una sección `## Estacionales` con ventana de publicación 3-4 semanas ANTES del pico: planificación y presupuesto del año siguiente (publicar octubre-noviembre), cierre contable y digitalización (publicar diciembre-enero), postulaciones CORFO/SERCOTEC a fondos de digitalización (según calendario), Cyber y e-commerce (según calendario CCS). Cada corrida revisa si hay un estacional dentro de su ventana: si lo hay, compite con demanda = 3.

## FASE 2 — Selección del tema

Score (0-10): intención B2B decisor (0-3, **eliminatorio en 0**) + demanda/momentum (0-3) + gap competitivo (0-2) + **pilar (0-2)**.

**Los 5 pilares del blog LX3:**
1. **IA aplicada** — qué automatizar, agentes vs chatbots, casos reales, límites honestos de la IA
2. **Costos y decisión de compra** — cuánto cuesta, comprar vs construir, SaaS vs a medida, ROI
3. **Sistemas por industria** — seguridad, retail, logística, salud, servicios profesionales
4. **Tecnología** — arquitectura, stack, integraciones, seguridad de datos, escalabilidad
5. **Operación y transformación** — reemplazar Excel, migrar de sistemas legacy, gestión del cambio

El candidato suma 2 si densifica el pilar con MENOS posts publicados, 1 si pertenece a cualquier otro, 0 si es huérfano.

**Regla de mix editorial (anti-sesgo):** de cada 3 posts consecutivos, máximo 1 del pilar Tecnología, y al menos 1 debe atacar intención de dinero (Costos y decisión de compra, o Sistemas por industria). Verificar contra los últimos 3 `publicado` de la cola; si el ganador viola el mix, elegir el siguiente mejor que lo cumpla.

**Umbral: ≥ 6.** Si nada llega, terminar reportando "sin tema publicable hoy" sin abrir PR.

**Dedup semántico (no solo por slug):** extraer `title` y `tags` del frontmatter de todos los posts (`grep -h -E '^(title|slug|tags):' content/blog-posts/*.md`), las keywords de las páginas comerciales (guardrail 6) y los títulos de los PRs abiertos del 0.5. Un candidato ES duplicado si comparte la keyword objetivo o la entidad principal (misma tecnología, mismo servicio×industria, mismo concepto) con algo `publicado`, `en-PR` o ya cubierto por una **página de servicio**. Ejemplo: si `/es/servicios/automatizacion-ia` ataca `automatización de procesos empresariales Chile`, entonces un post con esa misma keyword objetivo es DUPLICADO — el post debe atacar una long-tail que **enlace** a esa landing (p. ej. "qué procesos conviene automatizar primero en una PYME"). Duplicado = eliminatorio. En el mismo commit del post, el tema elegido queda marcado `en-PR` en la cola.

## FASE 3 — Redacción

Crear `content/blog-posts/NN-<slug>.md` (NN = siguiente correlativo de dos dígitos) con este frontmatter — **compatible con `content/blog-markdown.ts`, que valida las claves obligatorias y falla el build si falta alguna**:

```yaml
---
title: "<55-65 caracteres, keyword objetivo al inicio>"
slug: "<kebab-case, sin tildes ni ñ>"
title_en: "<English title>"
description: "<140-155 caracteres, con la keyword y un beneficio>"
description_en: "<English meta description>"
date: "<YYYY-MM-DD de hoy>"
author: "LX3"
category: "<Estrategia | Tecnologia | Operaciones>"
tags: ["<keyword objetivo>", "<2-4 secundarias>"]
readingTime: "<N> min"
featured: false
ogImage: "<URL absoluta de Cloudflare Images de la FASE 4 — omitir el campo si hubo fallback>"
heroImage: "<misma URL>"
---
```

> ⚠️ **Claves obligatorias** (el parser falla si falta una): `title`, `slug`, `description`, `date`, `author`, `category`, `tags`, `readingTime`, `featured`.
> ⚠️ **`category` debe ser exactamente una de estas tres:** `Estrategia`, `Tecnologia` (sin tilde), `Operaciones`. Están mapeadas a colores en `content/blog-categories.ts`.
> ⚠️ `ogImage`/`heroImage` aceptan URL absoluta (el código detecta `startsWith("http")`) — por eso las de Cloudflare funcionan sin tocar `next.config.ts`.

**Cuerpo — estructura bilingüe obligatoria** (así lo espera el sitio):

```markdown
<!-- EN -->
> **TL;DR:** English summary in 2-3 sentences.

> *[Full article available in Spanish](/es/blog/<slug>).*

<!-- ES -->
> **TL;DR:** Respuesta directa a la pregunta del título, en 2-3 frases.

## <Primer H2>
...
```

**Reglas de redacción:**
- **1.400-1.800 palabras**, español de Chile, tono consultor B2B.
- **Empieza con la respuesta.** El TL;DR responde la pregunta del título. Sin introducción de relleno, sin "En el mundo actual...", sin "En la era digital...".
- **Keyword objetivo** en el primer párrafo, en un H2, y en la meta description. Densidad natural — si suena forzado, está mal.
- **Específico, no genérico.** Cada afirmación con un número, un ejemplo o un caso. Si no puedes ser concreto, borra la frase.
  - ❌ "La IA puede mejorar mucho tus procesos"
  - ✅ "En OPAI, el módulo de cotización con IA generaba propuestas de servicio de guardias en minutos, no días."
- **Honesto sobre los límites.** Di también cuándo la IA NO conviene. La credibilidad convierte más que el entusiasmo.
- **3-5 enlaces internos** SIEMPRE relativos con locale (`](/es/servicios/...)`), a rutas verificadas en 0.4. Prioridad: la página de servicio afín + el caso OPAI (`/es/casos/...`) + `/es/cotiza`. Anchor text natural en prosa — nunca "haz clic aquí" ni "leer más".
- **Mínimo 2 fuentes externas enlazadas** — verificadas con las herramientas web de la sesión, **NUNCA con curl del sandbox** (la red del entorno es una allowlist mínima; los intentos aparecen como "dominio bloqueado" sin ser un error real).
- **Una tabla o lista comparativa** si el tema lo permite (citabilidad por IA / GEO).
- CTA final a `/es/cotiza`, sin promesas fuera de los guardrails.
- **Prohibido:** adjetivos vacíos ("revolucionario", "innovador", "de vanguardia"), promesas sin respaldo, métricas inventadas.

## FASE 4 — Imagen única

4.0 **Preflight de red (diagnóstico, no bloqueante):** probar conectividad real y dejar constancia en el reporte/PR de qué dominio respondió y cuál bloqueó el proxy:
```bash
DOMS="api.cloudflare.com hooks.slack.com www.lx3.ai"
[ -n "$GSC_SERVICE_ACCOUNT_EMAIL" ] && DOMS="$DOMS oauth2.googleapis.com searchconsole.googleapis.com"
for d in $DOMS; do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "https://$d" || echo "BLOQUEADO")
  echo "$d → $code"
done
```
(Cualquier código HTTP = dominio alcanzable; fallo de CONNECT/timeout = bloqueado por la política de red del entorno.)

4.1 **Estética de marca LX3** (distinta a Gard): 1200×630, fondo oscuro (`#06080E`), acentos azul eléctrico (`#3B82F6`) y coral (`#FF6B5A`), composición geométrica abstracta, grid sutil, estética tech moderna con profundidad y glow. **Sin texto incrustado, sin rostros reconocibles, sin logos de terceros.**

4.2 Generar por la primera vía disponible, en este orden:

- **A) Cloudflare Workers AI (vía principal — mismo dominio y mismo token que la subida):**
```bash
curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/e56e6231ebbfb3edd31e85df0a7092bc/ai/run/@cf/black-forest-labs/flux-1-schnell" \
  -H "Authorization: Bearer $CF_IMAGES_TOKEN" -H "Content-Type: application/json" \
  -d '{"prompt":"<prompt descriptivo en inglés, estética LX3: dark background, electric blue and coral accents, abstract geometric, no text>","steps":6}' \
  | python3 -c 'import sys,json,base64; open("raw.png","wb").write(base64.b64decode(json.load(sys.stdin)["result"]["image"]))'
convert raw.png -resize 1200x630^ -gravity center -extent 1200x630 imagen.png   # si falta ImageMagick: pip install pillow y hacerlo con PIL
```
  Requiere que el token tenga además el permiso **Workers AI: Read**. Si la respuesta es error de permisos, reportarlo textual en el PR (es 1 clic de Carlos en el dashboard).
  > **Crítico en el prompt de FLUX:** incluir `no text, no words, no letters, no watermark` — FLUX intenta escribir texto y sale ilegible.

- **B)** Conector Hugging Face — solo si expone una herramienta de generación de imagen (si la invocación está deshabilitada por configuración `gradio=none`, saltar sin insistir).

- **C)** Banco local: si existe `docs/automations/image-bank.md` (mapa categoría → URL de Cloudflare ya subida), usar la URL de la categoría más afín al tema y anotarlo en el PR como "imagen de banco".

4.3 (Solo vías A/B) Subir a Cloudflare Images:
```bash
curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/e56e6231ebbfb3edd31e85df0a7092bc/images/v1" \
  -H "Authorization: Bearer $CF_IMAGES_TOKEN" -F "file=@imagen.png"
```
Capturar el UUID de la respuesta INMEDIATAMENTE y validarlo contra `^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$`.

Construir la **URL pública absoluta** con el account hash ya verificado:
```
https://imagedelivery.net/gGw8cfmEZedi85dYm6qcFw/<uuid>/public
```
Esa URL completa es la que va en `ogImage` y `heroImage`. **No inventar el hash — es exactamente `gGw8cfmEZedi85dYm6qcFw`.**

> ✅ LX3 ya soporta URLs absolutas: `app/[locale]/(site)/blog/[slug]/page.tsx` detecta `ogImage.startsWith("http")`. **No hay que tocar `next.config.ts`.**

4.4 **Fallback final honesto:** si ninguna vía funcionó, OMITIR los campos `ogImage`/`heroImage` (son opcionales en el parser), anotar en el PR "PENDIENTE: imagen única" junto al diagnóstico del preflight 4.0. **Prohibido inventar un UUID o reutilizar el de otro post.**

4.5 **Backfill de auto-reparación:** si la vía A funcionó en esta corrida, revisar en `main` los posts de los últimos 14 días SIN `heroImage` (los que salieron con "PENDIENTE"). Generar y subir imagen para hasta 2 de ellos y agregar su URL en el mismo commit/PR, listándolos como "🔧 Backfill de imagen: <slugs>".

## FASE 5 — Validación y Pull Request

```bash
# Voseo argentino — esperado: 0
grep -icE "cotizás|podés|tenés|querés|necesitás|cotizá|mirá|hacé|escribí" content/blog-posts/NN-<slug>.md

# Claims prohibidos — esperado: 0
grep -icE "#1|la mejor|líder indiscutido|revolucionario" content/blog-posts/NN-<slug>.md

# Precios fuera del canon — revisar cada hit manualmente
grep -oE '\$[0-9.]+' content/blog-posts/NN-<slug>.md

# Enlaces internos relativos con locale — esperado: ≥3
grep -c '](/es/' content/blog-posts/NN-<slug>.md

# category válida — esperado: 1
grep -cE '^category: "(Estrategia|Tecnologia|Operaciones)"$' content/blog-posts/NN-<slug>.md

# Build
./node_modules/.bin/tsc --noEmit && ./node_modules/.bin/next build
```

Si todo pasa:
```bash
git checkout -b content/blog-<slug>
git add content/blog-posts/NN-<slug>.md docs/seo/blog-topic-queue.md
git commit -m "content(blog): <slug>"
git push -u origin content/blog-<slug>
```

Abrir **Pull Request normal (NO draft — `gh pr create` SIN `--draft`)** hacia `main` con: tema y score, keyword objetivo y volumen, enlaces internos usados, fuentes citadas, URL de imagen (o "PENDIENTE"), y este checklist post-merge para Carlos:
- [ ] Verificar `https://www.lx3.ai/es/blog/<slug>` responde 200 tras el deploy de Vercel
- [ ] Enviar la URL a la GSC Indexing API (o Inspección de URL → Solicitar indexación)

**Link directo al post renderizado (con tope duro de espera):** tras abrir el PR, usar el conector de Vercel para obtener el Preview Deployment de la rama `content/blog-<slug>`. Polling secuencial cada 60-90 s con **tope máximo de 10 minutos** — prohibido dejar múltiples sleeps en background. Construir el link de lectura: `<url_del_preview>/es/blog/<slug>` (si el preview tiene protección, generar link compartible con la herramienta de Vercel — el link se obtiene por el CONECTOR, no requiere abrir *.vercel.app en la red) y agregarlo al inicio de la descripción del PR como "📖 Leer el post". **Si a los 10 minutos el build no está READY:** no seguir esperando — dejar el link con la nota "(se activa cuando termine el build de Vercel)", programar UN ÚNICO self check-in a ~60 minutos que verifique el estado, actualice el PR y reenvíe la notificación si cambió, y terminar la corrida.

**NO hacer merge. Terminar la corrida después de abrir el PR y notificar (Fase 6).**

## FASE 6 — Notificación a Carlos

- **Vía principal — webhook de Slack al canal `#lx3-web-blog`:**
```bash
curl -s -X POST "$SLACK_WEBHOOK_URL" -H 'Content-type: application/json' \
  --data "{\"text\":\"📝 Nuevo post listo para revisar: *<título>*\n📖 Leer: <link_preview_directo>\n✅ Aprobar (PR): <link_PR>\n🖼️ Imagen: <URL | PENDIENTE | backfill: slugs>\"}"
```
  La respuesta del POST debe ser exactamente `ok`; cualquier otra cosa se trata como fallo de vía → usar el fallback y anotarlo en el reporte.
- Enviar también la notificación push nativa de la sesión con el resumen.
- Si la corrida NO publicó: mismo canal, motivo exacto (guardrail, tope de backlog o umbral de score).
- **Fallback** si `$SLACK_WEBHOOK_URL` no existe o el POST falla: mensaje directo a Carlos por el conector de Slack si está disponible.
- Si el preflight 4.0 mostró dominios BLOQUEADOS, la notificación DEBE incluir: "⚠️ Red del entorno bloquea: <dominios> → revisar Acceso a la red del entorno LX3 Web".
- Prohibido escribir a cualquier otro canal, webhook o persona.

## FASE 7 — Reporte

Cerrar con un resumen: tema y score, slug, PR abierto (link), link de lectura del preview, estado de la imagen, y los 3 próximos temas en cola. Si no se publicó: motivo exacto.

---

## NOTA DE CONTEXTO (leer una vez)

El sitio acaba de pasar por un refactor SEO profundo (commit `ce05597`) que eliminó 10 keywords canibalizadas, 15 páginas geo de contenido delgado y 6 páginas de precio huérfanas. El sitemap bajó de ~100 a ~55 URLs. **Los cimientos están limpios — este pipeline es el motor de crecimiento que se construye encima.**

lx3.ai es un dominio nuevo: Semrush reporta presencia orgánica cercana a cero en Chile. Eso significa dos cosas:
1. Las primeras corridas tendrán poca data de GSC. Es esperable.
2. La consistencia es lo que gana. Espera 8-12 semanas para ver movimiento en posiciones y 4-6 meses para tráfico real.

**Un post excelente cada corrida vale más que tres mediocres.** Si el umbral de score no se alcanza, no publicar es la decisión correcta.