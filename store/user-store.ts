import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Plan, User } from '@/types'

const PLAN_QUERY_LIMITS: Record<Plan, number> = {
  FREE: 3,
  BASIC: 20,
  PREMIUM: -1, // unlimited
  ENTERPRISE: -1,
}

interface UserState {
  user: User
  setPlan: (plan: Plan) => void
  incrementPrismAIQuery: () => void
  canUsePrismAI: () => boolean
}

const defaultUser: User = {
  id: 'mock-user-1',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  avatar: 'AJ',
  plan: 'FREE',
  prismAiQueriesUsed: 1,
  prismAiQueryLimit: PLAN_QUERY_LIMITS['FREE'],
  joinedAt: '2024-01-15',
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: defaultUser,
      setPlan: (plan) =>
        set((s) => ({
          user: {
            ...s.user,
            plan,
            prismAiQueryLimit: PLAN_QUERY_LIMITS[plan],
          },
        })),
      incrementPrismAIQuery: () =>
        set((s) => ({
          user: { ...s.user, prismAiQueriesUsed: s.user.prismAiQueriesUsed + 1 },
        })),
      canUsePrismAI: () => {
        const { user } = get()
        if (user.prismAiQueryLimit === -1) return true
        return user.prismAiQueriesUsed < user.prismAiQueryLimit
      },
    }),
    {
      name: 'horizon-user',
    }
  )
)
