'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bookmark, BookmarkCheck, ExternalLink, MapPin, Users, Globe, Calendar, Building2, TrendingUp, FileText, Newspaper } from 'lucide-react'
import { mockCompanies } from '@/lib/mock-data'

export default function CompanyProfilePage({ params }: { params: { slug: string } }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [bookmarked, setBookmarked] = useState(false)

  const company = mockCompanies.find(c => c.slug === params.slug) || mockCompanies[0]

  const tags = Array.from(new Set(['Healthcare', 'Biotechnology', 'Pharmaceutical', company.sector, company.industry].filter(Boolean)))

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface-container-lowest border-b border-surface-container-high">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-xl font-headline font-bold shrink-0 bg-primary">
                {company.name[0]}
              </div>
              <div>
                <h1 className="font-headline font-bold text-2xl text-primary">{company.name}</h1>
                <div className="flex items-center gap-3 mt-1 text-sm font-body text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />{company.hq}
                  </span>
                  <span>·</span>
                  <span>{company.sector}</span>
                  {company.ipoStatus && <><span>·</span><span className="text-green-600 font-medium">{company.ipoStatus}</span></>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setBookmarked(!bookmarked)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-body font-medium border border-outline-variant hover:border-secondary hover:text-secondary transition-all">
                {bookmarked
                  ? <><BookmarkCheck className="w-4 h-4 text-secondary" /><span>Saved</span></>
                  : <><Bookmark className="w-4 h-4" /><span>Save</span></>}
              </button>
              {company.website && (
                <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-body font-semibold text-white bg-primary transition-all hover:opacity-90">
                  Visit Website
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-0 mt-5 border-t border-surface-container -mb-px">
            {['overview', 'news'].map(tab => (
              <button key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-body font-medium border-b-2 transition-all capitalize ${
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-on-surface-variant hover:text-primary'
                }`}>
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-[1fr,300px] gap-6">
            {/* Main */}
            <div className="space-y-5">
              {/* Description Card */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6 shadow-card">
                <h3 className="font-headline font-semibold text-base text-primary mb-3">Overview</h3>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed">{company.description}</p>
              </div>

              {/* Metadata Grid */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6 shadow-card">
                <h3 className="font-headline font-semibold text-base text-primary mb-4">Company Details</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: Building2, label: 'TYPE', value: 'Corporation' },
                    { icon: TrendingUp, label: 'OPERATING STATUS', value: company.operatingStatus },
                    { icon: Globe, label: 'IPO STATUS', value: company.ipoStatus || 'Private' },
                    { icon: Calendar, label: 'FOUNDED YEAR', value: company.foundedYear?.toString() || 'N/A' },
                    { icon: MapPin, label: 'HEADQUARTERS', value: company.hq },
                    { icon: Users, label: 'EMPLOYEE STRENGTH', value: company.employees },
                  ].map(item => (
                    <div key={item.label} className="p-3 rounded-xl bg-surface-container border border-outline-variant/15">
                      <div className="flex items-center gap-1.5 mb-1">
                        <item.icon className="w-3 h-3 text-outline" />
                        <span className="text-[10px] font-headline font-bold text-on-surface-variant uppercase tracking-wider">{item.label}</span>
                      </div>
                      <div className="font-body font-semibold text-sm text-primary">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Industry Card */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6 shadow-card">
                <h3 className="font-headline font-semibold text-base text-primary mb-4">Industry Information</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'SECTOR', value: company.sector, isLink: false },
                    { label: 'INDUSTRY', value: company.industry, isLink: false },
                    { label: 'WEBSITE', value: company.website || 'N/A', isLink: true },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="text-[10px] font-headline font-bold text-on-surface-variant uppercase tracking-wider mb-1">{item.label}</div>
                      {item.isLink && company.website
                        ? <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer"
                            className="font-body text-sm text-secondary hover:text-on-secondary-fixed-variant transition-colors">
                            {item.value}
                          </a>
                        : <div className="font-body text-sm text-primary font-medium">{item.value}</div>
                      }
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-5 shadow-card">
                <h3 className="font-headline font-semibold text-sm text-primary mb-3">Industry Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <span key={tag} className="tag-chip text-on-surface-variant bg-surface-container border-outline-variant/30 hover:border-secondary hover:text-secondary transition-all cursor-pointer">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-5">
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-5 shadow-card">
                <h4 className="font-headline font-semibold text-sm text-primary mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-secondary" />
                  Related Market Reports
                </h4>
                <div className="space-y-3">
                  {[
                    `Global ${company.industry} Market Outlook, 2024-2030`,
                    `North America ${company.industry} Market Outlook, 2024-2030`,
                    `${company.sector} Industry Analysis, 2024`,
                    `${company.industry} Competitive Landscape`,
                  ].map(report => (
                    <Link key={report} href="/industries"
                      className="block text-xs font-body text-on-surface-variant hover:text-secondary transition-colors pb-2 border-b border-surface-container last:border-0 leading-snug">
                      {report}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="rounded-xl p-5 bg-primary">
                <h4 className="font-headline font-semibold text-sm text-white mb-2">Need Custom Research?</h4>
                <p className="text-xs font-body text-white/60 mb-4 leading-relaxed">
                  Get a custom market analysis report tailored to your competitive intelligence needs.
                </p>
                <button className="w-full py-2 rounded-xl text-xs font-body font-bold text-primary bg-white hover:bg-surface-container-low transition-colors">
                  Request Custom Report
                </button>
              </div>
            </aside>
          </div>
        )}

        {activeTab === 'news' && (
          <div className="max-w-3xl">
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-12 shadow-card text-center">
              <Newspaper className="w-12 h-12 text-outline mx-auto mb-4" />
              <h3 className="font-headline font-semibold text-base text-primary mb-2">No news available</h3>
              <p className="font-body text-sm text-on-surface-variant">No recent news articles found for {company.name}.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
