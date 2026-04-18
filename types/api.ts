// ── Generic API response wrappers ──

export interface ApiMeta {
  page: number
  limit: number
  total: number
  total_pages: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
  meta?: ApiMeta
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

// ── Auth ──

export interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  user: ApiUser
}

export interface RefreshResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  user: ApiUser
}

// ── User ──

export interface ApiUser {
  id: number
  email: string
  name: string
  role: string
  plan: string
  is_active: boolean
  last_login_at?: string
  created_at: string
  updated_at: string
}

// ── Report ──

export interface MarketMetrics {
  currentRevenue: number
  currentYear: number
  forecastRevenue: number
  forecastYear: number
  cagr: number
  cagrStartYear: number
  cagrEndYear: number
}

export interface KeyPlayer {
  name: string
  marketShare?: number
  rank?: number
  description?: string
}

export interface ReportSections {
  keyPlayers?: string
  marketDetails?: string
  tableOfContents?: string
}

export interface FAQ {
  question: string
  answer: string
}

export interface ApiReport {
  id: number
  category_id: number
  category_name: string
  category_slug?: string
  title: string
  slug: string
  description: string
  summary: string
  price: number
  discounted_price: number
  currency: string
  page_count: number
  formats: string[]
  geography: string
  status: string
  is_featured: boolean
  publish_date: string
  market_metrics: MarketMetrics | null
  key_players: KeyPlayer[] | null
  sections: ReportSections | null
  faqs: FAQ[] | null
  meta_title: string
  meta_description: string
  meta_keywords: string[]
  created_at: string
  updated_at: string
}

// ── Category ──

export interface ApiCategory {
  id: number
  name: string
  slug: string
  description: string
  image_url: string
  is_active: boolean
  report_count?: number
  created_at: string
  updated_at: string
}

// ── Author ──

export interface ApiAuthor {
  id: number
  name: string
  role: string
  bio: string
  image_url: string
  linkedin_url: string
}

// ── Blog ──

export interface ApiBlog {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  category_id: number
  tags: string[]
  author_id: number
  status: string
  category?: ApiCategory
  author?: ApiAuthor
  metadata?: Record<string, unknown>
  publish_date: string
  created_at: string
}

// ── Press Release ──

export interface ApiPressRelease {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  category_id: number
  tags: string[]
  author_id: number
  status: string
  report_url?: string
  category?: ApiCategory
  author?: ApiAuthor
  metadata?: Record<string, unknown>
  publish_date: string
  created_at: string
}

// ── Form ──

export interface FormSubmissionRequest {
  category: string
  data: Record<string, unknown>
  page_url?: string
  referrer?: string
}

// ── Order ──

export interface CreateOrderRequest {
  customer_name: string
  customer_email: string
  customer_company?: string
  customer_phone?: string
  customer_country: string
  report_slug: string
  payment_method: 'paypal' | 'stripe'
}

export interface ApiOrder {
  id: number
  customer_name: string
  customer_email: string
  customer_company: string
  customer_phone: string
  customer_country: string
  report_id: number
  report_title: string
  report_slug: string
  amount: number
  currency: string
  payment_method: string
  status: string
  paypal_order_id?: string
  stripe_payment_intent_id?: string
  created_at: string
  updated_at: string
}
