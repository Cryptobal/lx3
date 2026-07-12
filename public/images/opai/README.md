# Capturas reales de OPAI

Coloca aquí las capturas reales del producto (formato **WebP**) y luego
descomenta los `src` correspondientes en `components/sections/Showcase.tsx`.

Archivos esperados:

- `opai-dashboard.webp` — dashboard principal
- `opai-cotizador-ia.webp` — el CPQ generando una propuesta con IA
- `opai-scheduling.webp` — turnos de 500+ guardias
- `opai-rondas-gps.webp` — rondas en tiempo real (GPS)

Recomendado: relación de aspecto ~16:10, ancho ≥ 1600px, exportadas en WebP
con calidad ~85. El componente ya usa `next/image` con `loading="lazy"`,
`quality={85}`, `sizes` responsive y `alt` descriptivo con keyword.
