'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store/ui-store'
import {
  Home, BarChart2, Clock, BookOpen, Building2, Settings,
  Lightbulb, CreditCard, ChevronDown, ChevronRight,
  ChevronLeft, Activity, TrendingUp, FileText, Contact,
  ClipboardList, Layers
} from 'lucide-react'

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  {
    icon: BarChart2,
    label: 'Industries',
    href: '/industries',
    children: [
      { label: 'Biotechnology', href: '/industries' },
      { label: 'Clinical Diagnostics', href: '/industries' },
      { label: 'Consumer Goods', href: '/industries' },
      { label: 'Polymers & Resins', href: '/industries' },
      { label: 'Technology', href: '/industries' },
      { label: 'Explore All', href: '/industries' },
    ],
  },
  { icon: Clock, label: 'Recent Visited', href: '/my-reports' },
  { icon: BookOpen, label: 'My Reports', href: '/my-reports' },
  {
    icon: Building2,
    label: 'Companies',
    href: '/companies',
    children: [
      { label: 'Healthcare', href: '/companies' },
      { label: 'Technology', href: '/companies' },
      { label: 'Energy', href: '/companies' },
      { label: 'Financials', href: '/companies' },
      { label: 'Explore All', href: '/companies' },
    ],
  },
  {
    icon: Settings,
    label: 'Services',
    href: '/services/pipeline',
    children: [
      { label: 'Pipeline', href: '/services/pipeline' },
      { label: 'Signal', href: '/services/signal' },
      { label: 'Brainshare', href: '/services/brainshare' },
      { label: 'Astra', href: '/services/astra' },
    ],
  },
  {
    icon: Lightbulb,
    label: 'Insights',
    href: '/insights/white-papers',
    children: [
      { label: 'White Papers', href: '/insights/white-papers' },
      { label: 'Thought Leadership', href: '/insights/thought-leadership' },
    ],
  },
  { icon: CreditCard, label: 'Pricing', href: '/pricing' },
  { icon: ClipboardList, label: 'Survey', href: '#' },
  { icon: Contact, label: 'Contact Us', href: '#' },
]

export default function Sidebar() {
  const { sidebarCollapsed: collapsed, toggleSidebar } = useUIStore()
  const [expandedItems, setExpandedItems] = useState<string[]>(['Industries'])
  const pathname = usePathname()

  const toggleExpand = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label) ? prev.filter(i => i !== label) : [...prev, label]
    )
  }

  const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href))

  return (
    <div
      className={cn(
        'flex flex-col h-full transition-all duration-300 ease-in-out relative overflow-hidden',
        collapsed ? 'w-16' : 'w-[220px]'
      )}
      style={{
        background: 'linear-gradient(180deg, #0a0f1e 0%, #0d1426 100%)',
        boxShadow: '4px 0 24px rgba(0,0,0,0.35)',
        borderRight: '1px solid rgba(200,169,110,0.18)',
      }}
    >
      {/* Top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c8a96e]/30 to-transparent" />

      {/* Logo Area */}
      <div className={cn(
        'flex items-center border-b border-white/[0.07] shrink-0',
        collapsed ? 'justify-center py-4 px-2' : 'px-5 py-4 gap-3'
      )}>
        <div
          className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
          style={{
            background: 'linear-gradient(135deg, #c8a96e, #b8924f)',
            boxShadow: '0 0 20px rgba(200,169,110,0.15)',
          }}>
          <TrendingUp className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <div>
            <span className="font-sora font-bold text-white text-sm tracking-tight">Horizon</span>
            <span className="block text-[10px] text-white/40 font-dm -mt-0.5">Intelligence</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto sidebar-scroll py-3 space-y-0.5 px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const hasChildren = item.children && item.children.length > 0
          const isExpanded = expandedItems.includes(item.label)
          const active = isActive(item.href)

          return (
            <div key={item.label}>
              <div
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-dm font-medium cursor-pointer transition-colors duration-150 group relative',
                  active
                    ? 'text-white border-l-2 border-[#c8a96e]'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                )}
                style={active ? { background: 'rgba(200,169,110,0.08)' } : {}}
                onClick={() => {
                  if (hasChildren && !collapsed) toggleExpand(item.label)
                }}
              >
                <Icon className={cn('w-4 h-4 shrink-0', active ? 'text-[#c8a96e]' : '')} />
                {!collapsed && (
                  <>
                    <Link href={item.href} className="flex-1" onClick={e => hasChildren && e.preventDefault()}>
                      {item.label}
                    </Link>
                    {hasChildren && (
                      <span className="ml-auto text-white/30">
                        {isExpanded
                          ? <ChevronDown className="w-3.5 h-3.5" />
                          : <ChevronRight className="w-3.5 h-3.5" />}
                      </span>
                    )}
                  </>
                )}
                {/* Tooltip on collapsed */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 text-xs"
                    style={{ background: '#0a0f1e', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {item.label}
                  </div>
                )}
              </div>

              {/* Sub-items */}
              {hasChildren && isExpanded && !collapsed && (
                <div className="ml-9 mt-0.5 space-y-0.5">
                  {item.children!.map((child) => {
                    const childActive = pathname === child.href
                    return (
                      <Link
                        key={child.label}
                        href={child.href}
                        className={cn(
                          'block px-3 py-1.5 text-xs font-dm rounded-md transition-colors',
                          childActive
                            ? 'text-[#c8a96e]'
                            : 'text-[#94a3b8] hover:text-white/90 hover:bg-white/5'
                        )}
                      >
                        {child.label}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Plan Badge — frosted glass */}
      {!collapsed && (
        <div className="mx-3 mb-2 p-3 rounded-xl backdrop-blur-sm"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
          <div className="text-xs font-dm text-white/40 mb-1">Current Plan</div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-sora font-semibold text-white">Free Plan</span>
            <Link href="/pricing" className="text-xs font-dm font-medium text-[#c8a96e] hover:text-white transition-colors">
              Upgrade →
            </Link>
          </div>
        </div>
      )}

      {/* Collapse Toggle */}
      <div className="p-2 border-t border-white/[0.07]">
        <button
          onClick={() => toggleSidebar()}
          className={cn(
            'flex items-center justify-center w-full py-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors duration-150',
            collapsed ? 'px-2' : 'gap-2 px-3'
          )}
        >
          {collapsed
            ? <ChevronRight className="w-4 h-4" />
            : <><ChevronLeft className="w-4 h-4" /><span className="text-xs font-dm">Collapse</span></>
          }
        </button>
      </div>
    </div>
  )
}
