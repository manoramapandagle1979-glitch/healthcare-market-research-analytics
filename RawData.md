🚀 Comprehensive Coding Prompt: Market Intelligence SaaS Portal ("Horizon Clone + Enhanced")
Project Overview
Build a full-stack Market Research & Industry Statistics SaaS Portal — a modern, premium platform inspired by Grand View Horizon. The app must have rich data visualization, a multi-tier subscription model, AI-powered search, and a full authenticated user experience. The goal is to replicate the core architecture while making the UI/UX significantly more polished, interactive, and delightful.

Tech Stack

**Frontend (Analytics Portal):** Next.js 14 (App Router) + TypeScript
**Styling:** Tailwind CSS + shadcn/ui + Framer Motion (animations)
**Charts:** Recharts (primary) + D3.js (for complex visualizations)
**State Management:** Zustand
**Auth:** JWT-based (tokens from existing Go backend)
**File handling:** Cloudflare R2 (via existing backend)
**Payments:** Stripe + PayPal (via existing backend)
**Email:** SMTP via gomail (handled by existing backend)

**Existing Go Backend** (`healthcare-market-research-backend/`):
- **Framework:** Go + Fiber v2
- **Database:** PostgreSQL + GORM (auto-migrate)
- **Caching:** Redis (optional, graceful degradation)
- **Auth:** JWT (access + refresh tokens), role-based (admin/editor/viewer)
- **File Storage:** Cloudflare R2
- **Payments:** Stripe + PayPal (order creation, capture, webhooks)
- **Email:** gomail.v2 SMTP
- **Architecture:** Clean arch — domain → repository → service → handler
- **API Base:** `http://localhost:8081/api/v1`

> **IMPORTANT:** The backend already exists and is fully functional. The analytics portal is a **frontend-only** project that consumes the existing backend API. No new backend code is needed — only new API endpoints if the existing ones don't cover a specific need.

---

## Existing Backend API Endpoints (Available)

### Authentication
- `POST /api/v1/auth/login` — JWT login (returns access_token + refresh_token)
- `POST /api/v1/auth/refresh` — Refresh access token
- `POST /api/v1/auth/logout` — Logout (requires auth)

### Users
- `GET /api/v1/users/me` — Current user profile (requires auth)
- `GET /api/v1/users/` — List all users (admin only)
- `POST /api/v1/users/` — Create user (admin only)
- `PUT /api/v1/users/:id` — Update user (admin only)
- `DELETE /api/v1/users/:id` — Delete user (admin only)

### Reports (= Market Reports)
- `GET /api/v1/reports` — List reports (supports filters, pagination)
- `GET /api/v1/reports/:slug` — Single report by slug (includes market_metrics, key_players, sections, FAQs)
- `GET /api/v1/reports/author/:id` — Reports by author
- `GET /api/v1/search` — Unified search across reports
- `POST /api/v1/reports` — Create report (admin/editor)
- `PUT /api/v1/reports/:id` — Update report (admin/editor)
- `PATCH /api/v1/reports/:id/soft-delete` — Soft delete (admin/editor)

### Categories (= Industries)
- `GET /api/v1/categories` — List all categories
- `GET /api/v1/categories/:slug` — Single category
- `GET /api/v1/categories/:slug/reports` — Reports in a category
- `GET /api/v1/categories/:slug/blogs` — Blogs in a category
- `GET /api/v1/categories/:slug/press-releases` — Press releases in a category

### Authors
- `GET /api/v1/authors` — List all authors
- `GET /api/v1/authors/:id` — Single author

### Blogs
- `GET /api/v1/blogs` — List blogs (supports filters, pagination)
- `GET /api/v1/blogs/slug/:slug` — Single blog by slug

### Press Releases
- `GET /api/v1/press-releases` — List press releases
- `GET /api/v1/press-releases/slug/:slug` — Single press release by slug

### Forms (Contact, Sample Request, Customization, Demo)
- `POST /api/v1/forms/submissions` — Submit a form (public)
- `GET /api/v1/forms/submissions` — List submissions
- `GET /api/v1/forms/stats` — Form stats

