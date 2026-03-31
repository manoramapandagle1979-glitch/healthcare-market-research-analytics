🚀 Comprehensive Coding Prompt: Market Intelligence SaaS Portal ("Horizon Clone + Enhanced")
Project Overview
Build a full-stack Market Research & Industry Statistics SaaS Portal — a modern, premium platform inspired by Grand View Horizon. The app must have rich data visualization, a multi-tier subscription model, AI-powered search, and a full authenticated user experience. The goal is to replicate the core architecture while making the UI/UX significantly more polished, interactive, and delightful.

Tech Stack
Frontend: Next.js 14 (App Router) + TypeScript
Styling: Tailwind CSS + shadcn/ui + Framer Motion (animations)
Charts: Recharts (primary) + D3.js (for complex visualizations)
State Management: Zustand
Auth: NextAuth.js (credentials + Google OAuth)
Backend: Next.js API Routes + Prisma ORM
Database: PostgreSQL (Supabase)
Search: Algolia (or MeiliSearch self-hosted)
File handling: AWS S3 / Cloudflare R2
Payments: Stripe
Email: Resend

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
      /page.tsx          ← All Industries browse page
    /search
      /page.tsx          ← Search results page
    /outlook
      /[slug]
        /[region]
          /page.tsx      ← Market Overview tab (default)
          /dashboard     ← Interactive chart dashboard
          /statistics    ← Data tables
          /reports       ← Linked PDF reports
          /scope         ← TOC / segmentation
          /companies     ← Market players list
    /companies
      /page.tsx          ← Company search/list
      /[slug]
        /page.tsx        ← Company profile detail
    /insights
      /white-papers
      /thought-leadership
    /services
      /pipeline          ← Supply chain service page
      /brainshare        ← Consulting service page
      /signal            ← Pricing database service page
      /astra             ← ESG solution service page
    /my-reports          ← Bookmarks (Recent Visited / My Reports / My Downloads)
    /pricing             ← Subscription plans & upgrade
    /profile
      /page.tsx          ← Profile, Password, Subscription, Payments, Invite Colleagues tabs
    /contact
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
Statistics Dropdown: Mega-menu with all 26+ industry categories in 4 columns + "View All Statistics" footer link
Reports Dropdown: Same mega-menu structure + "View All Reports"
Services Dropdown: 4 items — ESG Solutions, Analytics & Consulting, Procurement Intelligence, Pricing Index
User Avatar Dropdown: Profile, Subscription, Logout
Upgrade Plan button: Deep purple/navy, white text — opens pricing modal or navigates to /pricing
Mobile: Hamburger menu → full-screen slide-in drawer with all nav items

3. 📌 Left Sidebar (Collapsible)
State: Expanded (160px) or Collapsed (icon-only, 56px). Toggle button at bottom-left.
Expanded links:

🏠 Home
📊 Industries ▶ (expandable: Biotechnology, Clinical Diagnostics, Consumer Goods, Polymers & Resins, Technology, Explore All Industries)
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


Industries listed (at minimum): Aerospace & Defence, Animal Health, Automotive & Transportation, Biotechnology, Bulk Chemicals, Clinical Diagnostics, Consumer Goods, Consumer Services, Energy & Power, Financial Services, Food Beverages & Tobacco, Healthcare, Materials, MedTech, Metals & Mining, Nutrition, Packaging, Pharmaceuticals, Plastics, Semiconductor, Sexual Health, Specialty Chemicals, Telecom & Technology

Each sub-industry link: opens the Search page pre-filtered by that sub-industry
Sticky jump dropdown: Anchors to each industry section on the page

5. 🔍 Search Results Page (/search)
URL pattern: /search?q=antibodies&subindustry=Antibody+Production&type=Report
Layout: Two-panel (left filters + right results)
Left Panel (Filters):

Reset all filters link
TYPE checkboxes: Statistics (count), Report (count), Databook (count)
INDUSTRY checkboxes (multi-select with counts)
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
Header Section:

Page title: "Global [Market Name] Market Size & Outlook"
Small badge: "PDF Report Available"
Description paragraph (2-3 sentences of market summary)
Data Tree panel (collapsible right panel): shows taxonomy breadcrumb as a tree (Industry → Sub-industry → Market Outlook)

Secondary Tab Bar (sticky on scroll):
Overview | Dashboard | Statistics | Reports | Scope | Companies | Request Customization ℹ

Tab 1: Overview (default)
KPI Cards row (3 cards):

Revenue, [year] (US$B): large bold number with dollar icon
Forecast, [year] (US$B): large bold number with chart icon
CAGR, [start]-[end]: large bold % with trend icon
4th card: Report Coverage: "Worldwide" (geography label)

Main Chart: Bar Chart

Title: "[Market] market, [year range] (US$B)"
Interactive bar chart (Recharts BarChart)
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

Bullet-list of 5-6 key insights
"Global data book summary" table (2-col: metric / value)
"Other key industry trends" bullet list
"Key Regions" as linked chips

Market Scope Section:

Section title + purple banner header "Market segmentation & scope"
Segmentation grid table: columns for Source Type, Production Type, Application, End Use, Regions, Countries — each listing segment values as individual bordered boxes

Market Companies Preview Table:

Name | Profile link | # Employees | HQ | Website columns
8-10 rows, "View More" link to companies tab

Market Outlook Text:

Full editorial text about the market
Segment-specific sub-sections

Partial Client List sidebar widget:

Mini logo grid (GE Healthcare, Deloitte, KPMG, Accenture, Siemens, Google)

Related Markets Sidebar (right column):

