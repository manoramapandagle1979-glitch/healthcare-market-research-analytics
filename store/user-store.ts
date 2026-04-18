import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Plan, User } from '@/types'

interface UserState {
  user: User
  setPlan: (plan: Plan) => void
}

const defaultUser: User = {
  id: 'mock-user-1',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  avatar: 'AJ',
  plan: 'FREE',
  joinedAt: '2024-01-15',
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: defaultUser,
      setPlan: (plan) =>
        set((s) => ({
          user: { ...s.user, plan },
        })),
    }),
    {
      name: 'horizon-user',
    }
  )
)