### Orders (Payments)
- `POST /api/v1/orders` — Create order (supports PayPal + Stripe)
- `POST /api/v1/orders/:id/capture` — Capture PayPal payment
- `POST /api/v1/orders/:id/stripe-capture` — Confirm Stripe payment
- `POST /api/v1/webhooks/stripe` — Stripe webhook

### Redirects
- `GET /api/v1/redirects/active` — Active redirects

### Sitemap
- `GET /api/v1/sitemap/reports` — All reports for sitemap
- `GET /api/v1/sitemap/blogs` — All blogs for sitemap
- `GET /api/v1/sitemap/press-releases` — All press releases for sitemap

### Dashboard (Admin)
- `GET /api/v1/dashboard/stats` — Dashboard statistics
- `GET /api/v1/dashboard/activity` — Recent activity

---

## Existing Data Models (Backend)

### Report (= Market/Outlook)
```
Report {
  id, category_id, title, slug, description, summary,
  price, discounted_price, currency,
  page_count, formats (jsonb), geography (jsonb),
  status (draft/review/published), is_featured,
  publish_date, scheduled_publish_enabled,
  author_ids (jsonb),
  market_metrics (jsonb: { currentRevenue, currentYear, forecastRevenue, forecastYear, cagr, cagrStartYear, cagrEndYear }),
  key_players (jsonb: [{ name, marketShare, rank, description }]),
  sections (jsonb: { keyPlayers, marketDetails, tableOfContents }),
  faqs (jsonb: [{ question, answer }]),
  meta_title, meta_description, meta_keywords,
  internal_links (jsonb),
  created_by, updated_by, internal_notes,
  created_at, updated_at, deleted_at
}
```

### Category (= Industry)
```
Category {
  id, name, slug, description, image_url, is_active, created_at, updated_at
}
```

### User (Admin/Internal)
```
User {
  id, email, password_hash, name, role (admin/editor/viewer), is_active,
  last_login_at, created_at, updated_at
}
```

### Order
```
Order {
  id, customer_name, customer_email, customer_company, customer_phone, customer_country,
  report_id, report_title, report_slug,
  amount, currency, payment_method (paypal/stripe),
  paypal_order_id, paypal_capture_id, stripe_payment_intent_id,
  status (pending_payment/payment_received/processing/delivered/cancelled/refunded),
  fulfilled_at, fulfilled_by, admin_notes,
  created_at, updated_at, deleted_at
}
```

### Blog
```
Blog {
  id, title, slug, content, excerpt, category_id, author_id,
  featured_image_url, status (draft/review/published),
  meta_title, meta_description, meta_keywords,
  internal_links (jsonb),
  created_at, updated_at, deleted_at
}
```

### Press Release
```
PressRelease {
  id, title, slug, content, excerpt, category_id, author_id,
  status, report_url,
  meta_title, meta_description, meta_keywords,
  internal_links (jsonb),
  created_at, updated_at, deleted_at
}
```

### Form Submission
```
FormSubmission {
  id, category (contact/request-sample/request-customization/schedule-demo),
  status (pending/processed/archived),
  form_data (jsonb), created_at, updated_at
}
```

### Author
```
Author {
  id, name, email, bio, image_url, linkedin_url, created_at, updated_at
}
```

---

