import Link from 'next/link'
import { TrendingUp, Mail, ArrowLeft, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-app px-6 py-12">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: '#111115' }}>
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <span className="font-sora font-bold text-brand-primary text-xl">Horizon Intelligence</span>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
            style={{ background: 'rgba(212, 135, 10, 0.1)', border: '1px solid rgba(212, 135, 10, 0.2)' }}>
            <Mail className="w-7 h-7 text-brand-accent" />
          </div>

          <h1 className="font-sora font-bold text-2xl text-brand-primary mb-2">Forgot password?</h1>
          <p className="font-dm text-sm text-gray-500 mb-8">
            No worries! Enter your email address and we&apos;ll send you a password reset link within a few minutes.
          </p>

          <form className="space-y-4">
            <div>
              <label className="block text-xs font-dm font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="you@company.com"
                  className="input-field pl-10"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl text-sm font-dm font-bold text-white transition-all hover:opacity-90 hover:shadow-md"
              style={{ background: '#111115' }}>
              Send Reset Link
            </button>
          </form>

          {/* What to expect section */}
          <div className="mt-6 p-4 rounded-xl bg-gray-50 border border-gray-100">
            <p className="font-dm text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">What to expect</p>
            <ul className="space-y-1.5">
              {[
                'Check your email inbox (including spam folder)',
                'Click the reset link — it expires in 1 hour',
                'Set a new secure password',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-brand-accent shrink-0 mt-0.5" />
                  <span className="text-xs font-dm text-gray-500">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-sm font-dm text-gray-500 hover:text-brand-primary transition-colors mt-6">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
