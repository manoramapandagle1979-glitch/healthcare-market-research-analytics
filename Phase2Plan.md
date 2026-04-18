# Phase 2 — API-Connected Frontend: Detailed Execution Plan

> **Goal**: Wire up the existing Go backend API. Replace all static/mock data with real API calls.

---

## Backend Gaps Identified

The existing Go backend covers ~90% of what the analytics portal needs. These gaps must be filled first:

| Gap | Why Needed | Priority |
|-----|-----------|----------|
| No `PATCH /users/me` | Profile self-edit (name, email) | High |
| No `PATCH /users/me/password` | Password change tab | High |
| No `GET /users/me/orders` | Payment history in profile | Medium |
| No `POST /auth/register` | Public registration | High |
| No `plan` field on User | Real plan gating (FREE/BASIC/PREMIUM/ENTERPRISE) | Medium |
| CORS locked to `*` | Works for now, tighten later | Low (Phase 3) |

---

## Execution Sequence

### Step 1 — Backend: User Self-Service Endpoints

#### 1a. Add `plan` field to User model

**File: `healthcare-market-research-backend/internal/domain/user/user.go`**
- Add `Plan string` field to `User` struct with `gorm:"type:varchar(20);default:'FREE'"`
- Add `Plan` to `UserResponse`
- Add `Plan` constant types: `PlanFree`, `PlanBasic`, `PlanPremium`, `PlanEnterprise`
- Add `UpdateProfileRequest` struct (Name, Email only — no role/active changes)
- Add `ChangePasswordRequest` struct (CurrentPassword, NewPassword)

**File: `healthcare-market-research-backend/migrations/024_add_plan_to_users.sql` (new)**
```sql
ALTER TABLE users ADD COLUMN plan VARCHAR(20) NOT NULL DEFAULT 'FREE';
```

#### 1b. Add self-service handlers

**File: `healthcare-market-research-backend/internal/service/user_service.go`**
- Add `UpdateProfile(userID uint, req UpdateProfileRequest) (*UserResponse, error)`
- Add `ChangePassword(userID uint, req ChangePasswordRequest) error`
- Add `GetUserOrders(userID uint, page, limit int) ([]Order, int64, error)` — or delegate to order service

**File: `healthcare-market-research-backend/internal/handler/user_handler.go`**
- Add `UpdateProfile` handler — reads `userID` from context, validates, calls service
- Add `ChangePassword` handler — verifies current password, hashes new, updates

**File: `healthcare-market-research-backend/cmd/api/main.go` (routes)**
- Add under authenticated routes (no admin role required):
  - `PATCH /api/v1/users/me` → `userHandler.UpdateProfile`
  - `PATCH /api/v1/users/me/password` → `userHandler.ChangePassword`
  - `GET /api/v1/users/me/orders` → `orderHandler.GetMyOrders`

#### 1c. Add user's own orders endpoint

**File: `healthcare-market-research-backend/internal/handler/order_handler.go`**
- Add `GetMyOrders` handler — filters orders by `customer_email` matching authenticated user's email
- Supports pagination (page, limit query params)

**File: `healthcare-market-research-backend/internal/service/order_service.go`**
- Add `GetByEmail(email string, page, limit int) ([]Order, int64, error)`

**File: `healthcare-market-research-backend/internal/repository/order_repository.go`**
- Add `FindByEmail(email string, page, limit int) ([]Order, int64, error)`

#### 1d. Add public registration endpoint

**File: `healthcare-market-research-backend/internal/handler/auth_handler.go`**
- Add `Register` handler — accepts `RegisterRequest{Email, Password, Name}`
- Creates user with role=`viewer`, plan=`FREE`, is_active=`true`
- Returns `LoginResponse` (auto-login after registration)

**File: `healthcare-market-research-backend/internal/domain/user/user.go`**
- Add `RegisterRequest` struct

**File: `healthcare-market-research-backend/internal/service/auth_service.go`**
- Add `Register(req RegisterRequest) (*LoginResponse, error)`

**File: `healthcare-market-research-backend/cmd/api/main.go`**
- Add `POST /api/v1/auth/register` (public, rate-limited)

---

### Step 2 — Frontend: API Client Layer

#### 2a. Install dependencies

```bash
cd healthcare-market-research-analytics
npm install axios
```
> Using axios over native fetch for interceptors (auto-refresh on 401, auto-attach token).
> No SWR/React Query — keep it simple with Zustand + useEffect for now, add later if needed.

