'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Search, ExternalLink, ChevronDown, Grid3X3, LayoutList, X, ArrowUpDown, Building2, Tags } from 'lucide-react'
import { wpIndustriesAsIndustry } from '@/lib/wp-data/industries'
import { getCategories } from '@/lib/api/categories'
import { mapCategoryToIndustry } from '@/lib/mappers'
import type { Industry } from '@/types'

type SortMode = 'alpha' | 'segments'

export default function IndustriesPage() {
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [sortMode, setSortMode] = useState<SortMode>('alpha')
  const [industries, setIndustries] = useState<Industry[]>(wpIndustriesAsIndustry)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchIndustries() {
      try {
        const { categories } = await getCategories(1, 100)
        const active = categories.filter(c => c.is_active)
        if (active.length > 0) {
          setIndustries(active.map(cat => mapCategoryToIndustry(cat)))
        }
      } catch {
        // Fall back to static data already set as default
      } finally {
        setIsLoading(false)
      }
    }
    fetchIndustries()
  }, [])

  const totalSegments = useMemo(
    () => industries.reduce((sum, ind) => sum + ind.subIndustries.length, 0),
    [industries]
  )

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    const list = industries.filter(ind =>
      ind.name.toLowerCase().includes(q) ||
      ind.subIndustries.some(s => s.toLowerCase().includes(q))
    )
    if (sortMode === 'segments') {
      return [...list].sort((a, b) => b.subIndustries.length - a.subIndustries.length)
    }
    return [...list].sort((a, b) => a.name.localeCompare(b.name))
  }, [industries, search, sortMode])

  // Group by first letter (only for list view, alpha sort, no active search)
  const grouped = useMemo(() => {
    if (sortMode !== 'alpha' || search) return null
    return filtered.reduce<Record<string, Industry[]>>((acc, ind) => {
      const letter = ind.name.trim()[0]?.toUpperCase() ?? '#'
      if (!acc[letter]) acc[letter] = []
      acc[letter].push(ind)
      return acc
    }, {})
  }, [filtered, sortMode, search])

  const letters = grouped ? Object.keys(grouped).sort() : []

  const scrollToLetter = (letter: string) => {
    document.getElementById(`letter-${letter}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen bg-background page-content">
      {/* Header */}
      <div className="bg-surface-container-lowest border-b border-surface-container-high">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="font-headline font-extrabold text-2xl text-primary mb-2">All Industries</h1>
              <p className="font-body text-sm text-on-surface-variant mb-4">
                Browse healthcare market research across every sector and sub-industry segment.
              </p>
              {!isLoading && (
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-xs font-body font-semibold text-primary">
                    <Building2 className="w-3.5 h-3.5" />
                    {industries.length} Industries
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/8 border border-secondary/15 text-xs font-body font-semibold text-secondary">
                    <Tags className="w-3.5 h-3.5" />
                    {totalSegments.toLocaleString()} Segments
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0 pt-1">
              <div className="flex items-center gap-1 p-1 rounded-lg bg-surface-container">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}>
                  <LayoutList className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}>
                  <Grid3X3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-surface-container-lowest border-b border-surface-container sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search industries or sub-industries..."
              className="input-field pl-9 pr-8"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-outline hover:text-on-surface transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-outline pointer-events-none" />
            <select
              value={sortMode}
              onChange={e => setSortMode(e.target.value as SortMode)}
              className="input-field pl-8 pr-7 appearance-none cursor-pointer text-sm">
              <option value="alpha">A – Z</option>
              <option value="segments">Most Segments</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-outline pointer-events-none" />
          </div>

          <div className="ml-auto text-xs font-body text-on-surface-variant whitespace-nowrap">
            {search
              ? <><span className="font-semibold text-on-surface">{filtered.length}</span> of {industries.length} industries</>
              : <><span className="font-semibold text-on-surface">{industries.length}</span> industries</>
            }
          </div>
        </div>

        {/* A–Z quick-jump bar (only list + alpha + no search) */}
        {!isLoading && viewMode === 'list' && sortMode === 'alpha' && !search && letters.length > 0 && (
          <div className="max-w-7xl mx-auto px-6 pb-2.5 flex items-center gap-1 flex-wrap">
            {letters.map(letter => (
              <button
                key={letter}
                onClick={() => scrollToLetter(letter)}
                className="w-6 h-6 rounded text-[11px] font-headline font-bold text-on-surface-variant hover:bg-primary hover:text-on-primary transition-all duration-150">
                {letter}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-14 rounded-lg bg-surface-container animate-pulse" style={{ opacity: 1 - i * 0.1 }} />
          ))}
        </div>
      )}

      {/* Industries Content */}
      {!isLoading && (
        <div className="max-w-7xl mx-auto px-6 py-8">
          {viewMode === 'list' ? (
            <div className="bg-surface-container-lowest rounded-xl shadow-card overflow-hidden border border-outline-variant/20">
              {grouped
                ? letters.map(letter => (
                    <div key={letter}>
                      {/* Letter group header */}
                      <div
                        id={`letter-${letter}`}
                        className="sticky top-[var(--filter-bar-height,108px)] z-10 px-6 py-2 bg-surface-container border-b border-surface-container-high flex items-center gap-3">
                        <span className="font-headline font-extrabold text-base text-primary w-6 text-center">{letter}</span>
                        <span className="text-[11px] font-body text-on-surface-variant">
                          {grouped[letter].length} {grouped[letter].length === 1 ? 'industry' : 'industries'}
                        </span>
                      </div>
                      {grouped[letter].map((industry, idx) => (
                        <IndustryRow
                          key={industry.id}
                          industry={industry}
                          isLast={idx === grouped[letter].length - 1 && letter === letters[letters.length - 1]}
                        />
                      ))}
                    </div>
                  ))
                : filtered.map((industry, idx) => (
                    <IndustryRow key={industry.id} industry={industry} isLast={idx === filtered.length - 1} />
                  ))
              }
            </div>
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((industry) => (
                <div key={industry.id} id={`industry-${industry.id}`}
                  className="bg-surface-container-lowest rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 p-5 group overflow-hidden relative border border-transparent hover:border-outline-variant/30 hover:scale-[1.01]">
                  <div className="absolute top-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left bg-secondary" />
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <Link href={`/search?industry=${industry.slug}`}
                      className="font-headline font-bold text-sm leading-tight text-primary hover:text-secondary transition-colors">
                      {industry.name}
                    </Link>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-body font-semibold shrink-0 text-on-secondary-container bg-secondary-container/40">
                      {industry.subIndustries.length}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {industry.subIndustries.slice(0, 6).map(sub => (
                      <Link key={sub}
                        href={`/search?subindustry=${encodeURIComponent(sub)}`}
                        className="inline-block px-2.5 py-1 rounded-lg text-[11px] font-body transition-all duration-200 bg-surface-container text-on-surface-variant hover:bg-secondary-container hover:text-on-secondary-container border border-transparent hover:border-secondary/20">
                        {sub}
                      </Link>
                    ))}
                    {industry.subIndustries.length > 6 && (
                      <Link
                        href={`/search?industry=${industry.slug}`}
                        className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-body font-medium text-secondary bg-secondary-container/30 border border-secondary/20 hover:bg-secondary-container/50 transition-colors">
                        +{industry.subIndustries.length - 6} more
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-20 bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant/20">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-surface-container">
                <Search className="w-9 h-9 text-outline" />
              </div>
              <h3 className="font-headline font-semibold text-primary text-lg mb-2">No results found</h3>
              <p className="font-body text-on-surface-variant text-sm mb-5">
                No industries or sub-industries match &ldquo;{search}&rdquo;
              </p>
              <button onClick={() => setSearch('')} className="btn-outline text-xs px-4 py-2">
                Clear search
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function IndustryRow({ industry, isLast }: { industry: Industry; isLast: boolean }) {
  return (
    <div
      id={`industry-${industry.id}`}
      className={`border-b border-surface-container ${isLast ? 'border-0' : ''} group relative transition-all duration-200 hover:bg-surface-container-low`}>
      <div className="absolute left-0 top-0 bottom-0 w-0.5 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center bg-secondary" />
      <div className="py-4 px-6 pl-8 grid grid-cols-[220px,auto,1fr] gap-4 items-center">
        {/* Industry Name */}
        <div>
          <Link
            href={`/search?industry=${industry.slug}`}
            className="font-headline font-bold text-sm text-primary hover:text-secondary transition-colors block leading-snug">
            {industry.name}
          </Link>
        </div>

        {/* Segment count badge */}
        <div className="shrink-0">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-body font-semibold text-on-surface-variant bg-surface-container border border-outline-variant/30 whitespace-nowrap">
            <Tags className="w-2.5 h-2.5" />
            {industry.subIndustries.length}
          </span>
        </div>

        {/* Sub-industry chips */}
        <div className="flex flex-wrap gap-1.5">
          {industry.subIndustries.map(sub => (
            <Link
              key={sub}
              href={`/search?subindustry=${encodeURIComponent(sub)}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-body font-medium transition-all duration-200 group/chip bg-surface-container text-on-surface-variant hover:bg-secondary-container hover:text-on-secondary-container border border-transparent hover:border-secondary/20">
              {sub}
              <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover/chip:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
