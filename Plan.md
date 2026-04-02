# Market Intelligence SaaS Portal — Development Plan

> **Stack**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui + Framer Motion + Recharts + Zustand
> **Backend**: Existing Go + Fiber v2 API at `healthcare-market-research-backend/` (PostgreSQL + GORM, Redis, Cloudflare R2, Stripe + PayPal, SMTP email)
> **This portal is frontend-only** — it consumes the existing backend API. No new backend code unless an endpoint gap is identified.

---

## Overview

This plan follows a **3-phase progression**: Static Frontend → API-Connected Frontend → Full SaaS Polish. Each phase builds directly on the previous one, keeping the app shippable at every stage.

> **Key difference from original plan:** Phases 3 (Backend Integration) and parts of Phase 4 (Payments, Email, File Handling) are **already done** via the existing Go backend. The plan focuses entirely on the frontend + API wiring.

---

## Phase 1 — Static Frontend Shell

> Goal: Pixel-perfect UI with hardcoded data. No API calls yet.

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

## Phase 2 — API-Connected Frontend

> Goal: Wire up the existing Go backend API. Replace all static/mock data with real API calls.

### 2.1 API Client Layer
- [ ] `lib/api/client.ts` — Base fetch/axios wrapper
  - Base URL: `process.env.NEXT_PUBLIC_API_URL` (default `http://localhost:8081/api/v1`)
  - Auto-attach `Authorization: Bearer <token>` header
  - Auto-refresh token on 401 via `POST /api/v1/auth/refresh`
  - Error normalization (map backend errors to consistent shape)
- [ ] `lib/api/auth.ts` — `login()`, `refresh()`, `logout()`, `getMe()`
- [ ] `lib/api/reports.ts` — `getReports(filters)`, `getReportBySlug(slug)`, `searchReports(q)`
- [ ] `lib/api/categories.ts` — `getCategories()`, `getCategoryBySlug(slug)`, `getCategoryReports(slug)`
- [ ] `lib/api/blogs.ts` — `getBlogs(filters)`, `getBlogBySlug(slug)`
- [ ] `lib/api/press-releases.ts` — `getPressReleases(filters)`, `getPressReleaseBySlug(slug)`
- [ ] `lib/api/forms.ts` — `submitForm(data)`
- [ ] `lib/api/orders.ts` — `createOrder(data)`, `capturePayPalOrder(id)`, `captureStripeOrder(id)`
- [ ] `lib/api/authors.ts` — `getAuthors()`, `getAuthorById(id)`
- [ ] `types/api.ts` — TypeScript interfaces matching backend response shapes (Report, Category, User, Order, Blog, PressRelease, FormSubmission, Author)

### 2.2 Authentication Flow
- [ ] `store/auth-store.ts` — Zustand store for auth state (user, tokens, isAuthenticated)
  - Persist refresh token to httpOnly cookie or secure localStorage
  - Auto-refresh logic on app mount
- [ ] `/login` page → calls `POST /api/v1/auth/login` → stores tokens → redirects to dashboard
- [ ] `/register` page → calls backend register endpoint (if available) or shows "Contact admin" message
- [ ] Auth middleware (client-side): `hooks/useAuth.ts` — redirects unauthenticated users from protected routes
- [ ] User avatar dropdown populated from `GET /api/v1/users/me`

### 2.3 Zustand Stores (Client State)
- [ ] `store/ui-store.ts` — sidebar collapsed state, active tab, modals open/close
- [ ] `store/search-store.ts` — search query, active filters, results
- [ ] `store/user-store.ts` — authenticated user + plan tier (from auth-store or mock for MVP)
- [ ] `store/bookmarks-store.ts` — bookmarked report slugs (localStorage persisted)
- [ ] `store/recent-visits-store.ts` — recently visited report slugs + timestamps (localStorage persisted)

### 2.4 Home Page → API
- [ ] Recent Publications: fetch `GET /api/v1/reports?sort=newest&limit=4&status=published`
- [ ] Industries sidebar: fetch `GET /api/v1/categories`
- [ ] Search bar: navigates to `/search?q=...`

