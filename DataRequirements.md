# Curator Intelligence Analytics — Data Requirements & Flow Document

---

## 1. Application Overview

**Curator Intelligence Analytics** is a Next.js 15 (App Router) client-facing SaaS platform for browsing market research reports, company profiles, industry data, and analytics across 23+ industries. It connects to a Go/Fiber backend API and features user authentication, plan-gated content, bookmarks, orders, and interactive charts.

**Tech Stack**: Next.js 15, React 19, TypeScript, Tailwind CSS, Zustand (state), Recharts (charts), Axios (HTTP client)

**Backend**: Go + Fiber v2, PostgreSQL + GORM, Redis — base URL `http://localhost:8081/api/v1`

---

## 2. Architecture & Data Flow

```
┌────────────────────────────────────┐
│   ANALYTICS FRONTEND (Next.js)     │
│                                    │
│  ┌──────────┐    ┌──────────────┐  │
│  │ Zustand   │    │ API Client   │  │
│  │ Stores    │    │ (Axios)      │  │
│  │ (auth,    │    │              │  │
│  │  user,    │    │ Bearer token │  │
│  │  bookmarks│    │ + auto       │  │
│  │  search,  │    │   refresh    │  │
│  │  ui)      │    └──────┬───────┘  │
│  └──────────┘           │          │
│                         ▼          │
│         lib/mappers.ts             │
│   (ApiReport → Market,            │
│    ApiCategory → Industry,        │
│    KeyPlayer → Company,           │
│    ApiUser → User)                │
│                                    │
│  ┌────────────────────────────┐    │
│  │ lib/data.ts (STATIC)       │    │
│  │ lib/mock-data/ (STATIC)    │    │
│  │ (fallback data when API    │    │
│  │  is unavailable)           │    │
│  └────────────────────────────┘    │
└──────────────┬─────────────────────┘
               │ HTTP (REST)
               ▼
┌────────────────────────────────────┐
│   BACKEND (Go + Fiber)             │
│   /api/v1/*                        │
│                                    │
│   PostgreSQL + Redis               │
└────────────────────────────────────┘
```

### Data Flow Pattern

Every page follows a **"dynamic-first, static-fallback"** pattern:
1. Component mounts → calls backend API via `lib/api/*.ts`
2. Response is mapped via `lib/mappers.ts` from API types to frontend types
3. If API fails → falls back to hardcoded data from `lib/data.ts` or `lib/mock-data/`

---

## 3. Page-by-Page Data Breakdown

### 3.1 Home Page (`/`)

| Data Element | Source | Type | Details |
|---|---|---|---|
| Hero section text | Hardcoded in component | **STATIC** | Brand copy, tagline, service descriptions |
| Service tabs (5 tabs) | Hardcoded `serviceTabs` array | **STATIC** | Databooks, Pipeline, Signal, Brainshare, Astra descriptions + stats |
| Recent Publications (4 cards) | **API** → `GET /reports?status=published&sort=newest&limit=4` | **DYNAMIC** | Falls back to `defaultPublications` hardcoded array if API fails |
| Popular search chips | **API** → `GET /categories?page=1&limit=10` | **DYNAMIC** | Falls back to `defaultChips` hardcoded array if API fails |
| Testimonials (3 cards) | Hardcoded `testimonials` in `lib/data.ts` | **STATIC** | Company, name, title, quote |
| Partner logos (15 logos) | Hardcoded `partnerLogos` in `lib/data.ts` | **STATIC** | Text-only logo names (marquee animation) |
| Platform stats (4 counters) | Hardcoded `stats` in `lib/data.ts` | **STATIC** | 30K+ reports, 120K+ country reports, 1.2M+ statistics, 200K+ profiles |
| Pricing plans (4 plans) | Hardcoded `pricingPlans` in `lib/data.ts` | **STATIC** | Free/Basic/Premium/Enterprise with features list |

**Data needed from backend**: Reports list (recent), Categories list
**Currently static that could be dynamic**: Testimonials, partner logos, platform stats, pricing plans

---

### 3.2 Search Page (`/search`)

