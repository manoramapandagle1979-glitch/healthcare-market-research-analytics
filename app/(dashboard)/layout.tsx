import Sidebar from '@/components/layout/Sidebar'
import TopNav from '@/components/layout/TopNav'
import DevToolbar from '@/components/dev/DevToolbar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-surface-app">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <TopNav />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      <DevToolbar />
    </div>
  )
}
