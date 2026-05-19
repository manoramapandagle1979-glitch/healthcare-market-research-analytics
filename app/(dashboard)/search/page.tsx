'use client'

import { useState, useEffect, useCallback, useRef, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Search, X, SlidersHorizontal, BarChart2, TrendingUp,
  ChevronDown, Calendar, FileType2, Tag,
} from 'lucide-react'
import { getReports } from '@/lib/api/reports'
import { getCategories } from '@/lib/api/categories'
import type { ApiReport, ApiCategory } from '@/types/api'

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, '').trim()
}

const sortOptions = [
  { value: 'relevant', label: 'Most Relevant' },
  { value: 'newest', label: 'Newest First' },
  { value: 'cagr', label: 'Highest CAGR' },
  { value: 'az', label: 'A–Z' },
]

function getReportCagr(r: ApiReport): number {
  if (r.cagr != null) return r.cagr
  const raw = String(r.market_metrics?.cagr ?? '').replace('%', '')
  const parsed = parseFloat(raw)
  return isNaN(parsed) ? 0 : parsed
}

function SearchPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [inputValue, setInputValue] = useState(searchParams.get('q') || '')
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [selectedIndustry, setSelectedIndustry] = useState(searchParams.get('industry') || '')
  const [sortBy, setSortBy] = useState<'relevant' | 'newest' | 'cagr' | 'az'>(
    (searchParams.get('sort') as 'relevant' | 'cagr' | 'az' | 'newest') || 'relevant'
  )
  const inputRef = useRef<HTMLInputElement>(null)

  const [results, setResults] = useState<ApiReport[]>([])
  const [categories, setCategories] = useState<ApiCategory[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Sync state when URL changes externally (e.g. sidebar navigation)
  useEffect(() => {
    const urlIndustry = searchParams.get('industry') || ''
    if (urlIndustry !== selectedIndustry) setSelectedIndustry(urlIndustry)
    const urlQuery = searchParams.get('q') || ''
    if (urlQuery !== query) { setQuery(urlQuery); setInputValue(urlQuery) }
    const urlSort = (searchParams.get('sort') as typeof sortBy) || 'relevant'
    if (urlSort !== sortBy) setSortBy(urlSort)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  // Load categories for sidebar filter on mount
  useEffect(() => {
    getCategories(1, 100)
      .then(({ categories }) => setCategories(categories.filter(c => c.is_active)))
      .catch(() => {})
  }, [])

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setQuery(inputValue), 400)
    return () => clearTimeout(timer)
  }, [inputValue])

  // Sync URL params
  const syncURL = useCallback(() => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (selectedIndustry) params.set('industry', selectedIndustry)
    if (sortBy !== 'relevant') params.set('sort', sortBy)
    const qs = params.toString()
    router.replace(`/search${qs ? `?${qs}` : ''}`, { scroll: false })
  }, [query, selectedIndustry, sortBy, router])

  useEffect(() => { syncURL() }, [syncURL])

  // Fetch reports from real API whenever filters change
  useEffect(() => {
    setIsLoading(true)
    getReports({
      category: selectedIndustry || undefined,
      search: query || undefined,
      page: 1,
      limit: 60,
    }).then(({ reports, meta }) => {
      let sorted = [...reports]
      if (sortBy === 'cagr') sorted.sort((a, b) => getReportCagr(b) - getReportCagr(a))
      else if (sortBy === 'az') sorted.sort((a, b) => a.title.localeCompare(b.title))
      else if (sortBy === 'newest') sorted.sort((a, b) =>
        new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime()
      )
      setResults(sorted)
      setTotal(meta?.total ?? reports.length)
    }).catch(() => {
      setResults([])
      setTotal(0)
    }).finally(() => setIsLoading(false))
  }, [query, selectedIndustry, sortBy])

  // "/" or ⌘K focuses search input
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isTyping = ['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)
      if ((e.key === '/' && !isTyping) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const clearAll = () => {
    setSelectedIndustry('')
    setQuery('')
    setInputValue('')
    setSortBy('relevant')
  }

  const hasFilters = !!selectedIndustry || query !== ''
  const activeCategory = categories.find(c => c.slug === selectedIndustry)
  const RESULT_CAP = 60

  return (
    <div className="min-h-screen bg-paper page-content">
      {/* ─── COMMAND BAR HEADER ─── */}
      <div className="bg-ink text-white noise-overlay relative overflow-hidden" style={{ background: '#0b1220' }}>
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 right-0 w-[500px] h-[500px] rounded-full opacity-[0.12] blur-3xl"
               style={{ background: 'radial-gradient(circle, var(--signal) 0%, transparent 60%)' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-10 pb-6">
          {/* Label row */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-white/40">
              Search / Curator Intelligence
            </span>
            <span className="tabular-nums text-[11px] font-mono uppercase tracking-[0.14em] text-white/40">
              {isLoading ? (
                <span className="text-white/30 animate-pulse">Loading…</span>
              ) : (
                <>
                  <span className="text-[#6fd6ce] font-semibold">{results.length.toString().padStart(3, '0')}</span>
                  {' / '}{total.toLocaleString()} results
                </>
              )}
            </span>
          </div>

          {/* Command input */}
          <div className="relative">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder='Try "semiconductors", "digital health", or "CAGR > 15%"…'
              className="w-full font-display text-[2rem] md:text-[2.5rem] tracking-[-0.025em] bg-transparent text-white placeholder:text-white/25 border-0 focus:outline-none pl-9 pr-32 py-3"
              style={{ fontWeight: 500 }}
            />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {inputValue && (
                <button
                  onClick={() => { setInputValue(''); setQuery('') }}
                  className="w-7 h-7 flex items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all"
                  aria-label="Clear">
                  <X className="w-4 h-4" />
                </button>
              )}
              <kbd className="flex items-center gap-1 text-[10px] font-mono text-white/50 border border-white/20 rounded px-1.5 py-0.5 bg-white/5">
                <span>⌘</span><span>K</span>
              </kbd>
            </div>
            <div className="absolute left-9 bottom-0 right-0 h-px bg-gradient-to-r from-white/25 via-white/10 to-transparent" />
          </div>

          {/* Active category chip + reset */}
          {hasFilters && (
            <div className="flex items-center gap-3 mt-5 flex-wrap">
              {activeCategory && (
                <span className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full text-xs bg-signal/15 text-[#6fd6ce] border border-signal/30">
                  {activeCategory.name}
                  <button
                    onClick={() => setSelectedIndustry('')}
                    className="w-4 h-4 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
                    aria-label={`Remove ${activeCategory.name}`}>
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              )}
              {/* Show raw slug chip if category not yet loaded */}
              {selectedIndustry && !activeCategory && (
                <span className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full text-xs bg-signal/15 text-[#6fd6ce] border border-signal/30">
                  {selectedIndustry}
                  <button
                    onClick={() => setSelectedIndustry('')}
                    className="w-4 h-4 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
                    aria-label="Remove filter">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              )}
              <button onClick={clearAll} className="text-[11px] font-mono uppercase tracking-[0.12em] text-white/45 hover:text-white transition-colors ml-auto">
                Reset all ×
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 flex gap-6">
        {/* ─── Left Filter Panel ─── */}
        <aside className="w-64 shrink-0">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-card p-5 sticky top-20">
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

            {/* INDUSTRY */}
            <div>
              <h4 className="font-headline font-semibold text-xs uppercase tracking-widest text-on-surface-variant mb-3">INDUSTRY</h4>
              {categories.length === 0 ? (
                <div className="space-y-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-5 rounded bg-surface-container animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2 max-h-[calc(100vh-28rem)] overflow-y-auto pr-1">
                  {categories.map((cat) => {
                    const checked = selectedIndustry === cat.slug
                    return (
                      <label key={cat.slug} className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                          type="radio"
                          name="industry"
                          checked={checked}
                          onChange={() => setSelectedIndustry(cat.slug)}
                          onClick={() => { if (checked) setSelectedIndustry('') }}
                          className="w-4 h-4 cursor-pointer"
                          style={{ accentColor: '#006a61' }}
                        />
                        <span className={`text-sm font-body transition-colors flex-1 truncate group-hover:text-primary ${checked ? 'text-primary font-semibold' : 'text-on-surface-variant'}`}>
                          {cat.name}
                        </span>
                      </label>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Explore Category CTA — shown when category is active */}
            {activeCategory && (
              <div className="mt-5 pt-5 border-t border-outline-variant/20">
                <p className="text-[10px] font-mono uppercase tracking-[0.14em] text-on-surface-variant mb-2">Browsing</p>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-secondary/8 border border-secondary/15">
                  <BarChart2 className="w-3.5 h-3.5 text-secondary shrink-0" />
                  <span className="text-xs font-body font-semibold text-secondary truncate">{activeCategory.name}</span>
                </div>
                <Link
                  href="/industries"
                  className="mt-2 flex items-center gap-1 text-[11px] font-body text-on-surface-variant hover:text-secondary transition-colors"
                >
                  ← All industries
                </Link>
              </div>
            )}
          </div>
        </aside>

        {/* ─── Results Panel ─── */}
        <main className="flex-1 min-w-0">
          {/* Category explore header */}
          {activeCategory && (
            <div className="mb-5 pb-4 border-b border-outline-variant/20">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-signal mb-1 block">Industry</span>
                  <h2 className="font-headline font-bold text-xl text-primary leading-tight">{activeCategory.name}</h2>
                  {activeCategory.description && (
                    <p className="text-xs font-body text-on-surface-variant mt-1 max-w-xl">{activeCategory.description}</p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedIndustry('')}
                  className="flex items-center gap-1.5 text-xs font-body text-on-surface-variant hover:text-primary transition-colors shrink-0 mt-1"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-5">
            <div>
              {isLoading ? (
                <span className="font-headline font-semibold text-lg text-on-surface-variant">Loading…</span>
              ) : (
                <span className="font-headline font-semibold text-lg text-primary">
                  {results.length < total
                    ? `${results.length} of ${total.toLocaleString()}`
                    : results.length} Results
                  {query && (
                    <span className="font-body text-sm text-on-surface-variant ml-2">for &ldquo;{query}&rdquo;</span>
                  )}
                </span>
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

          {/* Loading skeletons */}
          {isLoading && (
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-32 rounded-xl bg-surface-container animate-pulse" />
              ))}
            </div>
          )}

          {/* Results */}
          {!isLoading && results.length > 0 && (
            <div className="space-y-4">
              {results.slice(0, RESULT_CAP).map((result) => {
                const cagr = getReportCagr(result)
                const yearStart = result.year_start ?? result.market_metrics?.cagrStartYear ?? result.market_metrics?.currentYear
                const yearEnd = result.year_end ?? result.market_metrics?.cagrEndYear ?? result.market_metrics?.forecastYear
                const price = result.prices?.single ?? result.discounted_price ?? result.price
                const tags = (result.meta_keywords ?? result.tags ?? []).slice(0, 3)

                return (
                  <div key={result.slug}
                    className="bg-surface-container-lowest rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300 border border-outline-variant/20 hover:border-secondary/30 group">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-primary/8">
                        <BarChart2 className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-body font-bold text-white bg-primary">
                            Report
                          </span>
                          {result.category_slug ? (
                            <button
                              onClick={() => setSelectedIndustry(result.category_slug!)}
                              className="text-xs font-body text-on-surface-variant hover:text-secondary transition-colors">
                              {result.category_name}
                            </button>
                          ) : (
                            <span className="text-xs font-body text-on-surface-variant">{result.category_name}</span>
                          )}
                        </div>
                        <Link
                          href={`/outlook/${result.slug}/global`}
                          className="font-headline font-semibold text-sm leading-snug block mb-2 text-primary hover:text-secondary transition-colors">
                          {result.title}
                        </Link>
                        <p className="text-xs font-body text-on-surface-variant mb-3 line-clamp-2">
                          {stripHtml(result.excerpt || result.description || '')}
                        </p>
                        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs font-body text-on-surface-variant">
                          {result.page_count > 0 && (
                            <span className="inline-flex items-center gap-1">
                              <FileType2 className="w-3 h-3 text-outline" />
                              <strong className="text-primary">{result.page_count}</strong> pages
                            </span>
                          )}
                          {result.publish_date && (
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-outline" />
                              <strong className="text-primary">{result.publish_date.slice(0, 10)}</strong>
                            </span>
                          )}
                          {cagr > 0 && (
                            <span className="inline-flex items-center gap-1">
                              CAGR
                              <strong className="inline-flex items-center gap-0.5 text-secondary">
                                <TrendingUp className="w-3 h-3" />
                                {cagr}%
                              </strong>
                              {yearStart && yearEnd && (
                                <span className="text-on-surface-variant">({yearStart}–{yearEnd})</span>
                              )}
                            </span>
                          )}
                          {price > 0 && (
                            <span>From <strong className="text-primary">${price.toLocaleString()}</strong></span>
                          )}
                          {tags.map(s => (
                            <span key={s} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-surface-container text-[10px]">
                              <Tag className="w-2.5 h-2.5 text-outline" />
                              {s}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-surface-container">
                          <Link href={`/outlook/${result.slug}/global`}
                            className="text-xs font-body font-medium text-on-surface-variant hover:text-secondary transition-colors">
                            Overview
                          </Link>
                          <Link href={`/outlook/${result.slug}/global`}
                            className="text-xs font-body font-semibold text-secondary hover:text-on-secondary-fixed-variant transition-colors">
                            View Full Report →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
              {total > RESULT_CAP && (
                <div className="text-center py-6 text-xs font-mono uppercase tracking-[0.14em] text-on-surface-variant">
                  Showing {RESULT_CAP} of {total.toLocaleString()} reports — refine filters to narrow further.
                </div>
              )}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && results.length === 0 && (
            <div className="relative overflow-hidden rounded-2xl border border-[color:var(--border-light)] bg-white py-16 px-8">
              <div aria-hidden className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-40 blur-3xl"
                   style={{ background: 'radial-gradient(circle, var(--signal-soft) 0%, transparent 70%)' }} />
              <div className="relative max-w-lg">
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-muted">
                  Error 0.00 · No matches
                </span>
                <h3 className="font-display text-4xl text-ink mt-2 mb-3 tracking-[-0.03em]" style={{ fontWeight: 600 }}>
                  Nothing found —{' '}
                  <span className="font-display-italic text-signal" style={{ fontWeight: 500 }}>yet</span>.
                </h3>
                <p className="text-sm text-ink-muted leading-relaxed mb-6">
                  {query
                    ? <>No reports matched <strong className="text-ink">&ldquo;{query}&rdquo;</strong>. Try broader terms, or browse by industry below.</>
                    : <>Adjust your filters — the intersection you chose has no coverage in our current databook.</>
                  }
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <button onClick={clearAll} className="btn-accent text-xs px-4 py-2">Reset search</button>
                  <Link href="/industries" className="btn-outline text-xs px-4 py-2">Browse industries</Link>
                </div>
                <div className="mt-8 pt-6 border-t border-[color:var(--border-subtle)]">
                  <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-ink-muted mb-3">Try instead</div>
                  <div className="flex flex-wrap gap-2">
                    {['Monoclonal antibodies', 'Electric vehicles', 'Solar energy', 'Digital health', 'Semiconductors'].map(s => (
                      <button
                        key={s}
                        onClick={() => { setInputValue(s); setQuery(s) }}
                        className="px-3 py-1 rounded-full text-xs text-ink-muted bg-[color:var(--n-100)] hover:bg-signal hover:text-white transition-all"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
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