Application Architecture
/app
  /(auth)
    /login
    /register
    /forgot-password
  /(dashboard)
    /layout.tsx          ← Authenticated shell (sidebar + topnav)
    /page.tsx            ← Home/Dashboard
    /industries
      /page.tsx          ← All Industries browse page (maps to Categories API)
    /search
      /page.tsx          ← Search results page (uses /api/v1/search)
    /outlook
      /[slug]
        /[region]
          /page.tsx      ← Market Overview tab (default) — uses /api/v1/reports/:slug
          /dashboard     ← Interactive chart dashboard (data from report.market_metrics)
          /statistics    ← Data tables
          /reports       ← Linked PDF reports
          /scope         ← TOC / segmentation (from report.sections.tableOfContents)
          /companies     ← Market players list (from report.key_players)
    /companies
      /page.tsx          ← Company search/list (key_players aggregated from reports)
      /[slug]
        /page.tsx        ← Company profile detail
    /insights
      /white-papers      ← Maps to /api/v1/blogs (filtered)
      /thought-leadership ← Maps to /api/v1/press-releases
    /services
      /pipeline          ← Supply chain service page
      /brainshare        ← Consulting service page
      /signal            ← Pricing database service page
      /astra             ← ESG solution service page
    /my-reports          ← Bookmarks (Recent Visited / My Reports / My Downloads) — client-side localStorage
    /pricing             ← Subscription plans & upgrade
    /profile
      /page.tsx          ← Profile, Password, Subscription, Payments, Invite Colleagues tabs
    /contact             ← Uses POST /api/v1/forms/submissions
    /survey

Page-by-Page Specifications

1. 🏠 Home Page (/)
Layout:

Full-width top navigation bar (see Navigation section)
Collapsible left sidebar (see Sidebar section)
Hero section with animated gradient background (deep navy-to-teal gradient)

Hero Section:

Large heading: "[Brand] Databooks" with sub-copy "World's Largest Portal for Market Reports & Statistics"
A secondary line: "Enhanced with AI-Powered Research & Data"
Search bar: wide, full-rounded input with teal Search CTA button and placeholder "Find market statistics & reports"
Popular Industries chips below (clickable filter tags): Biotechnology, Clinical Diagnostics, Consumer Goods, Polymers & Resins, Technology

Trust Bar:

Section: "Trusted by industry leaders worldwide"
Horizontally scrolling auto-animated carousel of partner logos (Medtronic, GE Healthcare, Siemens, Johnson & Johnson, Accenture, Google, Deloitte, KPMG, Siemens)
Use a smooth CSS marquee / infinite scroll animation

Recent Publications Section:

Grid of 4 cards (2×2) — each card shows:

Bar chart mini-icon (inline SVG)
Market name with arrow link
Three quick-access links: Dashboard | Statistics | Report
Hover: subtle lift shadow + teal underline

**Data Source:** `GET /api/v1/reports?sort=newest&limit=4&status=published`


Service Tabs Section:

5 tab pills: "Horizon Databooks", "Pipeline", "Signal", "Brainshare", "Astra"
Each tab switches to a description card explaining that service
Include a sample chart image / illustration per tab
CTA: "Talk to an expert" button

Plans & Pricing Preview:

4-column pricing cards on a dark navy/purple gradient background:

Free Plan ($0), Basic ($195/mo), Premium ($495/mo, highlighted), Enterprise ($1,995/mo)
Each card: plan name, price, per-user count, CTA button, feature checklist
Premium card: elevated scale + teal border glow
"Custom Pricing" button below for enterprise inquiries



Stats Counter Section:

4 animated counting numbers:

30K+ Global & Regional Reports
120K+ Country Reports
1.2M+ Market Statistics
200K+ Company Profiles


Use countUp animation triggered on scroll into view

Testimonials:

3-card slider (GE Healthcare, KPMG, NICCA USA)
Each: company logo, person name + title, quote text
Auto-rotate every 5 seconds with pause-on-hover
Dots navigation indicator

"Explore Horizon" Banner:

Full-width dark image/mock dashboard screenshot with overlay CTA

Footer:

Links: Contact, About, Privacy Policy, Terms & Conditions
Copyright line


2. 🧭 Navigation Bar (Persistent, Top)
Desktop (logged in):
[Logo + Brand]     [Search Input]    [Statistics ▾] [Reports ▾] [Pricing] [Services ▾] [Upgrade Plan CTA] [User Avatar ▾]
Statistics Dropdown: Mega-menu populated from `GET /api/v1/categories` — all categories in 4 columns + "View All Statistics" footer link
Reports Dropdown: Same mega-menu structure + "View All Reports"
Services Dropdown: 4 items — ESG Solutions, Analytics & Consulting, Procurement Intelligence, Pricing Index
User Avatar Dropdown: Profile, Subscription, Logout
Upgrade Plan button: Deep purple/navy, white text — opens pricing modal or navigates to /pricing
Mobile: Hamburger menu → full-screen slide-in drawer with all nav items

