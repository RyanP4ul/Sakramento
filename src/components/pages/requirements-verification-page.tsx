"use client"

import { useState, useMemo } from "react"
import {
  verificationRecords as initialVerificationRecords,
  serviceTypes,
  type VerificationRecord,
  type VerificationStatus,
  type RequirementCheckItem,
} from "@/lib/mock-data"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  FileText,
  Upload,
  Eye,
  ClipboardCheck,
} from "lucide-react"

const ITEMS_PER_PAGE = 8

const statusConfig: Record<
  VerificationStatus,
  { label: string; bgClass: string; textClass: string; icon: React.ElementType }
> = {
  Pending: {
    label: "Pending",
    bgClass: "bg-yellow-100",
    textClass: "text-yellow-800",
    icon: Clock,
  },
  Verified: {
    label: "Verified",
    bgClass: "bg-green-100",
    textClass: "text-green-800",
    icon: CheckCircle2,
  },
  Incomplete: {
    label: "Incomplete",
    bgClass: "bg-orange-100",
    textClass: "text-orange-800",
    icon: AlertCircle,
  },
  Rejected: {
    label: "Rejected",
    bgClass: "bg-red-100",
    textClass: "text-red-800",
    icon: XCircle,
  },
}

export function RequirementsVerificationPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [serviceFilter, setServiceFilter] = useState<string>("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRecord, setSelectedRecord] = useState<VerificationRecord | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [verificationNotes, setVerificationNotes] = useState("")
  const [checkedRequirements, setCheckedRequirements] = useState<Record<number, boolean>>({})
  const [records, setRecords] = useState<VerificationRecord[]>(initialVerificationRecords)

  // Calculate stats from records state
  const stats = useMemo(() => {
    const pending = records.filter((r) => r.status === "Pending").length
    const verified = records.filter((r) => r.status === "Verified").length
    const incomplete = records.filter((r) => r.status === "Incomplete").length
    const rejected = records.filter((r) => r.status === "Rejected").length
    return { pending, verified, incomplete, rejected }
  }, [records])

  // Filter records
  const filteredRecords = useMemo(() => {
    return records.filter((r: VerificationRecord) => {
      const query = searchQuery.toLowerCase()
      const matchesSearch = !query || r.applicant.toLowerCase().includes(query)

      const matchesStatus = statusFilter === "All" || r.status === statusFilter
      const matchesService = serviceFilter === "All" || r.serviceType === serviceFilter

      return matchesSearch && matchesStatus && matchesService
    })
  }, [records, searchQuery, statusFilter, serviceFilter])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / ITEMS_PER_PAGE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedRecords = filteredRecords.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  )

  const handleFilterChange = (setter: (val: string) => void) => (val: string) => {
    setter(val)
    setCurrentPage(1)
  }

  const handleReview = (record: VerificationRecord) => {
    setSelectedRecord(record)
    setVerificationNotes(record.notes)
    // Initialize checked state from the record's requirements
    const initialChecked: Record<number, boolean> = {}
    record.requirements.forEach((req) => {
      initialChecked[req.id] = req.checked
    })
    setCheckedRequirements(initialChecked)
    setDialogOpen(true)
  }

  const handleCheckChange = (reqId: number, checked: boolean) => {
    setCheckedRequirements((prev) => ({ ...prev, [reqId]: checked }))
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setSelectedRecord(null)
    setVerificationNotes("")
    setCheckedRequirements({})
  }

  const handleStatusUpdate = (newStatus: VerificationStatus) => {
    if (!selectedRecord) return
    setRecords((prev) =>
      prev.map((r) =>
        r.id === selectedRecord.id ? { ...r, status: newStatus } : r
      )
    )
    setSelectedRecord((prev) =>
      prev ? { ...prev, status: newStatus } : prev
    )
    handleCloseDialog()
  }

  const statCards = [
    {
      label: "Pending",
      count: stats.pending,
      icon: Clock,
      bgClass: "bg-yellow-50 border-yellow-200",
      iconClass: "text-yellow-600",
      countClass: "text-yellow-700",
    },
    {
      label: "Verified",
      count: stats.verified,
      icon: CheckCircle2,
      bgClass: "bg-green-50 border-green-200",
      iconClass: "text-green-600",
      countClass: "text-green-700",
    },
    {
      label: "Incomplete",
      count: stats.incomplete,
      icon: AlertCircle,
      bgClass: "bg-orange-50 border-orange-200",
      iconClass: "text-orange-600",
      countClass: "text-orange-700",
    },
    {
      label: "Rejected",
      count: stats.rejected,
      icon: XCircle,
      bgClass: "bg-red-50 border-red-200",
      iconClass: "text-red-600",
      countClass: "text-red-700",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
                placeholder="Search by applicant name..."
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
                    {serviceTypes.map((type) => (
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
                    <SelectItem value="All">All Statuses</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Verified">Verified</SelectItem>
                    <SelectItem value="Incomplete">Incomplete</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
          verification record{filteredRecords.length !== 1 ? "s" : ""}
          {filteredRecords.length !== records.length && (
            <span>
              {" "}
              (filtered from{" "}
              <span className="font-medium text-foreground">
                {records.length}
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
            <ClipboardCheck className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-semibold text-foreground">
              No verification records found
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
                  <TableHead className="text-[#1B2A4A] font-semibold">Applicant</TableHead>
                  <TableHead className="text-[#1B2A4A] font-semibold">Service Type</TableHead>
                  <TableHead className="text-[#1B2A4A] font-semibold">Submitted Date</TableHead>
                  <TableHead className="text-[#1B2A4A] font-semibold">Status</TableHead>
                  <TableHead className="text-[#1B2A4A] font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRecords.map((record) => {
                  const statusCfg = statusConfig[record.status]
                  const StatusIcon = statusCfg.icon

                  return (
                    <TableRow key={record.id} className="hover:bg-[#1B2A4A]/[0.02]">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1B2A4A]/10">
                            <FileText className="h-4 w-4 text-[#1B2A4A]" />
                          </div>
                          <span className="font-medium text-[#1B2A4A]">
                            {record.applicant}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs bg-[#1B2A4A]/5 text-[#1B2A4A]/70 px-2 py-1 rounded-md font-medium">
                          {record.serviceType}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {record.submittedDate}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${statusCfg.bgClass} ${statusCfg.textClass} border-0 text-xs font-medium`}
                        >
                          <StatusIcon className="h-3 w-3 mr-0.5" />
                          {statusCfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReview(record)}
                          className="gap-1 text-[#1B2A4A] border-[#1B2A4A]/20 hover:bg-[#1B2A4A] hover:text-white"
                        >
                          <ClipboardCheck className="h-3.5 w-3.5" />
                          Review
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
            <span className="font-medium text-foreground">{safeCurrentPage}</span>{" "}
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

      {/* Review Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#1B2A4A] flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-[#D4AD63]" />
              Review Verification
            </DialogTitle>
            <DialogDescription>
              Review the applicant&apos;s submitted requirements and take action.
            </DialogDescription>
          </DialogHeader>

          {selectedRecord && (
            <div className="space-y-5">
              {/* Applicant Info */}
              <div className="grid grid-cols-2 gap-4 rounded-lg bg-[#1B2A4A]/5 p-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                    Applicant
                  </p>
                  <p className="text-sm font-semibold text-[#1B2A4A] mt-0.5">
                    {selectedRecord.applicant}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                    Service Type
                  </p>
                  <p className="text-sm font-semibold text-[#1B2A4A] mt-0.5">
                    {selectedRecord.serviceType}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                    Submitted Date
                  </p>
                  <p className="text-sm font-semibold text-[#1B2A4A] mt-0.5">
                    {selectedRecord.submittedDate}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                    Status
                  </p>
                  <div className="mt-0.5">
                    {(() => {
                      const statusCfg = statusConfig[selectedRecord.status]
                      const StatusIcon = statusCfg.icon
                      return (
                        <Badge
                          className={`${statusCfg.bgClass} ${statusCfg.textClass} border-0 text-xs font-medium`}
                        >
                          <StatusIcon className="h-3 w-3 mr-0.5" />
                          {statusCfg.label}
                        </Badge>
                      )
                    })()}
                  </div>
                </div>
              </div>

              {/* Requirements Checklist */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-[#1B2A4A] flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-[#D4AD63]" />
                  Requirements Checklist
                </h4>
                <div className="space-y-2 rounded-lg border p-3">
                  {selectedRecord.requirements.map(
                    (req: RequirementCheckItem) => (
                      <div
                        key={req.id}
                        className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-muted/50 transition-colors"
                      >
                        <Checkbox
                          checked={checkedRequirements[req.id] ?? req.checked}
                          onCheckedChange={(checked) =>
                            handleCheckChange(req.id, checked === true)
                          }
                          className="data-[state=checked]:bg-[#1B2A4A] data-[state=checked]:border-[#1B2A4A]"
                        />
                        <span
                          className={`text-sm flex-1 ${
                            checkedRequirements[req.id] ?? req.checked
                              ? "text-foreground line-through opacity-60"
                              : "text-foreground font-medium"
                          }`}
                        >
                          {req.name}
                        </span>
                        {req.hasFile ? (
                          <button className="inline-flex items-center gap-1 text-xs text-[#1B2A4A] hover:text-[#D4AD63] font-medium transition-colors">
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 gap-1 text-xs text-[#D4AD63] hover:text-[#D4AD63] hover:bg-[#D4AD63]/10"
                          >
                            <Upload className="h-3.5 w-3.5" />
                            Upload
                          </Button>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Verification Notes */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-[#1B2A4A] flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-[#D4AD63]" />
                  Verification Notes
                </h4>
                <Textarea
                  placeholder="Add verification notes..."
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
              </div>

              {/* Action Buttons */}
              <DialogFooter className="flex-col sm:flex-row gap-2 pt-2 border-t">
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white gap-1.5 flex-1 sm:flex-none"
                  onClick={() => handleStatusUpdate("Verified")}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Approve
                </Button>
                <Button
                  className="bg-orange-500 hover:bg-orange-600 text-white gap-1.5 flex-1 sm:flex-none"
                  onClick={() => handleStatusUpdate("Incomplete")}
                >
                  <AlertCircle className="h-4 w-4" />
                  Mark Incomplete
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white gap-1.5 flex-1 sm:flex-none"
                  onClick={() => handleStatusUpdate("Rejected")}
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
