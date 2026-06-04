"use client"

import { useState, useMemo } from "react"
import {
  paymentRecords,
  type PaymentRecord,
  type PaymentStatus,
  type PaymentMethodType,
} from "@/lib/mock-data"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  Search,
  DollarSign,
  Clock,
  Receipt,
  ChevronLeft,
  ChevronRight,
  Eye,
  XCircle,
  Wallet,
  CreditCard,
  CalendarDays,
  User,
  FileText,
} from "lucide-react"

const ITEMS_PER_PAGE = 8

const statusConfig: Record<
  PaymentStatus,
  { label: string; bgClass: string; textClass: string }
> = {
  Paid: {
    label: "Paid",
    bgClass: "bg-green-100",
    textClass: "text-green-800",
  },
  Partial: {
    label: "Partial",
    bgClass: "bg-blue-100",
    textClass: "text-blue-800",
  },
  Pending: {
    label: "Pending",
    bgClass: "bg-yellow-100",
    textClass: "text-yellow-800",
  },
  Waived: {
    label: "Waived",
    bgClass: "bg-gray-100",
    textClass: "text-gray-600",
  },
}

const statusFilterOptions: ("All" | PaymentStatus)[] = [
  "All",
  "Paid",
  "Partial",
  "Pending",
  "Waived",
]

const methodFilterOptions: ("All" | PaymentMethodType)[] = [
  "All",
  "Cash",
  "GCash",
]

function formatCurrency(amount: number): string {
  return `₱${amount.toLocaleString("en-PH")}`
}

