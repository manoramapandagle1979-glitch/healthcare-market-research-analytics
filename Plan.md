# Market Intelligence SaaS Portal — Development Plan

> **Stack**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui + Framer Motion + Recharts + Prisma + PostgreSQL (Supabase) + NextAuth.js + Stripe

---

## Overview

This plan follows a **4-phase progression**: Static Frontend → Dynamic Frontend → Backend Integration → Full-Stack SaaS. Each phase builds directly on the previous one, keeping the app shippable at every stage.

---

## Phase 1 — Static Frontend Shell

> Goal: Pixel-perfect UI with hardcoded data. No backend, no auth, no DB.

### 1.1 Project Bootstrap
- [x] `npx create-next-app@14 . --typescript --tailwind --app`
- [x] Install core deps: `shadcn/ui`, `framer-motion`, `recharts`, `lucide-react`, `next-themes`
- [x] Configure `tailwind.config.ts` with design tokens (colors, fonts from RawData.md design system)
- [x] Set up `@/` path aliases, `globals.css` with CSS variables
- [x] Add Google Fonts: Inter + Sora via `next/font`

### 1.2 Design System & Components
- [x] `components/ui/` — extend shadcn base components with brand tokens
- [x] Define CSS variables: `--brand-primary`, `--brand-secondary`, `--brand-accent`, gradients
- [x] `components/ui/PlanGate.tsx` — locked content overlay (lock icon + upgrade CTA)
- [x] `components/ui/PricingCard.tsx` — plan card with feature checklist
- [x] `components/ui/StatCounter.tsx` — animated countUp number on scroll
- [x] `components/ui/Badge.tsx` — Report / Statistics / Databook type badge
- [x] `components/ui/TagChip.tsx` — rounded-full filter/tag chips

### 1.3 Layout Shell
- [x] `components/layout/TopNav.tsx`
  - Logo + brand name
  - Search input (static)
  - Statistics / Reports / Services mega-menu dropdowns (static links)
  - Upgrade Plan CTA button
  - User avatar dropdown (static)
- [x] `components/layout/Sidebar.tsx`
  - Expandable/collapsible (160px ↔ 56px icon-only)
  - Spring animation on width toggle
  - Expandable sub-sections: Industries, Companies, Services, Insights
  - Active state: left border + purple background
  - Persistent toggle button at bottom-left
- [x] `app/(dashboard)/layout.tsx` — wraps TopNav + Sidebar, content area

### 1.4 Home Page (`/`)
- [x] **Hero Section**
  - Animated deep navy → teal gradient background (Framer Motion)
  - Heading, sub-copy, AI toggle pills (Search / Prism AI)
  - Search bar with teal CTA
  - Popular industry chips (Biotechnology, Clinical Diagnostics, Consumer Goods, Polymers & Resins, Technology)
- [x] **Trust Bar** — CSS marquee infinite scroll with static partner logos
- [x] **Recent Publications** — 2×2 card grid with static market data
- [x] **Service Tabs** — 5 pill tabs (Databooks, Pipeline, Signal, Brainshare, Astra) with description + chart illustration per tab
- [x] **Pricing Preview** — 4-column cards on dark gradient (Free/Basic/Premium/Enterprise), Premium elevated with glow border
- [x] **Stats Counter** — 4 countUp numbers triggered on scroll (IntersectionObserver)
- [x] **Testimonials Slider** — 3-card auto-rotate (5s), pause on hover, dot indicators
- [x] **Explore Banner** — Full-width dark overlay with dashboard screenshot + CTA
- [x] **Footer** — Links + copyright

### 1.5 All Industries Page (`/industries`)
- [x] Top search bar + "Select Industry" jump dropdown
- [x] Alphabetically grouped full-width table (Industry → sub-industry links)
- [x] All 23+ industries from spec with placeholder sub-industry links
- [x] Sticky jump dropdown anchoring to sections

### 1.6 Search Results Page (`/search`)
- [x] Two-panel layout: left filters + right results
- [x] Left: TYPE / INDUSTRY / SUB INDUSTRY / SEGMENTS checkboxes (static, visual only)
- [x] Right: result cards with Badge, title, segment descriptor, 3 quick links
- [x] Static empty state component with illustration
- [x] URL param reading (`?q=`, `?subindustry=`, `?type=`) — filter visually from static data

