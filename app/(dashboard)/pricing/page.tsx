'use client'

import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'
import { pricingPlans, stats, testimonials } from '@/lib/data'
import PricingCard from '@/components/ui/PricingCard'
import StatCounter from '@/components/ui/StatCounter'

export default function PricingPage() {
  return (
    <div className="min-h-screen page-content">
      {/* Hero */}
      <section className="relative py-16 overflow-hidden bg-primary">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full"
            style={{ background: 'rgba(0,106,97,0.12)', filter: 'blur(60px)' }} />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full"
            style={{ background: 'rgba(28,0,72,0.15)', filter: 'blur(50px)' }} />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-body font-semibold mb-6 bg-secondary/15 border border-secondary/25 text-secondary-fixed">
            Simple, Transparent Pricing
          </div>
          <h1 className="font-headline font-bold text-4xl text-white mb-4" style={{ letterSpacing: '-0.02em' }}>
            Plans &amp; Pricing
          </h1>
          <p className="font-body text-base mb-2 text-white/60">
            Choose the plan that fits your research needs. Start free, scale as you grow.
          </p>
          <p className="font-body text-sm text-white/35">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 bg-primary-container">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-center">
            {pricingPlans.map(plan => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>
          <div className="text-center mt-12 p-8 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="font-headline font-bold text-xl text-white mb-2">Need a Custom Plan?</h3>
            <p className="font-body text-sm mb-5 max-w-lg mx-auto text-white/50">
              The price packages don&apos;t meet your needs? Tell us more &amp; our analysts will custom build a package for you.
            </p>
            <Link href="/contact"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-body font-semibold transition-all bg-secondary text-white hover:opacity-90 active:scale-[0.97]">
              Custom Pricing
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-14 bg-background border-y border-surface-container-high">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="font-headline font-bold text-2xl text-primary mb-2">Compare Plans</h2>
            <p className="font-body text-sm text-on-surface-variant">Full feature breakdown across all plans</p>
          </div>

          <div className="overflow-x-auto rounded-xl shadow-card border border-outline-variant/20">
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="border-b border-outline-variant/30">
                  <th className="text-left px-6 py-4 font-headline font-semibold text-on-surface-variant w-1/3 bg-surface-container-low">Feature</th>
                  {pricingPlans.map(plan => (
                    <th key={plan.id} className="px-4 py-4 font-headline font-semibold text-center bg-surface-container-low"
                      style={{ color: plan.highlighted ? '#006a61' : '#091426' }}>
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Market Reports Access', values: ['Limited', 'Full', 'Full', 'Full + Custom'] },
                  { label: 'AI Queries', values: ['3/month', '20/month', 'Unlimited', 'Unlimited'] },
                  { label: 'Statistics Rows', values: ['50', '500', 'Unlimited', 'Unlimited'] },
                  { label: 'Export Formats', values: ['—', 'CSV, XLS', 'All formats', 'All formats'] },
                  { label: 'Full Reports/Year', values: ['—', '1', '25', 'Unlimited'] },
                  { label: 'Company Profiles', values: ['Basic', 'Full', 'Full', 'Full + API'] },
                  { label: 'Analyst Support', values: ['—', 'Email', 'Priority', 'Dedicated AM'] },
                  { label: 'API Access', values: ['—', '—', 'Beta', 'Full'] },
                  { label: 'Users', values: ['1', '1', '2', '10+'] },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-outline-variant/15 last:border-0"
                    style={{ background: i % 2 === 0 ? '#ffffff' : 'rgba(242,244,246,0.5)' }}>
                    <td className="px-6 py-3.5 font-medium text-on-surface">{row.label}</td>
                    {row.values.map((val, j) => (
                      <td key={j} className="px-4 py-3.5 text-center text-on-surface-variant">
                        {val === '—' ? (
                          <span className="text-outline">—</span>
                        ) : (
                          <span className={pricingPlans[j].highlighted ? 'text-secondary font-semibold' : ''}>{val}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(stat => (
              <StatCounter key={stat.label} value={stat.value} prefix={stat.prefix} suffix={stat.suffix} label={stat.label} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials — dark section */}
      <section className="pb-16 pt-4 bg-primary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="font-headline font-bold text-2xl text-white mb-2">What Our Customers Say</h2>
            <p className="font-body text-sm text-white/40">Trusted by market leaders across industries</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 bg-white/5 border border-white/10">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, si) => (
                    <Star key={si} className="w-3.5 h-3.5 fill-secondary-fixed text-secondary-fixed" />
                  ))}
                </div>
                <blockquote className="font-body text-sm leading-relaxed mb-5 italic text-white/72">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-headline font-bold shrink-0 bg-primary-container border-2 border-secondary/25">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-headline font-semibold text-sm text-white">{t.name}</div>
                    <div className="font-body text-xs text-white/40">
                      {t.title} · <span className="text-secondary-fixed">{t.company}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ CTA */}
      <section className="py-12 bg-background border-t border-surface-container-high">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h3 className="font-headline font-bold text-xl text-primary mb-3">Still have questions?</h3>
          <p className="font-body text-sm text-on-surface-variant mb-6">Our team is ready to help you find the right plan for your needs.</p>
          <div className="flex justify-center gap-4">
            <Link href="/contact" className="btn-primary">Talk to Sales</Link>
            <Link href="/faq" className="btn-outline">View FAQ</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
