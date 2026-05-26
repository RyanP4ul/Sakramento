"use client"

import { useState } from "react"
import {
  sakramentalRecords,
  type SakramentalRecord,
  type SacramentType,
  generatedReports,
  type GeneratedReport,
  paymentRecords,
  incomeSummary,
  serviceFees,
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  FileCheck,
  FileText,
  Download,
  CalendarDays,
  BarChart3,
  Award,
  Search,
  Printer,
  DollarSign,
  TrendingUp,
  CreditCard,
  Banknote,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Users,
} from "lucide-react"

// Certificate type options
const certificateTypes: SacramentType[] = ["Baptism", "Confirmation", "Wedding", "Funeral Mass"]

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

// Income stat cards
const incomeStatCards = [
  { label: "Today", amount: incomeSummary.today, icon: DollarSign, bgClass: "bg-emerald-50 border-emerald-200", iconClass: "text-emerald-600", amountClass: "text-emerald-700" },
  { label: "This Week", amount: incomeSummary.thisWeek, icon: TrendingUp, bgClass: "bg-blue-50 border-blue-200", iconClass: "text-blue-600", amountClass: "text-blue-700" },
  { label: "This Month", amount: incomeSummary.thisMonth, icon: BarChart3, bgClass: "bg-[#D4AD63]/10 border-[#D4AD63]/30", iconClass: "text-[#D4AD63]", amountClass: "text-[#B8960E]" },
  { label: "This Year", amount: incomeSummary.thisYear, icon: CreditCard, bgClass: "bg-[#1B2A4A]/5 border-[#1B2A4A]/15", iconClass: "text-[#1B2A4A]", amountClass: "text-[#1B2A4A]" },
]