### 1.7 Market Outlook Page (`/outlook/[slug]/[region]`)
- [x] **Header**: title, "PDF Report Available" badge, description, collapsible Data Tree
- [x] **Sticky secondary tab bar**: Overview | Dashboard | Statistics | Reports | Scope | Companies | Request Customization
- [x] **Tab 1 — Overview**
  - 3 KPI cards (Revenue, Forecast, CAGR) + Report Coverage card
  - Interactive bar chart (Recharts) with staggered entrance animation
  - Chart toolbar (expand, share, embed, copy, bookmark, print, download dropdown)
  - Filter by country dropdown (static)
  - Market Highlights bullets + global databook summary table
  - Market Scope segmentation grid
  - Market Companies preview table (8-10 static rows)
  - Market Outlook editorial text
  - Right sidebar: Related Markets links, "Horizon in a Snapshot" widget, client logo grid
- [x] **Tab 2 — Dashboard** (Premium gate overlay for free tier)
  - Segment filter pills, region/country/year dropdowns
  - Dynamic chart type switching (Bar / Pie / Line) — all with static data
- [x] **Tab 3 — Statistics** (partial blur on locked rows)
  - 3 filter dropdowns, Tables/Charts toggle, Export button
  - Data table with blurred lower rows + "Unlock Premium" overlay
- [x] **Tab 4 — Reports** (locked items with lock icon)
  - Report list with Buy Now / Talk to Analyst CTAs
- [x] **Tab 5 — Scope**: hierarchical segment tree
- [x] **Tab 6 — Companies**: table view
- [x] **Tab 7 — Request Customization**: static form

### 1.8 Companies Pages
- [x] `/companies` — filter row (search, sector, industry, sort), results table with color-coded status badges, pagination UI
- [x] `/companies/[slug]` — Overview / News tabs, metadata grid, tag chips, right sidebar with market report links

### 1.9 Insights Pages
- [x] `/insights/white-papers` — 3-column card grid with editorial images + locked overlay
- [x] `/insights/thought-leadership` — same layout

### 1.10 Services Pages
- [x] `/services/pipeline` — hero with animated circular wheel SVG diagram, "Markets We Cover" grid
- [x] `/services/signal`, `/services/brainshare`, `/services/astra` — hero + features + CTA pattern

### 1.11 Pricing Page (`/pricing`)
- [x] Full dark gradient layout
- [x] 4 pricing cards with feature checklists, Premium elevated + glow
- [x] Custom Pricing CTA section
- [x] Stats row + Testimonials reused from Home

### 1.12 Auth Pages (Static UI only)
- [x] `/login` — email/password + Google OAuth button (static)
- [x] `/register` — registration form (static)
- [x] `/forgot-password` — email reset form (static)

### 1.13 Profile Page (`/profile`)
- [x] 5-tab nav: Profile | Password | Subscription | Payments/Invoices | Invite Colleagues
- [x] All tabs rendered with static/placeholder data

### 1.14 My Reports Page (`/my-reports`)
- [x] 3-tab nav: Recent Visited | My Reports | My Downloads
- [x] Static list items with badges, timestamps, quick links
- [x] Empty state illustration for My Reports/Downloads

---

## Phase 2 — Static → Dynamic Frontend (Mock API + State)

> Goal: Wire up interactive state, routing, and mock data layer. Still no real backend.

### 2.1 Static Data Layer
- [x] `lib/mock-data/markets.ts` — array of 20+ market objects matching Prisma schema shape
- [x] `lib/mock-data/companies.ts` — 50+ company objects
- [x] `lib/mock-data/industries.ts` — all 23 industries with sub-categories
- [x] `lib/mock-data/market-data-points.ts` — yearly revenue data (2018–2030) per market
- [x] `types/index.ts` — TypeScript interfaces: `Market`, `Company`, `MarketDataPoint`, `User`, `Plan`

### 2.2 Zustand Store Setup
- [x] `store/ui-store.ts` — sidebar collapsed state, active tab, modals open/close
- [x] `store/search-store.ts` — search query, active filters, results
- [x] `store/user-store.ts` — mock user object with plan tier (FREE/BASIC/PREMIUM/ENTERPRISE)
- [x] `store/bookmarks-store.ts` — bookmarked market IDs (localStorage persisted)

### 2.3 Interactive Search
- [x] Search bar debounce (300ms) filtering against mock data
- [x] URL sync: push `?q=`, `?type=`, `?subindustry=` params on filter change
- [x] Left panel filter checkboxes update results reactively
- [x] Counts next to each filter option computed from filtered results

### 2.4 Dynamic Market Pages
- [x] `app/(dashboard)/outlook/[slug]/[region]/page.tsx` — reads slug, finds market in mock data
- [x] Chart data computed from `marketDataPoints` for that market
- [x] KPI cards populated from market object
- [x] Segment filter pills on Dashboard tab switch chart data
- [x] `PlanGate` component reads from `user-store` plan tier, shows/hides locked content