| Data Element | Source | Type | Details |
|---|---|---|---|
| Search results | **API** → `GET /search?q={query}&page=1&limit=100` or `GET /reports?status=published&limit=100` | **DYNAMIC** | Reports mapped to `Market` type via `mapReportToMarket()` |
| Industry filter sidebar | **API** → `GET /categories?page=1&limit=100` | **DYNAMIC** | Categories mapped to `Industry` type via `mapCategoryToIndustry()` |
| Type filter (Report/Databook/Statistics) | Hardcoded `resultTypes` | **STATIC** | Currently all reports map to type "Report" |
| Sort options | Hardcoded `sortOptions` | **STATIC** | Relevant, Newest, Highest CAGR, A-Z |

**Filters applied client-side**: type, industry, sort order
**URL sync**: query params → `?q=...&type=...&industry=...&sort=...`

---

### 3.3 Market Outlook Page (`/outlook/[slug]/[region]`)

This is the most data-rich page with 7 tabs.

| Data Element | Source | Type | Details |
|---|---|---|---|
| **Report data** | **API** → `GET /reports/{slug}` | **DYNAMIC** | Mapped via `mapReportToMarket()` — title, description, revenue, forecast, CAGR, yearStart, yearEnd |
| **KPI cards** (4 cards) | Derived from API report data | **DYNAMIC** | Revenue, Forecast, CAGR, Coverage — calculated from `market_metrics` |
| **Bar chart** (main chart) | Derived from API data | **DYNAMIC** | `dataPoints` interpolated from `market_metrics` using CAGR formula |
| **Market highlights** | Derived from API `summary` field | **DYNAMIC** | First 3 sentences of report summary |
| **Key players table** | **API** → from report's `key_players` field | **DYNAMIC** | Name only (employees, HQ, website are empty strings from API) |
| **Related markets** | **API** → `GET /categories/{categorySlug}/reports?page=1&limit=6` | **DYNAMIC** | Other reports in same category |
| **Statistics table** | Hardcoded `statisticsData` array | **STATIC** | Regional breakdowns, segment shares — NOT from API |
| **Pie chart** (regional share) | Hardcoded `pieData` array | **STATIC** | NA 42%, Europe 30%, APAC 20%, RoW 8% |
| **Stacked bar chart** (segments) | Hardcoded `segmentData` array | **STATIC** | Human/Humanized/Chimeric/Murine segment data 2018-2023 |
| **Market scope/segmentation** | Hardcoded in component | **STATIC** | Source Type, Production Type, Application, End Use, Regions, Countries |
| **Databook summary table** | Mix of dynamic + hardcoded | **PARTIAL** | Revenue/Forecast/CAGR from API; Leading Region, Fastest Growing, Leading Application are HARDCODED |
| **Market outlook text** | Template with dynamic values | **PARTIAL** | Template text with `{market.revenue}`, `{market.cagr}` etc. injected; paragraphs about regions are hardcoded |
| **Dashboard tab** | Plan-gated (BASIC+) | **GATED** | Currently empty `<div />` behind `PlanGate` component |
| **Reports tab** | Not implemented | **PLACEHOLDER** | — |
| **Customization tab** | Not implemented | **PLACEHOLDER** | — |
| **Right sidebar** | Mix | **MIXED** | Related markets = dynamic; "Curator Snapshot" = static; Client logos = static; Key Regions = static list |

**Critical gap**: Statistics tab, pie chart, segment chart, market scope, and databook summary table are all hardcoded for the monoclonal antibodies report only. They do NOT adapt to the actual report being viewed.

---

### 3.4 Industries Page (`/industries`)

| Data Element | Source | Type | Details |
|---|---|---|---|
| Industries list | **API** → `GET /categories?page=1&limit=100` + `GET /reports?status=published&limit=500` | **DYNAMIC** | Falls back to hardcoded `industries` from `lib/data.ts` if API fails |
| Sub-industries | Derived from report titles | **DYNAMIC** | Extracted via regex `title.match(/^(.+?)\s+Market/i)` from reports in each category |
| Market counts | From `category.report_count` or derived | **DYNAMIC** | Actual report count per category |

**Mapping**: `mapCategoryToIndustry(category, reports)` — extracts sub-industry names from report titles

---

