'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, ExternalLink, ChevronDown, Grid3X3, LayoutList } from 'lucide-react'
import { industries } from '@/lib/data'

export default function IndustriesPage() {
  const [search, setSearch] = useState('')
  const [jumpTo, setJumpTo] = useState('')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  const filtered = industries.filter(ind =>
    ind.name.toLowerCase().includes(search.toLowerCase()) ||
    ind.subIndustries.some(s => s.toLowerCase().includes(search.toLowerCase()))
  )

  const scrollTo = (id: string) => {
    document.getElementById(`industry-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen bg-background page-content">
      {/* Header */}
      <div className="bg-surface-container-lowest border-b border-surface-container-high">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-headline font-extrabold text-2xl text-primary mb-1">All Industries</h1>
              <p className="font-body text-sm text-on-surface-variant">
                Browse {industries.length}+ industries with 500+ sub-industry segments
              </p>
            </div>
            <div className="flex items-center gap-2">
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
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search industries or sub-industries..."
              className="input-field pl-9"
            />
          </div>
          <div className="relative">
            <select
              value={jumpTo}
              onChange={e => { setJumpTo(e.target.value); if (e.target.value) scrollTo(e.target.value) }}
              className="input-field pr-8 appearance-none cursor-pointer min-w-[200px]">
              <option value="">Jump to Industry</option>
              {industries.map(ind => (
                <option key={ind.id} value={ind.id}>{ind.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-outline pointer-events-none" />
          </div>
          <div className="ml-auto text-xs font-body text-on-surface-variant">
            {filtered.length} of {industries.length} industries
          </div>
        </div>
      </div>

      {/* Industries Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {viewMode === 'list' ? (
          /* List View */
          <div className="space-y-0 bg-surface-container-lowest rounded-xl shadow-card overflow-hidden border border-outline-variant/20">
            {filtered.map((industry) => (
              <div key={industry.id} id={`industry-${industry.id}`}
                className="border-b border-surface-container last:border-0 group relative transition-all duration-200 hover:bg-surface-container-low">
                {/* Teal left border on hover */}
                <div className="absolute left-0 top-0 bottom-0 w-0.5 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center bg-secondary" />
                <div className="py-5 px-6 pl-8 grid grid-cols-[240px,1fr] gap-6 items-start">
                  {/* Industry Name */}
                  <div className="py-1">
                    <Link href={`/search?industry=${industry.id}`}
                      className="font-headline font-bold text-sm text-primary hover:text-secondary transition-colors block mb-1">
                      {industry.name}
                    </Link>
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-body font-semibold text-on-secondary-container bg-secondary-container/40">
                      {industry.subIndustries.length} sub-industries
                    </div>
                  </div>

                  {/* Sub-industries — chips */}
                  <div className="flex flex-wrap gap-2">
                    {industry.subIndustries.map(sub => (
                      <Link key={sub}
                        href={`/search?subindustry=${encodeURIComponent(sub)}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-body font-medium transition-all duration-200 group/chip bg-surface-container text-on-surface-variant hover:bg-secondary-container hover:text-on-secondary-container border border-transparent hover:border-secondary/20">
                        {sub}
                        <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover/chip:opacity-100 transition-opacity" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((industry) => (
              <div key={industry.id} id={`industry-${industry.id}`}
                className="bg-surface-container-lowest rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 p-5 group overflow-hidden relative border border-transparent hover:border-outline-variant/30 hover:scale-[1.01]">
                {/* Card top accent */}
                <div className="absolute top-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left bg-secondary" />
                <div className="flex items-start justify-between mb-3">
                  <Link href={`/search?industry=${industry.id}`}
                    className="font-headline font-bold text-sm leading-tight text-primary hover:text-secondary transition-colors">
                    {industry.name}
                  </Link>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-body font-semibold shrink-0 ml-2 text-on-secondary-container bg-secondary-container/40">
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
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-body font-medium text-secondary bg-secondary-container/30 border border-secondary/20">
                      +{industry.subIndustries.length - 6} more
                    </span>
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
            <button
              onClick={() => setSearch('')}
              className="btn-outline text-xs px-4 py-2">
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