### 2.5 Dynamic Company Pages
- [x] `/companies` filter/sort working against mock companies array
- [x] `/companies/[slug]` reads slug, renders full profile from mock data
- [x] Pagination: client-side slice of array

### 2.6 Navigation Interactions
- [x] Mega-menu dropdowns populated from `industries` mock data
- [x] Industries sidebar sub-menu expanded/collapsed via Zustand
- [x] Sidebar collapse state persisted to localStorage
- [x] Search input in TopNav triggers navigation to `/search?q=...`

### 2.7 Bookmarks & Recent Visits (Client-Side)
- [x] Star/bookmark icon on market pages toggles in `bookmarks-store`
- [x] `/my-reports` reads from store: Recent Visited, My Reports (bookmarks), My Downloads (empty)
- [x] Store persisted to localStorage via zustand/persist

### 2.8 Plan Gating (Mock)
- [x] Dev toolbar (dev-only): plan switcher to toggle FREE/BASIC/PREMIUM/ENTERPRISE
- [x] `PlanGate` renders blur + upgrade overlay based on store plan
- [x] Statistics tab blurs rows beyond tier limit
- [x] Dashboard tab shows upgrade modal for FREE tier
- [x] Prism AI query counter tracked in store (3/month limit for FREE)

---

## Phase 3 — Backend Integration

> Goal: Replace mock data with real database, add real auth, real API routes.

### 3.1 Database Setup
- [ ] Create Supabase project (PostgreSQL)
- [ ] Add `.env.local`: `DATABASE_URL`, `DIRECT_URL`
- [ ] `prisma/schema.prisma` — full schema from RawData.md spec:
  - `User`, `Plan` enum, `Market`, `MarketDataPoint`, `Company`, `Bookmark`, `RecentVisit`
  - Add: `Segment`, `Report`, `Insight`, `Invoice` models
- [ ] `npx prisma migrate dev --name init`
- [ ] `lib/prisma.ts` — singleton PrismaClient

### 3.2 Database Seeding
- [ ] `prisma/seed.ts` — seed script importing from Phase 2 mock data
  - 20+ markets with full data points (2018–2030)
  - 50+ companies
  - All industry/sub-industry mappings
- [ ] `npx prisma db seed`

### 3.3 Authentication
- [ ] Install `next-auth`, configure `lib/auth.ts`
  - CredentialsProvider (email + bcrypt password)
  - GoogleProvider (OAuth)
  - PrismaAdapter
- [ ] `app/api/auth/[...nextauth]/route.ts`
- [ ] `middleware.ts` — protect all `/(dashboard)/*` routes, redirect to `/login`
- [ ] Session type augmentation: add `plan`, `id` to session User
- [ ] Register endpoint: `app/api/auth/register/route.ts` — hash password, create User
- [ ] `/login`, `/register`, `/forgot-password` wired to NextAuth

### 3.4 Core API Routes
- [ ] `app/api/markets/route.ts` — GET (list with filters: industry, subindustry, q, type)
- [ ] `app/api/markets/[slug]/route.ts` — GET single market with data points + companies + segments
- [ ] `app/api/markets/[slug]/data-points/route.ts` — GET filtered by region/segment/year
- [ ] `app/api/companies/route.ts` — GET (list with filters: sector, industry, q, sort)
- [ ] `app/api/companies/[slug]/route.ts` — GET single company profile
- [ ] `app/api/industries/route.ts` — GET all industries with sub-industry counts
- [ ] `app/api/search/route.ts` — unified search across markets + companies + reports

### 3.5 User Data API Routes
- [ ] `app/api/bookmarks/route.ts` — GET list, POST add, DELETE remove (auth required)
- [ ] `app/api/recent-visits/route.ts` — POST log visit, GET recent list (auth required)
- [ ] `app/api/profile/route.ts` — GET + PATCH user profile fields (auth required)
- [ ] `app/api/profile/password/route.ts` — PATCH password update (auth required)

### 3.6 Frontend → API Wiring
- [ ] Replace Zustand mock data with `fetch`/`SWR` calls to API routes
- [ ] Install `swr` for data fetching with caching
- [ ] `hooks/useMarket.ts`, `hooks/useCompanies.ts`, `hooks/useSearch.ts`
- [ ] Server Components where possible (market overview, companies list)
- [ ] Client Components for interactive tabs, charts, filters
- [ ] Loading skeletons for all data-fetching states
- [ ] Error boundaries + empty states connected to real 404s

