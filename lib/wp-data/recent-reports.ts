// Pre-extracted from reports.catalog.json — top 8 most recently modified reports.
// Regenerate with: node scripts/build-recent-reports.mjs
export interface RecentReport {
  slug: string
  title: string
  industry: string
  industrySlug: string
  cagr: number
  yearStart: number
  yearEnd: number
}

export const recentReports: RecentReport[] = [
  { slug: 'compostable-flexible-packaging-market', title: 'Compostable Flexible Packaging', industry: 'Packaging & Transport', industrySlug: 'packaging-transport', cagr: 12.3, yearStart: 2026, yearEnd: 2035 },
  { slug: 'us-hazardous-waste-management-market', title: 'US Hazardous Waste Management', industry: 'Chemicals And Materials', industrySlug: 'chemicals-and-materials', cagr: 6.1, yearStart: 2026, yearEnd: 2035 },
  { slug: 'us-fleet-management-market', title: 'US Fleet Management', industry: 'Technology', industrySlug: 'technology', cagr: 11.7, yearStart: 2025, yearEnd: 2034 },
  { slug: 'europe-fleet-management-market', title: 'Europe Fleet Management', industry: 'Technology', industrySlug: 'technology', cagr: 10.3, yearStart: 2025, yearEnd: 2034 },
  { slug: 'europe-insect-protein-market', title: 'Europe Insect Protein', industry: 'Food & Beverages', industrySlug: 'food-beverages', cagr: 30.5, yearStart: 2025, yearEnd: 2034 },
  { slug: 'indonesia-infant-nutrition-market', title: 'Indonesia Infant Nutrition', industry: 'Food & Beverages', industrySlug: 'food-beverages', cagr: 9.4, yearStart: 2026, yearEnd: 2035 },
  { slug: 'butyl-rubber-market', title: 'Butyl Rubber', industry: 'Chemicals And Materials', industrySlug: 'chemicals-and-materials', cagr: 5.6, yearStart: 2026, yearEnd: 2035 },
  { slug: 'ai-powered-website-builder-market', title: 'AI-Powered Website Builder', industry: 'Technology', industrySlug: 'technology', cagr: 17.7, yearStart: 2026, yearEnd: 2035 },
]
