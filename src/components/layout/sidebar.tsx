"use client"

import { useAppStore, type PageName } from "@/lib/store"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  CalendarDays,
  ShieldAlert,
  ClipboardCheck,
  BookOpen,
  Cross,
  CreditCard,
  CalendarCheck,
  FileBarChart,
  Users,
  ScrollText,
  Settings,
  LogOut,
  Menu,
} from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface NavItem {
  label: string
  page: PageName
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { label: "Dashboard", page: "dashboard", icon: LayoutDashboard },
  { label: "Reservations", page: "reservations", icon: CalendarDays },
  { label: "Calendar", page: "calendar", icon: CalendarDays },
  { label: "Sakramental Records", page: "sakramental-records", icon: BookOpen },
  { label: "Priest Management", page: "priest-management", icon: Cross },
  { label: "Payments", page: "payments", icon: CreditCard },
  { label: "Upcoming Events", page: "events", icon: CalendarCheck },
  { label: "Reports", page: "reports", icon: FileBarChart },
  { label: "User Management", page: "user-management", icon: Users },
  { label: "Audit Logs", page: "audit-logs", icon: ScrollText },
  { label: "Settings", page: "settings", icon: Settings },
]

export function Sidebar() {
  const { currentPage, setCurrentPage, sidebarOpen, setSidebarOpen, setIsLoggedIn } = useAppStore()

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-white/10 bg-[var(--sidebar)] transition-all duration-300",
          sidebarOpen ? "w-64" : "w-[68px]"
        )}
      >
        {/* Logo & Hamburger Section */}
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="h-9 w-9 shrink-0 text-white/70 hover:bg-white/10 hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </Button>
          {sidebarOpen && (
            <div className="flex items-center gap-3 overflow-hidden min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                <Image
                  src="/sakramento-logo.png"
                  alt="SakramentoHub Logo"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col overflow-hidden min-w-0">
                <span className="text-sm font-bold text-white truncate">Saint Peter the Apostle</span>
                <span className="text-[10px] text-white/50 truncate">Church Management</span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-3">
          <nav className="flex flex-col gap-1 px-2">
            {navItems.map((item) => {
              const isActive = currentPage === item.page
              const Icon = item.icon
              return sidebarOpen ? (
                <button
                  key={item.page}
                  onClick={() => setCurrentPage(item.page)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 w-full text-left",
                    isActive
                      ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)]"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon className="h-4.5 w-4.5 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              ) : (
                <Tooltip key={item.page}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setCurrentPage(item.page)}
                      className={cn(
                        "flex items-center justify-center rounded-lg py-2.5 transition-all duration-200 w-full",
                        isActive
                          ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)]"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <Icon className="h-4.5 w-4.5 shrink-0" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </nav>
        </ScrollArea>

        <Separator className="bg-white/10" />

        {/* Bottom Section */}
        <div className="p-2">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={cn(
              "w-full text-white/70 hover:bg-white/5 hover:text-red-400",
              sidebarOpen ? "justify-start gap-3 px-3" : "justify-center"
            )}
          >
            <LogOut className="h-4.5 w-4.5 shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  )
}
