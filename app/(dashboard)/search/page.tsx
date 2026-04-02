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
    <div className="min-h-screen bg-background page-content">
      {/* Search Header */}
      <div className="bg-surface-container-lowest border-b border-surface-container-high">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search market statistics & reports..."
                className="input-field pl-10"
              />
              {inputValue && (
                <button
                  onClick={() => { setInputValue(''); setQuery('') }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant transition-colors">
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
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-card p-5 sticky top-[88px]">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-primary" />
                <span className="font-headline font-semibold text-sm text-primary">Filters</span>
              </div>
              {hasFilters && (
                <button onClick={clearAll} className="text-xs font-body font-medium text-secondary hover:text-on-secondary-fixed-variant transition-colors">
                  Reset all
                </button>
              )}
            </div>

            {/* TYPE */}
            <div className="mb-6">
              <h4 className="font-headline font-semibold text-xs uppercase tracking-widest text-on-surface-variant mb-3">TYPE</h4>
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
                        className="w-4 h-4 rounded cursor-pointer"
                        style={{ accentColor: '#006a61' }}
                      />
                      <Icon className="w-3.5 h-3.5 text-outline" />
                      <span className="text-sm font-body text-on-surface-variant group-hover:text-primary transition-colors flex-1">
                        {type.label}
                      </span>
                      <span className="text-xs font-body text-on-surface-variant">{type.count}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* INDUSTRY */}
            <div className="mb-6">
              <h4 className="font-headline font-semibold text-xs uppercase tracking-widest text-on-surface-variant mb-3">INDUSTRY</h4>
              <div className="space-y-2">
                {industryCounts.slice(0, showMoreIndustries ? undefined : 8).map((ind) => {
                  const checked = selectedIndustries.includes(ind.id)
                  return (
                    <label key={ind.id} className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleFilter(selectedIndustries, setSelectedIndustries, ind.id)}
                        className="w-4 h-4 rounded cursor-pointer"
                        style={{ accentColor: '#006a61' }}
                      />
                      <span className="text-sm font-body text-on-surface-variant group-hover:text-primary transition-colors flex-1 truncate">
                        {ind.name}
                      </span>
                      <span className="text-xs font-body text-on-surface-variant shrink-0">{ind.count}</span>
                    </label>
                  )
                })}
                {!showMoreIndustries && industryCounts.length > 8 && (
                  <button
                    onClick={() => setShowMoreIndustries(true)}
                    className="text-xs font-body font-medium text-secondary hover:text-on-secondary-fixed-variant transition-colors flex items-center gap-1">
                    <ChevronDown className="w-3 h-3" />
                    {industryCounts.length - 8} more
                  </button>
                )}
                {showMoreIndustries && (
                  <button
                    onClick={() => setShowMoreIndustries(false)}
                    className="text-xs font-body font-medium text-on-surface-variant hover:text-on-surface transition-colors">
                    Show less
                  </button>
                )}
              </div>
            </div>

            {/* Active Filters */}
            {(selectedTypes.length > 0 || selectedIndustries.length > 0) && (
              <div>
                <h4 className="font-headline font-semibold text-xs uppercase tracking-widest text-on-surface-variant mb-2">ACTIVE FILTERS</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTypes.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-body font-medium text-secondary bg-secondary-container/20">
                      {t}
                      <button onClick={() => toggleFilter(selectedTypes, setSelectedTypes, t)}>
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                  {selectedIndustries.map((id) => {
                    const ind = mockIndustries.find((i) => i.id === id)
                    return ind ? (
                      <span key={id} className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-body font-medium text-tertiary-container bg-tertiary-container/10">
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
              <span className="font-headline font-semibold text-lg text-primary">
                {results.length} Results
              </span>
              {query && (
                <span className="font-body text-sm text-on-surface-variant ml-2">for &ldquo;{query}&rdquo;</span>
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
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-outline pointer-events-none" />
            </div>
          </div>

          {results.length > 0 ? (
            <div className="space-y-4">
              {results.map((result) => (
                <div key={result.slug}
                  className="bg-surface-container-lowest rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300 border border-outline-variant/20 hover:border-secondary/30 group">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-primary/8">
                      <BarChart2 className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-body font-bold text-white ${
                          result.type === 'Databook' ? 'bg-tertiary' :
                          result.type === 'Statistics' ? 'bg-secondary' : 'bg-primary'
                        }`}>
                          {result.type}
                        </span>
                        <span className="text-xs font-body text-on-surface-variant">{result.industry}</span>
                        <span className="text-outline">·</span>
                        <span className="text-xs font-body text-on-surface-variant">{result.subIndustry}</span>
                      </div>
                      <Link
                        href={`/outlook/${result.slug}/global`}
                        className="font-headline font-semibold text-sm leading-snug block mb-2 text-primary hover:text-secondary transition-colors">
                        Global {result.title} Market Outlook, {result.yearStart}–{result.yearEnd}
                      </Link>
                      <p className="text-xs font-body text-on-surface-variant mb-3 line-clamp-2">{result.description}</p>
                      <div className="flex items-center flex-wrap gap-4 text-xs font-body text-on-surface-variant">
                        <span>Revenue: <strong className="text-primary">${result.revenue}B</strong></span>
                        <span>Forecast: <strong className="text-primary">${result.forecast}B</strong></span>
                        <span className="inline-flex items-center gap-1">
                          CAGR:
                          <strong className="inline-flex items-center gap-0.5 text-secondary">
                            <TrendingUp className="w-3 h-3" />
                            {result.cagr}%
                          </strong>
                        </span>
                        <span>Segments: <strong className="text-primary">{result.segments.length}</strong></span>
                      </div>
                      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-surface-container">
                        {['Overview', 'Statistics', 'View Full Report'].map((link, i) => (
                          <Link key={link} href={`/outlook/${result.slug}/global`}
                            className={`text-xs font-body font-medium transition-colors ${
                              i === 2 ? 'text-secondary font-semibold hover:text-on-secondary-fixed-variant' : 'text-on-surface-variant hover:text-secondary'
                            }`}>
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
            <div className="text-center py-20 bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant/20">
              <div className="w-20 h-20 rounded-xl flex items-center justify-center mx-auto mb-5 bg-surface-container">
                <Search className="w-9 h-9 text-outline" />
              </div>
              <h3 className="font-headline font-semibold text-lg text-primary mb-2">No results found</h3>
              <p className="font-body text-on-surface-variant text-sm mb-5">Try a different search term or adjust your filters</p>
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SearchPageInner />
    </Suspense>
  )
}