#### 2b. Create API client

**File: `lib/api/client.ts` (new)**
- Axios instance with `baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/v1'`
- Request interceptor: attach `Authorization: Bearer <token>` from auth store
- Response interceptor: on 401, attempt `POST /auth/refresh` with refresh token, retry original request
- Error normalization: map backend `{ success: false, error: "..." }` to consistent `ApiError` class

#### 2c. Create API modules

**File: `lib/api/auth.ts` (new)**
- `login(email, password)` → `POST /auth/login` → returns `LoginResponse`
- `register(name, email, password)` → `POST /auth/register` → returns `LoginResponse`
- `refresh(refreshToken)` → `POST /auth/refresh` → returns `RefreshResponse`
- `logout(refreshToken)` → `POST /auth/logout`
- `getMe()` → `GET /users/me` → returns `UserResponse`

**File: `lib/api/reports.ts` (new)**
- `getReports(params)` → `GET /reports` (params: status, category_slug, search, sort, page, limit)
- `getReportBySlug(slug)` → `GET /reports/:slug`
- `searchReports(query)` → `GET /search?q=...`
- `getReportsByCategory(categorySlug, page, limit)` → `GET /categories/:slug/reports`
- `getReportsByAuthor(authorId, page, limit)` → `GET /reports/author/:id`

**File: `lib/api/categories.ts` (new)**
- `getCategories(page?, limit?)` → `GET /categories`
- `getCategoryBySlug(slug)` → `GET /categories/:slug`
- `getCategoryReports(slug, page?, limit?)` → `GET /categories/:slug/reports`

**File: `lib/api/blogs.ts` (new)**
- `getBlogs(params)` → `GET /blogs` (params: status=published, page, limit, categoryId, tags)
- `getBlogBySlug(slug)` → `GET /blogs/slug/:slug`

**File: `lib/api/press-releases.ts` (new)**
- `getPressReleases(params)` → `GET /press-releases` (params: status=published, page, limit)
- `getPressReleaseBySlug(slug)` → `GET /press-releases/slug/:slug`

**File: `lib/api/forms.ts` (new)**
- `submitForm(data)` → `POST /forms/submissions`
- Categories: `contact`, `request-sample`, `request-customization`, `schedule-demo`

**File: `lib/api/orders.ts` (new)**
- `createOrder(data)` → `POST /orders`
- `capturePayPalOrder(id)` → `POST /orders/:id/capture`
- `captureStripeOrder(id)` → `POST /orders/:id/stripe-capture`
- `getMyOrders(page?, limit?)` → `GET /users/me/orders`

**File: `lib/api/authors.ts` (new)**
- `getAuthors(search?)` → `GET /authors`
- `getAuthorById(id)` → `GET /authors/:id`

**File: `lib/api/users.ts` (new)**
- `updateProfile(data)` → `PATCH /users/me`
- `changePassword(data)` → `PATCH /users/me/password`

**File: `lib/api/index.ts` (new)**
- Re-exports all API modules

---

### Step 3 — Frontend: TypeScript Types for API Responses

**File: `types/api.ts` (new)**

Types to define (matching backend JSON shapes exactly):

```typescript
ApiResponse<T>          { success, data, error?, meta? }
ApiMeta                 { page, limit, total, total_pages }
ApiError                { success: false, error: string }

// Auth
LoginResponse           { access_token, refresh_token, token_type, expires_in, user }
RefreshResponse         { access_token, refresh_token, token_type, expires_in, user }

// User
ApiUser                 { id, email, name, role, plan, is_active, last_login_at, created_at, updated_at }

// Report
MarketMetrics           { currentRevenue, currentYear, forecastRevenue, forecastYear, cagr, cagrStartYear, cagrEndYear }
KeyPlayer               { name, marketShare?, rank?, description? }
ReportSections          { keyPlayers, marketDetails, tableOfContents }
FAQ                     { question, answer }
ApiReport               { id, category_id, category_name, title, slug, description, summary, price, discounted_price, currency, page_count, formats, geography, status, is_featured, publish_date, market_metrics, key_players, sections, faqs, meta_title, meta_description, meta_keywords, created_at, updated_at }

// Category
ApiCategory             { id, name, slug, description, image_url, is_active, created_at, updated_at }

// Blog
ApiAuthor               { id, name, role, bio, image_url, linkedin_url }
ApiBlog                 { id, title, slug, excerpt, content, category_id, tags, author_id, status, category, author, metadata, publish_date, created_at }

// Press Release
ApiPressRelease         { id, title, slug, excerpt, content, category_id, tags, author_id, status, report_url, category, author, metadata, publish_date, created_at }

// Form
FormSubmissionRequest   { category, data: Record<string, any>, page_url?, referrer? }

// Order
CreateOrderRequest      { customer_name, customer_email, company?, phone?, country, report_id, payment_method }
ApiOrder                { id, customer_name, customer_email, report_title, report_slug, amount, currency, payment_method, status, paypal_order_id?, stripe_payment_intent_id?, created_at }
```

