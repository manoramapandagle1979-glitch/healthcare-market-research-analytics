// Industries-only entry point. Importing this does NOT pull in the 2.6 MB
// reports catalog — keeps /industries route bundle small.
import type { Industry } from '@/types'
import industriesJson from './industries.json'

export interface WpIndustry {
  name: string
  slug: string
  count: number
  subIndustries: string[]
}

export const wpIndustries = industriesJson as WpIndustry[]

export const wpIndustriesAsIndustry: Industry[] = wpIndustries.map((i) => ({
  id: i.slug,
  name: i.name,
  subIndustries: i.subIndustries,
  marketCount: i.count,
}))
