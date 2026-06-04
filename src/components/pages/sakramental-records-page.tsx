"use client"

import { useState, useMemo } from "react"
import {
  sakramentalRecords,
  type SakramentalRecord,
  type RecordStatus,
  type SacramentType,
  serviceFees,
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
  Award,
  Banknote,
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
  // Baptism fields
  birthDate: string
  birthPlace: string
  bookNo: string
  pageNo: string
  lineNo: string
  // Wedding fields
  husbandFirstName: string
  husbandMiddleName: string
  husbandLastName: string
  husbandBirthDate: string
  husbandAge: string
  husbandBirthPlace: string
  husbandCitizenship: string
  husbandResidence: string
  husbandReligion: string
  husbandCivilStatus: string
  husbandFatherName: string
  husbandFatherCitizenship: string
  husbandMotherMaidenName: string
  husbandMotherCitizenship: string
  wifeFirstName: string
  wifeMiddleName: string
  wifeLastName: string
  wifeBirthDate: string
  wifeAge: string
  wifeBirthPlace: string
  wifeCitizenship: string
  wifeResidence: string
  wifeReligion: string
  wifeCivilStatus: string
  wifeFatherName: string
  wifeFatherCitizenship: string
  wifeMotherMaidenName: string
  wifeMotherCitizenship: string
  placeOfMarriage: string
  timeOfMarriage: string
  marriageLicenseNo: string
  marriageLicenseDate: string
  marriageLicensePlace: string
  registryNo: string
  witnesses: string
  solemnizingOfficerTitle: string
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
  birthDate: "",
  birthPlace: "",
  bookNo: "",
  pageNo: "",
  lineNo: "",
  husbandFirstName: "",
  husbandMiddleName: "",
  husbandLastName: "",
  husbandBirthDate: "",
  husbandAge: "",
  husbandBirthPlace: "",
  husbandCitizenship: "",
  husbandResidence: "",
  husbandReligion: "",
  husbandCivilStatus: "",
  husbandFatherName: "",
  husbandFatherCitizenship: "",
  husbandMotherMaidenName: "",
  husbandMotherCitizenship: "",
  wifeFirstName: "",
  wifeMiddleName: "",
  wifeLastName: "",
  wifeBirthDate: "",
  wifeAge: "",
  wifeBirthPlace: "",
  wifeCitizenship: "",
  wifeResidence: "",
  wifeReligion: "",
  wifeCivilStatus: "",
  wifeFatherName: "",
  wifeFatherCitizenship: "",
  wifeMotherMaidenName: "",
  wifeMotherCitizenship: "",
  placeOfMarriage: "",
  timeOfMarriage: "",
  marriageLicenseNo: "",
  marriageLicenseDate: "",
  marriageLicensePlace: "",
  registryNo: "",
  witnesses: "",
  solemnizingOfficerTitle: "",
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
  const [certGenDialogOpen, setCertGenDialogOpen] = useState(false)
  const [certGenRecord, setCertGenRecord] = useState<SakramentalRecord | null>(null)

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
    // Auto-generate name for Wedding records
    const recordName = formData.serviceType === "Wedding"
      ? [formData.husbandFirstName, formData.husbandLastName].filter(Boolean).join(" ") +
        (formData.husbandFirstName && formData.wifeFirstName ? " & " : "") +
        [formData.wifeFirstName, formData.wifeLastName].filter(Boolean).join(" ")
      : formData.name

    const newRecord: SakramentalRecord = {
      id: newId,
      recordNumber: `${prefix}-2025-${String(existingCount + 1).padStart(3, "0")}`,
      serviceType: formData.serviceType,
      name: recordName || formData.name,
      date: formData.date,
      minister: formData.minister,
      status: "Pending",
      hasCertificate: false,
      parents: formData.serviceType === "Baptism" ? formData.parents || undefined : undefined,
      godparents: formData.serviceType === "Baptism" ? formData.godparents || undefined : undefined,
      spouse: formData.serviceType === "Wedding" ? formData.spouse || undefined : undefined,
      details: formData.details,
      birthDate: formData.serviceType === "Baptism" ? formData.birthDate || undefined : undefined,
      birthPlace: formData.serviceType === "Baptism" ? formData.birthPlace || undefined : undefined,
      bookNo: formData.serviceType === "Baptism" ? formData.bookNo || undefined : undefined,
      pageNo: formData.serviceType === "Baptism" ? formData.pageNo || undefined : undefined,
      lineNo: formData.serviceType === "Baptism" ? formData.lineNo || undefined : undefined,
      // Wedding fields
      husbandFirstName: formData.serviceType === "Wedding" ? formData.husbandFirstName || undefined : undefined,
      husbandMiddleName: formData.serviceType === "Wedding" ? formData.husbandMiddleName || undefined : undefined,
      husbandLastName: formData.serviceType === "Wedding" ? formData.husbandLastName || undefined : undefined,
      husbandBirthDate: formData.serviceType === "Wedding" ? formData.husbandBirthDate || undefined : undefined,
      husbandAge: formData.serviceType === "Wedding" ? (formData.husbandAge ? parseInt(formData.husbandAge) : undefined) : undefined,
      husbandBirthPlace: formData.serviceType === "Wedding" ? formData.husbandBirthPlace || undefined : undefined,
      husbandCitizenship: formData.serviceType === "Wedding" ? formData.husbandCitizenship || undefined : undefined,
      husbandResidence: formData.serviceType === "Wedding" ? formData.husbandResidence || undefined : undefined,
      husbandReligion: formData.serviceType === "Wedding" ? formData.husbandReligion || undefined : undefined,
      husbandCivilStatus: formData.serviceType === "Wedding" ? formData.husbandCivilStatus || undefined : undefined,
      husbandFatherName: formData.serviceType === "Wedding" ? formData.husbandFatherName || undefined : undefined,
      husbandFatherCitizenship: formData.serviceType === "Wedding" ? formData.husbandFatherCitizenship || undefined : undefined,
      husbandMotherMaidenName: formData.serviceType === "Wedding" ? formData.husbandMotherMaidenName || undefined : undefined,
      husbandMotherCitizenship: formData.serviceType === "Wedding" ? formData.husbandMotherCitizenship || undefined : undefined,
      wifeFirstName: formData.serviceType === "Wedding" ? formData.wifeFirstName || undefined : undefined,
      wifeMiddleName: formData.serviceType === "Wedding" ? formData.wifeMiddleName || undefined : undefined,
      wifeLastName: formData.serviceType === "Wedding" ? formData.wifeLastName || undefined : undefined,
      wifeBirthDate: formData.serviceType === "Wedding" ? formData.wifeBirthDate || undefined : undefined,
      wifeAge: formData.serviceType === "Wedding" ? (formData.wifeAge ? parseInt(formData.wifeAge) : undefined) : undefined,
      wifeBirthPlace: formData.serviceType === "Wedding" ? formData.wifeBirthPlace || undefined : undefined,
      wifeCitizenship: formData.serviceType === "Wedding" ? formData.wifeCitizenship || undefined : undefined,
      wifeResidence: formData.serviceType === "Wedding" ? formData.wifeResidence || undefined : undefined,
      wifeReligion: formData.serviceType === "Wedding" ? formData.wifeReligion || undefined : undefined,
      wifeCivilStatus: formData.serviceType === "Wedding" ? formData.wifeCivilStatus || undefined : undefined,
      wifeFatherName: formData.serviceType === "Wedding" ? formData.wifeFatherName || undefined : undefined,
      wifeFatherCitizenship: formData.serviceType === "Wedding" ? formData.wifeFatherCitizenship || undefined : undefined,
      wifeMotherMaidenName: formData.serviceType === "Wedding" ? formData.wifeMotherMaidenName || undefined : undefined,
      wifeMotherCitizenship: formData.serviceType === "Wedding" ? formData.wifeMotherCitizenship || undefined : undefined,
      placeOfMarriage: formData.serviceType === "Wedding" ? formData.placeOfMarriage || undefined : undefined,
      timeOfMarriage: formData.serviceType === "Wedding" ? formData.timeOfMarriage || undefined : undefined,
      marriageLicenseNo: formData.serviceType === "Wedding" ? formData.marriageLicenseNo || undefined : undefined,
      marriageLicenseDate: formData.serviceType === "Wedding" ? formData.marriageLicenseDate || undefined : undefined,
      marriageLicensePlace: formData.serviceType === "Wedding" ? formData.marriageLicensePlace || undefined : undefined,
      registryNo: formData.serviceType === "Wedding" ? formData.registryNo || undefined : undefined,
      witnesses: formData.serviceType === "Wedding" ? formData.witnesses || undefined : undefined,
      solemnizingOfficerTitle: formData.serviceType === "Wedding" ? formData.solemnizingOfficerTitle || undefined : undefined,
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
      birthDate: record.birthDate || "",
      birthPlace: record.birthPlace || "",
      bookNo: record.bookNo || "",
      pageNo: record.pageNo || "",
      lineNo: record.lineNo || "",
      // Wedding fields
      husbandFirstName: record.husbandFirstName || "",
      husbandMiddleName: record.husbandMiddleName || "",
      husbandLastName: record.husbandLastName || "",
      husbandBirthDate: record.husbandBirthDate || "",
      husbandAge: record.husbandAge?.toString() || "",
      husbandBirthPlace: record.husbandBirthPlace || "",
      husbandCitizenship: record.husbandCitizenship || "",
      husbandResidence: record.husbandResidence || "",
      husbandReligion: record.husbandReligion || "",
      husbandCivilStatus: record.husbandCivilStatus || "",
      husbandFatherName: record.husbandFatherName || "",
      husbandFatherCitizenship: record.husbandFatherCitizenship || "",
      husbandMotherMaidenName: record.husbandMotherMaidenName || "",
      husbandMotherCitizenship: record.husbandMotherCitizenship || "",
      wifeFirstName: record.wifeFirstName || "",
      wifeMiddleName: record.wifeMiddleName || "",
      wifeLastName: record.wifeLastName || "",
      wifeBirthDate: record.wifeBirthDate || "",
      wifeAge: record.wifeAge?.toString() || "",
      wifeBirthPlace: record.wifeBirthPlace || "",
      wifeCitizenship: record.wifeCitizenship || "",
      wifeResidence: record.wifeResidence || "",
      wifeReligion: record.wifeReligion || "",
      wifeCivilStatus: record.wifeCivilStatus || "",
      wifeFatherName: record.wifeFatherName || "",
      wifeFatherCitizenship: record.wifeFatherCitizenship || "",
      wifeMotherMaidenName: record.wifeMotherMaidenName || "",
      wifeMotherCitizenship: record.wifeMotherCitizenship || "",
      placeOfMarriage: record.placeOfMarriage || "",
      timeOfMarriage: record.timeOfMarriage || "",
      marriageLicenseNo: record.marriageLicenseNo || "",
      marriageLicenseDate: record.marriageLicenseDate || "",
      marriageLicensePlace: record.marriageLicensePlace || "",
      registryNo: record.registryNo || "",
      witnesses: record.witnesses || "",
      solemnizingOfficerTitle: record.solemnizingOfficerTitle || "",
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
              birthDate: formData.serviceType === "Baptism" ? formData.birthDate || undefined : undefined,
              birthPlace: formData.serviceType === "Baptism" ? formData.birthPlace || undefined : undefined,
              bookNo: formData.serviceType === "Baptism" ? formData.bookNo || undefined : undefined,
              pageNo: formData.serviceType === "Baptism" ? formData.pageNo || undefined : undefined,
              lineNo: formData.serviceType === "Baptism" ? formData.lineNo || undefined : undefined,
              // Wedding fields
              husbandFirstName: formData.serviceType === "Wedding" ? formData.husbandFirstName || undefined : undefined,
              husbandMiddleName: formData.serviceType === "Wedding" ? formData.husbandMiddleName || undefined : undefined,
              husbandLastName: formData.serviceType === "Wedding" ? formData.husbandLastName || undefined : undefined,
              husbandBirthDate: formData.serviceType === "Wedding" ? formData.husbandBirthDate || undefined : undefined,
              husbandAge: formData.serviceType === "Wedding" ? (formData.husbandAge ? parseInt(formData.husbandAge) : undefined) : undefined,
              husbandBirthPlace: formData.serviceType === "Wedding" ? formData.husbandBirthPlace || undefined : undefined,
              husbandCitizenship: formData.serviceType === "Wedding" ? formData.husbandCitizenship || undefined : undefined,
              husbandResidence: formData.serviceType === "Wedding" ? formData.husbandResidence || undefined : undefined,
              husbandReligion: formData.serviceType === "Wedding" ? formData.husbandReligion || undefined : undefined,
              husbandCivilStatus: formData.serviceType === "Wedding" ? formData.husbandCivilStatus || undefined : undefined,
              husbandFatherName: formData.serviceType === "Wedding" ? formData.husbandFatherName || undefined : undefined,
              husbandFatherCitizenship: formData.serviceType === "Wedding" ? formData.husbandFatherCitizenship || undefined : undefined,
              husbandMotherMaidenName: formData.serviceType === "Wedding" ? formData.husbandMotherMaidenName || undefined : undefined,
              husbandMotherCitizenship: formData.serviceType === "Wedding" ? formData.husbandMotherCitizenship || undefined : undefined,
              wifeFirstName: formData.serviceType === "Wedding" ? formData.wifeFirstName || undefined : undefined,
              wifeMiddleName: formData.serviceType === "Wedding" ? formData.wifeMiddleName || undefined : undefined,
              wifeLastName: formData.serviceType === "Wedding" ? formData.wifeLastName || undefined : undefined,
              wifeBirthDate: formData.serviceType === "Wedding" ? formData.wifeBirthDate || undefined : undefined,
              wifeAge: formData.serviceType === "Wedding" ? (formData.wifeAge ? parseInt(formData.wifeAge) : undefined) : undefined,
              wifeBirthPlace: formData.serviceType === "Wedding" ? formData.wifeBirthPlace || undefined : undefined,
              wifeCitizenship: formData.serviceType === "Wedding" ? formData.wifeCitizenship || undefined : undefined,
              wifeResidence: formData.serviceType === "Wedding" ? formData.wifeResidence || undefined : undefined,
              wifeReligion: formData.serviceType === "Wedding" ? formData.wifeReligion || undefined : undefined,
              wifeCivilStatus: formData.serviceType === "Wedding" ? formData.wifeCivilStatus || undefined : undefined,
              wifeFatherName: formData.serviceType === "Wedding" ? formData.wifeFatherName || undefined : undefined,
              wifeFatherCitizenship: formData.serviceType === "Wedding" ? formData.wifeFatherCitizenship || undefined : undefined,
              wifeMotherMaidenName: formData.serviceType === "Wedding" ? formData.wifeMotherMaidenName || undefined : undefined,
              wifeMotherCitizenship: formData.serviceType === "Wedding" ? formData.wifeMotherCitizenship || undefined : undefined,
              placeOfMarriage: formData.serviceType === "Wedding" ? formData.placeOfMarriage || undefined : undefined,
              timeOfMarriage: formData.serviceType === "Wedding" ? formData.timeOfMarriage || undefined : undefined,
              marriageLicenseNo: formData.serviceType === "Wedding" ? formData.marriageLicenseNo || undefined : undefined,
              marriageLicenseDate: formData.serviceType === "Wedding" ? formData.marriageLicenseDate || undefined : undefined,
              marriageLicensePlace: formData.serviceType === "Wedding" ? formData.marriageLicensePlace || undefined : undefined,
              registryNo: formData.serviceType === "Wedding" ? formData.registryNo || undefined : undefined,
              witnesses: formData.serviceType === "Wedding" ? formData.witnesses || undefined : undefined,
              solemnizingOfficerTitle: formData.serviceType === "Wedding" ? formData.solemnizingOfficerTitle || undefined : undefined,
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

  // Open Certificate Generation Dialog
  const handleOpenCertGen = (record: SakramentalRecord) => {
    setCertGenRecord(record)
    setCertGenDialogOpen(true)
  }

  // Generate Certificate
  const handleGenerateCertificate = (record: SakramentalRecord) => {
    // Mark the record as having a certificate now
    setRecords((prev) =>
      prev.map((r) =>
        r.id === record.id ? { ...r, hasCertificate: true } : r
      )
    )
    setCertGenDialogOpen(false)
    setCertGenRecord(null)
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

      {formData.serviceType !== "Wedding" && (
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Enter full name"
          />
        </div>
      )}

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
            <Label htmlFor="godparents">Godparents / Sponsors</Label>
            <Input
              id="godparents"
              value={formData.godparents}
              onChange={(e) => setFormData((prev) => ({ ...prev, godparents: e.target.value }))}
              placeholder="e.g. Luis & Carmen Reyes"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthDate">Birth Date</Label>
            <Input
              id="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, birthDate: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthPlace">Birth Place</Label>
            <Input
              id="birthPlace"
              value={formData.birthPlace}
              onChange={(e) => setFormData((prev) => ({ ...prev, birthPlace: e.target.value }))}
              placeholder="e.g. Malolos, Bulacan"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="bookNo">Book No.</Label>
              <Input
                id="bookNo"
                value={formData.bookNo}
                onChange={(e) => setFormData((prev) => ({ ...prev, bookNo: e.target.value }))}
                placeholder="9-789"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pageNo">Page</Label>
              <Input
                id="pageNo"
                value={formData.pageNo}
                onChange={(e) => setFormData((prev) => ({ ...prev, pageNo: e.target.value }))}
                placeholder="65"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lineNo">Line No.</Label>
              <Input
                id="lineNo"
                value={formData.lineNo}
                onChange={(e) => setFormData((prev) => ({ ...prev, lineNo: e.target.value }))}
                placeholder="03"
              />
            </div>
          </div>
        </>
      )}

      {formData.serviceType === "Wedding" && (
        <>
          {/* Husband Information */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[#1B2A4A] border-b border-[#1B2A4A]/10 pb-1">
              Husband Information
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="husbandFirstName">First Name</Label>
                <Input
                  id="husbandFirstName"
                  value={formData.husbandFirstName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, husbandFirstName: e.target.value }))}
                  placeholder="First name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="husbandMiddleName">Middle Name</Label>
                <Input
                  id="husbandMiddleName"
                  value={formData.husbandMiddleName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, husbandMiddleName: e.target.value }))}
                  placeholder="Middle name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="husbandLastName">Last Name</Label>
                <Input
                  id="husbandLastName"
                  value={formData.husbandLastName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, husbandLastName: e.target.value }))}
                  placeholder="Last name"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="husbandBirthDate">Birth Date</Label>
                <Input
                  id="husbandBirthDate"
                  type="date"
                  value={formData.husbandBirthDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, husbandBirthDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="husbandAge">Age</Label>
                <Input
                  id="husbandAge"
                  value={formData.husbandAge}
                  onChange={(e) => setFormData((prev) => ({ ...prev, husbandAge: e.target.value }))}
                  placeholder="Age"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="husbandBirthPlace">Birth Place</Label>
                <Input
                  id="husbandBirthPlace"
                  value={formData.husbandBirthPlace}
                  onChange={(e) => setFormData((prev) => ({ ...prev, husbandBirthPlace: e.target.value }))}
                  placeholder="e.g. Balagtas, Bulacan"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="husbandCitizenship">Citizenship</Label>
                <Input
                  id="husbandCitizenship"
                  value={formData.husbandCitizenship}
                  onChange={(e) => setFormData((prev) => ({ ...prev, husbandCitizenship: e.target.value }))}
                  placeholder="e.g. Filipino"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="husbandResidence">Residence</Label>
                <Input
                  id="husbandResidence"
                  value={formData.husbandResidence}
                  onChange={(e) => setFormData((prev) => ({ ...prev, husbandResidence: e.target.value }))}
                  placeholder="e.g. Borol 2nd, Balagtas"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="husbandReligion">Religion</Label>
                <Input
                  id="husbandReligion"
                  value={formData.husbandReligion}
                  onChange={(e) => setFormData((prev) => ({ ...prev, husbandReligion: e.target.value }))}
                  placeholder="e.g. Catholic"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="husbandCivilStatus">Civil Status</Label>
              <Input
                id="husbandCivilStatus"
                value={formData.husbandCivilStatus}
                onChange={(e) => setFormData((prev) => ({ ...prev, husbandCivilStatus: e.target.value }))}
                placeholder="e.g. Single"
              />
            </div>
          </div>

          {/* Husband's Parents */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[#1B2A4A] border-b border-[#1B2A4A]/10 pb-1">
              Husband&apos;s Parents
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="husbandFatherName">Father&apos;s Name</Label>
                <Input
                  id="husbandFatherName"
                  value={formData.husbandFatherName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, husbandFatherName: e.target.value }))}
                  placeholder="Father's full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="husbandFatherCitizenship">Father&apos;s Citizenship</Label>
                <Input
                  id="husbandFatherCitizenship"
                  value={formData.husbandFatherCitizenship}
                  onChange={(e) => setFormData((prev) => ({ ...prev, husbandFatherCitizenship: e.target.value }))}
                  placeholder="e.g. Filipino"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="husbandMotherMaidenName">Mother&apos;s Maiden Name</Label>
                <Input
                  id="husbandMotherMaidenName"
                  value={formData.husbandMotherMaidenName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, husbandMotherMaidenName: e.target.value }))}
                  placeholder="Mother's maiden name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="husbandMotherCitizenship">Mother&apos;s Citizenship</Label>
                <Input
                  id="husbandMotherCitizenship"
                  value={formData.husbandMotherCitizenship}
                  onChange={(e) => setFormData((prev) => ({ ...prev, husbandMotherCitizenship: e.target.value }))}
                  placeholder="e.g. Filipino"
                />
              </div>
            </div>
          </div>

          {/* Wife Information */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[#1B2A4A] border-b border-[#1B2A4A]/10 pb-1">
              Wife Information
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="wifeFirstName">First Name</Label>
                <Input
                  id="wifeFirstName"
                  value={formData.wifeFirstName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, wifeFirstName: e.target.value }))}
                  placeholder="First name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wifeMiddleName">Middle Name</Label>
                <Input
                  id="wifeMiddleName"
                  value={formData.wifeMiddleName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, wifeMiddleName: e.target.value }))}
                  placeholder="Middle name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wifeLastName">Last Name</Label>
                <Input
                  id="wifeLastName"
                  value={formData.wifeLastName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, wifeLastName: e.target.value }))}
                  placeholder="Last name"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="wifeBirthDate">Birth Date</Label>
                <Input
                  id="wifeBirthDate"
                  type="date"
                  value={formData.wifeBirthDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, wifeBirthDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wifeAge">Age</Label>
                <Input
                  id="wifeAge"
                  value={formData.wifeAge}
                  onChange={(e) => setFormData((prev) => ({ ...prev, wifeAge: e.target.value }))}
                  placeholder="Age"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="wifeBirthPlace">Birth Place</Label>
                <Input
                  id="wifeBirthPlace"
                  value={formData.wifeBirthPlace}
                  onChange={(e) => setFormData((prev) => ({ ...prev, wifeBirthPlace: e.target.value }))}
                  placeholder="e.g. Malolos, Bulacan"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wifeCitizenship">Citizenship</Label>
                <Input
                  id="wifeCitizenship"
                  value={formData.wifeCitizenship}
                  onChange={(e) => setFormData((prev) => ({ ...prev, wifeCitizenship: e.target.value }))}
                  placeholder="e.g. Filipino"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="wifeResidence">Residence</Label>
                <Input
                  id="wifeResidence"
                  value={formData.wifeResidence}
                  onChange={(e) => setFormData((prev) => ({ ...prev, wifeResidence: e.target.value }))}
                  placeholder="e.g. Borol 2nd, Balagtas"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wifeReligion">Religion</Label>
                <Input
                  id="wifeReligion"
                  value={formData.wifeReligion}
                  onChange={(e) => setFormData((prev) => ({ ...prev, wifeReligion: e.target.value }))}
                  placeholder="e.g. Catholic"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="wifeCivilStatus">Civil Status</Label>
              <Input
                id="wifeCivilStatus"
                value={formData.wifeCivilStatus}
                onChange={(e) => setFormData((prev) => ({ ...prev, wifeCivilStatus: e.target.value }))}
                placeholder="e.g. Single"
              />
            </div>
          </div>

          {/* Wife's Parents */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[#1B2A4A] border-b border-[#1B2A4A]/10 pb-1">
              Wife&apos;s Parents
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="wifeFatherName">Father&apos;s Name</Label>
                <Input
                  id="wifeFatherName"
                  value={formData.wifeFatherName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, wifeFatherName: e.target.value }))}
                  placeholder="Father's full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wifeFatherCitizenship">Father&apos;s Citizenship</Label>
                <Input
                  id="wifeFatherCitizenship"
                  value={formData.wifeFatherCitizenship}
                  onChange={(e) => setFormData((prev) => ({ ...prev, wifeFatherCitizenship: e.target.value }))}
                  placeholder="e.g. Filipino"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="wifeMotherMaidenName">Mother&apos;s Maiden Name</Label>
                <Input
                  id="wifeMotherMaidenName"
                  value={formData.wifeMotherMaidenName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, wifeMotherMaidenName: e.target.value }))}
                  placeholder="Mother's maiden name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wifeMotherCitizenship">Mother&apos;s Citizenship</Label>
                <Input
                  id="wifeMotherCitizenship"
                  value={formData.wifeMotherCitizenship}
                  onChange={(e) => setFormData((prev) => ({ ...prev, wifeMotherCitizenship: e.target.value }))}
                  placeholder="e.g. Filipino"
                />
              </div>
            </div>
          </div>

          {/* Marriage Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[#1B2A4A] border-b border-[#1B2A4A]/10 pb-1">
              Marriage Details
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="placeOfMarriage">Place of Marriage</Label>
                <Input
                  id="placeOfMarriage"
                  value={formData.placeOfMarriage}
                  onChange={(e) => setFormData((prev) => ({ ...prev, placeOfMarriage: e.target.value }))}
                  placeholder="e.g. St. Peter the Apostle Parish"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeOfMarriage">Time of Marriage</Label>
                <Input
                  id="timeOfMarriage"
                  value={formData.timeOfMarriage}
                  onChange={(e) => setFormData((prev) => ({ ...prev, timeOfMarriage: e.target.value }))}
                  placeholder="e.g. 10:00 am"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="marriageLicenseNo">Marriage License No.</Label>
                <Input
                  id="marriageLicenseNo"
                  value={formData.marriageLicenseNo}
                  onChange={(e) => setFormData((prev) => ({ ...prev, marriageLicenseNo: e.target.value }))}
                  placeholder="License no."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="marriageLicenseDate">License Date</Label>
                <Input
                  id="marriageLicenseDate"
                  type="date"
                  value={formData.marriageLicenseDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, marriageLicenseDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="marriageLicensePlace">License Place</Label>
                <Input
                  id="marriageLicensePlace"
                  value={formData.marriageLicensePlace}
                  onChange={(e) => setFormData((prev) => ({ ...prev, marriageLicensePlace: e.target.value }))}
                  placeholder="e.g. Balagtas, Bulacan"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="registryNo">Registry No.</Label>
              <Input
                id="registryNo"
                value={formData.registryNo}
                onChange={(e) => setFormData((prev) => ({ ...prev, registryNo: e.target.value }))}
                placeholder="e.g. 2025-001"
              />
            </div>
          </div>

          {/* Witnesses & Solemnizing Officer */}
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="witnesses">Witnesses</Label>
              <Input
                id="witnesses"
                value={formData.witnesses}
                onChange={(e) => setFormData((prev) => ({ ...prev, witnesses: e.target.value }))}
                placeholder="e.g. Luis Ramos, Carmen Diaz"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="solemnizingOfficerTitle">Solemnizing Officer Title</Label>
              <Input
                id="solemnizingOfficerTitle"
                value={formData.solemnizingOfficerTitle}
                onChange={(e) => setFormData((prev) => ({ ...prev, solemnizingOfficerTitle: e.target.value }))}
                placeholder="e.g. Parish Priest"
              />
            </div>
          </div>
        </>
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
                          {!record.hasCertificate && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-[#D4AD63] hover:text-[#D4AD63]/80 hover:bg-[#D4AD63]/10"
                              title="Generate Certificate"
                              onClick={() => handleOpenCertGen(record)}
                            >
                              <Award className="h-4 w-4" />
                            </Button>
                          )}
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
                      <p className="text-sm text-muted-foreground">Godparents / Sponsors</p>
                      <p className="font-medium">{selectedRecord.godparents}</p>
                    </div>
                  )}
                  {selectedRecord.birthDate && (
                    <div>
                      <p className="text-sm text-muted-foreground">Birth Date</p>
                      <p className="font-medium">{selectedRecord.birthDate}</p>
                    </div>
                  )}
                  {selectedRecord.birthPlace && (
                    <div>
                      <p className="text-sm text-muted-foreground">Birth Place</p>
                      <p className="font-medium">{selectedRecord.birthPlace}</p>
                    </div>
                  )}
                  {(selectedRecord.bookNo || selectedRecord.pageNo || selectedRecord.lineNo) && (
                    <div>
                      <p className="text-sm text-muted-foreground">Register Reference</p>
                      <p className="font-medium font-mono text-xs">
                        Book no. {selectedRecord.bookNo || "—"} Page: {selectedRecord.pageNo || "—"} Line no. {selectedRecord.lineNo || "—"}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {selectedRecord.serviceType === "Wedding" && (
                <div className="space-y-3">
                  {/* Husband Details */}
                  {(selectedRecord.husbandFirstName || selectedRecord.husbandLastName) && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-[#1B2A4A] border-b border-[#1B2A4A]/10 pb-1">
                        Husband
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedRecord.husbandFirstName && (
                          <div>
                            <p className="text-sm text-muted-foreground">First Name</p>
                            <p className="font-medium">{selectedRecord.husbandFirstName}</p>
                          </div>
                        )}
                        {selectedRecord.husbandMiddleName && (
                          <div>
                            <p className="text-sm text-muted-foreground">Middle Name</p>
                            <p className="font-medium">{selectedRecord.husbandMiddleName}</p>
                          </div>
                        )}
                        {selectedRecord.husbandLastName && (
                          <div>
                            <p className="text-sm text-muted-foreground">Last Name</p>
                            <p className="font-medium">{selectedRecord.husbandLastName}</p>
                          </div>
                        )}
                        {selectedRecord.husbandBirthDate && (
                          <div>
                            <p className="text-sm text-muted-foreground">Birth Date</p>
                            <p className="font-medium">{selectedRecord.husbandBirthDate}</p>
                          </div>
                        )}
                        {selectedRecord.husbandAge !== undefined && (
                          <div>
                            <p className="text-sm text-muted-foreground">Age</p>
                            <p className="font-medium">{selectedRecord.husbandAge}</p>
                          </div>
                        )}
                        {selectedRecord.husbandBirthPlace && (
                          <div>
                            <p className="text-sm text-muted-foreground">Birth Place</p>
                            <p className="font-medium">{selectedRecord.husbandBirthPlace}</p>
                          </div>
                        )}
                        {selectedRecord.husbandCitizenship && (
                          <div>
                            <p className="text-sm text-muted-foreground">Citizenship</p>
                            <p className="font-medium">{selectedRecord.husbandCitizenship}</p>
                          </div>
                        )}
                        {selectedRecord.husbandResidence && (
                          <div>
                            <p className="text-sm text-muted-foreground">Residence</p>
                            <p className="font-medium">{selectedRecord.husbandResidence}</p>
                          </div>
                        )}
                        {selectedRecord.husbandReligion && (
                          <div>
                            <p className="text-sm text-muted-foreground">Religion</p>
                            <p className="font-medium">{selectedRecord.husbandReligion}</p>
                          </div>
                        )}
                        {selectedRecord.husbandCivilStatus && (
                          <div>
                            <p className="text-sm text-muted-foreground">Civil Status</p>
                            <p className="font-medium">{selectedRecord.husbandCivilStatus}</p>
                          </div>
                        )}
                        {selectedRecord.husbandFatherName && (
                          <div>
                            <p className="text-sm text-muted-foreground">Father&apos;s Name</p>
                            <p className="font-medium">{selectedRecord.husbandFatherName}</p>
                          </div>
                        )}
                        {selectedRecord.husbandFatherCitizenship && (
                          <div>
                            <p className="text-sm text-muted-foreground">Father&apos;s Citizenship</p>
                            <p className="font-medium">{selectedRecord.husbandFatherCitizenship}</p>
                          </div>
                        )}
                        {selectedRecord.husbandMotherMaidenName && (
                          <div>
                            <p className="text-sm text-muted-foreground">Mother&apos;s Maiden Name</p>
                            <p className="font-medium">{selectedRecord.husbandMotherMaidenName}</p>
                          </div>
                        )}
                        {selectedRecord.husbandMotherCitizenship && (
                          <div>
                            <p className="text-sm text-muted-foreground">Mother&apos;s Citizenship</p>
                            <p className="font-medium">{selectedRecord.husbandMotherCitizenship}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Wife Details */}
                  {(selectedRecord.wifeFirstName || selectedRecord.wifeLastName) && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-[#1B2A4A] border-b border-[#1B2A4A]/10 pb-1">
                        Wife
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedRecord.wifeFirstName && (
                          <div>
                            <p className="text-sm text-muted-foreground">First Name</p>
                            <p className="font-medium">{selectedRecord.wifeFirstName}</p>
                          </div>
                        )}
                        {selectedRecord.wifeMiddleName && (
                          <div>
                            <p className="text-sm text-muted-foreground">Middle Name</p>
                            <p className="font-medium">{selectedRecord.wifeMiddleName}</p>
                          </div>
                        )}
                        {selectedRecord.wifeLastName && (
                          <div>
                            <p className="text-sm text-muted-foreground">Last Name</p>
                            <p className="font-medium">{selectedRecord.wifeLastName}</p>
                          </div>
                        )}
                        {selectedRecord.wifeBirthDate && (
                          <div>
                            <p className="text-sm text-muted-foreground">Birth Date</p>
                            <p className="font-medium">{selectedRecord.wifeBirthDate}</p>
                          </div>
                        )}
                        {selectedRecord.wifeAge !== undefined && (
                          <div>
                            <p className="text-sm text-muted-foreground">Age</p>
                            <p className="font-medium">{selectedRecord.wifeAge}</p>
                          </div>
                        )}
                        {selectedRecord.wifeBirthPlace && (
                          <div>
                            <p className="text-sm text-muted-foreground">Birth Place</p>
                            <p className="font-medium">{selectedRecord.wifeBirthPlace}</p>
                          </div>
                        )}
                        {selectedRecord.wifeCitizenship && (
                          <div>
                            <p className="text-sm text-muted-foreground">Citizenship</p>
                            <p className="font-medium">{selectedRecord.wifeCitizenship}</p>
                          </div>
                        )}
                        {selectedRecord.wifeResidence && (
                          <div>
                            <p className="text-sm text-muted-foreground">Residence</p>
                            <p className="font-medium">{selectedRecord.wifeResidence}</p>
                          </div>
                        )}
                        {selectedRecord.wifeReligion && (
                          <div>
                            <p className="text-sm text-muted-foreground">Religion</p>
                            <p className="font-medium">{selectedRecord.wifeReligion}</p>
                          </div>
                        )}
                        {selectedRecord.wifeCivilStatus && (
                          <div>
                            <p className="text-sm text-muted-foreground">Civil Status</p>
                            <p className="font-medium">{selectedRecord.wifeCivilStatus}</p>
                          </div>
                        )}
                        {selectedRecord.wifeFatherName && (
                          <div>
                            <p className="text-sm text-muted-foreground">Father&apos;s Name</p>
                            <p className="font-medium">{selectedRecord.wifeFatherName}</p>
                          </div>
                        )}
                        {selectedRecord.wifeFatherCitizenship && (
                          <div>
                            <p className="text-sm text-muted-foreground">Father&apos;s Citizenship</p>
                            <p className="font-medium">{selectedRecord.wifeFatherCitizenship}</p>
                          </div>
                        )}
                        {selectedRecord.wifeMotherMaidenName && (
                          <div>
                            <p className="text-sm text-muted-foreground">Mother&apos;s Maiden Name</p>
                            <p className="font-medium">{selectedRecord.wifeMotherMaidenName}</p>
                          </div>
                        )}
                        {selectedRecord.wifeMotherCitizenship && (
                          <div>
                            <p className="text-sm text-muted-foreground">Mother&apos;s Citizenship</p>
                            <p className="font-medium">{selectedRecord.wifeMotherCitizenship}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Marriage Details */}
                  {(selectedRecord.placeOfMarriage || selectedRecord.timeOfMarriage || selectedRecord.marriageLicenseNo || selectedRecord.registryNo) && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-[#1B2A4A] border-b border-[#1B2A4A]/10 pb-1">
                        Marriage Details
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedRecord.placeOfMarriage && (
                          <div>
                            <p className="text-sm text-muted-foreground">Place of Marriage</p>
                            <p className="font-medium">{selectedRecord.placeOfMarriage}</p>
                          </div>
                        )}
                        {selectedRecord.timeOfMarriage && (
                          <div>
                            <p className="text-sm text-muted-foreground">Time of Marriage</p>
                            <p className="font-medium">{selectedRecord.timeOfMarriage}</p>
                          </div>
                        )}
                        {selectedRecord.marriageLicenseNo && (
                          <div>
                            <p className="text-sm text-muted-foreground">Marriage License No.</p>
                            <p className="font-medium">{selectedRecord.marriageLicenseNo}</p>
                          </div>
                        )}
                        {selectedRecord.marriageLicenseDate && (
                          <div>
                            <p className="text-sm text-muted-foreground">License Date</p>
                            <p className="font-medium">{selectedRecord.marriageLicenseDate}</p>
                          </div>
                        )}
                        {selectedRecord.marriageLicensePlace && (
                          <div>
                            <p className="text-sm text-muted-foreground">License Place</p>
                            <p className="font-medium">{selectedRecord.marriageLicensePlace}</p>
                          </div>
                        )}
                        {selectedRecord.registryNo && (
                          <div>
                            <p className="text-sm text-muted-foreground">Registry No.</p>
                            <p className="font-medium">{selectedRecord.registryNo}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Witnesses & Officer */}
                  {(selectedRecord.witnesses || selectedRecord.solemnizingOfficerTitle) && (
                    <div className="grid grid-cols-1 gap-3">
                      {selectedRecord.witnesses && (
                        <div>
                          <p className="text-sm text-muted-foreground">Witnesses</p>
                          <p className="font-medium">{selectedRecord.witnesses}</p>
                        </div>
                      )}
                      {selectedRecord.solemnizingOfficerTitle && (
                        <div>
                          <p className="text-sm text-muted-foreground">Solemnizing Officer Title</p>
                          <p className="font-medium">{selectedRecord.solemnizingOfficerTitle}</p>
                        </div>
                      )}
                    </div>
                  )}
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
        <DialogContent className="sm:max-w-3xl max-h-[95vh] p-0 overflow-hidden">
          <div className="overflow-y-auto max-h-[95vh]">
            {/* Certificate */}
            {certificateRecord && (() => {
              const today = new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })

              // Format baptism date for "25th Day of November 2013" style
              const formatBaptismDate = (dateStr: string) => {
                const d = new Date(dateStr + "T00:00:00")
                const day = d.getDate()
                const suffix = day === 1 || day === 21 || day === 31 ? "st" : day === 2 || day === 22 ? "nd" : day === 3 || day === 23 ? "rd" : "th"
                const month = d.toLocaleDateString("en-US", { month: "long" })
                const year = d.getFullYear()
                return `${day}${suffix} Day of ${month} ${year}`
              }

              // Format birth date
              const formatBirthDate = (dateStr?: string) => {
                if (!dateStr) return ""
                const d = new Date(dateStr + "T00:00:00")
                return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
              }

              // Parse godparents into individual sponsors
              const parseSponsors = (sponsors?: string) => {
                if (!sponsors) return []
                return sponsors.split(/\s*[&,&]\s*/).map(s => s.trim()).filter(Boolean)
              }

              // ========== BAPTISM CERTIFICATE - Custom layout matching uploaded image ==========
              if (certificateRecord.serviceType === "Baptism") {
                const sponsors = parseSponsors(certificateRecord.godparents)
                const parentNames = certificateRecord.parents ? certificateRecord.parents.split(/\s*[&,&]\s*/).filter(Boolean) : []

                return (
                  <div className="bg-white">
                    {/* Baptismal Certificate with ornate green border */}
                    <div className="m-3 sm:m-4 p-3 sm:p-4"
                      style={{
                        border: "8px solid #2d5a27",
                        borderImage: "repeating-linear-gradient(45deg, #2d5a27, #2d5a27 4px, #3a7a32 4px, #3a7a32 8px) 8",
                      }}
                    >
                      <div className="p-3 sm:p-5"
                        style={{
                          border: "3px solid #2d5a27",
                          outline: "1px solid #2d5a27",
                          outlineOffset: "4px",
                        }}
                      >
                        {/* Header Section */}
                        <div className="text-center mb-4">
                          <p className="text-[10px] sm:text-xs italic text-[#2d5a27]/70 mb-1">
                            Diocese of Malolos
                          </p>
                          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-1">
                            <div className="relative h-10 w-10 sm:h-12 sm:w-12 shrink-0">
                              <Image
                                src="/sakramento-logo.png"
                                alt="Parish Crest"
                                fill
                                className="object-contain"
                              />
                            </div>
                            <div>
                              <h2 className="text-sm sm:text-base md:text-lg font-bold text-[#2d5a27] tracking-wide uppercase leading-tight">
                                St. Peter the Apostle Parish Church
                              </h2>
                              <p className="text-[9px] sm:text-[11px] text-[#2d5a27]/70 uppercase tracking-wider">
                                Borol 2nd, Balagtas, Bulacan
                              </p>
                            </div>
                            <div className="relative h-10 w-10 sm:h-12 sm:w-12 shrink-0">
                              <Image
                                src="/sakramento-logo.png"
                                alt="Parish Crest"
                                fill
                                className="object-contain"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Title */}
                        <div className="text-center mb-5">
                          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#2d5a27] tracking-widest uppercase">
                            Baptismal Certificate
                          </h1>
                          <div className="flex items-center justify-center gap-2 mt-1">
                            <div className="h-px w-12 sm:w-20 bg-[#2d5a27]/50" />
                            <Cross className="h-3 w-3 text-[#2d5a27]" />
                            <div className="h-px w-12 sm:w-20 bg-[#2d5a27]/50" />
                          </div>
                        </div>

                        {/* THIS IS TO CERTIFY */}
                        <div className="text-center mb-3">
                          <p className="text-[11px] sm:text-xs font-bold text-[#2d5a27] uppercase tracking-wider">
                            This is to Certify
                          </p>
                        </div>

                        {/* Certification Details */}
                        <div className="space-y-2 mb-5 text-[11px] sm:text-sm">
                          <div className="flex gap-2">
                            <span className="font-semibold text-[#1B2A4A] min-w-[100px] sm:min-w-[120px]">Name:</span>
                            <span className="text-[#1B2A4A] border-b border-[#2d5a27]/30 flex-1 pb-0.5 font-medium">{certificateRecord.name}</span>
                          </div>
                          {parentNames.length > 0 && (
                            <div className="flex gap-2">
                              <span className="font-semibold text-[#1B2A4A] min-w-[100px] sm:min-w-[120px]">Child of and:</span>
                              <span className="text-[#1B2A4A] border-b border-[#2d5a27]/30 flex-1 pb-0.5 font-medium">{parentNames.join(" & ")}</span>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <span className="font-semibold text-[#1B2A4A] min-w-[100px] sm:min-w-[120px]">Born on:</span>
                            <span className="text-[#1B2A4A] border-b border-[#2d5a27]/30 flex-1 pb-0.5 font-medium">
                              {certificateRecord.birthDate ? formatBirthDate(certificateRecord.birthDate) : "—"}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <span className="font-semibold text-[#1B2A4A] min-w-[100px] sm:min-w-[120px]">Birth place:</span>
                            <span className="text-[#1B2A4A] border-b border-[#2d5a27]/30 flex-1 pb-0.5 font-medium">
                              {certificateRecord.birthPlace || "—"}
                            </span>
                          </div>
                        </div>

                        {/* RECEIVED */}
                        <div className="text-center mb-4">
                          <p className="text-[11px] sm:text-xs font-bold text-[#2d5a27] uppercase tracking-wider mb-1">
                            Received
                          </p>
                          <p className="text-sm sm:text-base italic text-[#2d5a27] font-medium">
                            The Holy Sacrament of Baptism
                          </p>
                        </div>

                        {/* On the / By the Most Rev */}
                        <div className="space-y-2 mb-4 text-[11px] sm:text-sm">
                          <div className="flex gap-2">
                            <span className="font-semibold text-[#1B2A4A] min-w-[100px] sm:min-w-[120px]">On the:</span>
                            <span className="text-[#1B2A4A] border-b border-[#2d5a27]/30 flex-1 pb-0.5 font-medium">
                              {formatBaptismDate(certificateRecord.date)}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <span className="font-semibold text-[#1B2A4A] min-w-[100px] sm:min-w-[120px]">By the Most Rev.:</span>
                            <span className="text-[#1B2A4A] border-b border-[#2d5a27]/30 flex-1 pb-0.5 font-medium">
                              {certificateRecord.minister}
                            </span>
                          </div>
                        </div>

                        {/* Sponsors */}
                        {sponsors.length > 0 && (
                          <div className="mb-5 text-[11px] sm:text-sm">
                            <p className="font-semibold text-[#1B2A4A] mb-1">Sponsors being:</p>
                            <div className="pl-4 space-y-0.5">
                              {sponsors.map((sponsor, idx) => (
                                <p key={idx} className="text-[#1B2A4A] font-medium">{sponsor}</p>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* According to the Rites */}
                        <div className="text-center mb-4">
                          <p className="text-[11px] sm:text-xs font-bold text-[#2d5a27] uppercase tracking-wider">
                            According to the Rites of the Roman Catholic Church
                          </p>
                          <p className="text-[9px] sm:text-[11px] text-[#1B2A4A]/70 mt-1">
                            As appears on the BAPTISMAL REGISTER of this Church
                          </p>
                          <p className="text-[9px] sm:text-[11px] text-[#1B2A4A]/60 font-mono mt-0.5">
                            Book no. {certificateRecord.bookNo || "—"} Page: {certificateRecord.pageNo || "—"} Line no. {certificateRecord.lineNo || "—"}
                          </p>
                        </div>

                        {/* Divider */}
                        <div className="w-full h-px bg-[#2d5a27]/30 my-4" />

                        {/* Dated / Purposes / Seal Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5 text-[11px] sm:text-sm">
                          <div className="flex gap-2">
                            <span className="font-semibold text-[#1B2A4A]">Dated:</span>
                            <span className="text-[#1B2A4A] font-medium">{today}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="font-semibold text-[#1B2A4A]">Purposes:</span>
                            <span className="text-red-700 font-bold uppercase text-[10px] sm:text-xs">FOR REFERENCE</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="font-semibold text-[#1B2A4A]">Seal:</span>
                            <span className="text-[#1B2A4A]/30 italic text-[10px]">[Official Seal]</span>
                          </div>
                        </div>

                        {/* Signatures */}
                        <div className="grid grid-cols-2 gap-6 sm:gap-12 mb-2">
                          <div className="text-center">
                            <div className="border-b border-[#1B2A4A]/30 pb-1 mb-1 min-h-[2rem]" />
                            <p className="text-[10px] sm:text-xs font-bold text-[#1B2A4A] uppercase">
                              {certificateRecord.minister}
                            </p>
                            <p className="text-[9px] sm:text-[10px] text-[#1B2A4A]/60 uppercase">Parish Priest</p>
                          </div>
                          <div className="text-center">
                            <div className="border-b border-[#1B2A4A]/30 pb-1 mb-1 min-h-[2rem]" />
                            <p className="text-[9px] sm:text-[10px] italic text-[#1B2A4A]/70">
                              By: Parish Secretary
                            </p>
                            <p className="text-[9px] sm:text-[10px] text-[#1B2A4A]/60 uppercase">Parish Secretary</p>
                          </div>
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
              }

              // ========== WEDDING CERTIFICATE - Philippine Certificate of Marriage form ==========
              if (certificateRecord.serviceType === "Wedding") {
                const husbandFull = [certificateRecord.husbandFirstName, certificateRecord.husbandMiddleName, certificateRecord.husbandLastName].filter(Boolean).join(" ")
                const wifeFull = [certificateRecord.wifeFirstName, certificateRecord.wifeMiddleName, certificateRecord.wifeLastName].filter(Boolean).join(" ")
                const witnessList = certificateRecord.witnesses ? certificateRecord.witnesses.split(",").map(w => w.trim()) : []
                const marriageDate = new Date(certificateRecord.date + "T00:00:00")
                const marriageDay = marriageDate.getDate()
                const marriageMonth = marriageDate.toLocaleDateString("en-US", { month: "long" }).toUpperCase()
                const marriageYear = marriageDate.getFullYear()
                const formatBirthDate = (dateStr?: string) => {
                  if (!dateStr) return ""
                  const d = new Date(dateStr + "T00:00:00")
                  const day = d.getDate()
                  const month = d.toLocaleDateString("en-US", { month: "long" }).toUpperCase()
                  const year = d.getFullYear()
                  return `${day} ${month} ${year}`
                }

                return (
                  <div className="bg-white">
                    {/* Philippine Certificate of Marriage form with red border */}
                    <div className="border-2 border-red-700 m-3 sm:m-4">
                      <div className="border border-red-700/60 m-1">
                        {/* Header */}
                        <div className="text-center border-b border-red-700 py-2 px-3">
                          <p className="text-[8px] sm:text-[10px] text-[#1B2A4A]/70 uppercase tracking-wider">
                            Republic of the Philippines
                          </p>
                          <p className="text-[8px] sm:text-[10px] text-[#1B2A4A]/70 uppercase tracking-wider">
                            Office of the Civil Registrar General
                          </p>
                          <p className="text-sm sm:text-base font-bold text-[#1B2A4A] uppercase tracking-wider mt-1">
                            Certificate of Marriage
                          </p>
                          <div className="flex items-center justify-end mt-1">
                            <span className="text-[9px] sm:text-[10px] text-red-700 font-semibold mr-1">Registry No.:</span>
                            <span className="text-[9px] sm:text-[10px] font-medium text-[#1B2A4A] border-b border-[#1B2A4A]/30 px-2">
                              {certificateRecord.registryNo || "—"}
                            </span>
                          </div>
                        </div>

                        {/* Province / City */}
                        <div className="grid grid-cols-2 border-b border-red-700 text-[9px] sm:text-[10px]">
                          <div className="p-2 border-r border-red-700 flex gap-1">
                            <span className="text-red-700 font-semibold">Province:</span>
                            <span className="font-medium text-[#1B2A4A]">BULACAN</span>
                          </div>
                          <div className="p-2 flex gap-1">
                            <span className="text-red-700 font-semibold">City/Municipality:</span>
                            <span className="font-medium text-[#1B2A4A]">BALAGTAS (BIGAA)</span>
                          </div>
                        </div>

                        {/* Section 1: Name of Contracting Parties */}
                        <div className="border-b border-red-700">
                          <div className="grid grid-cols-[1fr_1fr_1fr] border-b border-red-700/40">
                            <div className="p-1.5 sm:p-2 text-[9px] sm:text-[10px] text-red-700 font-semibold border-r border-red-700/40">
                              1. Name of Contracting Parties
                            </div>
                            <div className="p-1.5 sm:p-2 text-center text-[9px] sm:text-[10px] font-bold text-[#1B2A4A] uppercase border-r border-red-700/40">
                              HUSBAND
                            </div>
                            <div className="p-1.5 sm:p-2 text-center text-[9px] sm:text-[10px] font-bold text-[#1B2A4A] uppercase">
                              WIFE
                            </div>
                          </div>
                          {[
                            { label: "(First)", hVal: certificateRecord.husbandFirstName, wVal: certificateRecord.wifeFirstName },
                            { label: "(Middle)", hVal: certificateRecord.husbandMiddleName, wVal: certificateRecord.wifeMiddleName },
                            { label: "(Last)", hVal: certificateRecord.husbandLastName, wVal: certificateRecord.wifeLastName },
                          ].map((row, idx) => (
                            <div key={idx} className="grid grid-cols-[1fr_1fr_1fr] border-b border-red-700/20">
                              <div className="p-1 sm:p-1.5 text-[8px] sm:text-[9px] text-[#1B2A4A]/60 pl-3 border-r border-red-700/40">
                                {row.label}
                              </div>
                              <div className="p-1 sm:p-1.5 text-[9px] sm:text-[10px] font-medium text-[#1B2A4A] uppercase border-r border-red-700/40">
                                {row.hVal || "—"}
                              </div>
                              <div className="p-1 sm:p-1.5 text-[9px] sm:text-[10px] font-medium text-[#1B2A4A] uppercase">
                                {row.wVal || "—"}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Sections 2-14: Two-column Husband/Wife details */}
                        {[
                          { num: "2a", label: "Date of Birth", hVal: certificateRecord.husbandBirthDate ? formatBirthDate(certificateRecord.husbandBirthDate) : "—", wVal: certificateRecord.wifeBirthDate ? formatBirthDate(certificateRecord.wifeBirthDate) : "—" },
                          { num: "2b", label: "Age", hVal: certificateRecord.husbandAge ? String(certificateRecord.husbandAge) : "—", wVal: certificateRecord.wifeAge ? String(certificateRecord.wifeAge) : "—" },
                          { num: "3", label: "Place of Birth", hVal: certificateRecord.husbandBirthPlace || "—", wVal: certificateRecord.wifeBirthPlace || "—" },
                          { num: "4b", label: "Citizenship", hVal: certificateRecord.husbandCitizenship || "—", wVal: certificateRecord.wifeCitizenship || "—" },
                          { num: "5", label: "Residence", hVal: certificateRecord.husbandResidence || "—", wVal: certificateRecord.wifeResidence || "—" },
                          { num: "6", label: "Religion/Religious Sect", hVal: certificateRecord.husbandReligion || "—", wVal: certificateRecord.wifeReligion || "—" },
                          { num: "7", label: "Civil Status", hVal: certificateRecord.husbandCivilStatus || "—", wVal: certificateRecord.wifeCivilStatus || "—" },
                          { num: "8", label: "Name of Father", hVal: certificateRecord.husbandFatherName || "—", wVal: certificateRecord.wifeFatherName || "—" },
                          { num: "9", label: "Citizenship (Father)", hVal: certificateRecord.husbandFatherCitizenship || "—", wVal: certificateRecord.wifeFatherCitizenship || "—" },
                          { num: "10", label: "Maiden Name of Mother", hVal: certificateRecord.husbandMotherMaidenName || "—", wVal: certificateRecord.wifeMotherMaidenName || "—" },
                          { num: "11", label: "Citizenship (Mother)", hVal: certificateRecord.husbandMotherCitizenship || "—", wVal: certificateRecord.wifeMotherCitizenship || "—" },
                        ].map((section) => (
                          <div key={section.num} className="grid grid-cols-[1fr_1fr_1fr] border-b border-red-700/20">
                            <div className="p-1 sm:p-1.5 text-[8px] sm:text-[9px] text-red-700 font-semibold border-r border-red-700/40">
                              {section.num}. {section.label}
                            </div>
                            <div className="p-1 sm:p-1.5 text-[9px] sm:text-[10px] font-medium text-[#1B2A4A] uppercase border-r border-red-700/40">
                              {section.hVal}
                            </div>
                            <div className="p-1 sm:p-1.5 text-[9px] sm:text-[10px] font-medium text-[#1B2A4A] uppercase">
                              {section.wVal}
                            </div>
                          </div>
                        ))}

                        {/* Section 15: Place of Marriage */}
                        <div className="border-b border-red-700/40 p-1.5 sm:p-2">
                          <span className="text-[9px] sm:text-[10px] text-red-700 font-semibold mr-2">15. Place of Marriage:</span>
                          <span className="text-[9px] sm:text-[10px] font-medium text-[#1B2A4A] uppercase">
                            {certificateRecord.placeOfMarriage || "St. Peter the Apostle Parish, Borol 2nd, Balagtas, Bulacan"}
                          </span>
                          <span className="text-[7px] sm:text-[8px] text-[#1B2A4A]/50 italic ml-1">
                            (Church of)
                          </span>
                        </div>

                        {/* Section 16: Date of Marriage */}
                        <div className="border-b border-red-700/40 p-1.5 sm:p-2 flex flex-wrap items-center gap-1">
                          <span className="text-[9px] sm:text-[10px] text-red-700 font-semibold mr-2">16. Date of Marriage:</span>
                          <span className="text-[9px] sm:text-[10px] font-medium text-[#1B2A4A]">{marriageDay}</span>
                          <span className="text-[7px] sm:text-[8px] text-[#1B2A4A]/50 italic">(Day)</span>
                          <span className="text-[9px] sm:text-[10px] font-medium text-[#1B2A4A]">{marriageMonth}</span>
                          <span className="text-[7px] sm:text-[8px] text-[#1B2A4A]/50 italic">(Month)</span>
                          <span className="text-[9px] sm:text-[10px] font-medium text-[#1B2A4A]">{marriageYear}</span>
                          <span className="text-[7px] sm:text-[8px] text-[#1B2A4A]/50 italic">(Year)</span>
                        </div>

                        {/* Section 17: Time of Marriage */}
                        <div className="border-b border-red-700/40 p-1.5 sm:p-2 flex items-center gap-1">
                          <span className="text-[9px] sm:text-[10px] text-red-700 font-semibold mr-2">17. Time of Marriage:</span>
                          <span className="text-[9px] sm:text-[10px] font-medium text-[#1B2A4A]">
                            {certificateRecord.timeOfMarriage || "—"}
                          </span>
                        </div>

                        {/* Section 18: Certification of the Contracting Parties */}
                        <div className="border-b border-red-700 p-2 sm:p-3">
                          <p className="text-[9px] sm:text-[10px] text-red-700 font-bold mb-1">
                            18. CERTIFICATION OF THE CONTRACTING PARTIES:
                          </p>
                          <p className="text-[8px] sm:text-[9px] text-[#1B2A4A] leading-relaxed">
                            THIS IS TO CERTIFY: That I,{" "}
                            <span className="font-semibold uppercase">{husbandFull || certificateRecord.name}</span>{" "}
                            and I,{" "}
                            <span className="font-semibold uppercase">{wifeFull || "—"}</span>{" "}
                            both of legal age, of our own free will and accord, and in the presence of the person solemnizing this marriage and of the witnesses named below, take each other as husband and wife and certifying further that we: □ have entered / ☒ have not entered into a marriage settlement.
                          </p>
                          <div className="grid grid-cols-2 gap-4 mt-3">
                            <div className="text-center">
                              <div className="border-b border-[#1B2A4A]/30 pb-1 mb-1 min-h-[1.5rem]" />
                              <p className="text-[7px] sm:text-[8px] text-[#1B2A4A]/60 italic">(Signature of Husband)</p>
                            </div>
                            <div className="text-center">
                              <div className="border-b border-[#1B2A4A]/30 pb-1 mb-1 min-h-[1.5rem]" />
                              <p className="text-[7px] sm:text-[8px] text-[#1B2A4A]/60 italic">(Signature of Wife)</p>
                            </div>
                          </div>
                        </div>

                        {/* Section 19: Certification of the Solemnizing Officer */}
                        <div className="border-b border-red-700 p-2 sm:p-3">
                          <p className="text-[9px] sm:text-[10px] text-red-700 font-bold mb-1">
                            19. CERTIFICATION OF THE SOLEMNIZING OFFICER:
                          </p>
                          <p className="text-[8px] sm:text-[9px] text-[#1B2A4A] leading-relaxed">
                            THIS IS TO CERTIFY: THAT BEFORE ME, on the date and place above-written, personally appeared the above-mentioned parties, with their mutual consent, lawfully joined together in marriage which was solemnized by me in the presence of the witnesses named below, all of legal age. I CERTIFY FURTHER THAT ☒ Marriage License No.{" "}
                            <span className="font-semibold">{certificateRecord.marriageLicenseNo || "—"}</span>{" "}
                            issued on{" "}
                            <span className="font-semibold">{certificateRecord.marriageLicenseDate || "—"}</span>{" "}
                            at{" "}
                            <span className="font-semibold">{certificateRecord.marriageLicensePlace || "—"}</span>{" "}
                            in favor of said parties, was exhibited to me.
                          </p>
                          <div className="text-center mt-3">
                            <div className="border-b border-[#1B2A4A]/30 pb-1 mb-1 min-h-[1.5rem]" />
                            <p className="text-[9px] sm:text-[10px] font-bold text-[#1B2A4A] uppercase">
                              {certificateRecord.minister}
                            </p>
                            <p className="text-[7px] sm:text-[8px] text-[#1B2A4A]/60 uppercase">
                              {certificateRecord.solemnizingOfficerTitle || "Parish Priest"}
                            </p>
                            <p className="text-[7px] sm:text-[8px] text-[#1B2A4A]/60">
                              CATHOLIC
                            </p>
                          </div>
                        </div>

                        {/* Section 20a: Witnesses */}
                        <div className="border-b border-red-700 p-2 sm:p-3">
                          <p className="text-[9px] sm:text-[10px] text-red-700 font-bold mb-2">
                            20a. WITNESSES (Print Name and Sign):
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {witnessList.length > 0 ? witnessList.map((w, idx) => (
                              <div key={idx} className="text-center">
                                <div className="border-b border-[#1B2A4A]/30 pb-0.5 mb-0.5 min-h-[1rem]" />
                                <p className="text-[8px] sm:text-[9px] font-medium text-[#1B2A4A] uppercase">{w}</p>
                              </div>
                            )) : (
                              <>
                                <div className="text-center"><div className="border-b border-[#1B2A4A]/30 pb-0.5 mb-0.5 min-h-[1rem]" /></div>
                                <div className="text-center"><div className="border-b border-[#1B2A4A]/30 pb-0.5 mb-0.5 min-h-[1rem]" /></div>
                              </>
                            )}
                            {witnessList.length < 4 && Array.from({ length: Math.max(0, 4 - witnessList.length) }).map((_, idx) => (
                              <div key={`empty-${idx}`} className="text-center"><div className="border-b border-[#1B2A4A]/30 pb-0.5 mb-0.5 min-h-[1rem]" /></div>
                            ))}
                          </div>
                        </div>

                        {/* Section 21-22: Received By / Registered */}
                        <div className="p-2 sm:p-3">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-[8px] sm:text-[9px] text-red-700 font-bold mb-1">21. RECEIVED BY:</p>
                              <div className="space-y-1">
                                <div className="flex items-center gap-1">
                                  <span className="text-[7px] sm:text-[8px] text-[#1B2A4A]/60 italic">Signature:</span>
                                  <div className="flex-1 border-b border-[#1B2A4A]/20" />
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-[7px] sm:text-[8px] text-[#1B2A4A]/60 italic">Name:</span>
                                  <div className="flex-1 border-b border-[#1B2A4A]/20" />
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-[7px] sm:text-[8px] text-[#1B2A4A]/60 italic">Title:</span>
                                  <div className="flex-1 border-b border-[#1B2A4A]/20" />
                                </div>
                              </div>
                            </div>
                            <div>
                              <p className="text-[8px] sm:text-[9px] text-red-700 font-bold mb-1">22. REGISTERED AT THE OFFICE OF THE CIVIL REGISTRAR:</p>
                              <div className="space-y-1">
                                <div className="flex items-center gap-1">
                                  <span className="text-[7px] sm:text-[8px] text-[#1B2A4A]/60 italic">Signature:</span>
                                  <div className="flex-1 border-b border-[#1B2A4A]/20" />
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-[7px] sm:text-[8px] text-[#1B2A4A]/60 italic">Name:</span>
                                  <div className="flex-1 border-b border-[#1B2A4A]/20" />
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-[7px] sm:text-[8px] text-[#1B2A4A]/60 italic">Title:</span>
                                  <div className="flex-1 border-b border-[#1B2A4A]/20" />
                                </div>
                              </div>
                            </div>
                          </div>
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
              }

              // ========== CONFIRMATION & FUNERAL MASS CERTIFICATES - Existing layout ==========
              const certTitle =
                certificateRecord.serviceType === "Confirmation"
                  ? "Certificate of Confirmation"
                  : "Certificate of Funeral Mass"

              const biblicalQuote =
                certificateRecord.serviceType === "Confirmation"
                  ? '"Receive the Holy Spirit. If you forgive anyone\'s sins, their sins are forgiven" - John 20:22-23'
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
                          Borol 2nd, Balagtas, Bulacan
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

      {/* Certificate Generation Dialog */}
      <Dialog open={certGenDialogOpen} onOpenChange={setCertGenDialogOpen}>
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
          {certGenRecord && (
            <div className="space-y-4">
              {/* Record Summary */}
              <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs font-medium">
                    {certGenRecord.serviceType}
                  </Badge>
                  <span className="text-xs font-mono text-muted-foreground">{certGenRecord.recordNumber}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="font-medium text-[#1B2A4A]">{certGenRecord.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="font-medium text-[#1B2A4A]">{certGenRecord.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Minister</p>
                    <p className="font-medium text-[#1B2A4A]">{certGenRecord.minister}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <Badge
                      className={`${statusConfig[certGenRecord.status].bgClass} ${statusConfig[certGenRecord.status].textClass} border-0 text-xs font-medium`}
                    >
                      {certGenRecord.status}
                    </Badge>
                  </div>
                  {certGenRecord.parents && (
                    <div>
                      <p className="text-xs text-muted-foreground">Parents</p>
                      <p className="font-medium text-[#1B2A4A]">{certGenRecord.parents}</p>
                    </div>
                  )}
                  {certGenRecord.godparents && (
                    <div>
                      <p className="text-xs text-muted-foreground">Godparents / Sponsors</p>
                      <p className="font-medium text-[#1B2A4A]">{certGenRecord.godparents}</p>
                    </div>
                  )}
                  {certGenRecord.birthDate && (
                    <div>
                      <p className="text-xs text-muted-foreground">Birth Date</p>
                      <p className="font-medium text-[#1B2A4A]">{certGenRecord.birthDate}</p>
                    </div>
                  )}
                  {certGenRecord.birthPlace && (
                    <div>
                      <p className="text-xs text-muted-foreground">Birth Place</p>
                      <p className="font-medium text-[#1B2A4A]">{certGenRecord.birthPlace}</p>
                    </div>
                  )}
                  {(certGenRecord.bookNo || certGenRecord.pageNo || certGenRecord.lineNo) && (
                    <div>
                      <p className="text-xs text-muted-foreground">Register Ref.</p>
                      <p className="font-medium text-[#1B2A4A] font-mono text-xs">
                        Bk {certGenRecord.bookNo || "—"} Pg {certGenRecord.pageNo || "—"} Ln {certGenRecord.lineNo || "—"}
                      </p>
                    </div>
                  )}
                  {certGenRecord.spouse && (
                    <div>
                      <p className="text-xs text-muted-foreground">Spouse</p>
                      <p className="font-medium text-[#1B2A4A]">{certGenRecord.spouse}</p>
                    </div>
                  )}
                  {certGenRecord.husbandFirstName && (
                    <div>
                      <p className="text-xs text-muted-foreground">Husband</p>
                      <p className="font-medium text-[#1B2A4A]">
                        {certGenRecord.husbandFirstName} {certGenRecord.husbandMiddleName} {certGenRecord.husbandLastName}
                      </p>
                    </div>
                  )}
                  {certGenRecord.wifeFirstName && (
                    <div>
                      <p className="text-xs text-muted-foreground">Wife</p>
                      <p className="font-medium text-[#1B2A4A]">
                        {certGenRecord.wifeFirstName} {certGenRecord.wifeMiddleName} {certGenRecord.wifeLastName}
                      </p>
                    </div>
                  )}
                  {certGenRecord.placeOfMarriage && (
                    <div>
                      <p className="text-xs text-muted-foreground">Place of Marriage</p>
                      <p className="font-medium text-[#1B2A4A]">{certGenRecord.placeOfMarriage}</p>
                    </div>
                  )}
                  {certGenRecord.timeOfMarriage && (
                    <div>
                      <p className="text-xs text-muted-foreground">Time of Marriage</p>
                      <p className="font-medium text-[#1B2A4A]">{certGenRecord.timeOfMarriage}</p>
                    </div>
                  )}
                  {certGenRecord.marriageLicenseNo && (
                    <div>
                      <p className="text-xs text-muted-foreground">Marriage License No.</p>
                      <p className="font-medium text-[#1B2A4A]">{certGenRecord.marriageLicenseNo}</p>
                    </div>
                  )}
                  {certGenRecord.registryNo && (
                    <div>
                      <p className="text-xs text-muted-foreground">Registry No.</p>
                      <p className="font-medium text-[#1B2A4A]">{certGenRecord.registryNo}</p>
                    </div>
                  )}
                  {certGenRecord.witnesses && (
                    <div>
                      <p className="text-xs text-muted-foreground">Witnesses</p>
                      <p className="font-medium text-[#1B2A4A]">{certGenRecord.witnesses}</p>
                    </div>
                  )}
                  {certGenRecord.solemnizingOfficerTitle && (
                    <div>
                      <p className="text-xs text-muted-foreground">Solemnizing Officer</p>
                      <p className="font-medium text-[#1B2A4A]">{certGenRecord.solemnizingOfficerTitle}</p>
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
                    const fee = serviceFees[certGenRecord.serviceType as keyof typeof serviceFees]
                    if (!fee || fee <= 0) return "Free"
                    if (certGenRecord.serviceType === "Baptism") return `₱${fee.toLocaleString()}/head`
                    return `₱${fee.toLocaleString()}`
                  })()}
                </span>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setCertGenDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#D4AD63] hover:bg-[#C49A3E] text-white font-semibold gap-2"
              onClick={() => certGenRecord && handleGenerateCertificate(certGenRecord)}
              disabled={!certGenRecord}
            >
              <FileCheck className="h-4 w-4" />
              Generate Certificate
            </Button>
          </DialogFooter>
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
