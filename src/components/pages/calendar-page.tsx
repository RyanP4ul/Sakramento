"use client"

import { useState, useMemo } from "react"
import {
  calendarEvents,
  serviceTypes,
  type CalendarEvent,
  type ServiceType,
} from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Church,
} from "lucide-react"
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
  isAfter,
  startOfDay,
} from "date-fns"

// Color mapping for service types
const serviceColorMap: Record<ServiceType, { dot: string; bg: string; text: string; border: string }> = {
  Baptism: {
    dot: "bg-blue-500",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  Wedding: {
    dot: "bg-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  "Funeral Mass": {
    dot: "bg-gray-500",
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
  },
  "Anointing of the Sick": {
    dot: "bg-purple-500",
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  "House Blessing & Other": {
    dot: "bg-green-500",
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  Confirmation: {
    dot: "bg-teal-500",
    bg: "bg-teal-50",
    text: "text-teal-700",
    border: "border-teal-200",
  },
}

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 2, 1)) // March 2025
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [serviceFilter, setServiceFilter] = useState<string>("All")

  // Generate calendar days for the month view
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const calStart = startOfWeek(monthStart)
    const calEnd = endOfWeek(monthEnd)

    const days: Date[] = []
    let day = calStart
    while (day <= calEnd) {
      days.push(day)
      day = addDays(day, 1)
    }
    return days
  }, [currentMonth])

  // Group events by date string
  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    calendarEvents.forEach((event) => {
      const key = event.date
      if (!map.has(key)) {
        map.set(key, [])
      }
      map.get(key)!.push(event)
    })
    return map
  }, [])

  // Filtered upcoming events (from today forward)
  const upcomingEvents = useMemo(() => {
    const today = startOfDay(new Date(2025, 2, 15)) // Simulated "today" in mock context
    let events = calendarEvents
      .filter((e) => {
        const eventDate = parseISO(e.date)
        return isAfter(eventDate, today) || isSameDay(eventDate, today)
      })
      .sort((a, b) => {
        const dateA = parseISO(a.date)
        const dateB = parseISO(b.date)
        if (dateA.getTime() !== dateB.getTime()) return dateA.getTime() - dateB.getTime()
        return a.id - b.id
      })

    if (serviceFilter !== "All") {
      events = events.filter((e) => e.serviceType === serviceFilter)
    }

    return events
  }, [serviceFilter])

  // Get events for a specific day (considering filter for the sidebar, but calendar shows all)
  const getEventsForDay = (day: Date) => {
    const key = format(day, "yyyy-MM-dd")
    return eventsByDate.get(key) || []
  }

  // Selected day events
  const selectedDayEvents = useMemo(() => {
    if (!selectedDate) return []
    return getEventsForDay(selectedDate)
  }, [selectedDate, eventsByDate])

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => subMonths(prev, 1))
    setSelectedDate(null)
  }

  const handleNextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1))
    setSelectedDate(null)
  }

  const handleToday = () => {
    setCurrentMonth(new Date(2025, 2, 1))
    setSelectedDate(new Date(2025, 2, 15))
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Calendar - 2/3 width */}
      <div className="flex-1 lg:flex-[2] min-w-0">
        <Card className="py-0 overflow-hidden h-full flex flex-col">
          {/* Calendar Header */}
          <CardHeader className="pb-2 pt-4 px-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1B2A4A]">
                  <Calendar className="h-5 w-5 text-[#D4AD63]" />
                </div>
                <div>
                  <CardTitle className="text-xl sm:text-2xl font-bold text-[#1B2A4A]">
                    {format(currentMonth, "MMMM yyyy")}
                  </CardTitle>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Church Sacrament Schedule
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToday}
                  className="hidden sm:inline-flex text-[#1B2A4A] border-[#1B2A4A]/20 hover:bg-[#1B2A4A]/5"
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevMonth}
                  className="h-8 w-8 sm:h-9 sm:w-9 border-[#1B2A4A]/20 hover:bg-[#1B2A4A]/5"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextMonth}
                  className="h-8 w-8 sm:h-9 sm:w-9 border-[#1B2A4A]/20 hover:bg-[#1B2A4A]/5"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Service type legend */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mt-3 pt-3 border-t">
              {serviceTypes.map((type) => {
                const colors = serviceColorMap[type]
                return (
                  <div key={type} className="flex items-center gap-1.5">
                    <span className={`h-2.5 w-2.5 rounded-full ${colors.dot} shrink-0`} />
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {type === "House Blessing & Other" ? "House Blessing" : type === "Anointing of the Sick" ? "Anointing" : type}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-2 sm:p-4 pt-0 sm:pt-0">
            {/* Day labels */}
            <div className="grid grid-cols-7 mb-1">
              {dayLabels.map((label) => (
                <div
                  key={label}
                  className="py-2 text-center text-xs sm:text-sm font-semibold text-[#1B2A4A]/60 uppercase tracking-wider"
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
              {calendarDays.map((day, idx) => {
                const dayEvents = getEventsForDay(day)
                const inCurrentMonth = isSameMonth(day, currentMonth)
                const isCurrentDay = isToday(day)
                const isSelected = selectedDate ? isSameDay(day, selectedDate) : false
                const hasEvents = dayEvents.length > 0

                // Get unique service types for this day
                const uniqueServiceTypes = [...new Set(dayEvents.map((e) => e.serviceType))]

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (hasEvents) {
                        setSelectedDate(day)
                      }
                    }}
                    className={`
                      relative flex flex-col items-center justify-start
                      min-h-[60px] sm:min-h-[80px] md:min-h-[100px]
                      rounded-lg p-1 sm:p-1.5 transition-all duration-200
                      ${inCurrentMonth ? "bg-white" : "bg-muted/30"}
                      ${hasEvents && inCurrentMonth ? "cursor-pointer hover:bg-[#1B2A4A]/5" : "cursor-default"}
                      ${isSelected ? "ring-2 ring-[#D4AD63] bg-[#D4AD63]/10 shadow-sm" : ""}
                      ${isCurrentDay && !isSelected ? "bg-[#1B2A4A]/5" : ""}
                      border border-transparent
                      ${isSelected ? "border-[#D4AD63]/30" : ""}
                    `}
                  >
                    {/* Day number */}
                    <span
                      className={`
                        text-xs sm:text-sm md:text-base font-medium leading-tight
                        ${!inCurrentMonth ? "text-muted-foreground/40" : ""}
                        ${inCurrentMonth && !isCurrentDay && !isSelected ? "text-[#1B2A4A]" : ""}
                        ${isCurrentDay ? "font-bold text-[#1B2A4A]" : ""}
                        ${isSelected ? "font-bold text-[#D4AD63]" : ""}
                      `}
                    >
                      {format(day, "d")}
                    </span>

                    {/* Event indicators */}
                    {hasEvents && inCurrentMonth && (
                      <div className="flex flex-col items-center gap-0.5 sm:gap-1 mt-0.5 sm:mt-1 w-full">
                        {/* Colored dots for service types */}
                        <div className="flex flex-wrap justify-center gap-0.5">
                          {uniqueServiceTypes.slice(0, 4).map((type) => (
                            <span
                              key={type}
                              className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full ${serviceColorMap[type].dot}`}
                            />
                          ))}
                        </div>

                        {/* Event count badge */}
                        {dayEvents.length > 0 && (
                          <Badge
                            className={`
                              h-4 sm:h-5 px-1 sm:px-1.5 text-[9px] sm:text-[10px] font-bold leading-none
                              ${isSelected
                                ? "bg-[#D4AD63] text-white hover:bg-[#D4AD63]"
                                : "bg-[#1B2A4A] text-white hover:bg-[#1B2A4A]"
                              }
                              border-0 rounded-full
                            `}
                          >
                            {dayEvents.length}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Today indicator */}
                    {isCurrentDay && inCurrentMonth && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-[#1B2A4A]" />
                    )}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Sidebar - Upcoming Events */}
      <div className="w-full lg:w-[380px] xl:w-[420px] flex flex-col gap-4">
        {/* Selected Day Detail */}
        {selectedDate && selectedDayEvents.length > 0 && (
          <Card className="py-0 overflow-hidden border-[#D4AD63]/30">
            <CardHeader className="pb-2 pt-4 px-4 bg-[#D4AD63]/10">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#D4AD63]" />
                <CardTitle className="text-sm font-bold text-[#1B2A4A]">
                  {format(selectedDate, "EEEE, MMMM d, yyyy")}
                </CardTitle>
              </div>
              <p className="text-xs text-[#1B2A4A]/60">
                {selectedDayEvents.length} event{selectedDayEvents.length !== 1 ? "s" : ""} scheduled
              </p>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-2">
                {selectedDayEvents.map((event) => {
                  const colors = serviceColorMap[event.serviceType]
                  return (
                    <div
                      key={event.id}
                      className={`flex items-center gap-2 p-2 rounded-lg ${colors.bg} ${colors.border} border`}
                    >
                      <Church className={`h-4 w-4 shrink-0 ${colors.text}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold ${colors.text} truncate`}>
                          {event.serviceType}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {event.fullName}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                        <Clock className="h-3 w-3" />
                        {event.time}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Events List */}
        <Card className="py-0 overflow-hidden flex-1 flex flex-col">
          <CardHeader className="pb-2 pt-4 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1B2A4A]">
                  <Church className="h-4 w-4 text-[#D4AD63]" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-[#1B2A4A]">
                    Upcoming Events
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {upcomingEvents.length} upcoming
                  </p>
                </div>
              </div>
            </div>

            {/* Service type filter */}
            <div className="mt-3 pt-3 border-t">
              <Select
                value={serviceFilter}
                onValueChange={setServiceFilter}
              >
                <SelectTrigger className="w-full h-8 text-xs">
                  <SelectValue placeholder="Filter by service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Services</SelectItem>
                  {serviceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-[300px] sm:h-[400px] lg:h-[calc(100vh-420px)] min-h-[250px]">
              {upcomingEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <Calendar className="h-10 w-10 text-muted-foreground/30 mb-3" />
                  <p className="text-sm font-medium text-muted-foreground">
                    No upcoming events
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    {serviceFilter !== "All"
                      ? "Try changing the service filter"
                      : "Check back later"}
                  </p>
                </div>
              ) : (
                <div className="px-3 pb-3 space-y-2">
                  {upcomingEvents.map((event) => {
                    const colors = serviceColorMap[event.serviceType]
                    const eventDate = parseISO(event.date)
                    const isSelectedDay = selectedDate
                      ? isSameDay(eventDate, selectedDate)
                      : false

                    return (
                      <button
                        key={event.id}
                        onClick={() => setSelectedDate(eventDate)}
                        className={`
                          w-full text-left p-3 rounded-lg border transition-all duration-200
                          hover:shadow-sm
                          ${isSelectedDay
                            ? `${colors.bg} ${colors.border} border shadow-sm`
                            : "bg-white border-gray-100 hover:border-gray-200"
                          }
                        `}
                      >
                        <div className="flex items-start gap-2.5">
                          {/* Date badge */}
                          <div className={`
                            flex flex-col items-center justify-center
                            h-10 w-10 sm:h-11 sm:w-11 shrink-0 rounded-lg
                            ${isSelectedDay ? "bg-white/80" : "bg-[#1B2A4A]/5"}
                          `}>
                            <span className="text-[10px] sm:text-xs font-semibold uppercase text-[#1B2A4A]/60 leading-none">
                              {format(eventDate, "MMM")}
                            </span>
                            <span className={`text-sm sm:text-base font-bold ${isSelectedDay ? colors.text : "text-[#1B2A4A]"} leading-tight`}>
                              {format(eventDate, "d")}
                            </span>
                          </div>

                          {/* Event info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className={`h-2 w-2 rounded-full ${colors.dot} shrink-0`} />
                              <span className={`text-xs font-semibold ${colors.text} truncate`}>
                                {event.serviceType}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-[#1B2A4A] truncate">
                              {event.fullName}
                            </p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {event.time}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
