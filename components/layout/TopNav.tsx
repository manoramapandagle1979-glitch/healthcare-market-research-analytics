'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, ChevronDown, Bell, User, Settings, LogOut, CreditCard, HelpCircle, BookOpen } from 'lucide-react'
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
    <header
      className="sticky top-0 z-50 backdrop-blur-md border-b"
      style={{
        height: '64px',
        background: 'rgba(10, 15, 30, 0.97)',
        borderBottomColor: 'rgba(255,255,255,0.07)',
      }}>
      {/* Thin gold accent line at very bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'rgba(200,169,110,0.15)' }} />

      <div className="flex items-center h-full px-4 gap-3">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Find market statistics & reports..."
              className="w-full pl-9 pr-4 py-2 text-sm font-dm rounded-lg focus:outline-none focus:ring-1 focus:ring-[#c8a96e]/40 transition-all"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.10)',
                color: 'rgba(255,255,255,0.85)',
              }}
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
              'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-dm font-medium transition-colors duration-150',
              activeDropdown === 'statistics'
                ? 'text-white bg-white/10'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            )}>
              Statistics <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {activeDropdown === 'statistics' && (
              <div className="absolute top-full left-0 mt-1 w-[640px] bg-white rounded-2xl shadow-2xl border border-[#e5e1d8] p-5 z-50">
                <div className="grid grid-cols-4 gap-4 mb-4">
                  {industryColumns.map((col, ci) => (
                    <div key={ci} className="space-y-1">
                      {col.map(ind => (
                        <Link key={ind.id} href={`/industries`}
                          className="block text-xs font-dm text-gray-600 hover:text-[#0a0f1e] hover:bg-[#f8f7f4] px-2 py-1 rounded transition-colors">
                          {ind.name}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#f0ece4] pt-3">
                  <Link href="/industries" className="text-xs font-dm font-semibold text-[#c8a96e] hover:text-[#b8924f] transition-colors">
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
              'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-dm font-medium transition-colors duration-150',
              activeDropdown === 'reports'
                ? 'text-white bg-white/10'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            )}>
              Reports <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {activeDropdown === 'reports' && (
              <div className="absolute top-full left-0 mt-1 w-[640px] bg-white rounded-2xl shadow-2xl border border-[#e5e1d8] p-5 z-50">
                <div className="grid grid-cols-4 gap-4 mb-4">
                  {industryColumns.map((col, ci) => (
                    <div key={ci} className="space-y-1">
                      {col.map(ind => (
                        <Link key={ind.id} href={`/industries`}
                          className="block text-xs font-dm text-gray-600 hover:text-[#0a0f1e] hover:bg-[#f8f7f4] px-2 py-1 rounded transition-colors">
                          {ind.name}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#f0ece4] pt-3">
                  <Link href="/industries" className="text-xs font-dm font-semibold text-[#c8a96e] hover:text-[#b8924f] transition-colors">
                    → View All Reports
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Pricing */}
          <Link href="/pricing" className="px-3 py-2 rounded-lg text-sm font-dm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors duration-150">
            Pricing
          </Link>

          {/* Services */}
          <div className="relative"
            onMouseEnter={() => handleDropdownEnter('services')}
            onMouseLeave={handleDropdownLeave}>
            <button className={cn(
              'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-dm font-medium transition-colors duration-150',
              activeDropdown === 'services'
                ? 'text-white bg-white/10'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            )}>
              Services <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {activeDropdown === 'services' && (
              <div className="absolute top-full right-0 mt-1 w-80 bg-white rounded-2xl shadow-2xl border border-[#e5e1d8] p-4 z-50">
                {servicesItems.map(s => (
                  <Link key={s.href} href={s.href}
                    className="flex flex-col px-3 py-2.5 rounded-xl hover:bg-[#f8f7f4] transition-colors">
                    <span className="text-sm font-dm font-semibold text-[#0a0f1e]">{s.label}</span>
                    <span className="text-xs font-dm text-gray-500 mt-0.5">{s.desc}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 ml-auto shrink-0">
          {/* Upgrade — champagne gold, rounded-lg, dark text */}
          <Link href="/pricing"
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-dm font-semibold transition-all duration-200 hover:shadow-[0_0_16px_rgba(200,169,110,0.35)] active:scale-[0.97]"
            style={{ background: '#c8a96e', color: '#0a0f1e' }}>
            Upgrade Plan
          </Link>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-white/10 transition-colors">
            <Bell className="w-4 h-4 text-white/50" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#c8a96e]" />
          </button>

          {/* User */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-sora font-bold ring-2 ring-[#c8a96e]/30"
                style={{ background: '#6366f1' }}>
                JD
              </div>
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-[#e5e1d8] py-2 z-50">
                <div className="px-4 py-2 border-b border-[#f0ece4] mb-1">
                  <div className="text-sm font-dm font-semibold text-[#0a0f1e]">John Doe</div>
                  <div className="text-xs font-dm text-gray-500">john@company.com</div>
                </div>
                {[
                  { icon: User, label: 'Profile', href: '/profile' },
                  { icon: CreditCard, label: 'Subscription', href: '/profile' },
                  { icon: BookOpen, label: 'My Reports', href: '/my-reports' },
                  { icon: Settings, label: 'Settings', href: '/profile' },
                  { icon: HelpCircle, label: 'Help Center', href: '#' },
                ].map(item => (
                  <Link key={item.label} href={item.href}
                    className="flex items-center gap-3 px-4 py-2 text-sm font-dm text-gray-600 hover:text-[#0a0f1e] hover:bg-[#f8f7f4] transition-colors"
                    onClick={() => setUserMenuOpen(false)}>
                    <item.icon className="w-3.5 h-3.5" />
                    {item.label}
                  </Link>
                ))}
                <div className="border-t border-[#f0ece4] mt-1 pt-1">
                  <button className="flex items-center gap-3 w-full px-4 py-2 text-sm font-dm text-red-500 hover:bg-red-50 transition-colors">
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
