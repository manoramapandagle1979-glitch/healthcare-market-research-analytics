'use client'

import { useEffect } from 'react'
import { ToastProvider } from '@/components/ui/Toaster'
import { useAuthStore } from '@/store/auth-store'

function AuthHydrator() {
  const hydrate = useAuthStore((s) => s.hydrate)
  useEffect(() => {
    hydrate()
  }, [hydrate])
  return null
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthHydrator />
      {children}
    </ToastProvider>
  )
}
