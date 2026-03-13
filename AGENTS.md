# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

LX3 (lx3.ai) is a bilingual (es/en) marketing website for a Chilean software studio built with **Next.js 16**, React 19, TypeScript, Tailwind CSS v4, and Framer Motion. It is a single-service app with no database, no Docker, and no microservices.

### Running the app

- `pnpm dev` starts the dev server on `http://localhost:3000`.
- The root URL (`/`) redirects (308 permanent) to `/es` (Spanish locale). Always test pages under `/es/...` or `/en/...`.
- No `.env` file is committed. The app runs fully without API keys; the chatbot (`/api/chat`) requires `LX3_ANTHROPIC_API_KEY` and the contact/leads endpoints require `RESEND_API_KEY`, but the UI renders and navigates without them.

### Lint / Build / Test

- **Lint:** `pnpm lint` (runs ESLint via flat config, `eslint.config.mjs`).
- **Build:** `pnpm build` (production build with Turbopack).
- **No test framework** is configured (no jest, vitest, or playwright). Manual testing via the browser is the primary verification method.

### Non-obvious caveats

- pnpm will warn about ignored build scripts for `@parcel/watcher` and `@swc/core`. This does not affect dev or build — Next.js uses its own bundled SWC binaries.
- The `pnpm-workspace.yaml` uses `ignoredBuiltDependencies` for `sharp` and `unrs-resolver`; do not remove those entries.
- Content (blog articles, case studies, services) is hardcoded in TypeScript files under `content/` and page components, not fetched from a CMS.
