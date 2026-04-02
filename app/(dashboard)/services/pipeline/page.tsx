import Link from 'next/link'
import { ArrowRight, CheckCircle, Activity } from 'lucide-react'

const markets = ['Biotechnology', 'Pharmaceuticals', 'Medical Devices', 'Energy & Power', 'Automotive', 'Electronics', 'Food & Beverage', 'Consumer Goods', 'Chemicals', 'Aerospace', 'Materials', 'Technology']

const features = [
  { title: 'Real-time Supply Chain Mapping', desc: 'Visualize end-to-end supply chains with live data on production nodes, distribution centers, and logistics routes.' },
  { title: 'Supplier Risk Assessment', desc: 'Identify and quantify supplier risks with financial health scores, geopolitical risk ratings, and ESG assessments.' },
  { title: 'Demand Forecasting Intelligence', desc: 'Predict demand fluctuations with AI-powered models trained on historical market data and macro-economic indicators.' },
  { title: 'Procurement Cost Benchmarking', desc: 'Benchmark your procurement costs against industry peers with anonymized data from thousands of companies globally.' },
]

export default function PipelinePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary" style={{ minHeight: '400px' }}>
        <div className="relative max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-body font-semibold text-white mb-6 bg-secondary/20 border border-secondary/30">
              <Activity className="w-3 h-3" />
              Horizon Pipeline
            </div>
            <h1 className="font-headline font-bold text-3xl text-white mb-4 leading-tight">
              Grand View Pipeline
              <span className="block text-secondary-fixed">Supply Chain Intelligence</span>
            </h1>
            <p className="font-body text-white/70 text-base mb-3 leading-relaxed">
              Build a smart, robust and reliable supply chain with real-time intelligence across global markets.
            </p>
            <p className="font-body text-white/50 text-sm mb-8 leading-relaxed">
              Access comprehensive supply chain data covering raw material sourcing, manufacturing capacity,
              distribution networks, and logistics performance across 180+ countries.
            </p>
            <div className="flex gap-3">
              <Link href="/pricing"
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-body font-bold text-white bg-secondary hover:opacity-90 transition-all">
                Access Reports
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="#"
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-body font-medium text-white border border-white/30 hover:bg-white/10 transition-all">
                Talk to an Expert
              </Link>
            </div>
          </div>

          {/* Circular Wheel Diagram */}
          <div className="flex items-center justify-center">
            <div className="relative w-64 h-64">
              {[
                { label: 'Regulation Adherence', angle: 0, color: '#006a61' },
                { label: 'Financial Performance', angle: 60, color: '#4f46e5' },
                { label: 'Sustainability', angle: 120, color: '#059669' },
                { label: 'Scalability', angle: 180, color: '#1d4ed8' },
                { label: 'Quality Assurance', angle: 240, color: '#8b5cf6' },
                { label: 'Delivery Excellence', angle: 300, color: '#14b8a6' },
              ].map(segment => {
                const rad = (segment.angle - 90) * Math.PI / 180
                const x = 50 + 45 * Math.cos(rad)
                const y = 50 + 45 * Math.sin(rad)
                return (
                  <div key={segment.label}
                    className="absolute w-20 text-center transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${x}%`, top: `${y}%` }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-1"
                      style={{ background: `${segment.color}20`, border: `2px solid ${segment.color}` }}>
                      <CheckCircle className="w-4 h-4" style={{ color: segment.color }} />
                    </div>
                    <div className="text-[9px] font-body font-medium text-white/70 leading-tight">{segment.label}</div>
                  </div>
                )
              })}
              {/* Center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center bg-secondary">
                  <span className="font-headline font-bold text-white text-xs">PIPELINE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="font-headline font-bold text-xl text-primary mb-6">Key Capabilities</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {features.map((feature, i) => (
            <div key={i} className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-5 shadow-card hover:shadow-card-hover transition-all">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3 bg-secondary/10">
                <CheckCircle className="w-4 h-4 text-secondary" />
              </div>
              <h3 className="font-headline font-semibold text-sm text-primary mb-2">{feature.title}</h3>
              <p className="font-body text-sm text-on-surface-variant leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Markets We Cover */}
      <section className="bg-surface-container-lowest border-t border-surface-container py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-headline font-bold text-xl text-primary mb-6">Markets We Cover</h2>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {markets.map(market => (
              <Link key={market} href="/industries"
                className="flex items-center justify-center px-3 py-3 rounded-xl text-sm font-body font-medium text-on-surface-variant bg-surface-container border border-outline-variant/20 hover:border-secondary hover:text-secondary transition-all text-center">
                {market}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