3. 📌 Left Sidebar (Collapsible)
State: Expanded (160px) or Collapsed (icon-only, 56px). Toggle button at bottom-left.
Expanded links:

🏠 Home
📊 Industries ▶ (expandable: populated from Categories API)
🕓 Recent Visited
☰ My Reports
🏢 Companies ▶ (expandable: Basic Materials, Consumer Defensive, Energy, Financial Services, Healthcare, Industrials, Real Estate, Technology, Utilities, Explore All Companies)
⚙️ Services ▶ (expandable: Astra, Brainshare, Pipeline, Signal)
💡 Insights ▶ (expandable: White Papers, Thought Leadership)
💳 Pricing (or "Free Plan" if on free tier)
📈 Survey
✉️ Contact Us
← Collapse (bottom)

Active state: Purple/teal left border indicator + light purple background
Hover state: Light gray/blue bg
Sub-items: Indent 16px, smaller font, fade-in animation on expand

4. 🗂️ All Industries Page (/industries)
Layout:

Top search bar (same as global header)
Dropdown filter: "Select Industry" / "Aerospace & Defence" (jump to section)
Full-width alphabetically grouped table:

Left column: Industry name (bold, large)
Right columns: Sub-industry links (each as a clickable text link with external-link icon)

**Data Source:** `GET /api/v1/categories` — each category = industry, with reports as sub-industries

Each sub-industry link: opens the Search page pre-filtered by that sub-industry
Sticky jump dropdown: Anchors to each industry section on the page

5. 🔍 Search Results Page (/search)
URL pattern: /search?q=antibodies&subindustry=Antibody+Production&type=Report
Layout: Two-panel (left filters + right results)

**Data Source:** `GET /api/v1/search?q=...` + `GET /api/v1/reports?category_slug=...`

Left Panel (Filters):

Reset all filters link
TYPE checkboxes: Statistics (count), Report (count), Databook (count)
INDUSTRY checkboxes (multi-select with counts) — from Categories API
SUB INDUSTRY checkboxes (collapsible, 10 shown then "+ More" expander)
SEGMENTS checkboxes
Each filter updates results in real-time (no submit needed)

Right Panel (Results):

Top search bar (persistent)
Sort / View controls
Result cards:

Badge: "Report" or "Statistics" or "Databook"
Bar chart icon
Title as link (e.g. "Global Monoclonal Antibodies Market Outlook, 2022-2030")
Segment descriptor (e.g. "By Source Type, By Production Type, By Application…")
Three quick links: Report Overview | Report Statistics | View Full Report



Empty state: Illustrated empty-state component with "No results found"

6. 📈 Market Outlook Page (/outlook/[slug]/[region])
This is the most complex page. It has a sticky secondary tab bar and multiple sub-views.

**Data Source:** `GET /api/v1/reports/:slug` — returns full report with market_metrics, key_players, sections, FAQs

Header Section:

Page title: "Global [Market Name] Market Size & Outlook"
Small badge: "PDF Report Available"
Description paragraph (2-3 sentences from `report.description`)
Data Tree panel (collapsible right panel): shows taxonomy breadcrumb as a tree (Industry → Sub-industry → Market Outlook)

Secondary Tab Bar (sticky on scroll):
Overview | Dashboard | Statistics | Reports | Scope | Companies | Request Customization ℹ

Tab 1: Overview (default)
KPI Cards row (3 cards) — from `report.market_metrics`:

Revenue, [year] (US$B): `market_metrics.currentRevenue` + `market_metrics.currentYear`
Forecast, [year] (US$B): `market_metrics.forecastRevenue` + `market_metrics.forecastYear`
CAGR, [start]-[end]: `market_metrics.cagr` + year range
4th card: Report Coverage: geography from `report.geography`