List of 10-15 related geography/sub-market links (e.g. "North America [Market] Outlook")

"Horizon in a Snapshot" sidebar widget:

✓ 30K+ Global Market Reports
✓ 120K+ Country Reports
✓ 1.2M+ Market Statistics
✓ 200K+ Company Profiles
✓ Industry insights and more
"ANALYST CALLBACK" CTA button


Tab 2: Dashboard (Premium/Upgrade locked for free users)
When unlocked:

Dashboard title: "[Market Name] Market Size, [year range]"
Segment filter pills (multi-select): Global Dashboard, Source Type, Production Type, Application, End Use
Filter dropdowns top-right: Region selector, Country selector, Year selector
Main chart area: switches chart type based on segment pill selected
Chart renders bar/pie/line charts dynamically

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




Tab 5: Scope

Hierarchical bulleted list of all segments and sub-segments
E.g.:

"[Market] source type outlook (Revenue, USD Billion, 2018-2030)"

Human
Humanized
Chimeric


"[Market] production type outlook..."




Tab 6: Companies

Table: Name | Profile (link) | # Employees | HQ | Website
"View More" pagination


Tab 7: Request Customization ℹ

Brief info icon tooltip explaining custom report service
Form: name, company, requirements textarea, submit CTA


7. 🏢 Companies List Page (/companies)
Layout:

4 filter inputs in a row:

Company Search (text input)
Select Sector (dropdown)
Select Industry (dropdown)
Sort By (dropdown: Latest, A-Z, Revenue, Employees)


"Search" and "Reset" action buttons

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

"Market Reports" panel with linked market report items

News Tab:

List of news articles from external sources related to the company (if available, else "No news available" state)


9. 💡 Insights Pages
White Papers (/insights/white-papers):

3-column card grid
Each card: full-bleed editorial image + title + blurred overlay for locked content
"Unlock Premium 🔒" centered overlay CTA

Thought Leadership (/insights/thought-leadership):

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
Recent Visited:

List items sorted by most recent:

Badge: "Report"
Bar chart icon + report title (link)
Three quick links: Report Overview | Report Statistics | Report Dashboard
Timestamp ("6 minutes ago", "a day ago")



My Reports: Starred/saved items, same card format. Empty state: illustrated "No results found" with icon.
My Downloads: Downloaded files list with filename, date, format (PDF/CSV/XLS), re-download icon.


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
Auth flow: NextAuth.js with Credentials + Google OAuth
Session: JWT
Middleware: Protect all /app/(dashboard)/* routes
Redirect: Unauthenticated → /login
Access Control by Plan Tier:
FeatureFreeBasicPremiumEnterpriseView Overview stats✅✅✅✅Dashboard tab❌ (upgrade modal)✅✅✅Statistics (full)Partial (blurred rows)Up to 50010K+1M+Download CSV/XLS❌PNG only✅✅White Papers❌❌✅✅Thought Leadership❌❌✅✅Full Reports❌Buy separately1/year included25/year
Locked State Pattern: For any locked feature, show a semi-transparent overlay with:

Lock icon
Upgrade message
"Upgrade Plan" (filled) + "View Plans" (outlined) buttons


📊 Data Models (Prisma Schema Outline)
prismamodel User {
  id            String   @id @default(cuid())
  name          String
  email         String   @unique
  plan          Plan     @default(FREE)
  createdAt     DateTime @default(now())
  bookmarks     Bookmark[]
  recentVisited RecentVisit[]
}

enum Plan { FREE BASIC PREMIUM ENTERPRISE }

model Market {
  id          String  @id @default(cuid())
  slug        String  @unique
  title       String
  industry    String
  subIndustry String
  region      String
  description String
  revenue     Float
  forecast    Float
  cagr        Float
  yearStart   Int
  yearEnd     Int
  dataPoints  MarketDataPoint[]
  companies   MarketCompany[]
  segments    Segment[]
}

model MarketDataPoint {
  id       String @id @default(cuid())
  marketId String
  year     Int
  value    Float
  type     String  // "global" | "region" | "segment"
  market   Market @relation(fields: [marketId], references: [id])
}

model Company {
  id              String @id @default(cuid())
  slug            String @unique
  name            String
  sector          String
  industry        String
  hq              String
  employees       String
  revenue         String
  operatingStatus String
  website         String?
  phone           String?
  foundedYear     Int?
  ipoStatus       String?
  description     String?
}

model Bookmark {
  id       String @id @default(cuid())
  userId   String
  marketId String
  user     User   @relation(fields: [userId], references: [id])
}

model RecentVisit {
  id         String   @id @default(cuid())
  userId     String
  marketId   String
  visitedAt  DateTime @default(now())
  user       User     @relation(fields: [userId], references: [id])
}
```

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
1. /lib/auth.ts              ← NextAuth config
2. /lib/prisma.ts            ← Prisma client singleton
3. /components/layout/Sidebar.tsx
4. /components/layout/TopNav.tsx
5. /components/market/OverviewTab.tsx
6. /components/market/StatsTable.tsx
7. /components/market/DashboardTab.tsx
8. /components/charts/BarChartCard.tsx
9. /components/ui/PricingCard.tsx
10. /components/ui/PlanGate.tsx  ← Gated content wrapper
11. /app/api/markets/[slug]/route.ts
12. /app/api/search/route.ts

This prompt covers every page, interaction, data model, design token, and enhancement needed to build and surpass the reference portal. Start with the layout shell (sidebar + topnav), then the Home page, then the Market Outlook page (most complex), then Search, then Companies, then Profile/Auth flows.