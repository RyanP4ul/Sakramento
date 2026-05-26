"use client"

import { useState, useMemo } from "react"
import {
  sakramentalRecords,
  type SakramentalRecord,
  type RecordStatus,
  type SacramentType,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Search,
  Droplets,
  Heart,
  ChevronLeft,
  ChevronRight,
  Plus,
  Eye,
  FileCheck,
  Pencil,
  Trash2,
  BookOpen,
  Sparkles,
  Gem,
  Printer,
  Download,
  X,
  Cross,
} from "lucide-react"
import Image from "next/image"

const ITEMS_PER_PAGE = 8

const sacramentTypeOptions: SacramentType[] = [
  "Baptism",
  "Confirmation",
  "Wedding",
  "Funeral Mass",
]

const statusOptions: RecordStatus[] = ["Active", "Archived", "Pending"]

const statusConfig: Record<
  RecordStatus,
  { label: string; bgClass: string; textClass: string }
> = {
  Active: {
    label: "Active",
    bgClass: "bg-green-100",
    textClass: "text-green-800",
  },
  Archived: {
    label: "Archived",
    bgClass: "bg-gray-100",
    textClass: "text-gray-700",
  },
  Pending: {
    label: "Pending",
    bgClass: "bg-yellow-100",
    textClass: "text-yellow-800",
  },
}

const sacramentIconConfig: Record<
  SacramentType,
  { icon: React.ElementType; colorClass: string }
> = {
  Baptism: { icon: Droplets, colorClass: "text-blue-600" },
  Confirmation: { icon: Sparkles, colorClass: "text-purple-600" },
  Wedding: { icon: Gem, colorClass: "text-pink-600" },
  "Funeral Mass": { icon: Heart, colorClass: "text-gray-600" },
}

interface FormData {
  serviceType: SacramentType
  name: string
  date: string
  minister: string
  parents: string
  godparents: string
  spouse: string
  details: string
}

const emptyFormData: FormData = {
  serviceType: "Baptism",
  name: "",
  date: "",
  minister: "",
  parents: "",
  godparents: "",
  spouse: "",
  details: "",
}

