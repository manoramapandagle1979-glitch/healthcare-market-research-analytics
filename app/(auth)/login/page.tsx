import Link from 'next/link'
import { TrendingUp, Mail, Lock, Eye } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{ background: '#111115' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-20"
            style={{ background: 'transparent', filter: 'blur(40px)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full opacity-15"
            style={{ background: 'transparent', filter: 'blur(30px)' }} />
          {/* grid overlay removed */}
        </div>
        <div className="relative z-10 flex flex-col justify-center px-12 py-16">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: '#d4870a' }}>
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="font-sora font-bold text-white text-xl">Curator Intelligence</span>
          </div>
          <h2 className="font-sora font-bold text-3xl text-white mb-4 leading-tight">
            Market intelligence<br />at your fingertips
          </h2>
          <p className="font-dm text-white/60 text-sm mb-8 leading-relaxed">
            Access 30,000+ market reports, 1.2M+ statistics, and AI-powered insights across 23+ industries.
          </p>
          <div className="space-y-3">
            {[
              '30K+ Global & Regional Reports',
              'AI-Powered Prism Intelligence',
              '200K+ Company Profiles',
              'Interactive Dashboards & Charts',
            ].map(item => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(212, 135, 10, 0.2)', border: '1px solid rgba(212, 135, 10, 0.3)' }}>
                  <span className="text-brand-accent text-[10px] font-bold">✓</span>
                </div>
                <span className="text-sm font-dm text-white/70">{item}</span>
              </div>
            ))}
          </div>

          {/* Decorative stats */}
          <div className="mt-12 grid grid-cols-2 gap-4">
            {[
              { value: '15K+', label: 'Active Users' },
              { value: '98%', label: 'Satisfaction Rate' },
            ].map(stat => (
              <div key={stat.label} className="p-4 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="font-sora font-bold text-2xl text-white mb-0.5">{stat.value}</div>
                <div className="font-dm text-xs text-white/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-surface-app">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: '#111115' }}>
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="font-sora font-bold text-brand-primary">Curator Intelligence</span>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h1 className="font-sora font-bold text-2xl text-brand-primary mb-1">Welcome back</h1>
            <p className="font-dm text-sm text-gray-500 mb-8">Sign in to your account to continue</p>

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
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-dm font-semibold text-gray-500 uppercase tracking-wider">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-xs font-dm text-brand-accent hover:text-brand-secondary transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="input-field pl-10 pr-10"
                  />
                  <button type="button" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded border-gray-300 accent-brand-accent cursor-pointer"
                />
                <label htmlFor="remember" className="text-sm font-dm text-gray-600 cursor-pointer">
                  Remember me for 30 days
                </label>
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl text-sm font-dm font-bold text-white transition-all hover:opacity-90 hover:shadow-md mt-2"
                style={{ background: '#111115' }}>
                Sign In
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-xs font-dm text-gray-400">or continue with</span>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-3 py-2.5 border border-gray-200 rounded-xl text-sm font-dm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            <p className="text-center text-sm font-dm text-gray-500 mt-6">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-brand-accent font-semibold hover:text-brand-secondary transition-colors">
                Sign up free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
