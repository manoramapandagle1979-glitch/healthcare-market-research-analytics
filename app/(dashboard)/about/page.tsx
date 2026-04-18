import { BarChart2, Globe, Users, Database, Award, TrendingUp } from 'lucide-react'

const values = [
  { icon: BarChart2, title: 'Data-Driven Precision', desc: 'Every insight is grounded in rigorous methodology, verified sources, and transparent analytical frameworks.' },
  { icon: Globe, title: 'Global Coverage', desc: 'Comprehensive market intelligence spanning 23+ industries across every major region and emerging market worldwide.' },
  { icon: Users, title: 'Client Partnership', desc: 'We work as an extension of your team, delivering tailored insights that directly address your strategic questions.' },
  { icon: Award, title: 'Analytical Excellence', desc: 'Our senior analysts bring decades of domain expertise, ensuring every report meets the highest standards of quality.' },
]

const milestones = [
  { year: '2018', event: 'Founded with a mission to democratize market intelligence' },
  { year: '2019', event: 'Launched first 5,000 market reports covering healthcare & biotech' },
  { year: '2020', event: 'Expanded to 15,000 reports across 10 industries' },
  { year: '2021', event: 'Introduced Astra ESG & sustainability analytics platform' },
  { year: '2022', event: 'Reached 500+ enterprise clients globally' },
  { year: '2023', event: 'Launched Pipeline & Signal intelligence services' },
  { year: '2024', event: '30,000+ reports, 23+ industries, 1.2M+ data points' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-surface-container-lowest border-b border-surface-container-high">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <h1 className="font-headline font-bold text-2xl text-primary mb-1">About Curator Intelligence</h1>
          <p className="font-body text-sm text-on-surface-variant">The world&apos;s largest portal for market reports &amp; statistics</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-12">
        {/* Mission */}
        <div className="max-w-3xl">
          <h2 className="font-headline font-semibold text-lg text-primary mb-3">Our Mission</h2>
          <p className="font-body text-sm text-on-surface-variant leading-relaxed">
            Curator Intelligence was founded on the belief that strategic decisions deserve world-class data. We aggregate, analyze, and deliver comprehensive market intelligence to help enterprises, investors, and researchers navigate complex markets with confidence. Our platform combines the depth of traditional research with the speed and scale of AI-powered analytics.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Market Reports', value: '30,000+' },
            { label: 'Industries', value: '23+' },
            { label: 'Enterprise Clients', value: '500+' },
            { label: 'Data Points', value: '1.2M+' },
          ].map(stat => (
            <div key={stat.label} className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-5 text-center">
              <div className="font-headline font-bold text-xl text-secondary mb-1">{stat.value}</div>
              <div className="font-body text-xs text-on-surface-variant">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Values */}
        <div>
          <h2 className="font-headline font-semibold text-lg text-primary mb-4">What We Stand For</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {values.map(v => (
              <div key={v.title} className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-5 flex gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary/10 shrink-0">
                  <v.icon className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-headline font-semibold text-sm text-primary mb-1">{v.title}</h3>
                  <p className="font-body text-xs text-on-surface-variant leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div>
          <h2 className="font-headline font-semibold text-lg text-primary mb-4">Our Journey</h2>
          <div className="space-y-3">
            {milestones.map(m => (
              <div key={m.year} className="flex items-start gap-4">
                <div className="font-headline font-bold text-sm text-secondary w-12 shrink-0 pt-0.5">{m.year}</div>
                <div className="flex-1 bg-surface-container-lowest rounded-xl border border-outline-variant/20 px-4 py-3">
                  <p className="font-body text-sm text-on-surface-variant">{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership */}
        <div>
          <h2 className="font-headline font-semibold text-lg text-primary mb-4">Leadership</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: 'Dr. Alexandra Chen', role: 'CEO & Co-Founder', bg: '#091426' },
              { name: 'Marcus Williams', role: 'CTO & Co-Founder', bg: '#1a3a6a' },
              { name: 'Sarah Nakamura', role: 'VP of Research', bg: '#4f46e5' },
            ].map(person => (
              <div key={person.name} className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 overflow-hidden">
                <div className="h-28 flex items-center justify-center" style={{ background: `${person.bg}15` }}>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-headline font-bold text-lg" style={{ background: person.bg }}>
                    {person.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-headline font-semibold text-sm text-primary">{person.name}</h3>
                  <p className="font-body text-xs text-on-surface-variant mt-0.5">{person.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