export function ReportsPage() {
  // Certificate Generator State
  const [certSearchQuery, setCertSearchQuery] = useState("")
  const [certTypeFilter, setCertTypeFilter] = useState<SacramentType | "All">("All")
  const [selectedRecord, setSelectedRecord] = useState<SakramentalRecord | null>(null)
  const [certDialogOpen, setCertDialogOpen] = useState(false)

  // Financial Reports State
  const [finDateFrom, setFinDateFrom] = useState("")
  const [finDateTo, setFinDateTo] = useState("")
  const [finReportType, setFinReportType] = useState("summary")

  // Recent Reports Search
  const [searchQuery, setSearchQuery] = useState("")

  // Filtered records for certificate search
  const filteredRecords = sakramentalRecords.filter((record) => {
    const matchesType = certTypeFilter === "All" || record.serviceType === certTypeFilter
    const query = certSearchQuery.toLowerCase()
    const matchesQuery = !query || (
      record.name.toLowerCase().includes(query) ||
      record.recordNumber.toLowerCase().includes(query) ||
      record.minister.toLowerCase().includes(query) ||
      (record.parents && record.parents.toLowerCase().includes(query)) ||
      (record.godparents && record.godparents.toLowerCase().includes(query))
    )
    return matchesType && matchesQuery
  })

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

  // Handle generate certificate
  const handleGenerateCertificate = (record: SakramentalRecord) => {
    alert(
      `Certificate Generated!\nType: ${record.serviceType}\nName: ${record.name}\nDate: ${record.date}\nMinister: ${record.minister}${record.parents ? `\nParents: ${record.parents}` : ""}${record.godparents ? `\nGodparents: ${record.godparents}` : ""}`
    )
    setCertDialogOpen(false)
  }

  // Export booking records as CSV
  const handleExportBookings = () => {
    const headers = ["Record #", "Service Type", "Name", "Date", "Minister", "Status", "Parents", "Godparents", "Details"]
    const rows = filteredRecords.map((r) => [
      r.recordNumber,
      r.serviceType,
      `"${r.name}"`,
      r.date,
      `"${r.minister}"`,
      r.status,
      r.parents ? `"${r.parents}"` : "",
      r.godparents ? `"${r.godparents}"` : "",
      `"${r.details}"`,
    ])
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    downloadCSV(csvContent, "booking-records")
  }

  // Export financial records as CSV
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

  // Export income summary as CSV
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

  // Download recent report
  const handleDownload = (report: GeneratedReport) => {
    const csvRows = [
      ["Title", "Type", "Date Generated", "Generated By", "Format", "Size"].join(","),
      [`"${report.title}"`, `"${report.type}"`, report.dateGenerated, `"${report.generatedBy}"`, report.format, `"${report.size}"`].join(","),
    ]
    downloadCSV(csvRows.join("\n"), report.title.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase())
  }

  // Helper: download CSV
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

  // Print financial summary
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

  // Print booking summary
  const handlePrintBookings = () => {
    const printContent = `
      <html><head><title>Booking Summary - Saint Peter the Apostle Parish</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; color: #1B2A4A; }
        h1 { font-size: 20px; margin-bottom: 4px; }
        h2 { font-size: 14px; color: #666; font-weight: normal; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { padding: 8px 12px; border: 1px solid #ddd; text-align: left; font-size: 12px; }
        th { background: #1B2A4A; color: white; }
        .footer { margin-top: 30px; font-size: 11px; color: #999; }
      </style></head><body>
      <h1>Saint Peter the Apostle Parish</h1>
      <h2>Booking Records Summary ${certTypeFilter !== "All" ? `- ${certTypeFilter}` : ""}</h2>
      <table>
        <tr><th>Record #</th><th>Type</th><th>Name</th><th>Date</th><th>Minister</th><th>Status</th></tr>
        ${filteredRecords.map(r => `<tr><td>${r.recordNumber}</td><td>${r.serviceType}</td><td>${r.name}</td><td>${r.date}</td><td>${r.minister}</td><td>${r.status}</td></tr>`).join('')}
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

      {/* 2-Column: Certificate Generator (md-8) + Financial Reports (md-4) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Certificate Generator — md-8 */}
        <div className="md:col-span-8">
          <Card className="border shadow-sm py-0 overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b bg-[#FAFAF9] px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-[#D4AD63]/15 flex items-center justify-center">
                  <Award className="h-5 w-5 text-[#D4AD63]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#1B2A4A]">
                    Certificate Generator
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Search booking records to generate certificates
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs h-8"
                  onClick={handlePrintBookings}
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Print</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs h-8"
                  onClick={handleExportBookings}
                >
                  <Download className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Export CSV</span>
                </Button>
              </div>
            </div>
            <CardContent className="p-6 space-y-4">
              {/* Search & Filter Row */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, record #, minister, parents..."
                    className="pl-9 h-10"
                    value={certSearchQuery}
                    onChange={(e) => setCertSearchQuery(e.target.value)}
                  />
                </div>
                <Select
                  value={certTypeFilter}
                  onValueChange={(val) => setCertTypeFilter(val as SacramentType | "All")}
                >
                  <SelectTrigger className="w-full sm:w-[180px] h-10">
                    <SelectValue placeholder="Filter type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Types</SelectItem>
                    {certificateTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Results Count */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {filteredRecords.length} record{filteredRecords.length !== 1 ? "s" : ""} found
                </p>
              </div>

              {/* Records Table */}
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#1B2A4A]/5 hover:bg-[#1B2A4A]/5">
                      <TableHead className="text-[#1B2A4A] font-semibold text-xs">Record #</TableHead>
                      <TableHead className="text-[#1B2A4A] font-semibold text-xs">Type</TableHead>
                      <TableHead className="text-[#1B2A4A] font-semibold text-xs">Name</TableHead>
                      <TableHead className="text-[#1B2A4A] font-semibold text-xs">Date</TableHead>
                      <TableHead className="text-[#1B2A4A] font-semibold text-xs">Minister</TableHead>
                      <TableHead className="text-[#1B2A4A] font-semibold text-xs">Status</TableHead>
                      <TableHead className="text-[#1B2A4A] font-semibold text-xs text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          <Search className="h-8 w-8 mx-auto mb-2 opacity-30" />
                          <p className="text-sm">No records found. Try adjusting your search.</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRecords.map((record) => (
                        <TableRow key={record.id} className="hover:bg-muted/30">
                          <TableCell className="font-mono text-xs text-[#1B2A4A] font-medium">
                            {record.recordNumber}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs font-medium">
                              {record.serviceType}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium text-[#1B2A4A] text-sm">
                            {record.name}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {record.date}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground max-w-[120px] truncate">
                            {record.minister}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                record.status === "Active"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : record.status === "Pending"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-gray-50 text-gray-600 border-gray-200"
                              }`}
                            >
                              {record.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 gap-1 text-[#D4AD63] hover:text-[#C49A3E] hover:bg-[#D4AD63]/10"
                              onClick={() => {
                                setSelectedRecord(record)
                                setCertDialogOpen(true)
                              }}
                            >
                              <FileCheck className="h-3.5 w-3.5" />
                              <span className="text-xs">Generate</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Reports — md-4 */}
        <div className="md:col-span-4">
          <Card className="border shadow-sm py-0 overflow-hidden">
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

      {/* Recent Generated Reports */}
      <Card className="py-0 overflow-hidden">
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

      {/* Certificate Generation Dialog */}
      <Dialog open={certDialogOpen} onOpenChange={setCertDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#1B2A4A] flex items-center gap-2">
              <Award className="h-5 w-5 text-[#D4AD63]" />
              Generate Certificate
            </DialogTitle>
            <DialogDescription>
              Review record details before generating the certificate.
            </DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4">
              {/* Record Summary */}
              <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs font-medium">
                    {selectedRecord.serviceType}
                  </Badge>
                  <span className="text-xs font-mono text-muted-foreground">{selectedRecord.recordNumber}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="font-medium text-[#1B2A4A]">{selectedRecord.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="font-medium text-[#1B2A4A]">{selectedRecord.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Minister</p>
                    <p className="font-medium text-[#1B2A4A]">{selectedRecord.minister}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        selectedRecord.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : selectedRecord.status === "Pending"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-gray-50 text-gray-600 border-gray-200"
                      }`}
                    >
                      {selectedRecord.status}
                    </Badge>
                  </div>
                  {selectedRecord.parents && (
                    <div>
                      <p className="text-xs text-muted-foreground">Parents</p>
                      <p className="font-medium text-[#1B2A4A]">{selectedRecord.parents}</p>
                    </div>
                  )}
                  {selectedRecord.godparents && (
                    <div>
                      <p className="text-xs text-muted-foreground">Godparents</p>
                      <p className="font-medium text-[#1B2A4A]">{selectedRecord.godparents}</p>
                    </div>
                  )}
                  {selectedRecord.spouse && (
                    <div>
                      <p className="text-xs text-muted-foreground">Spouse</p>
                      <p className="font-medium text-[#1B2A4A]">{selectedRecord.spouse}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Fee Info */}
              <div className="flex items-center justify-between rounded-lg bg-[#D4AD63]/5 border border-[#D4AD63]/20 p-3">
                <div className="flex items-center gap-2">
                  <Banknote className="h-4 w-4 text-[#D4AD63]" />
                  <span className="text-sm text-[#1B2A4A]">Certificate Fee</span>
                </div>
                <span className="text-sm font-bold text-[#1B2A4A]">
                  {(() => {
                    const fee = serviceFees[selectedRecord.serviceType as keyof typeof serviceFees]
                    if (fee <= 0) return "Free"
                    if (selectedRecord.serviceType === "Baptism") return `₱${fee.toLocaleString()}/head`
                    return `₱${fee.toLocaleString()}`
                  })()}
                </span>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setCertDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#D4AD63] hover:bg-[#C49A3E] text-white font-semibold gap-2"
              onClick={() => selectedRecord && handleGenerateCertificate(selectedRecord)}
              disabled={!selectedRecord}
            >
              <FileCheck className="h-4 w-4" />
              Generate Certificate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
