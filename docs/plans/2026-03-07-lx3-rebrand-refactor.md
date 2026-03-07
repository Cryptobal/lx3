# LX3 Software Studio - Complete Rebrand & Refactoring Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Rebuild lx3.ai from "AI Factory" to "Software Studio" with world-class design, full SEO, working contact form, WhatsApp integration, blog system, and analytics.

**Architecture:** Next.js 16 App Router with `[locale]` routing (next-intl), dark-first theme, Space Grotesk + Plus Jakarta Sans typography, Framer Motion animations. Keep existing chatbot backend (API routes + lead scoring) but rebrand system prompt. All content in Spanish (es-CL primary).

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Framer Motion, next-intl, Resend, Vercel AI SDK, @vercel/analytics

---

## Task 1: Install Dependencies & Update Configs

**Files:**
- Modify: `package.json`
- Modify: `next.config.ts`
- Modify: `tsconfig.json`

**Step 1:** Install new dependencies
```bash
pnpm add framer-motion @vercel/analytics
```

**Step 2:** Update next.config.ts with security headers

**Step 3:** Verify build works with `pnpm build`

---

## Task 2: Design System & Typography

**Files:**
- Modify: `app/globals.css` (new color palette, grain texture, gradients)
- Modify: `app/[locale]/layout.tsx` (new fonts: Space Grotesk + Plus Jakarta Sans)

New color palette (dark-first):
- Background: #050505 (deep black)
- Surface: #0A0A0A
- Surface elevated: #141414
- Accent: #06B6D4 (cyan-500) with gradient to #3B82F6 (blue-500)
- Foreground: #FAFAFA
- Muted: #71717A

---

## Task 3: Update Routing & i18n

**Files:**
- Modify: `lib/i18n/routing.ts` (new pathnames)
- Modify: `messages/es.json` (full rewrite - Software Studio copy)
- Modify: `messages/en.json` (full rewrite)

New routes:
- `/servicios` → Services overview
- `/servicios/aplicaciones-internas` → Internal apps
- `/servicios/automatizacion-ia` → AI automation
- `/servicios/sitios-web` → Websites
- `/servicios/consultoria` → Consulting
- `/casos` → Case studies
- `/casos/opai-gard-security` → OPAI case
- `/casos/gard-sitio-web` → Gard website case
- `/blog` → Blog listing
- `/blog/[slug]` → Blog article
- `/sobre-nosotros` → About
- `/contacto` → Contact

---

## Task 4: Layout Components (Header + Footer)

**Files:**
- Modify: `components/layout/Header.tsx`
- Modify: `components/layout/Footer.tsx`
- Modify: `components/layout/Navigation.tsx`
- Remove: `components/layout/DarkModeToggle.tsx` (dark-only theme)
- Remove: `components/layout/ThemeProvider.tsx`

Header: dark bg, LX3 logo, nav links to new pages, CTA button
Footer: 4-column grid, links, social, WhatsApp, Santiago Chile, copyright

---

## Task 5: Shared Components

**Files:**
- Modify: `components/shared/CTAButton.tsx`
- Modify: `components/shared/SectionWrapper.tsx`
- Modify: `components/shared/AnimateOnScroll.tsx` (use Framer Motion)
- Create: `components/shared/JsonLd.tsx`
- Create: `components/shared/WhatsAppButton.tsx`

---

## Task 6: Homepage - All Sections

**Files:**
- Modify: `app/[locale]/page.tsx`
- Rewrite: `components/sections/Hero.tsx` (gradient bg, stagger animation)
- Rewrite: `components/sections/` (all section components for new content)

Sections: Hero, Social Proof, Services Cards, OPAI Showcase, How We Work, Tech Stack, Blog Preview, Final CTA

---

## Task 7: Service Pages

**Files:**
- Create: `app/[locale]/servicios/page.tsx`
- Create: `app/[locale]/servicios/aplicaciones-internas/page.tsx`
- Create: `app/[locale]/servicios/automatizacion-ia/page.tsx`
- Create: `app/[locale]/servicios/sitios-web/page.tsx`
- Create: `app/[locale]/servicios/consultoria/page.tsx`

Each with generateMetadata, JSON-LD ServiceSchema, content sections

---

## Task 8: Case Study Pages

**Files:**
- Create: `app/[locale]/casos/page.tsx`
- Create: `app/[locale]/casos/opai-gard-security/page.tsx`
- Create: `app/[locale]/casos/gard-sitio-web/page.tsx`

---

## Task 9: About & Contact Pages

**Files:**
- Rewrite: `app/[locale]/nosotros/page.tsx` → move to `sobre-nosotros`
- Rewrite: `app/[locale]/contacto/page.tsx` (working Resend form)

---

## Task 10: Blog System

**Files:**
- Create: `content/blog/` directory with article files
- Create: `app/[locale]/blog/page.tsx`
- Create: `app/[locale]/blog/[slug]/page.tsx`

---

## Task 11: Chatbot Rebrand

**Files:**
- Modify: `lib/chatbot/system-prompt.ts` (AI Factory → LX3 Software Studio)
- Modify: `lib/email.ts` (update branding)
- Modify: `components/chatbot/ChatWindow.tsx` (update header text)

---

## Task 12: SEO Infrastructure

**Files:**
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`
- Add JSON-LD to all pages (Organization, Service, Article schemas)
- Add OG metadata to all pages

---

## Task 13: Analytics & Final Polish

**Files:**
- Modify: `app/[locale]/layout.tsx` (add Vercel Analytics + GA4)
- Run lighthouse audit
- Final cleanup of unused files

---

## Execution Order

1. Tasks 1-2 (foundation) - sequential
2. Tasks 3-5 (routing, i18n, shared components) - sequential
3. Tasks 6-10 (pages) - can parallelize
4. Tasks 11-13 (infrastructure) - sequential after pages
