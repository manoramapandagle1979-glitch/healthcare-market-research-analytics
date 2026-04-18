'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ApiUser } from '@/types/api'
import * as authApi from '@/lib/api/auth'
import { setTokenAccessors } from '@/lib/api/client'

interface AuthState {
  user: ApiUser | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean

  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshTokens: () => Promise<void>
  fetchMe: () => Promise<void>
  setTokens: (access: string, refresh: string) => void
  clearAuth: () => void
  hydrate: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {
      // Wire token accessors for the API client interceptors
      // This runs once when the store is created
      setTimeout(() => {
        setTokenAccessors({
          getAccess: () => get().accessToken,
          getRefresh: () => get().refreshToken,
          onRefreshed: (access, refresh) => {
            set({ accessToken: access, refreshToken: refresh })
          },
          onFailed: () => {
            get().clearAuth()
          },
        })
      }, 0)

      return {
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,

        login: async (email, password) => {
          set({ isLoading: true })
          try {
            const res = await authApi.login(email, password)
            set({
              user: res.user,
              accessToken: res.access_token,
              refreshToken: res.refresh_token,
              isAuthenticated: true,
              isLoading: false,
            })
          } catch (err) {
            set({ isLoading: false })
            throw err
          }
        },

        register: async (name, email, password) => {
          set({ isLoading: true })
          try {
            const res = await authApi.register(name, email, password)
            set({
              user: res.user,
              accessToken: res.access_token,
              refreshToken: res.refresh_token,
              isAuthenticated: true,
              isLoading: false,
            })
          } catch (err) {
            set({ isLoading: false })
            throw err
          }
        },

        logout: async () => {
          const { refreshToken } = get()
          try {
            if (refreshToken) await authApi.logout(refreshToken)
          } catch {
            // Ignore logout API errors
          }
          get().clearAuth()
        },

        refreshTokens: async () => {
          const { refreshToken } = get()
          if (!refreshToken) return

          try {
            const res = await authApi.refresh(refreshToken)
            set({
              user: res.user,
              accessToken: res.access_token,
              refreshToken: res.refresh_token,
              isAuthenticated: true,
            })
          } catch {
            get().clearAuth()
          }
        },

        fetchMe: async () => {
          try {
            const user = await authApi.getMe()
            set({ user, isAuthenticated: true })
          } catch {
            get().clearAuth()
          }
        },

        setTokens: (access, refresh) => {
          set({ accessToken: access, refreshToken: refresh })
        },

        clearAuth: () => {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
          })
        },

        hydrate: async () => {
          const { refreshToken } = get()
          if (!refreshToken) return
          set({ isLoading: true })
          try {
            await get().refreshTokens()
          } finally {
            set({ isLoading: false })
          }
        },
      }
    },
    {
      name: 'horizon-auth',
      // Only persist refresh token — access token lives in memory
      partialize: (state) => ({
        refreshToken: state.refreshToken,
      }),
    }
  )
)
