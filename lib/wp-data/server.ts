// Server-only helpers for reading per-slug full report data. These read from
// the filesystem and must not be imported into a client component.
import fs from 'node:fs/promises'
import path from 'node:path'
import type { WpReportFull } from './index'

const REPORTS_DIR = path.resolve(process.cwd(), 'lib/wp-data/reports')

export async function getReportFull(slug: string): Promise<WpReportFull | null> {
  if (!slug) return null
  try {
    const raw = await fs.readFile(path.join(REPORTS_DIR, `${slug}.json`), 'utf8')
    return JSON.parse(raw) as WpReportFull
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException)?.code === 'ENOENT') return null
    throw err
  }
}