Keep existing `types/index.ts` for UI-only types (Plan, Market, Company, Bookmark, etc.) — add mapper functions in Step 5.

---

### Step 4 — Frontend: Auth Store + Auth Flow

#### 4a. Rewrite auth store

**File: `store/auth-store.ts` (new)**
- State: `user: ApiUser | null`, `accessToken: string | null`, `refreshToken: string | null`, `isAuthenticated: boolean`, `isLoading: boolean`
- Actions: `login(email, password)`, `register(name, email, password)`, `logout()`, `refreshTokens()`, `fetchMe()`, `setTokens(access, refresh)`, `clearAuth()`
- Persist: refresh token to localStorage (`horizon-auth`), access token in memory only
- On app mount: if refresh token exists → call `refreshTokens()` → `fetchMe()`

#### 4b. Update user store

**File: `store/user-store.ts`**
- Remove mock default user
- Derive plan from `auth-store`'s `user.plan` field
- Keep `setPlan` for dev toolbar override
- Keep Prism AI query tracking

#### 4c. Create auth hook

**File: `hooks/useAuth.ts` (new)**
- Wraps auth store for convenience
- `useRequireAuth()` — redirects to `/login` if not authenticated
- `useRedirectIfAuth()` — redirects to `/` if already authenticated (for login/register pages)

#### 4d. Wire auth pages

**File: `app/(auth)/login/page.tsx`**
- Replace static form with working form
- On submit: call `authStore.login(email, password)` → redirect to `/`
- Show error toast on failure
- Add link to `/register`

**File: `app/(auth)/register/page.tsx`**
- Replace static form with working form
- On submit: call `authStore.register(name, email, password)` → redirect to `/`

**File: `app/(auth)/forgot-password/page.tsx`**
- Submit calls `POST /forms/submissions` with category `contact` and type `password-reset` (workaround — no dedicated endpoint)
- Show "Check your email" confirmation

#### 4e. Auth-aware layout

**File: `app/(dashboard)/layout.tsx`**
- On mount: call `authStore.refreshTokens()` if refresh token exists
- Doesn't block rendering (unauthenticated users can browse public pages)

**File: `components/layout/TopNav.tsx`**
- If authenticated: show user name, avatar initials, logout in dropdown
- If not authenticated: show "Sign In" / "Get Started" buttons
- User avatar dropdown populated from auth store user

---

### Step 5 — Frontend: Data Mappers (API → UI Types)

**File: `lib/mappers.ts` (new)**

The existing UI types (`Market`, `Company`, `Industry` in `types/index.ts`) don't match backend shapes. Instead of rewriting every page component, create mapper functions:

- `mapReportToMarket(report: ApiReport): Market` — maps `market_metrics` → `revenue/forecast/cagr`, `key_players` → `companies`, `geography` → `region`, generates `dataPoints` by interpolating between current and forecast revenue
- `mapCategoryToIndustry(category: ApiCategory, reports: ApiReport[]): Industry` — extracts unique sub-industries from report titles/descriptions
- `mapKeyPlayerToCompany(player: KeyPlayer, report: ApiReport): Company` — partial mapping, fills what's available
- `mapApiUserToUser(apiUser: ApiUser): User` — maps backend user shape to frontend User type

This avoids touching every page component in Phase 2 — they keep consuming the same `Market`/`Company`/`Industry` types.

---

### Step 6 — Frontend: Wire Pages to API (Page by Page)

#### 6a. Home Page — `app/(dashboard)/page.tsx`
- Recent Publications section: fetch `getReports({ status: 'published', sort: 'newest', limit: 4 })` → map to Market cards
- Industry chips in hero: fetch `getCategories()` → show top categories
- Search bar: already navigates to `/search?q=...` (no change needed)
- Trust bar, pricing, testimonials, stats: keep static (not API-driven)

