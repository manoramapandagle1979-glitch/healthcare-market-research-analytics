import type { ApiReport, ApiCategory, KeyPlayer, ApiUser } from '@/types/api'
import type { Market, MarketDataPoint, MarketCompany, Company, Industry, User } from '@/types'

/**
 * Maps a backend ApiReport to the frontend Market type used by all page components.
 */
export function mapReportToMarket(report: ApiReport): Market {
  const metrics = report.market_metrics

  // ── Step 1: CAGR — prefer new numeric field, fall back to parsing metrics string ──
  let cagrValue: number | undefined
  if (report.cagr != null) {
    cagrValue = report.cagr
  } else if (metrics?.cagr != null) {
    // metrics.cagr is typed as number in MarketMetrics but may come as a string like "57.54%"
    const raw = String(metrics.cagr).replace('%', '')
    const parsed = parseFloat(raw)
    if (!isNaN(parsed)) cagrValue = parsed
  }
  const cagr = cagrValue ?? 0

  // ── Revenue / forecast ──
  const revenue = metrics?.currentRevenue ?? 0
  const forecast = metrics?.forecastRevenue ?? 0

  // ── Step 2: Year range — prefer new fields, fall back to metrics ──
  const yearStart =
    report.year_start ??
    metrics?.cagrStartYear ??
    metrics?.currentYear ??
    new Date().getFullYear()
  const yearEnd =
    report.year_end ??
    metrics?.cagrEndYear ??
    metrics?.forecastYear ??
    yearStart + 5

  // ── Step 3: Chart dataPoints ──
  // baseValue: parse from market_metrics.currentRevenue if available; else null
  const baseValue = metrics?.currentRevenue ?? null
  const dataPoints: MarketDataPoint[] = []
  if (baseValue != null && baseValue > 0) {
    const years = yearEnd - yearStart
    if (years > 0) {
      for (let i = 0; i <= years; i++) {
        // Exponential growth interpolation using CAGR
        const value = baseValue * Math.pow(1 + cagr / 100, i)
        dataPoints.push({ year: yearStart + i, value: Math.round(value * 100) / 100 })
      }
    } else {
      dataPoints.push({ year: yearStart, value: baseValue })
    }
  }
  // If baseValue is null, dataPoints stays as empty array — do NOT fabricate revenue data

  // ── Step 7 (key players): null-safe — if key_players is null or empty, use [] ──
  const companies: MarketCompany[] = (report.key_players ?? []).map((kp) => ({
    name: kp.name,
    employees: '',
    hq: '',
    website: '',
  }))

  // Extract segments from formats
  const segments = report.formats ?? []

  // Build highlights from summary
  const highlights: string[] = []
  if (report.summary) {
    const sentences = report.summary.split(/\.\s+/).filter(Boolean)
    highlights.push(...sentences.slice(0, 3).map((s) => (s.endsWith('.') ? s : s + '.')))
  }

  // Extract related market slugs (empty — populated at page level from category reports)
  const relatedMarkets: string[] = []

  // ── Step 6: Sections ──
  const tableOfContents = report.sections?.tableOfContents ?? ''

  // ── Step 5: segmentation — report.segmentation takes precedence ──
  const segmentation = report.segmentation || ''

  // ── Step 5: methodology ──
  const methodology = report.methodology || ''

  // ── Step 5: excerpt ──
  const excerpt = report.excerpt || report.description?.slice(0, 300) || ''

  // ── Step 5: industry ──
  const industry = report.industry || report.category_name || ''

  // ── Step 5: tags ──
  const tags = report.tags ?? []

  // ── Step 4: prices ──
  const prices = report.prices

  return {
    slug: report.slug,
    title: report.title,
    industry,
    subIndustry: '',
    region: report.geography ?? 'Global',
    description: report.description,
    revenue,
    forecast,
    cagr,
    yearStart,
    yearEnd,
    dataPoints,
    segments,
    companies,
    highlights,
    relatedMarkets,
    type: 'Report',
    // Extended fields
    cagrValue,
    prices,
    segmentation,
    methodology,
    excerpt,
    tags,
    tableOfContents: tableOfContents || undefined,
  }
}

/**
 * Maps a backend ApiCategory + its reports into the frontend Industry type.
 */
export function mapCategoryToIndustry(category: ApiCategory, reports: ApiReport[] = []): Industry {
  // Extract unique sub-industry terms from report titles
  const subIndustries = new Set<string>()
  reports.forEach((r) => {
    // Use the first part of the title before " Market" as a sub-industry hint
    const match = r.title.match(/^(.+?)\s+Market/i)
    if (match) {
      subIndustries.add(match[1].trim())
    }
  })

  return {
    id: String(category.id),
    slug: category.slug,
    name: category.name.trim(),
    subIndustries: Array.from(subIndustries).slice(0, 20),
    marketCount: category.report_count ?? reports.length,
  }
}

/**
 * Maps a backend KeyPlayer (from a report) into the frontend Company type.
 */
export function mapKeyPlayerToCompany(player: KeyPlayer, report: ApiReport): Company {
  const slug = player.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  return {
    slug,
    name: player.name,
    sector: report.category_name ?? '',
    industry: report.category_name ?? '',
    hq: '',
    employees: '',
    revenue: '',
    operatingStatus: 'Active',
    website: '',
    foundedYear: 0,
    ipoStatus: 'Private',
    description: player.description ?? `Key player in the ${report.title} market.`,
  }
}

/**
 * Maps a backend ApiUser to the frontend User type.
 */
export function mapApiUserToUser(apiUser: ApiUser): User {
  const plan = (apiUser.plan as User['plan']) || 'FREE'
  return {
    id: String(apiUser.id),
    name: apiUser.name,
    email: apiUser.email,
    avatar: '',
    plan,
    joinedAt: apiUser.created_at,
  }
}
