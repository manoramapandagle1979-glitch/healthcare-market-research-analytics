export type Plan = 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE'

export interface MarketDataPoint {
  year: number
  value: number
  segment?: string
  region?: string
}

export interface MarketCompany {
  name: string
  employees: string
  hq: string
  website: string
}

export interface Market {
  slug: string
  title: string
  industry: string
  subIndustry: string
  region: string
  description: string
  revenue: number
  forecast: number
  cagr: number
  yearStart: number
  yearEnd: number
  dataPoints: MarketDataPoint[]
  segments: string[]
  companies: MarketCompany[]
  highlights: string[]
  relatedMarkets: string[]
  type: 'Report' | 'Databook' | 'Statistics'
}

export interface Company {
  slug: string
  name: string
  sector: string
  industry: string
  hq: string
  employees: string
  revenue: string
  operatingStatus: 'Active' | 'Inactive' | 'Acquired' | 'IPO Pending'
  website: string
  foundedYear: number
  ipoStatus: 'Public' | 'Private' | 'Subsidiary'
  description: string
  tags?: string[]
  marketCap?: string
}

export interface SubIndustry {
  id: string
  name: string
  marketCount: number
}

export interface Industry {
  id: string
  name: string
  subIndustries: string[]
  marketCount?: number
}

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  plan: Plan
  joinedAt: string
}

export interface Bookmark {
  marketSlug: string
  addedAt: string
}

export interface RecentVisit {
  marketSlug: string
  visitedAt: string
}

export interface PricingPlan {
  id: string
  name: string
  price: number
  period: string | null
  users: number
  cta: string
  description: string
  features: { label: string; included: boolean }[]
  highlighted: boolean
  badge: string | null
}

export interface SearchFilters {
  query: string
  types: string[]
  industries: string[]
  subIndustries: string[]
  sortBy: 'relevant' | 'newest' | 'cagr' | 'az'
}