#### 6b. Industries Page — `app/(dashboard)/industries/page.tsx`
- Replace `industries` import from `@/lib/data` with `getCategories(1, 100)`
- Group categories alphabetically
- Each category shows report count from API meta
- Sub-industry links → `/search?category=slug`

#### 6c. Search Page — `app/(dashboard)/search/page.tsx`
- Replace `mockMarkets` + `mockIndustries` with API calls
- `?q=` → calls `searchReports(q)`
- `?category=` → calls `getReportsByCategory(slug)`
- Filter sidebar: populated from `getCategories()`
- Results mapped via `mapReportToMarket()`
- URL params synced with search store

#### 6d. Market Outlook Page — `app/(dashboard)/outlook/[slug]/[region]/page.tsx`
- Replace `mockMarkets.find()` with `getReportBySlug(slug)`
- Map `report.market_metrics` → KPI cards
- Map `report.market_metrics` → bar chart data (interpolate yearly values)
- Map `report.key_players` → Companies tab
- Map `report.sections.tableOfContents` → Scope tab
- Map `report.sections.marketDetails` → Overview text
- Map `report.faqs` → FAQ accordion
- Map `report.geography` → region chips
- Related markets: `getCategoryReports(report.category_slug)` excluding current
- Request Customization form: `submitForm({ category: 'request-customization', data: {...} })`
- Bookmark/recent visit: keep using client-side stores (no change)

#### 6e. Companies Page — `app/(dashboard)/companies/page.tsx`
- Fetch `getReports({ status: 'published', limit: 100 })` → extract all `key_players` across reports
- Deduplicate by company name
- Map via `mapKeyPlayerToCompany()`
- Client-side search/filter/sort remains

#### 6f. Company Detail Page — `app/(dashboard)/companies/[slug]/page.tsx`
- Search reports for this company name: `searchReports(companyName)`
- Show linked reports in sidebar

#### 6g. Insights: White Papers — `app/(dashboard)/insights/white-papers/page.tsx`
- Fetch `getBlogs({ status: 'published' })`
- Map to card grid

#### 6h. Insights: Thought Leadership — `app/(dashboard)/insights/thought-leadership/page.tsx`
- Fetch `getPressReleases({ status: 'published' })`
- Map to card grid

#### 6i. Contact Page — `app/(dashboard)/contact/page.tsx`
- Form submit → `submitForm({ category: 'contact', data: formData })`
- Toast on success/error

#### 6j. Profile Page — `app/(dashboard)/profile/page.tsx`
- Profile tab: populated from auth store user, edits call `updateProfile()`
- Password tab: calls `changePassword()`
- Subscription tab: shows `user.plan` from auth store
- Payments tab: calls `getMyOrders()` → displays order history
- Invite tab: calls `submitForm({ category: 'contact', data: { type: 'invite', ... } })`
- Wrap page with `useRequireAuth()`

#### 6k. My Reports Page — `app/(dashboard)/my-reports/page.tsx`
- Recent Visited: reads from `bookmarks-store` recent visits → fetches report details via `getReportBySlug()` for each
- My Reports (bookmarks): reads from `bookmarks-store` → fetches report details
- My Downloads: placeholder (no download tracking yet)
- Wrap page with `useRequireAuth()`

---

### Step 7 — Frontend: Navigation & Layout Updates

#### 7a. Sidebar — `components/layout/Sidebar.tsx`
- Industries sub-menu: fetch `getCategories()` on mount, populate dynamically
- Cache in a lightweight Zustand slice or React state

#### 7b. TopNav — `components/layout/TopNav.tsx`
- Mega-menu dropdowns (Statistics / Reports): populate from `getCategories()`
- Search input: already triggers navigation (no change)
- User area: auth-aware (Step 4e)

#### 7c. Sidebar collapse
- Already persisted via `ui-store` (no change)

---

### Step 8 — Frontend: Plan Gating (Mock + Real Hybrid)

**File: `components/ui/PlanGate.tsx`**
- Currently reads plan from `useUserStore`
- Update to read plan from `auth-store` user when authenticated, fall back to `user-store` (dev toolbar) when not
- No other changes — gating logic stays the same

**File: `components/dev/DevToolbar.tsx`**
- Keep as-is for development
- When authenticated, dev toolbar overrides the real plan (dev-only)

