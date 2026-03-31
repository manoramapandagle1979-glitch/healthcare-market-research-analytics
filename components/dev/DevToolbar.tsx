'use client'

import { useState } from 'react'
import { ChevronUp, ChevronDown, Settings2 } from 'lucide-react'
import { useUserStore } from '@/store/user-store'
import type { Plan } from '@/types'

const PLANS: Plan[] = ['FREE', 'BASIC', 'PREMIUM', 'ENTERPRISE']

const PLAN_COLORS: Record<Plan, string> = {
  FREE: 'bg-gray-500',
  BASIC: 'bg-blue-500',
  PREMIUM: 'bg-brand-violet',
  ENTERPRISE: 'bg-brand-accent',
}

export default function DevToolbar() {
  const [expanded, setExpanded] = useState(false)
  const { user, setPlan } = useUserStore()

  if (process.env.NODE_ENV === 'production') return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-1.5">
      {expanded && (
        <div className="bg-gray-900/95 backdrop-blur-md rounded-2xl border border-white/10 p-4 shadow-2xl min-w-[280px]">
          <p className="text-xs font-dm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
            Dev — Plan Switcher
          </p>
          <div className="grid grid-cols-4 gap-2">
            {PLANS.map((plan) => (
              <button
                key={plan}
                onClick={() => setPlan(plan)}
                className={`px-3 py-2 rounded-xl text-xs font-dm font-semibold transition-all ${
                  user.plan === plan
                    ? `${PLAN_COLORS[plan]} text-white shadow-lg scale-105`
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}>
                {plan}
              </button>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-dm text-gray-400">
            <span>
              Current: <span className="font-semibold text-white">{user.plan}</span>
            </span>
            <span>
              AI Queries: <span className="text-white">{user.prismAiQueriesUsed}/{user.prismAiQueryLimit === -1 ? '∞' : user.prismAiQueryLimit}</span>
            </span>
          </div>
        </div>
      )}

      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900/95 border border-white/10 text-xs font-dm font-semibold text-white shadow-2xl hover:bg-gray-800 transition-all backdrop-blur-md">
        <Settings2 className="w-3.5 h-3.5 text-brand-violet" />
        <span>DEV</span>
        <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${PLAN_COLORS[user.plan]}`}>
          {user.plan}
        </span>
        {expanded ? <ChevronDown className="w-3 h-3 text-gray-400" /> : <ChevronUp className="w-3 h-3 text-gray-400" />}
      </button>
    </div>
  )
}
