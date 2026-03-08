# Imagen base con Node.js 20 (incluye corepack para pnpm)
FROM node:20-bookworm-slim

# Instalar pnpm via corepack (incluido en Node 20+)
RUN corepack enable && corepack prepare pnpm@9 --activate

# Verificar instalación
RUN pnpm --version
