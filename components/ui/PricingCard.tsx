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
  const isHighlighted = plan.highlighted
  const isEnterprise = plan.id === 'enterprise'

  const cardStyle = isHighlighted
    ? {
        background: '#091426',
        border: '1px solid rgba(0,106,97,0.30)',
        boxShadow: '0 8px 40px rgba(9,20,38,0.35), 0 0 0 1px rgba(0,106,97,0.15)',
      }
    : isEnterprise
    ? {
        background: '#1e293b',
        border: '1px solid rgba(255,255,255,0.10)',
      }
    : {
        background: '#ffffff',
        border: '1px solid #c5c6cd',
      }

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-xl p-6 transition-all duration-300',
        isHighlighted ? 'scale-105 z-10 shadow-2xl' : 'hover:shadow-card-hover'
      )}
      style={cardStyle}>

      {/* Badge */}
      {plan.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1 rounded-full text-[11px] font-body font-bold uppercase tracking-widest bg-secondary-container text-on-secondary-container">
            {plan.badge}
          </span>
        </div>
      )}

      <div className="mb-5">
        <h3 className={cn(
          'font-headline font-bold text-xl mb-1',
          isHighlighted || isEnterprise ? 'text-white' : 'text-primary'
        )}>
          {plan.name}
        </h3>
        <p className={cn(
          'text-xs font-body mb-4 line-clamp-2',
          isHighlighted || isEnterprise ? 'text-white/50' : 'text-on-surface-variant'
        )}>
          {plan.description}
        </p>
        <div className="flex items-baseline gap-1">
          <span className={cn(
            'font-headline font-bold text-4xl',
            isHighlighted ? 'text-secondary-fixed' : isEnterprise ? 'text-white' : 'text-primary'
          )}>
            {plan.price === 0 ? 'Free' : `$${plan.price}`}
          </span>
          {plan.period && (
            <span className={cn(
              'text-sm font-body',
              isHighlighted || isEnterprise ? 'text-white/40' : 'text-on-surface-variant'
            )}>
              /{plan.period}
            </span>
          )}
        </div>
        {plan.period && (
          <div className={cn(
            'text-xs font-body mt-1',
            isHighlighted || isEnterprise ? 'text-white/30' : 'text-on-surface-variant'
          )}>
            Per month, billed annually · {plan.users} user{plan.users > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* CTA Button */}
      <Link href={isCurrent ? '/profile' : '/pricing'}
        className={cn(
          'w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-body font-bold mb-6 transition-all duration-200 active:scale-[0.97]',
          isCurrent
            ? 'bg-surface-container text-on-surface-variant cursor-default'
            : isHighlighted
            ? 'bg-gradient-to-br from-secondary to-secondary-container text-primary hover:opacity-90 shadow-lg'
            : isEnterprise
            ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
            : 'bg-primary text-white hover:bg-primary-container'
        )}>
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
                  ? 'bg-secondary/20'
                  : isEnterprise
                  ? 'bg-white/15'
                  : 'bg-secondary-container/40'
                : isHighlighted || isEnterprise
                ? 'bg-white/5'
                : 'bg-surface-container'
            )}>
              {feature.included
                ? <Check className={cn('w-2.5 h-2.5',
                    isHighlighted ? 'text-secondary-fixed' : isEnterprise ? 'text-white/70' : 'text-secondary'
                  )} />
                : <X className={cn('w-2.5 h-2.5',
                    isHighlighted || isEnterprise ? 'text-white/25' : 'text-outline'
                  )} />}
            </div>
            <span className={cn(
              'text-xs font-body',
              feature.included
                ? isHighlighted ? 'text-white/80' : isEnterprise ? 'text-white/70' : 'text-on-surface-variant'
                : isHighlighted || isEnterprise ? 'text-white/25' : 'text-outline'
            )}>
              {feature.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
