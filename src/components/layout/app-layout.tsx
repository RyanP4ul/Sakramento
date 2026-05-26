"use client"

import { useAppStore } from "@/lib/store"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { cn } from "@/lib/utils"

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useAppStore()

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Sidebar />
      <div
        className={cn(
          "transition-all duration-300",
          sidebarOpen ? "ml-64" : "ml-[68px]"
        )}
      >
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
