# Cola editorial — Blog LX3

> Libro de estados. Cada corrida del BLOG_PIPELINE reconcilia esta cola contra `content/blog-posts/` y contra los PRs abiertos antes de agregar candidatos nuevos. Máximo 20 en estado `pendiente`.
> Creado en la primera corrida del pipeline: 2026-07-13. Reconciliado: 2026-07-31.

## Balance de pilares al 2026-07-30 (31 posts publicados en `main`)

- IA aplicada: 7 publicados (`de-piloto-a-produccion-ia-empresas-chile` se mergeó el 2026-07-16)
- Costos y decisión de compra: 7
- Sistemas por industria: 3 publicados (`reducir-ausentismo-citas-medicas-con-ia` vía PR #16 y `prediccion-demanda-ia-retail-chile` vía PR #14, ambos mergeados el 2026-07-30) ← pilar más débil, prioridad de densificación
- Tecnología: 8
- Operación y transformación: 6

Últimos 3 `publicado` en `main`: `de-piloto-a-produccion-ia-empresas-chile` (IA aplicada), `reducir-ausentismo-citas-medicas-con-ia` (Sistemas por industria), `prediccion-demanda-ia-retail-chile` (Sistemas por industria).

En `en-PR` (aún no mergeado): `retorno-inversion-ia-empresas-chile` (Costos y decisión de compra) — ver tema 7.

## Temas

### 1. De piloto a producción con IA: por qué tu proyecto no despega
- estado: **publicado** (slug `de-piloto-a-produccion-ia-empresas-chile`, post 29, mergeado a `main` el 2026-07-16 vía PR #15)
- pilar: IA aplicada

### 2. Predicción de demanda con IA en retail: evita quiebres de stock
- estado: **publicado** (slug `prediccion-demanda-ia-retail-chile`, mergeado a `main` el 2026-07-30 vía PR #14)
- slug: `prediccion-demanda-ia-retail-chile`
- pilar: Sistemas por industria
- keyword objetivo: predicción de demanda con IA en retail
- score: 8/10

### 3. Agendamiento inteligente para clínicas: cómo reducir el ausentismo
- estado: **publicado** (slug `reducir-ausentismo-citas-medicas-con-ia`, mergeado a `main` el 2026-07-30 vía PR #16)
- slug: `reducir-ausentismo-citas-medicas-con-ia`
- pilar: Sistemas por industria
- keyword objetivo: reducir ausentismo citas médicas con IA
- score: 9/10 (intención 3 + demanda/momentum 2 + gap competitivo 2 + pilar 2)
- fuentes: Ministerio de Salud vía [Universidad de Chile / CMM](https://uchile.cl/noticias/188605/inteligencia-artificial-predice-que-pacientes-faltaran-a-citas-medicas) (19% de ausentismo en consultas de especialidad, ~1.400.000 horas médicas/año; modelo de IA bajó el ausentismo de 20,3% a 12,5% en pruebas; llamada telefónica -7,8 pp vs. WhatsApp/SMS -5,4 pp), corroborado por [SaludDigital](https://saluddigital.com/big-data/modelo-de-ia-a-traves-de-chatbot-logra-mejorar-la-agenda-de-citas-medicas-en-chile/).
- gap competitivo: `zeroq.cl` domina búsquedas de marca/sucursal para clínicas y notarías (confirmado con Semrush `resource_organic` el 2026-07-17: top tráfico son "starken", "servipag", notarías específicas) pero no tiene contenido informacional sobre reducción de ausentismo con IA.

### 4. Cómo elegir un sistema de gestión de flotas con IA para logística
- estado: pendiente
- pilar: Sistemas por industria
- keyword objetivo: sistema de gestión de flotas con IA Chile
- score estimado: 7/10
- nota: enlaza a `/es/soluciones/logistica`. Ángulo: qué automatizar primero (ruteo, GPS, mantenimiento predictivo), sin competir con la keyword de la landing. PR #13 (ángulo distinto, "qué automatizar primero" en logística) se cerró sin mergear el 2026-07-13 sin motivo documentado — revisar con Carlos antes de retomar este ángulo si vuelve a competir con el mismo tema.

### 5. Digitaliza tu Pyme 2026: qué significa la alianza CENIA-Subsecretaría para tu empresa
- estado: pendiente
- pilar: IA aplicada
- keyword objetivo: digitalización pymes Chile 2026
- score estimado: 4/10 (bajado de 5/10 — la alianza sigue perdiendo frescura, mayo 2026 queda cada vez más lejos; además el pilar IA aplicada ya no es el más débil tras el merge del post 29)

### 6. Mantenimiento predictivo con IA para empresas de servicios profesionales
- estado: pendiente
- pilar: Sistemas por industria
- keyword objetivo: mantenimiento predictivo con IA empresas Chile
- score estimado: 6/10
- nota: Semrush `cl` muestra volumen 720 para "mantenimiento predictivo" (genérico, sin modificador IA); con modificador IA el volumen cae a prácticamente cero — validar ángulo con fuentes de prensa antes de escribir.

### 7. Retorno de inversión en IA: por qué solo el 7% lo logra
- estado: **en-PR** (rama `content/blog-retorno-inversion-ia-empresas-chile`, post 32, corrida 2026-07-31)
- slug: `retorno-inversion-ia-empresas-chile`
- pilar: Costos y decisión de compra
- keyword objetivo: retorno de inversión en IA
- score: 9/10 (intención 3 + demanda/momentum 3 + gap competitivo 2 + pilar 1)
- fuentes: segundo [Global AI Pulse de KPMG](https://www.mediabanco.com/adopcion-de-ia-en-las-empresas-se-duplica-en-tres-meses-pero-el-retorno-comprobado-cae-a-7-revela-nuevo-estudio-de-kpmg/) (2.145 líderes senior, 20 países, publicado 2026-07-02; adopción activa 13%→22% en 3 meses, retorno comprobado 8%→7%), corroborado por [La Tercera](https://www.latercera.com/pulso/noticia/la-ia-avanza-mas-rapido-que-sus-resultados-estudio-detecta-aumento-de-la-adopcion-y-caida-del-retorno/) y con contexto de adopción en Chile de [Publimetro](https://www.publimetro.cl/tecnologia/2026/07/23/en-chile-8-de-cada-10-empresas-ya-usan-inteligencia-artificial-pero-la-ciberseguridad-emerge-como-el-principal-desafio/) (8 de 10 empresas chilenas ya usa IA).
- gap competitivo: sin post ni página de servicio propia que ataque "retorno de inversión en IA" (verificado por grep de tags/keywords existentes) — ángulo no cubierto por competidores chilenos revisados hasta ahora.
- imagen: generada en la corrida (Cloudflare Images, ver PR). Backfill del post 31 (`prediccion-demanda-ia-retail-chile`, sin `heroImage`) intentado 2 veces — falló criterio de paleta (iluminación roja/neón) ambas veces, se omitió y quedó documentado en el PR.

## Estacionales

- Ninguno dentro de ventana el 2026-07-17. Próxima ventana: planificación y presupuesto 2027 (publicar octubre-noviembre 2026).

## Descartados

_(vacío)_
