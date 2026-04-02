'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, ChevronDown, Bell, User, Settings, LogOut, CreditCard, HelpCircle, BookOpen, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { mockIndustries as industries } from '@/lib/mock-data'
import { useUserStore } from '@/store/user-store'

const industryColumns = [
  industries.slice(0, 6),
  industries.slice(6, 12),
  industries.slice(12, 18),
  industries.slice(18),
]

const servicesItems = [
  { label: 'ESG Solutions (Astra)', href: '/services/astra', desc: 'Sustainability benchmarking & ESG analytics' },
  { label: 'Analytics & Consulting (Brainshare)', href: '/services/brainshare', desc: 'Expert consulting and custom research' },
  { label: 'Supply Chain Intelligence (Pipeline)', href: '/services/pipeline', desc: 'End-to-end supply chain data' },
  { label: 'Pricing Intelligence (Signal)', href: '/services/signal', desc: 'Real-time pricing and cost indices' },
]

export default function TopNav() {
  const router = useRouter()
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { user } = useUserStore()
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleDropdownEnter = (name: string) => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current)
    setActiveDropdown(name)
  }

  const handleDropdownLeave = () => {
    leaveTimer.current = setTimeout(() => setActiveDropdown(null), 150)
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-sm border-b border-slate-200/60 dark:border-slate-800/60"
      style={{ height: '64px' }}>
      <div className="flex items-center h-full px-6 gap-4">

        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Find market statistics & reports..."
              className="w-full pl-9 pr-4 py-2 text-sm font-inter bg-slate-100 dark:bg-slate-800 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Nav Items */}
        <nav className="hidden lg:flex items-center gap-1">
          {/* Statistics */}
          <div className="relative"
            onMouseEnter={() => handleDropdownEnter('statistics')}
            onMouseLeave={handleDropdownLeave}>
            <button className={cn(
              'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-manrope font-medium tracking-tight transition-colors duration-150',
              activeDropdown === 'statistics'
                ? 'text-slate-900 dark:text-white'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
            )}>
              Statistics <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {activeDropdown === 'statistics' && (
              <div className="absolute top-full left-0 mt-1 w-[640px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 p-5 z-50">
                <div className="grid grid-cols-4 gap-4 mb-4">
                  {industryColumns.map((col, ci) => (
                    <div key={ci} className="space-y-1">
                      {col.map(ind => (
                        <Link key={ind.id} href="/industries"
                          className="block text-xs font-inter text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white hover:bg-surface-container-low dark:hover:bg-slate-700 px-2 py-1 rounded-lg transition-colors">
                          {ind.name}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-100 dark:border-slate-700 pt-3">
                  <Link href="/industries" className="text-xs font-inter font-semibold text-secondary hover:text-on-secondary-fixed-variant transition-colors">
                    → View All Statistics
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Reports */}
          <div className="relative"
            onMouseEnter={() => handleDropdownEnter('reports')}
            onMouseLeave={handleDropdownLeave}>
            <button className={cn(
              'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-manrope font-medium tracking-tight transition-colors duration-150',
              activeDropdown === 'reports'
                ? 'text-slate-900 dark:text-white'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
            )}>
              Reports <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {activeDropdown === 'reports' && (
              <div className="absolute top-full left-0 mt-1 w-[640px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 p-5 z-50">
                <div className="grid grid-cols-4 gap-4 mb-4">
                  {industryColumns.map((col, ci) => (
                    <div key={ci} className="space-y-1">
                      {col.map(ind => (
                        <Link key={ind.id} href="/industries"
                          className="block text-xs font-inter text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white hover:bg-surface-container-low px-2 py-1 rounded-lg transition-colors">
                          {ind.name}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-100 dark:border-slate-700 pt-3">
                  <Link href="/industries" className="text-xs font-inter font-semibold text-secondary hover:text-on-secondary-fixed-variant transition-colors">
                    → View All Reports
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Pricing */}
          <Link href="/pricing" className="px-3 py-2 rounded-lg text-sm font-manrope font-medium tracking-tight text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors duration-150">
            Pricing
          </Link>

          {/* Services */}
          <div className="relative"
            onMouseEnter={() => handleDropdownEnter('services')}
            onMouseLeave={handleDropdownLeave}>
            <button className={cn(
              'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-manrope font-medium tracking-tight transition-colors duration-150',
              activeDropdown === 'services'
                ? 'text-slate-900 dark:text-white'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
            )}>
              Services <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {activeDropdown === 'services' && (
              <div className="absolute top-full right-0 mt-1 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 p-4 z-50">
                {servicesItems.map(s => (
                  <Link key={s.href} href={s.href}
                    className="flex flex-col px-3 py-2.5 rounded-xl hover:bg-surface-container-low dark:hover:bg-slate-700 transition-colors">
                    <span className="text-sm font-inter font-semibold text-primary dark:text-white">{s.label}</span>
                    <span className="text-xs font-inter text-on-surface-variant dark:text-slate-400 mt-0.5">{s.desc}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 ml-auto shrink-0">
          {/* Upgrade — primary navy */}
          <Link href="/pricing"
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-inter font-bold bg-primary text-white transition-all duration-200 hover:opacity-90 active:scale-[0.97]">
            <Zap className="w-3.5 h-3.5" />
            Upgrade
          </Link>

          {/* Notifications */}
          <button className="relative p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors">
            <Bell className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-secondary" />
          </button>

          {/* User */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-headline font-bold ring-2 ring-primary/10"
                style={{ background: '#1c0048' }}>
                JD
              </div>
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 py-2 z-50">
                <div className="px-4 py-2 border-b border-surface-container-low dark:border-slate-700 mb-1">
                  <div className="text-sm font-inter font-semibold text-primary dark:text-white">John Doe</div>
                  <div className="text-xs font-inter text-on-surface-variant dark:text-slate-400">john@company.com</div>
                </div>
                {[
                  { icon: User, label: 'Profile', href: '/profile' },
                  { icon: CreditCard, label: 'Subscription', href: '/profile' },
                  { icon: BookOpen, label: 'My Reports', href: '/my-reports' },
                  { icon: Settings, label: 'Settings', href: '/profile' },
                  { icon: HelpCircle, label: 'Help Center', href: '#' },
                ].map(item => (
                  <Link key={item.label} href={item.href}
                    className="flex items-center gap-3 px-4 py-2 text-sm font-inter text-on-surface-variant dark:text-slate-300 hover:text-primary dark:hover:text-white hover:bg-surface-container-low dark:hover:bg-slate-700 transition-colors"
                    onClick={() => setUserMenuOpen(false)}>
                    <item.icon className="w-3.5 h-3.5" />
                    {item.label}
                  </Link>
                ))}
                <div className="border-t border-surface-container-low dark:border-slate-700 mt-1 pt-1">
                  <button className="flex items-center gap-3 w-full px-4 py-2 text-sm font-inter text-error hover:bg-error-container/20 transition-colors">
                    <LogOut className="w-3.5 h-3.5" />
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
