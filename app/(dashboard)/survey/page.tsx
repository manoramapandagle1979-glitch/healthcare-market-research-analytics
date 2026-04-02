'use client'

import { useState } from 'react'
import { ClipboardList, Star, Send, CheckCircle } from 'lucide-react'

const questions = [
  { id: 'role', label: 'What best describes your role?', options: ['Analyst / Researcher', 'Executive / C-Suite', 'Consultant', 'Investor', 'Product Manager', 'Other'] },
  { id: 'usage', label: 'How often do you use Curator Intelligence?', options: ['Daily', 'Weekly', 'Monthly', 'Occasionally', 'First time'] },
  { id: 'value', label: 'Which feature do you find most valuable?', options: ['Market Reports', 'Company Profiles', 'Industry Analytics', 'Search & Discovery', 'AI Insights (Astra)', 'Data Export'] },
  { id: 'improve', label: 'What should we improve most?', options: ['More industries / markets', 'Deeper data granularity', 'Better visualizations', 'Faster report updates', 'More pricing flexibility', 'API access'] },
]

export default function SurveyPage() {
  const [submitted, setSubmitted] = useState(false)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [rating, setRating] = useState(0)

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-surface-container-lowest border-b border-surface-container-high">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <h1 className="font-headline font-bold text-2xl text-primary mb-1">Survey</h1>
            <p className="font-body text-sm text-on-surface-variant">Help us improve Curator Intelligence</p>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-secondary/10 mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-secondary" />
          </div>
          <h2 className="font-headline font-bold text-xl text-primary mb-2">Thank You for Your Feedback!</h2>
          <p className="font-body text-sm text-on-surface-variant">Your responses help us build a better platform for market intelligence.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-surface-container-lowest border-b border-surface-container-high">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="font-headline font-bold text-2xl text-primary mb-1">Survey</h1>
          <p className="font-body text-sm text-on-surface-variant">Help us improve Curator Intelligence &mdash; takes less than 2 minutes</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <form onSubmit={e => { e.preventDefault(); setSubmitted(true) }} className="space-y-6">
          {questions.map((q, idx) => (
            <div key={q.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-5">
              <h3 className="font-headline font-semibold text-sm text-primary mb-3">
                <span className="text-secondary mr-2">{idx + 1}.</span>{q.label}
              </h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {q.options.map(opt => (
                  <label key={opt}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-body cursor-pointer transition-all ${
                      answers[q.id] === opt
                        ? 'border-secondary bg-secondary/5 text-secondary font-semibold'
                        : 'border-outline-variant/20 text-on-surface-variant hover:border-secondary/40'
                    }`}>
                    <input type="radio" name={q.id} value={opt} className="sr-only"
                      onChange={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))} />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}

          {/* Star Rating */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-5">
            <h3 className="font-headline font-semibold text-sm text-primary mb-3">
              <span className="text-secondary mr-2">5.</span>Overall, how would you rate Curator Intelligence?
            </h3>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} type="button" onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110">
                  <Star className={`w-7 h-7 ${star <= rating ? 'fill-secondary text-secondary' : 'text-outline-variant/40'}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Additional Feedback */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-5">
            <h3 className="font-headline font-semibold text-sm text-primary mb-3">
              <span className="text-secondary mr-2">6.</span>Any additional feedback? (optional)
            </h3>
            <textarea rows={3} placeholder="Tell us what you think..."
              className="w-full px-3 py-2.5 rounded-xl border border-outline-variant/30 bg-background text-sm font-body text-primary placeholder:text-on-surface-variant/50 focus:outline-none focus:border-secondary transition-colors resize-none" />
          </div>

          <button type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-body font-bold text-white bg-secondary hover:opacity-90 transition-all active:scale-[0.97]">
            <Send className="w-3.5 h-3.5" />
            Submit Survey
          </button>
        </form>
      </div>
    </div>
  )
}