### 2.5 Industries Page → API
- [ ] Fetch `GET /api/v1/categories` → group alphabetically
- [ ] Each category's reports: fetch `GET /api/v1/categories/:slug/reports` (lazy on expand or pre-fetched)
- [ ] Sub-industry links → `/search?category=slug`

### 2.6 Search Page → API
- [ ] Search query: `GET /api/v1/search?q=...`
- [ ] Category filter: `GET /api/v1/reports?category_slug=...`
- [ ] Real-time filter updates via URL params + SWR/React Query caching
- [ ] Counts per filter computed from response metadata

### 2.7 Market Outlook Page → API
- [ ] Fetch `GET /api/v1/reports/:slug` on page load
- [ ] Map `report.market_metrics` → KPI cards (revenue, forecast, CAGR)
- [ ] Map `report.market_metrics` → generate bar chart data (interpolate yearly values between current and forecast)
- [ ] Map `report.key_players` → Companies tab table
- [ ] Map `report.sections.tableOfContents` → Scope tab
- [ ] Map `report.sections.marketDetails` → Overview text + highlights
- [ ] Map `report.faqs` → FAQ accordion
- [ ] Map `report.geography` → region chips + "Report Coverage" card
- [ ] Related markets: `GET /api/v1/categories/:slug/reports` (same category, exclude current)
- [ ] Request Customization form: `POST /api/v1/forms/submissions` with category "request-customization"

### 2.8 Companies Pages → Data
- [ ] Aggregate `key_players` from all reports (client-side or dedicated endpoint if needed)
- [ ] `/companies` — display aggregated list with search/filter
- [ ] `/companies/[slug]` — find company across reports, show linked reports

### 2.9 Insights Pages → API
- [ ] White Papers: `GET /api/v1/blogs?status=published`
- [ ] Thought Leadership: `GET /api/v1/press-releases?status=published`

### 2.10 Checkout Flow → API
- [ ] `/checkout/[reportSlug]` — fetch report for pricing, show order form
- [ ] PayPal flow: `POST /api/v1/orders` (payment_method=paypal) → PayPal JS SDK → `POST /api/v1/orders/:id/capture`
- [ ] Stripe flow: `POST /api/v1/orders` (payment_method=stripe) → Stripe Elements → `POST /api/v1/orders/:id/stripe-capture`
- [ ] `/order-success` — confirmation page

### 2.11 Contact & Forms → API
- [ ] `/contact` page form → `POST /api/v1/forms/submissions` (category: "contact")
- [ ] Request Sample forms → `POST /api/v1/forms/submissions` (category: "request-sample")
- [ ] Analyst Callback → `POST /api/v1/forms/submissions` (category: "schedule-demo")

### 2.12 Profile Page → API
- [ ] Profile tab: `GET /api/v1/users/me` → display, allow edits (if PUT /users/:id available for self-update)
- [ ] Password tab: password change (if endpoint available)
- [ ] Subscription tab: show current plan (mock for MVP, real when backend supports plans)

### 2.13 Bookmarks & Recent Visits (Client-Side)
- [ ] Star/bookmark icon on market pages toggles in `bookmarks-store` (localStorage)
- [ ] Recent visits tracked in `recent-visits-store` (localStorage)
- [ ] `/my-reports` reads from stores
- [ ] Persisted via zustand/persist

### 2.14 Plan Gating (Mock for MVP)
- [ ] Dev toolbar (dev-only): plan switcher to toggle FREE/BASIC/PREMIUM/ENTERPRISE
- [ ] `PlanGate` renders blur + upgrade overlay based on store plan
- [ ] Statistics tab blurs rows beyond tier limit
- [ ] Dashboard tab shows upgrade modal for FREE tier

### 2.15 Navigation & Interactions
- [ ] Mega-menu dropdowns populated from `GET /api/v1/categories`
- [ ] Industries sidebar sub-menu expanded/collapsed via Zustand
- [ ] Sidebar collapse state persisted to localStorage
- [ ] Search input in TopNav triggers navigation to `/search?q=...`

