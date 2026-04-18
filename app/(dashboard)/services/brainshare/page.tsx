import Link from 'next/link'
import { ArrowRight, Users, CheckCircle, MessageSquare, FileSearch, Lightbulb, Star } from 'lucide-react'

const features = [
  { title: 'Custom Research Reports', desc: 'Commission fully bespoke reports on any market, competitor, or technology topic, delivered by senior analysts with deep domain expertise.' },
  { title: 'Competitive Intelligence', desc: 'Track competitor moves, M&A activity, product launches, and strategic shifts. Get structured intelligence briefs on a weekly or monthly cadence.' },
  { title: 'Expert Interview Networks', desc: 'Connect with our network of 300+ practitioners, former executives, and industry specialists for primary research and validation interviews.' },
  { title: 'Strategic Advisory Workshops', desc: 'Engage analysts for live working sessions to pressure-test your market thesis, size a new opportunity, or validate a go-to-market strategy.' },
]

const steps = [
  { icon: FileSearch, step: '01', title: 'Define your research question', desc: 'Share your strategic question via our intake form or a discovery call. We scope the engagement and provide a transparent timeline.' },
  { icon: Users, step: '02', title: 'Matched to expert analysts', desc: 'We assign a dedicated team with domain expertise matching your sector and question type, supported by our data platform.' },
  { icon: Lightbulb, step: '03', title: 'Receive actionable intelligence', desc: 'Deliverables are structured for decision-making: executive summaries, data tables, charts, and clear recommendations.' },
]

const useCases = [
  'Corporate strategy teams sizing new markets',
  'Private equity firms conducting commercial due diligence',
  'Product managers validating product-market fit',
  'Marketing teams benchmarking brand perception',
  'Government agencies commissioning sector studies',
  'Consultants accelerating client deliverables',
]

const testimonials = [
  { quote: 'Brainshare turned a 6-week research sprint into a 5-day turnaround without sacrificing rigour.', name: 'Head of Strategy', company: 'Global PE Firm' },
  { quote: 'The analyst assigned to our project had 12 years in medtech. The quality of insight was extraordinary.', name: 'VP Corporate Development', company: 'Fortune 500 MedTech' },
]

export default function BrainsharePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ minHeight: '380px', background: '#0b1220' }}>
        <div className="relative max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-body font-semibold text-white mb-6 bg-white/10 border border-white/20">
              <Users className="w-3 h-3" />
              Curator Brainshare
            </div>
            <h1 className="font-headline font-bold text-3xl text-white mb-4 leading-tight">
              Analytics &amp; Consulting<br />
              <span style={{ color: '#6fd6ce' }}>Expert Intelligence</span>
            </h1>
            <p className="font-body text-base mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.80)' }}>
              Connect with 300+ industry analysts for bespoke research, competitive intelligence, and strategic advisory services delivered in days, not weeks.
            </p>
            <div className="flex gap-3">
              <Link href="/pricing" className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-body font-bold text-white bg-secondary hover:opacity-90 transition-all">
                Talk to an Analyst <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-body font-medium text-white border border-white/30 hover:bg-white/10 transition-all">
                View Sample Report
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[['300+', 'Expert Analysts'], ['1,200+', 'Custom Projects/Year'], ['5 days', 'Avg. Turnaround'], ['95%', 'Client Satisfaction']].map(([value, label]) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <div className="font-headline font-bold text-2xl text-white">{value}</div>
                <div className="font-body text-xs mt-1" style={{ color: 'rgba(255,255,255,0.60)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="mb-8">
          <span className="text-xs font-mono uppercase tracking-[0.16em] text-secondary mb-2 block">How It Works</span>
          <h2 className="font-headline font-bold text-2xl text-primary">Research in days, not weeks</h2>
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
          <h2 className="font-headline font-bold text-xl text-primary mb-6">Service Offerings</h2>
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
        <h2 className="font-headline font-bold text-xl text-primary mb-6">Who Uses Brainshare</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {useCases.map(uc => (
            <div key={uc} className="flex items-start gap-2.5 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
              <MessageSquare className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span className="text-sm font-body text-on-surface-variant">{uc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-surface-container-lowest border-t border-surface-container py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-headline font-bold text-xl text-primary mb-6 text-center">What Clients Say</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-background rounded-xl border border-outline-variant/20 p-6 shadow-card">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, si) => <Star key={si} className="w-3.5 h-3.5 fill-secondary text-secondary" />)}
                </div>
                <blockquote className="font-body text-sm leading-relaxed italic text-on-surface-variant mb-4">&ldquo;{t.quote}&rdquo;</blockquote>
                <div className="text-xs font-body font-semibold text-primary">{t.name}</div>
                <div className="text-xs font-body text-secondary">{t.company}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14" style={{ background: '#0b1220' }}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-headline font-bold text-2xl text-white mb-3">Talk to an analyst today</h2>
          <p className="font-body text-sm mb-8" style={{ color: 'rgba(255,255,255,0.60)' }}>Tell us your research question and we&apos;ll match you with the right expert within 24 hours.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-body font-bold bg-secondary text-white hover:opacity-90 transition-all">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/pricing" className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-body font-medium text-white border border-white/25 hover:bg-white/10 transition-all">
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
