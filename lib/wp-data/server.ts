// Server-only helpers for reading per-slug full report data. These read from
// the filesystem and must not be imported into a client component.
import fs from 'node:fs/promises'
import path from 'node:path'
import type { WpReportFull } from './index'
import type { ApiReport, ApiResponse } from '@/types/api'

const REPORTS_DIR = path.resolve(process.cwd(), 'lib/wp-data/reports')

function apiReportToWpFull(r: ApiReport): WpReportFull {
  const cagr = r.cagr ?? (r.market_metrics?.cagr != null ? parseFloat(String(r.market_metrics.cagr).replace('%', '')) : null)
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt || r.description?.slice(0, 300) || '',
    industry: r.industry || r.category_name || '',
    categories: [r.category_name].filter(Boolean) as string[],
    tags: r.tags ?? [],
    regions: [],
    publishedDate: r.publish_date ?? '',
    pages: r.page_count ? `${r.page_count}+` : null,
    cagr: isNaN(cagr as number) ? null : cagr,
    baseYear: r.base_year ?? null,
    yearStart: r.year_start ?? null,
    yearEnd: r.year_end ?? null,
    studyPeriod: r.study_period ?? null,
    code: r.code ?? null,
    prices: r.prices ?? { single: null, team: null, enterprise: null, dataPack: null },
    modified: r.updated_at ?? '',
    description: r.description ?? '',
    segmentation: r.segmentation ?? '',
    tableOfContents: r.sections?.tableOfContents ?? '',
    methodology: r.methodology ?? '',
    keyPlayers: r.sections?.keyPlayers ?? '',
    faqs: (r.faqs ?? []).map((f) => ({ q: f.question, a: f.answer })),
    seo: { title: r.meta_title ?? '', description: r.meta_description ?? '' },
  }
}

export async function getReportFull(slug: string): Promise<WpReportFull | null> {
  if (!slug) return null
  // Try filesystem first (local dev / bundled JSON)
  try {
    const raw = await fs.readFile(path.join(REPORTS_DIR, `${slug}.json`), 'utf8')
    return JSON.parse(raw) as WpReportFull
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException)?.code !== 'ENOENT') throw err
  }
  // Fall back to backend API
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/v1'
    const res = await fetch(`${apiBase}/reports/${slug}`, { next: { revalidate: 3600 } })
    if (!res.ok) return null
    const json = (await res.json()) as ApiResponse<ApiReport>
    if (!json.success || !json.data) return null
    return apiReportToWpFull(json.data)
  } catch {
    return null
  }
}
