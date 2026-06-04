"use client"

import { useState, useMemo } from "react"
import {
  users,
  type User,
  type UserStatus,
} from "@/lib/mock-data"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
  UserCheck,
  ShieldCheck,
  UserX,
  UserMinus,
  UserCheck2,
} from "lucide-react"

const ITEMS_PER_PAGE = 8

const statusOptions: UserStatus[] = ["Active", "Inactive", "Deactivated"]

const statusConfig: Record<
  UserStatus,
  { label: string; bgClass: string; textClass: string }
> = {
  Active: {
    label: "Active",
    bgClass: "bg-green-100",
    textClass: "text-green-800",
  },
  Inactive: {
    label: "Inactive",
    bgClass: "bg-gray-100",
    textClass: "text-gray-700",
  },
  Deactivated: {
    label: "Deactivated",
    bgClass: "bg-red-100",
    textClass: "text-red-800",
  },
}

interface AddFormData {
  name: string
  email: string
  role: string
  password: string
}

interface EditFormData {
  name: string
  email: string
  role: string
}

const emptyAddForm: AddFormData = {
  name: "",
  email: "",
  role: "Admin",
  password: "",
}

const emptyEditForm: EditFormData = {
  name: "",
  email: "",
  role: "Admin",
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function getAvatarColor(name: string): string {
  const colors = [
    "bg-[#1B2A4A]",
    "bg-[#D4AD63]",
    "bg-emerald-600",
    "bg-violet-600",
    "bg-rose-600",
    "bg-cyan-600",
    "bg-amber-600",
    "bg-teal-600",
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

export function UserManagementPage() {
  const [userList, setUserList] = useState<User[]>(users)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [currentPage, setCurrentPage] = useState(1)

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userToToggle, setUserToToggle] = useState<User | null>(null)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [addForm, setAddForm] = useState<AddFormData>(emptyAddForm)
  const [editForm, setEditForm] = useState<EditFormData>(emptyEditForm)

  // Calculate stats
  const stats = useMemo(() => {
    const total = userList.length
    const admins = userList.filter((u) => u.role === "Admin").length
    const active = userList.filter((u) => u.status === "Active").length
    return { total, admins, active }
  }, [userList])

  // Filter users
  const filteredUsers = useMemo(() => {
    return userList.filter((u: User) => {
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        !query ||
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query)

      const matchesStatus = statusFilter === "All" || u.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [userList, searchQuery, statusFilter])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / ITEMS_PER_PAGE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedUsers = filteredUsers.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  )

  const handleFilterChange = (setter: (val: string) => void) => (val: string) => {
    setter(val)
    setCurrentPage(1)
  }

  // Add User
  const handleOpenAdd = () => {
    setAddForm(emptyAddForm)
    setAddDialogOpen(true)
  }

  const handleAddSubmit = () => {
    if (!addForm.name || !addForm.email || !addForm.password) return
    const newId = Math.max(...userList.map((u) => u.id), 0) + 1
    const newUser: User = {
      id: newId,
      name: addForm.name,
      email: addForm.email,
      role: addForm.role,
      status: "Active",
      lastLogin: "Never",
    }
    setUserList((prev) => [...prev, newUser])
    setAddDialogOpen(false)
    setAddForm(emptyAddForm)
  }

  // Edit User
  const handleOpenEdit = (user: User) => {
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
    })
    setSelectedUser(user)
    setEditDialogOpen(true)
  }

  const handleEditSubmit = () => {
    if (!selectedUser || !editForm.name || !editForm.email) return
    setUserList((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id
          ? {
              ...u,
              name: editForm.name,
              email: editForm.email,
              role: editForm.role,
            }
          : u
      )
    )
    setEditDialogOpen(false)
    setSelectedUser(null)
    setEditForm(emptyEditForm)
  }

  // Deactivate/Activate
  const handleOpenDeactivate = (user: User) => {
    setUserToToggle(user)
    setDeactivateDialogOpen(true)
  }

  const handleConfirmDeactivate = () => {
    if (!userToToggle) return
    setUserList((prev) =>
      prev.map((u) =>
        u.id === userToToggle.id
          ? {
              ...u,
              status: u.status === "Deactivated" ? ("Active" as UserStatus) : ("Deactivated" as UserStatus),
            }
          : u
      )
    )
    setDeactivateDialogOpen(false)
    setUserToToggle(null)
  }

  // Soft Delete
  const handleOpenDelete = (user: User) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!userToDelete) return
    setUserList((prev) =>
      prev.map((u) =>
        u.id === userToDelete.id ? { ...u, status: "Inactive" as UserStatus } : u
      )
    )
    setDeleteDialogOpen(false)
    setUserToDelete(null)
  }

  const statCards = [
    {
      label: "Total Users",
      count: stats.total,
      icon: Users,
      bgClass: "bg-[#1B2A4A]/5 border-[#1B2A4A]/20",
      iconClass: "text-[#1B2A4A]",
      countClass: "text-[#1B2A4A]",
    },
    {
      label: "Admins",
      count: stats.admins,
      icon: ShieldCheck,
      bgClass: "bg-[#D4AD63]/10 border-[#D4AD63]/25",
      iconClass: "text-[#C49A3E]",
      countClass: "text-[#B8942E]",
    },
    {
      label: "Active",
      count: stats.active,
      icon: UserCheck,
      bgClass: "bg-green-50 border-green-200",
      iconClass: "text-green-600",
      countClass: "text-green-700",
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

      {/* Search & Filters + Add Button */}
      <Card className="py-0 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
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
                Add User
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


            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">{filteredUsers.length}</span> user
          {filteredUsers.length !== 1 ? "s" : ""}
          {filteredUsers.length !== userList.length && (
            <span>
              {" "}
              (filtered from <span className="font-medium text-foreground">{userList.length}</span>)
            </span>
          )}
        </p>
      </div>

      {/* Table */}
      {filteredUsers.length === 0 ? (
        <Card className="py-0 overflow-hidden">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <UserX className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No users found</h3>
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
                  <TableHead className="text-[#1B2A4A] font-semibold">Name</TableHead>
                  <TableHead className="text-[#1B2A4A] font-semibold">Email</TableHead>
                  <TableHead className="text-[#1B2A4A] font-semibold">Status</TableHead>
                  <TableHead className="text-[#1B2A4A] font-semibold hidden md:table-cell">Last Login</TableHead>
                  <TableHead className="text-[#1B2A4A] font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((user) => {
                  const statusCfg = statusConfig[user.status]
                  const avatarBg = getAvatarColor(user.name)
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback
                              className={`${avatarBg} text-white text-xs font-semibold`}
                            >
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">{user.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${statusCfg.bgClass} ${statusCfg.textClass} border-0 text-xs font-medium`}
                        >
                          {statusCfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm hidden md:table-cell">
                        {user.lastLogin}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-8 px-2 ${
                              user.status === "Deactivated"
                                ? "text-green-600 hover:text-green-800 hover:bg-green-50"
                                : "text-red-500 hover:text-red-700 hover:bg-red-50"
                            }`}
                            onClick={() => handleOpenDeactivate(user)}
                            title={user.status === "Deactivated" ? "Activate User" : "Deactivate User"}
                          >
                            {user.status === "Deactivated" ? (
                              <UserCheck2 className="h-4 w-4" />
                            ) : (
                              <UserMinus className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-[#1B2A4A] hover:text-[#1B2A4A]/80 hover:bg-[#1B2A4A]/10"
                            onClick={() => handleOpenEdit(user)}
                            title="Edit User"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-red-600 hover:text-red-800 hover:bg-red-50"
                            onClick={() => handleOpenDelete(user)}
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

      {/* Add User Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#1B2A4A] flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New User
            </DialogTitle>
            <DialogDescription>
              Create a new user account
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="add-name">Name</Label>
              <Input
                id="add-name"
                value={addForm.name}
                onChange={(e) => setAddForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-email">Email</Label>
              <Input
                id="add-email"
                type="email"
                value={addForm.email}
                onChange={(e) => setAddForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-password">Password</Label>
              <Input
                id="add-password"
                type="password"
                value={addForm.password}
                onChange={(e) => setAddForm((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="Enter password"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setAddDialogOpen(false)
                setAddForm(emptyAddForm)
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 text-white"
              onClick={handleAddSubmit}
              disabled={!addForm.name || !addForm.email || !addForm.password}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#1B2A4A] flex items-center gap-2">
              <Pencil className="h-5 w-5" />
              Edit User
            </DialogTitle>
            <DialogDescription>
              Update user account information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
              />
            </div>

          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setEditDialogOpen(false)
                setSelectedUser(null)
                setEditForm(emptyEditForm)
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 text-white"
              onClick={handleEditSubmit}
              disabled={!editForm.name || !editForm.email}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate/Activate Confirmation Dialog */}
      <AlertDialog open={deactivateDialogOpen} onOpenChange={setDeactivateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#1B2A4A]">
              {userToToggle?.status === "Deactivated" ? "Activate User" : "Deactivate User"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {userToToggle?.status === "Deactivated" ? (
                <>
                  Are you sure you want to activate{" "}
                  <span className="font-semibold text-foreground">{userToToggle?.name}</span>?
                  They will be able to log in and use the system again.
                </>
              ) : (
                <>
                  Are you sure you want to deactivate{" "}
                  <span className="font-semibold text-foreground">{userToToggle?.name}</span>?
                  They will not be able to log in until reactivated.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToToggle(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeactivate}
              className={
                userToToggle?.status === "Deactivated"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }
            >
              {userToToggle?.status === "Deactivated" ? "Activate" : "Deactivate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Soft Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#1B2A4A]">Confirm Soft Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to soft delete user{" "}
              <span className="font-semibold text-foreground">{userToDelete?.name}</span> (
              <span className="font-mono text-foreground">{userToDelete?.email}</span>)?
              The user will be marked as Inactive and can be restored later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>
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
