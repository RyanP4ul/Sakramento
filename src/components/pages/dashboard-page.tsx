'use client'

import {
  dashboardStats,
  todaySchedule,
  priorityRequests,
  mostRequestedServicesByPeriod,
  peakBookingMonths,
  recentActivities,
} from "@/lib/mock-data"
import { useAppStore } from "@/lib/store"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import {
  CalendarDays,
  Clock,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Activity,
  FileText,
  Users,
  ArrowRight,
  Church,
  Heart,
  ShieldAlert,
  BookOpen,
  PlusCircle,
  XCircle,
  Award,
} from "lucide-react"
import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

// Chart configs
const servicesChartConfig: ChartConfig = {
  count: {
    label: "Count",
    color: "#1B2A4A",
  },
}

const bookingsChartConfig: ChartConfig = {
  bookings: {
    label: "Bookings",
    color: "#D4AD63",
  },
}

// Shared period state for Most Requested Services
type Period = "weekly" | "monthly" | "yearly"
let sharedPeriod: Period = "monthly"
const periodListeners: Set<() => void> = new Set()

function setSharedPeriod(p: Period) {
  sharedPeriod = p
  periodListeners.forEach((l) => l())
}

function useSharedPeriod() {
  const [period, setPeriod] = useState<Period>(sharedPeriod)
  useEffect(() => {
    const listener = () => setPeriod(sharedPeriod)
    periodListeners.add(listener)
    return () => {
      periodListeners.delete(listener)
    }
  }, [])
  return period
}

