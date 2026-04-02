import Link from 'next/link'
import { Lock, ArrowRight, Lightbulb } from 'lucide-react'

const articles = [
  { title: 'Why the Next Biotech Supercycle Will Be Driven by AI Drug Discovery', author: 'Dr. Michael Zhang, Chief Analyst', date: 'March 2024', readTime: '12 min read', industry: 'Biotechnology' },
  { title: 'The Carbon Economy: How Energy Transition Will Reshape Global Markets', author: 'Sarah Williams, Energy Analyst', date: 'February 2024', readTime: '8 min read', industry: 'Energy & Power' },
  { title: "Digital Health's Trillion Dollar Opportunity: What Investors Are Missing", author: 'Dr. James Park, Principal Analyst', date: 'January 2024', readTime: '10 min read', industry: 'Healthcare' },
  { title: 'Semiconductor Supply Chain: Lessons from the Great Chip Shortage', author: 'Kevin Liu, Tech Analyst', date: 'December 2023', readTime: '15 min read', industry: 'Semiconductor' },
  { title: 'ESG Metrics That Actually Predict Corporate Performance', author: 'Emma Rodriguez, ESG Lead', date: 'November 2023', readTime: '9 min read', industry: 'Financial Services' },
  { title: 'Autonomous Vehicles: Separating Hype from Long-Term Market Reality', author: 'Marcus Johnson, Auto Analyst', date: 'October 2023', readTime: '11 min read', industry: 'Automotive' },
]

const colors = ['#1a3a6a', '#059669', '#091426', '#4f46e5', '#b45309', '#1a2f5a']

export default function ThoughtLeadershipPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-surface-container-lowest border-b border-surface-container-high">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="font-headline font-bold text-2xl text-primary mb-1">Thought Leadership</h1>
          <p className="font-body text-sm text-on-surface-variant">Forward-looking perspectives from our senior analysts and industry experts</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-tertiary-container/10 rounded-xl border border-tertiary-container/30 p-4 mb-6 flex items-center gap-3">
          <Lock className="w-5 h-5 text-tertiary-container shrink-0" />
          <div className="flex-1">
            <span className="font-body text-sm text-primary font-semibold">Premium content — </span>
            <span className="font-body text-sm text-on-surface-variant">Thought leadership articles require a Premium or Enterprise plan.</span>
          </div>
          <Link href="/pricing" className="flex items-center gap-1 text-sm font-body font-semibold text-secondary hover:text-on-secondary-fixed-variant transition-colors shrink-0">
            Upgrade <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <div key={i} className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-card overflow-hidden hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
              <div className="relative h-44 flex items-center justify-center"
                style={{ background: `${colors[i]}10` }}>
                <div className="text-center">
                  <Lightbulb className="w-12 h-12 mx-auto mb-2" style={{ color: colors[i] }} />
                  <span className="text-xs font-body font-semibold px-3 py-1 rounded-full text-white"
                    style={{ background: colors[i] }}>
                    {article.industry}
                  </span>
                </div>
                <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-tertiary/10">
                    <Lock className="w-5 h-5 text-tertiary" />
                  </div>
                  <Link href="/pricing"
                    className="text-xs font-body font-bold text-white px-4 py-2 rounded-xl bg-primary">
                    Unlock Premium
                  </Link>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-[10px] font-body text-on-surface-variant mb-2">
                  <span>{article.date}</span>
                  <span>·</span>
                  <span>{article.readTime}</span>
                </div>
                <h3 className="font-headline font-semibold text-sm text-primary leading-snug mb-2">{article.title}</h3>
                <div className="text-xs font-body text-on-surface-variant">{article.author}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
