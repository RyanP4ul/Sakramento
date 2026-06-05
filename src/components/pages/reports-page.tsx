"use client"

import { useState, useMemo } from "react"
import {
  generatedReports,
  type GeneratedReport,
  paymentRecords,
  incomeSummary,
  serviceFees,
  donationRecords,
  type DonationRecord,
  type DonationMethod,
} from "@/lib/mock-data"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  FileText,
  Download,
  CalendarDays,
  BarChart3,
  Search,
  Printer,
  DollarSign,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Receipt,
  Heart,
  Activity,
  Users,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react"

// ============ CONSTANTS & CONFIGS ============

const ITEMS_PER_PAGE = 8

// Payment status badge config
const paymentStatusConfig: Record<string, { bg: string; text: string; icon: typeof CheckCircle2 }> = {
  Paid: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", icon: CheckCircle2 },
  Partial: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", icon: Clock },
  Pending: { bg: "bg-red-50 border-red-200", text: "text-red-700", icon: AlertCircle },
  Waived: { bg: "bg-gray-50 border-gray-200", text: "text-gray-600", icon: XCircle },
}

// Format badge color mapping
function getFormatBadge(format: string) {
  switch (format) {
    case "PDF": return "bg-red-100 text-red-700 border-red-200"
    case "Excel": return "bg-green-100 text-green-700 border-green-200"
    case "CSV": return "bg-sky-100 text-sky-700 border-sky-200"
    default: return "bg-gray-100 text-gray-700 border-gray-200"
  }
}

// Type badge color mapping
function getTypeBadge(type: string) {
  switch (type) {
    case "Sacraments": return "bg-[#1B2A4A]/10 text-[#1B2A4A] border-[#1B2A4A]/20"
    case "Reservations": return "bg-[#D4AD63]/10 text-[#D4AD63] border-[#D4AD63]/20"
    case "Financial": return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case "Statistics": return "bg-purple-50 text-purple-700 border-purple-200"
    default: return "bg-gray-100 text-gray-700 border-gray-200"
  }
}

// Donation method color mapping
function getMethodBadge(method: string) {
  switch (method) {
    case "Cash": return "bg-emerald-50 text-emerald-700"
    case "GCash": return "bg-blue-50 text-blue-700"
    default: return "bg-gray-100 text-gray-700"
  }
}

// Format currency
const formatCurrency = (amount: number) =>
  `₱${amount.toLocaleString("en-PH", { minimumFractionDigits: 0 })}`

// Format date
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr + "T00:00:00")
  return date.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Income stat cards
const incomeStatCards = [
  { label: "Today", amount: incomeSummary.today, icon: DollarSign, bgClass: "bg-emerald-50 border-emerald-200", iconClass: "text-emerald-600", amountClass: "text-emerald-700" },
  { label: "This Week", amount: incomeSummary.thisWeek, icon: TrendingUp, bgClass: "bg-blue-50 border-blue-200", iconClass: "text-blue-600", amountClass: "text-blue-700" },
  { label: "This Month", amount: incomeSummary.thisMonth, icon: BarChart3, bgClass: "bg-[#D4AD63]/10 border-[#D4AD63]/30", iconClass: "text-[#D4AD63]", amountClass: "text-[#B8960E]" },
  { label: "This Year", amount: incomeSummary.thisYear, icon: CreditCard, bgClass: "bg-[#1B2A4A]/5 border-[#1B2A4A]/15", iconClass: "text-[#1B2A4A]", amountClass: "text-[#1B2A4A]" },
]

// Summary of Payments & Incomes — period-based data
type SummaryPeriod = "year" | "month" | "week" | "day"

interface SummaryRow {
  label: string
  paid: number
  partial: number
  pending: number
  waived: number
  totalAmount: number
  count: number
}

