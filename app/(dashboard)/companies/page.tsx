'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, ChevronLeft, ChevronRight, ChevronDown, MapPin, Users } from 'lucide-react'
import { mockCompanies } from '@/lib/mock-data'
import { mockIndustries } from '@/lib/mock-data'

const sectors = ['Healthcare', 'Technology', 'Energy', 'Financial Services', 'Industrials', 'Consumer Goods']

export default function CompaniesPage() {
  const [search, setSearch] = useState('')
  const [sector, setSector] = useState('')
  const [industry, setIndustry] = useState('')
  const [sortBy, setSortBy] = useState('latest')
  const [page, setPage] = useState(1)
  const perPage = 8

  let filtered = mockCompanies.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase())
    const matchSector = !sector || c.sector === sector
    const matchIndustry = !industry || c.industry === industry
    return matchSearch && matchSector && matchIndustry
  })

  if (sortBy === 'name-az') filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name))
  else if (sortBy === 'revenue') filtered = [...filtered].sort((a, b) => parseFloat(b.revenue.replace(/[^0-9.]/g, '')) - parseFloat(a.revenue.replace(/[^0-9.]/g, '')))

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  const statusColors: Record<string, { bg: string; text: string }> = {
    Active: { bg: 'bg-green-100', text: 'text-green-700' },
    Inactive: { bg: 'bg-red-100', text: 'text-red-700' },
    Acquired: { bg: 'bg-amber-100', text: 'text-amber-700' },
  }

  return (
    <div className="min-h-screen bg-surface-app">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="font-sora font-bold text-2xl text-brand-primary">Company Directory</h1>
              <p className="font-dm text-sm text-gray-500 mt-1">{mockCompanies.length}+ global company profiles</p>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-[1fr,auto,auto,auto,auto] gap-3 items-end">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search companies..."
                className="input-field pl-9"
              />
            </div>
            {[
              { value: sector, setter: setSector, options: sectors, placeholder: 'Select Sector' },
              { value: industry, setter: setIndustry, options: ['All Industries', ...mockIndustries.map(i => i.name)], placeholder: 'Select Industry' },
              { value: sortBy, setter: setSortBy, options: ['latest', 'name-az', 'revenue', 'employees'], placeholder: 'Sort By' },
            ].map((filter, i) => (
              <div key={i} className="relative">
                <select
                  value={filter.value}
                  onChange={e => filter.setter(e.target.value)}
                  className="input-field pr-8 appearance-none cursor-pointer min-w-[160px]">
                  <option value="">{filter.placeholder}</option>
                  {filter.options.map(opt => (
                    <option key={opt} value={opt === 'All Sectors' || opt === 'All Industries' ? '' : opt}>{opt}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
            ))}
            <button
              onClick={() => { setSearch(''); setSector(''); setIndustry(''); setSortBy('latest') }}
              className="btn-ghost border border-gray-200 rounded-xl">
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <span className="font-dm text-sm text-gray-500">
              Showing <strong className="text-brand-primary">{paginated.length}</strong> of{' '}
              <strong className="text-brand-primary">{filtered.length}</strong> companies
            </span>
          </div>
          <table className="data-table w-full">
            <thead>
              <tr>
                <th>Company</th>
                <th>HQ</th>
                <th>Sector</th>
                <th>Industry</th>
                <th>Revenue</th>
                <th>Employees</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(company => {
                const status = statusColors[company.operatingStatus] || statusColors.Active
                return (
                  <tr key={company.slug}>
                    <td>
                      <Link href={`/companies/${company.slug}`}
                        className="flex items-center gap-3 group">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-sora font-bold text-white shrink-0"
                          style={{ background: '#111115' }}>
                          {company.name[0]}
                        </div>
                        <div>
                          <div className="font-dm font-semibold text-brand-primary group-hover:text-brand-accent transition-colors text-sm">
                            {company.name}
                          </div>
                          {company.foundedYear && (
                            <div className="text-[10px] font-dm text-gray-400">Est. {company.foundedYear}</div>
                          )}
                        </div>
                      </Link>
                    </td>
                    <td>
                      <div className="flex items-center gap-1 text-gray-600 text-sm">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        {company.hq}
                      </div>
                    </td>
                    <td><span className="text-sm font-dm text-gray-600">{company.sector}</span></td>
                    <td><span className="text-sm font-dm text-gray-600">{company.industry}</span></td>
                    <td><span className="text-sm font-dm font-semibold text-brand-primary">{company.revenue}</span></td>
                    <td>
                      <div className="flex items-center gap-1 text-sm font-dm text-gray-600">
                        <Users className="w-3 h-3 text-gray-400" />
                        {company.employees}
                      </div>
                    </td>
                    <td>
                      <span className={`stat-badge ${status.bg} ${status.text}`}>
                        {company.operatingStatus}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-dm text-gray-500">
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg border border-gray-200 hover:border-brand-accent disabled:opacity-40 transition-colors">
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                  <button key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-dm font-medium transition-colors ${
                      p === page ? 'text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    style={p === page ? { background: '#111115' } : {}}>
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg border border-gray-200 hover:border-brand-accent disabled:opacity-40 transition-colors">
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
