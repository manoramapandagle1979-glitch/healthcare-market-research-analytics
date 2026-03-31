import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Bookmark, RecentVisit } from '@/types'

interface BookmarksState {
  bookmarks: Bookmark[]
  recentVisits: RecentVisit[]
  addBookmark: (slug: string) => void
  removeBookmark: (slug: string) => void
  toggleBookmark: (slug: string) => void
  isBookmarked: (slug: string) => boolean
  addRecentVisit: (slug: string) => void
}

export const useBookmarksStore = create<BookmarksState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      recentVisits: [],

      addBookmark: (slug) => {
        const existing = get().bookmarks.find((b) => b.marketSlug === slug)
        if (!existing) {
          set((s) => ({
            bookmarks: [{ marketSlug: slug, addedAt: new Date().toISOString() }, ...s.bookmarks],
          }))
        }
      },

      removeBookmark: (slug) =>
        set((s) => ({ bookmarks: s.bookmarks.filter((b) => b.marketSlug !== slug) })),

      toggleBookmark: (slug) => {
        if (get().isBookmarked(slug)) {
          get().removeBookmark(slug)
        } else {
          get().addBookmark(slug)
        }
      },

      isBookmarked: (slug) => get().bookmarks.some((b) => b.marketSlug === slug),

      addRecentVisit: (slug) => {
        // dedupe + keep last 20
        set((s) => {
          const filtered = s.recentVisits.filter((v) => v.marketSlug !== slug)
          return {
            recentVisits: [
              { marketSlug: slug, visitedAt: new Date().toISOString() },
              ...filtered,
            ].slice(0, 20),
          }
        })
      },
    }),
    { name: 'horizon-bookmarks' }
  )
)
