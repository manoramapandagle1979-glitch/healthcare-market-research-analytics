'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  ChevronDown, ChevronRight, Download, Share2, Bookmark, BookmarkCheck,
  Lock, TrendingUp, BarChart2, FileText,
  Settings, Info, Star,
} from 'lucide-react'
import { wpCatalog, wpMarkets as mockMarkets, wpIndustriesAsIndustry as mockIndustries, getReportAISummary, type WpReportFull } from '@/lib/wp-data'
import { useBookmarksStore } from '@/store/bookmarks-store'
import { useUserStore } from '@/store/user-store'
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

// ---------------------------
// Static data for statistics tab
// ---------------------------
const statisticsData = [
  { metric: 'Global Market Size, 2023 (USD Billion)', value: '211.4', type: 'revenue', locked: false },
  { metric: 'Market Forecast, 2030 (USD Billion)', value: '498.7', type: 'forecast', locked: false },
  { metric: 'CAGR, 2024-2030', value: '11.2%', type: 'cagr', locked: false },
  { metric: 'North America Market Size, 2023 (USD Billion)', value: '88.8', type: 'region', locked: false },
  { metric: 'Europe Market Size, 2023 (USD Billion)', value: '63.4', type: 'region', locked: false },
  { metric: 'Asia Pacific Market Size, 2023 (USD Billion)', value: '42.3', type: 'region', locked: true },
  { metric: 'Latin America Market Size, 2023 (USD Billion)', value: '12.1', type: 'region', locked: true },
  { metric: 'MEA Market Size, 2023 (USD Billion)', value: '4.8', type: 'region', locked: true },
  { metric: 'Human mAbs Revenue Share, 2023', value: '45.2%', type: 'segment', locked: true },
  { metric: 'Humanized mAbs Revenue Share, 2023', value: '35.6%', type: 'segment', locked: true },
]

const pieData = [
  { name: 'North America', value: 42 },
  { name: 'Europe', value: 30 },
  { name: 'Asia Pacific', value: 20 },
  { name: 'Rest of World', value: 8 },
]
const PIE_COLORS = ['#091426', '#006a61', '#86f2e4', '#1c0048']

const segmentData = [
  { name: '2018', human: 45, humanized: 38, chimeric: 22, murine: 10 },
  { name: '2019', human: 52, humanized: 44, chimeric: 23, murine: 9 },
  { name: '2020', human: 61, humanized: 50, chimeric: 25, murine: 9 },
  { name: '2021', human: 72, humanized: 58, chimeric: 27, murine: 8 },
  { name: '2022', human: 84, humanized: 65, chimeric: 29, murine: 8 },
  { name: '2023', human: 97, humanized: 72, chimeric: 31, murine: 8 },
]

const regionalBarData = [
  { year: '2018', 'North America': 45.2, 'Europe': 38.1, 'Asia Pacific': 22.0, 'RoW': 10.1 },
  { year: '2019', 'North America': 54.1, 'Europe': 44.2, 'Asia Pacific': 27.3, 'RoW': 11.8 },
  { year: '2020', 'North America': 65.8, 'Europe': 52.0, 'Asia Pacific': 33.7, 'RoW': 13.9 },
  { year: '2021', 'North America': 74.3, 'Europe': 58.1, 'Asia Pacific': 38.1, 'RoW': 15.2 },
  { year: '2022', 'North America': 82.6, 'Europe': 60.9, 'Asia Pacific': 40.4, 'RoW': 17.1 },
  { year: '2023', 'North America': 88.8, 'Europe': 63.4, 'Asia Pacific': 42.3, 'RoW': 16.9 },
  { year: '2025E', 'North America': 118.2, 'Europe': 83.7, 'Asia Pacific': 62.8, 'RoW': 22.3 },
  { year: '2027E', 'North America': 152.1, 'Europe': 108.4, 'Asia Pacific': 88.3, 'RoW': 30.1 },
  { year: '2030E', 'North America': 209.3, 'Europe': 148.7, 'Asia Pacific': 135.2, 'RoW': 45.5 },
]

const pieData2030 = [
  { name: 'North America', value: 39 },
  { name: 'Europe', value: 28 },
  { name: 'Asia Pacific', value: 25 },
  { name: 'Rest of World', value: 8 },
]

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'statistics', label: 'Statistics' },
  { id: 'reports', label: 'Reports' },
  { id: 'scope', label: 'Scope' },
  { id: 'companies', label: 'Companies' },
  { id: 'customization', label: 'Request Customization', icon: Info },
]

// ─── Market growth chart ───

function formatUSD(billions: number): string {
  if (billions >= 1000) return `USD ${(billions / 1000).toFixed(2)}T`
  if (billions < 1) return `USD ${(billions * 1000).toFixed(0)}M`
  return `USD ${billions % 1 === 0 ? billions : billions.toFixed(1)}B`
}

function formatAxisTick(billions: number): string {
  if (billions >= 1000) return `$${(billions / 1000).toFixed(1)}T`
  if (billions < 1) return `$${Math.round(billions * 1000)}M`
  return `$${billions % 1 === 0 ? billions : billions.toFixed(0)}B`
}