### 2.16 Loading & Error States
- [ ] Loading skeletons for all data-fetching pages
- [ ] Error boundaries + empty states connected to real 404s
- [ ] Toast notifications for form submissions (success/error)
- [ ] Optimistic UI for bookmark/unbookmark

---

## Phase 3 — Full SaaS Polish & Enhancements

> Goal: Premium features, dark mode, advanced viz, performance hardening.

### 3.1 Dark Mode
- [ ] Install `next-themes`, wrap app in `ThemeProvider`
- [ ] All CSS variables duplicated for `dark:` variants
- [ ] Toggle button in TopNav (sun/moon icon)
- [ ] Charts use theme-aware colors

### 3.2 Interactive World Map
- [ ] Install `react-simple-maps` or D3 choropleth
- [ ] On Overview tab: SVG world map shaded by market size per country (from `report.geography`)
- [ ] Click country → filter chart + stats to that country
- [ ] Color scale legend below map

### 3.3 Comparison Mode
- [ ] "Compare Markets" floating button on outlook pages
- [ ] Select 2 markets → `/compare?a=slug1&b=slug2`
- [ ] Side-by-side KPI cards + overlaid bar charts (Recharts ComposedChart)
- [ ] Export comparison as PNG

### 3.4 Notification System
- [ ] Client-side notification store (poll backend periodically or check on page load)
- [ ] Bell icon in TopNav with unread count badge
- [ ] Notification dropdown panel
- [ ] Track new reports in bookmarked categories

### 3.5 Advanced Chart Toolbar
- [ ] Chart type switcher: Bar → Line → Area → Pie with Framer Motion transition
- [ ] Each chart type persisted per-market in localStorage
- [ ] Download: PNG (html2canvas), CSV (manual stringify), XLS (SheetJS)

### 3.6 Export to PowerPoint (Premium)
- [ ] Install `pptxgenjs`
- [ ] Client-side .pptx generation with chart image + market summary
- [ ] "Export to PowerPoint" button on Overview tab (PlanGate: Premium+)

### 3.7 PWA Support
- [ ] `next-pwa` plugin configuration
- [ ] `public/manifest.json` with icons
- [ ] Service worker: cache recently viewed market pages
- [ ] Install prompt on mobile

### 3.8 Onboarding Tour
- [ ] Install `driver.js`
- [ ] First-visit flag in localStorage
- [ ] Tour steps: Sidebar → Search → Market page → Prism AI → Upgrade
- [ ] Dismissible, re-launchable from Profile page

### 3.9 Personalized Home Feed
- [ ] Track recent visit category distribution in localStorage
- [ ] Home page (authenticated): top 4 cards = reports from most-visited categories
- [ ] "Recommended for you" section replaces static Recent Publications

### 3.10 Performance
- [ ] All heavy pages use React Suspense + streaming
- [ ] Images: `next/image` with proper `sizes`, WebP
- [ ] Bundle analysis: `@next/bundle-analyzer`
- [ ] Recharts lazy-loaded (dynamic import)
- [ ] Static generation for market/company pages with ISR (revalidate: 3600)

### 3.11 SEO
- [ ] Dynamic `<head>` metadata from report's `meta_title`, `meta_description`, `meta_keywords`
- [ ] Open Graph + Twitter Card tags per report page
- [ ] Sitemap generation from `GET /api/v1/sitemap/reports`, `/blogs`, `/press-releases`
- [ ] `robots.txt`

### 3.12 Security
- [ ] Rate limiting on form submissions (client-side cooldown)
- [ ] Input sanitization on all form fields
- [ ] CSP headers in `next.config.ts`
- [ ] CORS: only allow backend origin

### 3.13 Testing
- [ ] Unit tests: `vitest` + `@testing-library/react` for UI components
- [ ] Integration tests: API client functions with MSW (Mock Service Worker)
- [ ] E2E tests: `Playwright` — auth flow, search, gated content, checkout

