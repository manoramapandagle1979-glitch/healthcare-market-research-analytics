'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Search, ChevronLeft, ChevronRight, ChevronDown, Calendar, User, Tag, BookOpen } from 'lucide-react'
import { getBlogs } from '@/lib/api/blogs'
import type { ApiBlog, ApiMeta } from '@/types/api'

const LIMIT = 12

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function readingTime(content: string) {
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

function BlogCard({ blog }: { blog: ApiBlog }) {
  const tags = Array.isArray(blog.tags)
    ? blog.tags
    : typeof blog.tags === 'string'
    ? (blog.tags as string).split(',').map((t: string) => t.trim()).filter(Boolean)
    : []

  return (
    <Link href={`/blogs/${blog.slug}`} className="group block">
      <article className="h-full bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-card hover:shadow-md hover:border-secondary/30 transition-all duration-200 overflow-hidden flex flex-col">
        {/* Category bar */}
        <div className="h-1 bg-primary w-full" />

        <div className="p-5 flex flex-col flex-1">
          {/* Category + reading time */}
          <div className="flex items-center justify-between mb-3">
            {blog.category && (
              <span className="text-[10px] font-headline font-bold uppercase tracking-wider text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                {blog.category.name}
              </span>
            )}
            <span className="text-[10px] font-body text-on-surface-variant ml-auto">
              {readingTime(blog.content)} min read
            </span>
          </div>

          {/* Title */}
          <h2 className="font-headline font-bold text-sm text-primary leading-snug mb-2 group-hover:text-secondary transition-colors line-clamp-2">
            {blog.title}
          </h2>

          {/* Excerpt */}
          <p className="font-body text-xs text-on-surface-variant leading-relaxed line-clamp-3 flex-1 mb-4">
            {blog.excerpt}
          </p>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {tags.slice(0, 3).map(tag => (
                <span key={tag} className="tag-chip text-[10px] text-on-surface-variant bg-surface-container border-outline-variant/30">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-surface-container">
            <div className="flex items-center gap-1.5 text-[10px] font-body text-on-surface-variant">
              <User className="w-3 h-3 text-outline" />
              <span>{blog.author?.name || 'Curator Team'}</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-body text-on-surface-variant">
              <Calendar className="w-3 h-3 text-outline" />
              <span>{formatDate(blog.publish_date || blog.created_at)}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}

function BlogsPageInner() {
  const searchParams = useSearchParams()
  const urlSearch = searchParams.get('search') || ''
  const urlCategory = searchParams.get('category') || ''
  const urlPage = parseInt(searchParams.get('page') || '1', 10)

  const [search, setSearch] = useState(urlSearch)
  const [category, setCategory] = useState(urlCategory)
  const [page, setPage] = useState(urlPage)

  const [blogs, setBlogs] = useState<ApiBlog[]>([])
  const [meta, setMeta] = useState<ApiMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [debouncedSearch, setDebouncedSearch] = useState(search)

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 400)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    setLoading(true)
    setError(null)
    getBlogs({ status: 'published', page, limit: LIMIT, search: debouncedSearch || undefined, category: category || undefined })
      .then(({ blogs: b, meta: m }) => {
        setBlogs(b ?? [])
        setMeta(m ?? null)
      })
      .catch(() => setError('Failed to load blogs. Please try again.'))
      .finally(() => setLoading(false))
  }, [debouncedSearch, category, page])

  const totalPages = meta?.total_pages ?? 1

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface-container-lowest border-b border-surface-container-high">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="font-headline font-bold text-2xl text-primary">Insights & Blogs</h1>
              <p className="font-body text-sm text-on-surface-variant mt-1">
                {meta ? `${meta.total.toLocaleString()} articles` : 'Expert analysis and healthcare market insights'}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-[1fr,auto,auto] gap-3 items-end">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search articles..."
                className="input-field pl-9"
              />
            </div>

            <div className="relative">
              <select
                value={category}
                onChange={e => { setCategory(e.target.value); setPage(1) }}
                className="input-field pr-8 appearance-none cursor-pointer min-w-[180px]"
              >
                <option value="">All Categories</option>
                <option value="market-analysis">Market Analysis</option>
                <option value="regulatory">Regulatory</option>
                <option value="clinical-trials">Clinical Trials</option>
                <option value="investment">Investment</option>
                <option value="technology">Technology</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-outline pointer-events-none" />
            </div>

            <button
              onClick={() => { setSearch(''); setCategory(''); setPage(1) }}
              className="btn-ghost border border-outline-variant rounded-xl"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-64 rounded-xl bg-surface-container animate-pulse" />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-12 text-center shadow-card">
            <BookOpen className="w-12 h-12 text-outline mx-auto mb-4" />
            <h3 className="font-headline font-semibold text-base text-primary mb-2">Unable to load articles</h3>
            <p className="font-body text-sm text-on-surface-variant mb-4">{error}</p>
            <button
              onClick={() => { setLoading(true); setError(null) }}
              className="btn-primary px-4 py-2 rounded-xl text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && blogs.length === 0 && (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-12 text-center shadow-card">
            <BookOpen className="w-12 h-12 text-outline mx-auto mb-4" />
            <h3 className="font-headline font-semibold text-base text-primary mb-2">No articles found</h3>
            <p className="font-body text-sm text-on-surface-variant">
              Try adjusting your search or filters.
            </p>
          </div>
        )}

        {!loading && !error && blogs.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <span className="font-body text-sm text-on-surface-variant">
                Showing <strong className="text-primary">{blogs.length}</strong>
                {meta && <> of <strong className="text-primary">{meta.total}</strong> articles</>}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {blogs.map(blog => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between">
                <span className="text-xs font-body text-on-surface-variant">
                  Page {page} of {totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded-lg border border-outline-variant hover:border-secondary disabled:opacity-40 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-on-surface-variant" />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const start = Math.max(1, Math.min(page - 2, totalPages - 4))
                    return start + i
                  }).map(p => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-body font-medium transition-colors ${
                        p === page ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="p-1.5 rounded-lg border border-outline-variant hover:border-secondary disabled:opacity-40 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-on-surface-variant" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function BlogsPage() {
  return (
    <Suspense fallback={null}>
      <BlogsPageInner />
    </Suspense>
  )
}