### 3.5 Companies Page (`/companies`) & Company Profile (`/companies/[slug]`)

**Companies List Page**:

| Data Element | Source | Type | Details |
|---|---|---|---|
| Company list | **API** → `GET /reports?status=published&limit=100` | **DYNAMIC** | Companies extracted from `key_players` field of all reports, deduplicated by name |
| Sector filter options | Hardcoded `sectors` array | **STATIC** | Healthcare, Technology, Energy, Financial Services, Industrials, Consumer Goods |
| Industry filter options | **API** → categories | **DYNAMIC** | From `getCategories()` |

**Company Profile Page**:

| Data Element | Source | Type | Details |
|---|---|---|---|
| Company data | **API** → `GET /search?q={companyName}&page=1&limit=20` | **DYNAMIC** | Searches reports for matching `key_player`, mapped via `mapKeyPlayerToCompany()` |
| Related reports | From search results | **DYNAMIC** | Reports mentioning the company |
| Company details (HQ, employees, revenue, website, founded) | From `key_players` field | **MOSTLY EMPTY** | API `key_players` only has `name` and optional `description` — no HQ, employees, revenue, website data |
| Industry tags | Hardcoded template | **STATIC** | Generic tags: "Healthcare", "Biotechnology", etc. |
| News tab | No data source | **EMPTY** | Always shows "No news available" |

**Critical gap**: Company profiles are very sparse — the backend `key_players` only stores name + optional description/marketShare/rank. All other company fields (HQ, employees, revenue, website, founded year) come back empty.

---

### 3.6 My Reports Page (`/my-reports`) — Auth Required

| Data Element | Source | Type | Details |
|---|---|---|---|
| Recent visits | **Local** — Zustand `bookmarks-store` (persisted to localStorage) | **CLIENT-SIDE** | Stores `marketSlug` + `visitedAt` timestamp, up to 20 entries |
| Saved reports (bookmarks) | **Local** — Zustand `bookmarks-store` | **CLIENT-SIDE** | Stores `marketSlug` + `addedAt` timestamp |
| Report details for visits/bookmarks | **API** → `GET /reports/{slug}` for each slug | **DYNAMIC** | Fetches full report data, mapped to `Market` type |
| Downloads list | Hardcoded `myDownloads` array | **STATIC** | 2 sample downloads (PDF + XLS) — not connected to real download system |

---

### 3.7 Profile Page (`/profile`) — Auth Required

| Data Element | Source | Type | Details |
|---|---|---|---|
| User info (name, email, plan) | **API** → via auth store (`/users/me`) | **DYNAMIC** | From JWT auth + user endpoint |
| Profile form | Client-side form → **API** `PATCH /users/me` | **DYNAMIC** | Updates name |
| Password change | Client-side form → **API** `PATCH /users/me/password` | **DYNAMIC** | Current + new password |
| Subscription plans | Hardcoded `pricingPlans` from `lib/data.ts` | **STATIC** | Same as pricing page |
| Payment history / orders | **API** → `GET /users/me/orders?page=1&limit=50` | **DYNAMIC** | Shows order date, report, amount, status, payment method |
| Invite colleagues | Client-side only | **NOT CONNECTED** | Send button exists but no API call |

---

### 3.8 Insights Pages

**Thought Leadership** (`/insights/thought-leadership`):

| Data Element | Source | Type | Details |
|---|---|---|---|
| Articles list | **API** → `GET /press-releases?status=published` | **DYNAMIC** | Falls back to hardcoded `fallbackArticles` (6 items) if API fails |

**White Papers** (`/insights/white-papers`):

| Data Element | Source | Type | Details |
|---|---|---|---|
| White papers list | **API** → `GET /blogs?status=published` | **DYNAMIC** | Falls back to hardcoded `fallbackWhitepapers` (6 items) if API fails |
| Locked notice | Based on user plan | **DYNAMIC** | Premium+ plan required (via `PlanGate`) |

---

### 3.9 Service Pages (`/services/pipeline`, `/services/signal`, `/services/brainshare`, `/services/astra`)

| Data Element | Source | Type | Details |
|---|---|---|---|
| All content | Hardcoded in each page component | **STATIC** | Marketing copy, feature lists, stats, CTAs — no API calls |

