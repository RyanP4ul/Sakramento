"use client"

import { useState, useMemo } from "react"
import {
  donationRecords,
  type DonationRecord,
  type DonationPurpose,
  type DonationMethod,
} from "@/lib/mock-data"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  ChevronLeft,
  ChevronRight,
  Eye,
  DollarSign,
  Activity,
  Users,
  Heart,
  X,
} from "lucide-react"

const ITEMS_PER_PAGE = 8

const purposeOptions: DonationPurpose[] = [
  "Church Maintenance",
  "Charity",
  "Church Events",
  "Altar Fund",
  "Youth Ministry",
  "General Fund",
]

const methodOptions: DonationMethod[] = ["Cash", "GCash"]

const formatCurrency = (amount: number) =>
  `₱${amount.toLocaleString("en-PH", { minimumFractionDigits: 0 })}`

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr + "T00:00:00")
  return date.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function DonationPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [purposeFilter, setPurposeFilter] = useState<string>("All")
  const [methodFilter, setMethodFilter] = useState<string>("All")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  // Dialog state
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedDonation, setSelectedDonation] = useState<DonationRecord | null>(null)

  // Calculate stats from donation records
  const stats = useMemo(() => {
    const totalDonations = donationRecords.reduce((sum, d) => sum + d.amount, 0)

    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const thisMonth = donationRecords
      .filter((d) => {
        const date = new Date(d.date + "T00:00:00")
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear
      })
      .reduce((sum, d) => sum + d.amount, 0)

    const uniqueDonors = new Set(donationRecords.map((d) => d.donorName)).size

    return { totalDonations, thisMonth, uniqueDonors }
  }, [])

  // Filter donations
  const filteredDonations = useMemo(() => {
    return donationRecords.filter((d: DonationRecord) => {
      const query = searchQuery.toLowerCase()
      const matchesSearch = !query || d.donorName.toLowerCase().includes(query)
      const matchesPurpose = purposeFilter === "All" || d.purpose === purposeFilter
      const matchesMethod = methodFilter === "All" || d.paymentMethod === methodFilter

      let matchesDateFrom = true
      let matchesDateTo = true
      if (dateFrom) {
        matchesDateFrom = d.date >= dateFrom
      }
      if (dateTo) {
        matchesDateTo = d.date <= dateTo
      }

      return matchesSearch && matchesPurpose && matchesMethod && matchesDateFrom && matchesDateTo
    })
  }, [searchQuery, purposeFilter, methodFilter, dateFrom, dateTo])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredDonations.length / ITEMS_PER_PAGE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedDonations = filteredDonations.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  )

  const handleFilterChange = (setter: (val: string) => void) => (val: string) => {
    setter(val)
    setCurrentPage(1)
  }

  const handleClearDates = () => {
    setDateFrom("")
    setDateTo("")
    setCurrentPage(1)
  }

  // View Details
  const handleViewDetails = (donation: DonationRecord) => {
    setSelectedDonation(donation)
    setViewDialogOpen(true)
  }

  const hasActiveDateFilters = dateFrom || dateTo

  const statCards = [
    {
      label: "Total Donations",
      count: formatCurrency(stats.totalDonations),
      icon: DollarSign,
      bgClass: "bg-blue-50 border-blue-200",
      iconClass: "text-blue-600",
      countClass: "text-blue-700",
    },
    {
      label: "This Month",
      count: formatCurrency(stats.thisMonth),
      icon: Activity,
      bgClass: "bg-[#D4AD63]/10 border-[#D4AD63]/25",
      iconClass: "text-[#D4AD63]",
      countClass: "text-[#b8953f]",
    },
    {
      label: "Total Donors",
      count: stats.uniqueDonors,
      icon: Users,
      bgClass: "bg-[#1B2A4A]/5 border-[#1B2A4A]/15",
      iconClass: "text-[#1B2A4A]",
      countClass: "text-[#1B2A4A]",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
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
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by donor name..."
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
                  Purpose:
                </span>
                <Select
                  value={purposeFilter}
                  onValueChange={handleFilterChange(setPurposeFilter)}
                >
                  <SelectTrigger className="w-full sm:w-[170px]">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Purposes</SelectItem>
                    {purposeOptions.map((purpose) => (
                      <SelectItem key={purpose} value={purpose}>
                        {purpose}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                  Payment:
                </span>
                <Select
                  value={methodFilter}
                  onValueChange={handleFilterChange(setMethodFilter)}
                >
                  <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Methods</SelectItem>
                    {methodOptions.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date Filters Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-0">
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
                  className="w-full sm:w-[160px]"
                />
              </div>

              <div className="flex items-center gap-2 flex-1 min-w-0">
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
                  className="w-full sm:w-[160px]"
                />
              </div>

              {hasActiveDateFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearDates}
                  className="gap-1 text-muted-foreground hover:text-foreground shrink-0"
                >
                  <X className="h-3.5 w-3.5" />
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
          <span className="font-medium text-foreground">{filteredDonations.length}</span> donation
          {filteredDonations.length !== 1 ? "s" : ""}
          {filteredDonations.length !== donationRecords.length && (
            <span>
              {" "}
              (filtered from <span className="font-medium text-foreground">{donationRecords.length}</span>)
            </span>
          )}
        </p>
      </div>

      {/* Table */}
      {filteredDonations.length === 0 ? (
        <Card className="py-0 overflow-hidden">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <Heart className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No donations found</h3>
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
                  <TableHead className="text-[#1B2A4A] font-semibold">Donor Name</TableHead>
                  <TableHead className="text-[#1B2A4A] font-semibold">Amount</TableHead>
                  <TableHead className="text-[#1B2A4A] font-semibold">Purpose</TableHead>
                  <TableHead className="text-[#1B2A4A] font-semibold hidden md:table-cell">Payment Method</TableHead>
                  <TableHead className="text-[#1B2A4A] font-semibold hidden sm:table-cell">Date</TableHead>
                  <TableHead className="text-[#1B2A4A] font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedDonations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell className="font-medium text-[#1B2A4A]">
                      {donation.donorName}
                    </TableCell>
                    <TableCell className="font-semibold text-[#1B2A4A]">
                      {formatCurrency(donation.amount)}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs bg-[#1B2A4A]/5 text-[#1B2A4A]/70 px-2 py-1 rounded-md font-medium">
                        {donation.purpose}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden md:table-cell">
                      {donation.paymentMethod}
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden sm:table-cell">
                      {formatDate(donation.date)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-[#1B2A4A] hover:text-[#1B2A4A]/80 hover:bg-[#1B2A4A]/10"
                        onClick={() => handleViewDetails(donation)}
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
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

      {/* View Donation Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#1B2A4A] flex items-center gap-2">
              <Heart className="h-5 w-5 text-[#D4AD63]" />
              Donation Details
            </DialogTitle>
            <DialogDescription>
              Viewing detailed information for the selected donation
            </DialogDescription>
          </DialogHeader>

          {selectedDonation && (
            <div className="space-y-4">
              {/* Header Card */}
              <div className="bg-[#1B2A4A]/5 rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#1B2A4A] text-white text-lg font-bold">
                    {selectedDonation.donorName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-[#1B2A4A]">{selectedDonation.donorName}</h3>
                    <p className="text-xl font-bold text-[#D4AD63] mt-1">
                      {formatCurrency(selectedDonation.amount)}
                    </p>
                    <span className="inline-block mt-2 text-xs bg-[#1B2A4A]/5 text-[#1B2A4A]/70 px-2 py-1 rounded-md font-medium">
                      {selectedDonation.purpose}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Donor Name</p>
                  <p className="font-medium">{selectedDonation.donorName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-medium text-[#D4AD63]">{formatCurrency(selectedDonation.amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Purpose</p>
                  <p className="font-medium">{selectedDonation.purpose}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="font-medium">{selectedDonation.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{formatDate(selectedDonation.date)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Receipt Number</p>
                  <p className="font-medium font-mono">{selectedDonation.receiptNumber}</p>
                </div>
              </div>

              {selectedDonation.notes && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Notes</p>
                    <p className="text-sm bg-muted/30 rounded-md p-3">{selectedDonation.notes}</p>
                  </div>
                </>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setViewDialogOpen(false)
                setSelectedDonation(null)
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