const summaryDataByPeriod: Record<SummaryPeriod, SummaryRow[]> = {
  year: [
    { label: "2025", paid: 245000, partial: 15000, pending: 10000, waived: 0, totalAmount: 275000, count: 434 },
    { label: "2024", paid: 230000, partial: 12000, pending: 8000, waived: 0, totalAmount: 258000, count: 410 },
    { label: "2023", paid: 198000, partial: 10000, pending: 5000, waived: 0, totalAmount: 218000, count: 380 },
  ],
  month: [
    { label: "January", paid: 20000, partial: 1000, pending: 1000, waived: 0, totalAmount: 22000, count: 35 },
    { label: "February", paid: 17500, partial: 1000, pending: 1000, waived: 0, totalAmount: 19500, count: 30 },
    { label: "March", paid: 35000, partial: 3000, pending: 2250, waived: 0, totalAmount: 40250, count: 62 },
    { label: "April", paid: 20500, partial: 1500, pending: 1500, waived: 0, totalAmount: 23500, count: 38 },
    { label: "May", paid: 25000, partial: 1500, pending: 1500, waived: 0, totalAmount: 28000, count: 42 },
    { label: "June", paid: 29000, partial: 1500, pending: 1500, waived: 0, totalAmount: 32000, count: 48 },
  ],
  week: [
    { label: "Mar 10–16", paid: 8500, partial: 2000, pending: 1000, waived: 0, totalAmount: 11500, count: 18 },
    { label: "Mar 17–23", paid: 9200, partial: 1500, pending: 2000, waived: 0, totalAmount: 12700, count: 20 },
    { label: "Mar 24–30", paid: 7800, partial: 2500, pending: 500, waived: 0, totalAmount: 10800, count: 16 },
    { label: "Mar 31–Apr 6", paid: 6300, partial: 1000, pending: 1500, waived: 0, totalAmount: 8800, count: 14 },
  ],
  day: [
    { label: "Mar 15", paid: 2500, partial: 0, pending: 0, waived: 0, totalAmount: 2500, count: 4 },
    { label: "Mar 16", paid: 0, partial: 0, pending: 0, waived: 0, totalAmount: 0, count: 2 },
    { label: "Mar 17", paid: 1500, partial: 500, pending: 1000, waived: 0, totalAmount: 3000, count: 5 },
    { label: "Mar 18", paid: 0, partial: 0, pending: 0, waived: 0, totalAmount: 0, count: 1 },
    { label: "Mar 19", paid: 2000, partial: 1000, pending: 0, waived: 0, totalAmount: 3000, count: 3 },
    { label: "Mar 20", paid: 0, partial: 0, pending: 50, waived: 0, totalAmount: 50, count: 2 },
    { label: "Mar 21", paid: 1000, partial: 0, pending: 0, waived: 0, totalAmount: 1000, count: 1 },
  ],
}

const periodTabs: { value: SummaryPeriod; label: string }[] = [
  { value: "year", label: "Year" },
  { value: "month", label: "Month" },
  { value: "week", label: "Week" },
  { value: "day", label: "Day" },
]

const methodOptions: DonationMethod[] = ["Cash", "GCash"]

// ============ MAIN COMPONENT ============

