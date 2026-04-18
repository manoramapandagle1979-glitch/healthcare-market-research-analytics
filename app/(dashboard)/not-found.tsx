import Link from 'next/link'
import { Search } from 'lucide-react'

export default function DashboardNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-surface-container mb-6">
        <Search className="w-8 h-8 text-on-surface-variant" />
      </div>
      <h2 className="font-headline font-bold text-xl text-primary mb-2">Page not found</h2>
      <p className="text-sm font-body text-on-surface-variant mb-6 max-w-md text-center">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 rounded-xl text-sm font-body font-semibold text-white bg-primary hover:opacity-90 transition-all"
      >
        Go Home
      </Link>
    </div>
  )
}
