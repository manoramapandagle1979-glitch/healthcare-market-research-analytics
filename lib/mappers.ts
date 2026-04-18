import type { ApiReport, ApiCategory, KeyPlayer, ApiUser } from '@/types/api'
import type { Market, MarketDataPoint, MarketCompany, Company, Industry, User } from '@/types'

/**
 * Maps a backend ApiReport to the frontend Market type used by all page components.
 */
export function mapReportToMarket(report: ApiReport): Market {
  const metrics = report.market_metrics
  const revenue = metrics?.currentRevenue ?? 0
  const forecast = metrics?.forecastRevenue ?? 0
  const cagr = metrics?.cagr ?? 0
  const yearStart = metrics?.currentYear ?? new Date().getFullYear()
  const yearEnd = metrics?.forecastYear ?? yearStart + 5

  // Interpolate yearly data points between current and forecast revenue
  const dataPoints: MarketDataPoint[] = []
  const years = yearEnd - yearStart
  if (years > 0 && revenue > 0) {
    for (let i = 0; i <= years; i++) {
      const t = i / years
      // Exponential growth interpolation using CAGR
      const value = revenue * Math.pow(1 + cagr / 100, i)
      dataPoints.push({ year: yearStart + i, value: Math.round(value * 100) / 100 })
    }
  } else {
    dataPoints.push({ year: yearStart, value: revenue })
  }

  // Map key players to MarketCompany
  const companies: MarketCompany[] = (report.key_players ?? []).map((kp) => ({
    name: kp.name,
    employees: '',
    hq: '',
    website: '',
  }))

  // Extract segments from description or use geography
  const segments = report.formats ?? []

  // Build highlights from summary
  const highlights: string[] = []
  if (report.summary) {
    const sentences = report.summary.split(/\.\s+/).filter(Boolean)
    highlights.push(...sentences.slice(0, 3).map((s) => (s.endsWith('.') ? s : s + '.')))
  }

  // Extract related market slugs (empty — populated at page level from category reports)
  const relatedMarkets: string[] = []

  return {
    slug: report.slug,
    title: report.title,
    industry: report.category_name ?? '',
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
    name: category.name,
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
