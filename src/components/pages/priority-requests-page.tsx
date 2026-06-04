"use client";

import { useState, useMemo } from "react";
import {
  priorityRequestsData,
  serviceTypes,
  type PriorityRequest,
  type PriorityRequestStatus,
  type PaymentStatus,
} from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Search,
  ShieldAlert,
  Plus,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Phone,
  User,
  CreditCard,
} from "lucide-react";

const ITEMS_PER_PAGE = 8;

const statusConfig: Record<
  PriorityRequestStatus,
  { bgClass: string; textClass: string }
> & { Low: { bgClass: string; textClass: string } } = {
  Urgent: {
    bgClass: "bg-red-100",
    textClass: "text-red-800",
  },
  High: {
    bgClass: "bg-orange-100",
    textClass: "text-orange-800",
  },
  Medium: {
    bgClass: "bg-yellow-100",
    textClass: "text-yellow-800",
  },
  Low: {
    bgClass: "bg-gray-100",
    textClass: "text-gray-700",
  },
  Scheduled: {
    bgClass: "bg-blue-100",
    textClass: "text-blue-800",
  },
};

const paymentConfig: Record<
  PaymentStatus,
  { bgClass: string; textClass: string }
> = {
  Paid: {
    bgClass: "bg-green-100",
    textClass: "text-green-800",
  },
  Partial: {
    bgClass: "bg-yellow-100",
    textClass: "text-yellow-800",
  },
  Pending: {
    bgClass: "bg-red-100",
    textClass: "text-red-800",
  },
  Waived: {
    bgClass: "bg-purple-100",
    textClass: "text-purple-800",
  },
};

const statusOptions: PriorityRequestStatus[] = [
  "Urgent",
  "High",
  "Medium",
  "Scheduled",
];
const paymentOptions: PaymentStatus[] = [
  "Paid",
  "Partial",
  "Pending",
  "Waived",
];