function MostRequestedPeriodToggle() {
  const period = useSharedPeriod()
  const periods: { key: Period; label: string }[] = [
    { key: "weekly", label: "Weekly" },
    { key: "monthly", label: "Monthly" },
    { key: "yearly", label: "Yearly" },
  ]
  return (
    <div className="flex rounded-lg border border-[#1B2A4A]/15 overflow-hidden">
      {periods.map((p) => (
        <button
          key={p.key}
          onClick={() => setSharedPeriod(p.key)}
          className={`px-2.5 py-1 text-xs font-medium transition-colors ${
            period === p.key
              ? "bg-[#1B2A4A] text-white"
              : "bg-white text-[#1B2A4A] hover:bg-[#1B2A4A]/5"
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}

function MostRequestedChart() {
  const period = useSharedPeriod()
  const data = mostRequestedServicesByPeriod[period]
  return (
    <ChartContainer config={servicesChartConfig} className="h-[300px] w-full">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 50, left: 10, bottom: 5 }}
        barCategoryGap="20%"
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1B2A4A08" />
        <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 12, fill: "#1B2A4A" }}
          width={140}
          tickLine={false}
          axisLine={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar
          dataKey="count"
          fill="#1B2A4A"
          radius={[0, 6, 6, 0]}
          barSize={22}
          label={{
            position: "right",
            fontSize: 11,
            fill: "#1B2A4A",
            fontWeight: 600,
            formatter: (value: number) => value,
          }}
        />
      </BarChart>
    </ChartContainer>
  )
}

// Status badge color mapping
function getStatusBadge(status: string) {
  switch (status) {
    case "Confirmed":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
          <CheckCircle className="h-3 w-3 mr-1" />
          Confirmed
        </Badge>
      )
    case "Priority":
      return (
        <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Priority
        </Badge>
      )
    case "Pending":
      return (
        <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      )
    case "Schedule":
      return (
        <Badge className="bg-sky-100 text-sky-700 border-sky-200 hover:bg-sky-100">
          <CalendarDays className="h-3 w-3 mr-1" />
          Schedule
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

// Activity icon mapping
function getActivityIcon(type: string) {
  switch (type) {
    case "reservation":
      return <CalendarDays className="h-4 w-4 text-[#1B2A4A]" />
    case "certificate":
      return <Award className="h-4 w-4 text-[#D4AD63]" />
    case "approval":
      return <CheckCircle className="h-4 w-4 text-emerald-600" />
    case "user":
      return <Users className="h-4 w-4 text-[#1B2A4A]" />
    case "cancellation":
      return <XCircle className="h-4 w-4 text-red-500" />
    case "donation":
      return <DollarSign className="h-4 w-4 text-[#D4AD63]" />
    case "verification":
      return <ShieldAlert className="h-4 w-4 text-[#1B2A4A]" />
    default:
      return <Activity className="h-4 w-4 text-[#1B2A4A]" />
  }
}

const dashboardStatCards = [
  {
    label: "Total Reservations",
    count: dashboardStats.totalReservations,
    icon: CalendarDays,
    bgClass: "bg-[#1B2A4A]/5 border-[#1B2A4A]/20",
    iconClass: "text-[#1B2A4A]",
    countClass: "text-[#1B2A4A]",
    trend: "+8%",
  },
  {
    label: "Pending Requests",
    count: dashboardStats.pendingRequests,
    icon: Clock,
    bgClass: "bg-yellow-50 border-yellow-200",
    iconClass: "text-yellow-600",
    countClass: "text-yellow-700",
    trend: "-3%",
  },
  {
    label: "Approved Requests",
    count: dashboardStats.approvedRequests,
    icon: CheckCircle,
    bgClass: "bg-green-50 border-green-200",
    iconClass: "text-green-600",
    countClass: "text-green-700",
    trend: "+15%",
  },
  {
    label: "Completed",
    count: dashboardStats.completed,
    icon: Activity,
    bgClass: "bg-[#D4AD63]/10 border-[#D4AD63]/25",
    iconClass: "text-[#C49A3E]",
    countClass: "text-[#B8942E]",
    trend: "+5%",
  },
  {
    label: "Total Donations",
    count: dashboardStats.totalDonations,
    icon: DollarSign,
    bgClass: "bg-blue-50 border-blue-200",
    iconClass: "text-blue-600",
    countClass: "text-blue-700",
    prefix: "₱",
    trend: "+22%",
  },
]

export function DashboardPage() {
  const setCurrentPage = useAppStore((s) => s.setCurrentPage)

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-[#1B2A4A]">Welcome back, Admin</h1>
          <p className="text-sm text-muted-foreground">Here&apos;s what&apos;s happening at Saint Peter the Apostle today</p>
        </div>
        <p className="text-sm text-muted-foreground font-medium">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {dashboardStatCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.label}
              className={`${stat.bgClass} border py-0 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-default`}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/70">
                  <Icon className={`h-5 w-5 ${stat.iconClass}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground truncate">
                    {stat.label}
                  </p>
                  <p className={`text-2xl font-bold ${stat.countClass}`}>
                    {"prefix" in stat ? stat.prefix : ""}
                    {stat.count.toLocaleString()}
                  </p>
                  <p className={`text-xs font-medium ${stat.trend.startsWith("+") ? "text-emerald-600" : "text-red-500"}`}>
                    {stat.trend}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content Grid: Schedule + Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-[#1B2A4A]">Today&apos;s Schedule</CardTitle>
                <CardDescription>Service appointments for today</CardDescription>
              </div>
              <CalendarDays className="h-5 w-5 text-[#D4AD63]" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
              <div className="max-h-96 overflow-y-auto no-scrollbar">
              <div className="space-y-3">
                {todaySchedule.filter((item) => item.status === "Confirmed").map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0 overflow-hidden">
                      <div className="h-9 w-9 rounded-lg bg-[#1B2A4A]/10 flex items-center justify-center shrink-0">
                        <Church className="h-4 w-4 text-[#1B2A4A]" />
                      </div>
                      <div className="min-w-0 overflow-hidden">
                        <p className="text-sm font-medium text-[#1B2A4A] truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {item.serviceType}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                        <Clock className="h-3 w-3" />
                        {item.time}
                      </div>
                      {getStatusBadge(item.status)}
                    </div>
                  </div>
                ))}
              </div>
              </div>
          </CardContent>
        </Card>

        {/* Most Requested Services Chart */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-[#1B2A4A]">Most Requested Services</CardTitle>
                <CardDescription>Service distribution overview</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <MostRequestedPeriodToggle />
                <BookOpen className="h-5 w-5 text-[#D4AD63]" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <MostRequestedChart />
          </CardContent>
        </Card>
      </div>

      {/* Priority Requests + Peak Booking Months */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Priority Requests */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-[#1B2A4A]">Priority Requests</CardTitle>
                <CardDescription>Urgent requests needing attention</CardDescription>
              </div>
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
              <div className="max-h-72 overflow-y-auto">
              <div className="space-y-3">
                {priorityRequests.map((req) => (
                  <div
                    key={req.id}
                    className="flex items-center justify-between rounded-lg border border-red-100 bg-red-50/50 p-3 hover:bg-red-50 transition-colors gap-3"
                    title={`${req.name} — ${req.date}`}
                  >
                    <div className="flex items-center gap-3 min-w-0 overflow-hidden">
                      <div className="h-9 w-9 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                        <Heart className="h-4 w-4 text-red-600" />
                      </div>
                      <div className="min-w-0 overflow-hidden">
                        <p className="text-sm font-medium text-[#1B2A4A] truncate">
                          {req.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground whitespace-nowrap">
                          <CalendarDays className="h-3 w-3 shrink-0" />
                          <span className="truncate">{req.date}</span>
                          <span className="text-muted-foreground/40">|</span>
                          <span className="truncate">{req.contactNumber}</span>
                        </div>
                      </div>
                    </div>
                    <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
                  </div>
                ))}
              </div>
              </div>
            <div className="mt-4">
              <Button
                variant="default"
                className="w-full bg-[#1B2A4A]/5 text-[#1B2A4A] hover:bg-[#1B2A4A] hover:text-white transition-colors font-medium"
                onClick={() => setCurrentPage("priority-requests")}
              >
                View All Priority Requests
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Peak Booking Months Chart */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-[#1B2A4A]">Peak Booking Months</CardTitle>
                <CardDescription>Monthly booking trends</CardDescription>
              </div>
              <Activity className="h-5 w-5 text-[#D4AD63]" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ChartContainer config={bookingsChartConfig} className="h-[320px] w-full">
              <LineChart
                data={peakBookingMonths}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#D4AD63"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#D4AD63", stroke: "#fff", strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: "#1B2A4A", stroke: "#D4AD63", strokeWidth: 2 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg text-[#1B2A4A]">Recent Activities</CardTitle>
              <CardDescription>Latest actions and updates</CardDescription>
            </div>
            <FileText className="h-5 w-5 text-[#D4AD63]" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
            <div className="max-h-96 overflow-y-auto no-scrollbar">
            <div className="space-y-1">
              {recentActivities.map((activity, index) => {
                const isLast = index === recentActivities.length - 1
                return (
                  <div key={activity.id} className="flex gap-3">
                    {/* Timeline column */}
                    <div className="flex flex-col items-center shrink-0 w-9">
                      <div className="h-9 w-9 rounded-full bg-white border-2 border-[#1B2A4A]/15 flex items-center justify-center shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>
                      {!isLast && (
                        <div className="w-px flex-1 bg-[#1B2A4A]/10 my-1" />
                      )}
                    </div>
                    {/* Content column */}
                    <div className="flex-1 min-w-0 overflow-hidden pb-3">
                      <p className="text-sm font-medium text-[#1B2A4A] truncate">
                        {activity.action}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5 whitespace-nowrap">
                        <span className="font-medium truncate">{activity.user}</span>
                        <span className="text-muted-foreground/40">•</span>
                        <span className="truncate">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