export function SakramentalRecordsPage() {
  const [records, setRecords] = useState<SakramentalRecord[]>(sakramentalRecords)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [serviceFilter, setServiceFilter] = useState<string>("All")
  const [currentPage, setCurrentPage] = useState(1)

  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [certificateDialogOpen, setCertificateDialogOpen] = useState(false)
  const [certificateRecord, setCertificateRecord] = useState<SakramentalRecord | null>(null)
  const [selectedRecord, setSelectedRecord] = useState<SakramentalRecord | null>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [recordToDelete, setRecordToDelete] = useState<SakramentalRecord | null>(null)
  const [formData, setFormData] = useState<FormData>(emptyFormData)

  // Calculate stats from records
  const stats = useMemo(() => {
    const baptism = records.filter((r) => r.serviceType === "Baptism").length
    const confirmation = records.filter((r) => r.serviceType === "Confirmation").length
    const wedding = records.filter((r) => r.serviceType === "Wedding").length
    return { baptism, confirmation, wedding }
  }, [records])

  // Filter records
  const filteredRecords = useMemo(() => {
    return records.filter((r: SakramentalRecord) => {
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        !query ||
        r.name.toLowerCase().includes(query) ||
        r.recordNumber.toLowerCase().includes(query)

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

  // View Details
  const handleViewDetails = (record: SakramentalRecord) => {
    setSelectedRecord(record)
    setViewDialogOpen(true)
  }

  // View Certificate
  const handleViewCertificate = (record: SakramentalRecord) => {
    setCertificateRecord(record)
    setCertificateDialogOpen(true)
  }

  // Add Record
  const handleOpenAdd = () => {
    setFormData(emptyFormData)
    setAddDialogOpen(true)
  }

  const handleAddSubmit = () => {
    if (!formData.name || !formData.date || !formData.minister) return
    const newId = Math.max(...records.map((r) => r.id), 0) + 1
    const prefix =
      formData.serviceType === "Baptism"
        ? "BAP"
        : formData.serviceType === "Confirmation"
          ? "CONF"
          : formData.serviceType === "Wedding"
            ? "WED"
            : "FUN"
    const existingCount = records.filter((r) => r.serviceType === formData.serviceType).length
    const newRecord: SakramentalRecord = {
      id: newId,
      recordNumber: `${prefix}-2025-${String(existingCount + 1).padStart(3, "0")}`,
      serviceType: formData.serviceType,
      name: formData.name,
      date: formData.date,
      minister: formData.minister,
      status: "Pending",
      hasCertificate: false,
      parents: formData.serviceType === "Baptism" ? formData.parents || undefined : undefined,
      godparents: formData.serviceType === "Baptism" ? formData.godparents || undefined : undefined,
      spouse: formData.serviceType === "Wedding" ? formData.spouse || undefined : undefined,
      details: formData.details,
    }
    setRecords((prev) => [...prev, newRecord])
    setAddDialogOpen(false)
    setFormData(emptyFormData)
  }

  // Edit Record
  const handleOpenEdit = (record: SakramentalRecord) => {
    setFormData({
      serviceType: record.serviceType,
      name: record.name,
      date: record.date,
      minister: record.minister,
      parents: record.parents || "",
      godparents: record.godparents || "",
      spouse: record.spouse || "",
      details: record.details,
    })
    setSelectedRecord(record)
    setEditDialogOpen(true)
  }

  const handleEditSubmit = () => {
    if (!selectedRecord || !formData.name || !formData.date || !formData.minister) return
    setRecords((prev) =>
      prev.map((r) =>
        r.id === selectedRecord.id
          ? {
              ...r,
              serviceType: formData.serviceType,
              name: formData.name,
              date: formData.date,
              minister: formData.minister,
              parents: formData.serviceType === "Baptism" ? formData.parents || undefined : undefined,
              godparents: formData.serviceType === "Baptism" ? formData.godparents || undefined : undefined,
              spouse: formData.serviceType === "Wedding" ? formData.spouse || undefined : undefined,
              details: formData.details,
            }
          : r
      )
    )
    setEditDialogOpen(false)
    setSelectedRecord(null)
    setFormData(emptyFormData)
  }

  // Soft Delete
  const handleOpenDelete = (record: SakramentalRecord) => {
    setRecordToDelete(record)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!recordToDelete) return
    setRecords((prev) =>
      prev.map((r) =>
        r.id === recordToDelete.id ? { ...r, status: "Archived" as RecordStatus } : r
      )
    )
    setDeleteDialogOpen(false)
    setRecordToDelete(null)
  }

  const statCards = [
    {
      label: "Baptism Total Records",
      count: stats.baptism,
      icon: Droplets,
      bgClass: "bg-blue-50 border-blue-200",
      iconClass: "text-blue-600",
      countClass: "text-blue-700",
    },
    {
      label: "Confirmation Total Records",
      count: stats.confirmation,
      icon: Sparkles,
      bgClass: "bg-purple-50 border-purple-200",
      iconClass: "text-purple-600",
      countClass: "text-purple-700",
    },
    {
      label: "Wedding Total Records",
      count: stats.wedding,
      icon: Gem,
      bgClass: "bg-pink-50 border-pink-200",
      iconClass: "text-pink-600",
      countClass: "text-pink-700",
    },
  ]

  // Form field renderer
  const renderFormFields = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="serviceType">Service Type</Label>
        <Select
          value={formData.serviceType}
          onValueChange={(val) =>
            setFormData((prev) => ({ ...prev, serviceType: val as SacramentType }))
          }
        >
          <SelectTrigger id="serviceType">
            <SelectValue placeholder="Select service type" />
          </SelectTrigger>
          <SelectContent>
            {sacramentTypeOptions.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="Enter full name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="minister">Minister</Label>
        <Input
          id="minister"
          value={formData.minister}
          onChange={(e) => setFormData((prev) => ({ ...prev, minister: e.target.value }))}
          placeholder="Enter minister name"
        />
      </div>

      {formData.serviceType === "Baptism" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="parents">Parents Names</Label>
            <Input
              id="parents"
              value={formData.parents}
              onChange={(e) => setFormData((prev) => ({ ...prev, parents: e.target.value }))}
              placeholder="e.g. Jose & Ana Santos"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="godparents">Godparents</Label>
            <Input
              id="godparents"
              value={formData.godparents}
              onChange={(e) => setFormData((prev) => ({ ...prev, godparents: e.target.value }))}
              placeholder="e.g. Luis & Carmen Reyes"
            />
          </div>
        </>
      )}

      {formData.serviceType === "Wedding" && (
        <div className="space-y-2">
          <Label htmlFor="spouse">Spouse</Label>
          <Input
            id="spouse"
            value={formData.spouse}
            onChange={(e) => setFormData((prev) => ({ ...prev, spouse: e.target.value }))}
            placeholder="Enter spouse name"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="details">Details</Label>
        <Textarea
          id="details"
          value={formData.details}
          onChange={(e) => setFormData((prev) => ({ ...prev, details: e.target.value }))}
          placeholder="Enter additional details"
          rows={3}
        />
      </div>
    </div>
  )

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

      {/* Search & Filters + Add Button */}
      <Card className="py-0 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or record number..."
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
                Add Record
              </Button>
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
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Services</SelectItem>
                    {sacramentTypeOptions.map((type) => (
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
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
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
          <span className="font-medium text-foreground">{filteredRecords.length}</span> record
          {filteredRecords.length !== 1 ? "s" : ""}
          {filteredRecords.length !== records.length && (
            <span>
              {" "}
              (filtered from <span className="font-medium text-foreground">{records.length}</span>)
            </span>
          )}
        </p>
      </div>

      {/* Table */}
      {filteredRecords.length === 0 ? (
        <Card className="py-0 overflow-hidden">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No records found</h3>
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
                  <TableHead className="text-[#1B2A4A] font-semibold">Record #</TableHead>
                  <TableHead className="text-[#1B2A4A] font-semibold">Service Type</TableHead>
                  <TableHead className="text-[#1B2A4A] font-semibold">Name</TableHead>
                  <TableHead className="text-[#1B2A4A] font-semibold">Date</TableHead>
                  <TableHead className="text-[#1B2A4A] font-semibold">Minister</TableHead>
                  <TableHead className="text-[#1B2A4A] font-semibold">Status</TableHead>
                  <TableHead className="text-[#1B2A4A] font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRecords.map((record) => {
                  const statusCfg = statusConfig[record.status]
                  const sacramentCfg = sacramentIconConfig[record.serviceType]
                  const SacramentIcon = sacramentCfg.icon
                  return (
                    <TableRow key={record.id}>
                      <TableCell className="font-mono text-xs font-medium text-[#1B2A4A]">
                        {record.recordNumber}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <SacramentIcon className={`h-4 w-4 ${sacramentCfg.colorClass}`} />
                          <span className="whitespace-nowrap">{record.serviceType}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{record.name}</TableCell>
                      <TableCell className="text-muted-foreground">{record.date}</TableCell>
                      <TableCell className="text-muted-foreground">{record.minister}</TableCell>
                      <TableCell>
                        <Badge
                          className={`${statusCfg.bgClass} ${statusCfg.textClass} border-0 text-xs font-medium`}
                        >
                          {statusCfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {record.hasCertificate && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-[#D4AD63] hover:text-[#D4AD63]/80 hover:bg-[#D4AD63]/10"
                              title="View Certificate"
                              onClick={() => handleViewCertificate(record)}
                            >
                              <FileCheck className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-[#1B2A4A] hover:text-[#1B2A4A]/80 hover:bg-[#1B2A4A]/10"
                            onClick={() => handleViewDetails(record)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                            onClick={() => handleOpenEdit(record)}
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-red-600 hover:text-red-800 hover:bg-red-50"
                            onClick={() => handleOpenDelete(record)}
                            title="Soft Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#1B2A4A] flex items-center gap-2">
              {selectedRecord && (() => {
                const cfg = sacramentIconConfig[selectedRecord.serviceType]
                const Icon = cfg.icon
                return <Icon className={`h-5 w-5 ${cfg.colorClass}`} />
              })()}
              Record Details
            </DialogTitle>
            <DialogDescription>
              Viewing details for sacramental record
            </DialogDescription>
          </DialogHeader>

          {selectedRecord && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Record #</p>
                  <p className="font-mono font-medium text-[#1B2A4A]">
                    {selectedRecord.recordNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Service Type</p>
                  <p className="font-medium">{selectedRecord.serviceType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{selectedRecord.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{selectedRecord.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Minister</p>
                  <p className="font-medium">{selectedRecord.minister}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    className={`${statusConfig[selectedRecord.status].bgClass} ${statusConfig[selectedRecord.status].textClass} border-0 text-xs font-medium`}
                  >
                    {selectedRecord.status}
                  </Badge>
                </div>
              </div>

              <Separator />

              {selectedRecord.serviceType === "Baptism" && (
                <div className="grid grid-cols-1 gap-4">
                  {selectedRecord.parents && (
                    <div>
                      <p className="text-sm text-muted-foreground">Parents</p>
                      <p className="font-medium">{selectedRecord.parents}</p>
                    </div>
                  )}
                  {selectedRecord.godparents && (
                    <div>
                      <p className="text-sm text-muted-foreground">Godparents</p>
                      <p className="font-medium">{selectedRecord.godparents}</p>
                    </div>
                  )}
                </div>
              )}

              {selectedRecord.serviceType === "Wedding" && selectedRecord.spouse && (
                <div>
                  <p className="text-sm text-muted-foreground">Spouse</p>
                  <p className="font-medium">{selectedRecord.spouse}</p>
                </div>
              )}

              {selectedRecord.details && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground">Details</p>
                    <p className="text-sm leading-relaxed">{selectedRecord.details}</p>
                  </div>
                </>
              )}

              <Separator />

              <div className="flex justify-center">
                <Button
                  className="bg-[#D4AD63] hover:bg-[#D4AD63]/90 text-white font-semibold gap-2 px-6"
                  onClick={() => {
                    setViewDialogOpen(false)
                    if (selectedRecord) {
                      handleViewCertificate(selectedRecord)
                    }
                  }}
                  disabled={!selectedRecord?.hasCertificate}
                >
                  <FileCheck className="h-4 w-4" />
                  View Certificate
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Certificate Viewer Dialog */}
      <Dialog open={certificateDialogOpen} onOpenChange={setCertificateDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[95vh] p-0 overflow-hidden">
          <div className="overflow-y-auto max-h-[95vh]">
            {/* Certificate */}
            {certificateRecord && (() => {
              const today = new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
              const certTitle =
                certificateRecord.serviceType === "Baptism"
                  ? "Certificate of Baptism"
                  : certificateRecord.serviceType === "Confirmation"
                    ? "Certificate of Confirmation"
                    : certificateRecord.serviceType === "Wedding"
                      ? "Certificate of Holy Matrimony"
                      : "Certificate of Funeral Mass"

              const biblicalQuote =
                certificateRecord.serviceType === "Baptism"
                  ? '"For we were all baptized by one Spirit so as to form one body" - 1 Corinthians 12:13'
                  : certificateRecord.serviceType === "Confirmation"
                    ? '"Receive the Holy Spirit. If you forgive anyone\'s sins, their sins are forgiven" - John 20:22-23'
                    : certificateRecord.serviceType === "Wedding"
                      ? '"So they are no longer two, but one flesh. Therefore what God has joined together, let no one separate" - Matthew 19:6'
                      : '"Blessed are those who mourn, for they will be comforted" - Matthew 5:4'

              return (
                <div className="bg-white">
                  {/* Certificate Content */}
                  <div className="border-4 border-double border-[#D4AD63] m-4 sm:m-6 p-4 sm:p-8">
                    {/* Inner border */}
                    <div className="border border-[#D4AD63]/40 p-4 sm:p-6">
                      {/* Header */}
                      <div className="text-center space-y-2 mb-6">
                        <div className="flex justify-center mb-2">
                          <div className="relative h-16 w-16 sm:h-20 sm:w-20">
                            <Image
                              src="/sakramento-logo.png"
                              alt="Parish Logo"
                              fill
                              className="object-contain"
                            />
                          </div>
                        </div>
                        <h2 className="text-lg sm:text-xl font-bold text-[#1B2A4A] tracking-wide">
                          Saint Peter the Apostle Parish
                        </h2>
                        <p className="text-xs sm:text-sm text-[#1B2A4A]/70">
                          Sample Address, City, Province, Philippines
                        </p>
                        <p className="text-xs sm:text-sm text-[#1B2A4A]/70">
                          Contact: +63 917 123 4567
                        </p>
                      </div>

                      {/* Divider */}
                      <div className="flex items-center gap-3 mb-6">
                        <div className="flex-1 h-px bg-[#D4AD63]" />
                        <Cross className="h-4 w-4 text-[#D4AD63]" />
                        <div className="flex-1 h-px bg-[#D4AD63]" />
                      </div>

                      {/* Certificate Title */}
                      <div className="text-center mb-6 sm:mb-8">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1B2A4A] tracking-wider uppercase">
                          {certTitle}
                        </h1>
                        <div className="w-24 sm:w-32 h-0.5 bg-[#D4AD63] mx-auto mt-2" />
                      </div>

                      {/* Certification Body */}
                      <div className="text-center space-y-4 sm:space-y-5 mb-8">
                        <p className="text-sm sm:text-base text-[#1B2A4A]/80">
                          This is to certify that
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-[#1B2A4A] tracking-wide">
                          {certificateRecord.name}
                        </p>

                        {/* Baptism-specific fields */}
                        {certificateRecord.serviceType === "Baptism" && (
                          <div className="space-y-2 text-sm sm:text-base text-[#1B2A4A]/80">
                            {certificateRecord.parents && (
                              <p>
                                child of parents:{" "}
                                <span className="font-semibold text-[#1B2A4A]">
                                  {certificateRecord.parents}
                                </span>
                              </p>
                            )}
                            <p>
                              was baptized on{" "}
                              <span className="font-semibold text-[#1B2A4A]">
                                {certificateRecord.date}
                              </span>
                            </p>
                            {certificateRecord.godparents && (
                              <p>
                                with godparents:{" "}
                                <span className="font-semibold text-[#1B2A4A]">
                                  {certificateRecord.godparents}
                                </span>
                              </p>
                            )}
                            <p>
                              at Saint Peter the Apostle Parish
                            </p>
                            <p>
                              Officiated by{" "}
                              <span className="font-semibold text-[#1B2A4A]">
                                {certificateRecord.minister}
                              </span>
                            </p>
                          </div>
                        )}

                        {/* Confirmation-specific fields */}
                        {certificateRecord.serviceType === "Confirmation" && (
                          <div className="space-y-2 text-sm sm:text-base text-[#1B2A4A]/80">
                            <p>
                              was confirmed on{" "}
                              <span className="font-semibold text-[#1B2A4A]">
                                {certificateRecord.date}
                              </span>
                            </p>
                            <p>
                              at Saint Peter the Apostle Parish
                            </p>
                            <p>
                              Officiated by{" "}
                              <span className="font-semibold text-[#1B2A4A]">
                                {certificateRecord.minister}
                              </span>
                            </p>
                            {certificateRecord.details && (
                              <p className="italic text-[#1B2A4A]/60 text-xs sm:text-sm">
                                {certificateRecord.details}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Wedding-specific fields */}
                        {certificateRecord.serviceType === "Wedding" && (
                          <div className="space-y-2 text-sm sm:text-base text-[#1B2A4A]/80">
                            <p>
                              were united in the Holy Sacrament of Matrimony on{" "}
                              <span className="font-semibold text-[#1B2A4A]">
                                {certificateRecord.date}
                              </span>
                            </p>
                            <p>
                              at Saint Peter the Apostle Parish
                            </p>
                            <p>
                              Officiated by{" "}
                              <span className="font-semibold text-[#1B2A4A]">
                                {certificateRecord.minister}
                              </span>
                            </p>
                          </div>
                        )}

                        {/* Funeral Mass-specific fields */}
                        {certificateRecord.serviceType === "Funeral Mass" && (
                          <div className="space-y-2 text-sm sm:text-base text-[#1B2A4A]/80">
                            <p>
                              A Funeral Mass was celebrated on{" "}
                              <span className="font-semibold text-[#1B2A4A]">
                                {certificateRecord.date}
                              </span>
                            </p>
                            <p>
                              at Saint Peter the Apostle Parish
                            </p>
                            <p>
                              Officiated by{" "}
                              <span className="font-semibold text-[#1B2A4A]">
                                {certificateRecord.minister}
                              </span>
                            </p>
                            {certificateRecord.details && (
                              <p className="italic text-[#1B2A4A]/60 text-xs sm:text-sm">
                                {certificateRecord.details}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Divider */}
                      <div className="w-full h-px bg-[#D4AD63]/30 mb-6" />

                      {/* Record Number */}
                      <div className="text-center mb-6">
                        <p className="text-xs sm:text-sm text-[#1B2A4A]/60 font-mono">
                          Record Number: {certificateRecord.recordNumber}
                        </p>
                      </div>

                      {/* Signatures */}
                      <div className="grid grid-cols-2 gap-8 sm:gap-16 mb-6">
                        <div className="text-center">
                          <div className="border-b border-[#1B2A4A]/30 pb-1 mb-1" />
                          <p className="text-xs sm:text-sm font-semibold text-[#1B2A4A]">
                            {certificateRecord.minister}
                          </p>
                          <p className="text-xs text-[#1B2A4A]/60">Parish Priest</p>
                        </div>
                        <div className="text-center">
                          <div className="border-b border-[#1B2A4A]/30 pb-1 mb-1" />
                          <p className="text-xs sm:text-sm font-semibold text-[#1B2A4A]">
                            Parish Secretary
                          </p>
                          <p className="text-xs text-[#1B2A4A]/60">Parish Secretary</p>
                        </div>
                      </div>

                      {/* Date Issued */}
                      <div className="text-center mb-6">
                        <p className="text-xs sm:text-sm text-[#1B2A4A]/60">
                          Date Issued: {today}
                        </p>
                      </div>

                      {/* Divider */}
                      <div className="w-full h-px bg-[#D4AD63]/30 mb-4" />

                      {/* Biblical Quote */}
                      <div className="text-center">
                        <p className="text-xs sm:text-sm italic text-[#1B2A4A]/50">
                          {biblicalQuote}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 p-4 sm:p-6 border-t border-gray-100">
                    <Button
                      className="w-full sm:w-auto bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 text-white gap-2"
                      onClick={() => window.print()}
                    >
                      <Printer className="h-4 w-4" />
                      Print Certificate
                    </Button>
                    <Button
                      className="w-full sm:w-auto bg-[#D4AD63] hover:bg-[#D4AD63]/90 text-white gap-2"
                      onClick={() => {
                        // In a real app, this would generate a PDF
                        alert("PDF download would be generated here.")
                      }}
                    >
                      <Download className="h-4 w-4" />
                      Download PDF
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto gap-2"
                      onClick={() => setCertificateDialogOpen(false)}
                    >
                      <X className="h-4 w-4" />
                      Close
                    </Button>
                  </div>
                </div>
              )
            })()}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Record Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#1B2A4A] flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Record
            </DialogTitle>
            <DialogDescription>
              Create a new sacramental record entry
            </DialogDescription>
          </DialogHeader>

          {renderFormFields()}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setAddDialogOpen(false)
                setFormData(emptyFormData)
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 text-white"
              onClick={handleAddSubmit}
              disabled={!formData.name || !formData.date || !formData.minister}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Record Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#1B2A4A] flex items-center gap-2">
              <Pencil className="h-5 w-5" />
              Edit Record
            </DialogTitle>
            <DialogDescription>
              Update sacramental record information
            </DialogDescription>
          </DialogHeader>

          {renderFormFields()}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setEditDialogOpen(false)
                setSelectedRecord(null)
                setFormData(emptyFormData)
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 text-white"
              onClick={handleEditSubmit}
              disabled={!formData.name || !formData.date || !formData.minister}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Soft Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#1B2A4A]">Confirm Soft Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to soft delete record{" "}
              <span className="font-mono font-semibold text-foreground">
                {recordToDelete?.recordNumber}
              </span>{" "}
              for <span className="font-semibold text-foreground">{recordToDelete?.name}</span>?
              The record will be archived and can be restored later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRecordToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Soft Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
