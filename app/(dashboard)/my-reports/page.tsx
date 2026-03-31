'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Clock, Bookmark, Download, BarChart2, FileText, BookOpen, Trash2 } from 'lucide-react'
import { mockMarkets } from '@/lib/mock-data'
import { useBookmarksStore } from '@/store/bookmarks-store'

function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`
  return new Date(isoString).toLocaleDateString()
}

const myDownloads = [
  { name: 'Global_mAbs_Market_Report_2024.pdf', date: 'Mar 10, 2024', format: 'PDF', size: '4.2 MB' },
  { name: 'EV_Market_Statistics_2024.xlsx', date: 'Mar 5, 2024', format: 'XLS', size: '1.8 MB' },
]

const tabs = [
  { id: 'recent', label: 'Recent Visited', icon: Clock },
  { id: 'saved', label: 'My Reports', icon: Bookmark },
  { id: 'downloads', label: 'My Downloads', icon: Download },
]

export default function MyReportsPage() {
  const [activeTab, setActiveTab] = useState('recent')
  const { bookmarks, recentVisits, removeBookmark, addRecentVisit } = useBookmarksStore()

  const recentMarkets = recentVisits
    .map((v) => ({ visit: v, market: mockMarkets.find((m) => m.slug === v.marketSlug) }))
    .filter((x) => x.market !== undefined)

  const savedMarkets = bookmarks
    .map((b) => ({ bookmark: b, market: mockMarkets.find((m) => m.slug === b.marketSlug) }))
    .filter((x) => x.market !== undefined)

  return (
    <div className="min-h-screen bg-surface-app">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <h1 className="font-sora font-bold text-2xl text-brand-primary mb-5">My Reports</h1>
          <div className="flex gap-0 border-t border-gray-100 -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-dm font-medium border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-brand-accent text-brand-accent'
                    : 'border-transparent text-gray-500 hover:text-brand-primary'
                }`}>
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
                {tab.id === 'recent' && recentMarkets.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-dm font-bold bg-gray-100 text-gray-500">
                    {recentMarkets.length}
                  </span>
                )}
                {tab.id === 'saved' && savedMarkets.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-dm font-bold bg-brand-accent/10 text-brand-accent">
                    {savedMarkets.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">

        {/* Recent Visited */}
        {activeTab === 'recent' && (
          recentMarkets.length > 0 ? (
            <div className="space-y-3">
              {recentMarkets.map(({ visit, market }) => (
                <div key={visit.marketSlug}
                  className="bg-white rounded-2xl border border-gray-100 p-4 shadow-card flex items-center gap-4 hover:shadow-card-hover transition-all">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(17,17,21,0.06)' }}>
                    <BarChart2 className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-dm font-bold text-white bg-brand-primary">
                        {market!.type}
                      </span>
                      <span className="text-xs font-dm text-gray-400">{formatRelativeTime(visit.visitedAt)}</span>
                    </div>
                    <Link href={`/outlook/${market!.slug}/global`}
                      className="font-sora font-semibold text-sm text-brand-primary hover:text-brand-accent transition-colors block truncate">
                      Global {market!.title} Market Outlook, {market!.yearStart}–{market!.yearEnd}
                    </Link>
                    <div className="flex items-center gap-3 mt-2">
                      {['Overview', 'Statistics', 'Dashboard'].map((link) => (
                        <Link key={link} href={`/outlook/${market!.slug}/global`}
                          className="text-[10px] font-dm font-medium text-brand-accent hover:text-brand-secondary transition-colors">
                          {link}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Clock className="w-14 h-14 text-gray-200 mx-auto mb-4" />
              <h3 className="font-sora font-semibold text-lg text-brand-primary mb-2">No recent visits</h3>
              <p className="font-dm text-sm text-gray-500 mb-5">Markets you visit will appear here.</p>
              <Link href="/industries" className="btn-accent inline-flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Browse Markets
              </Link>
            </div>
          )
        )}

        {/* My Reports (Bookmarks) */}
        {activeTab === 'saved' && (
          savedMarkets.length > 0 ? (
            <div className="space-y-3">
              {savedMarkets.map(({ bookmark, market }) => (
                <div key={bookmark.marketSlug}
                  className="bg-white rounded-2xl border border-gray-100 p-4 shadow-card flex items-center gap-4 hover:shadow-card-hover transition-all">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(17,17,21,0.06)' }}>
                    <BarChart2 className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-dm font-bold text-white bg-brand-primary">
                        {market!.type}
                      </span>
                      <span className="text-xs font-dm text-gray-400">Saved {formatRelativeTime(bookmark.addedAt)}</span>
                    </div>
                    <Link href={`/outlook/${market!.slug}/global`}
                      className="font-sora font-semibold text-sm text-brand-primary hover:text-brand-accent transition-colors block truncate">
                      Global {market!.title} Market Outlook, {market!.yearStart}–{market!.yearEnd}
                    </Link>
                    <div className="flex items-center gap-3 mt-2">
                      {['Overview', 'Statistics', 'Dashboard'].map((link) => (
                        <Link key={link} href={`/outlook/${market!.slug}/global`}
                          className="text-[10px] font-dm font-medium text-brand-accent hover:text-brand-secondary transition-colors">
                          {link}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => removeBookmark(bookmark.marketSlug)}
                    className="p-2 rounded-lg hover:bg-red-50 hover:text-red-500 text-gray-400 transition-colors shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Bookmark className="w-14 h-14 text-gray-200 mx-auto mb-4" />
              <h3 className="font-sora font-semibold text-lg text-brand-primary mb-2">No saved reports yet</h3>
              <p className="font-dm text-sm text-gray-500 mb-5">
                Bookmark market reports to save them here for quick access.
              </p>
              <Link href="/industries" className="btn-accent inline-flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Browse Reports
              </Link>
            </div>
          )
        )}

        {/* My Downloads */}
        {activeTab === 'downloads' && (
          myDownloads.length > 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
              <table className="data-table w-full">
                <thead>
                  <tr>
                    <th>File Name</th>
                    <th>Format</th>
                    <th>Size</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {myDownloads.map((file, i) => (
                    <tr key={i}>
                      <td>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-brand-primary" />
                          <span className="font-dm text-sm text-brand-primary font-medium">{file.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className="stat-badge bg-brand-violet-light text-brand-violet">{file.format}</span>
                      </td>
                      <td className="font-dm text-gray-600 text-sm">{file.size}</td>
                      <td className="font-dm text-gray-500 text-sm">{file.date}</td>
                      <td>
                        <button className="flex items-center gap-1 text-xs font-dm font-medium text-brand-accent hover:text-brand-secondary transition-colors">
                          <Download className="w-3 h-3" /> Re-download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-20">
              <Download className="w-14 h-14 text-gray-200 mx-auto mb-4" />
              <h3 className="font-sora font-semibold text-lg text-brand-primary mb-2">No downloads yet</h3>
              <p className="font-dm text-sm text-gray-500">Downloaded reports and exports will appear here.</p>
            </div>
          )
        )}
      </div>
    </div>
  )
}
