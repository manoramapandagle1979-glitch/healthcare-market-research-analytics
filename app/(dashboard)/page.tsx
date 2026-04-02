'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Search, Sparkles, ArrowRight, Star, TrendingUp, BarChart2, Globe, Database, Activity, Users, Linkedin, Twitter } from 'lucide-react'
import { mockMarkets as markets } from '@/lib/mock-data'
import { testimonials, partnerLogos, pricingPlans, stats } from '@/lib/data'
import PricingCard from '@/components/ui/PricingCard'
import StatCounter from '@/components/ui/StatCounter'

const serviceTabs = [
  {
    id: 'databooks',
    label: 'Horizon Databooks',
    icon: Database,
    heading: 'The World\'s Most Comprehensive Market Database',
    description: 'Access 30,000+ global and regional market reports covering 23+ industries with granular statistics, forecasts, and CAGR data spanning 2018–2030. Our databooks provide the depth and breadth needed for strategic decisions.',
    stats: [
      { label: 'Market Reports', value: '30K+' },
      { label: 'Industries', value: '23+' },
      { label: 'Data Points', value: '1.2M+' },
    ],
    color: '#1c0048',
  },
  {
    id: 'pipeline',
    label: 'Pipeline',
    icon: Activity,
    heading: 'End-to-End Supply Chain Intelligence',
    description: 'Monitor and analyze global supply chains with real-time data on production capacity, supplier networks, and logistics performance. Make supply chain resilience decisions backed by granular market intelligence.',
    stats: [
      { label: 'Supply Chain Routes', value: '5K+' },
      { label: 'Suppliers Tracked', value: '50K+' },
      { label: 'Countries Covered', value: '180+' },
    ],
    color: '#006a61',
  },
  {
    id: 'signal',
    label: 'Signal',
    icon: TrendingUp,
    heading: 'Real-Time Pricing & Cost Intelligence',
    description: 'Track commodity prices, input costs, and market pricing indices in real-time. Signal provides the pricing transparency needed to optimize procurement, set competitive prices, and protect margins.',
    stats: [
      { label: 'Price Indices', value: '2K+' },
      { label: 'Commodities', value: '500+' },
      { label: 'Updates/Day', value: '10K+' },
    ],
    color: '#1c0048',
  },
  {
    id: 'brainshare',
    label: 'Brainshare',
    icon: Users,
    heading: 'Expert Consulting & Custom Research',
    description: 'Connect directly with our team of 300+ industry analysts for bespoke research, competitive intelligence, and strategic advisory. Brainshare transforms complex questions into actionable insights within days.',
    stats: [
      { label: 'Expert Analysts', value: '300+' },
      { label: 'Custom Projects/Year', value: '1,200+' },
      { label: 'Avg. Turnaround', value: '5 days' },
    ],
    color: '#1e293b',
  },
  {
    id: 'astra',
    label: 'Astra',
    icon: Globe,
    heading: 'Comprehensive ESG & Sustainability Analytics',
    description: 'Navigate ESG compliance and sustainability benchmarking with Astra\'s data-driven platform. Track environmental metrics, governance scores, and social impact indicators across 10,000+ companies globally.',
    stats: [
      { label: 'ESG Scores', value: '10K+' },
      { label: 'ESG Metrics', value: '200+' },
      { label: 'Frameworks', value: '15+' },
    ],
    color: '#006a61',
  },
]

const recentPublications = [
  { slug: 'monoclonal-antibodies', title: 'Global Monoclonal Antibodies Market', industry: 'Biotechnology', revenue: '$211.4B', cagr: '11.2%', year: '2030' },
  { slug: 'electric-vehicles', title: 'Electric Vehicles Market', industry: 'Automotive', revenue: '$951.9B', cagr: '13.7%', year: '2030' },
  { slug: 'solar-energy', title: 'Global Solar Energy Market', industry: 'Energy & Power', revenue: '$612.4B', cagr: '15.5%', year: '2030' },
  { slug: 'digital-health', title: 'Digital Health Market', industry: 'Healthcare', revenue: '$809.2B', cagr: '21.2%', year: '2030' },
]

