'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ChevronDown, ChevronRight, Download, Share2, Bookmark, BookmarkCheck,
  Lock, Globe, TrendingUp, DollarSign, BarChart2, Building2, FileText,
  Settings, Info, ExternalLink, MapPin, Users, Globe2, Star
} from 'lucide-react'
import { mockMarkets } from '@/lib/mock-data'
import { useBookmarksStore } from '@/store/bookmarks-store'
import BarChartCard from '@/components/charts/BarChartCard'
import PlanGate from '@/components/ui/PlanGate'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
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
const PIE_COLORS = ['#0a0f1e', '#c8a96e', '#0d9488', '#0f2044']

const segmentData = [
  { name: '2018', human: 45, humanized: 38, chimeric: 22, murine: 10 },
  { name: '2019', human: 52, humanized: 44, chimeric: 23, murine: 9 },
  { name: '2020', human: 61, humanized: 50, chimeric: 25, murine: 9 },
  { name: '2021', human: 72, humanized: 58, chimeric: 27, murine: 8 },
  { name: '2022', human: 84, humanized: 65, chimeric: 29, murine: 8 },
  { name: '2023', human: 97, humanized: 72, chimeric: 31, murine: 8 },
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

export default function MarketOutlookPage({ params }: { params: { slug: string; region: string } }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [dataTreeOpen, setDataTreeOpen] = useState(false)
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar')
  const [segmentFilter, setSegmentFilter] = useState('global')

  const { toggleBookmark, isBookmarked, addRecentVisit } = useBookmarksStore()
  const market = mockMarkets.find(m => m.slug === params.slug) || mockMarkets[0]
  const bookmarked = isBookmarked(market.slug)

  // Log recent visit on mount
  useEffect(() => {
    addRecentVisit(market.slug)
  }, [market.slug, addRecentVisit])

  return (
    <div className="min-h-screen bg-surface-app">
      {/* ─── PAGE HEADER ─── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-dm text-gray-400 mb-4">
            <Link href="/" className="hover:text-brand-primary transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/industries" className="hover:text-brand-primary transition-colors">{market.industry}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-600">{market.title}</span>
          </nav>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-dm font-bold text-white bg-brand-accent">
                  PDF Report Available
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-dm font-medium text-brand-violet bg-brand-violet-light">
                  {market.industry}
                </span>
              </div>
              <h1 className="font-sora font-bold text-xl text-brand-primary leading-tight mb-2">
                Global {market.title} Market Size &amp; Outlook, {market.yearStart}–{market.yearEnd}
              </h1>
              <p className="font-dm text-sm text-gray-600 max-w-2xl leading-relaxed">
                {market.description}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => toggleBookmark(market.slug)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-dm font-medium border border-gray-200 hover:border-brand-accent hover:text-brand-accent transition-all">
                {bookmarked
                  ? <><BookmarkCheck className="w-4 h-4 text-brand-accent" /><span>Saved</span></>
                  : <><Bookmark className="w-4 h-4" /><span>Save</span></>}
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-dm font-medium border border-gray-200 hover:border-brand-primary hover:text-brand-primary transition-all">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-dm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: '#0a0f1e' }}>
                <Download className="w-4 h-4" />
                Buy Report
              </button>
            </div>
          </div>

          {/* Data Tree */}
          <button
            onClick={() => setDataTreeOpen(!dataTreeOpen)}
            className="flex items-center gap-2 mt-4 text-xs font-dm font-medium text-brand-accent hover:text-brand-secondary transition-colors">
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dataTreeOpen ? 'rotate-180' : ''}`} />
            Data Tree
          </button>
          {dataTreeOpen && (
            <div className="mt-2 p-3 bg-gray-50 rounded-xl text-xs font-dm text-gray-600 space-y-1">
              <div className="font-semibold text-brand-primary">{market.industry}</div>
              <div className="ml-4">└ {market.subIndustry}</div>
              <div className="ml-8">└ Global {market.title} Market Outlook, {market.yearStart}–{market.yearEnd}</div>
            </div>
          )}
        </div>

        {/* ─── STICKY TAB BAR ─── */}
        <div className="border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-0 overflow-x-auto scrollbar-none">
              {tabs.map(tab => (
                <button key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-dm font-medium border-b-2 transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-brand-accent text-brand-accent'
                      : 'border-transparent text-gray-500 hover:text-brand-primary'
                  }`}>
                  {tab.label}
                  {tab.icon && <tab.icon className="w-3 h-3" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── TAB CONTENT ─── */}
      <div className="max-w-7xl mx-auto px-6 py-6">

        {/* ════════════════════════ TAB 1: OVERVIEW ════════════════════════ */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-[1fr,300px] gap-6">
            {/* Main Content */}
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: `Revenue, ${market.yearStart} (US$B)`, value: `$${market.revenue}B`, icon: DollarSign, color: '#0a0f1e', bg: 'rgba(10,15,30,0.06)' },
                  { label: `Forecast, ${market.yearEnd} (US$B)`, value: `$${market.forecast}B`, icon: TrendingUp, color: '#c8a96e', bg: 'rgba(200,169,110,0.08)' },
                  { label: `CAGR, ${market.yearStart}–${market.yearEnd}`, value: `${market.cagr}%`, icon: BarChart2, color: '#0d9488', bg: 'rgba(13,148,136,0.06)' },
                  { label: 'Report Coverage', value: 'Worldwide', icon: Globe2, color: '#0f2044', bg: 'rgba(15,32,68,0.06)' },
                ].map(kpi => (
                  <div key={kpi.label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-card">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: kpi.bg }}>
                        <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
                      </div>
                    </div>
                    <div className="font-sora font-bold text-2xl mb-1" style={{ color: kpi.color }}>{kpi.value}</div>
                    <div className="text-xs font-dm text-gray-500 leading-tight">{kpi.label}</div>
                  </div>
                ))}
              </div>

              {/* Main Chart */}
              <BarChartCard
                title={`${market.title} market, ${market.yearStart}–${market.yearEnd} (US$B)`}
                data={market.dataPoints}
              />

              {/* Market Highlights */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card">
                <h3 className="font-sora font-semibold text-base text-brand-primary mb-4">Market Highlights</h3>
                <ul className="space-y-2.5 mb-6">
                  {market.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: 'rgba(0, 196, 204, 0.1)' }}>
                        <span className="text-brand-accent text-[10px] font-bold">✓</span>
                      </div>
                      <span className="text-sm font-dm text-gray-600 leading-relaxed">{highlight}</span>
                    </li>
                  ))}
                </ul>

                {/* Databook Summary Table */}
                <h4 className="font-sora font-semibold text-sm text-brand-primary mb-3">Global Databook Summary</h4>
                <table className="data-table w-full">
                  <thead>
                    <tr>
                      <th>Metric</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Market Size (2023)', `$${market.revenue}B`],
                      ['Market Size (2030)', `$${market.forecast}B`],
                      ['CAGR (2024–2030)', `${market.cagr}%`],
                      ['Forecast Period', `${market.yearStart}–${market.yearEnd}`],
                      ['Base Year', '2023'],
                      ['Leading Region', 'North America (42%)'],
                      ['Fastest Growing Region', 'Asia Pacific (14.2% CAGR)'],
                      ['Leading Application', 'Cancer Treatment (45%)'],
                    ].map(([metric, value]) => (
                      <tr key={metric}>
                        <td className="font-dm text-gray-600">{metric}</td>
                        <td className="font-dm font-semibold text-brand-primary">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Market Scope */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card">
                <div className="flex items-center gap-2 mb-5 p-3 rounded-xl"
                  style={{ background: '#0a0f1e' }}>
                  <span className="font-sora font-bold text-sm text-white">Market Segmentation &amp; Scope</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Source Type', items: ['Human', 'Humanized', 'Chimeric', 'Murine'] },
                    { label: 'Production Type', items: ['In-vitro', 'In-vivo', 'Transgenic', 'Recombinant'] },
                    { label: 'Application', items: ['Cancer', 'Autoimmune', 'Infectious Diseases', 'Others'] },
                    { label: 'End Use', items: ['Hospitals', 'Clinics', 'Academic Institutes', 'Others'] },
                    { label: 'Regions', items: ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'MEA'] },
                    { label: 'Countries', items: ['U.S.', 'Canada', 'Germany', 'UK', 'China', 'Japan', '+50 more'] },
                  ].map(seg => (
                    <div key={seg.label} className="border border-gray-100 rounded-xl p-3">
                      <div className="text-xs font-sora font-semibold text-brand-primary mb-2 pb-2 border-b border-gray-100">
                        {seg.label}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {seg.items.map(item => (
                          <span key={item}
                            className="px-2 py-0.5 rounded-md text-[10px] font-dm text-gray-600 bg-gray-50 border border-gray-200">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Companies Preview Table */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-sora font-semibold text-base text-brand-primary">Key Market Players</h3>
                  <button
                    onClick={() => setActiveTab('companies')}
                    className="text-xs font-dm font-medium text-brand-accent hover:text-brand-secondary transition-colors">
                    View All →
                  </button>
                </div>
                <table className="data-table w-full">
                  <thead>
                    <tr>
                      <th>Company Name</th>
                      <th>Employees</th>
                      <th>HQ</th>
                      <th>Website</th>
                    </tr>
                  </thead>
                  <tbody>
                    {market.companies.map(company => (
                      <tr key={company.name}>
                        <td>
                          <Link href={`/companies/${company.name.toLowerCase().replace(/\s+/g, '-')}`}
                            className="font-dm font-semibold text-brand-primary hover:text-brand-accent transition-colors">
                            {company.name}
                          </Link>
                        </td>
                        <td className="text-gray-600">{company.employees}</td>
                        <td className="text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            {company.hq}
                          </div>
                        </td>
                        <td>
                          <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-brand-accent hover:text-brand-secondary transition-colors text-xs">
                            {company.website}
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Market Outlook Text */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card">
                <h3 className="font-sora font-semibold text-base text-brand-primary mb-4">{market.title} Market Outlook</h3>
                <div className="space-y-4 font-dm text-sm text-gray-600 leading-relaxed">
                  <p>
                    The global {market.title.toLowerCase()} market is poised for substantial expansion over the forecast period,
                    driven by increasing prevalence of chronic diseases, rising geriatric population, and advancements in
                    biotechnology. The market reached USD {market.revenue} billion in {market.yearStart} and is projected to
                    grow at a CAGR of {market.cagr}% to reach USD {market.forecast} billion by {market.yearEnd}.
                  </p>
                  <p>
                    North America dominated the market in {market.yearStart}, accounting for over 42% of the total revenue.
                    The presence of major biopharmaceutical companies, strong R&amp;D investments, and favorable reimbursement
                    policies have been pivotal in driving growth in this region. The U.S. FDA has been actively approving
                    novel biologics, further fueling market expansion.
                  </p>
                  <p>
                    Asia Pacific is anticipated to be the fastest-growing region, with a CAGR of 14.2% during the forecast
                    period. Rapid improvements in healthcare infrastructure, growing awareness, rising disposable income,
                    and increasing government initiatives to improve access to biologics are key factors driving growth in
                    this region.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <aside className="space-y-5">
              {/* Related Markets */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-card">
                <h4 className="font-sora font-semibold text-sm text-brand-primary mb-3">Related Markets</h4>
                <div className="space-y-2">
                  {market.relatedMarkets.map(rm => (
                    <Link key={rm} href="#"
                      className="block text-xs font-dm text-gray-600 hover:text-brand-accent transition-colors py-1 border-b border-gray-50 last:border-0">
                      {rm}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Horizon Snapshot */}
              <div className="rounded-2xl p-5" style={{ background: '#0a0f1e' }}>
                <h4 className="font-sora font-semibold text-sm text-white mb-3">Horizon in a Snapshot</h4>
                <div className="space-y-2 mb-4">
                  {[
                    '30K+ Global Market Reports',
                    '120K+ Country Reports',
                    '1.2M+ Market Statistics',
                    '200K+ Company Profiles',
                    'Industry insights and more',
                  ].map(item => (
                    <div key={item} className="flex items-center gap-2">
                      <span className="text-brand-accent text-xs">✓</span>
                      <span className="text-xs font-dm text-white/70">{item}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full py-2 rounded-xl text-xs font-dm font-bold text-brand-primary bg-white hover:bg-gray-100 transition-colors">
                  ANALYST CALLBACK
                </button>
              </div>

              {/* Client Logos */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-card">
                <h4 className="font-sora font-semibold text-xs text-gray-400 uppercase tracking-wider mb-3">Trusted by</h4>
                <div className="grid grid-cols-3 gap-2">
                  {['GE', 'KPMG', 'Deloitte', 'Google', 'Siemens', 'Accenture'].map(logo => (
                    <div key={logo} className="flex items-center justify-center h-10 rounded-lg bg-gray-50 border border-gray-100">
                      <span className="text-xs font-sora font-bold text-gray-400">{logo}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Regions */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-card">
                <h4 className="font-sora font-semibold text-sm text-brand-primary mb-3">Key Regions</h4>
                <div className="flex flex-wrap gap-1.5">
                  {['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East & Africa'].map(region => (
                    <Link key={region} href="#"
                      className="px-2.5 py-1 rounded-lg text-xs font-dm text-gray-600 bg-gray-50 border border-gray-200 hover:border-brand-accent hover:text-brand-accent transition-all">
                      {region}
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* ════════════════════════ TAB 2: DASHBOARD ════════════════════════ */}
        {activeTab === 'dashboard' && (
          <PlanGate
            requiredPlan="BASIC"
            message="Upgrade to access the Interactive Dashboard"
            className="min-h-[500px]">
            <div />
          </PlanGate>
        )}

        {/* ════════════════════════ TAB 3: STATISTICS ════════════════════════ */}
        {activeTab === 'statistics' && (
          <div className="space-y-5">
            {/* Filters */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-card">
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
                  <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                    {['Tables', 'Charts'].map(view => (
                      <button key={view} className="px-3 py-1.5 text-xs font-dm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                        {view}
                      </button>
                    ))}
                  </div>
                  <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-sm font-dm font-medium text-gray-600 hover:border-brand-accent hover:text-brand-accent transition-all">
                    <Download className="w-3.5 h-3.5" />
                    Export All Tables
                  </button>
                </div>
              </div>
            </div>

            {/* Statistics Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h3 className="font-sora font-semibold text-sm text-brand-primary">
                  {market.title} Market Statistics, {market.yearStart}–{market.yearEnd}
                </h3>
                <div className="flex items-center gap-2">
                  <button>
                    <Star className="w-4 h-4 text-gray-400 hover:text-amber-400 transition-colors" />
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-dm text-gray-600 hover:border-brand-accent transition-colors">
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
                        <td className={row.locked ? 'blur-overlay select-none font-dm font-semibold text-brand-primary' : 'font-dm font-semibold text-brand-primary'}>
                          {row.value}
                        </td>
                        <td>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-dm font-semibold ${
                            row.type === 'revenue' ? 'bg-brand-navy/10 text-brand-primary' :
                            row.type === 'forecast' ? 'bg-brand-accent/10 text-brand-accent' :
                            row.type === 'cagr' ? 'bg-green-100 text-green-700' :
                            row.type === 'region' ? 'bg-violet-100 text-violet-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {row.type}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Unlock overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-48 flex flex-col items-center justify-end pb-6"
                  style={{ background: 'white' }}>
                  <button className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-dm font-semibold text-white"
                    style={{ background: '#0a0f1e' }}>
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
              { title: `Global ${market.title} Market Outlook, ${market.yearStart}–${market.yearEnd}`, pages: 185, published: 'Jan 2024', price: '$4,950' },
              { title: `North America ${market.title} Market Outlook, ${market.yearStart}–${market.yearEnd}`, pages: 120, published: 'Jan 2024', price: '$3,950' },
              { title: `Europe ${market.title} Market Outlook, ${market.yearStart}–${market.yearEnd}`, pages: 110, published: 'Feb 2024', price: '$3,950' },
              { title: `Asia Pacific ${market.title} Market Outlook, ${market.yearStart}–${market.yearEnd}`, pages: 115, published: 'Feb 2024', price: '$3,950' },
            ].map((report, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-card flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(26, 10, 74, 0.06)' }}>
                  {i === 0
                    ? <FileText className="w-5 h-5 text-brand-primary" />
                    : <Lock className="w-5 h-5 text-gray-300" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-sora font-semibold text-sm text-brand-primary mb-1 leading-snug">{report.title}</h4>
                  <p className="text-xs font-dm text-gray-500 mb-2">
                    {report.pages} pages · Published {report.published} · Covers all major segments &amp; geographies
                  </p>
                  <div className="flex items-center gap-3">
                    {['Report Overview', 'Report Statistics', 'View Full Report'].map(link => (
                      <Link key={link} href={`/outlook/${params.slug}/${params.region}`}
                        className="text-xs font-dm font-medium text-brand-accent hover:text-brand-secondary transition-colors">
                        {link}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-2">
                  <div className="font-sora font-bold text-lg text-brand-primary">{report.price}</div>
                  <div className="flex gap-2">
                    <button className="px-4 py-1.5 rounded-full text-xs font-dm font-bold text-white"
                      style={{ background: '#0a0f1e' }}>
                      Buy Now
                    </button>
                    <button className="px-4 py-1.5 rounded-full text-xs font-dm font-medium text-brand-primary border-2 border-brand-primary hover:bg-brand-primary hover:text-white transition-all">
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
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card">
            <h3 className="font-sora font-semibold text-base text-brand-primary mb-5">Market Scope &amp; Segmentation</h3>
            <div className="space-y-5">
              {[
                {
                  title: `${market.title} source type outlook (Revenue, USD Billion, ${market.yearStart}–${market.yearEnd})`,
                  items: ['Human', 'Humanized', 'Chimeric', 'Murine'],
                },
                {
                  title: `${market.title} production type outlook (Revenue, USD Billion, ${market.yearStart}–${market.yearEnd})`,
                  items: ['In-vitro Production', 'In-vivo Production', 'Transgenic Production', 'Recombinant Technology'],
                },
                {
                  title: `${market.title} application outlook (Revenue, USD Billion, ${market.yearStart}–${market.yearEnd})`,
                  items: ['Cancer', 'Autoimmune Disease', 'Infectious Diseases', 'Ophthalmic Diseases', 'Others'],
                },
                {
                  title: `${market.title} end use outlook (Revenue, USD Billion, ${market.yearStart}–${market.yearEnd})`,
                  items: ['Hospitals', 'Clinics', 'Academic & Research Institutes', 'Contract Research Organizations'],
                },
                {
                  title: `${market.title} regional outlook (Revenue, USD Billion, ${market.yearStart}–${market.yearEnd})`,
                  items: ['North America (U.S., Canada)', 'Europe (Germany, UK, France, Italy, Spain)', 'Asia Pacific (China, Japan, India, South Korea)', 'Latin America (Brazil, Mexico)', 'MEA (Saudi Arabia, UAE, South Africa)'],
                },
              ].map(section => (
                <div key={section.title}>
                  <h4 className="font-dm text-sm font-semibold text-brand-primary mb-2 pb-2 border-b border-gray-100">
                    {section.title}
                  </h4>
                  <ul className="space-y-1 ml-4">
                    {section.items.map(item => (
                      <li key={item} className="flex items-center gap-2 text-sm font-dm text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════════════════════ TAB 6: COMPANIES ════════════════════════ */}
        {activeTab === 'companies' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-sora font-semibold text-sm text-brand-primary">Market Companies</h3>
            </div>
            <table className="data-table w-full">
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>Profile</th>
                  <th># Employees</th>
                  <th>HQ</th>
                  <th>Website</th>
                </tr>
              </thead>
              <tbody>
                {market.companies.map(company => (
                  <tr key={company.name}>
                    <td>
                      <span className="font-dm font-semibold text-brand-primary">{company.name}</span>
                    </td>
                    <td>
                      <Link href={`/companies/${company.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-xs font-dm font-medium text-brand-accent hover:text-brand-secondary transition-colors">
                        View Profile
                      </Link>
                    </td>
                    <td className="text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-gray-400" />
                        {company.employees}
                      </div>
                    </td>
                    <td className="text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        {company.hq}
                      </div>
                    </td>
                    <td>
                      <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-brand-accent hover:text-brand-secondary transition-colors text-xs">
                        {company.website}
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4 border-t border-gray-100">
              <Link href="/companies" className="text-xs font-dm font-medium text-brand-accent hover:text-brand-secondary transition-colors">
                View All Companies →
              </Link>
            </div>
          </div>
        )}

        {/* ════════════════════════ TAB 7: CUSTOMIZATION ════════════════════════ */}
        {activeTab === 'customization' && (
          <div className="max-w-2xl">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(0, 196, 204, 0.1)' }}>
                  <Settings className="w-5 h-5 text-brand-accent" />
                </div>
                <div>
                  <h3 className="font-sora font-bold text-base text-brand-primary">Request Customization</h3>
                  <p className="font-dm text-xs text-gray-500">Tell us your specific research needs</p>
                </div>
              </div>
              <p className="font-dm text-sm text-gray-600 mb-5 leading-relaxed">
                Need a custom report tailored to your specific requirements? Our team of expert analysts can customize
                any report to include additional segments, geographies, or company profiles.
              </p>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-dm font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
                    <input type="text" placeholder="John Doe" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-dm font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Company</label>
                    <input type="text" placeholder="Your Company" className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-dm font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
                  <input type="email" placeholder="you@company.com" className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-dm font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Customization Requirements</label>
                  <textarea
                    placeholder="Describe the specific segments, geographies, companies, or data points you need..."
                    rows={5}
                    className="input-field resize-none" />
                </div>
                <button type="submit"
                  className="w-full py-3 rounded-xl text-sm font-dm font-bold text-white transition-all hover:opacity-90"
                  style={{ background: '#0a0f1e' }}>
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