### 3.7 Plan Gating (Real)
- [ ] Session plan from DB drives `PlanGate` instead of mock store
- [ ] API routes enforce plan limits (e.g. statistics rows returned based on plan)
- [ ] Middleware checks plan tier for premium-only routes

---

## Phase 4 — Full-Stack SaaS Features

> Goal: Payments, AI, email, search, exports, and polish.

### 4.1 Stripe Payments
- [ ] Install `stripe`, create products + prices in Stripe dashboard
  - Free (no charge), Basic ($195/mo), Premium ($495/mo), Enterprise ($1,995/mo)
- [ ] `app/api/stripe/checkout/route.ts` — create Stripe Checkout session
- [ ] `app/api/stripe/webhook/route.ts` — handle `checkout.session.completed`, `customer.subscription.updated/deleted`
  - Update `User.plan` in DB on successful payment
- [ ] `/pricing` page "Buy Now" → Stripe Checkout redirect
- [ ] `/profile/subscription` tab shows current plan + Stripe customer portal link
- [ ] `app/api/invoices/route.ts` — fetch invoices from Stripe API → Payments tab

### 4.2 Search (Algolia or MeiliSearch)
- [ ] Option A: Algolia — configure indices for markets + companies, sync on DB write
- [ ] Option B: MeiliSearch self-hosted — index seeded from Prisma data
- [ ] `app/api/search/route.ts` proxies to search provider
- [ ] Instant search (300ms debounce) wired to provider SDK
- [ ] Search analytics: track popular queries

### 4.3 Email (Resend)
- [ ] Install `resend`, configure domain
- [ ] `lib/email.ts` — helper functions
- [ ] Welcome email on registration
- [ ] Password reset email (forgot password flow fully wired)
- [ ] Invite colleagues: send invite email with registration link
- [ ] Plan upgrade confirmation email

### 4.4 File Handling (AWS S3 / Cloudflare R2)
- [ ] Configure R2 bucket + credentials
- [ ] `app/api/reports/download/route.ts` — generate signed URL for PDF download
- [ ] Track downloads in DB (`Download` model, user + report + timestamp)
- [ ] `/my-reports/downloads` tab reads from DB download history

### 4.5 Dark Mode (Enhancement #2)
- [ ] Install `next-themes`, wrap app in `ThemeProvider`
- [ ] All CSS variables duplicated for `dark:` variants
- [ ] Toggle button in TopNav (sun/moon icon)
- [ ] Charts use theme-aware colors

### 4.6 Interactive World Map (Enhancement #3)
- [ ] Install `react-simple-maps` or D3 choropleth
- [ ] On Overview tab: SVG world map shaded by market size per country
- [ ] Click country → filter chart + stats to that country
- [ ] Color scale legend below map

### 4.7 Comparison Mode (Enhancement #4)
- [ ] "Compare Markets" floating button on outlook pages
- [ ] Select 2 markets → `/compare?a=slug1&b=slug2`
- [ ] Side-by-side KPI cards + overlaid bar charts (Recharts ComposedChart)
- [ ] Export comparison as PNG

### 4.8 Notification System (Enhancement #5)
- [ ] `Notification` model in Prisma (userId, type, message, read, createdAt)
- [ ] Background job: check for new markets in bookmarked industries, create notifications
- [ ] Bell icon in TopNav with unread count badge
- [ ] Notification dropdown panel

### 4.9 Advanced Chart Toolbar (Enhancement #8)
- [ ] Chart type switcher: Bar → Line → Area → Pie with Framer Motion transition
- [ ] Each chart type persisted per-market in localStorage
- [ ] Download: PNG (html2canvas), CSV (manual stringify), XLS (SheetJS)

### 4.10 Export to PowerPoint (Enhancement #10 — Premium)
- [ ] Install `pptxgenjs`
- [ ] `app/api/export/pptx/route.ts` — builds .pptx with chart image + market summary
- [ ] "Export to PowerPoint" button on Overview tab (PlanGate: Premium+)

### 4.11 PWA Support (Enhancement #7)
- [ ] `next-pwa` plugin configuration
- [ ] `public/manifest.json` with icons
- [ ] Service worker: cache recently viewed market pages
- [ ] Install prompt on mobile

### 4.12 Onboarding Tour (Enhancement #6)
- [ ] Install `driver.js`
- [ ] First-login flag in User record
- [ ] Tour steps: Sidebar → Search → Market page → Prism AI → Upgrade
- [ ] Dismissible, re-launchable from Profile page

### 4.13 Personalized Home Feed (Enhancement #9)
- [ ] Track `RecentVisit` industry distribution per user
- [ ] Home page (authenticated): top 4 cards = markets from most-visited industries
- [ ] "Recommended for you" section replaces static Recent Publications