Main Chart: Bar Chart

Title: "[Market] market, [year range] (US$B)"
Interactive bar chart (Recharts BarChart) — data derived from market_metrics (interpolated yearly values)
X-axis: years, Y-axis: market size in US$B
Tooltip on hover showing exact value
Toolbar icons (vertical stack on right):

⤢ Expand/fullscreen view
Share icon
</> Embed code copy
📋 Copy data
⭐ Bookmark/favorite
🖨️ Print
⬇️ Download (opens dropdown: PNG, CSV, XLS)


"Filter by country" dropdown button
"Download ▾" button with format options

Market Highlights Section:

Bullet-list of 5-6 key insights (from `report.sections.marketDetails`)
"Global data book summary" table (2-col: metric / value)
"Other key industry trends" bullet list
"Key Regions" as linked chips (from `report.geography`)

Market Scope Section:

Section title + purple banner header "Market segmentation & scope"
Segmentation grid table: from `report.sections.tableOfContents`

Market Companies Preview Table:

Data from `report.key_players` — Name | Market Share | Rank | Description
8-10 rows, "View More" link to companies tab

Market Outlook Text:

Full editorial text from `report.sections.marketDetails`
Segment-specific sub-sections

FAQs Section:
From `report.faqs` — accordion-style Q&A

Partial Client List sidebar widget:

Mini logo grid (GE Healthcare, Deloitte, KPMG, Accenture, Siemens, Google)

Related Markets Sidebar (right column):

List of 10-15 related geography/sub-market links — from reports in same category

"Horizon in a Snapshot" sidebar widget:

✓ 30K+ Global Market Reports
✓ 120K+ Country Reports
✓ 1.2M+ Market Statistics
✓ 200K+ Company Profiles
✓ Industry insights and more
"ANALYST CALLBACK" CTA button → triggers `POST /api/v1/forms/submissions` with category "schedule-demo"


Tab 2: Dashboard (Premium/Upgrade locked for free users)
When unlocked:

Dashboard title: "[Market Name] Market Size, [year range]"
Segment filter pills (multi-select): Global Dashboard, Source Type, Production Type, Application, End Use
Filter dropdowns top-right: Region selector, Country selector, Year selector
Main chart area: switches chart type based on segment pill selected
Chart renders bar/pie/line charts dynamically — data from market_metrics

When locked (free tier):

Blurred/overlay modal: "To keep accessing Horizon, please upgrade your plan"

✓ Access to global market statistics
✓ Access to company profiles
✓ Free use-cases & research insights
"Upgrade Plan" (dark purple) and "View Plans" (outlined) buttons



Tab 3: Statistics (partially locked)

3 filter dropdowns: Markets, Regions, Segments (cascading)
Toggle: Tables | Charts (right side)
"Export All Tables" button
Data table with blurred rows for locked tiers
"Unlock Premium 🔒" overlay button centered on locked content
Each table has a title + "⭐ favorite" icon + "Download ▾" button
Year columns spanning full date range (2018–2030 etc.)


Tab 4: Reports

List of report items:

🔒 Lock icon (gated)
Report title (bold)
Full segment descriptor paragraph
Quick links: Report Overview | Report Statistics | View Full Report
"Buy Now" and "Talk to Analyst" CTA buttons (right-aligned)
"Buy Now" → `/checkout/:slug` (uses Orders API: `POST /api/v1/orders`)



Tab 5: Scope

Hierarchical bulleted list from `report.sections.tableOfContents`

Tab 6: Companies

Table from `report.key_players`: Name | Market Share | Rank | Description
"View More" pagination


Tab 7: Request Customization ℹ

Brief info icon tooltip explaining custom report service
Form: name, company, requirements textarea, submit CTA
**Submits to:** `POST /api/v1/forms/submissions` with category "request-customization"


7. 🏢 Companies List Page (/companies)
Layout:

