import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Curator Intelligence — Market Research & Analytics Portal',
  description: 'World\'s largest portal for market reports, statistics & AI-powered research insights.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-body antialiased bg-paper text-ink">
        {children}
      </body>
    </html>
  )
}
