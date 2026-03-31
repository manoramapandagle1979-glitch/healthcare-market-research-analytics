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
      <section className="relative py-16 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0f2044 60%, #0d1a38 100%)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full"
            style={{ background: 'rgba(99,102,241,0.08)', filter: 'blur(60px)' }} />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full"
            style={{ background: 'rgba(200,169,110,0.06)', filter: 'blur(50px)' }} />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-dm font-semibold mb-6"
            style={{ background: 'rgba(200,169,110,0.12)', border: '1px solid rgba(200,169,110,0.25)', color: '#c8a96e' }}>
            Simple, Transparent Pricing
          </div>
          <h1 className="font-sora font-bold text-4xl text-white mb-4" style={{ letterSpacing: '-0.02em' }}>
            Plans &amp; Pricing
          </h1>
          <p className="font-dm text-base mb-2" style={{ color: 'rgba(255,255,255,0.60)' }}>
            Choose the plan that fits your research needs. Start free, scale as you grow.
          </p>
          <p className="font-dm text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12" style={{ background: '#0f0f14' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-center">
            {pricingPlans.map(plan => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>
          <div className="text-center mt-12 p-8 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 className="font-sora font-bold text-xl text-white mb-2">Need a Custom Plan?</h3>
            <p className="font-dm text-sm mb-5 max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.50)' }}>
              The price packages don&apos;t meet your needs? Tell us more &amp; our analysts will custom build a package for you.
            </p>
            <Link href="#"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-dm font-semibold transition-all hover:shadow-[0_0_20px_rgba(200,169,110,0.25)] active:scale-[0.97]"
              style={{ background: '#c8a96e', color: '#0a0f1e' }}>
              Custom Pricing
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-14" style={{ background: '#f8f7f4', borderTop: '1px solid #e5e1d8', borderBottom: '1px solid #e5e1d8' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="font-sora font-bold text-2xl mb-2" style={{ color: '#0a0f1e' }}>Compare Plans</h2>
            <p className="font-dm text-sm text-gray-500">Full feature breakdown across all plans</p>
          </div>

          <div className="overflow-x-auto rounded-2xl shadow-card" style={{ border: '1px solid #e5e1d8' }}>
            <table className="w-full text-sm font-dm">
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e1d8' }}>
                  <th className="text-left px-6 py-4 font-sora font-semibold text-gray-600 w-1/3"
                    style={{ background: '#f8f7f4' }}>Feature</th>
                  {pricingPlans.map(plan => (
                    <th key={plan.id} className="px-4 py-4 font-sora font-semibold text-center"
                      style={{
                        background: '#f8f7f4',
                        color: plan.highlighted ? '#c8a96e' : '#0a0f1e',
                      }}>
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
                  <tr key={i} className={i % 2 === 0 ? '' : ''}
                    style={{
                      borderBottom: '1px solid #f0ece4',
                      background: i % 2 === 0 ? '#ffffff' : 'rgba(248,247,244,0.5)',
                    }}>
                    <td className="px-6 py-3.5 font-medium" style={{ color: '#374151' }}>{row.label}</td>
                    {row.values.map((val, j) => (
                      <td key={j} className="px-4 py-3.5 text-center text-gray-600">
                        {val === '—' ? (
                          <span style={{ color: '#d1c9bc' }}>—</span>
                        ) : (
                          <span style={pricingPlans[j].highlighted ? { color: '#c8a96e', fontWeight: 600 } : {}}>{val}</span>
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
      <section className="py-16" style={{ background: '#0a0f1e' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(stat => (
              <StatCounter key={stat.label} value={stat.value} prefix={stat.prefix} suffix={stat.suffix} label={stat.label} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials — dark section */}
      <section style={{ background: '#0a0f1e' }} className="pb-16 pt-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="font-sora font-bold text-2xl text-white mb-2">What Our Customers Say</h2>
            <p className="font-dm text-sm" style={{ color: 'rgba(255,255,255,0.40)' }}>Trusted by market leaders across industries</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}>
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, si) => (
                    <Star key={si} className="w-3.5 h-3.5 fill-[#c8a96e] text-[#c8a96e]" />
                  ))}
                </div>
                <blockquote className="font-dm text-sm leading-relaxed mb-5 italic"
                  style={{ color: 'rgba(255,255,255,0.72)' }}>
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-sora font-bold shrink-0"
                    style={{ background: '#0f2044', outline: '2px solid rgba(200,169,110,0.25)', outlineOffset: '2px' }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-sora font-semibold text-sm text-white">{t.name}</div>
                    <div className="font-dm text-xs" style={{ color: 'rgba(255,255,255,0.40)' }}>
                      {t.title} · <span style={{ color: '#c8a96e' }}>{t.company}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ CTA */}
      <section className="py-12" style={{ background: '#f8f7f4', borderTop: '1px solid #e5e1d8' }}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h3 className="font-sora font-bold text-xl mb-3" style={{ color: '#0a0f1e' }}>Still have questions?</h3>
          <p className="font-dm text-sm text-gray-500 mb-6">Our team is ready to help you find the right plan for your needs.</p>
          <div className="flex justify-center gap-4">
            <Link href="#" className="btn-primary">Talk to Sales</Link>
            <Link href="#" className="btn-outline">View FAQ</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