export function PriorityRequestsPage() {
  const [requestList, setRequestList] =
    useState<PriorityRequest[]>(priorityRequestsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [paymentFilter, setPaymentFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<PriorityRequest | null>(null);
  const [requestToDelete, setRequestToDelete] =
    useState<PriorityRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formServiceType, setFormServiceType] = useState<string>("");
  const [formFullName, setFormFullName] = useState("");
  const [formContact, setFormContact] = useState("");
  const [formDateTime, setFormDateTime] = useState("");
  const [formStatus, setFormStatus] = useState<string>("");
  const [formPayment, setFormPayment] = useState<string>("");

  // Edit form state
  const [editForm, setEditForm] = useState({
    serviceType: "",
    fullName: "",
    contact: "",
    dateTime: "",
    status: "" as string,
    payment: "" as string,
  });

  // Edit handler
  const handleOpenEdit = (request: PriorityRequest) => {
    setSelectedRequest(request);
    setEditForm({
      serviceType: request.serviceType,
      fullName: request.fullName,
      contact: request.contact,
      dateTime: request.dateTime,
      status: request.status,
      payment: request.payment,
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = () => {
    if (!selectedRequest || !editForm.fullName || !editForm.contact) return;
    setRequestList((prev) =>
      prev.map((r) =>
        r.id === selectedRequest.id
          ? {
              ...r,
              serviceType:
                editForm.serviceType as PriorityRequest["serviceType"],
              fullName: editForm.fullName,
              contact: editForm.contact,
              dateTime: editForm.dateTime,
              status: editForm.status as PriorityRequestStatus,
              payment: editForm.payment as PaymentStatus,
            }
          : r,
      ),
    );
    setEditDialogOpen(false);
    setSelectedRequest(null);
  };

  // Soft Delete handler (sets status to Low)
  const handleOpenDelete = (request: PriorityRequest) => {
    setRequestToDelete(request);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!requestToDelete) return;
    setRequestList((prev) =>
      prev.map((r) =>
        r.id === requestToDelete.id
          ? { ...r, status: "Low" as PriorityRequestStatus }
          : r,
      ),
    );
    setDeleteDialogOpen(false);
    setRequestToDelete(null);
  };

  // Filter priority requests
  const filteredRequests = useMemo(() => {
    return requestList.filter((r: PriorityRequest) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        r.fullName.toLowerCase().includes(query) ||
        r.contact.toLowerCase().includes(query);

      const matchesService =
        serviceFilter === "All" || r.serviceType === serviceFilter;
      const matchesStatus = statusFilter === "All" || r.status === statusFilter;
      const matchesPayment =
        paymentFilter === "All" || r.payment === paymentFilter;

      return matchesSearch && matchesService && matchesStatus && matchesPayment;
    });
  }, [requestList, searchQuery, serviceFilter, statusFilter, paymentFilter]);

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredRequests.length / ITEMS_PER_PAGE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedRequests = filteredRequests.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE,
  );

  const handleFilterChange =
    (setter: (val: string) => void) => (val: string) => {
      setter(val);
      setCurrentPage(1);
    };

  const resetForm = () => {
    setFormServiceType("");
    setFormFullName("");
    setFormContact("");
    setFormDateTime("");
    setFormStatus("");
    setFormPayment("");
  };

  const handleSubmit = () => {
    // In a real app, this would send data to the API
    resetForm();
    setDialogOpen(false);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1B2A4A] flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-[#D4AD63]" />
            Priority Requests
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and track priority sacrament requests
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-[#1B2A4A]">
                Add Priority Request
              </DialogTitle>
              <DialogDescription>
                Fill in the details to create a new priority request.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="form-service-type">Service Type</Label>
                <Select
                  value={formServiceType}
                  onValueChange={setFormServiceType}
                >
                  <SelectTrigger id="form-service-type" className="w-full">
                    <SelectValue placeholder="Select service type" />
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
              <div className="grid gap-2">
                <Label htmlFor="form-full-name">Full Name</Label>
                <Input
                  id="form-full-name"
                  placeholder="Enter full name"
                  value={formFullName}
                  onChange={(e) => setFormFullName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="form-contact">Contact</Label>
                <Input
                  id="form-contact"
                  placeholder="Enter contact number"
                  value={formContact}
                  onChange={(e) => setFormContact(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="form-date-time">Date & Time</Label>
                <Input
                  id="form-date-time"
                  placeholder="e.g. 2025-04-20 10:00 AM"
                  value={formDateTime}
                  onChange={(e) => setFormDateTime(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="form-status">Status</Label>
                <Select value={formStatus} onValueChange={setFormStatus}>
                  <SelectTrigger id="form-status" className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="form-payment">Payment</Label>
                <Select value={formPayment} onValueChange={setFormPayment}>
                  <SelectTrigger id="form-payment" className="w-full">
                    <SelectValue placeholder="Select payment status" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentOptions.map((payment) => (
                      <SelectItem key={payment} value={payment}>
                        {payment}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => handleDialogOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 text-white"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search & Filters */}
      <Card className="py-0 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or contact..."
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
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
                  Payment:
                </span>
                <Select
                  value={paymentFilter}
                  onValueChange={handleFilterChange(setPaymentFilter)}
                >
                  <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Payments</SelectItem>
                    {paymentOptions.map((payment) => (
                      <SelectItem key={payment} value={payment}>
                        {payment}
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
          <span className="font-medium text-foreground">
            {filteredRequests.length}
          </span>{" "}
          request{filteredRequests.length !== 1 ? "s" : ""}
          {filteredRequests.length !== requestList.length && (
            <span>
              {" "}
              (filtered from{" "}
              <span className="font-medium text-foreground">
                {requestList.length}
              </span>
              )
            </span>
          )}
        </p>
      </div>

      {/* Table */}
      {filteredRequests.length === 0 ? (
        <Card className="py-0 overflow-hidden">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <ShieldAlert className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-semibold text-foreground">
              No priority requests found
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search or filter criteria.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="py-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#1B2A4A]/5 hover:bg-[#1B2A4A]/5">
                <TableHead className="text-[#1B2A4A] font-semibold">
                  Service Type
                </TableHead>
                <TableHead className="text-[#1B2A4A] font-semibold">
                  Full Name
                </TableHead>
                <TableHead className="text-[#1B2A4A] font-semibold hidden md:table-cell">
                  Contact
                </TableHead>
                <TableHead className="text-[#1B2A4A] font-semibold hidden sm:table-cell">
                  Date & Time
                </TableHead>
                <TableHead className="text-[#1B2A4A] font-semibold">
                  Status
                </TableHead>
                <TableHead className="text-[#1B2A4A] font-semibold">
                  Payment
                </TableHead>
                <TableHead className="text-[#1B2A4A] font-semibold text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRequests.map((request) => {
                const statusCfg = statusConfig[request.status];
                const paymentCfg = paymentConfig[request.payment];

                return (
                  <TableRow
                    key={request.id}
                    className="hover:bg-[#1B2A4A]/[0.02]"
                  >
                    <TableCell>
                      <span className="text-xs bg-[#1B2A4A]/5 text-[#1B2A4A]/80 px-2 py-1 rounded-md font-medium">
                        {request.serviceType}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-[#1B2A4A]">
                      {request.fullName}
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden md:table-cell">
                      {request.contact}
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden sm:table-cell">
                      {request.dateTime}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${statusCfg.bgClass} ${statusCfg.textClass} border-0 text-xs font-medium`}
                      >
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${paymentCfg.bgClass} ${paymentCfg.textClass} border-0 text-xs font-medium`}
                      >
                        {request.payment}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-[#1B2A4A] hover:text-[#1B2A4A]/80 hover:bg-[#1B2A4A]/10"
                          onClick={() => {
                            setSelectedRequest(request);
                            setViewDialogOpen(true);
                          }}
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          onClick={() => handleOpenEdit(request)}
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-red-600 hover:text-red-800 hover:bg-red-50"
                          onClick={() => handleOpenDelete(request)}
                          title="Soft Delete"
                          disabled={request.status === "Low"}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#1B2A4A] flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-[#D4AD63]" />
              Priority Request Details
            </DialogTitle>
            <DialogDescription>
              Viewing details for the selected priority request
            </DialogDescription>
          </DialogHeader>

          {selectedRequest &&
            (() => {
              const sCfg = statusConfig[selectedRequest.status] || {
                bgClass: "bg-gray-100",
                textClass: "text-gray-700",
              };
              const pCfg = paymentConfig[selectedRequest.payment];
              return (
                <div className="space-y-4">
                  <div className="bg-[#1B2A4A]/5 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-[#1B2A4A]">
                      {selectedRequest.fullName}
                    </h3>
                    <div className="flex gap-2 mt-2">
                      <Badge
                        className={`${sCfg.bgClass} ${sCfg.textClass} border-0 text-xs font-medium`}
                      >
                        {selectedRequest.status}
                      </Badge>
                      <Badge
                        className={`${pCfg.bgClass} ${pCfg.textClass} border-0 text-xs font-medium`}
                      >
                        {selectedRequest.payment}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1B2A4A]/10">
                        <User className="h-4 w-4 text-[#1B2A4A]" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Full Name
                        </p>
                        <p className="font-medium text-[#1B2A4A]">
                          {selectedRequest.fullName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1B2A4A]/10">
                        <Phone className="h-4 w-4 text-[#1B2A4A]" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Contact</p>
                        <p className="font-medium text-[#1B2A4A]">
                          {selectedRequest.contact}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1B2A4A]/10">
                        <CalendarDays className="h-4 w-4 text-[#1B2A4A]" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Date &amp; Time
                        </p>
                        <p className="font-medium text-[#1B2A4A]">
                          {selectedRequest.dateTime}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1B2A4A]/10">
                        <CreditCard className="h-4 w-4 text-[#1B2A4A]" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Service Type
                        </p>
                        <p className="font-medium text-[#1B2A4A]">
                          <span className="text-xs bg-[#1B2A4A]/5 text-[#1B2A4A]/80 px-2 py-0.5 rounded-md font-medium">
                            {selectedRequest.serviceType}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
        </DialogContent>
      </Dialog>

      {/* Edit Priority Request Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#1B2A4A] flex items-center gap-2">
              <Pencil className="h-5 w-5" />
              Edit Priority Request
            </DialogTitle>
            <DialogDescription>
              Update priority request information
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-service-type">Service Type</Label>
              <Select
                value={editForm.serviceType}
                onValueChange={(val) =>
                  setEditForm((prev) => ({ ...prev, serviceType: val }))
                }
              >
                <SelectTrigger id="edit-service-type">
                  <SelectValue placeholder="Select service type" />
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
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="edit-full-name">Full Name</Label>
                <Input
                  id="edit-full-name"
                  value={editForm.fullName}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                  placeholder="Enter full name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-contact">Contact</Label>
                <Input
                  id="edit-contact"
                  value={editForm.contact}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      contact: e.target.value,
                    }))
                  }
                  placeholder="Enter contact number"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-date-time">Date & Time</Label>
              <Input
                id="edit-date-time"
                value={editForm.dateTime}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, dateTime: e.target.value }))
                }
                placeholder="e.g. 2025-04-20 10:00 AM"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editForm.status}
                  onValueChange={(val) =>
                    setEditForm((prev) => ({ ...prev, status: val }))
                  }
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-payment">Payment</Label>
                <Select
                  value={editForm.payment}
                  onValueChange={(val) =>
                    setEditForm((prev) => ({ ...prev, payment: val }))
                  }
                >
                  <SelectTrigger id="edit-payment">
                    <SelectValue placeholder="Select payment" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentOptions.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setEditDialogOpen(false);
                setSelectedRequest(null);
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 text-white"
              onClick={handleEditSubmit}
              disabled={!editForm.fullName || !editForm.contact}
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
            <AlertDialogTitle className="text-[#1B2A4A]">
              Confirm Soft Delete
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to soft delete the priority request for{" "}
              <span className="font-semibold text-foreground">
                {requestToDelete?.fullName}
              </span>
              ? The request will be marked as Low priority and can be restored
              by editing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRequestToDelete(null)}>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-muted-foreground">
            Page{" "}
            <span className="font-medium text-foreground">
              {safeCurrentPage}
            </span>{" "}
            of <span className="font-medium text-foreground">{totalPages}</span>
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
  );
}
