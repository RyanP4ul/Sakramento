"use client"

import { useState, useMemo } from "react"
import {
  priests,
  serviceTypes,
  weekdays,
  type Priest,
  type PriestStatus,
  type PriestAvailability,
  type Weekday,
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
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
  ChevronLeft,
  ChevronRight,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Users,
  UserCheck,
  UserX,
  Mail,
  Phone,
  CalendarDays,
  Church,
} from "lucide-react"

const ITEMS_PER_PAGE = 8

const priestTitleOptions = [
  "Parish Priest",
  "Assistant Parish Priest",
  "Auxiliary Bishop",
  "Visiting Priest",
  "Retired Priest",
  "Associate Priest",
  "Chaplain",
]

const statusOptions: PriestStatus[] = ["Active", "On Leave", "Retired"]
const availabilityOptions: PriestAvailability[] = ["Available", "Busy", "On Leave"]

const statusConfig: Record<
  PriestStatus,
  { label: string; bgClass: string; textClass: string }
> = {
  Active: {
    label: "Active",
    bgClass: "bg-green-100",
    textClass: "text-green-800",
  },
  "On Leave": {
    label: "On Leave",
    bgClass: "bg-orange-100",
    textClass: "text-orange-800",
  },
  Retired: {
    label: "Retired",
    bgClass: "bg-gray-100",
    textClass: "text-gray-700",
  },
}

const availabilityConfig: Record<
  PriestAvailability,
  { label: string; bgClass: string; textClass: string }
> = {
  Available: {
    label: "Available",
    bgClass: "bg-green-100",
    textClass: "text-green-800",
  },
  Busy: {
    label: "Busy",
    bgClass: "bg-red-100",
    textClass: "text-red-800",
  },
  "On Leave": {
    label: "On Leave",
    bgClass: "bg-orange-100",
    textClass: "text-orange-800",
  },
}

const weekdayShortLabels: Record<Weekday, string> = {
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
}

interface FormData {
  name: string
  title: string
  email: string
  phone: string
  ordinationDate: string
  assignedServices: string[]
  preferredWeekdays: Weekday[]
}

const emptyFormData: FormData = {
  name: "",
  title: "Parish Priest",
  email: "",
  phone: "",
  ordinationDate: "",
  assignedServices: [],
  preferredWeekdays: [],
}

