import Link from 'next/link'
import { ArrowRight, TrendingUp, CheckCircle } from 'lucide-react'

export default function SignalPage() {
  return (
    <div className="min-h-screen bg-surface-app">
      <section className="relative overflow-hidden" style={{ background: '#111115', minHeight: '380px' }}>
        <div className="relative max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-dm font-semibold text-white mb-6" style={{ background: 'rgba(79, 70, 229, 0.3)', border: '1px solid rgba(79, 70, 229, 0.4)' }}>
              <TrendingUp className="w-3 h-3" />
              Horizon Signal
            </div>
            <h1 className="font-sora font-bold text-3xl text-white mb-4 leading-tight">
              Pricing &amp; Cost<br />
              <span className="text-brand-accent">Intelligence Platform</span>
            </h1>
            <p className="font-dm text-white/70 text-base mb-8 leading-relaxed">
              Real-time pricing indices, commodity tracking, and cost benchmarking to protect margins and optimize procurement strategies.
            </p>
            <div className="flex gap-3">
              <Link href="/pricing" className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-dm font-bold text-white" style={{ background: '#4f46e5' }}>
                Access Signal <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-48 h-48 rounded-3xl flex items-center justify-center" style={{ background: 'rgba(79, 70, 229, 0.2)', border: '2px solid rgba(79, 70, 229, 0.4)' }}>
              <TrendingUp className="w-20 h-20 text-brand-violet opacity-80" />
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-5">
          {['2,000+ Price Indices', '500+ Commodities Tracked', 'Real-time Daily Updates'].map((feat, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-card text-center">
              <CheckCircle className="w-8 h-8 text-brand-violet mx-auto mb-3" />
              <div className="font-sora font-bold text-base text-brand-primary">{feat}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