interface GrowthPoint { year: string; size: number; projected: boolean }

function parseMarketUSD(html: string, yearLabel: string, prefix = 'Market Size in'): number | null {
  const pattern = new RegExp(
    `${prefix}\\s*${yearLabel}[^<]*<\\/td>[\\s\\S]{1,120}?USD\\s*([\\d,.]+)\\s*(billion|million|trillion)`,
    'i',
  )
  const m = html.match(pattern)
  if (!m) return null
  const raw = parseFloat(m[1].replace(/,/g, ''))
  const unit = m[2].toLowerCase()
  if (unit === 'trillion') return parseFloat((raw * 1000).toFixed(2))
  if (unit === 'million') return parseFloat((raw / 1000).toFixed(3))
  return raw
}

function buildMarketGrowthData(
  baseYear: number, yearStart: number, yearEnd: number,
  sizeBase: number | null, sizeCurrent: number | null, sizeProjected: number | null, cagr: number,
): GrowthPoint[] {
  const anchor = sizeBase ?? (sizeCurrent ? sizeCurrent / Math.pow(1 + cagr / 100, yearStart - baseYear) : null)
  if (!anchor) return []
  const known: Record<number, number> = {}
  if (sizeBase) known[baseYear] = sizeBase
  if (sizeCurrent) known[yearStart] = sizeCurrent
  if (sizeProjected) known[yearEnd] = sizeProjected
  const result: GrowthPoint[] = []
  for (let y = baseYear; y <= yearEnd; y++) {
    const size = known[y] ?? parseFloat((anchor * Math.pow(1 + cagr / 100, y - baseYear)).toFixed(3))
    result.push({ year: String(y), size, projected: y > yearStart })
  }
  return result
}

const HIST_COLOR = '#0d1f3c'
const FCST_COLOR = '#6fd6ce'

