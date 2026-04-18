import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  sidebarCollapsed: boolean
  activeTab: string
  upgradeModalOpen: boolean
  setSidebarCollapsed: (v: boolean) => void
  toggleSidebar: () => void
  setActiveTab: (tab: string) => void
  setUpgradeModalOpen: (v: boolean) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      activeTab: 'overview',
      upgradeModalOpen: false,
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setUpgradeModalOpen: (v) => set({ upgradeModalOpen: v }),
    }),
    {
      name: 'horizon-ui',
      partialize: (s) => ({ sidebarCollapsed: s.sidebarCollapsed }),
    }
  )
)