4 filter inputs in a row:

Company Search (text input)
Select Sector (dropdown)
Select Industry (dropdown)
Sort By (dropdown: Latest, A-Z, Revenue, Employees)


"Search" and "Reset" action buttons

**Data Source:** Aggregated from `report.key_players` across all reports, or a dedicated companies dataset

Results Table:

Columns: Company (name link) | HQ | Sector | Industry | Company Revenue | Employees | Operating Status
Operating Status: color-coded badge (green "Active")
Pagination (numbered pages, first/last/prev/next controls)
Clicking company name navigates to profile


8. 👤 Company Profile Page (/companies/[slug])
Header:

Company name (H1) + ⭐ bookmark icon

Secondary tabs: Overview | News
Overview Tab:

Overview Card:

Description paragraph
Grid of metadata: TYPE, OPERATING STATUS, IPO STATUS, FOUNDED YEAR, HQ


Industry Card:

EMPLOYEE STRENGTH, WEBSITE (link), PHONE


Tag chips: Industry tags (e.g. "Energy", "Government", "Solar")

Right Sidebar:

"Market Reports" panel — reports where this company appears in key_players

News Tab:

List of news articles from external sources related to the company (if available, else "No news available" state)


9. 💡 Insights Pages
White Papers (/insights/white-papers):

3-column card grid
**Data Source:** `GET /api/v1/blogs?status=published` (filtered by type/tag)
Each card: full-bleed editorial image + title + blurred overlay for locked content
"Unlock Premium 🔒" centered overlay CTA

Thought Leadership (/insights/thought-leadership):

**Data Source:** `GET /api/v1/press-releases?status=published`
Same layout as White Papers


10. 🔧 Services Pages
Pipeline Page (/services/pipeline):

Hero: dark gradient (teal → dark navy) full-width banner

Heading: "Grand View Pipeline (Supply chain data)"
Sub-heading: "Build a smart, robust and reliable supply chain"
Description paragraphs
"Access Reports" teal CTA button
Right side: Animated circular wheel diagram showing 6 segments (Regulation Adherence, Financial Performance, Sustainability Benchmarks, Scalability, Quality Assurance, Delivery Excellence) with "PIPELINE" in center


"Markets We Cover" grid section: 3-column grid of market category buttons

Signal, Brainshare, Astra pages: Follow similar hero + features + CTA pattern, with brand-specific colors and illustrations

11. 💳 Pricing / Plan Page (/pricing)
Layout: Full-width dark purple/navy gradient background
Heading: "Plans & Pricing" + sub-copy
4 Pricing Cards (horizontal row):
FreeBasicPremiumEnterprisePriceUS$0US$195/moUS$495/moUS$1,995/moUsers11210CTA"Sign up" / "Current Plan""Buy Now" / "Upgrade""Buy Now" (highlighted)"Buy Now"Billing noteAlways freePer month, billed annuallyPer month, billed annuallyPer month, billed annually
Each card has a full feature checklist (checkmark icons). Premium card is visually elevated (scale-up, outer glow border).
Custom Pricing CTA: Below cards — "The price packages don't meet your needs? Tell us more & our analysts will custom build a package for you." → "Custom Pricing" button
Stats Row: 30K+ Reports, 120K+ Country Reports, 1.2M+ Statistics, 200K+ Company Profiles
Testimonials: 3-card row (GE Healthcare, KPMG Netherlands, NICCA USA)

12. 👤 Profile / Account Page (/profile)
User header: Name + Email address displayed
**Data Source:** `GET /api/v1/users/me` (requires auth)
5-tab navigation: Profile | Password | Subscription | Payments / Invoices | Invite Colleagues
Profile Tab:

PERSONAL INFO section: First Name*, Last Name*, Phone* (with country code selector), Designation*
ADDRESS INFO section: Address 1, Address 2, City, State, Zipcode, Country
Save button

Password Tab:

Current Password, New Password, Confirm Password fields + Update button

Subscription Tab:

Same Plans & Pricing component but with current plan highlighted as "Current Plan" (grayed-out button)

Payments / Invoices Tab:

Table of past invoices: Date, Amount, Status (Paid/Pending), Download PDF link

Invite Colleagues Tab:

Email input to invite a team member
List of pending/accepted invites


13. 📋 My Reports / Bookmarks Page (/my-reports)
3-tab sub-navigation: Recent Visited | My Reports | My Downloads
**Data Source:** Client-side localStorage (Zustand persisted store) — no backend API needed
Recent Visited:

List items sorted by most recent:

Badge: "Report"
Bar chart icon + report title (link)
Three quick links: Report Overview | Report Statistics | Report Dashboard
Timestamp ("6 minutes ago", "a day ago")



My Reports: Starred/saved items, same card format. Empty state: illustrated "No results found" with icon.
My Downloads: Downloaded files list with filename, date, format (PDF/CSV/XLS), re-download icon.

14. 🛒 Checkout Page (/checkout/[reportSlug])
**Data Source:** `GET /api/v1/reports/:slug` for report details + pricing
Layout:
- Order summary card (report title, price, discounted price)
- Customer form (name, email, company, phone, country)
- Payment method selection: PayPal or Stripe
- PayPal: Uses `POST /api/v1/orders` → PayPal JS SDK with returned `paypal_order_id`
- Stripe: Uses `POST /api/v1/orders` → Stripe Elements with returned `stripe_client_secret`
- On success: `POST /api/v1/orders/:id/capture` (PayPal) or `/stripe-capture` (Stripe)
- Redirect to `/order-success`

15. ✅ Order Success Page (/order-success)
- Confirmation message with order details
- Link to download report (if applicable)
- Link back to reports


🎨 Design System
Color Palette
css--brand-primary: #1a0a4a;        /* Deep navy/purple */
--brand-secondary: #3b1c9c;      /* Medium purple */
--brand-accent: #00c4cc;         /* Teal/cyan accent */
--brand-gradient-start: #1a0a4a;
--brand-gradient-end: #0e7490;
--text-primary: #1e1e2e;
--text-secondary: #6b7280;
--bg-primary: #f0f4f8;           /* Very light blue-gray */
--bg-white: #ffffff;
--success: #22c55e;
--border-light: #e5e7eb;
--chart-primary: #1a0a4a;        /* Dark purple bars */
--chart-secondary: #7c3aed;
Typography

Headings: Inter or Sora (bold, semi-bold)
Body: Inter (regular, 14-16px)
Code: JetBrains Mono

Component Patterns