---

## Phase 5 — Production Hardening

### 5.1 Performance
- [ ] All heavy pages use React Suspense + streaming
- [ ] Images: `next/image` with proper `sizes`, WebP
- [ ] Bundle analysis: `@next/bundle-analyzer`
- [ ] Recharts lazy-loaded (dynamic import)
- [ ] Static generation for market/company pages with ISR (revalidate: 3600)

### 5.2 Security
- [ ] Rate limiting on all API routes (`upstash/ratelimit`)
- [ ] Input validation: `zod` schemas on all API route inputs
- [ ] CSRF protection (NextAuth handles session cookies)
- [ ] Content Security Policy headers in `next.config.ts`
- [ ] Stripe webhook signature verification

### 5.3 Testing
- [ ] Unit tests: `vitest` + `@testing-library/react` for UI components
- [ ] Integration tests: API routes with `supertest`
- [ ] E2E tests: `Playwright` — auth flow, search, gated content, checkout

### 5.4 Observability
- [ ] Error tracking: Sentry
- [ ] Analytics: Vercel Analytics + custom event tracking
- [ ] Logging: structured logs on API routes

### 5.5 Deployment
- [ ] Vercel deployment with env vars
- [ ] Supabase connection pooling (PgBouncer)
- [ ] Stripe webhook endpoint registered
- [ ] Domain + SSL
- [ ] CI/CD: GitHub Actions (lint → test → deploy on merge to main)

---

## File Creation Order (Critical Path)

```
Phase 1 (Foundation):
1.  tailwind.config.ts + globals.css         ← Design tokens
2.  components/layout/Sidebar.tsx            ← Shell frame
3.  components/layout/TopNav.tsx             ← Shell frame
4.  app/(dashboard)/layout.tsx               ← Dashboard wrapper
5.  app/(dashboard)/page.tsx                 ← Home page
6.  components/ui/PricingCard.tsx            ← Reused in Home + /pricing
7.  components/ui/PlanGate.tsx               ← Reused across all gated content
8.  components/charts/BarChartCard.tsx       ← Reused in market pages
9.  app/(dashboard)/outlook/[slug]/[region]/page.tsx  ← Most complex page
10. app/(dashboard)/industries/page.tsx
11. app/(dashboard)/search/page.tsx
12. app/(dashboard)/companies/page.tsx
13. app/(dashboard)/companies/[slug]/page.tsx
14. app/(dashboard)/pricing/page.tsx
15. app/(auth)/login/page.tsx + register + forgot-password

Phase 3 (Backend):
16. prisma/schema.prisma
17. lib/prisma.ts
18. lib/auth.ts
19. middleware.ts
20. app/api/auth/[...nextauth]/route.ts
21. app/api/markets/route.ts + [slug]/route.ts
22. app/api/companies/route.ts + [slug]/route.ts
23. app/api/search/route.ts

Phase 4 (SaaS):
24. app/api/stripe/checkout/route.ts + webhook/route.ts
25. lib/email.ts + email templates
```

---

## Dependency Installation Summary

```bash
# Phase 1
npm install framer-motion recharts lucide-react next-themes
npx shadcn@latest init
npx shadcn@latest add button card badge input tabs dialog dropdown-menu

# Phase 2
npm install zustand

# Phase 3
npm install @prisma/client prisma next-auth @auth/prisma-adapter bcryptjs
npm install swr
npm install -D @types/bcryptjs

# Phase 4
npm install stripe @stripe/stripe-js
npm install resend
npm install @aws-sdk/client-s3  # or @cloudflare/workers-types for R2
npm install next-pwa
npm install driver.js
npm install pptxgenjs
npm install html2canvas xlsx
npm install react-simple-maps d3-scale
npm install @upstash/ratelimit @upstash/redis
npm install zod
npm install @sentry/nextjs

# Testing
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D @playwright/test
```

---

## Key Design Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Rendering strategy | Server Components + selective Client Components | Performance; charts/interactivity require client |
| State management | Zustand (minimal) | No Redux overhead; only UI state + user session cache |
| Data fetching | SWR for client, native fetch for server | SWR gives cache + revalidation for dynamic client views |
| Auth | NextAuth.js credentials + Google | Standard, works with Prisma adapter out of the box |
| Payments | Stripe | Industry standard; webhook-based plan sync |
| Search | MeiliSearch (self-hosted) | Cost-effective for initial launch; swap to Algolia if scale demands |
| Charts | Recharts primary, D3 for world map | Recharts is React-native; D3 for custom geo viz |
| File storage | Cloudflare R2 | S3-compatible, no egress fees |
