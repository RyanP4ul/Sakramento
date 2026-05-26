"use client"

import { useState, useMemo } from "react"
import { auditLogs, type AuditLog } from "@/lib/mock-data"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  Shield,
  FileText,
  Calendar,
  Users,
  CheckCircle2,
  Settings,
  UserCog,
  Church,
  Lock,
} from "lucide-react"

const ITEMS_PER_PAGE = 10

const categories = [
  "Authentication",
  "Sacramental Records",
  "Reservations",
  "Reports",
  "Verification",
  "Priest Management",
  "User Management",
  "Settings",
  "Calendar",
] as const

const categoryConfig: Record<string, { bgClass: string; textClass: string; icon: React.ElementType }> = {
  "Authentication": { bgClass: "bg-blue-100", textClass: "text-blue-800", icon: Lock },
  "Sacramental Records": { bgClass: "bg-purple-100", textClass: "text-purple-800", icon: FileText },
  "Reservations": { bgClass: "bg-amber-100", textClass: "text-amber-800", icon: Calendar },
  "Reports": { bgClass: "bg-green-100", textClass: "text-green-800", icon: FileText },
  "Verification": { bgClass: "bg-teal-100", textClass: "text-teal-800", icon: CheckCircle2 },
  "Priest Management": { bgClass: "bg-indigo-100", textClass: "text-indigo-800", icon: Church },
  "User Management": { bgClass: "bg-rose-100", textClass: "text-rose-800", icon: UserCog },
  "Settings": { bgClass: "bg-gray-100", textClass: "text-gray-800", icon: Settings },
  "Calendar": { bgClass: "bg-cyan-100", textClass: "text-cyan-800", icon: Calendar },
  "Priority Requests": { bgClass: "bg-orange-100", textClass: "text-orange-800", icon: Shield },
}

function getUserInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return parts[0].substring(0, 2).toUpperCase()
}

const avatarColors = [
  "bg-[#1B2A4A]",
  "bg-[#D4AD63]",
  "bg-emerald-600",
  "bg-rose-600",
  "bg-violet-600",
  "bg-cyan-600",
  "bg-amber-600",
  "bg-teal-600",
]

function getAvatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

export function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("All")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  // Filter audit logs
  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log: AuditLog) => {
      // Search filter
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        !query ||
        log.user.toLowerCase().includes(query) ||
        log.action.toLowerCase().includes(query) ||
        log.category.toLowerCase().includes(query) ||
        log.details.toLowerCase().includes(query)

      // Category filter
      const matchesCategory = categoryFilter === "All" || log.category === categoryFilter

      // Date range filter
      let matchesDateFrom = true
      let matchesDateTo = true
      if (dateFrom) {
        const logDate = log.timestamp.split(" ")[0]
        matchesDateFrom = logDate >= dateFrom
      }
      if (dateTo) {
        const logDate = log.timestamp.split(" ")[0]
        matchesDateTo = logDate <= dateTo
      }

      return matchesSearch && matchesCategory && matchesDateFrom && matchesDateTo
    })
  }, [searchQuery, categoryFilter, dateFrom, dateTo])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / ITEMS_PER_PAGE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedLogs = filteredLogs.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  )

  // Reset to page 1 when filters change
  const handleFilterChange = (setter: (val: string) => void) => (val: string) => {
    setter(val)
    setCurrentPage(1)
  }

  const handleExport = () => {
    const csvRows = [
      ["Timestamp", "User", "Action", "Category", "Details", "IP Address"].join(","),
      ...filteredLogs.map((log) =>
        [
          log.timestamp,
          `"${log.user}"`,
          `"${log.action}"`,
          `"${log.category}"`,
          `"${log.details}"`,
          log.ip,
        ].join(",")
      ),
    ]
    const csvContent = csvRows.join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `audit-logs-${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1B2A4A]/10">
            <Shield className="h-5 w-5 text-[#1B2A4A]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1B2A4A]">Audit Logs</h1>
            <p className="text-sm text-muted-foreground">Track all system activities and changes</p>
          </div>
        </div>
        <Button
          onClick={handleExport}
          className="bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 text-white gap-2"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Search & Filters */}
      <Card className="py-0 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by user, action, category, or details..."
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                  Category:
                </span>
                <Select
                  value={categoryFilter}
                  onValueChange={handleFilterChange(setCategoryFilter)}
                >
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                  From:
                </span>
                <Input
                  type="date"
                  className="w-full sm:w-[160px]"
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.target.value)
                    setCurrentPage(1)
                  }}
                />
              </div>

              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                  To:
                </span>
                <Input
                  type="date"
                  className="w-full sm:w-[160px]"
                  value={dateTo}
                  onChange={(e) => {
                    setDateTo(e.target.value)
                    setCurrentPage(1)
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">{filteredLogs.length}</span>{" "}
          log{filteredLogs.length !== 1 ? "s" : ""}
          {filteredLogs.length !== auditLogs.length && (
            <span>
              {" "}
              (filtered from{" "}
              <span className="font-medium text-foreground">{auditLogs.length}</span>)
            </span>
          )}
        </p>
      </div>

      {/* Table */}
      {filteredLogs.length === 0 ? (
        <Card className="py-0 overflow-hidden">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <Shield className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No audit logs found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search or filter criteria.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="py-0 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#1B2A4A]/5 hover:bg-[#1B2A4A]/5">
                  <TableHead className="font-semibold text-[#1B2A4A]">Timestamp</TableHead>
                  <TableHead className="font-semibold text-[#1B2A4A]">User</TableHead>
                  <TableHead className="font-semibold text-[#1B2A4A]">Action</TableHead>
                  <TableHead className="font-semibold text-[#1B2A4A]">Category</TableHead>
                  <TableHead className="font-semibold text-[#1B2A4A] min-w-[200px]">Details</TableHead>
                  <TableHead className="font-semibold text-[#1B2A4A]">IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLogs.map((log) => {
                  const catConfig = categoryConfig[log.category] || {
                    bgClass: "bg-gray-100",
                    textClass: "text-gray-800",
                    icon: FileText,
                  }
                  const CatIcon = catConfig.icon

                  return (
                    <TableRow key={log.id} className="hover:bg-[#1B2A4A]/3 transition-colors">
                      <TableCell className="text-sm whitespace-nowrap text-muted-foreground">
                        {log.timestamp}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white text-xs font-semibold ${getAvatarColor(log.user)}`}
                          >
                            {getUserInitials(log.user)}
                          </div>
                          <span className="text-sm font-medium text-foreground whitespace-nowrap">
                            {log.user}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-medium text-foreground whitespace-nowrap">
                        {log.action}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${catConfig.bgClass} ${catConfig.textClass} border-0 text-xs font-medium gap-1`}
                        >
                          <CatIcon className="h-3 w-3" />
                          {log.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[300px] truncate">
                        {log.details}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground font-mono whitespace-nowrap">
                        {log.ip}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
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
    </div>
  )
}