const popularChips = ['Biotechnology', 'Clinical Diagnostics', 'Consumer Goods', 'Polymers & Resins', 'Technology', 'Energy & Power', 'Semiconductors']

export default function HomePage() {
  const [searchMode, setSearchMode] = useState<'search' | 'ai'>('search')
  const [activeTab, setActiveTab] = useState('databooks')
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const testimonialRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    testimonialRef.current = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length)
    }, 5000)
    return () => { if (testimonialRef.current) clearInterval(testimonialRef.current) }
  }, [])

  const pauseTestimonials = () => { if (testimonialRef.current) clearInterval(testimonialRef.current) }
  const resumeTestimonials = () => {
    testimonialRef.current = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length)
    }, 5000)
  }

  const activeService = serviceTabs.find(t => t.id === activeTab)!

  return (
    <div className="min-h-screen page-content">
      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION — dark navy with teal accents
      ═══════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden noise-overlay"
        style={{
          background: 'linear-gradient(135deg, #091426 0%, #1e293b 60%, #0d1a38 100%)',
          minHeight: '500px',
        }}>

        {/* Ambient blobs */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'rgba(0,106,97,0.12)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'rgba(28,0,72,0.10)', filter: 'blur(70px)' }} />

        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.03,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-body font-medium mb-8"
            style={{
              background: 'rgba(134,242,228,0.10)',
              border: '1px solid rgba(134,242,228,0.20)',
              color: '#6bd8cb',
              backdropFilter: 'blur(8px)',
            }}>
            <Sparkles className="w-3 h-3" />
            Enhanced with AI-Powered Research &amp; Data
          </div>

          {/* Heading */}
          <h1 className="font-headline font-extrabold text-white mb-2 leading-tight"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 3.75rem)', letterSpacing: '-0.03em' }}>
            Horizon Intelligence
          </h1>
          <h2 className="font-headline font-extrabold mb-6 leading-tight"
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.75rem)',
              color: '#6bd8cb',
              letterSpacing: '-0.03em',
            }}>
            Databooks
          </h2>

          <p className="font-body text-white/70 text-lg mb-2 max-w-2xl mx-auto font-light leading-relaxed">
            World&apos;s Largest Portal for Market Reports &amp; Statistics
          </p>
          <p className="font-body text-white/40 text-sm mb-10 max-w-xl mx-auto">
            30,000+ global market reports across 23+ industries — powered by AI
          </p>

          {/* Mode Toggle */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <button
              onClick={() => setSearchMode('search')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-body font-semibold transition-all duration-200 ${
                searchMode === 'search'
                  ? 'bg-white text-primary shadow-lg'
                  : 'text-white/70 hover:text-white'
              }`}
              style={searchMode !== 'search' ? { background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.15)' } : {}}>
              <Search className="w-3.5 h-3.5" />
              Search
            </button>
            <button
              onClick={() => setSearchMode('ai')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-body font-medium transition-all duration-200 ${
                searchMode === 'ai' ? 'text-primary shadow-md' : 'text-white/70 hover:text-white'
              }`}
              style={searchMode === 'ai'
                ? { background: '#86f2e4' }
                : { background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.15)' }}>
              <Sparkles className="w-3.5 h-3.5" />
              AI Search
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-6">
            <div className="relative shadow-2xl rounded-xl overflow-hidden">
              <div className="flex">
                <div className="flex-1 relative">
                  {searchMode === 'search'
                    ? <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                    : <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary" />}
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder={searchMode === 'search'
                      ? 'Find market statistics & reports...'
                      : 'Ask anything about market trends, statistics, or reports...'}
                    className="w-full pl-12 pr-4 py-4 bg-white text-on-surface text-sm font-body focus:outline-none placeholder:text-outline"
                    style={{ border: 'none' }}
                  />
                </div>
                <Link
                  href={`/search?q=${encodeURIComponent(searchQuery)}`}
                  className="flex items-center gap-2 px-6 py-4 text-sm font-body font-bold shrink-0 transition-all hover:opacity-90 active:scale-[0.97]"
                  style={{
                    background: searchMode === 'ai' ? '#35007b' : '#091426',
                    color: 'white',
                  }}>
                  {searchMode === 'search' ? 'Search' : 'Ask AI'}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Popular chips */}
          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-xs font-body text-white/40 mt-1">Popular:</span>
            {popularChips.map(chip => (
              <Link key={chip} href={`/search?q=${encodeURIComponent(chip)}`}
                className="px-3 py-1 rounded-full text-xs font-body font-medium text-white/75 hover:text-white transition-all hover:bg-white/20"
                style={{ background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.14)' }}>
                {chip}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          TRUST BAR
      ═══════════════════════════════════════════════════════════ */}
      <section className="border-y overflow-hidden py-5 bg-surface-container-lowest border-surface-container-high">
        <div className="text-center mb-3">
          <span className="text-xs font-body font-semibold text-on-surface-variant uppercase tracking-widest">
            Trusted by industry leaders worldwide
          </span>
        </div>
        <div className="logos-track relative overflow-hidden">
          <div className="flex animate-marquee gap-12 whitespace-nowrap" style={{ width: 'max-content' }}>
            {[...partnerLogos, ...partnerLogos].map((logo, i) => (
              <div key={i} className="flex items-center justify-center h-8 px-4">
                <span className="font-headline font-bold text-outline text-sm tracking-tight hover:text-on-surface-variant transition-colors cursor-default">
                  {logo}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          RECENT PUBLICATIONS
      ═══════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-headline font-extrabold text-2xl text-primary">Recent Publications</h2>
            <p className="text-sm font-body text-on-surface-variant mt-1">Latest market intelligence reports</p>
          </div>
          <Link href="/industries" className="flex items-center gap-1.5 text-sm font-body font-medium text-secondary hover:text-on-secondary-fixed-variant transition-colors">
            View all reports <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {recentPublications.map((pub, i) => (
            <div key={pub.slug}
              className="group relative bg-surface-container-lowest rounded-xl border border-transparent p-5 transition-all duration-300 cursor-pointer overflow-hidden hover:shadow-card-hover hover:border-outline-variant/30 hover:scale-[1.01]">

              {/* Top accent bar on hover */}
              <div className="absolute top-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left bg-secondary" />

              {/* Category badge */}
              <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-body font-semibold mb-3 bg-secondary-container/40 text-on-secondary-container">
                {pub.industry}
              </span>

              {/* Mini chart placeholder */}
              <div className="h-12 mb-4 rounded-lg flex items-center justify-center"
                style={{ background: i % 2 === 0 ? 'rgba(28,0,72,0.07)' : 'rgba(0,106,97,0.07)' }}>
                <BarChart2 className="w-5 h-5" style={{ color: i % 2 === 0 ? 'rgba(28,0,72,0.45)' : 'rgba(0,106,97,0.55)' }} />
              </div>

              {/* Title */}
              <Link href={`/outlook/${pub.slug}/global`}
                className="block font-headline font-semibold text-sm leading-snug mb-3 text-primary hover:text-secondary transition-colors line-clamp-2">
                {pub.title} Market Size &amp; Outlook, 2024–{pub.year}
              </Link>

              {/* Stats */}
              <div className="flex items-center gap-3 mb-4 text-xs font-body text-on-surface-variant">
                <span className="font-semibold text-primary">{pub.revenue}</span>
                <span className="w-1 h-1 rounded-full bg-outline-variant" />
                <span>CAGR <strong className="text-secondary">{pub.cagr}</strong></span>
              </div>

              {/* Quick Links */}
              <div className="flex items-center gap-3 pt-3 border-t border-surface-container">
                {['Dashboard', 'Statistics', 'Report'].map(link => (
                  <Link key={link} href={`/outlook/${pub.slug}/global`}
                    className="text-[10px] font-body font-medium text-on-surface-variant hover:text-secondary uppercase tracking-wider transition-colors">
                    {link}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SERVICE TABS — dark section
      ═══════════════════════════════════════════════════════════ */}
      <section style={{ background: '#091426' }} className="py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="font-headline font-extrabold text-2xl text-white mb-2">Our Intelligence Suite</h2>
            <p className="text-sm font-body text-white/50">Five powerful tools to drive your market strategy</p>
          </div>

          {/* Tab Pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {serviceTabs.map(tab => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-body font-medium transition-all duration-200"
                  style={isActive
                    ? { border: '1px solid #6bd8cb', color: '#6bd8cb', background: 'transparent' }
                    : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.50)' }}>
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Active Tab Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-body font-semibold text-white mb-4"
                style={{ background: activeService.color }}>
                <activeService.icon className="w-3 h-3" />
                {activeService.label}
              </div>
              <h3 className="font-headline font-bold text-xl text-white mb-4 leading-tight">
                {activeService.heading}
              </h3>
              <p className="text-sm font-body leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.60)' }}>
                {activeService.description}
              </p>
              <div className="flex items-center gap-8 mb-6">
                {activeService.stats.map(s => (
                  <div key={s.label}>
                    <div className="font-headline font-extrabold text-xl text-secondary-fixed">{s.value}</div>
                    <div className="text-xs font-body" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <button className="flex items-center gap-2 text-sm font-body font-bold px-5 py-2.5 rounded-xl transition-all hover:opacity-90 active:scale-[0.97] bg-secondary text-white">
                Talk to an Expert
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Glassmorphism illustration panel */}
            <div className="relative rounded-xl overflow-hidden h-72"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.10)',
                backdropFilter: 'blur(12px)',
              }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: `${activeService.color}30` }}>
                    <activeService.icon className="w-10 h-10" style={{ color: activeService.color }} />
                  </div>
                  <div className="font-headline font-bold text-2xl mb-1 text-secondary-fixed">
                    {activeService.label}
                  </div>
                  <div className="text-sm" style={{ color: 'rgba(255,255,255,0.40)' }}>Intelligence Platform</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          PRICING PREVIEW
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 relative overflow-hidden" style={{ background: '#0d1525' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full"
            style={{ background: 'rgba(28,0,72,0.08)', filter: 'blur(80px)' }} />
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full"
            style={{ background: 'rgba(0,106,97,0.06)', filter: 'blur(60px)' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-headline font-extrabold text-3xl text-white mb-3">Plans &amp; Pricing</h2>
            <p className="text-white/50 font-body text-sm">Start free, scale as you grow</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-center">
            {pricingPlans.map(plan => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="font-body text-white/40 text-sm mb-3">
              The price packages don&apos;t meet your needs? Tell us more &amp; our analysts will custom build a package for you.
            </p>
            <Link href="/pricing"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-body font-bold bg-secondary text-white transition-all hover:bg-on-secondary-fixed-variant active:scale-[0.97]">
              Custom Pricing
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          STATS COUNTER
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-16" style={{ background: '#091426' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(stat => (
              <StatCounter
                key={stat.label}
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
                label={stat.label}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════════════════════ */}
      <section style={{ background: '#091426' }} className="pb-16 pt-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="font-headline font-extrabold text-2xl text-white mb-2">Trusted by Market Leaders</h2>
            <p className="text-sm font-body text-white/40">Join thousands of analysts who rely on Horizon Intelligence</p>
          </div>

          <div
            className="relative"
            onMouseEnter={pauseTestimonials}
            onMouseLeave={resumeTestimonials}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <div key={i}
                  className={`rounded-xl p-6 transition-all duration-500 ${
                    i === activeTestimonial ? 'shadow-2xl -translate-y-1' : ''
                  }`}
                  style={{
                    background: i === activeTestimonial
                      ? 'rgba(255,255,255,0.07)'
                      : 'rgba(255,255,255,0.04)',
                    border: i === activeTestimonial
                      ? '1px solid rgba(107,216,203,0.25)'
                      : '1px solid rgba(255,255,255,0.07)',
                  }}>
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, si) => (
                      <Star key={si} className="w-3.5 h-3.5 fill-[#6bd8cb] text-[#6bd8cb]" />
                    ))}
                  </div>

                  <blockquote className="font-body text-sm leading-relaxed mb-5 italic" style={{ color: 'rgba(255,255,255,0.75)' }}>
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-headline font-bold shrink-0"
                      style={{ background: '#1e293b', outline: '2px solid rgba(107,216,203,0.25)', outlineOffset: '2px' }}>
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-headline font-semibold text-sm text-white">{t.name}</div>
                      <div className="font-body text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{t.title}</div>
                      <div className="font-body text-xs font-medium text-secondary-fixed">{t.company}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className="rounded-full transition-all duration-300"
                  style={i === activeTestimonial
                    ? { background: '#6bd8cb', width: '24px', height: '8px' }
                    : { background: 'rgba(255,255,255,0.20)', width: '8px', height: '8px' }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-20" style={{ background: '#091426' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,106,97,0.08), transparent)' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-body font-semibold mb-6"
            style={{ background: 'rgba(134,242,228,0.10)', border: '1px solid rgba(134,242,228,0.20)', color: '#6bd8cb' }}>
            <TrendingUp className="w-3 h-3" />
            Start exploring today
          </div>
          <h2 className="font-headline font-extrabold text-3xl text-white mb-4 leading-tight">
            Your Next Big Market Insight
          </h2>
          <div className="block text-3xl font-headline font-extrabold mb-6 text-secondary-fixed"
            style={{ letterSpacing: '-0.03em' }}>
            Is One Search Away
          </div>
          <p className="font-body text-base mb-8 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Join 15,000+ analysts, strategists, and investors who trust Horizon Intelligence for market decisions that matter.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-body font-bold bg-secondary text-white transition-all hover:bg-on-secondary-fixed-variant active:scale-[0.97]">
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/pricing"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-body font-semibold text-white transition-all hover:bg-white/10"
              style={{ border: '1px solid rgba(255,255,255,0.25)' }}>
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════════ */}
      <footer style={{ background: '#060a14', borderTop: '1px solid rgba(107,216,203,0.15)' }}>
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-secondary">
                  <TrendingUp className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-headline font-extrabold text-white text-sm">Horizon Intelligence</span>
              </div>
              <p className="text-xs font-body leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>
                World&apos;s largest portal for market reports &amp; statistics, enhanced with AI.
              </p>
              <div className="flex items-center gap-3">
                <a href="#" className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10"
                  style={{ border: '1px solid rgba(255,255,255,0.10)' }}>
                  <Linkedin className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.45)' }} />
                </a>
                <a href="#" className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10"
                  style={{ border: '1px solid rgba(255,255,255,0.10)' }}>
                  <Twitter className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.45)' }} />
                </a>
              </div>
            </div>

            {/* Link columns */}
            {[
              { title: 'Platform', links: ['Industries', 'Companies', 'Search', 'Pricing'] },
              { title: 'Services', links: ['Databooks', 'Pipeline', 'Signal', 'Brainshare', 'Astra'] },
              { title: 'Company', links: ['About', 'Contact', 'Privacy Policy', 'Terms & Conditions'] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="font-headline font-semibold text-white text-xs uppercase tracking-widest mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map(link => (
                    <li key={link}>
                      <Link href="#" className="text-xs font-body transition-colors text-white/40 hover:text-white/80">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-xs font-body text-white/25">
              &copy; 2025 Horizon Intelligence. All rights reserved.
            </p>
            <div className="flex gap-5">
              {['Privacy Policy', 'Terms & Conditions', 'Cookie Policy'].map(link => (
                <Link key={link} href="#" className="text-xs font-body text-white/25 hover:text-white/55 transition-colors">
                  {link}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
