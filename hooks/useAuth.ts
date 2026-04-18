'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'

/**
 * Redirects to /login if the user is not authenticated.
 * Use on pages that require auth (profile, my-reports, etc.)
 */
export function useRequireAuth() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuthStore()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated, isLoading, router])

  return { isAuthenticated, isLoading }
}

/**
 * Redirects to / if the user IS authenticated.
 * Use on login/register pages to prevent showing them to logged-in users.
 */
export function useRedirectIfAuth() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuthStore()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/')
    }
  }, [isAuthenticated, isLoading, router])

  return { isAuthenticated, isLoading }
}
