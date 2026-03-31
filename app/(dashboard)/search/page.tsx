'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X, SlidersHorizontal, BarChart2, FileText, Database, TrendingUp, ChevronDown } from 'lucide-react'
import { mockMarkets } from '@/lib/mock-data'
import { mockIndustries } from '@/lib/mock-data'

const resultTypes = [
  { id: 'Report', label: 'Report', icon: FileText },
  { id: 'Databook', label: 'Databook', icon: Database },
  { id: 'Statistics', label: 'Statistics', icon: BarChart2 },
]

const sortOptions = [
  { value: 'relevant', label: 'Most Relevant' },
  { value: 'newest', label: 'Newest First' },
  { value: 'cagr', label: 'Highest CAGR' },
  { value: 'az', label: 'A–Z' },
]

function SearchPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [inputValue, setInputValue] = useState(searchParams.get('q') || '')
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    searchParams.get('type') ? searchParams.get('type')!.split(',') : []
  )
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(
    searchParams.get('industry') ? searchParams.get('industry')!.split(',') : []
  )
  const [showMoreIndustries, setShowMoreIndustries] = useState(false)
  const [sortBy, setSortBy] = useState<'relevant' | 'newest' | 'cagr' | 'az'>(
    (searchParams.get('sort') as 'relevant' | 'cagr' | 'az' | 'newest') || 'relevant'
  )

  useEffect(() => {
    const timer = setTimeout(() => setQuery(inputValue), 300)
    return () => clearTimeout(timer)
  }, [inputValue])

  const syncURL = useCallback(() => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (selectedTypes.length) params.set('type', selectedTypes.join(','))
    if (selectedIndustries.length) params.set('industry', selectedIndustries.join(','))
    if (sortBy !== 'relevant') params.set('sort', sortBy)
    const qs = params.toString()
    router.replace(`/search${qs ? `?${qs}` : ''}`, { scroll: false })
  }, [query, selectedTypes, selectedIndustries, sortBy, router])

  useEffect(() => {
    syncURL()
  }, [syncURL])

  const toggleFilter = (arr: string[], setArr: (v: string[]) => void, value: string) => {
    setArr(arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value])
  }

  const clearAll = () => {
    setSelectedTypes([])
    setSelectedIndustries([])
    setQuery('')
    setInputValue('')
    setSortBy('relevant')
  }

  const hasFilters = selectedTypes.length > 0 || selectedIndustries.length > 0 || query !== ''

  let results = mockMarkets.map((m) => ({ ...m }))

  if (query) {
    const q = query.toLowerCase()
    results = results.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.industry.toLowerCase().includes(q) ||
        r.subIndustry.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
    )
  }

  if (selectedTypes.length > 0) {
    results = results.filter((r) => selectedTypes.includes(r.type))
  }

  if (selectedIndustries.length > 0) {
    results = results.filter((r) =>
      selectedIndustries.some((id) => {
        const ind = mockIndustries.find((i) => i.id === id)
        return ind && r.industry.toLowerCase().includes(ind.name.toLowerCase().split(' ')[0])
      })
    )
  }

  if (sortBy === 'cagr') results = [...results].sort((a, b) => b.cagr - a.cagr)
  else if (sortBy === 'az') results = [...results].sort((a, b) => a.title.localeCompare(b.title))
  else if (sortBy === 'newest') results = [...results].sort((a, b) => b.yearEnd - a.yearEnd)

  const baseResults = mockMarkets.filter((m) => {
    if (!query) return true
    const q = query.toLowerCase()
    return m.title.toLowerCase().includes(q) || m.industry.toLowerCase().includes(q)
  })
  const typeCounts = resultTypes.map((t) => ({
    ...t,
    count: baseResults.filter((r) => r.type === t.id).length,
  }))

  const industryCounts = mockIndustries.map((ind) => ({
    ...ind,
    count: baseResults.filter((r) =>
      r.industry.toLowerCase().includes(ind.name.toLowerCase().split(' ')[0])
    ).length,
  })).filter((i) => i.count > 0)

  return (
    <div className="min-h-screen bg-surface-app page-content">
      {/* Search Header */}
      <div className="bg-white border-b" style={{ borderColor: '#e5e1d8' }}>
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search market statistics & reports..."
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-dm focus:outline-none focus:ring-2 focus:ring-[#c8a96e]/30 focus:border-[#c8a96e] transition-all"
                style={{ border: '1px solid #e5e1d8' }}
              />
              {inputValue && (
                <button
                  onClick={() => { setInputValue(''); setQuery('') }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button onClick={() => setQuery(inputValue)}
              className="btn-primary px-6 active:scale-[0.97]">Search</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 flex gap-6">
        {/* Left Filter Panel — sticky */}
        <aside className="w-64 shrink-0">
          <div className="bg-white rounded-2xl shadow-card p-5 sticky top-[88px]"
            style={{ border: '1px solid #e5e1d8' }}>
            {/* Subtle top gradient fade */}
            <div className="absolute top-0 left-0 right-0 h-6 rounded-t-2xl pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, rgba(248,247,244,0.6), transparent)' }} />

            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" style={{ color: '#0a0f1e' }} />
                <span className="font-sora font-semibold text-sm" style={{ color: '#0a0f1e' }}>Filters</span>
              </div>
              {hasFilters && (
                <button onClick={clearAll} className="text-xs font-dm font-medium transition-colors"
                  style={{ color: '#c8a96e' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#b8924f')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#c8a96e')}>
                  Reset all
                </button>
              )}
            </div>

            {/* TYPE */}
            <div className="mb-6">
              <h4 className="font-sora font-semibold text-xs uppercase tracking-widest text-gray-400 mb-3">TYPE</h4>
              <div className="space-y-2">
                {typeCounts.map((type) => {
                  const Icon = type.icon
                  const checked = selectedTypes.includes(type.id)
                  return (
                    <label key={type.id} className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleFilter(selectedTypes, setSelectedTypes, type.id)}
                        className="w-4 h-4 rounded cursor-pointer checkbox-gold"
                        style={{ accentColor: '#c8a96e', borderColor: '#e5e1d8' }}
                      />
                      <Icon className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-sm font-dm text-gray-600 group-hover:text-[#0a0f1e] transition-colors flex-1">
                        {type.label}
                      </span>
                      <span className="text-xs font-dm text-gray-400">{type.count}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* INDUSTRY */}
            <div className="mb-6">
              <h4 className="font-sora font-semibold text-xs uppercase tracking-widest text-gray-400 mb-3">INDUSTRY</h4>
              <div className="space-y-2">
                {industryCounts.slice(0, showMoreIndustries ? undefined : 8).map((ind) => {
                  const checked = selectedIndustries.includes(ind.id)
                  return (
                    <label key={ind.id} className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleFilter(selectedIndustries, setSelectedIndustries, ind.id)}
                        className="w-4 h-4 rounded cursor-pointer checkbox-gold"
                        style={{ accentColor: '#c8a96e', borderColor: '#e5e1d8' }}
                      />
                      <span className="text-sm font-dm text-gray-600 group-hover:text-[#0a0f1e] transition-colors flex-1 truncate">
                        {ind.name}
                      </span>
                      <span className="text-xs font-dm text-gray-400 shrink-0">{ind.count}</span>
                    </label>
                  )
                })}
                {!showMoreIndustries && industryCounts.length > 8 && (
                  <button
                    onClick={() => setShowMoreIndustries(true)}
                    className="text-xs font-dm font-medium transition-colors flex items-center gap-1"
                    style={{ color: '#c8a96e' }}>
                    <ChevronDown className="w-3 h-3" />
                    {industryCounts.length - 8} more
                  </button>
                )}
                {showMoreIndustries && (
                  <button
                    onClick={() => setShowMoreIndustries(false)}
                    className="text-xs font-dm font-medium text-gray-400 hover:text-gray-600 transition-colors">
                    Show less
                  </button>
                )}
              </div>
            </div>

            {/* Active Filters */}
            {(selectedTypes.length > 0 || selectedIndustries.length > 0) && (
              <div>
                <h4 className="font-sora font-semibold text-xs uppercase tracking-widest text-gray-400 mb-2">ACTIVE FILTERS</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTypes.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-dm font-medium"
                      style={{ color: '#c8a96e', background: 'rgba(200,169,110,0.10)' }}>
                      {t}
                      <button onClick={() => toggleFilter(selectedTypes, setSelectedTypes, t)}>
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                  {selectedIndustries.map((id) => {
                    const ind = mockIndustries.find((i) => i.id === id)
                    return ind ? (
                      <span key={id} className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-dm font-medium"
                        style={{ color: '#6366f1', background: '#eef2ff' }}>
                        {ind.name.split(' ')[0]}
                        <button onClick={() => toggleFilter(selectedIndustries, setSelectedIndustries, id)}>
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ) : null
                  })}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Results Panel */}
        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-5">
            <div>
              <span className="font-sora font-semibold text-lg" style={{ color: '#0a0f1e' }}>
                {results.length} Results
              </span>
              {query && (
                <span className="font-dm text-sm text-gray-500 ml-2">for &ldquo;{query}&rdquo;</span>
              )}
            </div>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'relevant' | 'cagr' | 'az' | 'newest')}
                className="input-field w-auto text-sm py-2 pr-8 appearance-none cursor-pointer">
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {results.length > 0 ? (
            <div className="space-y-4">
              {results.map((result) => (
                <div key={result.slug}
                  className="bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300 group"
                  style={{ border: '1px solid #e5e1d8' }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(200,169,110,0.30)'}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = '#e5e1d8'}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(10,15,30,0.05)' }}>
                      <BarChart2 className="w-5 h-5" style={{ color: '#0a0f1e' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-dm font-bold text-white ${
                          result.type === 'Databook' ? 'bg-[#6366f1]' :
                          result.type === 'Statistics' ? 'bg-[#059669]' : 'bg-[#0a0f1e]'
                        }`}>
                          {result.type}
                        </span>
                        <span className="text-xs font-dm text-gray-400">{result.industry}</span>
                        <span className="text-gray-200">·</span>
                        <span className="text-xs font-dm text-gray-400">{result.subIndustry}</span>
                      </div>
                      <Link
                        href={`/outlook/${result.slug}/global`}
                        className="font-sora font-semibold text-sm leading-snug block mb-2 transition-colors"
                        style={{ color: '#0a0f1e' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#c8a96e')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#0a0f1e')}>
                        Global {result.title} Market Outlook, {result.yearStart}–{result.yearEnd}
                      </Link>
                      <p className="text-xs font-dm text-gray-500 mb-3 line-clamp-2">{result.description}</p>
                      <div className="flex items-center flex-wrap gap-4 text-xs font-dm text-gray-400">
                        <span>Revenue: <strong style={{ color: '#0a0f1e' }}>${result.revenue}B</strong></span>
                        <span>Forecast: <strong style={{ color: '#0a0f1e' }}>${result.forecast}B</strong></span>
                        <span className="inline-flex items-center gap-1">
                          CAGR:
                          <strong className="inline-flex items-center gap-0.5" style={{ color: '#059669' }}>
                            <TrendingUp className="w-3 h-3" />
                            {result.cagr}%
                          </strong>
                        </span>
                        <span>Segments: <strong style={{ color: '#0a0f1e' }}>{result.segments.length}</strong></span>
                      </div>
                      <div className="flex items-center gap-3 mt-3 pt-3" style={{ borderTop: '1px solid #f0ece4' }}>
                        {['Overview', 'Statistics', 'View Full Report'].map((link, i) => (
                          <Link key={link} href={`/outlook/${result.slug}/global`}
                            className={`text-xs font-dm font-medium transition-colors ${
                              i === 2 ? 'font-semibold' : ''
                            }`}
                            style={{ color: i === 2 ? '#c8a96e' : '#9ca3af' }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#c8a96e')}
                            onMouseLeave={e => (e.currentTarget.style.color = i === 2 ? '#c8a96e' : '#9ca3af')}>
                            {link}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty state */
            <div className="text-center py-20 bg-white rounded-2xl shadow-card"
              style={{ border: '1px solid #e5e1d8' }}>
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: 'rgba(10,15,30,0.05)' }}>
                <Search className="w-9 h-9" style={{ color: 'rgba(10,15,30,0.25)' }} />
              </div>
              <h3 className="font-sora font-semibold text-lg mb-2" style={{ color: '#0a0f1e' }}>No results found</h3>
              <p className="font-dm text-gray-500 text-sm mb-5">Try a different search term or adjust your filters</p>
              <button onClick={clearAll} className="btn-outline text-xs px-4 py-2">Clear all filters</button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface-app flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: '#c8a96e', borderTopColor: 'transparent' }} />
      </div>
    }>
      <SearchPageInner />
    </Suspense>
  )
}
