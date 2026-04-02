import Link from 'next/link'
import { ArrowRight, Globe, Leaf } from 'lucide-react'

export default function AstraPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden bg-primary" style={{ minHeight: '380px' }}>
        <div className="relative max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-body font-semibold text-white mb-6 bg-secondary/20 border border-secondary/30">
              <Leaf className="w-3 h-3" />
              Curator Astra
            </div>
            <h1 className="font-headline font-bold text-3xl text-white mb-4 leading-tight">
              ESG &amp; Sustainability<br />
              <span className="text-secondary-fixed">Analytics Platform</span>
            </h1>
            <p className="font-body text-white/70 text-base mb-8 leading-relaxed">
              Navigate ESG compliance and sustainability benchmarking with data-driven insights across 10,000+ companies globally.
            </p>
            <Link href="/pricing" className="flex items-center gap-2 w-fit px-6 py-3 rounded-xl text-sm font-body font-bold text-white bg-secondary hover:opacity-90 transition-all">
              Explore Astra <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-48 h-48 rounded-full flex items-center justify-center bg-secondary/20 border-2 border-secondary/40">
              <Globe className="w-20 h-20 text-secondary-fixed opacity-80" />
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-5">
          {['10K+ ESG Scores', '200+ ESG Metrics', '15 Major Frameworks'].map((feat, i) => (
            <div key={i} className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-5 shadow-card text-center">
              <Leaf className="w-8 h-8 text-secondary mx-auto mb-3" />
              <div className="font-headline font-bold text-base text-primary">{feat}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
