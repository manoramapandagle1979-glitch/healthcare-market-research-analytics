import Link from 'next/link'
import { ArrowRight, Globe, Leaf, CheckCircle, BarChart2, Shield, FileText, Target } from 'lucide-react'

const features = [
  { title: 'ESG Score Benchmarking', desc: 'Compare your portfolio or suppliers against 10,000+ companies globally across Environmental, Social, and Governance dimensions with granular scoring.' },
  { title: 'Regulatory Compliance Tracking', desc: 'Stay ahead of CSRD, SFDR, SEC climate disclosure, and other ESG regulations with automated framework mapping and compliance gap analysis.' },
  { title: 'Carbon Footprint Analytics', desc: 'Track Scope 1, 2, and 3 emissions across your value chain. Identify reduction opportunities and model the impact of sustainability initiatives.' },
  { title: 'Sustainable Supply Chain Intelligence', desc: 'Assess supplier sustainability profiles, flag high-risk vendors, and identify ESG-aligned alternative sourcing options across 50+ sectors.' },
]

const steps = [
  { icon: Target, step: '01', title: 'Define your ESG scope', desc: 'Select the companies, frameworks, and metrics relevant to your reporting obligations and investment thesis.' },
  { icon: BarChart2, step: '02', title: 'Access structured ESG data', desc: 'Astra aggregates data from 15+ major ESG frameworks into a single, normalized view ready for analysis and reporting.' },
  { icon: Shield, step: '03', title: 'Report with confidence', desc: 'Export audit-ready reports aligned to GRI, SASB, TCFD, or custom formats. Share with regulators, investors, or boards.' },
]

const frameworks = ['GRI', 'SASB', 'TCFD', 'CDP', 'SFDR', 'CSRD', 'PRI', 'ISO 26000', 'UN SDGs', 'EU Taxonomy', 'ISSB IFRS', 'SEC Climate']

const useCases = [
  'Investment teams screening for ESG-aligned assets',
  'Sustainability teams building annual ESG reports',
  'Procurement officers assessing supplier risk',
  'Boards meeting CSRD and TCFD obligations',
  'Banks conducting green loan portfolio analysis',
  'Consultants delivering ESG due diligence',
]

export default function AstraPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ minHeight: '380px', background: '#0b1220' }}>
        <div className="relative max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-body font-semibold text-white mb-6 bg-secondary/20 border border-secondary/30">
              <Leaf className="w-3 h-3" />
              Curator Astra
            </div>
            <h1 className="font-headline font-bold text-3xl text-white mb-4 leading-tight">
              ESG &amp; Sustainability<br />
              <span style={{ color: '#6fd6ce' }}>Analytics Platform</span>
            </h1>
            <p className="font-body text-base mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.80)' }}>
              Navigate ESG compliance and sustainability benchmarking with data-driven insights across 10,000+ companies globally, mapped to 15 major frameworks.
            </p>
            <div className="flex gap-3">
              <Link href="/pricing" className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-body font-bold text-white bg-secondary hover:opacity-90 transition-all">
                Explore Astra <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-body font-medium text-white border border-white/30 hover:bg-white/10 transition-all">
                Request a Demo
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[['10K+', 'ESG Scores'], ['200+', 'ESG Metrics'], ['15', 'Frameworks']].map(([value, label]) => (
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
          <h2 className="font-headline font-bold text-2xl text-primary">From data to disclosure in three steps</h2>
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

      {/* Frameworks */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="font-headline font-bold text-xl text-primary mb-6">Supported Frameworks &amp; Standards</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {frameworks.map(fw => (
            <div key={fw} className="flex items-center justify-center px-3 py-3 rounded-xl text-sm font-body font-semibold text-secondary bg-secondary/5 border border-secondary/20 hover:bg-secondary/10 transition-all text-center">
              {fw}
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="bg-surface-container-lowest border-t border-surface-container py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-headline font-bold text-xl text-primary mb-6">Who Uses Astra</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {useCases.map(uc => (
              <div key={uc} className="flex items-start gap-2.5 p-4 rounded-xl bg-background border border-outline-variant/20">
                <Globe className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span className="text-sm font-body text-on-surface-variant">{uc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14" style={{ background: '#0b1220' }}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-secondary/20 mx-auto mb-4">
            <Leaf className="w-6 h-6 text-secondary" />
          </div>
          <h2 className="font-headline font-bold text-2xl text-white mb-3">Start your ESG journey</h2>
          <p className="font-body text-sm mb-8" style={{ color: 'rgba(255,255,255,0.60)' }}>Access structured ESG data for 10,000+ companies and generate your first compliance report in under an hour.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/pricing" className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-body font-bold bg-secondary text-white hover:opacity-90 transition-all">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contact" className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-body font-medium text-white border border-white/25 hover:bg-white/10 transition-all">
              Talk to an Expert
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
