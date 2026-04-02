'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store/ui-store'
import {
  Home, BarChart2, Clock, BookOpen, Building2, Settings,
  Lightbulb, CreditCard, ChevronDown, ChevronRight,
  ChevronLeft, TrendingUp, Contact, ClipboardList,
  Zap, LogOut, HelpCircle
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
  { icon: ClipboardList, label: 'Survey', href: '/survey' },
  { icon: Contact, label: 'Contact Us', href: '/contact' },
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
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200 group relative',
                  active
                    ? 'text-slate-900 dark:text-white font-bold bg-white dark:bg-slate-800 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/30 hover:translate-x-1'
                )}
                onClick={() => {
                  if (hasChildren && !collapsed) toggleExpand(item.label)
                }}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && (
                  <>
                    <Link href={item.href} className="flex-1 font-inter text-sm" onClick={e => hasChildren && e.preventDefault()}>
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
                  <div className="absolute left-full ml-2 px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 text-xs bg-slate-900 text-white">
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

      {/* CTA Button + Footer links */}
      <div className="mt-auto border-t border-slate-200 dark:border-slate-800 p-3 space-y-1">
        {!collapsed && (
          <button className="w-full bg-primary text-white py-2.5 rounded-xl mb-3 font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.98]">
            <Zap className="w-4 h-4" />
            Ask Insights
          </button>
        )}
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
