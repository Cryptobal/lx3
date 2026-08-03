# Cola editorial — Blog LX3

> Libro de estados. Cada corrida del BLOG_PIPELINE reconcilia esta cola contra `content/blog-posts/` y contra los PRs abiertos antes de agregar candidatos nuevos. Máximo 20 en estado `pendiente`.
> Creado en la primera corrida del pipeline: 2026-07-13. Reconciliado: 2026-08-03.

## Balance de pilares al 2026-08-03 (32 posts publicados en `main`, 1 `en-PR`)

- IA aplicada: 7 publicados
- Costos y decisión de compra: 8 publicados (`retorno-inversion-ia-empresas-chile` se mergeó vía PR #17)
- Sistemas por industria: 3 publicados + 1 `en-PR` (`control-de-obra-con-ia-constructoras-chile`, tema 8) ← pilar más débil, prioridad de densificación
- Tecnología: 8
- Operación y transformación: 6

Últimos 3 `publicado` en `main`: `reducir-ausentismo-citas-medicas-con-ia` (Sistemas por industria), `prediccion-demanda-ia-retail-chile` (Sistemas por industria), `retorno-inversion-ia-empresas-chile` (Costos y decisión de compra).

En `en-PR` (aún no mergeado): `control-de-obra-con-ia-constructoras-chile` (Sistemas por industria) — ver tema 8, corrida 2026-08-03.

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
- estado: **publicado** (slug `retorno-inversion-ia-empresas-chile`, mergeado a `main` vía PR #17)
- slug: `retorno-inversion-ia-empresas-chile`
- pilar: Costos y decisión de compra
- keyword objetivo: retorno de inversión en IA
- score: 9/10 (intención 3 + demanda/momentum 3 + gap competitivo 2 + pilar 1)
- fuentes: segundo [Global AI Pulse de KPMG](https://www.mediabanco.com/adopcion-de-ia-en-las-empresas-se-duplica-en-tres-meses-pero-el-retorno-comprobado-cae-a-7-revela-nuevo-estudio-de-kpmg/) (2.145 líderes senior, 20 países, publicado 2026-07-02; adopción activa 13%→22% en 3 meses, retorno comprobado 8%→7%), corroborado por [La Tercera](https://www.latercera.com/pulso/noticia/la-ia-avanza-mas-rapido-que-sus-resultados-estudio-detecta-aumento-de-la-adopcion-y-caida-del-retorno/) y con contexto de adopción en Chile de [Publimetro](https://www.publimetro.cl/tecnologia/2026/07/23/en-chile-8-de-cada-10-empresas-ya-usan-inteligencia-artificial-pero-la-ciberseguridad-emerge-como-el-principal-desafio/) (8 de 10 empresas chilenas ya usa IA).
- gap competitivo: sin post ni página de servicio propia que ataque "retorno de inversión en IA" (verificado por grep de tags/keywords existentes) — ángulo no cubierto por competidores chilenos revisados hasta ahora.
- imagen: generada en la corrida (Cloudflare Images, ver PR). Backfill del post 31 (`prediccion-demanda-ia-retail-chile`, sin `heroImage`) intentado 2 veces — falló criterio de paleta (iluminación roja/neón) ambas veces, se omitió y quedó documentado en el PR.

### 8. Control de obra con IA: menos sobrecostos en tu constructora
- estado: **en-PR** (rama `content/blog-control-de-obra-con-ia-constructoras-chile`, post 33, corrida 2026-08-03)
- slug: `control-de-obra-con-ia-constructoras-chile`
- pilar: Sistemas por industria
- keyword objetivo: control de obra con IA
- score: 9/10 (intención 3 + demanda/momentum 2 + gap competitivo 2 + pilar 2)
- fuentes: [Comisión Nacional de Evaluación y Productividad (CNEP)](https://cnep.cl/wp-content/uploads/2025/05/Hallazgos-Productividad-sector-construccion.pdf) (50% de proyectos con sobrecostos en Chile vs. ~10% internacional; desviación de plazos 27% Chile vs. 8% internacional; ~7% de reducción de costos posible cerrando brechas de productividad), corroborado con contexto de [Cámara Chilena de la Construcción — Radiografía de Innovación 2024](https://cchc.cl/comunicaciones/noticias/radiografia-de-innovacion-en-la-construccion-por-primera-vez-se-realiza-un-estudio-que-da-cuenta-de-la-aplicacion-de-modelos-innovadores-en-la-construccion) (innovación reportada por empresas del sector subió de 9,3% a 14,4%).
- gap competitivo: sin post propio ni de competidores chilenos revisados (`kunder.cl`, `wolfsoft.cl` sin datos orgánicos en Semrush `cl` para este ángulo) que ataque "control de obra con IA" para constructoras — verificado con Semrush `resource_organic` y búsqueda web.
- imagen: generada en la corrida (Cloudflare Images). Requirió 2 regeneraciones — intento 1 falló por texto ilegible en pantalla de tablet simulada, intento 2 falló por estética neón/wireframe brillante (grid azul cian con puntos de luz tipo synthwave); intento 3 (foreman en obra al atardecer, sin pantallas) pasó los 3 criterios.
- nota de red: preflight 4.0 OK (`api.cloudflare.com` y `www.lx3.ai` respondieron 301). `WebFetch` (herramienta de sesión) devolvió 403 en múltiples dominios no relacionados entre sí (incluido `anthropic.com`), indicando una falla puntual de esa herramienta en esta corrida, no un bloqueo de dominio específico — las fuentes citadas se verificaron con `WebSearch` en su lugar.

## Estacionales

- Ninguno dentro de ventana el 2026-07-17. Próxima ventana: planificación y presupuesto 2027 (publicar octubre-noviembre 2026).

## Descartados

_(vacío)_
