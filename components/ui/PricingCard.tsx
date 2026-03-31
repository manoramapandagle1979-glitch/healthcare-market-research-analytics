import { Check, X, Zap } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface PricingPlan {
  id: string
  name: string
  price: number
  period: string | null
  users: number
  cta: string
  description: string
  features: { label: string; included: boolean }[]
  highlighted: boolean
  badge: string | null
}

interface PricingCardProps {
  plan: PricingPlan
  currentPlan?: string
}

export default function PricingCard({ plan, currentPlan }: PricingCardProps) {
  const isCurrent = currentPlan === plan.id

  // Determine card visual style
  const isHighlighted = plan.highlighted
  const isEnterprise = plan.id === 'enterprise'

  const cardStyle = isHighlighted
    ? {
        background: '#0a0f1e',
        border: '1px solid rgba(200,169,110,0.25)',
        boxShadow: '0 8px 40px rgba(10,15,30,0.35), 0 0 0 1px rgba(200,169,110,0.12)',
      }
    : isEnterprise
    ? {
        background: '#0f0f14',
        border: '1px solid rgba(255,255,255,0.10)',
      }
    : {
        background: '#ffffff',
        border: '1px solid #e5e1d8',
      }

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-2xl p-6 transition-all duration-300',
        isHighlighted ? 'scale-105 z-10 shadow-2xl' : 'hover:shadow-card-hover'
      )}
      style={cardStyle}>

      {/* Badge */}
      {plan.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1 rounded-full text-[11px] font-dm font-bold uppercase tracking-widest"
            style={{ background: '#c8a96e', color: '#0a0f1e' }}>
            {plan.badge}
          </span>
        </div>
      )}

      <div className="mb-5">
        <h3 className={cn(
          'font-sora font-bold text-xl mb-1',
          isHighlighted || isEnterprise ? 'text-white' : 'text-[#0a0f1e]'
        )}>
          {plan.name}
        </h3>
        <p className={cn(
          'text-xs font-dm mb-4',
          isHighlighted || isEnterprise ? 'text-white/50' : 'text-gray-500'
        )}>
          {plan.description}
        </p>
        <div className="flex items-baseline gap-1">
          <span className={cn(
            'font-sora font-bold text-4xl',
            isHighlighted ? 'text-[#c8a96e]' : isEnterprise ? 'text-white' : 'text-[#0a0f1e]'
          )}>
            {plan.price === 0 ? 'Free' : `$${plan.price}`}
          </span>
          {plan.period && (
            <span className={cn(
              'text-sm font-dm',
              isHighlighted || isEnterprise ? 'text-white/40' : 'text-gray-400'
            )}>
              /{plan.period}
            </span>
          )}
        </div>
        {plan.period && (
          <div className={cn(
            'text-xs font-dm mt-1',
            isHighlighted || isEnterprise ? 'text-white/30' : 'text-gray-400'
          )}>
            Per month, billed annually · {plan.users} user{plan.users > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* CTA Button */}
      <Link href={isCurrent ? '/profile' : '/pricing'}
        className={cn(
          'w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-dm font-semibold mb-6 transition-all duration-200 active:scale-[0.97]',
          isCurrent
            ? 'bg-gray-100 text-gray-400 cursor-default'
            : isHighlighted
            ? 'hover:shadow-[0_0_20px_rgba(200,169,110,0.35)]'
            : isEnterprise
            ? 'bg-white/10 text-white border border-white/20 hover:bg-white/15'
            : 'bg-[#0a0f1e] text-white hover:bg-[#0f2044]'
        )}
        style={!isCurrent && isHighlighted ? { background: '#c8a96e', color: '#0a0f1e' } : {}}>
        {isHighlighted && !isCurrent && <Zap className="w-3.5 h-3.5" />}
        {isCurrent ? 'Current Plan' : plan.cta}
      </Link>

      {/* Features */}
      <div className="space-y-2.5">
        {plan.features.map((feature, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <div className={cn(
              'w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5',
              feature.included
                ? isHighlighted
                  ? 'bg-[#c8a96e]/20'
                  : isEnterprise
                  ? 'bg-white/15'
                  : 'bg-[#0a0f1e]/10'
                : isHighlighted || isEnterprise
                ? 'bg-white/5'
                : 'bg-gray-100'
            )}>
              {feature.included
                ? <Check className={cn('w-2.5 h-2.5',
                    isHighlighted ? 'text-[#c8a96e]' : isEnterprise ? 'text-white/70' : 'text-[#0a0f1e]'
                  )} />
                : <X className={cn('w-2.5 h-2.5',
                    isHighlighted || isEnterprise ? 'text-white/25' : 'text-gray-300'
                  )} />}
            </div>
            <span className={cn(
              'text-xs font-dm',
              feature.included
                ? isHighlighted ? 'text-white/80' : isEnterprise ? 'text-white/70' : 'text-gray-600'
                : isHighlighted || isEnterprise ? 'text-white/25' : 'text-gray-300'
            )}>
              {feature.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
