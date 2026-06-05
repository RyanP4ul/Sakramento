"use client"

import { useState, useMemo } from "react"
import {
  reservations,
  priorityRequestsData,
  verificationRecords as initialVerificationRecords,
  serviceTypes,
  serviceTypesRequiringVerification,
  type Reservation,
  type ReservationStatus,
  type PriorityLevel,
  type PriorityRequest,
  type PriorityRequestStatus,
  type ServiceType as ServiceTypeEnum,
  type VerificationRecord,
  type VerificationStatus,
  type RequirementCheckItem,
} from "@/lib/mock-data"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  CalendarDays,
  Clock,
  AlertTriangle,
  CheckCircle,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Trash2,
  ShieldAlert,
  Phone,
  User,
  FileText,
  Upload,
  ClipboardCheck,
  AlertCircle,
} from "lucide-react"

const ITEMS_PER_PAGE = 8

// ============ RESERVATIONS CONFIG ============
const reservationStatusConfig: Record<
  ReservationStatus,
  { label: string; bgClass: string; textClass: string; icon: React.ElementType }
> = {
  Pending: { label: "Pending", bgClass: "bg-yellow-100", textClass: "text-yellow-800", icon: Clock },
  Approved: { label: "Approved", bgClass: "bg-blue-100", textClass: "text-blue-800", icon: CheckCircle },
  Completed: { label: "Completed", bgClass: "bg-green-100", textClass: "text-green-800", icon: CheckCircle },
  Cancelled: { label: "Cancelled", bgClass: "bg-red-100", textClass: "text-red-800", icon: XCircle },
}

const priorityConfig: Record<PriorityLevel, { label: string; bgClass: string; textClass: string }> = {
  High: { label: "High", bgClass: "bg-red-100", textClass: "text-red-800" },
  Medium: { label: "Medium", bgClass: "bg-yellow-100", textClass: "text-yellow-800" },
  Low: { label: "Low", bgClass: "bg-gray-100", textClass: "text-gray-700" },
}

// ============ PRIORITY REQUESTS CONFIG ============
const priorityServiceTypes: ServiceTypeEnum[] = ["Funeral Mass", "Anointing of the Sick"]

// ============ VERIFICATION CONFIG ============
const verificationStatusConfig: Record<
  VerificationStatus,
  { label: string; bgClass: string; textClass: string; icon: React.ElementType }
> = {
  Pending: { label: "Pending", bgClass: "bg-yellow-100", textClass: "text-yellow-800", icon: Clock },
  Verified: { label: "Verified", bgClass: "bg-green-100", textClass: "text-green-800", icon: CheckCircle2 },
  Incomplete: { label: "Incomplete", bgClass: "bg-orange-100", textClass: "text-orange-800", icon: AlertCircle },
  Rejected: { label: "Rejected", bgClass: "bg-red-100", textClass: "text-red-800", icon: XCircle },
}

function calcVerificationProgress(requirements: RequirementCheckItem[]): number {
  const requiredItems = requirements.filter((r) => r.required)
  if (requiredItems.length === 0) return 100
  const checkedRequired = requiredItems.filter((r) => r.checked).length
  return Math.round((checkedRequired / requiredItems.length) * 100)
}

function groupByCategory(requirements: RequirementCheckItem[]): Record<string, RequirementCheckItem[]> {
  return requirements.reduce<Record<string, RequirementCheckItem[]>>((acc, req) => {
    const cat = req.category || "Requirements"
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(req)
    return acc
  }, {})
}

// ============ PAGINATION HELPER ============
function usePagination(totalItems: number, itemsPerPage: number = ITEMS_PER_PAGE) {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedItems = { start: (safeCurrentPage - 1) * itemsPerPage, end: safeCurrentPage * itemsPerPage }
  return { currentPage: safeCurrentPage, totalPages, setCurrentPage, paginatedItems }
}

// ============ MAIN PAGE ============
export function ReservationsPage() {
  const [activeTab, setActiveTab] = useState("reservations")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1B2A4A]">
          <CalendarDays className="h-5 w-5 text-[#D4AD63]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#1B2A4A]">Reservations</h1>
          <p className="text-sm text-muted-foreground">Manage reservations, priority requests & requirements verification</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="reservations" className="gap-1.5">
            <CalendarDays className="h-4 w-4" />
            Reservations
          </TabsTrigger>
          <TabsTrigger value="priority-requests" className="gap-1.5">
            <ShieldAlert className="h-4 w-4" />
            Priority Requests
          </TabsTrigger>
          <TabsTrigger value="verification" className="gap-1.5">
            <ClipboardCheck className="h-4 w-4" />
            Verification
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reservations">
          <ReservationsTab />
        </TabsContent>
        <TabsContent value="priority-requests">
          <PriorityRequestsTab />
        </TabsContent>
        <TabsContent value="verification">
          <VerificationTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ============================================================================