Cards: rounded-xl, shadow-sm, border border-gray-100, white bg, hover:shadow-md transition
Buttons Primary: bg-[#1a0a4a] text-white px-6 py-2.5 rounded-full hover:bg-[#3b1c9c]
Buttons Outline: border-2 border-[#1a0a4a] text-[#1a0a4a] rounded-full
Teal Accent CTA: bg-[#00c4cc] text-white
Tags/Chips: rounded-full border text-sm px-3 py-1
Sidebar active: border-l-4 border-[#7c3aed] bg-purple-50

Animations (Framer Motion)

Page transitions: fadeIn with y: 10 → 0
Sidebar expand/collapse: width spring animation
Dropdown menus: opacity + y with spring easing
Stat counters: countUp on scroll-into-view
Card hovers: scale: 1.02 subtle lift
Chart bars: staggered entrance animation on mount


🔐 Authentication & Authorization
Auth flow: JWT tokens from Go backend (`POST /api/v1/auth/login`)
Session: Access token stored in memory/cookie, refresh token for renewal
Middleware: Client-side route protection — redirect unauthenticated users to /login
Token refresh: Automatic via `POST /api/v1/auth/refresh` on 401 responses

> **Note:** The backend uses role-based auth (admin/editor/viewer). The analytics portal treats all public visitors as unauthenticated free-tier users. Subscription/plan gating is handled client-side for the MVP (mock tier system), with real plan enforcement to be added when subscription models are added to the backend User model.

Access Control by Plan Tier:
FeatureFreeBasicPremiumEnterpriseView Overview stats✅✅✅✅Dashboard tab❌ (upgrade modal)✅✅✅Statistics (full)Partial (blurred rows)Up to 50010K+1M+Download CSV/XLS❌PNG only✅✅White Papers❌❌✅✅Thought Leadership❌❌✅✅Full Reports❌Buy separately1/year included25/year
Locked State Pattern: For any locked feature, show a semi-transparent overlay with:

Lock icon
Upgrade message
"Upgrade Plan" (filled) + "View Plans" (outlined) buttons


📊 Data Model Mapping (Backend → Analytics Portal)

The analytics portal does NOT define its own database models. It consumes the existing backend API.

| Portal Concept | Backend Model | API Endpoint |
|---|---|---|
| Market/Outlook | Report | `GET /api/v1/reports/:slug` |
| Industry | Category | `GET /api/v1/categories` |
| Company (key player) | Report.key_players (jsonb) | Extracted from report data |
| Market Metrics (KPIs) | Report.market_metrics (jsonb) | Part of report response |
| Segmentation/Scope | Report.sections.tableOfContents | Part of report response |
| White Papers | Blog | `GET /api/v1/blogs` |
| Thought Leadership | Press Release | `GET /api/v1/press-releases` |
| Contact/Forms | Form Submission | `POST /api/v1/forms/submissions` |
| Checkout/Orders | Order | `POST /api/v1/orders` |
| User Profile | User | `GET /api/v1/users/me` |
| Bookmarks | Client-side (localStorage) | N/A |
| Recent Visits | Client-side (localStorage) | N/A |
| Authors/Analysts | Author | `GET /api/v1/authors` |

---

## 🛠️ Enhancement Ideas (Make It "Awesome")

These go beyond the reference site:

1. **Dark Mode** — Full dark/light mode toggle via next-themes
3. **Interactive World Map** — On the Overview page, show an interactive SVG world map with choropleth shading by market size for each country
4. **Comparison Mode** — "Compare Markets" button lets users side-by-side compare two markets in charts + KPIs
5. **Notification System** — Bell icon in nav; alerts for new reports in bookmarked industries
6. **Onboarding Tour** — First-login guided tour using `driver.js` highlighting key features
7. **Mobile App Feel** — Full PWA support with offline caching for recently viewed reports
8. **Advanced Chart Toolbar** — Switch between Bar, Line, Area, Pie charts on any data view with animated transitions
9. **Personalized Home Feed** — After login, home page shows recommended markets based on browsing history
10. **Export to PowerPoint** — Premium feature: export any chart + market summary into a .pptx file

---

## 📁 Key Files to Create First
```
1. /lib/api/client.ts            ← Axios/fetch wrapper for backend API (base URL, auth headers, token refresh)
2. /lib/api/reports.ts           ← Report API functions
3. /lib/api/categories.ts        ← Category API functions
4. /lib/api/auth.ts              ← Auth API functions (login, refresh, logout)
5. /lib/api/forms.ts             ← Form submission API functions
6. /lib/api/orders.ts            ← Order/checkout API functions
7. /components/layout/Sidebar.tsx
8. /components/layout/TopNav.tsx
9. /components/market/OverviewTab.tsx
10. /components/market/StatsTable.tsx
11. /components/market/DashboardTab.tsx
12. /components/charts/BarChartCard.tsx
13. /components/ui/PricingCard.tsx
14. /components/ui/PlanGate.tsx   ← Gated content wrapper
15. /app/(dashboard)/layout.tsx
16. /app/(dashboard)/outlook/[slug]/[region]/page.tsx  ← Most complex page
17. /app/(dashboard)/industries/page.tsx
18. /app/(dashboard)/search/page.tsx
19. /app/(dashboard)/companies/page.tsx

This prompt covers every page, interaction, data mapping, and design token needed to build the analytics portal frontend that consumes the existing Go backend API.
```