export function PriestManagementPage() {
  const [priestList, setPriestList] = useState<Priest[]>(priests)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("All")
  const [currentPage, setCurrentPage] = useState(1)

  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedPriest, setSelectedPriest] = useState<Priest | null>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [priestToDelete, setPriestToDelete] = useState<Priest | null>(null)
  const [formData, setFormData] = useState<FormData>(emptyFormData)

  // Calculate stats from priestList
  const stats = useMemo(() => {
    const active = priestList.filter((p) => p.status === "Active").length
    const available = priestList.filter((p) => p.availability === "Available").length
    const onLeave = priestList.filter((p) => p.status === "On Leave").length
    return { active, available, onLeave }
  }, [priestList])

  // Filter priests
  const filteredPriests = useMemo(() => {
    return priestList.filter((p: Priest) => {
      const query = searchQuery.toLowerCase()
      const matchesSearch = !query || p.name.toLowerCase().includes(query)

      const matchesStatus = statusFilter === "All" || p.status === statusFilter
      const matchesAvailability =
        availabilityFilter === "All" || p.availability === availabilityFilter

      return matchesSearch && matchesStatus && matchesAvailability
    })
  }, [priestList, searchQuery, statusFilter, availabilityFilter])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredPriests.length / ITEMS_PER_PAGE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedPriests = filteredPriests.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  )

  const handleFilterChange = (setter: (val: string) => void) => (val: string) => {
    setter(val)
    setCurrentPage(1)
  }

  // View Details
  const handleViewDetails = (priest: Priest) => {
    setSelectedPriest(priest)
    setViewDialogOpen(true)
  }

  // Add Priest
  const handleOpenAdd = () => {
    setFormData(emptyFormData)
    setAddDialogOpen(true)
  }

  const handleAddSubmit = () => {
    if (!formData.name || !formData.title || !formData.email) return
    const newId = Math.max(...priestList.map((p) => p.id), 0) + 1
    const currentYear = new Date().getFullYear()
    const newPriest: Priest = {
      id: newId,
      name: formData.name,
      title: formData.title,
      status: "Active",
      availability: "Available",
      servicePeriod: `${currentYear} - Present`,
      assignedServices: formData.assignedServices,
      preferredWeekdays: formData.preferredWeekdays,
      email: formData.email,
      phone: formData.phone,
      ordinationDate: formData.ordinationDate,
    }
    setPriestList((prev) => [...prev, newPriest])
    setAddDialogOpen(false)
    setFormData(emptyFormData)
  }

  // Edit Priest
  const handleOpenEdit = (priest: Priest) => {
    setFormData({
      name: priest.name,
      title: priest.title,
      email: priest.email,
      phone: priest.phone,
      ordinationDate: priest.ordinationDate,
      assignedServices: [...priest.assignedServices],
      preferredWeekdays: [...priest.preferredWeekdays],
    })
    setSelectedPriest(priest)
    setEditDialogOpen(true)
  }

  const handleEditSubmit = () => {
    if (!selectedPriest || !formData.name || !formData.title || !formData.email) return
    setPriestList((prev) =>
      prev.map((p) =>
        p.id === selectedPriest.id
          ? {
              ...p,
              name: formData.name,
              title: formData.title,
              email: formData.email,
              phone: formData.phone,
              ordinationDate: formData.ordinationDate,
              assignedServices: formData.assignedServices,
              preferredWeekdays: formData.preferredWeekdays,
            }
          : p
      )
    )
    setEditDialogOpen(false)
    setSelectedPriest(null)
    setFormData(emptyFormData)
  }

  // Soft Delete
  const handleOpenDelete = (priest: Priest) => {
    setPriestToDelete(priest)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!priestToDelete) return
    setPriestList((prev) =>
      prev.map((p) =>
        p.id === priestToDelete.id ? { ...p, status: "Retired" as PriestStatus, availability: "On Leave" as PriestAvailability } : p
      )
    )
    setDeleteDialogOpen(false)
    setPriestToDelete(null)
  }

  // Toggle assigned service
  const handleToggleService = (service: string) => {
    setFormData((prev) => {
      const services = prev.assignedServices.includes(service)
        ? prev.assignedServices.filter((s) => s !== service)
        : [...prev.assignedServices, service]
      return { ...prev, assignedServices: services }
    })
  }

  // Toggle preferred weekday
  const handleToggleWeekday = (day: Weekday) => {
    setFormData((prev) => {
      const days = prev.preferredWeekdays.includes(day)
        ? prev.preferredWeekdays.filter((d) => d !== day)
        : [...prev.preferredWeekdays, day]
      return { ...prev, preferredWeekdays: days }
    })
  }

  const statCards = [
    {
      label: "Active Priests",
      count: stats.active,
      icon: Users,
      bgClass: "bg-green-50 border-green-200",
      iconClass: "text-green-600",
      countClass: "text-green-700",
    },
    {
      label: "Available",
      count: stats.available,
      icon: UserCheck,
      bgClass: "bg-blue-50 border-blue-200",
      iconClass: "text-blue-600",
      countClass: "text-blue-700",
    },
    {
      label: "On Leave",
      count: stats.onLeave,
      icon: UserX,
      bgClass: "bg-orange-50 border-orange-200",
      iconClass: "text-orange-600",
      countClass: "text-orange-700",
    },
  ]

  // Form field renderer
  const renderFormFields = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="priestName">Name</Label>
        <Input
          id="priestName"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="e.g. Fr. Antonio Santos"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="priestTitle">Title</Label>
        <Select
          value={formData.title}
          onValueChange={(val) => setFormData((prev) => ({ ...prev, title: val }))}
        >
          <SelectTrigger id="priestTitle">
            <SelectValue placeholder="Select title" />
          </SelectTrigger>
          <SelectContent>
            {priestTitleOptions.map((title) => (
              <SelectItem key={title} value={title}>
                {title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="priestEmail">Email</Label>
        <Input
          id="priestEmail"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
          placeholder="e.g. fr.santos@sakramentohub.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="priestPhone">Phone</Label>
        <Input
          id="priestPhone"
          value={formData.phone}
          onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
          placeholder="e.g. +63 917 111 1111"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ordinationDate">Ordination Date</Label>
        <Input
          id="ordinationDate"
          type="date"
          value={formData.ordinationDate}
          onChange={(e) => setFormData((prev) => ({ ...prev, ordinationDate: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label>Assigned Services</Label>
        <div className="grid grid-cols-2 gap-3 rounded-md border p-3 bg-muted/30">
          {serviceTypes.map((service) => (
            <div key={service} className="flex items-center gap-2">
              <Checkbox
                id={`service-${service}`}
                checked={formData.assignedServices.includes(service)}
                onCheckedChange={() => handleToggleService(service)}
              />
              <Label
                htmlFor={`service-${service}`}
                className="text-sm font-normal cursor-pointer"
              >
                {service}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Preferred Weekdays</Label>
        <div className="flex flex-wrap gap-2 rounded-md border p-3 bg-muted/30">
          {weekdays.map((day) => {
            const isSelected = formData.preferredWeekdays.includes(day)
            const short = weekdayShortLabels[day]
            return (
              <button
                key={day}
                type="button"
                onClick={() => handleToggleWeekday(day)}
                className={cn(
                  "flex h-9 w-12 items-center justify-center rounded-md text-xs font-semibold transition-all duration-150 border",
                  isSelected
                    ? "bg-[#1B2A4A] text-white border-[#1B2A4A] shadow-sm"
                    : "bg-white text-muted-foreground border-muted hover:border-[#1B2A4A]/30 hover:text-[#1B2A4A]"
                )}
              >
                {short}
              </button>
            )
          })}
        </div>
        <p className="text-xs text-muted-foreground">Select the weekdays this priest prefers to serve.</p>
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
                  placeholder="Search by priest name..."
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
                Add Priest
              </Button>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-3">
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

              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                  Availability:
                </span>
                <Select
                  value={availabilityFilter}
                  onValueChange={handleFilterChange(setAvailabilityFilter)}
                >
                  <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    {availabilityOptions.map((avail) => (
                      <SelectItem key={avail} value={avail}>
                        {avail}
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
          <span className="font-medium text-foreground">{filteredPriests.length}</span> priest
          {filteredPriests.length !== 1 ? "s" : ""}
          {filteredPriests.length !== priestList.length && (
            <span>
              {" "}
              (filtered from <span className="font-medium text-foreground">{priestList.length}</span>)
            </span>
          )}
        </p>
      </div>

      {/* Table */}
      {filteredPriests.length === 0 ? (
        <Card className="py-0 overflow-hidden">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <Church className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No priests found</h3>
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
                  <TableHead className="text-[#1B2A4A] font-semibold">Priest Name</TableHead>
                  <TableHead className="text-[#1B2A4A] font-semibold">Title</TableHead>
                  <TableHead className="text-[#1B2A4A] font-semibold">Status</TableHead>
                  <TableHead className="text-[#1B2A4A] font-semibold">Availability</TableHead>
                  <TableHead className="text-[#1B2A4A] font-semibold hidden md:table-cell">Preferred Days</TableHead>
                  <TableHead className="text-[#1B2A4A] font-semibold hidden lg:table-cell">Assigned Services</TableHead>
                  <TableHead className="text-[#1B2A4A] font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPriests.map((priest) => {
                  const statusCfg = statusConfig[priest.status]
                  const availCfg = availabilityConfig[priest.availability]
                  return (
                    <TableRow key={priest.id}>
                      <TableCell className="font-medium text-[#1B2A4A]">
                        {priest.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {priest.title}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${statusCfg.bgClass} ${statusCfg.textClass} border-0 text-xs font-medium`}
                        >
                          {statusCfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${availCfg.bgClass} ${availCfg.textClass} border-0 text-xs font-medium`}
                        >
                          {availCfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {priest.preferredWeekdays.length > 0 ? (
                            priest.preferredWeekdays.map((day) => {
                              const short = weekdayShortLabels[day]
                              return (
                                <span
                                  key={day}
                                  className="inline-flex h-6 items-center justify-center rounded bg-[#1B2A4A]/10 px-1.5 text-[10px] font-semibold text-[#1B2A4A]"
                                >
                                  {short}
                                </span>
                              )
                            })
                          ) : (
                            <span className="text-xs text-muted-foreground">None</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {priest.assignedServices.length > 0 ? (
                            priest.assignedServices.map((service) => (
                              <Badge
                                key={service}
                                variant="outline"
                                className="text-xs bg-[#D4AD63]/10 text-[#D4AD63] border-[#D4AD63]/30 font-medium"
                              >
                                {service}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">None</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-[#1B2A4A] hover:text-[#1B2A4A]/80 hover:bg-[#1B2A4A]/10"
                            onClick={() => handleViewDetails(priest)}
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                            onClick={() => handleOpenEdit(priest)}
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-red-600 hover:text-red-800 hover:bg-red-50"
                            onClick={() => handleOpenDelete(priest)}
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
              <Church className="h-5 w-5 text-[#D4AD63]" />
              Priest Details
            </DialogTitle>
            <DialogDescription>
              Viewing detailed information for the selected priest
            </DialogDescription>
          </DialogHeader>

          {selectedPriest && (
            <div className="space-y-4">
              {/* Header Card */}
              <div className="bg-[#1B2A4A]/5 rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#1B2A4A] text-white text-lg font-bold">
                    {selectedPriest.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-[#1B2A4A]">{selectedPriest.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedPriest.title}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge
                        className={`${statusConfig[selectedPriest.status].bgClass} ${statusConfig[selectedPriest.status].textClass} border-0 text-xs font-medium`}
                      >
                        {selectedPriest.status}
                      </Badge>
                      <Badge
                        className={`${availabilityConfig[selectedPriest.availability].bgClass} ${availabilityConfig[selectedPriest.availability].textClass} border-0 text-xs font-medium`}
                      >
                        {selectedPriest.availability}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Service Period</p>
                  <p className="font-medium">{selectedPriest.servicePeriod}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ordination Date</p>
                  <p className="font-medium">{selectedPriest.ordinationDate}</p>
                </div>
              </div>

              <Separator />

              {/* Preferred Weekdays */}
              <div>
                <h4 className="text-sm font-semibold text-[#1B2A4A] mb-3 flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 text-[#D4AD63]" />
                  Preferred Weekdays
                </h4>
                {selectedPriest.preferredWeekdays.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {weekdays.map((day) => {
                      const isSelected = selectedPriest.preferredWeekdays.includes(day)
                      const short = weekdayShortLabels[day]
                      return (
                        <span
                          key={day}
                          className={cn(
                            "inline-flex h-8 items-center justify-center rounded-md px-2.5 text-xs font-semibold transition-all border",
                            isSelected
                              ? "bg-[#1B2A4A] text-white border-[#1B2A4A]"
                              : "bg-muted/30 text-muted-foreground border-muted"
                          )}
                        >
                          {short}
                        </span>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No preferred weekdays set</p>
                )}
              </div>

              <Separator />

              {/* Contact Info */}
              <div>
                <h4 className="text-sm font-semibold text-[#1B2A4A] mb-3">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedPriest.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedPriest.phone}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Assigned Services */}
              <div>
                <h4 className="text-sm font-semibold text-[#1B2A4A] mb-3">Assigned Services</h4>
                {selectedPriest.assignedServices.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedPriest.assignedServices.map((service) => (
                      <Badge
                        key={service}
                        variant="outline"
                        className="bg-[#D4AD63]/10 text-[#D4AD63] border-[#D4AD63]/30 font-medium"
                      >
                        {service}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No services assigned</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Priest Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#1B2A4A] flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Priest
            </DialogTitle>
            <DialogDescription>
              Create a new priest profile entry
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
              disabled={!formData.name || !formData.title || !formData.email}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Priest Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#1B2A4A] flex items-center gap-2">
              <Pencil className="h-5 w-5" />
              Edit Priest
            </DialogTitle>
            <DialogDescription>
              Update priest profile information
            </DialogDescription>
          </DialogHeader>

          {renderFormFields()}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setEditDialogOpen(false)
                setSelectedPriest(null)
                setFormData(emptyFormData)
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 text-white"
              onClick={handleEditSubmit}
              disabled={!formData.name || !formData.title || !formData.email}
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
              Are you sure you want to soft delete{" "}
              <span className="font-semibold text-foreground">{priestToDelete?.name}</span>?
              The priest will be marked as Retired and set to On Leave status. This action can be
              reversed by editing the priest profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPriestToDelete(null)}>
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