---

### Step 9 — Frontend: Loading & Error States

#### 9a. Loading skeletons
Add to each page that fetches data:
- `components/ui/Skeleton.tsx` (new) — reusable skeleton primitives (or use shadcn skeleton)
- Skeleton variants: CardSkeleton, TableRowSkeleton, ChartSkeleton
- Each page shows skeletons while API call is in flight

#### 9b. Error boundaries
- `app/(dashboard)/error.tsx` (new) — dashboard-level error boundary
- `app/(dashboard)/not-found.tsx` (new) — 404 page

#### 9c. Toast notifications
- `components/ui/Toaster.tsx` (new) — simple toast system (or use shadcn toast)
- Success toasts: form submissions, profile updates, password changes
- Error toasts: API failures, validation errors
- Add `<Toaster />` to root layout

#### 9d. Empty states
- Search with no results: already has empty state component
- My Reports with no bookmarks: already has empty state
- Connect to real 404s from API (report not found → show empty state, not crash)

---

### Step 10 — Frontend: Environment & Config

**File: `.env.local` (new, gitignored)**
```
NEXT_PUBLIC_API_URL=http://localhost:8081/api/v1
NEXT_PUBLIC_PAYPAL_CLIENT_ID=<sandbox_id>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<test_key>
```

**File: `.env.example` (new)**
```
NEXT_PUBLIC_API_URL=http://localhost:8081/api/v1
NEXT_PUBLIC_PAYPAL_CLIENT_ID=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

**File: `next.config.mjs`**
- Add backend URL to `images.remotePatterns` (for R2-hosted images)
- Add API rewrite proxy if needed for CORS in dev:
  ```js
  rewrites: () => [{ source: '/api/:path*', destination: 'http://localhost:8081/api/:path*' }]
  ```

---

## File Change Inventory

### Backend (10 files modified, 1 file new)

| # | File | Action | What |
|---|------|--------|------|
| 1 | `migrations/024_add_plan_to_users.sql` | **New** | Add plan column |
| 2 | `internal/domain/user/user.go` | Modify | Add Plan field, RegisterRequest, UpdateProfileRequest, ChangePasswordRequest |
| 3 | `internal/service/auth_service.go` | Modify | Add Register() |
| 4 | `internal/handler/auth_handler.go` | Modify | Add Register handler |
| 5 | `internal/service/user_service.go` | Modify | Add UpdateProfile(), ChangePassword() |
| 6 | `internal/handler/user_handler.go` | Modify | Add UpdateProfile, ChangePassword handlers |
| 7 | `internal/repository/order_repository.go` | Modify | Add FindByEmail() |
| 8 | `internal/service/order_service.go` | Modify | Add GetByEmail() |
| 9 | `internal/handler/order_handler.go` | Modify | Add GetMyOrders handler |
| 10 | `cmd/api/main.go` | Modify | Add 4 new routes |
| 11 | `internal/db/db.go` | Modify | AutoMigrate picks up Plan field |

### Frontend (19 new files, 16 modified files)

| # | File | Action | What |
|---|------|--------|------|
| 1 | `lib/api/client.ts` | **New** | Axios instance + interceptors |
| 2 | `lib/api/auth.ts` | **New** | Auth API functions |
| 3 | `lib/api/reports.ts` | **New** | Report API functions |
| 4 | `lib/api/categories.ts` | **New** | Category API functions |
| 5 | `lib/api/blogs.ts` | **New** | Blog API functions |
| 6 | `lib/api/press-releases.ts` | **New** | Press release API functions |
| 7 | `lib/api/forms.ts` | **New** | Form submission API |
| 8 | `lib/api/orders.ts` | **New** | Order/checkout API |
| 9 | `lib/api/authors.ts` | **New** | Author API functions |
| 10 | `lib/api/users.ts` | **New** | Profile update API |
| 11 | `lib/api/index.ts` | **New** | Barrel re-export |
| 12 | `types/api.ts` | **New** | Backend response types |
| 13 | `lib/mappers.ts` | **New** | API → UI type converters |
| 14 | `store/auth-store.ts` | **New** | Auth state (tokens, user) |
| 15 | `hooks/useAuth.ts` | **New** | Auth hook + route guards |
| 16 | `components/ui/Skeleton.tsx` | **New** | Loading skeletons |
| 17 | `components/ui/Toaster.tsx` | **New** | Toast notifications |
| 18 | `app/(dashboard)/error.tsx` | **New** | Error boundary |
| 19 | `.env.example` | **New** | Env template |
| 20 | `store/user-store.ts` | Modify | Derive plan from auth store |
| 21 | `app/(auth)/login/page.tsx` | Modify | Wire to auth API |
| 22 | `app/(auth)/register/page.tsx` | Modify | Wire to auth API |
| 23 | `app/(auth)/forgot-password/page.tsx` | Modify | Wire to forms API |
| 24 | `app/(dashboard)/layout.tsx` | Modify | Auth hydration on mount |
| 25 | `app/(dashboard)/page.tsx` | Modify | Fetch recent reports + categories |
| 26 | `app/(dashboard)/industries/page.tsx` | Modify | Fetch categories from API |
| 27 | `app/(dashboard)/search/page.tsx` | Modify | Fetch search results from API |
| 28 | `app/(dashboard)/outlook/[slug]/[region]/page.tsx` | Modify | Fetch report by slug |
| 29 | `app/(dashboard)/companies/page.tsx` | Modify | Aggregate key_players from API |
| 30 | `app/(dashboard)/companies/[slug]/page.tsx` | Modify | Search reports for company |
| 31 | `app/(dashboard)/insights/white-papers/page.tsx` | Modify | Fetch blogs |
| 32 | `app/(dashboard)/insights/thought-leadership/page.tsx` | Modify | Fetch press releases |
| 33 | `app/(dashboard)/contact/page.tsx` | Modify | Wire form to API |
| 34 | `app/(dashboard)/profile/page.tsx` | Modify | Wire all tabs to API |
| 35 | `app/(dashboard)/my-reports/page.tsx` | Modify | Fetch bookmarked report details |
| 36 | `components/layout/TopNav.tsx` | Modify | Auth-aware + dynamic categories |
| 37 | `components/layout/Sidebar.tsx` | Modify | Dynamic category menu |
| 38 | `components/ui/PlanGate.tsx` | Modify | Read plan from auth store |
| 39 | `next.config.mjs` | Modify | API rewrite proxy + image domains |

---

## Build Order (Critical Path)

```
Backend (do first, ~1 day):
  1. migration + User.Plan field
  2. RegisterRequest + Register service + handler + route
  3. UpdateProfileRequest + ChangePasswordRequest + handlers + routes
  4. GetMyOrders handler + route
  5. Test all new endpoints with curl/Postman