---

### 3.10 Static/Informational Pages

| Page | Data Source | Type |
|---|---|---|
| About (`/about`) | Hardcoded | **STATIC** — Company values, milestones, team description |
| Pricing (`/pricing`) | Hardcoded `pricingPlans`, `stats`, `testimonials` from `lib/data.ts` | **STATIC** |
| Contact (`/contact`) | Form → **API** `POST /forms/submissions` | **DYNAMIC** (form submission only) |
| Survey (`/survey`) | Client-side form (no API call) | **NOT CONNECTED** — shows success UI but doesn't submit |
| FAQ (`/faq`) | Hardcoded | **STATIC** |
| Support (`/support`) | Hardcoded | **STATIC** |
| Terms (`/terms`) | Hardcoded | **STATIC** |
| Privacy (`/privacy`) | Hardcoded | **STATIC** |
| Cookie Policy (`/cookie-policy`) | Hardcoded | **STATIC** |

---

### 3.11 Auth Pages (`/login`, `/register`, `/forgot-password`)

| Data Element | Source | Type | Details |
|---|---|---|---|
| Login | **API** → `POST /auth/login` | **DYNAMIC** | Returns access_token, refresh_token, user |
| Register | **API** → `POST /auth/register` | **DYNAMIC** | Returns access_token, refresh_token, user |
| Forgot Password | Client-side form | **NOT CONNECTED** | UI exists but no API call for password reset |

---

## 4. Backend API Endpoints Used

### Currently Connected & Working

| Endpoint | Method | Auth | Used By |
|---|---|---|---|
| `/auth/login` | POST | No | Login page |
| `/auth/register` | POST | No | Register page |
| `/auth/refresh` | POST | No | Token refresh interceptor |
| `/auth/logout` | POST | Yes | Logout action |
| `/users/me` | GET | Yes | Auth store hydration |
| `/users/me` | PATCH | Yes | Profile update |
| `/users/me/password` | PATCH | Yes | Password change |
| `/users/me/orders` | GET | Yes | Profile → Payments tab |
| `/reports` | GET | No | Home page, search, industries, companies |
| `/reports/{slug}` | GET | No | Market outlook page, my-reports |
| `/reports/author/{id}` | GET | No | (Defined but not used on any page) |
| `/search` | GET | No | Search page |
| `/categories` | GET | No | Home, search, industries, companies |
| `/categories/{slug}` | GET | No | (Defined but not used directly) |
| `/categories/{slug}/reports` | GET | No | Market outlook → related markets |
| `/blogs` | GET | No | White papers page |
| `/blogs/slug/{slug}` | GET | No | (Defined but not used) |
| `/press-releases` | GET | No | Thought leadership page |
| `/press-releases/slug/{slug}` | GET | No | (Defined but not used) |
| `/authors` | GET | No | (Defined but not used) |
| `/authors/{id}` | GET | No | (Defined but not used) |
| `/forms/submissions` | POST | No | Contact page |
| `/orders` | POST | No | (Defined for checkout — not on any page yet) |
| `/orders/{id}/capture` | POST | No | (Defined for PayPal capture — not on any page yet) |
| `/orders/{id}/stripe-capture` | POST | No | (Defined for Stripe capture — not on any page yet) |

---

## 5. Client-Side State (Zustand Stores)

| Store | Persistence | Purpose |
|---|---|---|
| `auth-store` | localStorage (refresh token only) | JWT auth, login/logout/register, token refresh, user data |
| `user-store` | localStorage | Plan info, Prism AI query tracking, syncs from auth store |
| `bookmarks-store` | localStorage | Bookmarks (saved reports) + recent visits (last 20) |
| `search-store` | Memory only | Search filters state (query, types, industries, sort) |
| `ui-store` | localStorage (sidebar state only) | Sidebar collapsed state, active tab, modal states |

---

## 6. Data Mapping Layer (`lib/mappers.ts`)

The frontend uses its own type system distinct from the API types. All API responses are mapped:

| Mapper Function | Input → Output | Key Transformations |
|---|---|---|
| `mapReportToMarket()` | `ApiReport` → `Market` | Extracts `market_metrics` → revenue/forecast/CAGR; interpolates `dataPoints` using CAGR growth formula; maps `key_players` → `MarketCompany`; extracts highlights from summary sentences |
| `mapCategoryToIndustry()` | `ApiCategory` + `ApiReport[]` → `Industry` | Uses regex on report titles to extract sub-industry names; uses `report_count` for market count |
| `mapKeyPlayerToCompany()` | `KeyPlayer` + `ApiReport` → `Company` | Generates slug from name; copies sector/industry from parent report; most fields (HQ, employees, revenue, website, founded) are empty |
| `mapApiUserToUser()` | `ApiUser` → `User` | Maps plan string to Plan type; calculates AI query limits based on plan |

---

## 7. Plan-Gating System

Content is gated using the `PlanGate` component based on user subscription level:

| Plan | Rank | Access Level |
|---|---|---|
| FREE | 0 | Basic browsing, limited stats, 3 AI queries/month |
| BASIC | 1 | Full statistics (500 rows), dashboard access, 20 AI queries/month, CSV/XLS exports |
| PREMIUM | 2 | Unlimited stats, all exports, 25 reports/year, white papers, API access |
| ENTERPRISE | 3 | Everything in Premium + custom integrations, unlimited users |

**Currently gated features**:
- Dashboard tab on Market Outlook page → requires BASIC+
- White Papers page → requires PREMIUM+ (via PlanGate)
- Some statistics rows marked as `locked: true` in hardcoded data

---

## 8. Summary: What is Static vs Dynamic

### Fully Dynamic (from Backend API)
- Report listings (search, home, industries)
- Individual report data (market outlook page — overview section)
- Categories / industries list with sub-industries
- Company list (extracted from report key players)
- Authentication (login, register, token refresh)
- User profile data (name, email, plan)
- Order / payment history
- Blog posts (white papers page)
- Press releases (thought leadership page)
- Contact form submissions

### Fully Static (Hardcoded in Frontend)
- All marketing copy (hero text, service descriptions, about page)
- Testimonials (3 items)
- Partner logos (15 names)
- Platform statistics (30K+ reports, 120K+ country reports, etc.)
- Pricing plans & features
- FAQ content
- Terms, Privacy, Cookie Policy content
- Service pages (Pipeline, Signal, Brainshare, Astra)
- Survey questions
- Download history (2 sample items)
- Company milestones / values on About page

### Partially Dynamic (Template + Hardcoded)
- **Market Outlook page statistics tab** — table data, pie chart, segment chart are ALL HARDCODED for monoclonal antibodies only
- **Databook summary table** — revenue/forecast/CAGR from API, but "Leading Region", "Fastest Growing Region", "Leading Application" are hardcoded
- **Market outlook text** — template paragraphs with dynamic values injected, but regional analysis text is hardcoded
- **Market scope/segmentation** — segment names (Source Type, Production Type, etc.) are hardcoded, not from API
- **Company profiles** — name + description from API; HQ, employees, revenue, website, founded year are ALL EMPTY from API

### Not Connected (UI exists, no backend)
- Forgot Password page (no API call)
- Survey page (no API submission)
- Invite colleagues (no API call)
- Download/export buttons on charts (UI only)
- Dashboard tab on market outlook (empty behind paywall)
- Checkout flow (API defined but no page uses it yet in analytics app)
- Share, Print, Embed, Copy buttons on charts (UI only)

---

## 9. Data Gaps & Recommendations

### Critical Gaps Requiring Backend Work

1. **Market Statistics & Segmentation Data**
   - The Statistics tab on the Market Outlook page uses hardcoded data for one specific report
   - **Need**: Backend API to serve per-report statistics (regional breakdown, segment shares, yearly data by segment)
   - **Suggested endpoint**: `GET /reports/{slug}/statistics`

2. **Company Profiles**
   - Currently companies are derived from report `key_players` which only has name + optional description
   - **Need**: Dedicated company data model with HQ, employees, revenue, website, founded year, sector, market cap
   - **Suggested endpoint**: `GET /companies`, `GET /companies/{slug}`