### 3.14 Deployment
- [ ] Vercel deployment with env vars (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_PAYPAL_CLIENT_ID`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`)
- [ ] Domain + SSL
- [ ] CI/CD: GitHub Actions (lint → test → deploy on merge to main)

---

## Phase 4 — Backend Extensions (Only If Needed)

> Goal: Add endpoints to the existing Go backend only when an analytics portal feature requires data not currently available.

### 4.1 Potential New Endpoints
- [ ] `GET /api/v1/reports/:slug/related` — Related reports in same category (could be done client-side)
- [ ] `GET /api/v1/companies` — Dedicated companies endpoint (currently key_players is embedded in reports)
- [ ] `PATCH /api/v1/users/me` — Self-update profile (currently only admin can update users)
- [ ] `PATCH /api/v1/users/me/password` — Self-service password change
- [ ] `GET /api/v1/users/me/orders` — User's own order history
- [ ] Subscription/Plan model on User (for real plan gating beyond mock)

### 4.2 Potential Schema Changes
- [ ] Add `plan` field to User model (FREE/BASIC/PREMIUM/ENTERPRISE) — needed for real plan gating
- [ ] Add `Company` model as first-class entity (currently key_players is denormalized in reports)
- [ ] Add `Bookmark` / `RecentVisit` models if server-side persistence is desired (currently localStorage)

---

## File Creation Order (Critical Path)

```
Phase 1 (Foundation) — DONE:
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

Phase 2 (API Wiring):
16. lib/api/client.ts                ← API wrapper with auth + refresh
17. lib/api/auth.ts                  ← Auth functions
18. lib/api/reports.ts               ← Report API functions
19. lib/api/categories.ts            ← Category API functions
20. lib/api/forms.ts                 ← Form submission functions
21. lib/api/orders.ts                ← Order/checkout functions
22. types/api.ts                     ← TypeScript interfaces
23. store/auth-store.ts              ← Auth state management
24. store/bookmarks-store.ts         ← Client-side bookmarks
25. hooks/useAuth.ts                 ← Auth hook + route protection
26. Wire all pages to use API data instead of static/mock data

Phase 3 (Polish):
27. Dark mode theming
28. Interactive world map
29. Chart toolbar enhancements
30. PWA + onboarding tour
31. SEO + sitemap
32. Testing + deployment
```

---

## Dependency Installation Summary

```bash
# Phase 1 (already done)
npm install framer-motion recharts lucide-react next-themes
npx shadcn@latest init
npx shadcn@latest add button card badge input tabs dialog dropdown-menu

# Phase 2
npm install zustand
npm install axios  # or use native fetch
npm install @stripe/stripe-js  # Stripe Elements for checkout
# PayPal JS SDK loaded via <script> tag

# Phase 3
npm install react-simple-maps d3-scale  # World map
npm install pptxgenjs                   # PowerPoint export
npm install html2canvas xlsx            # Chart export
npm install next-pwa                    # PWA
npm install driver.js                   # Onboarding tour

# Testing
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D msw  # Mock Service Worker for API testing
npm install -D @playwright/test
```

---

## Key Design Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Backend | Existing Go + Fiber v2 | Already built, fully functional, deployed |
| Rendering strategy | Server Components + selective Client Components | Performance; charts/interactivity require client |
| Data fetching | `fetch` in Server Components, SWR/axios in Client Components | Server-side for SEO pages, client-side for interactive |
| State management | Zustand (minimal) | No Redux overhead; only UI state + bookmarks |
| Auth | JWT tokens from Go backend | Backend already implements JWT auth with refresh |
| Payments | Stripe + PayPal via Go backend | Backend already handles order creation, capture, webhooks |
| Email | Go backend SMTP (gomail) | Backend handles all transactional email |
| File storage | Cloudflare R2 via Go backend | Backend handles R2 uploads/signed URLs |
| Charts | Recharts primary, D3 for world map | Recharts is React-native; D3 for custom geo viz |
| Bookmarks/Visits | Client-side localStorage | No backend endpoint yet; upgrade to server-side later |
| Plan gating | Mock client-side for MVP | Real plan field on User model to be added to backend later |