export function ReportsPage() {
  // Financial Reports State
  const [finDateFrom, setFinDateFrom] = useState("")
  const [finDateTo, setFinDateTo] = useState("")

  // Recent Reports Search
  const [searchQuery, setSearchQuery] = useState("")

  // Summary Period Tab
  const [summaryPeriod, setSummaryPeriod] = useState<SummaryPeriod>("month")

  // ---- Donation State ----
  const [donSearchQuery, setDonSearchQuery] = useState("")
  const [donMethodFilter, setDonMethodFilter] = useState<string>("All")
  const [donDateFrom, setDonDateFrom] = useState("")
  const [donDateTo, setDonDateTo] = useState("")
  const [donCurrentPage, setDonCurrentPage] = useState(1)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedDonation, setSelectedDonation] = useState<DonationRecord | null>(null)

  // Filtered recent reports
  const filteredReports = generatedReports.filter((report) => {
    const query = searchQuery.toLowerCase()
    if (!query) return true
    return (
      report.title.toLowerCase().includes(query) ||
      report.type.toLowerCase().includes(query) ||
      report.generatedBy.toLowerCase().includes(query)
    )
  })

  // Filtered payment records
  const filteredPayments = paymentRecords.filter((p) => {
    if (!finDateFrom && !finDateTo) return true
    const d = new Date(p.date)
    const from = finDateFrom ? new Date(finDateFrom) : null
    const to = finDateTo ? new Date(finDateTo) : null
    if (from && d < from) return false
    if (to && d > to) return false
    return true
  })

  // Compute totals from filtered payments
  const totalPaid = filteredPayments.filter((p) => p.status === "Paid").reduce((sum, p) => sum + p.amount, 0)
  const totalPartial = filteredPayments.filter((p) => p.status === "Partial").reduce((sum, p) => sum + p.amount, 0)
  const totalPending = filteredPayments.filter((p) => p.status === "Pending").reduce((sum, p) => sum + p.amount, 0)
  const totalWaived = filteredPayments.filter((p) => p.status === "Waived").reduce((sum, p) => sum + p.amount, 0)

  // ---- Donation computations ----
  const donationStats = useMemo(() => {
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

  const filteredDonations = useMemo(() => {
    return donationRecords.filter((d: DonationRecord) => {
      const query = donSearchQuery.toLowerCase()
      const matchesSearch = !query || d.donorName.toLowerCase().includes(query)
      const matchesMethod = donMethodFilter === "All" || d.paymentMethod === donMethodFilter
      let matchesDateFrom = true
      let matchesDateTo = true
      if (donDateFrom) matchesDateFrom = d.date >= donDateFrom
      if (donDateTo) matchesDateTo = d.date <= donDateTo
      return matchesSearch && matchesMethod && matchesDateFrom && matchesDateTo
    })
  }, [donSearchQuery, donMethodFilter, donDateFrom, donDateTo])

  const donTotalPages = Math.max(1, Math.ceil(filteredDonations.length / ITEMS_PER_PAGE))
  const donSafePage = Math.min(donCurrentPage, donTotalPages)
  const paginatedDonations = filteredDonations.slice(
    (donSafePage - 1) * ITEMS_PER_PAGE,
    donSafePage * ITEMS_PER_PAGE
  )

  const donFilterChange = (setter: (val: string) => void) => (val: string) => {
    setter(val)
    setDonCurrentPage(1)
  }

  const donClearDates = () => {
    setDonDateFrom("")
    setDonDateTo("")
    setDonCurrentPage(1)
  }

  const hasActiveDonDateFilters = donDateFrom || donDateTo

  const handleViewDetails = (donation: DonationRecord) => {
    setSelectedDonation(donation)
    setViewDialogOpen(true)
  }

  const donationStatCards = [
    {
      label: "Total Donations",
      value: formatCurrency(donationStats.totalDonations),
      icon: DollarSign,
      bgClass: "bg-blue-50 border-blue-200",
      iconClass: "text-blue-600",
      valueClass: "text-blue-700",
    },
    {
      label: "This Month",
      value: formatCurrency(donationStats.thisMonth),
      icon: Activity,
      bgClass: "bg-[#D4AD63]/10 border-[#D4AD63]/25",
      iconClass: "text-[#D4AD63]",
      valueClass: "text-[#b8953f]",
    },
    {
      label: "Total Donors",
      value: donationStats.uniqueDonors.toString(),
      icon: Users,
      bgClass: "bg-[#1B2A4A]/5 border-[#1B2A4A]/15",
      iconClass: "text-[#1B2A4A]",
      valueClass: "text-[#1B2A4A]",
    },
  ]

  // ============ EXPORT HELPERS ============

  const handleExportFinancial = () => {
    const headers = ["Receipt #", "Requester", "Service Type", "Date", "Amount", "Status", "Payment Method"]
    const rows = filteredPayments.map((p) => [
      p.receiptNumber || "N/A",
      `"${p.requester}"`,
      p.serviceType,
      p.date,
      p.amount.toString(),
      p.status,
      p.paymentMethod || "N/A",
    ])
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    downloadCSV(csvContent, "financial-report")
  }

  const handleExportIncomeSummary = () => {
    const headers = ["Service", "Total Amount", "Count"]
    const rows = incomeSummary.serviceBreakdown.map((s) => [
      `"${s.service}"`,
      s.amount.toString(),
      s.count.toString(),
    ])
    const totalRow = ["TOTAL", incomeSummary.serviceBreakdown.reduce((s, b) => s + b.amount, 0).toString(), incomeSummary.serviceBreakdown.reduce((s, b) => s + b.count, 0).toString()]
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(",")), totalRow.join(",")].join("\n")
    downloadCSV(csvContent, "income-summary")
  }

  const handleExportDonations = () => {
    const headers = ["Donor Name", "Amount", "Payment Method", "Date", "Receipt #"]
    const rows = filteredDonations.map((d) => [
      `"${d.donorName}"`,
      d.amount.toString(),
      d.paymentMethod,
      d.date,
      d.receiptNumber,
    ])
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    downloadCSV(csvContent, "donations-report")
  }

  const handleDownload = (report: GeneratedReport) => {
    const csvRows = [
      ["Title", "Type", "Date Generated", "Generated By", "Format", "Size"].join(","),
      [`"${report.title}"`, `"${report.type}"`, report.dateGenerated, `"${report.generatedBy}"`, report.format, `"${report.size}"`].join(","),
    ]
    downloadCSV(csvRows.join("\n"), report.title.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase())
  }

  function downloadCSV(content: string, filename: string) {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `${filename}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handlePrintFinancial = () => {
    const printContent = `
      <html><head><title>Financial Summary - Saint Peter the Apostle Parish</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; color: #1B2A4A; }
        h1 { font-size: 20px; margin-bottom: 4px; }
        h2 { font-size: 14px; color: #666; font-weight: normal; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { padding: 8px 12px; border: 1px solid #ddd; text-align: left; font-size: 13px; }
        th { background: #1B2A4A; color: white; }
        .total-row { font-weight: bold; background: #f5f5f5; }
        .footer { margin-top: 30px; font-size: 11px; color: #999; }
      </style></head><body>
      <h1>Saint Peter the Apostle Parish</h1>
      <h2>Financial Summary Report ${finDateFrom || finDateTo ? `(${finDateFrom || 'Start'} to ${finDateTo || 'End'})` : ''}</h2>
      <table>
        <tr><th>Status</th><th>Count</th><th>Amount</th></tr>
        <tr><td>Paid</td><td>${filteredPayments.filter(p => p.status === "Paid").length}</td><td>PHP ${totalPaid.toLocaleString()}</td></tr>
        <tr><td>Partial</td><td>${filteredPayments.filter(p => p.status === "Partial").length}</td><td>PHP ${totalPartial.toLocaleString()}</td></tr>
        <tr><td>Pending</td><td>${filteredPayments.filter(p => p.status === "Pending").length}</td><td>PHP ${totalPending.toLocaleString()}</td></tr>
        <tr><td>Waived</td><td>${filteredPayments.filter(p => p.status === "Waived").length}</td><td>PHP ${totalWaived.toLocaleString()}</td></tr>
        <tr class="total-row"><td>Total</td><td>${filteredPayments.length}</td><td>PHP ${(totalPaid + totalPartial + totalPending + totalWaived).toLocaleString()}</td></tr>
      </table>
      <h3 style="font-size:14px; margin-top:20px;">Income by Service</h3>
      <table>
        <tr><th>Service</th><th>Total Amount</th><th>Count</th></tr>
        ${incomeSummary.serviceBreakdown.map(s => `<tr><td>${s.service}</td><td>PHP ${s.amount.toLocaleString()}</td><td>${s.count}</td></tr>`).join('')}
        <tr class="total-row"><td>Total</td><td>PHP ${incomeSummary.serviceBreakdown.reduce((s,b) => s+b.amount, 0).toLocaleString()}</td><td>${incomeSummary.serviceBreakdown.reduce((s,b) => s+b.count, 0)}</td></tr>
      </table>
      <p class="footer">Generated on ${new Date().toLocaleDateString()} | Saint Peter the Apostle Parish Management System</p>
      </body></html>
    `
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.print()
    }
  }

  // ============ RENDER ============

  return (
    <div className="space-y-6">
      {/* Income Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {incomeStatCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className={`${stat.bgClass} border py-0 overflow-hidden`}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/70">
                  <Icon className={`h-5 w-5 ${stat.iconClass}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground truncate">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.amountClass}`}>
                    ₱{stat.amount.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Summary of Payments & Incomes */}
      <Card className="py-0 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b bg-[#FAFAF9] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 rounded-lg bg-[#1B2A4A]/10 flex items-center justify-center">
              <Receipt className="h-5 w-5 text-[#1B2A4A]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#1B2A4A]">Summary of Payments & Incomes</h3>
              <p className="text-sm text-muted-foreground">Breakdown by period</p>
            </div>
          </div>
          {/* Period Tabs */}
          <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
            {periodTabs.map((tab) => {
              const isActive = summaryPeriod === tab.value
              return (
                <button
                  key={tab.value}
                  onClick={() => setSummaryPeriod(tab.value)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#1B2A4A] text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/60"
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
        <CardContent className="p-0">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#1B2A4A]/5 hover:bg-[#1B2A4A]/5">
                  <TableHead className="text-[#1B2A4A] font-semibold">
                    {summaryPeriod === "year" ? "Year" : summaryPeriod === "month" ? "Month" : summaryPeriod === "week" ? "Week" : "Date"}
                  </TableHead>
                  <TableHead className="text-[#1B2A4A] font-semibold text-right">Paid</TableHead>
                  <TableHead className="text-[#1B2A4A] font-semibold text-right">Partial</TableHead>
                  <TableHead className="text-[#1B2A4A] font-semibold text-right">Pending</TableHead>
                  <TableHead className="text-[#1B2A4A] font-semibold text-right">Waived</TableHead>
                  <TableHead className="text-[#1B2A4A] font-semibold text-right">Total Income</TableHead>
                  <TableHead className="text-[#1B2A4A] font-semibold text-center">Transactions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summaryDataByPeriod[summaryPeriod].map((row) => (
                  <TableRow key={row.label}>
                    <TableCell className="font-medium text-[#1B2A4A]">{row.label}</TableCell>
                    <TableCell className="text-right">
                      <span className={row.paid > 0 ? "text-emerald-700 font-medium" : "text-muted-foreground"}>
                        {row.paid > 0 ? `₱${row.paid.toLocaleString()}` : "—"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={row.partial > 0 ? "text-amber-700 font-medium" : "text-muted-foreground"}>
                        {row.partial > 0 ? `₱${row.partial.toLocaleString()}` : "—"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={row.pending > 0 ? "text-red-700 font-medium" : "text-muted-foreground"}>
                        {row.pending > 0 ? `₱${row.pending.toLocaleString()}` : "—"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-muted-foreground">
                        {row.waived > 0 ? `₱${row.waived.toLocaleString()}` : "—"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-bold text-[#1B2A4A]">
                        {row.totalAmount > 0 ? `₱${row.totalAmount.toLocaleString()}` : "—"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-[#1B2A4A]/10 text-[#1B2A4A] border-0 text-xs font-medium">
                        {row.count}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {/* Total Row */}
                <TableRow className="bg-[#1B2A4A]/5 hover:bg-[#1B2A4A]/5 font-semibold">
                  {(() => {
                    const data = summaryDataByPeriod[summaryPeriod]
                    const tPaid = data.reduce((s, r) => s + r.paid, 0)
                    const tPartial = data.reduce((s, r) => s + r.partial, 0)
                    const tPending = data.reduce((s, r) => s + r.pending, 0)
                    const tWaived = data.reduce((s, r) => s + r.waived, 0)
                    const grandTotal = data.reduce((s, r) => s + r.totalAmount, 0)
                    const totalCount = data.reduce((s, r) => s + r.count, 0)
                    return (
                      <>
                        <TableCell className="font-bold text-[#1B2A4A]">Total</TableCell>
                        <TableCell className="text-right font-bold text-emerald-700">₱{tPaid.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-bold text-amber-700">₱{tPartial.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-bold text-red-700">₱{tPending.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {tWaived > 0 ? `₱${tWaived.toLocaleString()}` : "—"}
                        </TableCell>
                        <TableCell className="text-right font-bold text-[#1B2A4A]">₱{grandTotal.toLocaleString()}</TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-[#1B2A4A] text-white border-0 text-xs font-bold">
                            {totalCount}
                          </Badge>
                        </TableCell>
                      </>
                    )
                  })()}
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card-based List */}
          <div className="md:hidden p-4 space-y-3">
            {summaryDataByPeriod[summaryPeriod].map((row) => (
              <div key={row.label} className="rounded-lg border p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-[#1B2A4A] text-sm">{row.label}</p>
                  <Badge className="bg-[#1B2A4A]/10 text-[#1B2A4A] border-0 text-xs font-medium">
                    {row.count} txn{row.count !== 1 ? "s" : ""}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center justify-between rounded-md bg-emerald-50 px-2 py-1.5">
                    <span className="text-emerald-700">Paid</span>
                    <span className="font-medium text-emerald-700">{row.paid > 0 ? `₱${row.paid.toLocaleString()}` : "—"}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-md bg-amber-50 px-2 py-1.5">
                    <span className="text-amber-700">Partial</span>
                    <span className="font-medium text-amber-700">{row.partial > 0 ? `₱${row.partial.toLocaleString()}` : "—"}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-md bg-red-50 px-2 py-1.5">
                    <span className="text-red-700">Pending</span>
                    <span className="font-medium text-red-700">{row.pending > 0 ? `₱${row.pending.toLocaleString()}` : "—"}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-md bg-[#1B2A4A]/5 px-2 py-1.5">
                    <span className="text-[#1B2A4A] font-semibold">Total</span>
                    <span className="font-bold text-[#1B2A4A]">{row.totalAmount > 0 ? `₱${row.totalAmount.toLocaleString()}` : "—"}</span>
                  </div>
                </div>
              </div>
            ))}
            {(() => {
              const data = summaryDataByPeriod[summaryPeriod]
              const grandTotal = data.reduce((s, r) => s + r.totalAmount, 0)
              const totalCount = data.reduce((s, r) => s + r.count, 0)
              const tPaid = data.reduce((s, r) => s + r.paid, 0)
              const tPartial = data.reduce((s, r) => s + r.partial, 0)
              const tPending = data.reduce((s, r) => s + r.pending, 0)
              return (
                <div className="rounded-lg border-2 border-[#1B2A4A]/20 bg-[#1B2A4A]/5 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-[#1B2A4A]">Grand Total</p>
                    <Badge className="bg-[#1B2A4A] text-white border-0 text-xs font-bold">
                      {totalCount} txn{totalCount !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center justify-between rounded-md bg-emerald-50 px-2 py-1.5">
                      <span className="text-emerald-700">Paid</span>
                      <span className="font-bold text-emerald-700">₱{tPaid.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-md bg-amber-50 px-2 py-1.5">
                      <span className="text-amber-700">Partial</span>
                      <span className="font-bold text-amber-700">₱{tPartial.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-md bg-red-50 px-2 py-1.5">
                      <span className="text-red-700">Pending</span>
                      <span className="font-bold text-red-700">₱{tPending.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-md bg-white px-2 py-1.5">
                      <span className="text-[#1B2A4A] font-semibold">Total</span>
                      <span className="font-bold text-[#1B2A4A]">₱{grandTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
        </CardContent>
      </Card>

      {/* ===== DONATIONS SECTION ===== */}
      <Card className="py-0 overflow-hidden">
        <div className="flex items-center gap-3 border-b bg-[#FAFAF9] px-6 py-4">
          <div className="h-10 w-10 shrink-0 rounded-lg bg-rose-100 flex items-center justify-center">
            <Heart className="h-5 w-5 text-rose-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#1B2A4A]">Donations</h3>
            <p className="text-sm text-muted-foreground">Track and manage all donations</p>
          </div>
        </div>
        <CardContent className="p-4 space-y-4">
          {/* Donation Stat Cards */}
          <div className="grid grid-cols-3 gap-4">
            {donationStatCards.map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.label} className={`${stat.bgClass} border py-0 overflow-hidden`}>
                  <CardContent className="p-3 flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/70">
                      <Icon className={`h-4 w-4 ${stat.iconClass}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
                      <p className={`text-lg font-bold ${stat.valueClass}`}>{stat.value}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by donor name..."
                className="pl-9 w-full"
                value={donSearchQuery}
                onChange={(e) => {
                  setDonSearchQuery(e.target.value)
                  setDonCurrentPage(1)
                }}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Payment:</span>
                <Select value={donMethodFilter} onValueChange={donFilterChange(setDonMethodFilter)}>
                  <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Methods</SelectItem>
                    {methodOptions.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">From:</span>
                <Input
                  type="date"
                  value={donDateFrom}
                  onChange={(e) => { setDonDateFrom(e.target.value); setDonCurrentPage(1) }}
                  className="w-full sm:w-[160px]"
                />
              </div>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">To:</span>
                <Input
                  type="date"
                  value={donDateTo}
                  onChange={(e) => { setDonDateTo(e.target.value); setDonCurrentPage(1) }}
                  className="w-full sm:w-[160px]"
                />
              </div>
              {hasActiveDonDateFilters && (
                <Button variant="outline" size="sm" onClick={donClearDates} className="gap-1 text-muted-foreground hover:text-foreground shrink-0">
                  <X className="h-3.5 w-3.5" />
                  Clear dates
                </Button>
              )}
            </div>
          </div>

          {/* Results Count + Export */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filteredDonations.length}</span> donation{filteredDonations.length !== 1 ? "s" : ""}
              {filteredDonations.length !== donationRecords.length && (
                <span> (filtered from <span className="font-medium text-foreground">{donationRecords.length}</span>)</span>
              )}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs h-8"
              onClick={handleExportDonations}
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </Button>
          </div>

          {/* Donations Table */}
          {filteredDonations.length === 0 ? (
            <div className="py-8 flex flex-col items-center justify-center text-center">
              <Heart className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <h3 className="text-base font-semibold text-foreground">No donations found</h3>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <>
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#1B2A4A]/5 hover:bg-[#1B2A4A]/5">
                      <TableHead className="text-[#1B2A4A] font-semibold">Donor Name</TableHead>
                      <TableHead className="text-[#1B2A4A] font-semibold">Amount</TableHead>
                      <TableHead className="text-[#1B2A4A] font-semibold">Payment Method</TableHead>
                      <TableHead className="text-[#1B2A4A] font-semibold">Date</TableHead>
                      <TableHead className="text-[#1B2A4A] font-semibold text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedDonations.map((donation) => (
                      <TableRow key={donation.id}>
                        <TableCell className="font-medium text-[#1B2A4A]">{donation.donorName}</TableCell>
                        <TableCell className="font-semibold text-[#1B2A4A]">{formatCurrency(donation.amount)}</TableCell>
                        <TableCell>
                          <Badge className={`${getMethodBadge(donation.paymentMethod)} border-0 text-xs font-medium`}>
                            {donation.paymentMethod}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">{formatDate(donation.date)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-[#1B2A4A] hover:text-[#1B2A4A]/80 hover:bg-[#1B2A4A]/10"
                            onClick={() => handleViewDetails(donation)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card List */}
              <div className="md:hidden space-y-3">
                {paginatedDonations.map((donation) => (
                  <div key={donation.id} className="rounded-lg border p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-[#1B2A4A] text-sm">{donation.donorName}</p>
                        <p className="text-lg font-bold text-[#1B2A4A]">{formatCurrency(donation.amount)}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-[#1B2A4A] hover:bg-[#1B2A4A]/10 shrink-0"
                        onClick={() => handleViewDetails(donation)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <Badge className={`${getMethodBadge(donation.paymentMethod)} border-0 text-xs font-medium`}>
                        {donation.paymentMethod}
                      </Badge>
                      <span>{formatDate(donation.date)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Donations Pagination */}
          {donTotalPages > 1 && (
            <div className="flex items-center justify-between pt-1">
              <p className="text-sm text-muted-foreground">
                Page <span className="font-medium text-foreground">{donSafePage}</span> of{" "}
                <span className="font-medium text-foreground">{donTotalPages}</span>
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDonCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={donSafePage <= 1}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Previous</span>
                </Button>
                {Array.from({ length: donTotalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === donSafePage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDonCurrentPage(page)}
                    className={page === donSafePage ? "bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 text-white" : ""}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDonCurrentPage((p) => Math.min(donTotalPages, p + 1))}
                  disabled={donSafePage >= donTotalPages}
                  className="gap-1"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Generated Reports (md-8) + Financial Reports (md-4) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Recent Generated Reports - md-8 */}
        <div className="md:col-span-8">
          <Card className="py-0 overflow-hidden h-full">
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-[#1B2A4A]/10 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-[#1B2A4A]" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-[#1B2A4A]">
                      Recent Generated Reports
                    </CardTitle>
                    <CardDescription>
                      Previously generated reports and exports
                    </CardDescription>
                  </div>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reports..."
                    className="pl-9 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {filteredReports.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <FileText className="h-12 w-12 text-muted-foreground/40 mb-4" />
                  <h3 className="text-lg font-semibold text-foreground">No reports found</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Try adjusting your search criteria.
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden md:block">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-[#1B2A4A]/5 hover:bg-[#1B2A4A]/5">
                          <TableHead className="text-[#1B2A4A] font-semibold">Title</TableHead>
                          <TableHead className="text-[#1B2A4A] font-semibold">Type</TableHead>
                          <TableHead className="text-[#1B2A4A] font-semibold">Date Generated</TableHead>
                          <TableHead className="text-[#1B2A4A] font-semibold">Generated By</TableHead>
                          <TableHead className="text-[#1B2A4A] font-semibold">Format</TableHead>
                          <TableHead className="text-[#1B2A4A] font-semibold">Size</TableHead>
                          <TableHead className="text-[#1B2A4A] font-semibold text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredReports.map((report: GeneratedReport) => (
                          <TableRow key={report.id}>
                            <TableCell className="font-medium text-[#1B2A4A] max-w-[260px] truncate">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span className="truncate">{report.title}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${getTypeBadge(report.type)} border text-xs font-medium`}>
                                {report.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              <div className="flex items-center gap-1.5">
                                <CalendarDays className="h-3.5 w-3.5" />
                                {report.dateGenerated}
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {report.generatedBy}
                            </TableCell>
                            <TableCell>
                              <Badge className={`${getFormatBadge(report.format)} border text-xs font-medium`}>
                                {report.format}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {report.size}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-[#1B2A4A] hover:text-[#1B2A4A]/80 hover:bg-[#1B2A4A]/10 gap-1"
                                onClick={() => handleDownload(report)}
                              >
                                <Download className="h-4 w-4" />
                                <span className="hidden lg:inline text-xs">Download</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile Card-based List */}
                  <div className="md:hidden space-y-3">
                    {filteredReports.map((report: GeneratedReport) => (
                      <div
                        key={report.id}
                        className="rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                            <p className="font-medium text-[#1B2A4A] text-sm leading-tight">
                              {report.title}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-[#1B2A4A] hover:bg-[#1B2A4A]/10 shrink-0"
                            onClick={() => handleDownload(report)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <Badge className={`${getTypeBadge(report.type)} border text-xs font-medium`}>
                            {report.type}
                          </Badge>
                          <Badge className={`${getFormatBadge(report.format)} border text-xs font-medium`}>
                            {report.format}
                          </Badge>
                          <span className="flex items-center gap-1">
                            <CalendarDays className="h-3 w-3" />
                            {report.dateGenerated}
                          </span>
                          <span>·</span>
                          <span>{report.generatedBy}</span>
                          <span>·</span>
                          <span>{report.size}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Financial Reports - md-4 */}
        <div className="md:col-span-4">
          <Card className="border shadow-sm py-0 overflow-hidden h-full">
            <div className="flex items-center gap-3 border-b bg-[#FAFAF9] px-6 py-4">
              <div className="h-10 w-10 shrink-0 rounded-lg bg-emerald-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#1B2A4A]">
                  Financial Reports
                </h3>
                <p className="text-sm text-muted-foreground">
                  Income & payment summary
                </p>
              </div>
            </div>
            <CardContent className="p-6 space-y-5">
              {/* Date Filter */}
              <div className="space-y-2">
                <Label className="text-sm text-[#1B2A4A] font-medium">Date Range</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    value={finDateFrom}
                    onChange={(e) => setFinDateFrom(e.target.value)}
                    className="h-9 text-sm"
                    placeholder="From"
                  />
                  <Input
                    type="date"
                    value={finDateTo}
                    onChange={(e) => setFinDateTo(e.target.value)}
                    className="h-9 text-sm"
                    placeholder="To"
                  />
                </div>
              </div>

              {/* Payment Status Summary */}
              <div className="space-y-2">
                <Label className="text-sm text-[#1B2A4A] font-medium">Payment Summary</Label>
                <div className="space-y-2">
                  {[
                    { label: "Paid", amount: totalPaid, count: filteredPayments.filter(p => p.status === "Paid").length, config: paymentStatusConfig.Paid },
                    { label: "Partial", amount: totalPartial, count: filteredPayments.filter(p => p.status === "Partial").length, config: paymentStatusConfig.Partial },
                    { label: "Pending", amount: totalPending, count: filteredPayments.filter(p => p.status === "Pending").length, config: paymentStatusConfig.Pending },
                    { label: "Waived", amount: totalWaived, count: filteredPayments.filter(p => p.status === "Waived").length, config: paymentStatusConfig.Waived },
                  ].map((item) => {
                    const Icon = item.config.icon
                    return (
                      <div key={item.label} className={`flex items-center justify-between rounded-lg border p-3 ${item.config.bg}`}>
                        <div className="flex items-center gap-2">
                          <Icon className={`h-4 w-4 ${item.config.text}`} />
                          <div>
                            <p className={`text-sm font-medium ${item.config.text}`}>{item.label}</p>
                            <p className="text-xs text-muted-foreground">{item.count} record{item.count !== 1 ? "s" : ""}</p>
                          </div>
                        </div>
                        <p className={`text-sm font-bold ${item.config.text}`}>
                          {item.amount > 0 ? `₱${item.amount.toLocaleString()}` : "—"}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Income by Service */}
              <div className="space-y-2">
                <Label className="text-sm text-[#1B2A4A] font-medium">Income by Service</Label>
                <div className="space-y-1.5">
                  {incomeSummary.serviceBreakdown.map((s) => {
                    const maxAmount = Math.max(...incomeSummary.serviceBreakdown.map(b => b.amount))
                    const pct = maxAmount > 0 ? (s.amount / maxAmount) * 100 : 0
                    return (
                      <div key={s.service} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{s.service}</span>
                          <span className="font-medium text-[#1B2A4A]">₱{s.amount.toLocaleString()}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#D4AD63] transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Service Fees Reference */}
              <div className="space-y-2">
                <Label className="text-sm text-[#1B2A4A] font-medium">Service Fees</Label>
                <div className="rounded-lg border p-3 space-y-1.5">
                  {Object.entries(serviceFees).map(([service, fee]) => (
                    <div key={service} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{service}</span>
                      <span className="font-medium text-[#1B2A4A]">
                        {service === "Baptism" && fee > 0
                          ? `₱${fee.toLocaleString()}/head`
                          : fee > 0
                          ? `₱${fee.toLocaleString()}`
                          : "Free"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Export & Print Buttons */}
              <div className="space-y-2 pt-1">
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-2 h-10 shadow-sm"
                  onClick={handlePrintFinancial}
                >
                  <Printer className="h-4 w-4" />
                  Print Financial Report
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="gap-1.5 text-xs h-9"
                    onClick={handleExportFinancial}
                  >
                    <Download className="h-3.5 w-3.5" />
                    Payments CSV
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-1.5 text-xs h-9"
                    onClick={handleExportIncomeSummary}
                  >
                    <Download className="h-3.5 w-3.5" />
                    Income CSV
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

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
                  </div>
                </div>
              </div>

              <Separator />

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
