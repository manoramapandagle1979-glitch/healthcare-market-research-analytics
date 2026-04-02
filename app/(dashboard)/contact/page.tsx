'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Send, MessageSquare, Building2 } from 'lucide-react'

const contactMethods = [
  { icon: Mail, label: 'Email', value: 'contact@curatorintelligence.com', href: 'mailto:contact@curatorintelligence.com' },
  { icon: Phone, label: 'Phone', value: '+1 (415) 555-0192', href: 'tel:+14155550192' },
  { icon: MapPin, label: 'Office', value: 'San Francisco, CA', href: undefined },
]

const inquiryTypes = ['General Inquiry', 'Sales & Pricing', 'Custom Enterprise Plan', 'Partnership', 'Media & Press', 'Technical Support']

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-surface-container-lowest border-b border-surface-container-high">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <h1 className="font-headline font-bold text-2xl text-primary mb-1">Contact Us</h1>
          <p className="font-body text-sm text-on-surface-variant">Get in touch with our team for sales, support, or partnership inquiries</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              {contactMethods.map(method => (
                <div key={method.label} className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary/10 shrink-0">
                    <method.icon className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <div className="font-body text-[10px] text-on-surface-variant uppercase tracking-wider">{method.label}</div>
                    {method.href ? (
                      <a href={method.href} className="font-headline font-semibold text-sm text-primary hover:text-secondary transition-colors">{method.value}</a>
                    ) : (
                      <div className="font-headline font-semibold text-sm text-primary">{method.value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-primary rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-white/70" />
                <h3 className="font-headline font-semibold text-sm text-white">Enterprise Sales</h3>
              </div>
              <p className="font-body text-xs text-white/50 leading-relaxed mb-3">
                Need a custom plan for your organization? Our enterprise team will build a tailored package to fit your research needs.
              </p>
              <a href="mailto:enterprise@curatorintelligence.com" className="text-xs font-body font-semibold text-secondary hover:text-secondary/80 transition-colors">
                enterprise@curatorintelligence.com
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-10 text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center bg-secondary/10 mx-auto mb-4">
                  <MessageSquare className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="font-headline font-bold text-lg text-primary mb-2">Message Sent</h3>
                <p className="font-body text-sm text-on-surface-variant mb-4">Thank you for reaching out. Our team will get back to you within 1-2 business days.</p>
                <button onClick={() => setSubmitted(false)} className="text-sm font-body font-semibold text-secondary hover:text-on-secondary-fixed-variant transition-colors">
                  Send another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={e => { e.preventDefault(); setSubmitted(true) }}
                className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6 space-y-5"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-body font-semibold text-primary mb-1.5">Full Name</label>
                    <input type="text" required placeholder="Your name"
                      className="w-full px-3 py-2.5 rounded-xl border border-outline-variant/30 bg-background text-sm font-body text-primary placeholder:text-on-surface-variant/50 focus:outline-none focus:border-secondary transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-body font-semibold text-primary mb-1.5">Email</label>
                    <input type="email" required placeholder="you@company.com"
                      className="w-full px-3 py-2.5 rounded-xl border border-outline-variant/30 bg-background text-sm font-body text-primary placeholder:text-on-surface-variant/50 focus:outline-none focus:border-secondary transition-colors" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-body font-semibold text-primary mb-1.5">Company</label>
                    <input type="text" placeholder="Your company"
                      className="w-full px-3 py-2.5 rounded-xl border border-outline-variant/30 bg-background text-sm font-body text-primary placeholder:text-on-surface-variant/50 focus:outline-none focus:border-secondary transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-body font-semibold text-primary mb-1.5">Inquiry Type</label>
                    <select required
                      className="w-full px-3 py-2.5 rounded-xl border border-outline-variant/30 bg-background text-sm font-body text-primary focus:outline-none focus:border-secondary transition-colors">
                      <option value="">Select type...</option>
                      {inquiryTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-body font-semibold text-primary mb-1.5">Message</label>
                  <textarea required rows={5} placeholder="Tell us how we can help..."
                    className="w-full px-3 py-2.5 rounded-xl border border-outline-variant/30 bg-background text-sm font-body text-primary placeholder:text-on-surface-variant/50 focus:outline-none focus:border-secondary transition-colors resize-none" />
                </div>

                <button type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-body font-bold text-white bg-secondary hover:opacity-90 transition-all active:scale-[0.97]">
                  <Send className="w-3.5 h-3.5" />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
