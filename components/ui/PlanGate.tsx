'use client'

import { Lock, Zap } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useUserStore } from '@/store/user-store'
import type { Plan } from '@/types'

const PLAN_RANK: Record<Plan, number> = {
  FREE: 0,
  BASIC: 1,
  PREMIUM: 2,
  ENTERPRISE: 3,
}

interface PlanGateProps {
  children: React.ReactNode
  requiredPlan?: Plan
  // If true, always show locked regardless of plan (for explicit override)
  forcelock?: boolean
  message?: string
  className?: string
  blurContent?: boolean
}

export default function PlanGate({
  children,
  requiredPlan = 'BASIC',
  forcelock = false,
  message = 'Upgrade to access this feature',
  className,
  blurContent = false,
}: PlanGateProps) {
  const { user } = useUserStore()
  const locked = forcelock || PLAN_RANK[user.plan] < PLAN_RANK[requiredPlan]

  if (!locked) return <>{children}</>

  return (
    <div className={cn('relative', className)}>
      {blurContent && (
        <div className="blur-overlay pointer-events-none select-none">
          {children}
        </div>
      )}
      <div className={cn(
        'flex flex-col items-center justify-center gap-4 py-12 px-6 text-center',
        blurContent ? 'absolute inset-0 bg-white/85 backdrop-blur-sm rounded-2xl z-20' : ''
      )}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: '#111115' }}>
          <Lock className="w-6 h-6 text-brand-violet" />
        </div>
        <div>
          <h3 className="font-sora font-semibold text-brand-primary text-base mb-1">{message}</h3>
          <p className="text-sm font-dm text-gray-500 max-w-xs">
            Requires <span className="font-semibold text-brand-primary">{requiredPlan}</span> plan or higher.
            You are on <span className="font-semibold">{user.plan}</span>.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/pricing"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-dm font-semibold text-white"
            style={{ background: '#111115' }}>
            <Zap className="w-3.5 h-3.5" />
            Upgrade Plan
          </Link>
          <Link href="/pricing"
            className="px-5 py-2.5 rounded-full text-sm font-dm font-medium text-brand-primary border-2 border-brand-primary hover:bg-brand-primary hover:text-white transition-all">
            View Plans
          </Link>
        </div>
        <div className="flex flex-col gap-1 text-xs font-dm text-gray-500">
          {['Access to global market statistics', 'Access to company profiles', 'Free use-cases & research insights'].map((feat) => (
            <div key={feat} className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full flex items-center justify-center text-green-500 bg-green-50 text-[10px]">✓</span>
              {feat}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
