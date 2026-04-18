'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Dashboard error:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-red-50 mb-6">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
      <h2 className="font-headline font-bold text-xl text-primary mb-2">Something went wrong</h2>
      <p className="text-sm font-body text-on-surface-variant mb-6 max-w-md text-center">
        An unexpected error occurred while loading this page. Please try again.
      </p>
      <button
        onClick={reset}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-body font-semibold text-white bg-primary hover:opacity-90 transition-all"
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </button>
    </div>
  )
}
