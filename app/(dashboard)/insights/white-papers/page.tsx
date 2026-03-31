import Link from 'next/link'
import { Lock, ArrowRight, FileText } from 'lucide-react'

const whitepapers = [
  { title: 'The Future of Precision Medicine: Targeting Cancer with mAbs', industry: 'Biotechnology', date: 'March 2024', author: 'Dr. Sarah Chen, Senior Analyst' },
  { title: 'EV Market Disruption: Winners and Losers in the Next Decade', industry: 'Automotive', date: 'February 2024', author: 'Marcus Johnson, Lead Analyst' },
  { title: "Solar Energy's Path to Grid Parity: A 2030 Perspective", industry: 'Energy & Power', date: 'January 2024', author: 'Emma Rodriguez, Senior Analyst' },
  { title: 'Digital Health Transformation: Post-COVID Investment Trends', industry: 'Healthcare', date: 'December 2023', author: 'Dr. James Park, Principal Analyst' },
  { title: 'Supply Chain Resilience in Pharmaceuticals: Key Lessons', industry: 'Pharmaceuticals', date: 'November 2023', author: 'Lisa Thompson, Senior Analyst' },
  { title: 'The Rise of ESG Investing in Life Sciences', industry: 'Financial Services', date: 'October 2023', author: 'David Kumar, ESG Analyst' },
]

const colors = ['#111115', '#1a3a6a', '#4f46e5', '#059669', '#1a2f5a', '#b45309']

export default function WhitePapersPage() {
  return (
    <div className="min-h-screen bg-surface-app">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="font-sora font-bold text-2xl text-brand-primary mb-1">White Papers</h1>
          <p className="font-dm text-sm text-gray-500">Expert analysis and in-depth research from our senior analysts</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Locked Notice */}
        <div className="bg-white rounded-2xl border border-brand-violet/20 p-4 mb-6 flex items-center gap-3"
          style={{ background: 'rgba(124,58,237,0.04)' }}>
          <Lock className="w-5 h-5 text-brand-violet shrink-0" />
          <div className="flex-1">
            <span className="font-dm text-sm text-brand-primary font-semibold">Premium content — </span>
            <span className="font-dm text-sm text-gray-600">White papers require a Premium or Enterprise plan to access.</span>
          </div>
          <Link href="/pricing" className="flex items-center gap-1 text-sm font-dm font-semibold text-brand-accent hover:text-brand-secondary transition-colors shrink-0">
            Upgrade <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whitepapers.map((paper, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden group hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
              {/* Image area */}
              <div className="relative h-44 flex items-center justify-center"
                style={{ background: `${colors[i]}12` }}>
                <div className="text-center">
                  <FileText className="w-12 h-12 mx-auto mb-2" style={{ color: colors[i] }} />
                  <span className="text-xs font-dm font-semibold px-3 py-1 rounded-full text-white"
                    style={{ background: colors[i] }}>
                    {paper.industry}
                  </span>
                </div>
                {/* Lock overlay */}
                <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(79, 70, 229, 0.12)' }}>
                    <Lock className="w-5 h-5 text-brand-violet" />
                  </div>
                  <Link href="/pricing"
                    className="text-xs font-dm font-bold text-white px-4 py-2 rounded-full"
                    style={{ background: '#4f46e5' }}>
                    Unlock Premium
                  </Link>
                </div>
              </div>

              <div className="p-5">
                <div className="text-[10px] font-dm text-gray-400 mb-2">{paper.date}</div>
                <h3 className="font-sora font-semibold text-sm text-brand-primary leading-snug mb-2">{paper.title}</h3>
                <div className="text-xs font-dm text-gray-500">{paper.author}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
