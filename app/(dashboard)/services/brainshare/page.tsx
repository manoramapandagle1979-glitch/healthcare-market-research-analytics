import Link from 'next/link'
import { ArrowRight, Users } from 'lucide-react'

export default function BrainsharePage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden bg-primary" style={{ minHeight: '380px' }}>
        <div className="relative max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-body font-semibold text-white mb-6 bg-primary-container/50 border border-white/20">
              <Users className="w-3 h-3" />
              Horizon Brainshare
            </div>
            <h1 className="font-headline font-bold text-3xl text-white mb-4 leading-tight">
              Analytics &amp; Consulting<br />
              <span className="text-secondary-fixed">Expert Intelligence</span>
            </h1>
            <p className="font-body text-white/70 text-base mb-8 leading-relaxed">
              Connect with 300+ industry analysts for bespoke research, competitive intelligence, and strategic advisory services.
            </p>
            <Link href="/pricing" className="flex items-center gap-2 w-fit px-6 py-3 rounded-xl text-sm font-body font-bold text-white bg-secondary hover:opacity-90 transition-all">
              Talk to an Analyst <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[['300+', 'Expert Analysts'], ['1,200+', 'Custom Projects/Year'], ['5 days', 'Avg. Turnaround'], ['95%', 'Client Satisfaction']].map(([value, label]) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <div className="font-headline font-bold text-2xl text-white">{value}</div>
                <div className="font-body text-xs text-white/60 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
