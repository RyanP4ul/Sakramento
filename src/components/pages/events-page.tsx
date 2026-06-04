"use client"

import { useState, useMemo } from "react"
import {
  upcomingEvents as initialEvents,
  type UpcomingEvent,
  type EventCategory,
  type EventStatus,
} from "@/lib/mock-data"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  CalendarDays,
  Clock,
  Church,
  XCircle,
  MapPin,
  User,
  Megaphone,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Ban,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const ITEMS_PER_PAGE = 8

const categoryFilterOptions: ("All" | EventCategory)[] = [
  "All",
  "Liturgical",
  "Community",
  "Sacramental",
  "Fundraising",
  "Youth",
  "Formation",
]

const statusFilterOptions: ("All" | EventStatus)[] = [
  "All",
  "Upcoming",
  "Completed",
  "Cancelled",
  "Expired",
]

const categoryConfig: Record<EventCategory, { bgClass: string; textClass: string }> = {
  Liturgical: { bgClass: "bg-purple-100", textClass: "text-purple-800" },
  Community: { bgClass: "bg-blue-100", textClass: "text-blue-800" },
  Sacramental: { bgClass: "bg-emerald-100", textClass: "text-emerald-800" },
  Fundraising: { bgClass: "bg-amber-100", textClass: "text-amber-800" },
  Youth: { bgClass: "bg-pink-100", textClass: "text-pink-800" },
  Formation: { bgClass: "bg-cyan-100", textClass: "text-cyan-800" },
}

const statusConfig: Record<EventStatus, { bgClass: string; textClass: string; icon: React.ElementType }> = {
  Upcoming: { bgClass: "bg-emerald-100", textClass: "text-emerald-800", icon: CalendarDays },
  Completed: { bgClass: "bg-blue-100", textClass: "text-blue-800", icon: CheckCircle2 },
  Cancelled: { bgClass: "bg-red-100", textClass: "text-red-800", icon: Ban },
  Expired: { bgClass: "bg-gray-100", textClass: "text-gray-600", icon: AlertTriangle },
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr + "T00:00:00")
  return date.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

interface EventFormData {
  eventName: string
  date: string
  time: string
  category: EventCategory
  about: string
  venue: string
  organizer: string
  status: EventStatus
}

const emptyForm: EventFormData = {
  eventName: "",
  date: "",
  time: "",
  category: "Liturgical",
  about: "",
  venue: "",
  organizer: "",
  status: "Upcoming",
}

