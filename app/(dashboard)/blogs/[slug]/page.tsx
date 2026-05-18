'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, Tag, Clock, ExternalLink, BookOpen, ChevronRight } from 'lucide-react'
import { getBlogBySlug, getBlogs } from '@/lib/api/blogs'
import type { ApiBlog } from '@/types/api'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function readingTime(content: string) {
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

function BlogContent({ html }: { html: string }) {
  return (
    <div
      className="prose prose-sm max-w-none text-on-surface-variant font-body leading-relaxed
        prose-headings:font-headline prose-headings:text-primary
        prose-h2:text-lg prose-h2:font-bold prose-h2:mt-6 prose-h2:mb-3
        prose-h3:text-base prose-h3:font-semibold prose-h3:mt-5 prose-h3:mb-2
        prose-p:mb-4 prose-p:text-sm
        prose-a:text-secondary prose-a:no-underline hover:prose-a:underline
        prose-strong:text-primary prose-strong:font-semibold
        prose-ul:my-3 prose-ol:my-3 prose-li:text-sm prose-li:mb-1
        prose-blockquote:border-l-4 prose-blockquote:border-secondary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-on-surface-variant
        prose-code:text-xs prose-code:bg-surface-container prose-code:px-1 prose-code:rounded"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

function RelatedBlogCard({ blog }: { blog: ApiBlog }) {
  return (
    <Link href={`/blogs/${blog.slug}`} className="group flex gap-3 py-3 border-b border-surface-container last:border-0">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
        <BookOpen className="w-4 h-4 text-primary" />
      </div>
      <div>
        <p className="text-xs font-body font-medium text-primary group-hover:text-secondary transition-colors leading-snug line-clamp-2">
          {blog.title}
        </p>
        <p className="text-[10px] font-body text-on-surface-variant mt-1">
          {formatDate(blog.publish_date || blog.created_at)}
        </p>
      </div>
    </Link>
  )
}

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  const [blog, setBlog] = useState<ApiBlog | null>(null)
  const [related, setRelated] = useState<ApiBlog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    getBlogBySlug(params.slug)
      .then(b => {
        setBlog(b)
        return getBlogs({ status: 'published', limit: 4, category: b.category?.slug })
      })
      .then(({ blogs }) => setRelated(blogs.filter(b => b.slug !== params.slug).slice(0, 3)))
      .catch(() => setError('Article not found or unavailable.'))
      .finally(() => setLoading(false))
  }, [params.slug])

  const tags = blog
    ? Array.isArray(blog.tags)
      ? blog.tags
      : typeof blog.tags === 'string'
      ? (blog.tags as string).split(',').map((t: string) => t.trim()).filter(Boolean)
      : []
    : []

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="h-8 w-48 rounded-lg bg-surface-container animate-pulse mb-6" />
          <div className="grid grid-cols-[1fr,300px] gap-6">
            <div className="space-y-4">
              <div className="h-10 rounded-lg bg-surface-container animate-pulse" />
              <div className="h-4 w-2/3 rounded bg-surface-container animate-pulse" />
              <div className="h-96 rounded-xl bg-surface-container animate-pulse" />
            </div>
            <div className="h-64 rounded-xl bg-surface-container animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-12 text-center shadow-card max-w-md">
          <BookOpen className="w-12 h-12 text-outline mx-auto mb-4" />
          <h2 className="font-headline font-bold text-lg text-primary mb-2">Article not found</h2>
          <p className="font-body text-sm text-on-surface-variant mb-5">{error ?? 'This article may have been moved or removed.'}</p>
          <Link href="/blogs" className="btn-primary px-4 py-2 rounded-xl text-sm">
            Back to Blogs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="bg-surface-container-lowest border-b border-surface-container-high sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 text-xs font-body text-on-surface-variant">
          <Link href="/blogs" className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Blogs
          </Link>
          <ChevronRight className="w-3 h-3 text-outline" />
          {blog.category && (
            <>
              <span className="text-on-surface-variant">{blog.category.name}</span>
              <ChevronRight className="w-3 h-3 text-outline" />
            </>
          )}
          <span className="text-primary font-medium truncate max-w-xs">{blog.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-6">
          {/* Main article */}
          <main>
            {/* Article header */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-card p-6 mb-5">
              {/* Category */}
              {blog.category && (
                <span className="inline-block text-[10px] font-headline font-bold uppercase tracking-wider text-secondary bg-secondary/10 px-2.5 py-1 rounded-full mb-3">
                  {blog.category.name}
                </span>
              )}

              {/* Title */}
              <h1 className="font-headline font-bold text-2xl text-primary leading-tight mb-3">
                {blog.title}
              </h1>

              {/* Excerpt */}
              <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-4">
                {blog.excerpt}
              </p>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-surface-container text-xs font-body text-on-surface-variant">
                {blog.author && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                      {blog.author.name[0]}
                    </div>
                    <span>{blog.author.name}</span>
                    {blog.author.role && <span className="text-outline">· {blog.author.role}</span>}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-outline" />
                  {formatDate(blog.publish_date || blog.created_at)}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-outline" />
                  {readingTime(blog.content)} min read
                </div>
              </div>
            </div>

            {/* Article body */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-card p-6 mb-5">
              <BlogContent html={blog.content} />
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-outline" />
                  <span className="text-xs font-headline font-bold text-on-surface-variant uppercase tracking-wider">Tags</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <Link
                      key={tag}
                      href={`/blogs?search=${encodeURIComponent(tag)}`}
                      className="tag-chip text-xs text-on-surface-variant bg-surface-container border-outline-variant/30 hover:border-secondary hover:text-secondary transition-all"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="space-y-5">
            {/* Author card */}
            {blog.author && (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-card p-5">
                <h4 className="font-headline font-semibold text-sm text-primary mb-4">About the Author</h4>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {blog.author.name[0]}
                  </div>
                  <div>
                    <p className="font-body font-semibold text-sm text-primary">{blog.author.name}</p>
                    {blog.author.role && (
                      <p className="text-xs font-body text-on-surface-variant">{blog.author.role}</p>
                    )}
                    {blog.author.bio && (
                      <p className="text-xs font-body text-on-surface-variant mt-2 leading-relaxed line-clamp-4">
                        {blog.author.bio}
                      </p>
                    )}
                    {blog.author.linkedin_url && (
                      <a
                        href={blog.author.linkedin_url}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-2 text-xs font-body text-secondary hover:underline"
                      >
                        LinkedIn <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Related articles */}
            {related.length > 0 && (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-card p-5">
                <h4 className="font-headline font-semibold text-sm text-primary mb-3">Related Articles</h4>
                {related.map(r => (
                  <RelatedBlogCard key={r.id} blog={r} />
                ))}
                <Link
                  href="/blogs"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-body text-secondary hover:underline"
                >
                  View all articles <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            )}

            {/* CTA */}
            <div className="rounded-xl p-5 bg-primary">
              <h4 className="font-headline font-semibold text-sm text-white mb-2">Need Custom Research?</h4>
              <p className="text-xs font-body text-white/60 mb-4 leading-relaxed">
                Get a tailored market analysis report for your specific intelligence needs.
              </p>
              <Link
                href="/contact"
                className="block w-full py-2 rounded-xl text-xs font-body font-bold text-primary bg-white hover:bg-surface-container-low transition-colors text-center"
              >
                Request Custom Report
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