Frontend foundation (~1 day):
  6. npm install axios
  7. .env.example + .env.local + next.config.mjs proxy
  8. types/api.ts (all backend response types)
  9. lib/api/client.ts (axios instance + interceptors)
  10. lib/api/*.ts (all 9 API modules + index)
  11. lib/mappers.ts (API → UI type converters)

Frontend auth (~0.5 day):
  12. store/auth-store.ts
  13. hooks/useAuth.ts
  14. Wire login/register/forgot-password pages
  15. Auth-aware dashboard layout + TopNav

Frontend pages (~2 days):
  16. Home page (recent publications + categories)
  17. Industries page
  18. Search page
  19. Market Outlook page (biggest page — most mapping work)
  20. Companies pages
  21. Insights pages (white papers + thought leadership)
  22. Contact page form
  23. Profile page (all 5 tabs)
  24. My Reports page
  25. Sidebar + TopNav dynamic menus

Frontend polish (~0.5 day):
  26. Skeleton loading states
  27. Toast notifications
  28. Error boundary + not-found
  29. PlanGate auth-store integration
```

---

## Dependency Installation Summary

```bash
# Phase 2
npm install axios

# Optional (add if data fetching patterns become complex)
# npm install @tanstack/react-query
```

---

## Key Design Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| HTTP client | Axios | Interceptors for auto-refresh + auto-attach token |
| Data fetching | Axios + useEffect + Zustand | Simple, no extra lib; add React Query later if needed |
| Type mapping | Mapper functions (API → UI types) | Avoids rewriting all page components; clean separation |
| Auth tokens | Access in memory, refresh in localStorage | Balance between security and persistence |
| Plan gating | Auth store (real) + user store (dev override) | Dev toolbar still works, real plan used in prod |
| Registration | New backend endpoint | Required for public sign-up flow |
| Password reset | Form submission workaround | No dedicated endpoint; use contact form with type tag |
| Companies data | Aggregated from report key_players | No dedicated companies endpoint in backend |