export function EventsPage() {
  const { toast } = useToast()
  const [events, setEvents] = useState<UpcomingEvent[]>(initialEvents)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("All")
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<UpcomingEvent | null>(null)
  const [formData, setFormData] = useState<EventFormData>(emptyForm)

  // Calculate stats
  const stats = useMemo(() => {
    const now = new Date()
    const thisMonth = now.getMonth()
    const thisYear = now.getFullYear()

    const thisMonthCount = events.filter((e) => {
      const d = new Date(e.date + "T00:00:00")
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear
    }).length

    const nextWeek = new Date(now)
    nextWeek.setDate(nextWeek.getDate() + 7)
    const thisWeekCount = events.filter((e) => {
      const d = new Date(e.date + "T00:00:00")
      return d >= now && d <= nextWeek && e.status === "Upcoming"
    }).length

    const uniqueCategories = new Set(events.map((e) => e.category)).size
    const upcomingCount = events.filter((e) => e.status === "Upcoming").length

    return { total: events.length, upcoming: upcomingCount, thisMonth: thisMonthCount, thisWeek: thisWeekCount, categories: uniqueCategories }
  }, [events])

  // Filter events
  const filteredEvents = useMemo(() => {
    return events.filter((e: UpcomingEvent) => {
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        !query ||
        e.eventName.toLowerCase().includes(query) ||
        e.about.toLowerCase().includes(query) ||
        e.organizer.toLowerCase().includes(query)

      const matchesCategory = categoryFilter === "All" || e.category === categoryFilter
      const matchesStatus = statusFilter === "All" || e.status === statusFilter

      const matchesDateFrom = !dateFrom || e.date >= dateFrom
      const matchesDateTo = !dateTo || e.date <= dateTo

      return matchesSearch && matchesCategory && matchesStatus && matchesDateFrom && matchesDateTo
    })
  }, [events, searchQuery, categoryFilter, statusFilter, dateFrom, dateTo])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / ITEMS_PER_PAGE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedEvents = filteredEvents.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  )

  const handleFilterChange =
    (setter: (val: string) => void) => (val: string) => {
      setter(val)
      setCurrentPage(1)
    }

  // View details
  const handleViewDetails = (event: UpcomingEvent) => {
    setSelectedEvent(event)
    setViewDialogOpen(true)
  }

  // Add Event
  const handleOpenAdd = () => {
    setFormData(emptyForm)
    setAddDialogOpen(true)
  }

  const handleAddEvent = () => {
    if (!formData.eventName || !formData.date || !formData.time || !formData.venue || !formData.organizer) {
      toast({ title: "Missing fields", description: "Please fill in all required fields.", variant: "destructive" })
      return
    }
    const newId = Math.max(0, ...events.map((e) => e.id)) + 1
    const newEvent: UpcomingEvent = {
      id: newId,
      eventName: formData.eventName,
      date: formData.date,
      time: formData.time,
      category: formData.category,
      about: formData.about,
      venue: formData.venue,
      organizer: formData.organizer,
      status: formData.status,
    }
    setEvents((prev) => [newEvent, ...prev])
    setAddDialogOpen(false)
    setFormData(emptyForm)
    toast({ title: "Event added", description: `"${newEvent.eventName}" has been added successfully.` })
  }

  // Edit Event
  const handleOpenEdit = (event: UpcomingEvent) => {
    setSelectedEvent(event)
    setFormData({
      eventName: event.eventName,
      date: event.date,
      time: event.time,
      category: event.category,
      about: event.about,
      venue: event.venue,
      organizer: event.organizer,
      status: event.status,
    })
    setEditDialogOpen(true)
  }

  const handleEditEvent = () => {
    if (!selectedEvent) return
    if (!formData.eventName || !formData.date || !formData.time || !formData.venue || !formData.organizer) {
      toast({ title: "Missing fields", description: "Please fill in all required fields.", variant: "destructive" })
      return
    }
    setEvents((prev) =>
      prev.map((e) =>
        e.id === selectedEvent.id
          ? { ...e, eventName: formData.eventName, date: formData.date, time: formData.time, category: formData.category, about: formData.about, venue: formData.venue, organizer: formData.organizer, status: formData.status }
          : e
      )
    )
    setEditDialogOpen(false)
    setSelectedEvent(null)
    setFormData(emptyForm)
    toast({ title: "Event updated", description: `"${formData.eventName}" has been updated successfully.` })
  }

  // Delete Event
  const handleOpenDelete = (event: UpcomingEvent) => {
    setSelectedEvent(event)
    setDeleteDialogOpen(true)
  }

  const handleDeleteEvent = () => {
    if (!selectedEvent) return
    const name = selectedEvent.eventName
    setEvents((prev) => prev.filter((e) => e.id !== selectedEvent.id))
    setDeleteDialogOpen(false)
    setSelectedEvent(null)
    toast({ title: "Event deleted", description: `"${name}" has been removed.`, variant: "destructive" })
  }

  // Mark as Expired/Cancelled
  const handleMarkExpired = (event: UpcomingEvent) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === event.id ? { ...e, status: "Expired" as EventStatus } : e))
    )
    toast({ title: "Event marked as Expired", description: `"${event.eventName}" is no longer available.` })
  }

  const handleMarkCancelled = (event: UpcomingEvent) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === event.id ? { ...e, status: "Cancelled" as EventStatus } : e)))
    toast({ title: "Event cancelled", description: `"${event.eventName}" has been cancelled.` })
  }

  const handleMarkCompleted = (event: UpcomingEvent) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === event.id ? { ...e, status: "Completed" as EventStatus } : e)))
    toast({ title: "Event completed", description: `"${event.eventName}" has been marked as completed.` })
  }

  const hasActiveDateFilters = dateFrom || dateTo

  const statCards = [
    {
      label: "Total Events",
      count: stats.total,
      icon: CalendarDays,
      bgClass: "bg-[#1B2A4A]/5 border-[#1B2A4A]/20",
      iconClass: "text-[#1B2A4A]",
      countClass: "text-[#1B2A4A]",
    },
    {
      label: "Upcoming",
      count: stats.upcoming,
      icon: Clock,
      bgClass: "bg-[#D4AD63]/10 border-[#D4AD63]/25",
      iconClass: "text-[#D4AD63]",
      countClass: "text-[#b8953f]",
    },
    {
      label: "This Week",
      count: stats.thisWeek,
      icon: Megaphone,
      bgClass: "bg-emerald-50 border-emerald-200",
      iconClass: "text-emerald-600",
      countClass: "text-emerald-700",
    },
    {
      label: "Categories",
      count: stats.categories,
      icon: Church,
      bgClass: "bg-purple-50 border-purple-200",
      iconClass: "text-purple-600",
      countClass: "text-purple-700",
    },
  ]

  // Form fields component
  const renderFormFields = (onChange: (field: keyof EventFormData, value: string) => void) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="eventName" className="text-sm font-medium">Event Name <span className="text-red-500">*</span></Label>
          <Input id="eventName" placeholder="Enter event name" value={formData.eventName} onChange={(e) => onChange("eventName", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm font-medium">Category <span className="text-red-500">*</span></Label>
          <Select value={formData.category} onValueChange={(val) => onChange("category", val)}>
            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              {categoryFilterOptions.filter((c) => c !== "All").map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date" className="text-sm font-medium">Date <span className="text-red-500">*</span></Label>
          <Input id="date" type="date" value={formData.date} onChange={(e) => onChange("date", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="time" className="text-sm font-medium">Time <span className="text-red-500">*</span></Label>
          <Input id="time" type="time" value={formData.time} onChange={(e) => onChange("time", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status" className="text-sm font-medium">Status</Label>
          <Select value={formData.status} onValueChange={(val) => onChange("status", val)}>
            <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
            <SelectContent>
              {statusFilterOptions.filter((s) => s !== "All").map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="venue" className="text-sm font-medium">Venue <span className="text-red-500">*</span></Label>
          <Input id="venue" placeholder="Enter venue" value={formData.venue} onChange={(e) => onChange("venue", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="organizer" className="text-sm font-medium">Organizer <span className="text-red-500">*</span></Label>
          <Input id="organizer" placeholder="Enter organizer" value={formData.organizer} onChange={(e) => onChange("organizer", e.target.value)} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="about" className="text-sm font-medium">About</Label>
        <Textarea id="about" placeholder="Describe the event..." rows={3} value={formData.about} onChange={(e) => onChange("about", e.target.value)} />
      </div>
    </div>
  )

  const handleFormChange = (field: keyof EventFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Convert time for display (from time input format HH:MM to 12h format)
  const formatTimeDisplay = (timeStr: string) => {
    if (!timeStr) return ""
    // If already in 12h format like "8:00 AM", return as-is
    if (timeStr.includes("AM") || timeStr.includes("PM")) return timeStr
    // Convert from HH:MM 24h to 12h
    const [hours, minutes] = timeStr.split(":")
    const h = parseInt(hours, 10)
    const ampm = h >= 12 ? "PM" : "AM"
    const h12 = h % 12 || 12
    return `${h12}:${minutes} ${ampm}`
  }

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className={`${stat.bgClass} border py-0 overflow-hidden`}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/70">
                  <Icon className={`h-5 w-5 ${stat.iconClass}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground truncate">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.countClass}`}>{stat.count}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Search & Filters */}
      <Card className="py-0 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            {/* Search + Add Button Row */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by event name, description, or organizer..."
                  className="pl-9 w-full"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                />
              </div>
              <Button
                onClick={handleOpenAdd}
                className="bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 text-white gap-2 shrink-0"
              >
                <Plus className="h-4 w-4" />
                Add Event
              </Button>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                  Category:
                </span>
                <Select
                  value={categoryFilter}
                  onValueChange={handleFilterChange(setCategoryFilter)}
                >
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryFilterOptions.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat === "All" ? "All Categories" : cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                  Status:
                </span>
                <Select
                  value={statusFilter}
                  onValueChange={handleFilterChange(setStatusFilter)}
                >
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusFilterOptions.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s === "All" ? "All Statuses" : s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                  From:
                </span>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-[150px]"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                  To:
                </span>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => {
                    setDateTo(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-[150px]"
                />
              </div>

              {hasActiveDateFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    setDateFrom("")
                    setDateTo("")
                    setCurrentPage(1)
                  }}
                >
                  <XCircle className="h-3.5 w-3.5 mr-1" />
                  Clear dates
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">{filteredEvents.length}</span>{" "}
          event{filteredEvents.length !== 1 ? "s" : ""}
          {filteredEvents.length !== events.length && (
            <span>
              {" "}
              (filtered from{" "}
              <span className="font-medium text-foreground">{events.length}</span>)
            </span>
          )}
        </p>
      </div>

      {/* Table */}
      {filteredEvents.length === 0 ? (
        <Card className="py-0 overflow-hidden">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <CalendarDays className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No upcoming events found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search or filter criteria.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="py-0 overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#1B2A4A]/5 hover:bg-[#1B2A4A]/5">
                  <TableHead className="text-[#1B2A4A] font-semibold">Event Name</TableHead>
                  <TableHead className="text-[#1B2A4A] font-semibold">Date</TableHead>
                  <TableHead className="text-[#1B2A4A] font-semibold hidden sm:table-cell">Time</TableHead>
                  <TableHead className="text-[#1B2A4A] font-semibold hidden md:table-cell">About</TableHead>
                  <TableHead className="text-[#1B2A4A] font-semibold">Status</TableHead>
                  <TableHead className="text-[#1B2A4A] font-semibold text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedEvents.map((event) => {
                  const catCfg = categoryConfig[event.category]
                  const sCfg = statusConfig[event.status]
                  const StatusIcon = sCfg.icon
                  const isInactive = event.status !== "Upcoming"
                  return (
                    <TableRow key={event.id} className={isInactive ? "opacity-60" : ""}>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className={`font-medium ${isInactive ? "text-muted-foreground line-through" : "text-[#1B2A4A]"}`}>
                            {event.eventName}
                          </span>
                          <Badge
                            className={`${catCfg.bgClass} ${catCfg.textClass} border-0 text-xs font-medium w-fit`}
                          >
                            {event.category}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground whitespace-nowrap">
                        {formatDate(event.date)}
                      </TableCell>
                      <TableCell className="text-muted-foreground hidden sm:table-cell whitespace-nowrap">
                        {formatTimeDisplay(event.time)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-[250px]">
                        <p className="text-sm text-muted-foreground truncate">{event.about}</p>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${sCfg.bgClass} ${sCfg.textClass} border-0 text-xs font-medium gap-1`}>
                          <StatusIcon className="h-3 w-3" />
                          {event.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-[#1B2A4A]/10">
                                <MoreHorizontal className="h-4 w-4 text-[#1B2A4A]" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onClick={() => handleViewDetails(event)} className="gap-2">
                                <Eye className="h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleOpenEdit(event)} className="gap-2">
                                <Pencil className="h-4 w-4" />
                                Edit Event
                              </DropdownMenuItem>
                              {event.status === "Upcoming" && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleMarkCompleted(event)} className="gap-2 text-blue-700">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Mark as Completed
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleMarkExpired(event)} className="gap-2 text-gray-600">
                                    <AlertTriangle className="h-4 w-4" />
                                    Mark as Expired
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleMarkCancelled(event)} className="gap-2 text-red-600">
                                    <Ban className="h-4 w-4" />
                                    Cancel Event
                                  </DropdownMenuItem>
                                </>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleOpenDelete(event)} className="gap-2 text-red-600 focus:text-red-600">
                                <Trash2 className="h-4 w-4" />
                                Delete Event
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-muted-foreground">
            Page{" "}
            <span className="font-medium text-foreground">{safeCurrentPage}</span> of{" "}
            <span className="font-medium text-foreground">{totalPages}</span>
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safeCurrentPage <= 1}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === safeCurrentPage ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={
                  page === safeCurrentPage
                    ? "bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 text-white"
                    : ""
                }
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safeCurrentPage >= totalPages}
              className="gap-1"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* View Event Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#1B2A4A] flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-[#D4AD63]" />
              Event Details
            </DialogTitle>
            <DialogDescription>
              Viewing details for the selected event
            </DialogDescription>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-4">
              {/* Header Card */}
              <div className="bg-[#1B2A4A]/5 rounded-lg p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-[#1B2A4A]">{selectedEvent.eventName}</h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge
                        className={`${categoryConfig[selectedEvent.category].bgClass} ${categoryConfig[selectedEvent.category].textClass} border-0 text-xs font-medium`}
                      >
                        {selectedEvent.category}
                      </Badge>
                      <Badge className={`${statusConfig[selectedEvent.status].bgClass} ${statusConfig[selectedEvent.status].textClass} border-0 text-xs font-medium gap-1`}>
                        {(() => { const SI = statusConfig[selectedEvent.status].icon; return <SI className="h-3 w-3" /> })()}
                        {selectedEvent.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Date
                  </p>
                  <p className="font-medium">{formatDate(selectedEvent.date)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    Time
                  </p>
                  <p className="font-medium">{formatTimeDisplay(selectedEvent.time)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    Venue
                  </p>
                  <p className="font-medium">{selectedEvent.venue}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    Organizer
                  </p>
                  <p className="font-medium">{selectedEvent.organizer}</p>
                </div>
              </div>

              <Separator />

              {/* About Section */}
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mb-2">
                  <Church className="h-3.5 w-3.5" />
                  About this Event
                </p>
                <p className="text-sm bg-muted/30 rounded-md p-3 leading-relaxed">
                  {selectedEvent.about || "No description provided."}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setViewDialogOpen(false)
                setSelectedEvent(null)
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Event Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#1B2A4A] flex items-center gap-2">
              <Plus className="h-5 w-5 text-[#D4AD63]" />
              Add New Event
            </DialogTitle>
            <DialogDescription>
              Create a new upcoming event for the parish
            </DialogDescription>
          </DialogHeader>

          {renderFormFields(handleFormChange)}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setAddDialogOpen(false); setFormData(emptyForm) }}>
              Cancel
            </Button>
            <Button onClick={handleAddEvent} className="bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 text-white">
              Add Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#1B2A4A] flex items-center gap-2">
              <Pencil className="h-5 w-5 text-[#D4AD63]" />
              Edit Event
            </DialogTitle>
            <DialogDescription>
              Update the event details
            </DialogDescription>
          </DialogHeader>

          {renderFormFields(handleFormChange)}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setEditDialogOpen(false); setSelectedEvent(null); setFormData(emptyForm) }}>
              Cancel
            </Button>
            <Button onClick={handleEditEvent} className="bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 text-white">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-700 flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Delete Event
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. The event will be permanently removed.
            </DialogDescription>
          </DialogHeader>

          {selectedEvent && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="font-medium text-red-900">{selectedEvent.eventName}</p>
              <p className="text-sm text-red-700 mt-1">
                {formatDate(selectedEvent.date)} at {formatTimeDisplay(selectedEvent.time)} &mdash; {selectedEvent.venue}
              </p>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setDeleteDialogOpen(false); setSelectedEvent(null) }}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteEvent}>
              Delete Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
