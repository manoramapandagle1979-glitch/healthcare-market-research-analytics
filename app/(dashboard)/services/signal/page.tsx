import Link from 'next/link'
import { ArrowRight, TrendingUp, CheckCircle, Zap, BarChart2, RefreshCw, ShieldCheck } from 'lucide-react'

const features = [
  { title: 'Real-Time Price Indices', desc: 'Track 2,000+ commodity and input cost indices updated daily, giving you the live pricing transparency needed for procurement and margin decisions.' },
  { title: 'Historical Cost Benchmarking', desc: 'Compare current prices against 10+ years of historical data to identify trends, negotiate better supplier contracts, and forecast cost exposure.' },
  { title: 'Commodity Risk Alerts', desc: 'Receive automated alerts when tracked commodities breach your defined thresholds, so you can act before margin erosion occurs.' },
  { title: 'Supplier Price Comparison', desc: 'Benchmark procurement costs against anonymized peer data from thousands of companies, segmented by region, volume, and specification.' },
]

const steps = [
  { icon: BarChart2, step: '01', title: 'Select your commodities', desc: 'Choose from 500+ tracked commodities across metals, chemicals, energy, and agricultural inputs.' },
  { icon: RefreshCw, step: '02', title: 'Set alert thresholds', desc: 'Define acceptable price ranges. Signal monitors 24/7 and notifies you the moment boundaries are crossed.' },
  { icon: ShieldCheck, step: '03', title: 'Act with confidence', desc: 'Use live index data and benchmarks in negotiations, procurement strategy, and financial modelling.' },
]

const useCases = [
  'Procurement teams negotiating supplier contracts',
  'CFOs modelling input cost scenarios for forecasts',
  'Supply chain managers hedging commodity exposure',
  'Product teams setting competitive pricing strategies',
  'Investors tracking commodity-driven sector dynamics',
  'Sustainability teams monitoring energy cost trends',
]

export default function SignalPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary" style={{ minHeight: '380px', background: '#0b1220' }}>
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
            <p className="font-body text-white/80 text-base mb-8 leading-relaxed">
              Real-time pricing indices, commodity tracking, and cost benchmarking to protect margins and optimize procurement strategies.
            </p>
            <div className="flex gap-3">
              <Link href="/pricing" className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-body font-bold text-white bg-secondary hover:opacity-90 transition-all">
                Access Signal <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-body font-medium text-white border border-white/30 hover:bg-white/10 transition-all">
                Talk to an Expert
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[['2K+', 'Price Indices'], ['500+', 'Commodities'], ['10K+', 'Daily Updates']].map(([value, label]) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <div className="font-headline font-bold text-2xl text-white">{value}</div>
                <div className="font-body text-xs text-white/60 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="mb-8">
          <span className="text-xs font-mono uppercase tracking-[0.16em] text-secondary mb-2 block">How It Works</span>
          <h2 className="font-headline font-bold text-2xl text-primary">Three steps to pricing clarity</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map(s => {
            const Icon = s.icon
            return (
              <div key={s.step} className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6 shadow-card">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-mono font-bold text-secondary">{s.step}</span>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-secondary/10">
                    <Icon className="w-4 h-4 text-secondary" />
                  </div>
                </div>
                <h3 className="font-headline font-semibold text-sm text-primary mb-2">{s.title}</h3>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed">{s.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Key Capabilities */}
      <section className="bg-surface-container-lowest border-y border-surface-container py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-headline font-bold text-xl text-primary mb-6">Key Capabilities</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {features.map((feature, i) => (
              <div key={i} className="bg-background rounded-xl border border-outline-variant/20 p-5 shadow-card hover:shadow-card-hover transition-all">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3 bg-secondary/10">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                </div>
                <h3 className="font-headline font-semibold text-sm text-primary mb-2">{feature.title}</h3>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="font-headline font-bold text-xl text-primary mb-6">Who Uses Signal</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {useCases.map(uc => (
            <div key={uc} className="flex items-start gap-2.5 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
              <Zap className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span className="text-sm font-body text-on-surface-variant">{uc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-14" style={{ background: '#0b1220' }}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-headline font-bold text-2xl text-white mb-3">Start tracking prices today</h2>
          <p className="font-body text-sm text-white/60 mb-8">Set up your first commodity watchlist in minutes. No data science background required.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/pricing" className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-body font-bold bg-secondary text-white hover:opacity-90 transition-all">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contact" className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-body font-medium text-white border border-white/25 hover:bg-white/10 transition-all">
              Request a Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
