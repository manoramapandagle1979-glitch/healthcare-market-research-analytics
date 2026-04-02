import Link from 'next/link'
import { HelpCircle, FileText, MessageSquare, Mail, BookOpen, Zap, Shield, CreditCard } from 'lucide-react'

const categories = [
  {
    icon: BookOpen,
    title: 'Getting Started',
    items: ['Creating your account', 'Navigating the dashboard', 'Understanding market reports', 'Using search & filters'],
  },
  {
    icon: CreditCard,
    title: 'Billing & Subscriptions',
    items: ['Upgrading your plan', 'Invoice & payment history', 'Cancellation & refunds', 'Enterprise billing'],
  },
  {
    icon: FileText,
    title: 'Reports & Data',
    items: ['Downloading reports', 'Data export formats', 'Report methodology', 'Custom report requests'],
  },
  {
    icon: Shield,
    title: 'Account & Security',
    items: ['Password reset', 'Two-factor authentication', 'Team member access', 'Data privacy settings'],
  },
]

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-surface-container-lowest border-b border-surface-container-high">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <h1 className="font-headline font-bold text-2xl text-primary mb-1">Support Center</h1>
          <p className="font-body text-sm text-on-surface-variant">Find answers, get help, and connect with our support team</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        {/* Quick Actions */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: MessageSquare, title: 'Live Chat', desc: 'Chat with our support team', color: 'bg-secondary' },
            { icon: Mail, title: 'Email Support', desc: 'support@curatorintelligence.com', color: 'bg-primary' },
            { icon: Zap, title: 'Status Page', desc: 'Check system status', color: 'bg-tertiary' },
          ].map(action => (
            <div key={action.title} className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-5 flex items-center gap-4 hover:shadow-card transition-all cursor-pointer">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.color} shrink-0`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-headline font-semibold text-sm text-primary">{action.title}</h3>
                <p className="font-body text-xs text-on-surface-variant">{action.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Help Categories */}
        <div>
          <h2 className="font-headline font-semibold text-lg text-primary mb-4">Help Topics</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {categories.map(cat => (
              <div key={cat.title} className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-secondary/10">
                    <cat.icon className="w-4 h-4 text-secondary" />
                  </div>
                  <h3 className="font-headline font-semibold text-sm text-primary">{cat.title}</h3>
                </div>
                <ul className="space-y-2">
                  {cat.items.map(item => (
                    <li key={item} className="flex items-center gap-2 text-xs font-body text-on-surface-variant hover:text-secondary transition-colors cursor-pointer">
                      <HelpCircle className="w-3 h-3 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-primary rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-headline font-bold text-base text-white mb-1">Can&apos;t find what you need?</h3>
            <p className="font-body text-xs text-white/50">Our support team typically responds within 2-4 hours during business hours.</p>
          </div>
          <Link href="/contact"
            className="shrink-0 px-5 py-2.5 rounded-xl text-sm font-body font-bold text-primary bg-white hover:bg-white/90 transition-all active:scale-[0.97]">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}
