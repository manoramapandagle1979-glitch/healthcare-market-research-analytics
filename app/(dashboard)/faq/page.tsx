'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ArrowRight } from 'lucide-react'

const faqs = [
  {
    category: 'General',
    items: [
      { q: 'What is Curator Intelligence?', a: 'Curator Intelligence is the world\'s largest portal for market reports and statistics. We provide comprehensive market intelligence covering 23+ industries with 30,000+ reports and 1.2M+ data points.' },
      { q: 'Who are your reports designed for?', a: 'Our reports serve analysts, researchers, executives, investors, and consultants who need reliable market data for strategic decisions. We cover industries from healthcare and biotech to energy, technology, and financial services.' },
      { q: 'How often is data updated?', a: 'Market reports are updated quarterly or as significant market events occur. Our Astra platform provides real-time trend monitoring and alerts.' },
    ],
  },
  {
    category: 'Plans & Pricing',
    items: [
      { q: 'What plans do you offer?', a: 'We offer three plans: Starter (basic access to market overviews), Professional (full report access, company profiles, and analytics), and Enterprise (unlimited access, API, custom reports, and dedicated analyst support).' },
      { q: 'Can I try before I subscribe?', a: 'Yes, you can browse industry overviews and market summaries for free. Detailed reports, full data exports, and advanced features require a paid subscription.' },
      { q: 'Do you offer custom enterprise pricing?', a: 'Absolutely. Our enterprise team works with organizations to build tailored packages based on specific industry coverage, user seats, and data requirements. Contact our sales team for a custom quote.' },
      { q: 'What is your refund policy?', a: 'We offer a 14-day refund policy for annual subscriptions if you\'re not satisfied. Monthly subscriptions can be cancelled at any time before the next billing cycle.' },
    ],
  },
  {
    category: 'Reports & Data',
    items: [
      { q: 'What formats are reports available in?', a: 'Reports are available in PDF, Excel, and interactive dashboard formats. Enterprise users also get API access for programmatic data retrieval.' },
      { q: 'Can I request a custom report?', a: 'Enterprise plan subscribers can request custom reports tailored to specific markets, regions, or research questions. Our analyst team will scope and deliver within 2-4 weeks.' },
      { q: 'How do you ensure data accuracy?', a: 'Our methodology combines primary research, proprietary data models, expert interviews, and cross-validation with multiple sources. Each report undergoes peer review by senior analysts before publication.' },
    ],
  },
  {
    category: 'Account & Technical',
    items: [
      { q: 'How do I reset my password?', a: 'Click "Forgot Password" on the login page, enter your registered email, and follow the reset link sent to your inbox. The link expires after 24 hours.' },
      { q: 'Can I share my account with my team?', a: 'Individual accounts are for single-user use. For team access, consider our Professional (up to 5 seats) or Enterprise plan (unlimited seats) which include team management features.' },
      { q: 'Is my data secure?', a: 'Yes. We use industry-standard encryption (TLS 1.3, AES-256), regular security audits, SOC 2 compliance, and strict access controls. See our Privacy Policy for full details.' },
    ],
  },
]

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggle = (id: string) => {
    setOpenItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-surface-container-lowest border-b border-surface-container-high">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="font-headline font-bold text-2xl text-primary mb-1">Frequently Asked Questions</h1>
          <p className="font-body text-sm text-on-surface-variant">Find answers to common questions about Curator Intelligence</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {faqs.map(section => (
          <div key={section.category}>
            <h2 className="font-headline font-semibold text-base text-primary mb-3">{section.category}</h2>
            <div className="space-y-2">
              {section.items.map(item => {
                const id = `${section.category}-${item.q}`
                const isOpen = openItems.includes(id)
                return (
                  <div key={id} className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 overflow-hidden">
                    <button onClick={() => toggle(id)}
                      className="w-full flex items-center justify-between px-5 py-3.5 text-left">
                      <span className="font-headline font-semibold text-sm text-primary pr-4">{item.q}</span>
                      <ChevronDown className={`w-4 h-4 text-on-surface-variant shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4">
                        <p className="font-body text-sm text-on-surface-variant leading-relaxed">{item.a}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* CTA */}
        <div className="bg-primary rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-headline font-bold text-base text-white mb-1">Still have questions?</h3>
            <p className="font-body text-xs text-white/50">Our team is ready to help you find the right plan for your needs.</p>
          </div>
          <Link href="/contact"
            className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-body font-bold text-primary bg-white hover:bg-white/90 transition-all active:scale-[0.97]">
            Contact Us <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
