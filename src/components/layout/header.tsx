"use client"

import { useState } from "react"
import { useAppStore, type PageName } from "@/lib/store"
import { Bell, Search, Menu, Check, X, Clock, CalendarCheck, AlertTriangle, UserPlus, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const pageTitles: Record<PageName, string> = {
  login: "Login",
  dashboard: "Dashboard",
  reservations: "Reservations",
  calendar: "Calendar",
  "sakramental-records": "Sakramental Records",
  "priest-management": "Priest Management",
  reports: "Reports",
  "user-management": "User Management",
  "audit-logs": "Audit Logs",
  settings: "Settings",
}

interface Notification {
  id: number
  title: string
  message: string
  time: string
  read: boolean
  type: "reservation" | "priority" | "user" | "record"
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    title: "New Reservation",
    message: "Juan Dela Cruz submitted a Baptism reservation for March 20, 2026.",
    time: "2 min ago",
    read: false,
    type: "reservation",
  },
  {
    id: 2,
    title: "Priority Request",
    message: "Urgent wedding reservation from Maria Santos needs approval.",
    time: "15 min ago",
    read: false,
    type: "priority",
  },
  {
    id: 3,
    title: "New User Registered",
    message: "Father Ramos has been added to the priest directory.",
    time: "1 hr ago",
    read: false,
    type: "user",
  },
  {
    id: 4,
    title: "Certificate Generated",
    message: "Baptism certificate for Ana Reyes has been generated.",
    time: "2 hrs ago",
    read: true,
    type: "record",
  },
  {
    id: 5,
    title: "Reservation Confirmed",
    message: "Funeral Mass reservation for the Garcia family is confirmed.",
    time: "3 hrs ago",
    read: true,
    type: "reservation",
  },
  {
    id: 6,
    title: "Requirements Verified",
    message: "Confirmation requirements for Pedro Santos are now verified.",
    time: "5 hrs ago",
    read: true,
    type: "priority",
  },
]

const typeConfig: Record<Notification["type"], { icon: typeof Bell; bg: string; color: string }> = {
  reservation: { icon: CalendarCheck, bg: "bg-blue-50", color: "text-blue-600" },
  priority: { icon: AlertTriangle, bg: "bg-amber-50", color: "text-amber-600" },
  user: { icon: UserPlus, bg: "bg-emerald-50", color: "text-emerald-600" },
  record: { icon: FileText, bg: "bg-purple-50", color: "text-purple-600" },
}

export function Header() {
  const { currentPage, setIsLoggedIn, setSidebarOpen } = useAppStore()
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [popoverOpen, setPopoverOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const dismissNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white/80 backdrop-blur-sm px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex-1">
        <h1 className="text-xl font-semibold text-[#1B2A4A]">{pageTitles[currentPage]}</h1>
      </div>

      <div className="hidden md:flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="w-64 pl-8 bg-muted/50 border-0 focus-visible:ring-1"
          />
        </div>
      </div>

      {/* Notification Bell with Popover */}
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-[#D4AD63] text-[#1B2A4A] border-0">
                {unreadCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80 p-0 rounded-xl shadow-lg border">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-[#1B2A4A]">Notifications</h3>
              {unreadCount > 0 && (
                <Badge className="h-5 px-1.5 text-[10px] bg-[#D4AD63] text-[#1B2A4A] border-0 font-semibold">
                  {unreadCount} new
                </Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-medium text-[#D4AD63] hover:text-[#C49A3E] transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notification List */}
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <Bell className="h-8 w-8 mb-2 opacity-30" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto no-scrollbar">
              <div className="flex flex-col">
                {notifications.map((notification) => {
                  const cfg = typeConfig[notification.type]
                  const Icon = cfg.icon
                  return (
                    <div
                      key={notification.id}
                      className={`group relative flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/50 ${
                        !notification.read ? "bg-[#D4AD63]/5" : ""
                      }`}
                    >
                      {/* Unread dot */}
                      {!notification.read && (
                        <div className="absolute left-1.5 top-4 h-2 w-2 rounded-full bg-[#D4AD63]" />
                      )}

                      {/* Icon */}
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${cfg.bg}`}>
                        <Icon className={`h-4 w-4 ${cfg.color}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <p className={`text-sm leading-tight ${!notification.read ? "font-semibold text-[#1B2A4A]" : "font-medium text-[#1B2A4A]/80"}`}>
                            {notification.title}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              dismissNotification(notification.id)
                            }}
                            className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-muted"
                          >
                            <X className="h-3 w-3 text-muted-foreground" />
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3 text-muted-foreground/60" />
                          <span className="text-[11px] text-muted-foreground/60">{notification.time}</span>
                          {!notification.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                markAsRead(notification.id)
                              }}
                              className="ml-auto flex items-center gap-0.5 text-[11px] font-medium text-[#D4AD63] hover:text-[#C49A3E] transition-colors"
                            >
                              <Check className="h-3 w-3" />
                              Read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Footer */}
          {notifications.length > 0 && (
            <>
              <Separator />
              <div className="flex items-center justify-between px-4 py-2.5">
                <button
                  onClick={clearAll}
                  className="text-xs font-medium text-muted-foreground hover:text-[#1B2A4A] transition-colors"
                >
                  Clear all
                </button>
                <button
                  onClick={() => setPopoverOpen(false)}
                  className="text-xs font-medium text-[#D4AD63] hover:text-[#C49A3E] transition-colors"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </PopoverContent>
      </Popover>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-[#1B2A4A] text-white text-xs">AM</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">Admin Maria</p>
              <p className="text-xs text-muted-foreground">maria@saintpeterparish.org</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsLoggedIn(false)}
            className="text-red-600 focus:text-red-600"
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