// RESERVATIONS TAB
// ============================================================================
function ReservationsTab() {
  const [reservationList, setReservationList] = useState<Reservation[]>(reservations)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [serviceFilter, setServiceFilter] = useState<string>("All")
  const [priorityFilter, setPriorityFilter] = useState<string>("All")
  const [dateFrom, setDateFrom] = useState<string>("")
  const [dateTo, setDateTo] = useState<string>("")

  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [reservationToDelete, setReservationToDelete] = useState<Reservation | null>(null)
  const [editForm, setEditForm] = useState({
    title: "", requester: "", date: "", contactNumber: "",
    serviceType: "Baptism", priority: "Medium" as PriorityLevel, status: "Pending" as ReservationStatus,
    description: "",
  })

  const stats = useMemo(() => ({
    pending: reservationList.filter((r) => r.status === "Pending").length,
    approved: reservationList.filter((r) => r.status === "Approved").length,
    completed: reservationList.filter((r) => r.status === "Completed").length,
    cancelled: reservationList.filter((r) => r.status === "Cancelled").length,
  }), [reservationList])

  const filteredReservations = useMemo(() => {
    return reservationList.filter((r: Reservation) => {
      const query = searchQuery.toLowerCase()
      const matchesSearch = !query || r.title.toLowerCase().includes(query) || r.requester.toLowerCase().includes(query) || r.description.toLowerCase().includes(query)
      const matchesStatus = statusFilter === "All" || r.status === statusFilter
      const matchesService = serviceFilter === "All" || r.serviceType === serviceFilter
      const matchesPriority = priorityFilter === "All" || r.priority === priorityFilter
      const reservationDate = new Date(r.date)
      const matchesDateFrom = !dateFrom || reservationDate >= new Date(dateFrom)
      const matchesDateTo = !dateTo || reservationDate <= new Date(dateTo + "T23:59:59")
      return matchesSearch && matchesStatus && matchesService && matchesPriority && matchesDateFrom && matchesDateTo
    })
  }, [reservationList, searchQuery, statusFilter, serviceFilter, priorityFilter, dateFrom, dateTo])

  const { currentPage, totalPages, setCurrentPage, paginatedItems } = usePagination(filteredReservations.length, 6)
  const paginatedReservations = filteredReservations.slice(paginatedItems.start, paginatedItems.end)

  const handleFilterChange = (setter: (val: string) => void) => (val: string) => { setter(val); setCurrentPage(1) }

  const handleViewDetails = (reservation: Reservation) => { setSelectedReservation(reservation); setViewDialogOpen(true) }
  const handleOpenEdit = (reservation: Reservation) => {
    setEditForm({ title: reservation.title, requester: reservation.requester, date: reservation.date, contactNumber: reservation.contactNumber, serviceType: reservation.serviceType, priority: reservation.priority, status: reservation.status, description: reservation.description })
    setSelectedReservation(reservation); setEditDialogOpen(true)
  }
  const handleEditSubmit = () => {
    if (!selectedReservation || !editForm.title || !editForm.requester) return
    setReservationList((prev) => prev.map((r) => r.id === selectedReservation.id ? { ...r, title: editForm.title, requester: editForm.requester, date: editForm.date, contactNumber: editForm.contactNumber, serviceType: editForm.serviceType as Reservation["serviceType"], priority: editForm.priority, status: editForm.status, description: editForm.description } : r))
    setEditDialogOpen(false); setSelectedReservation(null)
  }
  const handleOpenDelete = (reservation: Reservation) => { setReservationToDelete(reservation); setDeleteDialogOpen(true) }
  const handleConfirmDelete = () => {
    if (!reservationToDelete) return
    setReservationList((prev) => prev.map((r) => r.id === reservationToDelete.id ? { ...r, status: "Cancelled" as ReservationStatus } : r))
    setDeleteDialogOpen(false); setReservationToDelete(null)
  }

  const statCards = [
    { label: "Pending", count: stats.pending, icon: Clock, bgClass: "bg-yellow-50 border-yellow-200", iconClass: "text-yellow-600", countClass: "text-yellow-700" },
    { label: "Approved", count: stats.approved, icon: CheckCircle, bgClass: "bg-blue-50 border-blue-200", iconClass: "text-blue-600", countClass: "text-blue-700" },
    { label: "Completed", count: stats.completed, icon: CheckCircle, bgClass: "bg-green-50 border-green-200", iconClass: "text-green-600", countClass: "text-green-700" },
    { label: "Cancelled", count: stats.cancelled, icon: XCircle, bgClass: "bg-red-50 border-red-200", iconClass: "text-red-600", countClass: "text-red-700" },
  ]

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => { const Icon = stat.icon; return (
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
        )})}
      </div>

      {/* Search & Filters */}
      <Card className="py-0 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by title, requester, or description..." className="pl-9 w-full" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }} />
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Status:</span>
                <Select value={statusFilter} onValueChange={handleFilterChange(setStatusFilter)}>
                  <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="All" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Statuses</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Service:</span>
                <Select value={serviceFilter} onValueChange={handleFilterChange(setServiceFilter)}>
                  <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="All" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Services</SelectItem>
                    {serviceTypes.map((type) => (<SelectItem key={type} value={type}>{type}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Priority:</span>
                <Select value={priorityFilter} onValueChange={handleFilterChange(setPriorityFilter)}>
                  <SelectTrigger className="w-full sm:w-[150px]"><SelectValue placeholder="All" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Priorities</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">From:</span>
                <Input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1) }} className="w-[150px]" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">To:</span>
                <Input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1) }} className="w-[150px]" />
              </div>
              {(dateFrom || dateTo) && (
                <Button variant="ghost" size="sm" className="h-9 text-xs text-muted-foreground hover:text-foreground" onClick={() => { setDateFrom(""); setDateTo(""); setCurrentPage(1) }}>
                  <XCircle className="h-3.5 w-3.5 mr-1" />Clear dates
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{filteredReservations.length}</span> reservation{filteredReservations.length !== 1 ? "s" : ""}
          {filteredReservations.length !== reservationList.length && (<span> (filtered from <span className="font-medium text-foreground">{reservationList.length}</span>)</span>)}
        </p>
      </div>

      {/* List */}
      {filteredReservations.length === 0 ? (
        <Card className="py-0 overflow-hidden">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <CalendarDays className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No reservations found</h3>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {paginatedReservations.map((reservation) => {
            const statusCfg = reservationStatusConfig[reservation.status]
            const priorityCfg = priorityConfig[reservation.priority]
            const StatusIcon = statusCfg.icon
            return (
              <Card key={reservation.id} className="py-0 overflow-hidden hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1B2A4A]/10">
                      <CalendarDays className="h-5 w-5 text-[#1B2A4A]" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <h3 className="font-semibold text-[#1B2A4A] text-base truncate">{reservation.title}</h3>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge className={`${priorityCfg.bgClass} ${priorityCfg.textClass} border-0 text-xs font-medium`}>
                            {reservation.priority === "High" && <AlertTriangle className="h-3 w-3 mr-0.5" />}{priorityCfg.label}
                          </Badge>
                          <Badge className={`${statusCfg.bgClass} ${statusCfg.textClass} border-0 text-xs font-medium`}>
                            <StatusIcon className="h-3 w-3 mr-0.5" />{statusCfg.label}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{reservation.date}</span>
                        <span className="flex items-center gap-1"><span className="font-medium text-foreground/80">{reservation.requester}</span></span>
                        <span className="text-xs bg-[#1B2A4A]/5 text-[#1B2A4A]/70 px-2 py-0.5 rounded-md font-medium">{reservation.serviceType}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{reservation.description}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-[#1B2A4A] hover:text-[#1B2A4A]/80 hover:bg-[#1B2A4A]/10" onClick={() => handleViewDetails(reservation)} title="View"><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50" onClick={() => handleOpenEdit(reservation)} title="Edit"><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-red-600 hover:text-red-800 hover:bg-red-50" onClick={() => handleOpenDelete(reservation)} title="Soft Delete" disabled={reservation.status === "Cancelled"}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#1B2A4A] flex items-center gap-2"><CalendarDays className="h-5 w-5 text-[#D4AD63]" />Reservation Details</DialogTitle>
            <DialogDescription>Viewing details for the selected reservation</DialogDescription>
          </DialogHeader>
          {selectedReservation && (
            <div className="space-y-4">
              <div className="bg-[#1B2A4A]/5 rounded-lg p-4">
                <h3 className="text-lg font-bold text-[#1B2A4A]">{selectedReservation.title}</h3>
                <div className="flex gap-2 mt-2">
                  <Badge className={`${priorityConfig[selectedReservation.priority].bgClass} ${priorityConfig[selectedReservation.priority].textClass} border-0 text-xs font-medium`}>
                    {selectedReservation.priority === "High" && <AlertTriangle className="h-3 w-3 mr-0.5" />}{selectedReservation.priority}
                  </Badge>
                  <Badge className={`${reservationStatusConfig[selectedReservation.status].bgClass} ${reservationStatusConfig[selectedReservation.status].textClass} border-0 text-xs font-medium`}>{selectedReservation.status}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-muted-foreground">Requester</p><p className="font-medium">{selectedReservation.requester}</p></div>
                <div><p className="text-sm text-muted-foreground">Contact</p><p className="font-medium">{selectedReservation.contactNumber}</p></div>
                <div><p className="text-sm text-muted-foreground">Date</p><p className="font-medium">{selectedReservation.date}</p></div>
                <div><p className="text-sm text-muted-foreground">Service Type</p><p className="font-medium">{selectedReservation.serviceType}</p></div>
              </div>
              <Separator />
              <div><p className="text-sm text-muted-foreground">Description</p><p className="text-sm leading-relaxed">{selectedReservation.description}</p></div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#1B2A4A] flex items-center gap-2"><Pencil className="h-5 w-5" />Edit Reservation</DialogTitle>
            <DialogDescription>Update reservation information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label htmlFor="edit-title">Title</Label><Input id="edit-title" value={editForm.title} onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Enter reservation title" /></div>
            <div className="space-y-2"><Label htmlFor="edit-requester">Requester</Label><Input id="edit-requester" value={editForm.requester} onChange={(e) => setEditForm((prev) => ({ ...prev, requester: e.target.value }))} placeholder="Enter requester name" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label htmlFor="edit-date">Date</Label><Input id="edit-date" type="date" value={editForm.date} onChange={(e) => setEditForm((prev) => ({ ...prev, date: e.target.value }))} /></div>
              <div className="space-y-2"><Label htmlFor="edit-contact">Contact Number</Label><Input id="edit-contact" value={editForm.contactNumber} onChange={(e) => setEditForm((prev) => ({ ...prev, contactNumber: e.target.value }))} placeholder="+63 917 111 1111" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label htmlFor="edit-service">Service Type</Label><Select value={editForm.serviceType} onValueChange={(val) => setEditForm((prev) => ({ ...prev, serviceType: val }))}><SelectTrigger id="edit-service"><SelectValue placeholder="Select service" /></SelectTrigger><SelectContent>{serviceTypes.map((type) => (<SelectItem key={type} value={type}>{type}</SelectItem>))}</SelectContent></Select></div>
              <div className="space-y-2"><Label htmlFor="edit-priority">Priority</Label><Select value={editForm.priority} onValueChange={(val) => setEditForm((prev) => ({ ...prev, priority: val as PriorityLevel }))}><SelectTrigger id="edit-priority"><SelectValue placeholder="Select priority" /></SelectTrigger><SelectContent><SelectItem value="High">High</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Low">Low</SelectItem></SelectContent></Select></div>
            </div>
            <div className="space-y-2"><Label htmlFor="edit-status">Status</Label><Select value={editForm.status} onValueChange={(val) => setEditForm((prev) => ({ ...prev, status: val as ReservationStatus }))}><SelectTrigger id="edit-status"><SelectValue placeholder="Select status" /></SelectTrigger><SelectContent><SelectItem value="Pending">Pending</SelectItem><SelectItem value="Approved">Approved</SelectItem><SelectItem value="Completed">Completed</SelectItem><SelectItem value="Cancelled">Cancelled</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label htmlFor="edit-description">Description</Label><Textarea id="edit-description" value={editForm.description} onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))} placeholder="Enter description" rows={3} /></div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => { setEditDialogOpen(false); setSelectedReservation(null) }}>Cancel</Button>
            <Button className="bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 text-white" onClick={handleEditSubmit} disabled={!editForm.title || !editForm.requester}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#1B2A4A]">Confirm Soft Delete</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to soft delete reservation <span className="font-semibold text-foreground">{reservationToDelete?.title}</span>? The reservation will be marked as Cancelled and can be restored by editing.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setReservationToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700 text-white">Soft Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// ============================================================================
// PRIORITY REQUESTS TAB
// ============================================================================
function PriorityRequestsTab() {
  const [requestList, setRequestList] = useState<PriorityRequest[]>(priorityRequestsData)
  const [searchQuery, setSearchQuery] = useState("")
  const [serviceFilter, setServiceFilter] = useState<string>("All")

  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<PriorityRequest | null>(null)
  const [requestToDelete, setRequestToDelete] = useState<PriorityRequest | null>(null)
  const [editForm, setEditForm] = useState({ serviceType: "", fullName: "", contact: "", dateTime: "" })

  const handleOpenEdit = (request: PriorityRequest) => {
    setSelectedRequest(request)
    setEditForm({ serviceType: request.serviceType, fullName: request.fullName, contact: request.contact, dateTime: request.dateTime })
    setEditDialogOpen(true)
  }
  const handleEditSubmit = () => {
    if (!selectedRequest || !editForm.fullName || !editForm.contact) return
    setRequestList((prev) => prev.map((r) => r.id === selectedRequest.id ? { ...r, serviceType: editForm.serviceType as PriorityRequest["serviceType"], fullName: editForm.fullName, contact: editForm.contact, dateTime: editForm.dateTime } : r))
    setEditDialogOpen(false); setSelectedRequest(null)
  }
  const handleOpenDelete = (request: PriorityRequest) => { setRequestToDelete(request); setDeleteDialogOpen(true) }
  const handleConfirmDelete = () => {
    if (!requestToDelete) return
    setRequestList((prev) => prev.map((r) => r.id === requestToDelete.id ? { ...r, status: "Low" as PriorityRequestStatus } : r))
    setDeleteDialogOpen(false); setRequestToDelete(null)
  }

  const filteredRequests = useMemo(() => {
    return requestList
      .filter((r: PriorityRequest) => priorityServiceTypes.includes(r.serviceType))
      .filter((r: PriorityRequest) => {
        const query = searchQuery.toLowerCase()
        const matchesSearch = !query || r.fullName.toLowerCase().includes(query) || r.contact.toLowerCase().includes(query)
        const matchesService = serviceFilter === "All" || r.serviceType === serviceFilter
        return matchesSearch && matchesService
      })
  }, [requestList, searchQuery, serviceFilter])

  const { currentPage, totalPages, setCurrentPage, paginatedItems } = usePagination(filteredRequests.length)
  const paginatedRequests = filteredRequests.slice(paginatedItems.start, paginatedItems.end)

  const handleFilterChange = (setter: (val: string) => void) => (val: string) => { setter(val); setCurrentPage(1) }

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <Card className="py-0 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name or contact..." className="pl-9 w-full" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }} />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Service:</span>
                <Select value={serviceFilter} onValueChange={handleFilterChange(setServiceFilter)}>
                  <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="All" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Services</SelectItem>
                    {priorityServiceTypes.map((type) => (<SelectItem key={type} value={type}>{type}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>

            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{filteredRequests.length}</span> request{filteredRequests.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Table */}
      {filteredRequests.length === 0 ? (
        <Card className="py-0 overflow-hidden">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <ShieldAlert className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No priority requests found</h3>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="py-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#1B2A4A]/5 hover:bg-[#1B2A4A]/5">
                <TableHead className="text-[#1B2A4A] font-semibold">Service Type</TableHead>
                <TableHead className="text-[#1B2A4A] font-semibold">Full Name</TableHead>
                <TableHead className="text-[#1B2A4A] font-semibold hidden md:table-cell">Contact</TableHead>
                <TableHead className="text-[#1B2A4A] font-semibold hidden sm:table-cell">Date & Time</TableHead>
                <TableHead className="text-[#1B2A4A] font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRequests.map((request) => {
                return (
                  <TableRow key={request.id} className="hover:bg-[#1B2A4A]/[0.02]">
                    <TableCell><span className="text-xs bg-[#1B2A4A]/5 text-[#1B2A4A]/80 px-2 py-1 rounded-md font-medium">{request.serviceType}</span></TableCell>
                    <TableCell className="font-medium text-[#1B2A4A]">{request.fullName}</TableCell>
                    <TableCell className="text-muted-foreground hidden md:table-cell">{request.contact}</TableCell>
                    <TableCell className="text-muted-foreground hidden sm:table-cell">{request.dateTime}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-[#1B2A4A] hover:text-[#1B2A4A]/80 hover:bg-[#1B2A4A]/10" onClick={() => { setSelectedRequest(request); setViewDialogOpen(true) }} title="View"><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50" onClick={() => handleOpenEdit(request)} title="Edit"><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-red-600 hover:text-red-800 hover:bg-red-50" onClick={() => handleOpenDelete(request)} title="Soft Delete"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {totalPages > 1 && <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#1B2A4A] flex items-center gap-2"><ShieldAlert className="h-5 w-5 text-[#D4AD63]" />Priority Request Details</DialogTitle>
            <DialogDescription>Viewing details for the selected priority request</DialogDescription>
          </DialogHeader>
          {selectedRequest && (
              <div className="space-y-4">
                <div className="bg-[#1B2A4A]/5 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-[#1B2A4A]">{selectedRequest.fullName}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{selectedRequest.serviceType}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1B2A4A]/10"><User className="h-4 w-4 text-[#1B2A4A]" /></div><div><p className="text-sm text-muted-foreground">Full Name</p><p className="font-medium text-[#1B2A4A]">{selectedRequest.fullName}</p></div></div>
                  <div className="flex items-start gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1B2A4A]/10"><Phone className="h-4 w-4 text-[#1B2A4A]" /></div><div><p className="text-sm text-muted-foreground">Contact</p><p className="font-medium text-[#1B2A4A]">{selectedRequest.contact}</p></div></div>
                  <div className="flex items-start gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1B2A4A]/10"><CalendarDays className="h-4 w-4 text-[#1B2A4A]" /></div><div><p className="text-sm text-muted-foreground">Date &amp; Time</p><p className="font-medium text-[#1B2A4A]">{selectedRequest.dateTime}</p></div></div>
                  <div className="flex items-start gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1B2A4A]/10"><ClipboardCheck className="h-4 w-4 text-[#1B2A4A]" /></div><div><p className="text-sm text-muted-foreground">Service Type</p><p className="font-medium text-[#1B2A4A]"><span className="text-xs bg-[#1B2A4A]/5 text-[#1B2A4A]/80 px-2 py-0.5 rounded-md font-medium">{selectedRequest.serviceType}</span></p></div></div>
                </div>
              </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#1B2A4A] flex items-center gap-2"><Pencil className="h-5 w-5" />Edit Priority Request</DialogTitle>
            <DialogDescription>Update priority request information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2"><Label>Service Type</Label><Select value={editForm.serviceType} onValueChange={(val) => setEditForm((prev) => ({ ...prev, serviceType: val }))} disabled><SelectTrigger><SelectValue placeholder="Select service type" /></SelectTrigger><SelectContent>{priorityServiceTypes.map((type) => (<SelectItem key={type} value={type}>{type}</SelectItem>))}</SelectContent></Select></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2"><Label>Full Name</Label><Input value={editForm.fullName} onChange={(e) => setEditForm((prev) => ({ ...prev, fullName: e.target.value }))} placeholder="Enter full name" disabled /></div>
              <div className="grid gap-2"><Label>Contact</Label><Input value={editForm.contact} onChange={(e) => setEditForm((prev) => ({ ...prev, contact: e.target.value }))} placeholder="Enter contact number" disabled /></div>
            </div>
            <div className="grid gap-2"><Label>Date & Time</Label><Input value={editForm.dateTime} onChange={(e) => setEditForm((prev) => ({ ...prev, dateTime: e.target.value }))} placeholder="e.g. 2025-04-20 10:00 AM" /></div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => { setEditDialogOpen(false); setSelectedRequest(null) }}>Cancel</Button>
            <Button className="bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 text-white" onClick={handleEditSubmit} disabled={!editForm.fullName || !editForm.contact}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#1B2A4A]">Confirm Soft Delete</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to soft delete the priority request for <span className="font-semibold text-foreground">{requestToDelete?.fullName}</span>? The request will be marked as Low priority and can be restored by editing.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRequestToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700 text-white">Soft Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// ============================================================================
// VERIFICATION TAB
// ============================================================================
function VerificationTab() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [serviceFilter, setServiceFilter] = useState<string>("All")
  const [selectedRecord, setSelectedRecord] = useState<VerificationRecord | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [verificationNotes, setVerificationNotes] = useState("")
  const [checkedRequirements, setCheckedRequirements] = useState<Record<number, boolean>>({})
  const [records, setRecords] = useState<VerificationRecord[]>(initialVerificationRecords)

  const stats = useMemo(() => ({
    pending: records.filter((r) => r.status === "Pending").length,
    verified: records.filter((r) => r.status === "Verified").length,
    incomplete: records.filter((r) => r.status === "Incomplete").length,
    rejected: records.filter((r) => r.status === "Rejected").length,
  }), [records])

  const filteredRecords = useMemo(() => {
    return records.filter((r: VerificationRecord) => {
      const query = searchQuery.toLowerCase()
      const matchesSearch = !query || r.applicant.toLowerCase().includes(query)
      const matchesStatus = statusFilter === "All" || r.status === statusFilter
      const matchesService = serviceFilter === "All" || r.serviceType === serviceFilter
      return matchesSearch && matchesStatus && matchesService
    })
  }, [records, searchQuery, statusFilter, serviceFilter])

  const { currentPage, totalPages, setCurrentPage, paginatedItems } = usePagination(filteredRecords.length)
  const paginatedRecords = filteredRecords.slice(paginatedItems.start, paginatedItems.end)

  const handleFilterChange = (setter: (val: string) => void) => (val: string) => { setter(val); setCurrentPage(1) }

  const handleReview = (record: VerificationRecord) => {
    setSelectedRecord(record); setVerificationNotes(record.notes)
    const initialChecked: Record<number, boolean> = {}
    record.requirements.forEach((req) => { initialChecked[req.id] = req.checked })
    setCheckedRequirements(initialChecked); setDialogOpen(true)
  }
  const handleCheckChange = (reqId: number, checked: boolean) => { setCheckedRequirements((prev) => ({ ...prev, [reqId]: checked })) }
  const handleCloseDialog = () => { setDialogOpen(false); setSelectedRecord(null); setVerificationNotes(""); setCheckedRequirements({}) }
  const handleStatusUpdate = (newStatus: VerificationStatus) => {
    if (!selectedRecord) return
    setRecords((prev) => prev.map((r) => r.id === selectedRecord.id ? { ...r, status: newStatus } : r))
    setSelectedRecord((prev) => prev ? { ...prev, status: newStatus } : prev)
    handleCloseDialog()
  }

  const dialogProgress = useMemo(() => {
    if (!selectedRecord) return 0
    const requiredItems = selectedRecord.requirements.filter((r) => r.required)
    if (requiredItems.length === 0) return 100
    const checkedRequired = requiredItems.filter((r) => checkedRequirements[r.id] ?? r.checked).length
    return Math.round((checkedRequired / requiredItems.length) * 100)
  }, [selectedRecord, checkedRequirements])

  const statCards = [
    { label: "Pending", count: stats.pending, icon: Clock, bgClass: "bg-yellow-50 border-yellow-200", iconClass: "text-yellow-600", countClass: "text-yellow-700" },
    { label: "Verified", count: stats.verified, icon: CheckCircle2, bgClass: "bg-green-50 border-green-200", iconClass: "text-green-600", countClass: "text-green-700" },
    { label: "Incomplete", count: stats.incomplete, icon: AlertCircle, bgClass: "bg-orange-50 border-orange-200", iconClass: "text-orange-600", countClass: "text-orange-700" },
    { label: "Rejected", count: stats.rejected, icon: XCircle, bgClass: "bg-red-50 border-red-200", iconClass: "text-red-600", countClass: "text-red-700" },
  ]

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => { const Icon = stat.icon; return (
          <Card key={stat.label} className={`${stat.bgClass} border py-0 overflow-hidden`}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/70"><Icon className={`h-5 w-5 ${stat.iconClass}`} /></div>
              <div className="min-w-0"><p className="text-sm text-muted-foreground truncate">{stat.label}</p><p className={`text-2xl font-bold ${stat.countClass}`}>{stat.count}</p></div>
            </CardContent>
          </Card>
        )})}
      </div>

      {/* Search & Filters */}
      <Card className="py-0 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by applicant name..." className="pl-9 w-full" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }} />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Service:</span>
                <Select value={serviceFilter} onValueChange={handleFilterChange(setServiceFilter)}>
                  <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="All" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Services</SelectItem>
                    {serviceTypesRequiringVerification.map((type) => (<SelectItem key={type} value={type}>{type}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Status:</span>
                <Select value={statusFilter} onValueChange={handleFilterChange(setStatusFilter)}>
                  <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="All" /></SelectTrigger>
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

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{filteredRecords.length}</span> verification record{filteredRecords.length !== 1 ? "s" : ""}
          {filteredRecords.length !== records.length && (<span> (filtered from <span className="font-medium text-foreground">{records.length}</span>)</span>)}
        </p>
      </div>

      {/* Table */}
      {filteredRecords.length === 0 ? (
        <Card className="py-0 overflow-hidden">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <ClipboardCheck className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No verification records found</h3>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filter criteria.</p>
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
                  <TableHead className="text-[#1B2A4A] font-semibold">Progress</TableHead>
                  <TableHead className="text-[#1B2A4A] font-semibold">Status</TableHead>
                  <TableHead className="text-[#1B2A4A] font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRecords.map((record) => {
                  const statusCfg = verificationStatusConfig[record.status]
                  const StatusIcon = statusCfg.icon
                  const progress = calcVerificationProgress(record.requirements)
                  const requiredChecked = record.requirements.filter((r) => r.required && r.checked).length
                  const requiredTotal = record.requirements.filter((r) => r.required).length
                  const progressColor = progress === 100 ? "text-green-700" : progress >= 50 ? "text-[#D4AD63]" : "text-orange-600"
                  return (
                    <TableRow key={record.id} className="hover:bg-[#1B2A4A]/[0.02]">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1B2A4A]/10"><FileText className="h-4 w-4 text-[#1B2A4A]" /></div>
                          <span className="font-medium text-[#1B2A4A]">{record.applicant}</span>
                        </div>
                      </TableCell>
                      <TableCell><span className="text-xs bg-[#1B2A4A]/5 text-[#1B2A4A]/70 px-2 py-1 rounded-md font-medium">{record.serviceType}</span></TableCell>
                      <TableCell className="text-muted-foreground">{record.submittedDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 min-w-[120px]">
                          <Progress value={progress} className="h-2 flex-1" />
                          <span className={`text-xs font-semibold ${progressColor} whitespace-nowrap`}>{requiredChecked}/{requiredTotal}</span>
                        </div>
                      </TableCell>
                      <TableCell><Badge className={`${statusCfg.bgClass} ${statusCfg.textClass} border-0 text-xs font-medium`}><StatusIcon className="h-3 w-3 mr-0.5" />{statusCfg.label}</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleReview(record)} className="gap-1 text-[#1B2A4A] border-[#1B2A4A]/20 hover:bg-[#1B2A4A] hover:text-white">
                          <ClipboardCheck className="h-3.5 w-3.5" />Review
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

      {totalPages > 1 && <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}

      {/* Review Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#1B2A4A] flex items-center gap-2"><ClipboardCheck className="h-5 w-5 text-[#D4AD63]" />Review Verification</DialogTitle>
            <DialogDescription>Review the applicant&apos;s submitted requirements and take action.</DialogDescription>
          </DialogHeader>
          {selectedRecord && (() => {
            const grouped = groupByCategory(selectedRecord.requirements)
            const requiredTotal = selectedRecord.requirements.filter((r) => r.required).length
            const requiredChecked = selectedRecord.requirements.filter((r) => r.required && (checkedRequirements[r.id] ?? r.checked)).length
            const progressColor = dialogProgress === 100 ? "text-green-700" : dialogProgress >= 50 ? "text-[#D4AD63]" : "text-orange-600"
            return (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4 rounded-lg bg-[#1B2A4A]/5 p-4">
                  <div><p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Applicant</p><p className="text-sm font-semibold text-[#1B2A4A] mt-0.5">{selectedRecord.applicant}</p></div>
                  <div><p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Service Type</p><p className="text-sm font-semibold text-[#1B2A4A] mt-0.5">{selectedRecord.serviceType}</p></div>
                  <div><p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Submitted Date</p><p className="text-sm font-semibold text-[#1B2A4A] mt-0.5">{selectedRecord.submittedDate}</p></div>
                  <div><p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Status</p><div className="mt-0.5">{(() => { const cfg = verificationStatusConfig[selectedRecord.status]; const Icon = cfg.icon; return <Badge className={`${cfg.bgClass} ${cfg.textClass} border-0 text-xs font-medium`}><Icon className="h-3 w-3 mr-0.5" />{cfg.label}</Badge> })()}</div></div>
                </div>
                <div className="space-y-2 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-[#1B2A4A] flex items-center gap-1.5"><FileText className="h-4 w-4 text-[#D4AD63]" />Overall Progress</h4>
                    <span className={`text-sm font-bold ${progressColor}`}>{dialogProgress}%</span>
                  </div>
                  <Progress value={dialogProgress} className="h-3" />
                  <p className="text-xs text-muted-foreground"><span className="font-medium">{requiredChecked}</span> of <span className="font-medium">{requiredTotal}</span> required documents completed{dialogProgress === 100 && <span className="text-green-600 font-medium ml-1">— Ready for verification</span>}</p>
                </div>
                {Object.entries(grouped).map(([category, reqs]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="text-sm font-semibold text-[#1B2A4A] flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full bg-[#D4AD63]" />{category}</h4>
                    <div className="space-y-1 rounded-lg border p-2">
                      {reqs.map((req: RequirementCheckItem) => {
                        const isChecked = checkedRequirements[req.id] ?? req.checked
                        return (
                          <div key={req.id} className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors ${selectedRecord.status === "Verified" ? "" : "hover:bg-muted/50"}`}>
                            <Checkbox checked={isChecked} onCheckedChange={(checked) => handleCheckChange(req.id, checked === true)} disabled={selectedRecord.status === "Verified"} className="data-[state=checked]:bg-[#1B2A4A] data-[state=checked]:border-[#1B2A4A]" />
                            <span className={`text-sm flex-1 ${isChecked ? "text-foreground line-through opacity-60" : "text-foreground font-medium"}`}>{req.name}</span>
                            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-5 font-medium ${req.required ? "border-red-200 text-red-600 bg-red-50" : "border-gray-200 text-gray-500 bg-gray-50"}`}>{req.required ? "Required" : "Optional"}</Badge>
                            {isChecked && req.hasFile ? (<button className="inline-flex items-center gap-1 text-xs text-[#1B2A4A] hover:text-[#D4AD63] font-medium transition-colors"><Eye className="h-3.5 w-3.5" />View</button>) : !isChecked ? (<Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-[#D4AD63] hover:text-[#D4AD63] hover:bg-[#D4AD63]/10"><Upload className="h-3.5 w-3.5" />Upload</Button>) : null}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-[#1B2A4A] flex items-center gap-1.5"><FileText className="h-4 w-4 text-[#D4AD63]" />Verification Notes</h4>
                  <Textarea placeholder="Add verification notes..." value={verificationNotes} onChange={(e) => setVerificationNotes(e.target.value)} className="min-h-[80px] resize-none" disabled={selectedRecord.status === "Verified"} />
                </div>
                {selectedRecord.status === "Verified" ? (
                  <div className="flex items-center justify-center gap-2 pt-3 border-t">
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-green-50 border border-green-200">
                      <CheckCircle2 className="h-5 w-5 text-green-600" /><span className="text-sm font-semibold text-green-700">This verification has already been approved</span>
                    </div>
                  </div>
                ) : (
                  <DialogFooter className="flex-col sm:flex-row gap-2 pt-2 border-t">
                    <Button className="bg-green-600 hover:bg-green-700 text-white gap-1.5 flex-1 sm:flex-none" onClick={() => handleStatusUpdate("Verified")} disabled={dialogProgress < 100} title={dialogProgress < 100 ? "All required documents must be completed first" : "Approve verification"}><CheckCircle2 className="h-4 w-4" />Approve</Button>
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white gap-1.5 flex-1 sm:flex-none" onClick={() => handleStatusUpdate("Incomplete")}><AlertCircle className="h-4 w-4" />Mark Incomplete</Button>
                    <Button className="bg-red-600 hover:bg-red-700 text-white gap-1.5 flex-1 sm:flex-none" onClick={() => handleStatusUpdate("Rejected")}><XCircle className="h-4 w-4" />Reject</Button>
                  </DialogFooter>
                )}
              </div>
            )
          })()}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ============================================================================
// SHARED PAGINATION CONTROLS
// ============================================================================
function PaginationControls({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void }) {
  return (
    <div className="flex items-center justify-between pt-2">
      <p className="text-sm text-muted-foreground">
        Page <span className="font-medium text-foreground">{currentPage}</span> of <span className="font-medium text-foreground">{totalPages}</span>
      </p>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm" onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage <= 1} className="gap-1">
          <ChevronLeft className="h-4 w-4" /><span className="hidden sm:inline">Previous</span>
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button key={page} variant={page === currentPage ? "default" : "outline"} size="sm" onClick={() => onPageChange(page)} className={page === currentPage ? "bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 text-white" : ""}>{page}</Button>
        ))}
        <Button variant="outline" size="sm" onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage >= totalPages} className="gap-1">
          <span className="hidden sm:inline">Next</span><ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
