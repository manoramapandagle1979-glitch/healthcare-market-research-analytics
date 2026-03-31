import { create } from 'zustand'
import type { SearchFilters } from '@/types'

interface SearchState {
  filters: SearchFilters
  setQuery: (q: string) => void
  toggleType: (type: string) => void
  toggleIndustry: (id: string) => void
  toggleSubIndustry: (id: string) => void
  setSortBy: (sort: SearchFilters['sortBy']) => void
  resetFilters: () => void
}

const defaultFilters: SearchFilters = {
  query: '',
  types: [],
  industries: [],
  subIndustries: [],
  sortBy: 'relevant',
}

function toggle(arr: string[], val: string): string[] {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]
}

export const useSearchStore = create<SearchState>()((set) => ({
  filters: defaultFilters,
  setQuery: (q) => set((s) => ({ filters: { ...s.filters, query: q } })),
  toggleType: (type) => set((s) => ({ filters: { ...s.filters, types: toggle(s.filters.types, type) } })),
  toggleIndustry: (id) => set((s) => ({ filters: { ...s.filters, industries: toggle(s.filters.industries, id) } })),
  toggleSubIndustry: (id) => set((s) => ({ filters: { ...s.filters, subIndustries: toggle(s.filters.subIndustries, id) } })),
  setSortBy: (sort) => set((s) => ({ filters: { ...s.filters, sortBy: sort } })),
  resetFilters: () => set({ filters: defaultFilters }),
}))