3. **Regional Data**
   - Pie chart data (regional market share) is hardcoded
   - **Need**: Per-report regional breakdown data from backend
   - **Suggested addition to report model**: `regional_data` JSON field or separate table

4. **Segment Data**
   - Stacked bar chart (segment trends over time) is hardcoded
   - **Need**: Per-report segment time-series data
   - **Suggested addition to report model**: `segment_data` JSON field or separate table

5. **Market Scope / Segmentation Taxonomy**
   - Segment categories (Source Type, Production Type, Application, etc.) are hardcoded
   - **Need**: Per-report segmentation taxonomy from backend
   - **Suggested addition to report model**: `segmentation` JSON field with categories and items

### Medium Priority Gaps

6. **Downloads / File Management**
   - Downloads tab shows hardcoded sample files
   - **Need**: Track user downloads, serve report files
   - **Suggested endpoint**: `GET /users/me/downloads`, `GET /reports/{slug}/download`

7. **Password Reset Flow**
   - Forgot password page has UI but no API connection
   - **Need**: `POST /auth/forgot-password`, `POST /auth/reset-password`

8. **Survey Submission**
   - Survey page captures answers but doesn't submit
   - **Could use**: Existing `POST /forms/submissions` endpoint with category "survey"

9. **Invite Colleagues**
   - UI exists, no backend
   - **Need**: `POST /users/invite` or similar

### Low Priority / Nice-to-Have

10. **Dynamic Pricing Plans** — Currently hardcoded; could come from backend for flexibility
11. **Dynamic Testimonials** — Currently hardcoded; could be managed via admin panel
12. **Company News** — News tab always shows "No news available"; could integrate external news API
13. **AI Search / Prism AI** — UI toggle exists but AI search behaves identically to regular search
14. **Checkout Flow** — Order API exists in backend but no checkout pages exist in analytics app (they exist in the main client app)

---

## 10. Environment Variables Required

```env
NEXT_PUBLIC_API_URL=http://localhost:8081/api/v1    # Backend API base URL
NEXT_PUBLIC_PAYPAL_CLIENT_ID=xxx                     # PayPal (if checkout added)
```

---

## 11. Data Types Reference

### Frontend Types (`types/index.ts`)

```typescript
type Plan = 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE'

interface Market {
  slug, title, industry, subIndustry, region, description: string
  revenue, forecast, cagr: number
  yearStart, yearEnd: number
  dataPoints: { year: number; value: number }[]
  segments: string[]
  companies: { name, employees, hq, website: string }[]
  highlights: string[]
  relatedMarkets: string[]
  type: 'Report' | 'Databook' | 'Statistics'
}

interface Company {
  slug, name, sector, industry, hq, employees, revenue, description: string
  operatingStatus: 'Active' | 'Inactive' | 'Acquired' | 'IPO Pending'
  website: string
  foundedYear: number
  ipoStatus: 'Public' | 'Private' | 'Subsidiary'
  tags?: string[]
  marketCap?: string
}

interface Industry {
  id, name: string
  subIndustries: string[]
  marketCount?: number
}
```

### API Types (`types/api.ts`)

```typescript
interface ApiReport {
  id, category_id, page_count: number
  category_name, title, slug, description, summary: string
  price, discounted_price: number
  currency, geography, status: string
  formats: string[]
  is_featured: boolean
  publish_date: string
  market_metrics: {
    currentRevenue, forecastRevenue, cagr: number
    currentYear, forecastYear, cagrStartYear, cagrEndYear: number
  } | null
  key_players: { name: string; marketShare?: number; rank?: number; description?: string }[] | null
  sections: { keyPlayers?, marketDetails?, tableOfContents?: string } | null
  faqs: { question, answer: string }[] | null
  meta_title, meta_description: string
  meta_keywords: string[]
}

interface ApiCategory {
  id: number
  name, slug, description, image_url: string
  is_active: boolean
  report_count?: number
}

interface ApiOrder {
  id, report_id: number
  customer_name, customer_email, customer_company, customer_phone, customer_country: string
  report_title, report_slug: string
  amount: number
  currency, payment_method, status: string
  paypal_order_id?, stripe_payment_intent_id?: string
}
```
