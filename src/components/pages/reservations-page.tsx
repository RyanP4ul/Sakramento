"use client"

import { useState, useMemo } from "react"
import {
  reservations,
  serviceTypes,
  type Reservation,
  type ReservationStatus,
  type PriorityLevel,
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
  XCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react"

const ITEMS_PER_PAGE = 6

const statusConfig: Record<
  ReservationStatus,
  { label: string; bgClass: string; textClass: string; icon: React.ElementType }
> = {
  Pending: {
    label: "Pending",
    bgClass: "bg-yellow-100",
    textClass: "text-yellow-800",
    icon: Clock,
  },
  Approved: {
    label: "Approved",
    bgClass: "bg-blue-100",
    textClass: "text-blue-800",
    icon: CheckCircle,
  },
  Completed: {
    label: "Completed",
    bgClass: "bg-green-100",
    textClass: "text-green-800",
    icon: CheckCircle,
  },
  Cancelled: {
    label: "Cancelled",
    bgClass: "bg-red-100",
    textClass: "text-red-800",
    icon: XCircle,
  },
}

const priorityConfig: Record<
  PriorityLevel,
  { label: string; bgClass: string; textClass: string }
> = {
  High: {
    label: "High",
    bgClass: "bg-red-100",
    textClass: "text-red-800",
  },
  Medium: {
    label: "Medium",
    bgClass: "bg-yellow-100",
    textClass: "text-yellow-800",
  },
  Low: {
    label: "Low",
    bgClass: "bg-gray-100",
    textClass: "text-gray-700",
  },
}

interface EditFormData {
  title: string
  requester: string
  date: string
  contactNumber: string
  serviceType: string
  priority: PriorityLevel
  status: ReservationStatus
  description: string
}

const emptyEditForm: EditFormData = {
  title: "",
  requester: "",
  date: "",
  contactNumber: "",
  serviceType: "Baptism",
  priority: "Medium",
  status: "Pending",
  description: "",
}

export function ReservationsPage() {
  const [reservationList, setReservationList] = useState<Reservation[]>(reservations)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [serviceFilter, setServiceFilter] = useState<string>("All")
  const [priorityFilter, setPriorityFilter] = useState<string>("All")
  const [dateFrom, setDateFrom] = useState<string>("")
  const [dateTo, setDateTo] = useState<string>("")
  const [currentPage, setCurrentPage] = useState(1)

  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [reservationToDelete, setReservationToDelete] = useState<Reservation | null>(null)
  const [editForm, setEditForm] = useState<EditFormData>(emptyEditForm)

  // Calculate stats from reservationList
  const stats = useMemo(() => {
    const pending = reservationList.filter((r) => r.status === "Pending").length
    const approved = reservationList.filter((r) => r.status === "Approved").length
    const completed = reservationList.filter((r) => r.status === "Completed").length
    const cancelled = reservationList.filter((r) => r.status === "Cancelled").length
    return { pending, approved, completed, cancelled }
  }, [reservationList])

  // Filter reservations
  const filteredReservations = useMemo(() => {
    return reservationList.filter((r: Reservation) => {
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        !query ||
        r.title.toLowerCase().includes(query) ||
        r.requester.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query)

      const matchesStatus = statusFilter === "All" || r.status === statusFilter
      const matchesService = serviceFilter === "All" || r.serviceType === serviceFilter
      const matchesPriority = priorityFilter === "All" || r.priority === priorityFilter

      const reservationDate = new Date(r.date)
      const matchesDateFrom = !dateFrom || reservationDate >= new Date(dateFrom)
      const matchesDateTo = !dateTo || reservationDate <= new Date(dateTo + "T23:59:59")

      return matchesSearch && matchesStatus && matchesService && matchesPriority && matchesDateFrom && matchesDateTo
    })
  }, [reservationList, searchQuery, statusFilter, serviceFilter, priorityFilter, dateFrom, dateTo])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredReservations.length / ITEMS_PER_PAGE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedReservations = filteredReservations.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  )

  const handleFilterChange = (setter: (val: string) => void) => (val: string) => {
    setter(val)
    setCurrentPage(1)
  }

  // View Details
  const handleViewDetails = (reservation: Reservation) => {
    setSelectedReservation(reservation)
    setViewDialogOpen(true)
  }

  // Edit
  const handleOpenEdit = (reservation: Reservation) => {
    setEditForm({
      title: reservation.title,
      requester: reservation.requester,
      date: reservation.date,
      contactNumber: reservation.contactNumber,
      serviceType: reservation.serviceType,
      priority: reservation.priority,
      status: reservation.status,
      description: reservation.description,
    })
    setSelectedReservation(reservation)
    setEditDialogOpen(true)
  }

  const handleEditSubmit = () => {
    if (!selectedReservation || !editForm.title || !editForm.requester) return
    setReservationList((prev) =>
      prev.map((r) =>
        r.id === selectedReservation.id
          ? {
              ...r,
              title: editForm.title,
              requester: editForm.requester,
              date: editForm.date,
              contactNumber: editForm.contactNumber,
              serviceType: editForm.serviceType as Reservation["serviceType"],
              priority: editForm.priority,
              status: editForm.status,
              description: editForm.description,
            }
          : r
      )
    )
    setEditDialogOpen(false)
    setSelectedReservation(null)
    setEditForm(emptyEditForm)
  }

  // Soft Delete (sets status to Cancelled)
  const handleOpenDelete = (reservation: Reservation) => {
    setReservationToDelete(reservation)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!reservationToDelete) return
    setReservationList((prev) =>
      prev.map((r) =>
        r.id === reservationToDelete.id ? { ...r, status: "Cancelled" as ReservationStatus } : r
      )
    )
    setDeleteDialogOpen(false)
    setReservationToDelete(null)
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
      label: "Approved",
      count: stats.approved,
      icon: CheckCircle,
      bgClass: "bg-blue-50 border-blue-200",
      iconClass: "text-blue-600",
      countClass: "text-blue-700",
    },
    {
      label: "Completed",
      count: stats.completed,
      icon: CheckCircle,
      bgClass: "bg-green-50 border-green-200",
      iconClass: "text-green-600",
      countClass: "text-green-700",
    },
    {
      label: "Cancelled",
      count: stats.cancelled,
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
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/70`}
                >
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
                placeholder="Search by title, requester, or description..."
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
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
                  Priority:
                </span>
                <Select
                  value={priorityFilter}
                  onValueChange={handleFilterChange(setPriorityFilter)}
                >
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Priorities</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
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
            {filteredReservations.length}
          </span>{" "}
          reservation{filteredReservations.length !== 1 ? "s" : ""}
          {filteredReservations.length !== reservationList.length && (
            <span>
              {" "}
              (filtered from{" "}
              <span className="font-medium text-foreground">
                {reservationList.length}
              </span>
              )
            </span>
          )}
        </p>
      </div>

      {/* Reservations List */}
      {filteredReservations.length === 0 ? (
        <Card className="py-0 overflow-hidden">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <CalendarDays className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-semibold text-foreground">
              No reservations found
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search or filter criteria.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {paginatedReservations.map((reservation) => {
            const statusCfg = statusConfig[reservation.status]
            const priorityCfg = priorityConfig[reservation.priority]
            const StatusIcon = statusCfg.icon

            return (
              <Card
                key={reservation.id}
                className="py-0 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Left: Icon */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1B2A4A]/10">
                      <CalendarDays className="h-5 w-5 text-[#1B2A4A]" />
                    </div>

                    {/* Middle: Content */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <h3 className="font-semibold text-[#1B2A4A] text-base truncate">
                          {reservation.title}
                        </h3>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge
                            className={`${priorityCfg.bgClass} ${priorityCfg.textClass} border-0 text-xs font-medium`}
                          >
                            {reservation.priority === "High" && (
                              <AlertTriangle className="h-3 w-3 mr-0.5" />
                            )}
                            {priorityCfg.label}
                          </Badge>
                          <Badge
                            className={`${statusCfg.bgClass} ${statusCfg.textClass} border-0 text-xs font-medium`}
                          >
                            <StatusIcon className="h-3 w-3 mr-0.5" />
                            {statusCfg.label}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {reservation.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="font-medium text-foreground/80">
                            {reservation.requester}
                          </span>
                        </span>
                        <span className="text-xs bg-[#1B2A4A]/5 text-[#1B2A4A]/70 px-2 py-0.5 rounded-md font-medium">
                          {reservation.serviceType}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {reservation.description}
                      </p>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-[#1B2A4A] hover:text-[#1B2A4A]/80 hover:bg-[#1B2A4A]/10"
                        onClick={() => handleViewDetails(reservation)}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        onClick={() => handleOpenEdit(reservation)}
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-red-600 hover:text-red-800 hover:bg-red-50"
                        onClick={() => handleOpenDelete(reservation)}
                        title="Soft Delete"
                        disabled={reservation.status === "Cancelled"}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
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

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#1B2A4A] flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-[#D4AD63]" />
              Reservation Details
            </DialogTitle>
            <DialogDescription>
              Viewing details for the selected reservation
            </DialogDescription>
          </DialogHeader>

          {selectedReservation && (
            <div className="space-y-4">
              <div className="bg-[#1B2A4A]/5 rounded-lg p-4">
                <h3 className="text-lg font-bold text-[#1B2A4A]">
                  {selectedReservation.title}
                </h3>
                <div className="flex gap-2 mt-2">
                  <Badge
                    className={`${priorityConfig[selectedReservation.priority].bgClass} ${priorityConfig[selectedReservation.priority].textClass} border-0 text-xs font-medium`}
                  >
                    {selectedReservation.priority === "High" && (
                      <AlertTriangle className="h-3 w-3 mr-0.5" />
                    )}
                    {selectedReservation.priority}
                  </Badge>
                  <Badge
                    className={`${statusConfig[selectedReservation.status].bgClass} ${statusConfig[selectedReservation.status].textClass} border-0 text-xs font-medium`}
                  >
                    {selectedReservation.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Requester</p>
                  <p className="font-medium">{selectedReservation.requester}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact</p>
                  <p className="font-medium">{selectedReservation.contactNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{selectedReservation.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Service Type</p>
                  <p className="font-medium">{selectedReservation.serviceType}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="text-sm leading-relaxed">{selectedReservation.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Reservation Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#1B2A4A] flex items-center gap-2">
              <Pencil className="h-5 w-5" />
              Edit Reservation
            </DialogTitle>
            <DialogDescription>
              Update reservation information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editForm.title}
                onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter reservation title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-requester">Requester</Label>
              <Input
                id="edit-requester"
                value={editForm.requester}
                onChange={(e) => setEditForm((prev) => ({ ...prev, requester: e.target.value }))}
                placeholder="Enter requester name"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="edit-date">Date</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-contact">Contact Number</Label>
                <Input
                  id="edit-contact"
                  value={editForm.contactNumber}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, contactNumber: e.target.value }))}
                  placeholder="+63 917 111 1111"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="edit-service">Service Type</Label>
                <Select
                  value={editForm.serviceType}
                  onValueChange={(val) => setEditForm((prev) => ({ ...prev, serviceType: val }))}
                >
                  <SelectTrigger id="edit-service">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-priority">Priority</Label>
                <Select
                  value={editForm.priority}
                  onValueChange={(val) => setEditForm((prev) => ({ ...prev, priority: val as PriorityLevel }))}
                >
                  <SelectTrigger id="edit-priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={editForm.status}
                onValueChange={(val) => setEditForm((prev) => ({ ...prev, status: val as ReservationStatus }))}
              >
                <SelectTrigger id="edit-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editForm.description}
                onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setEditDialogOpen(false)
                setSelectedReservation(null)
                setEditForm(emptyEditForm)
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 text-white"
              onClick={handleEditSubmit}
              disabled={!editForm.title || !editForm.requester}
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
              Are you sure you want to soft delete reservation{" "}
              <span className="font-semibold text-foreground">
                {reservationToDelete?.title}
              </span>
              ? The reservation will be marked as Cancelled and can be restored by editing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setReservationToDelete(null)}>
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