function MarketGrowthChart({ wpFull, marketTitle, cagr, yearStart, yearEnd }: {
  wpFull: WpReportFull | null; marketTitle: string; cagr: number; yearStart: number; yearEnd: number
}) {
  const html = wpFull?.description ?? ''
  const baseYear = wpFull?.baseYear ?? yearStart - 1
  const sizeBase = parseMarketUSD(html, String(baseYear))
  const sizeCurrent = parseMarketUSD(html, String(yearStart))
  const sizeProjected = parseMarketUSD(html, String(yearEnd), 'Projected Market Size in')
  const data = buildMarketGrowthData(baseYear, yearStart, yearEnd, sizeBase, sizeCurrent, sizeProjected, cagr)
  if (!data.length || !cagr) {
    return (
      <div className="bg-white rounded-xl border border-outline-variant/20 shadow-card overflow-hidden">
        <div className="px-5 pt-5 pb-3">
          <h4 className="font-headline font-semibold text-[13px] text-primary leading-snug">
            {marketTitle} market size
          </h4>
        </div>
        <div className="flex items-center justify-center h-[280px] text-muted-foreground text-sm text-on-surface-variant font-body">
          Market size data coming soon
        </div>
      </div>
    )
  }
  const maxVal = Math.max(...data.map(d => d.size))
  const yTickCount = 5
  const yMax = Math.ceil(maxVal / (yTickCount - 1)) * (yTickCount - 1)
  return (
    <div className="bg-white rounded-xl border border-outline-variant/20 shadow-card overflow-hidden">
      <div className="px-5 pt-5 pb-3">
        <h4 className="font-headline font-semibold text-[13px] text-primary leading-snug">
          {marketTitle} market, {baseYear}–{yearEnd} (US$B)
        </h4>
        <p className="text-[11px] font-body mt-0.5" style={{ color: '#006a61' }}>
          US$B &nbsp;·&nbsp; {cagr}% CAGR
        </p>
      </div>
      <div className="px-4 pb-2">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }} barCategoryGap="18%">
            <CartesianGrid strokeDasharray="" stroke="rgba(0,0,0,0.07)" vertical={false} />
            <XAxis dataKey="year" tick={{ fontSize: 11, fontFamily: 'inherit', fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <YAxis tickCount={yTickCount} domain={[0, yMax]} tick={{ fontSize: 11, fontFamily: 'inherit', fill: '#6b7280' }}
              tickFormatter={formatAxisTick} axisLine={false} tickLine={false} width={58} />
            <Tooltip
              cursor={{ fill: 'rgba(0,0,0,0.04)' }}
              formatter={(v: number, _name: string, props: { payload?: GrowthPoint }) => [
                formatUSD(v), props.payload?.projected ? 'Forecast' : 'Historical',
              ]}
              labelFormatter={(l: string) => `Year ${l}`}
              contentStyle={{ fontSize: 12, fontFamily: 'inherit', borderRadius: 8, border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', background: '#fff', color: '#111827' }}
              labelStyle={{ color: '#111827', fontWeight: 600 }}
              itemStyle={{ color: '#374151' }}
            />
            <Bar dataKey="size" radius={[4, 4, 0, 0]} maxBarSize={48}>
              {data.map((entry, i) => <Cell key={i} fill={entry.projected ? FCST_COLOR : HIST_COLOR} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="px-5 pb-5 flex items-center justify-between gap-4 border-t border-gray-100 pt-3">
        <div className="flex items-center gap-5 text-[11px] font-body text-on-surface-variant">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ background: HIST_COLOR }} />Historical
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ background: FCST_COLOR }} />Forecast
          </span>
        </div>
        <div className="flex items-center gap-6 text-right">
          {[{ label: `${yearStart}`, val: sizeCurrent }, { label: `${yearEnd}E`, val: sizeProjected }]
            .filter(x => x.val != null).map(({ label, val }) => (
              <div key={label}>
                <div className="font-headline font-bold text-sm text-primary">{formatUSD(val!)}</div>
                <div className="text-[10px] font-body text-on-surface-variant">{label}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

// ─── Locked chart wrapper: blurs content and shows an unlock CTA for free users ───
function LockedChart({
  title,
  children,
  height = 300,
}: {
  title: string
  children: React.ReactNode
  height?: number
}) {
  const { user } = useUserStore()
  const locked = user.plan === 'FREE'

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-card overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-surface-container">
        <span className="font-headline font-semibold text-sm text-primary">{title}</span>
        <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-outline-variant text-xs font-body text-on-surface-variant hover:border-secondary transition-colors">
          <Download className="w-3 h-3 mr-0.5" />
          Download
        </button>
      </div>
      <div className="relative p-4" style={{ minHeight: height }}>
        <div className={locked ? 'blur-sm pointer-events-none select-none opacity-70' : ''}>
          {children}
        </div>
        {locked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Link
              href="/pricing"
              className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-body font-bold shadow-2xl hover:opacity-90 transition-opacity"
              style={{ background: 'var(--signal)', color: '#fff' }}
            >
              <Lock className="w-3.5 h-3.5" />
              Unlock Premium
              <span className="text-xs opacity-80">▲</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default function MarketOutlookClient({
  params,
  wpFull,
}: {
  params: { slug: string; region: string }
  wpFull: WpReportFull | null
}) {
  const [activeTab, setActiveTab] = useState('overview')
  const [dataTreeOpen, setDataTreeOpen] = useState(false)

  const { toggleBookmark, isBookmarked, addRecentVisit } = useBookmarksStore()
  const market = mockMarkets.find(m => m.slug === params.slug) || mockMarkets[0]
  const wpSummary = wpCatalog.find(r => r.slug === market.slug)
  const aiSummary = getReportAISummary(market.slug)
  const industryId = mockIndustries.find(i => i.name.toLowerCase() === market.industry.toLowerCase())?.id ?? ''
  const bookmarked = isBookmarked(market.slug)

  // Related markets: same industry, ranked by tag overlap. Falls back to recency.
  const relatedMarkets = useMemo(() => {
    if (!wpSummary) return [] as typeof wpCatalog
    const myTags = new Set(wpSummary.tags.map(t => t.toLowerCase()))
    const candidates = wpCatalog.filter(
      r => r.slug !== wpSummary.slug && r.industry === wpSummary.industry,
    )
    const scored = candidates.map(r => {
      let overlap = 0
      for (const t of r.tags) if (myTags.has(t.toLowerCase())) overlap++
      return { r, overlap }
    })
    scored.sort((a, b) =>
      b.overlap - a.overlap ||
      (b.r.modified || '').localeCompare(a.r.modified || ''),
    )
    return scored.slice(0, 6).map(s => s.r)
  }, [wpSummary])

  // Log recent visit on mount
  useEffect(() => {
    addRecentVisit(market.slug)
  }, [market.slug, addRecentVisit])

  return (
    <div className="min-h-screen bg-paper">
      {/* ═══════════ EDITORIAL TOP-FOLD ═══════════ */}
      <section className="relative overflow-hidden bg-ink text-white noise-overlay" style={{ background: '#0b1220' }}>
        {/* Ambient signal wash */}
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[640px] h-[640px] rounded-full opacity-[0.18] blur-3xl"
               style={{ background: 'radial-gradient(circle, var(--signal) 0%, transparent 60%)' }} />
          <div className="absolute -bottom-60 -left-20 w-[520px] h-[520px] rounded-full opacity-[0.14] blur-3xl"
               style={{ background: 'radial-gradient(circle, var(--ember) 0%, transparent 60%)' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-8 pb-0">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.14em] text-white/45 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={industryId ? `/search?industry=${industryId}` : '/industries'} className="hover:text-white transition-colors">{market.industry}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/80 normal-case tracking-normal font-body">{market.title}</span>
          </nav>

          <div className="grid grid-cols-[1fr_auto] gap-8 items-end mb-10">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-signal/15 text-[#6fd6ce] border border-signal/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6fd6ce] animate-pulse" />
                  Live Outlook
                </span>
                <Link
                  href={industryId ? `/search?industry=${industryId}` : '/industries'}
                  className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider text-white/60 bg-white/5 border border-white/10 hover:text-white hover:border-white/25 transition-all"
                >
                  {market.industry}
                </Link>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider text-white/60 bg-white/5 border border-white/10">
                  {market.yearStart}–{market.yearEnd}
                </span>
              </div>

              <h1 className="font-display text-[3rem] leading-[1.02] tracking-[-0.035em] text-white mb-5 max-w-3xl" style={{ fontWeight: 600 }}>
                Global {market.title}{' '}
                <span className="font-display-italic text-[#eadfc6]" style={{ fontWeight: 500 }}>market size</span>{' '}
                &amp; outlook.
              </h1>

              <p className="font-body text-[15px] max-w-2xl leading-[1.65]" style={{ color: 'rgba(255,255,255,0.88)' }}
                dangerouslySetInnerHTML={{ __html: market.description }}
              />
            </div>

            {/* Action stack */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => toggleBookmark(market.slug)}
                aria-label={bookmarked ? 'Remove bookmark' : 'Save to bookmarks'}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-white/30 text-white/80 hover:text-white hover:border-white/60 transition-all"
              >
                {bookmarked ? <BookmarkCheck className="w-4 h-4 text-[#6fd6ce]" /> : <Bookmark className="w-4 h-4" />}
              </button>
              <button
                aria-label="Share"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-white/30 text-white/80 hover:text-white hover:border-white/60 transition-all"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                className="group flex items-center gap-2 pl-5 pr-4 py-2.5 rounded-full text-sm font-semibold bg-white hover:bg-[#6fd6ce] transition-all"
                style={{ color: '#0b1220', boxShadow: '0 8px 24px -8px rgba(13,107,99,0.55)' }}
              >
                Buy Report
                <span className="w-6 h-6 rounded-full flex items-center justify-center group-hover:translate-x-0.5 transition-transform" style={{ background: '#0b1220' }}>
                  <Download className="w-3 h-3" style={{ color: '#ffffff' }} />
                </span>
              </button>
            </div>
          </div>

          {/* ─── Oversized stat row ─── */}
          <div className="grid grid-cols-3 divide-x divide-white/10 border-y border-white/10 -mx-6 px-6">
            {[
              {
                label: `CAGR ${market.yearStart}–${market.yearEnd}`,
                value: market.cagr ? `${market.cagr}` : '—',
                suffix: market.cagr ? '%' : '',
                hint: 'Compounded annual growth',
              },
              {
                label: 'Report Length',
                value: wpSummary?.pages || '—',
                suffix: wpSummary?.pages ? 'pages' : '',
                hint: wpSummary?.publishedDate ? `Published ${wpSummary.publishedDate}` : 'Comprehensive coverage',
              },
              {
                label: 'Single License',
                value: wpSummary?.prices?.single ? `$${wpSummary.prices.single.toLocaleString()}` : '—',
                suffix: '',
                hint: wpSummary?.prices?.enterprise
                  ? `Enterprise from $${wpSummary.prices.enterprise.toLocaleString()}`
                  : 'Tiered licensing available',
              },
            ].map((stat, i) => (
              <div key={stat.label} className={`py-8 ${i === 0 ? 'pr-8' : i === 2 ? 'pl-8' : 'px-8'}`}>
                <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/40 mb-3">
                  {stat.label}
                </div>
                <div className="flex items-baseline gap-1.5 mb-2 overflow-hidden">
                  <span className="font-display leading-none tracking-[-0.045em] tabular-nums" style={{ fontWeight: 600, fontSize: 'clamp(2.5rem, 5vw, 5rem)', color: '#ffffff' }}>
                    {stat.value}
                  </span>
                  {stat.suffix && (
                    <span className="font-mono text-2xl tabular-nums font-semibold" style={{ color: '#6fd6ce' }}>{stat.suffix}</span>
                  )}
                </div>
                <div className="text-xs font-body" style={{ color: 'rgba(255,255,255,0.75)' }}>{stat.hint}</div>
              </div>
            ))}
          </div>

          {/* Optional data tree */}
          <div className="pt-6 pb-6">
            <button
              onClick={() => setDataTreeOpen(!dataTreeOpen)}
              className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.14em] text-white/50 hover:text-white transition-colors"
            >
              <ChevronDown className={`w-3 h-3 transition-transform ${dataTreeOpen ? 'rotate-180' : ''}`} />
              Data tree
            </button>
            {dataTreeOpen && (
              <div className="mt-3 p-3 rounded-lg text-xs font-body text-white/65 space-y-1 bg-white/5 border border-white/10">
                <div className="font-semibold text-white">{market.industry}</div>
                <div className="ml-4">└ {market.subIndustry}</div>
                <div className="ml-8">└ Global {market.title} Market Outlook, {market.yearStart}–{market.yearEnd}</div>
              </div>
            )}
          </div>
        </div>
      </section>


      {/* ─── TAB CONTENT ─── */}
      <div className="max-w-7xl mx-auto px-6 py-6">

        {/* ════════════════════════ TAB 1: OVERVIEW ════════════════════════ */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-[1fr,300px] gap-6">
            {/* Main Content */}
            <div className="space-y-6">
              {/* KPI Cards — only metrics the WP report actually carries */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  {
                    label: `CAGR, ${market.yearStart}–${market.yearEnd}`,
                    value: (market.cagr && market.cagr > 0) ? `${market.cagr}%` : 'N/A',
                    icon: TrendingUp,
                    color: '#006a61',
                    bg: 'rgba(0,106,97,0.08)',
                  },
                  wpSummary?.pages && {
                    label: 'Report Length',
                    value: wpSummary.pages,
                    icon: FileText,
                    color: '#091426',
                    bg: 'rgba(9,20,38,0.06)',
                  },
                  wpSummary?.publishedDate && {
                    label: 'Published',
                    value: wpSummary.publishedDate,
                    icon: Info,
                    color: '#1c0048',
                    bg: 'rgba(28,0,72,0.06)',
                  },
                  wpSummary?.prices?.single && {
                    label: 'Single User License',
                    value: `$${wpSummary.prices.single.toLocaleString()}`,
                    icon: BarChart2,
                    color: '#006a61',
                    bg: 'rgba(0,106,97,0.06)',
                  },
                ].filter(Boolean).map((kpi) => {
                  const k = kpi as { label: string; value: string; icon: typeof TrendingUp; color: string; bg: string }
                  return (
                    <div key={k.label} className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-4 shadow-card">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: k.bg }}>
                          <k.icon className="w-4 h-4" style={{ color: k.color }} />
                        </div>
                      </div>
                      <div className="font-headline font-bold text-2xl mb-1" style={{ color: k.color }}>{k.value}</div>
                      <div className="text-xs font-body text-on-surface-variant leading-tight">{k.label}</div>
                    </div>
                  )
                })}
              </div>

              {/* Market Highlights — key bullet-point findings */}
              {(() => {
                const descHtml = wpFull?.description || ''
                const highlights = descHtml
                  ? (descHtml.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [])
                      .map(m => m.replace(/<[^>]+>/g, '').trim())
                      .filter(Boolean)
                      .slice(0, 5)
                  : []
                if (highlights.length > 0) {
                  return (
                    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6 shadow-card">
                      <h4 className="font-headline font-semibold text-sm text-primary mb-4">Market Highlights</h4>
                      <ul className="space-y-2.5">
                        {highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm font-body text-on-surface-variant leading-relaxed">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                }
                // Fallback: show market description (up to 1000 chars)
                const fallbackDesc = market.description?.trim() || ''
                if (fallbackDesc) {
                  return (
                    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6 shadow-card">
                      <h4 className="font-headline font-semibold text-sm text-primary mb-4">Market Overview</h4>
                      <p className="text-sm font-body text-on-surface-variant leading-relaxed">
                        {fallbackDesc.slice(0, 1000)}
                      </p>
                    </div>
                  )
                }
                return null
              })()}

              {/* Market Growth Chart */}
              <MarketGrowthChart
                wpFull={wpFull}
                marketTitle={market.title}
                cagr={market.cagr}
                yearStart={market.yearStart}
                yearEnd={market.yearEnd}
              />

              {/* Global Databook Summary — drawn from real WP fields */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6 shadow-card">
                <h4 className="font-headline font-semibold text-sm text-primary mb-3">Global Databook Summary</h4>
                <table className="data-table w-full">
                  <thead>
                    <tr>
                      <th>Metric</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      wpSummary?.studyPeriod && ['Study Period', wpSummary.studyPeriod],
                      wpSummary?.baseYear && ['Base Year', String(wpSummary.baseYear)],
                      market.cagr > 0 && ['CAGR', `${market.cagr}%`],
                      wpSummary?.pages && ['Report Pages', wpSummary.pages],
                      wpSummary?.publishedDate && ['Published Date', wpSummary.publishedDate],
                      ['Industry', market.industry],
                      wpSummary?.categories?.length && ['Categories', wpSummary.categories.join(', ')],
                      wpSummary?.regions?.length && ['Regions Covered', wpSummary.regions.join(', ')],
                    ].filter(Boolean).map((row) => {
                      const [metric, value] = row as [string, string]
                      return (
                        <tr key={metric}>
                          <td className="font-body text-on-surface-variant">{metric}</td>
                          <td className="font-body font-semibold text-primary">{value}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Key Players — render the WP HTML when present */}
              {wpFull?.keyPlayers && wpFull.keyPlayers.trim() && (
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6 shadow-card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-headline font-semibold text-base text-primary">Key Market Players</h3>
                    <button
                      onClick={() => setActiveTab('companies')}
                      className="text-xs font-body font-medium text-secondary hover:text-on-secondary-fixed-variant transition-colors">
                      View All →
                    </button>
                  </div>
                  <div
                    className="wp-prose"
                    dangerouslySetInnerHTML={{ __html: wpFull.keyPlayers }}
                  />
                </div>
              )}

              {/* Market Segmentation — extracted segmentation dimensions from the WP report */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6 shadow-card">
                <h3 className="font-headline font-semibold text-base text-primary mb-4">{market.title} Market Segmentation</h3>
                {wpFull?.segmentation ? (
                  <div
                    className="wp-prose"
                    dangerouslySetInnerHTML={{ __html: wpFull.segmentation }}
                  />
                ) : (
                  <div className="font-body text-sm text-on-surface-variant leading-relaxed">
                    <p>Segmentation data not available.</p>
                  </div>
                )}
              </div>

              {/* Market Summary — pre-generated prose from reports.summaries.json */}
              {aiSummary && (
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6 shadow-card">
                  <h3 className="font-headline font-semibold text-base text-primary mb-4">{market.title} Market Summary</h3>
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed whitespace-pre-wrap">{aiSummary}</p>
                </div>
              )}

            </div>

            {/* Right Sidebar */}
            <aside className="space-y-5">
              {/* Related Markets — derived from the WP catalog by industry + tag overlap */}
              {relatedMarkets.length > 0 && (
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-5 shadow-card">
                  <h4 className="font-headline font-semibold text-sm text-primary mb-3">Related Markets</h4>
                  <div className="space-y-2">
                    {relatedMarkets.map(rm => (
                      <Link key={rm.slug} href={`/outlook/${rm.slug}/global`}
                        className="block text-xs font-body text-on-surface-variant hover:text-secondary transition-colors py-1.5 border-b border-surface-container last:border-0">
                        {rm.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="space-y-2.5">
                <button
                  onClick={() => setActiveTab('customization')}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-body font-bold text-white bg-primary hover:opacity-90 transition-opacity shadow-md"
                >
                  <Settings className="w-4 h-4" />
                  Request Customization
                </button>
                <button
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-body font-bold border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all"
                >
                  <FileText className="w-4 h-4" />
                  Request Sample
                </button>
              </div>

              {/* Curator Snapshot */}
              <div className="rounded-xl p-5 bg-primary">
                <h4 className="font-headline font-semibold text-sm text-white mb-3">Curator in a Snapshot</h4>
                <div className="space-y-2 mb-4">
                  {[
                    '30K+ Global Market Reports',
                    '120K+ Country Reports',
                    '1.2M+ Market Statistics',
                    '200K+ Company Profiles',
                    'Industry insights and more',
                  ].map(item => (
                    <div key={item} className="flex items-center gap-2">
                      <span className="text-secondary-fixed text-xs">✓</span>
                      <span className="text-xs font-body text-white/70">{item}</span>
                    </div>
                  ))}
                </div>
                <Link href="/book-analyst-call" className="block w-full py-2 rounded-xl text-xs font-body font-bold text-primary bg-white hover:bg-surface-container-low transition-colors text-center">
                  Book Analyst Call
                </Link>
              </div>

              {/* Client Logos */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-5 shadow-card">
                <h4 className="font-headline font-semibold text-xs text-on-surface-variant uppercase tracking-wider mb-3">Trusted by</h4>
                <div className="grid grid-cols-3 gap-2">
                  {['GE', 'KPMG', 'Deloitte', 'Google', 'Siemens', 'Accenture'].map(logo => (
                    <div key={logo} className="flex items-center justify-center h-10 rounded-lg bg-surface-container border border-outline-variant/15">
                      <span className="text-xs font-headline font-bold text-on-surface-variant">{logo}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Regions */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-5 shadow-card">
                <h4 className="font-headline font-semibold text-sm text-primary mb-3">Key Regions</h4>
                <div className="flex flex-wrap gap-1.5">
                  {['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East & Africa'].map(r => (
                    <Link key={r} href={`/outlook/${params.slug}/${r.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`}
                      className="px-2.5 py-1 rounded-lg text-xs font-body text-on-surface-variant bg-surface-container border border-outline-variant/20 hover:border-secondary hover:text-secondary transition-all">
                      {r}
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* ════════════════════════ TAB 2: DASHBOARD ════════════════════════ */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">

            {/* Stacked regional bar chart */}
            <LockedChart
              title={`${market.title} market size by region, ${market.yearStart}–${market.yearEnd} (US$B)`}
              height={340}
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={regionalBarData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                  <XAxis dataKey="year" tick={{ fontSize: 11, fontFamily: 'inherit' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fontFamily: 'inherit' }} tickFormatter={(v) => `$${v}B`} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v) => [`$${v}B`]} />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
                  <Bar dataKey="North America" stackId="a" fill="#091426" />
                  <Bar dataKey="Europe" stackId="a" fill="#006a61" />
                  <Bar dataKey="Asia Pacific" stackId="a" fill="#86f2e4" />
                  <Bar dataKey="RoW" stackId="a" fill="#1c0048" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </LockedChart>

            {/* Pie charts — 2023 vs 2030 side by side */}
            <div className="grid grid-cols-2 gap-6">
              <LockedChart
                title={`${market.title} market share, 2023 (USD Billion)`}
                height={300}
              >
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [`${v}%`]} />
                  </PieChart>
                </ResponsiveContainer>
              </LockedChart>

              <LockedChart
                title={`${market.title} market share, 2030 Forecast (USD Billion)`}
                height={300}
              >
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={pieData2030}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine
                    >
                      {pieData2030.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [`${v}%`]} />
                  </PieChart>
                </ResponsiveContainer>
              </LockedChart>
            </div>

            {/* Statistics table by application */}
            <LockedChart
              title={`${market.title} market statistics by application, 2021–2030 (US$B)`}
              height={260}
            >
              <div className="overflow-x-auto">
                <table className="data-table w-full text-xs">
                  <thead>
                    <tr>
                      <th className="min-w-[180px] text-left">Application</th>
                      {['2021', '2022', '2023', '2024E', '2025E', '2026E', '2027E', '2028E', '2029E', '2030E'].map(y => (
                        <th key={y} className="text-center">{y}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { seg: 'Cancer',              vals: ['95.2', '111.4', '130.8', '152.6', '177.4', '204.8', '234.6', '268.2', '304.8', '344.9'] },
                      { seg: 'Autoimmune Disease',  vals: ['48.1', '55.6', '63.8', '73.1', '83.8', '95.4', '108.2', '122.4', '138.1', '155.6'] },
                      { seg: 'Infectious Diseases', vals: ['22.4', '26.1', '30.4', '35.2', '40.8', '47.1', '54.2', '62.1', '71.0', '81.0'] },
                      { seg: 'Ophthalmic Diseases', vals: ['18.7', '21.4', '24.8', '28.6', '33.0', '37.8', '43.2', '49.2', '55.8', '63.2'] },
                      { seg: 'Others',              vals: ['14.1', '16.2', '18.6', '21.2', '24.1', '27.4', '30.9', '34.9', '39.3', '44.2'] },
                    ].map(row => (
                      <tr key={row.seg}>
                        <td className="font-body font-medium text-on-surface">{row.seg}</td>
                        {row.vals.map((v, i) => (
                          <td key={i} className="font-body text-on-surface-variant text-center">{v}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </LockedChart>

          </div>
        )}

        {/* ════════════════════════ TAB 3: STATISTICS ════════════════════════ */}
        {activeTab === 'statistics' && (
          <div className="space-y-5">
            {/* Filters */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-4 shadow-card">
              <div className="flex items-center gap-4 flex-wrap">
                {['Markets', 'Regions', 'Segments'].map(filter => (
                  <select key={filter} className="input-field w-auto py-2 text-sm">
                    <option>All {filter}</option>
                    <option>Global</option>
                    <option>North America</option>
                    <option>Europe</option>
                  </select>
                ))}
                <div className="ml-auto flex items-center gap-2">
                  <div className="flex rounded-lg border border-outline-variant overflow-hidden">
                    {['Tables', 'Charts'].map(view => (
                      <button key={view} className="px-3 py-1.5 text-xs font-body font-medium text-on-surface-variant hover:bg-surface-container transition-colors">
                        {view}
                      </button>
                    ))}
                  </div>
                  <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-outline-variant text-sm font-body font-medium text-on-surface-variant hover:border-secondary hover:text-secondary transition-all">
                    <Download className="w-3.5 h-3.5" />
                    Export All Tables
                  </button>
                </div>
              </div>
            </div>

            {/* Statistics Table */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-card overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-surface-container">
                <h3 className="font-headline font-semibold text-sm text-primary">
                  {market.title} Market Statistics, {market.yearStart}–{market.yearEnd}
                </h3>
                <div className="flex items-center gap-2">
                  <button>
                    <Star className="w-4 h-4 text-outline hover:text-amber-400 transition-colors" />
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-outline-variant text-xs font-body text-on-surface-variant hover:border-secondary transition-colors">
                    <Download className="w-3 h-3" />
                    Download
                  </button>
                </div>
              </div>
              <div className="relative">
                <table className="data-table w-full">
                  <thead>
                    <tr>
                      <th className="min-w-[260px]">Metric</th>
                      <th>Value</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statisticsData.map((row, i) => (
                      <tr key={i} className={row.locked ? 'relative' : ''}>
                        <td className={row.locked ? 'blur-overlay select-none' : ''}>{row.metric}</td>
                        <td className={row.locked ? 'blur-overlay select-none font-body font-semibold text-primary' : 'font-body font-semibold text-primary'}>
                          {row.value}
                        </td>
                        <td>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-body font-semibold ${
                            row.type === 'revenue' ? 'bg-primary/10 text-primary' :
                            row.type === 'forecast' ? 'bg-secondary/10 text-secondary' :
                            row.type === 'cagr' ? 'bg-green-100 text-green-700' :
                            row.type === 'region' ? 'bg-tertiary/10 text-tertiary' :
                            'bg-surface-container text-on-surface-variant'
                          }`}>
                            {row.type}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Unlock overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-48 flex flex-col items-center justify-end pb-6 bg-surface-container-lowest">
                  <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-body font-semibold text-white bg-primary">
                    <Lock className="w-3.5 h-3.5" />
                    Unlock Premium to View All Statistics
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════ TAB 4: REPORTS ════════════════════════ */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            {[
              {
                title: `Global ${market.title} Market Outlook, ${market.yearStart}–${market.yearEnd}`,
                pages: wpSummary?.pages || '—',
                published: wpSummary?.publishedDate || '—',
                price: wpSummary?.prices.single ? `$${wpSummary.prices.single.toLocaleString()}` : '—',
              },
              { title: `North America ${market.title} Market Outlook, ${market.yearStart}–${market.yearEnd}`, pages: 120, published: 'Jan 2024', price: '$3,950' },
              { title: `Europe ${market.title} Market Outlook, ${market.yearStart}–${market.yearEnd}`, pages: 110, published: 'Feb 2024', price: '$3,950' },
              { title: `Asia Pacific ${market.title} Market Outlook, ${market.yearStart}–${market.yearEnd}`, pages: 115, published: 'Feb 2024', price: '$3,950' },
            ].map((report, i) => (
              <div key={i} className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-5 shadow-card flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-tertiary/8">
                  {i === 0
                    ? <FileText className="w-5 h-5 text-primary" />
                    : <Lock className="w-5 h-5 text-outline" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-headline font-semibold text-sm text-primary mb-1 leading-snug">{report.title}</h4>
                  <p className="text-xs font-body text-on-surface-variant mb-2">
                    {report.pages} pages · Published {report.published} · Covers all major segments &amp; geographies
                  </p>
                  <div className="flex items-center gap-3">
                    {['Report Overview', 'Report Statistics', 'View Full Report'].map(link => (
                      <Link key={link} href={`/outlook/${params.slug}/${params.region}`}
                        className="text-xs font-body font-medium text-secondary hover:text-on-secondary-fixed-variant transition-colors">
                        {link}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-2">
                  <div className="font-headline font-bold text-lg text-primary">{report.price}</div>
                  <div className="flex gap-2">
                    <button className="px-4 py-1.5 rounded-xl text-xs font-body font-bold text-white bg-primary">
                      Buy Now
                    </button>
                    <button className="px-4 py-1.5 rounded-xl text-xs font-body font-medium text-primary border-2 border-primary hover:bg-primary hover:text-white transition-all">
                      Talk to Analyst
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ════════════════════════ TAB 5: SCOPE ════════════════════════ */}
        {activeTab === 'scope' && (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6 shadow-card">
            <h3 className="font-headline font-semibold text-base text-primary mb-5">Market Scope &amp; Segmentation</h3>
            {/* Use market.segmentation (HTML) if non-empty, else wpFull segmentation, else tableOfContents, else placeholder */}
            {(market.segmentation && market.segmentation.trim()) ? (
              <div
                className="wp-prose"
                dangerouslySetInnerHTML={{ __html: market.segmentation }}
              />
            ) : (wpFull?.segmentation && wpFull.segmentation.trim()) ? (
              <div
                className="wp-prose"
                dangerouslySetInnerHTML={{ __html: wpFull.segmentation }}
              />
            ) : (market.tableOfContents && market.tableOfContents.trim()) ? (
              <div
                className="wp-prose"
                dangerouslySetInnerHTML={{ __html: market.tableOfContents }}
              />
            ) : (wpFull?.tableOfContents && wpFull.tableOfContents.trim()) ? (
              <div
                className="wp-prose"
                dangerouslySetInnerHTML={{ __html: wpFull.tableOfContents }}
              />
            ) : (
              <p className="text-sm font-body text-on-surface-variant">Scope data coming soon.</p>
            )}
          </div>
        )}

        {/* ════════════════════════ TAB 6: COMPANIES ════════════════════════ */}
        {activeTab === 'companies' && (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-card overflow-hidden">
            <div className="p-4 border-b border-surface-container">
              <h3 className="font-headline font-semibold text-sm text-primary">Key Players Profiled</h3>
            </div>
            <div className="p-6">
              {wpFull?.keyPlayers && wpFull.keyPlayers.trim() ? (
                <div
                  className="wp-prose"
                  dangerouslySetInnerHTML={{ __html: wpFull.keyPlayers }}
                />
              ) : (market.companies && market.companies.length > 0) ? (
                <ul className="space-y-2">
                  {market.companies.map((c) => (
                    <li key={c.name} className="text-sm font-body text-on-surface-variant py-1.5 border-b border-surface-container last:border-0">
                      {c.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <p className="text-sm font-body text-on-surface-variant">Company data not yet available for this market.</p>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-surface-container">
              <Link href="/companies" className="text-xs font-body font-medium text-secondary hover:text-on-secondary-fixed-variant transition-colors">
                Browse all companies →
              </Link>
            </div>
          </div>
        )}

        {/* ════════════════════════ TAB 7: CUSTOMIZATION ════════════════════════ */}
        {activeTab === 'customization' && (
          <div className="max-w-2xl">
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6 shadow-card">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary/10">
                  <Settings className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-headline font-bold text-base text-primary">Request Customization</h3>
                  <p className="font-body text-xs text-on-surface-variant">Tell us your specific research needs</p>
                </div>
              </div>
              <p className="font-body text-sm text-on-surface-variant mb-5 leading-relaxed">
                Need a custom report tailored to your specific requirements? Our team of expert analysts can customize
                any report to include additional segments, geographies, or company profiles.
              </p>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-body font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Full Name</label>
                    <input type="text" placeholder="John Doe" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-body font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Company</label>
                    <input type="text" placeholder="Your Company" className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-body font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Email</label>
                  <input type="email" placeholder="you@company.com" className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-body font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Customization Requirements</label>
                  <textarea
                    placeholder="Describe the specific segments, geographies, companies, or data points you need..."
                    rows={5}
                    className="input-field resize-none" />
                </div>
                <button type="submit"
                  className="w-full py-3 rounded-xl text-sm font-body font-bold text-white bg-primary transition-all hover:opacity-90">
                  Submit Customization Request
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
