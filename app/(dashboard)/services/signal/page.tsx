import Link from 'next/link'
import { ArrowRight, TrendingUp, CheckCircle } from 'lucide-react'

export default function SignalPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden bg-primary" style={{ minHeight: '380px' }}>
        <div className="relative max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-body font-semibold text-white mb-6 bg-tertiary/20 border border-tertiary-container/30">
              <TrendingUp className="w-3 h-3" />
              Curator Signal
            </div>
            <h1 className="font-headline font-bold text-3xl text-white mb-4 leading-tight">
              Pricing &amp; Cost<br />
              <span className="text-secondary-fixed">Intelligence Platform</span>
            </h1>
            <p className="font-body text-white/70 text-base mb-8 leading-relaxed">
              Real-time pricing indices, commodity tracking, and cost benchmarking to protect margins and optimize procurement strategies.
            </p>
            <div className="flex gap-3">
              <Link href="/pricing" className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-body font-bold text-white bg-secondary hover:opacity-90 transition-all">
                Access Signal <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-48 h-48 rounded-2xl flex items-center justify-center bg-tertiary/20 border-2 border-tertiary-container/40">
              <TrendingUp className="w-20 h-20 text-tertiary-container opacity-80" />
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-5">
          {['2,000+ Price Indices', '500+ Commodities Tracked', 'Real-time Daily Updates'].map((feat, i) => (
            <div key={i} className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-5 shadow-card text-center">
              <CheckCircle className="w-8 h-8 text-secondary mx-auto mb-3" />
              <div className="font-headline font-bold text-base text-primary">{feat}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