export function PaymentPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [serviceFilter, setServiceFilter] = useState<string>("All")
  const [methodFilter, setMethodFilter] = useState<string>("All")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  // Dialog state
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<PaymentRecord | null>(null)

  // Only Baptism and Wedding
  const allowedServiceTypes = ["Baptism", "Wedding"]

  // Filtered base records (only Baptism & Wedding)
  const baptismWeddingRecords = useMemo(() => {
    return paymentRecords.filter((r) => allowedServiceTypes.includes(r.serviceType))
  }, [])

  // Calculate stats
  const stats = useMemo(() => {
    const totalRevenue = baptismWeddingRecords
      .filter((r) => r.status === "Paid")
      .reduce((sum, r) => sum + r.amount, 0)
    const totalPending = baptismWeddingRecords.filter(
      (r) => r.status === "Pending"
    ).length
    const totalTransactions = baptismWeddingRecords.length
    return { totalRevenue, totalPending, totalTransactions }
  }, [baptismWeddingRecords])

  // Filter records
  const filteredRecords = useMemo(() => {
    return baptismWeddingRecords.filter((r: PaymentRecord) => {
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        !query ||
        r.requester.toLowerCase().includes(query) ||
        (r.receiptNumber && r.receiptNumber.toLowerCase().includes(query))

      const matchesStatus = statusFilter === "All" || r.status === statusFilter
      const matchesService =
        serviceFilter === "All" || r.serviceType === serviceFilter
      const matchesMethod =
        methodFilter === "All" || r.paymentMethod === methodFilter

      const recordDate = new Date(r.date)
      const matchesDateFrom =
        !dateFrom || recordDate >= new Date(dateFrom)
      const matchesDateTo =
        !dateTo || recordDate <= new Date(dateTo + "T23:59:59")

      return (
        matchesSearch &&
        matchesStatus &&
        matchesService &&
        matchesMethod &&
        matchesDateFrom &&
        matchesDateTo
      )
    })
  }, [baptismWeddingRecords, searchQuery, statusFilter, serviceFilter, methodFilter, dateFrom, dateTo])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / ITEMS_PER_PAGE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedRecords = filteredRecords.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  )

  const handleFilterChange =
    (setter: (val: string) => void) => (val: string) => {
      setter(val)
      setCurrentPage(1)
    }

  const handleViewDetails = (record: PaymentRecord) => {
    setSelectedRecord(record)
    setViewDialogOpen(true)
  }

  const statCards = [
    {
      label: "Total Revenue",
      count: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      bgClass: "bg-green-50 border-green-200",
      iconClass: "text-green-600",
      countClass: "text-green-700",
    },
    {
      label: "Total Pending Payments",
      count: stats.totalPending,
      icon: Clock,
      bgClass: "bg-yellow-50 border-yellow-200",
      iconClass: "text-yellow-600",
      countClass: "text-yellow-700",
    },
    {
      label: "Total Transactions",
      count: stats.totalTransactions,
      icon: Receipt,
      bgClass: "bg-[#1B2A4A]/5 border-[#1B2A4A]/20",
      iconClass: "text-[#1B2A4A]",
      countClass: "text-[#1B2A4A]",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.label}
              className={`${stat.bgClass} border py-0 overflow-hidden`}
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
                    {stat.count}
                  </p>
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
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by payer name or reference #..."
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                  Service:
                </span>
                <Select
                  value={serviceFilter}
                  onValueChange={handleFilterChange(setServiceFilter)}
                >
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Services</SelectItem>
                    {allowedServiceTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
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
                  <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusFilterOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status === "All" ? "All Statuses" : status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                  Method:
                </span>
                <Select
                  value={methodFilter}
                  onValueChange={handleFilterChange(setMethodFilter)}
                >
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    {methodFilterOptions.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method === "All" ? "All Methods" : method}
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

              {(dateFrom || dateTo) && (
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
          <span className="font-medium text-foreground">
            {filteredRecords.length}
          </span>{" "}
          transaction{filteredRecords.length !== 1 ? "s" : ""}
          {filteredRecords.length !== baptismWeddingRecords.length && (
            <span>
              {" "}
              (filtered from{" "}
              <span className="font-medium text-foreground">
                {baptismWeddingRecords.length}
              </span>
              )
            </span>
          )}
        </p>
      </div>

      {/* Table */}
      {filteredRecords.length === 0 ? (
        <Card className="py-0 overflow-hidden">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <Receipt className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-semibold text-foreground">
              No payment records found
            </h3>
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
                  <TableHead className="text-[#1B2A4A] font-semibold">
                    Reference #
                  </TableHead>
                  <TableHead className="text-[#1B2A4A] font-semibold">
                    Payer
                  </TableHead>
                  <TableHead className="text-[#1B2A4A] font-semibold">
                    Service
                  </TableHead>
                  <TableHead className="text-[#1B2A4A] font-semibold">
                    Amount
                  </TableHead>
                  <TableHead className="text-[#1B2A4A] font-semibold">
                    Date
                  </TableHead>
                  <TableHead className="text-[#1B2A4A] font-semibold">
                    Method
                  </TableHead>
                  <TableHead className="text-[#1B2A4A] font-semibold">
                    Status
                  </TableHead>
                  <TableHead className="text-[#1B2A4A] font-semibold">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRecords.map((record) => {
                  const statusCfg = statusConfig[record.status]
                  return (
                    <TableRow key={record.id}>
                      <TableCell className="font-mono text-xs font-medium text-[#1B2A4A]">
                        {record.receiptNumber || "N/A"}
                      </TableCell>
                      <TableCell className="font-medium">
                        {record.requester}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className="bg-[#1B2A4A]/5 text-[#1B2A4A]/70 border-0 text-xs font-medium hover:bg-[#1B2A4A]/10"
                        >
                          {record.serviceType}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-[#1B2A4A]">
                        {formatCurrency(record.amount)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {record.date}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {record.paymentMethod || "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${statusCfg.bgClass} ${statusCfg.textClass} border-0 text-xs font-medium`}
                        >
                          {statusCfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-[#1B2A4A] hover:text-[#1B2A4A]/80 hover:bg-[#1B2A4A]/10"
                          onClick={() => handleViewDetails(record)}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
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
            <span className="font-medium text-foreground">
              {safeCurrentPage}
            </span>{" "}
            of{" "}
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

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => (
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
              )
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={safeCurrentPage >= totalPages}
              className="gap-1"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#1B2A4A] flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-[#D4AD63]" />
              Payment Details
            </DialogTitle>
            <DialogDescription>
              Viewing details for the selected payment record
            </DialogDescription>
          </DialogHeader>

          {selectedRecord && (
            <div className="space-y-4">
              {/* Header Summary */}
              <div className="bg-[#1B2A4A]/5 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#1B2A4A]">
                      {selectedRecord.requester}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {selectedRecord.serviceType}
                    </p>
                  </div>
                  <Badge
                    className={`${statusConfig[selectedRecord.status].bgClass} ${statusConfig[selectedRecord.status].textClass} border-0 text-sm font-medium px-3 py-1`}
                  >
                    {selectedRecord.status}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Detail Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5" />
                    Reference #
                  </p>
                  <p className="font-mono font-medium text-[#1B2A4A]">
                    {selectedRecord.receiptNumber || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    Payer
                  </p>
                  <p className="font-medium">{selectedRecord.requester}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Receipt className="h-3.5 w-3.5" />
                    Service
                  </p>
                  <p className="font-medium">{selectedRecord.serviceType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5" />
                    Amount
                  </p>
                  <p className="font-bold text-[#1B2A4A]">
                    {formatCurrency(selectedRecord.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Date
                  </p>
                  <p className="font-medium">{selectedRecord.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <CreditCard className="h-3.5 w-3.5" />
                    Payment Method
                  </p>
                  <p className="font-medium">
                    {selectedRecord.paymentMethod || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Wallet className="h-3.5 w-3.5" />
                    Status
                  </p>
                  <Badge
                    className={`${statusConfig[selectedRecord.status].bgClass} ${statusConfig[selectedRecord.status].textClass} border-0 text-xs font-medium`}
                  >
                    {selectedRecord.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5" />
                    Reservation ID
                  </p>
                  <p className="font-medium">#{selectedRecord.reservationId}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setViewDialogOpen(false)
                setSelectedRecord(null)
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
