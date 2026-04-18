'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store/ui-store'
import {
  Home, BarChart2, Clock, BookOpen, Building2, Settings,
  CreditCard, ChevronDown, ChevronRight,
  ChevronLeft, TrendingUp, Contact, ClipboardList,
  LogOut, HelpCircle, Sparkles
} from 'lucide-react'

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  {
    icon: BarChart2,
    label: 'Industries',
    href: '/industries',
    children: [
      { label: 'Biotechnology', href: '/search?industry=biotech' },
      { label: 'Clinical Diagnostics', href: '/search?industry=clinical-diagnostics' },
      { label: 'Consumer Goods', href: '/search?industry=consumer-goods' },
      { label: 'Pharmaceuticals', href: '/search?industry=pharma' },
      { label: 'Telecom & Tech', href: '/search?industry=telecom' },
      { label: 'Explore All', href: '/industries' },
    ],
  },
  { icon: Clock, label: 'Recent Visited', href: '/my-reports?tab=recent' },
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
  { icon: CreditCard, label: 'Pricing', href: '/pricing' },
  { icon: ClipboardList, label: 'Survey', href: '/survey' },
  { icon: Contact, label: 'Contact Us', href: '/contact' },
]

export default function Sidebar() {
  const { sidebarCollapsed: collapsed, toggleSidebar } = useUIStore()
  const [expandedItems, setExpandedItems] = useState<string[]>(['Industries'])
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const toggleExpand = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label) ? prev.filter(i => i !== label) : [...prev, label]
    )
  }

  const isActive = (href: string) => {
    const [path, query] = href.split('?')
    if (query) {
      const params = new URLSearchParams(query)
      const matches = pathname === path
      if (!matches) return false
      for (const [key, val] of params.entries()) {
        if (searchParams.get(key) !== val) return false
      }
      return true
    }
    return pathname === path || (path !== '/' && pathname.startsWith(path + '/'))
  }

  return (
    <div
      className={cn(
        'flex flex-col h-full transition-all duration-300 ease-in-out relative overflow-hidden bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800',
        collapsed ? 'w-16' : 'w-[220px]'
      )}
    >
      {/* Logo Area */}
      <div className={cn(
        'flex items-center shrink-0 border-b border-slate-200 dark:border-slate-800',
        collapsed ? 'justify-center py-4 px-2' : 'px-4 py-4 gap-3'
      )}>
        <div className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 bg-primary">
          <TrendingUp className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <div>
            <span className="font-headline font-extrabold text-slate-900 dark:text-white text-sm tracking-tight">The Curator</span>
            <span className="block text-[10px] text-slate-500 font-medium -mt-0.5">Premium Insights</span>
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
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-150 group relative',
                  active
                    ? 'text-ink bg-white shadow-[0_1px_2px_rgba(11,18,32,0.04)]'
                    : 'text-slate-500 hover:text-ink hover:bg-white/60'
                )}
                onClick={() => {
                  if (hasChildren && !collapsed) toggleExpand(item.label)
                }}
              >
                {/* Active marker — signal teal left rail */}
                {active && (
                  <span aria-hidden className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-signal" />
                )}
                <Icon className={cn('w-4 h-4 shrink-0', active ? 'text-signal' : '')} />
                {!collapsed && (
                  <>
                    <Link
                      href={item.href}
                      className={cn('flex-1 text-[13px]', active && 'font-semibold')}
                      onClick={e => hasChildren && e.preventDefault()}
                    >
                      {item.label}
                    </Link>
                    {hasChildren && (
                      <span className="ml-auto text-slate-400">
                        {isExpanded
                          ? <ChevronDown className="w-3.5 h-3.5" />
                          : <ChevronRight className="w-3.5 h-3.5" />}
                      </span>
                    )}
                  </>
                )}
                {/* Tooltip on collapsed */}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 text-xs font-medium bg-ink text-white shadow-lg">
                    {item.label}
                  </div>
                )}
              </div>

              {/* Sub-items */}
              {hasChildren && isExpanded && !collapsed && (
                <div className="ml-9 mt-0.5 space-y-0.5">
                  {item.children!.map((child) => {
                    const childPath = child.href.split('?')[0]
                    const childActive = pathname === childPath
                    return (
                      <Link
                        key={child.label}
                        href={child.href}
                        className={cn(
                          'block px-3 py-1.5 text-xs font-inter rounded-lg transition-colors',
                          childActive
                            ? 'text-primary font-semibold bg-white dark:bg-slate-800'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/40'
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

      {/* Footer links */}
      <div className="mt-auto border-t border-slate-200 dark:border-slate-800 p-3 space-y-1">
        {/* Ask AI button */}
        <Link
          href="/search"
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all bg-signal/10 text-signal hover:bg-signal/20',
            collapsed && 'justify-center px-2'
          )}
        >
          <Sparkles className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="truncate">Ask Insights</span>}
        </Link>
        <Link
          href="/support"
          className={cn(
            'flex items-center gap-3 px-3 py-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 rounded-xl transition-all text-sm',
            collapsed && 'justify-center'
          )}
        >
          <HelpCircle className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="font-inter font-medium">Support</span>}
        </Link>
        <Link
          href="/login"
          className={cn(
            'flex items-center gap-3 px-3 py-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 rounded-xl transition-all text-sm',
            collapsed && 'justify-center'
          )}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="font-inter font-medium">Sign Out</span>}
        </Link>

        {/* Collapse Toggle */}
        <button
          onClick={() => toggleSidebar()}
          className={cn(
            'flex items-center justify-center w-full py-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors duration-150',
            collapsed ? 'px-2' : 'gap-2 px-3'
          )}
        >
          {collapsed
            ? <ChevronRight className="w-4 h-4" />
            : <><ChevronLeft className="w-4 h-4" /><span className="text-xs font-inter">Collapse</span></>
          }
        </button>
      </div>
    </div>
  )
}
