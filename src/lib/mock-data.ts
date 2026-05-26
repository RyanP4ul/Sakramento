// ============ MOCK DATA FOR SAKRAMENTOHUB ============

export const serviceTypes = [
  "Baptism",
  "Wedding",
  "Funeral Mass",
  "Anointing of the Sick",
  "House Blessing & Other",
  "Confirmation",
] as const

export type ServiceType = (typeof serviceTypes)[number]

// ============ DASHBOARD ============
export const dashboardStats = {
  totalReservations: 1248,
  pendingRequests: 47,
  approvedRequests: 312,
  completed: 889,
  totalDonations: 534750,
}

export const todaySchedule = [
  { id: 1, serviceType: "Baptism" as ServiceType, name: "Maria Santos", time: "8:00 AM", status: "Confirmed" as const },
  { id: 2, serviceType: "Wedding" as ServiceType, name: "Juan & Ana Cruz", time: "10:00 AM", status: "Confirmed" as const },
  { id: 3, serviceType: "Funeral Mass" as ServiceType, name: "Pedro Reyes", time: "11:30 AM", status: "Priority" as const },
  { id: 4, serviceType: "Anointing of the Sick" as ServiceType, name: "Luisa Garcia", time: "1:00 PM", status: "Pending" as const },
  { id: 5, serviceType: "House Blessing & Other" as ServiceType, name: "Ricardo Gomez", time: "3:00 PM", status: "Schedule" as const },
  { id: 6, serviceType: "Confirmation" as ServiceType, name: "Carmen Diaz", time: "4:30 PM", status: "Confirmed" as const },
]

export const priorityRequests = [
  { id: 1, name: "Elena Villanueva", date: "2025-03-15", contactNumber: "+63 917 123 4567" },
  { id: 2, name: "Antonio Morales", date: "2025-03-16", contactNumber: "+63 928 234 5678" },
  { id: 3, name: "Rosa Fernandez", date: "2025-03-17", contactNumber: "+63 935 345 6789" },
  { id: 4, name: "Miguel Torres", date: "2025-03-18", contactNumber: "+63 906 456 7890" },
]

export const mostRequestedServices = [
  { name: "Baptism", count: 456, percentage: 36.5 },
  { name: "Wedding", count: 312, percentage: 25.0 },
  { name: "Funeral Mass", count: 198, percentage: 15.9 },
  { name: "Confirmation", count: 142, percentage: 11.4 },
  { name: "Anointing of the Sick", count: 78, percentage: 6.3 },
  { name: "House Blessing", count: 62, percentage: 4.9 },
]

export const peakBookingMonths = [
  { month: "Jan", bookings: 85 },
  { month: "Feb", bookings: 72 },
  { month: "Mar", bookings: 110 },
  { month: "Apr", bookings: 95 },
  { month: "May", bookings: 130 },
  { month: "Jun", bookings: 145 },
  { month: "Jul", bookings: 88 },
  { month: "Aug", bookings: 76 },
  { month: "Sep", bookings: 92 },
  { month: "Oct", bookings: 105 },
  { month: "Nov", bookings: 98 },
  { month: "Dec", bookings: 152 },
]

export const recentActivities = [
  { id: 1, action: "New baptism reservation", user: "Admin Maria", time: "2 minutes ago", type: "reservation" },
  { id: 2, action: "Wedding certificate generated", user: "Fr. Santos", time: "15 minutes ago", type: "certificate" },
  { id: 3, action: "Priority request approved", user: "Admin Pedro", time: "1 hour ago", type: "approval" },
  { id: 4, action: "New priest added", user: "Super Admin", time: "2 hours ago", type: "user" },
  { id: 5, action: "Reservation cancelled", user: "Admin Rosa", time: "3 hours ago", type: "cancellation" },
  { id: 6, action: "Funeral mass scheduled", user: "Admin Luis", time: "4 hours ago", type: "reservation" },
  { id: 7, action: "Donation recorded", user: "Admin Ana", time: "5 hours ago", type: "donation" },
  { id: 8, action: "Requirements verified", user: "Staff Carmen", time: "6 hours ago", type: "verification" },
]

// ============ RESERVATIONS ============
export type ReservationStatus = "Pending" | "Approved" | "Completed" | "Cancelled"
export type PriorityLevel = "High" | "Medium" | "Low"

export interface Reservation {
  id: number
  title: string
  requester: string
  priority: PriorityLevel
  status: ReservationStatus
  description: string
  serviceType: ServiceType
  date: string
  contactNumber: string
}

export const reservations: Reservation[] = [
  { id: 1, title: "Baptism - Santos Family", requester: "Maria Santos", priority: "High", status: "Pending", description: "Baptism for newborn child, needs ASAP scheduling", serviceType: "Baptism", date: "2025-03-20", contactNumber: "+63 917 123 4567" },
  { id: 2, title: "Wedding - Cruz Nuptials", requester: "Juan Cruz", priority: "Medium", status: "Approved", description: "Wedding ceremony scheduled for March", serviceType: "Wedding", date: "2025-03-25", contactNumber: "+63 928 234 5678" },
  { id: 3, title: "Funeral - Reyes Family", requester: "Pedro Reyes", priority: "High", status: "Pending", description: "Funeral mass for departed family member", serviceType: "Funeral Mass", date: "2025-03-16", contactNumber: "+63 935 345 6789" },
  { id: 4, title: "Anointing - Garcia", requester: "Luisa Garcia", priority: "High", status: "Approved", description: "Anointing of the sick for elderly parishioner", serviceType: "Anointing of the Sick", date: "2025-03-18", contactNumber: "+63 906 456 7890" },
  { id: 5, title: "House Blessing - Gomez", requester: "Ricardo Gomez", priority: "Low", status: "Completed", description: "New house blessing ceremony", serviceType: "House Blessing & Other", date: "2025-03-10", contactNumber: "+63 917 567 8901" },
  { id: 6, title: "Baptism - Diaz Family", requester: "Carmen Diaz", priority: "Medium", status: "Completed", description: "Baptism ceremony for twins", serviceType: "Baptism", date: "2025-03-08", contactNumber: "+63 928 678 9012" },
  { id: 7, title: "Confirmation - Villanueva", requester: "Elena Villanueva", priority: "Medium", status: "Cancelled", description: "Confirmation ceremony, rescheduled", serviceType: "Confirmation", date: "2025-03-12", contactNumber: "+63 935 789 0123" },
  { id: 8, title: "Wedding - Morales", requester: "Antonio Morales", priority: "High", status: "Pending", description: "Wedding ceremony with special requirements", serviceType: "Wedding", date: "2025-03-28", contactNumber: "+63 906 890 1234" },
  { id: 9, title: "Funeral Mass - Fernandez", requester: "Rosa Fernandez", priority: "High", status: "Approved", description: "Funeral mass for community leader", serviceType: "Funeral Mass", date: "2025-03-17", contactNumber: "+63 917 901 2345" },
  { id: 10, title: "Baptism - Torres", requester: "Miguel Torres", priority: "Low", status: "Pending", description: "Regular baptism scheduling", serviceType: "Baptism", date: "2025-04-02", contactNumber: "+63 928 012 3456" },
  { id: 11, title: "House Blessing - Lim", requester: "Grace Lim", priority: "Low", status: "Completed", description: "House blessing for renovated home", serviceType: "House Blessing & Other", date: "2025-03-05", contactNumber: "+63 935 123 4560" },
  { id: 12, title: "Wedding - Ramos", requester: "Jose Ramos", priority: "Medium", status: "Approved", description: "April wedding ceremony", serviceType: "Wedding", date: "2025-04-10", contactNumber: "+63 906 234 5671" },
  { id: 13, title: "Confirmation - Aquino", requester: "Benigno Aquino", priority: "Medium", status: "Pending", description: "Batch confirmation ceremony", serviceType: "Confirmation", date: "2025-04-15", contactNumber: "+63 917 345 6782" },
  { id: 14, title: "Anointing - Dela Cruz", requester: "Ana Dela Cruz", priority: "High", status: "Completed", description: "Emergency anointing of the sick", serviceType: "Anointing of the Sick", date: "2025-03-02", contactNumber: "+63 928 456 7893" },
  { id: 15, title: "Baptism - Mendoza", requester: "Carla Mendoza", priority: "Low", status: "Cancelled", description: "Baptism cancelled due to travel", serviceType: "Baptism", date: "2025-03-22", contactNumber: "+63 935 567 8904" },
  { id: 16, title: "Wedding - Bautista", requester: "Raul Bautista", priority: "Medium", status: "Pending", description: "Summer wedding planning", serviceType: "Wedding", date: "2025-05-01", contactNumber: "+63 906 678 9015" },
  { id: 17, title: "Funeral Mass - Navarro", requester: "Lorna Navarro", priority: "High", status: "Approved", description: "Funeral mass arrangements", serviceType: "Funeral Mass", date: "2025-03-19", contactNumber: "+63 917 789 0126" },
  { id: 18, title: "Baptism - Reyes", requester: "Andres Reyes", priority: "Medium", status: "Completed", description: "Baptism with godparent arrangements", serviceType: "Baptism", date: "2025-02-28", contactNumber: "+63 928 890 1237" },
]

// ============ CALENDAR EVENTS ============
export interface CalendarEvent {
  id: number
  serviceType: ServiceType
  fullName: string
  date: string
  time: string
}

export const calendarEvents: CalendarEvent[] = [
  { id: 1, serviceType: "Baptism", fullName: "Maria Santos", date: "2025-03-15", time: "8:00 AM" },
  { id: 2, serviceType: "Wedding", fullName: "Juan & Ana Cruz", date: "2025-03-15", time: "10:00 AM" },
  { id: 3, serviceType: "Funeral Mass", fullName: "Pedro Reyes", date: "2025-03-16", time: "11:30 AM" },
  { id: 4, serviceType: "Anointing of the Sick", fullName: "Luisa Garcia", date: "2025-03-17", time: "1:00 PM" },
  { id: 5, serviceType: "House Blessing & Other", fullName: "Ricardo Gomez", date: "2025-03-18", time: "3:00 PM" },
  { id: 6, serviceType: "Confirmation", fullName: "Carmen Diaz", date: "2025-03-19", time: "4:30 PM" },
  { id: 7, serviceType: "Baptism", fullName: "Elena Villanueva", date: "2025-03-20", time: "9:00 AM" },
  { id: 8, serviceType: "Wedding", fullName: "Antonio & Rosa Morales", date: "2025-03-22", time: "10:00 AM" },
  { id: 9, serviceType: "Funeral Mass", fullName: "Miguel Torres", date: "2025-03-23", time: "11:00 AM" },
  { id: 10, serviceType: "Baptism", fullName: "Grace Lim", date: "2025-03-25", time: "8:30 AM" },
  { id: 11, serviceType: "Wedding", fullName: "Jose & Maria Ramos", date: "2025-03-27", time: "10:00 AM" },
  { id: 12, serviceType: "Anointing of the Sick", fullName: "Benigno Aquino", date: "2025-03-28", time: "2:00 PM" },
  { id: 13, serviceType: "Baptism", fullName: "Ana Dela Cruz", date: "2025-03-30", time: "9:00 AM" },
  { id: 14, serviceType: "Confirmation", fullName: "Carla Mendoza", date: "2025-04-02", time: "4:00 PM" },
  { id: 15, serviceType: "Wedding", fullName: "Raul & Lorna Bautista", date: "2025-04-05", time: "10:00 AM" },
  { id: 16, serviceType: "Funeral Mass", fullName: "Andres Navarro", date: "2025-04-07", time: "11:00 AM" },
  { id: 17, serviceType: "House Blessing & Other", fullName: "Luis Reyes", date: "2025-04-10", time: "3:00 PM" },
  { id: 18, serviceType: "Baptism", fullName: "Sofia Gonzales", date: "2025-04-12", time: "8:00 AM" },
]

// ============ PRIORITY REQUESTS ============
export type PriorityRequestStatus = "Urgent" | "High" | "Medium" | "Scheduled"
export type PaymentStatus = "Paid" | "Partial" | "Pending" | "Waived"

export interface PriorityRequest {
  id: number
  serviceType: ServiceType
  fullName: string
  contact: string
  dateTime: string
  status: PriorityRequestStatus
  payment: PaymentStatus
}

export const priorityRequestsData: PriorityRequest[] = [
  { id: 1, serviceType: "Funeral Mass", fullName: "Pedro Reyes", contact: "+63 917 123 4567", dateTime: "2025-03-16 11:30 AM", status: "Urgent", payment: "Pending" },
  { id: 2, serviceType: "Anointing of the Sick", fullName: "Luisa Garcia", contact: "+63 928 234 5678", dateTime: "2025-03-17 1:00 PM", status: "Urgent", payment: "Waived" },
  { id: 3, serviceType: "Funeral Mass", fullName: "Rosa Fernandez", contact: "+63 935 345 6789", dateTime: "2025-03-18 10:00 AM", status: "High", payment: "Pending" },
  { id: 4, serviceType: "Baptism", fullName: "Elena Villanueva", contact: "+63 906 456 7890", dateTime: "2025-03-20 8:00 AM", status: "High", payment: "Paid" },
  { id: 5, serviceType: "Wedding", fullName: "Antonio Morales", contact: "+63 917 567 8901", dateTime: "2025-03-22 10:00 AM", status: "Medium", payment: "Partial" },
  { id: 6, serviceType: "Anointing of the Sick", fullName: "Miguel Torres", contact: "+63 928 678 9012", dateTime: "2025-03-23 2:00 PM", status: "High", payment: "Waived" },
  { id: 7, serviceType: "Funeral Mass", fullName: "Lorna Navarro", contact: "+63 935 789 0123", dateTime: "2025-03-24 11:00 AM", status: "Urgent", payment: "Pending" },
  { id: 8, serviceType: "Baptism", fullName: "Grace Lim", contact: "+63 906 890 1234", dateTime: "2025-03-25 9:00 AM", status: "Medium", payment: "Paid" },
  { id: 9, serviceType: "Wedding", fullName: "Jose Ramos", contact: "+63 917 901 2345", dateTime: "2025-04-05 10:00 AM", status: "Scheduled", payment: "Paid" },
  { id: 10, serviceType: "Confirmation", fullName: "Benigno Aquino", contact: "+63 928 012 3456", dateTime: "2025-04-10 4:00 PM", status: "Medium", payment: "Partial" },
  { id: 11, serviceType: "House Blessing & Other", fullName: "Ana Dela Cruz", contact: "+63 935 123 4560", dateTime: "2025-04-12 3:00 PM", status: "Low", payment: "Paid" },
  { id: 12, serviceType: "Baptism", fullName: "Carla Mendoza", contact: "+63 906 234 5671", dateTime: "2025-04-15 8:30 AM", status: "Scheduled", payment: "Paid" },
]

// ============ REQUIREMENTS VERIFICATION ============
export type VerificationStatus = "Pending" | "Verified" | "Incomplete" | "Rejected"

export interface RequirementCheckItem {
  id: number
  name: string
  checked: boolean
  hasFile: boolean
}

export interface VerificationRecord {
  id: number
  applicant: string
  serviceType: ServiceType
  submittedDate: string
  status: VerificationStatus
  requirements: RequirementCheckItem[]
  notes: string
}

export const verificationRecords: VerificationRecord[] = [
  {
    id: 1, applicant: "Maria Santos", serviceType: "Baptism", submittedDate: "2025-03-10", status: "Pending",
    requirements: [
      { id: 1, name: "Birth Certificate", checked: true, hasFile: true },
      { id: 2, name: "Parent's Marriage Certificate", checked: true, hasFile: true },
      { id: 3, name: "Godparent's Baptismal Certificate", checked: false, hasFile: false },
      { id: 4, name: "Permission Letter", checked: true, hasFile: true },
    ],
    notes: ""
  },
  {
    id: 2, applicant: "Juan Cruz", serviceType: "Wedding", submittedDate: "2025-03-08", status: "Verified",
    requirements: [
      { id: 1, name: "Baptismal Certificate", checked: true, hasFile: true },
      { id: 2, name: "Confirmation Certificate", checked: true, hasFile: true },
      { id: 3, name: "Marriage License", checked: true, hasFile: true },
      { id: 4, name: "Pre-Cana Seminar Certificate", checked: true, hasFile: true },
      { id: 5, name: "Parent's Consent", checked: true, hasFile: true },
    ],
    notes: "All requirements complete and verified."
  },
  {
    id: 3, applicant: "Pedro Reyes", serviceType: "Funeral Mass", submittedDate: "2025-03-15", status: "Incomplete",
    requirements: [
      { id: 1, name: "Death Certificate", checked: true, hasFile: true },
      { id: 2, name: "Parish Registration", checked: false, hasFile: false },
      { id: 3, name: "Burial Permit", checked: false, hasFile: false },
    ],
    notes: "Missing parish registration and burial permit."
  },
  {
    id: 4, applicant: "Luisa Garcia", serviceType: "Anointing of the Sick", submittedDate: "2025-03-12", status: "Rejected",
    requirements: [
      { id: 1, name: "Medical Certificate", checked: true, hasFile: true },
      { id: 2, name: "Parish ID", checked: true, hasFile: true },
      { id: 3, name: "Family Request Letter", checked: false, hasFile: false },
    ],
    notes: "Invalid medical certificate. Please submit updated document."
  },
  {
    id: 5, applicant: "Ricardo Gomez", serviceType: "House Blessing & Other", submittedDate: "2025-03-11", status: "Verified",
    requirements: [
      { id: 1, name: "Valid ID", checked: true, hasFile: true },
      { id: 2, name: "House Ownership Document", checked: true, hasFile: true },
    ],
    notes: "All requirements verified."
  },
  {
    id: 6, applicant: "Carmen Diaz", serviceType: "Confirmation", submittedDate: "2025-03-09", status: "Pending",
    requirements: [
      { id: 1, name: "Baptismal Certificate", checked: true, hasFile: true },
      { id: 2, name: "Confirmation Registration Form", checked: true, hasFile: true },
      { id: 3, name: "Sponsor's Certificate", checked: false, hasFile: false },
    ],
    notes: ""
  },
  {
    id: 7, applicant: "Elena Villanueva", serviceType: "Baptism", submittedDate: "2025-03-07", status: "Verified",
    requirements: [
      { id: 1, name: "Birth Certificate", checked: true, hasFile: true },
      { id: 2, name: "Parent's Marriage Certificate", checked: true, hasFile: true },
      { id: 3, name: "Godparent's Baptismal Certificate", checked: true, hasFile: true },
    ],
    notes: "Complete and verified."
  },
  {
    id: 8, applicant: "Antonio Morales", serviceType: "Wedding", submittedDate: "2025-03-06", status: "Incomplete",
    requirements: [
      { id: 1, name: "Baptismal Certificate", checked: true, hasFile: true },
      { id: 2, name: "Confirmation Certificate", checked: true, hasFile: true },
      { id: 3, name: "Marriage License", checked: false, hasFile: false },
      { id: 4, name: "Pre-Cana Seminar Certificate", checked: false, hasFile: false },
    ],
    notes: "Missing marriage license and Pre-Cana certificate."
  },
  {
    id: 9, applicant: "Grace Lim", serviceType: "Baptism", submittedDate: "2025-03-14", status: "Pending",
    requirements: [
      { id: 1, name: "Birth Certificate", checked: true, hasFile: true },
      { id: 2, name: "Parent's Marriage Certificate", checked: true, hasFile: true },
      { id: 3, name: "Godparent's Baptismal Certificate", checked: true, hasFile: true },
    ],
    notes: ""
  },
  {
    id: 10, applicant: "Benigno Aquino", serviceType: "Confirmation", submittedDate: "2025-03-13", status: "Pending",
    requirements: [
      { id: 1, name: "Baptismal Certificate", checked: true, hasFile: true },
      { id: 2, name: "Confirmation Registration Form", checked: false, hasFile: false },
      { id: 3, name: "Sponsor's Certificate", checked: false, hasFile: false },
    ],
    notes: ""
  },
]

// ============ SAKRAMENTAL RECORDS ============
export type RecordStatus = "Active" | "Archived" | "Pending"
export type SacramentType = "Baptism" | "Confirmation" | "Wedding" | "Funeral Mass"

export interface SakramentalRecord {
  id: number
  recordNumber: string
  serviceType: SacramentType
  name: string
  date: string
  minister: string
  status: RecordStatus
  hasCertificate: boolean
  parents?: string
  spouse?: string
  godparents?: string
  details: string
}

export const sakramentalRecords: SakramentalRecord[] = [
  { id: 1, recordNumber: "BAP-2025-001", serviceType: "Baptism", name: "Maria Santos", date: "2025-01-15", minister: "Fr. Antonio Santos", status: "Active", hasCertificate: true, parents: "Jose & Ana Santos", godparents: "Luis & Carmen Reyes", details: "Baptized at St. Mary's Parish" },
  { id: 2, recordNumber: "BAP-2025-002", serviceType: "Baptism", name: "Juan Dela Cruz", date: "2025-01-20", minister: "Fr. Antonio Santos", status: "Active", hasCertificate: true, parents: "Pedro & Rosa Dela Cruz", godparents: "Miguel & Elena Torres", details: "Baptized at St. Mary's Parish" },
  { id: 3, recordNumber: "WED-2025-001", serviceType: "Wedding", name: "Carlos & Maria Reyes", date: "2025-02-01", minister: "Fr. Antonio Santos", status: "Active", hasCertificate: true, details: "Wedding ceremony at St. Mary's Parish" },
  { id: 4, recordNumber: "CONF-2025-001", serviceType: "Confirmation", name: "Ana Garcia", date: "2025-02-10", minister: "Bishop Luis Morales", status: "Active", hasCertificate: true, details: "Confirmed at St. Mary's Parish" },
  { id: 5, recordNumber: "BAP-2025-003", serviceType: "Baptism", name: "Pedro Villanueva", date: "2025-02-15", minister: "Fr. Roberto Gomez", status: "Active", hasCertificate: false, parents: "Antonio & Carmen Villanueva", godparents: "Ricardo & Sofia Lim", details: "Baptized at St. Mary's Parish" },
  { id: 6, recordNumber: "WED-2025-002", serviceType: "Wedding", name: "Miguel & Rosa Torres", date: "2025-02-20", minister: "Fr. Roberto Gomez", status: "Active", hasCertificate: true, details: "Wedding ceremony at St. Mary's Parish" },
  { id: 7, recordNumber: "FUN-2025-001", serviceType: "Funeral Mass", name: "Elena Navarro", date: "2025-02-25", minister: "Fr. Antonio Santos", status: "Archived", hasCertificate: false, details: "Funeral mass at St. Mary's Parish" },
  { id: 8, recordNumber: "BAP-2025-004", serviceType: "Baptism", name: "Carmen Diaz", date: "2025-03-01", minister: "Fr. Antonio Santos", status: "Active", hasCertificate: true, parents: "Luis & Ana Diaz", godparents: "Jose & Maria Ramos", details: "Baptized at St. Mary's Parish" },
  { id: 9, recordNumber: "CONF-2025-002", serviceType: "Confirmation", name: "Ricardo Gomez", date: "2025-03-05", minister: "Bishop Luis Morales", status: "Active", hasCertificate: true, details: "Confirmed at St. Mary's Parish" },
  { id: 10, recordNumber: "WED-2025-003", serviceType: "Wedding", name: "Benigno & Grace Aquino", date: "2025-03-10", minister: "Fr. Roberto Gomez", status: "Active", hasCertificate: false, details: "Wedding ceremony at St. Mary's Parish" },
  { id: 11, recordNumber: "BAP-2025-005", serviceType: "Baptism", name: "Sofia Gonzales", date: "2025-03-12", minister: "Fr. Antonio Santos", status: "Active", hasCertificate: true, parents: "Raul & Lorna Gonzales", godparents: "Antonio & Elena Morales", details: "Baptized at St. Mary's Parish" },
  { id: 12, recordNumber: "FUN-2025-002", serviceType: "Funeral Mass", name: "Jose Reyes", date: "2025-03-14", minister: "Fr. Roberto Gomez", status: "Active", hasCertificate: false, details: "Funeral mass at St. Mary's Parish" },
  { id: 13, recordNumber: "BAP-2025-006", serviceType: "Baptism", name: "Luis Mendoza", date: "2025-03-15", minister: "Fr. Antonio Santos", status: "Pending", hasCertificate: false, parents: "Carla & Andres Mendoza", godparents: "Pedro & Rosa Reyes", details: "Baptized at St. Mary's Parish" },
  { id: 14, recordNumber: "WED-2025-004", serviceType: "Wedding", name: "Miguel & Ana Bautista", date: "2025-03-18", minister: "Fr. Antonio Santos", status: "Active", hasCertificate: true, details: "Wedding ceremony at St. Mary's Parish" },
  { id: 15, recordNumber: "CONF-2025-003", serviceType: "Confirmation", name: "Carla Fernandez", date: "2025-03-20", minister: "Bishop Luis Morales", status: "Active", hasCertificate: true, details: "Confirmed at St. Mary's Parish" },
]

// ============ PRIEST MANAGEMENT ============
export type PriestStatus = "Active" | "On Leave" | "Retired"
export type PriestAvailability = "Available" | "Busy" | "On Leave"

export interface Priest {
  id: number
  name: string
  title: string
  status: PriestStatus
  availability: PriestAvailability
  servicePeriod: string
  assignedServices: string[]
  email: string
  phone: string
  ordinationDate: string
}

export const priests: Priest[] = [
  { id: 1, name: "Fr. Antonio Santos", title: "Parish Priest", status: "Active", availability: "Available", servicePeriod: "2020 - Present", assignedServices: ["Baptism", "Wedding", "Funeral Mass"], email: "fr.santos@sakramentohub.com", phone: "+63 917 111 1111", ordinationDate: "1995-06-15" },
  { id: 2, name: "Fr. Roberto Gomez", title: "Assistant Parish Priest", status: "Active", availability: "Available", servicePeriod: "2022 - Present", assignedServices: ["Baptism", "Anointing of the Sick", "House Blessing & Other"], email: "fr.gomez@sakramentohub.com", phone: "+63 928 222 2222", ordinationDate: "2005-03-20" },
  { id: 3, name: "Bishop Luis Morales", title: "Auxiliary Bishop", status: "Active", availability: "Busy", servicePeriod: "2018 - Present", assignedServices: ["Confirmation", "Wedding"], email: "bp.morales@sakramentohub.com", phone: "+63 935 333 3333", ordinationDate: "1988-12-01" },
  { id: 4, name: "Fr. Carlos Reyes", title: "Visiting Priest", status: "Active", availability: "Available", servicePeriod: "2024 - Present", assignedServices: ["Funeral Mass", "Anointing of the Sick"], email: "fr.reyes@sakramentohub.com", phone: "+63 906 444 4444", ordinationDate: "2010-09-12" },
  { id: 5, name: "Fr. Miguel Torres", title: "Parish Priest", status: "On Leave", availability: "On Leave", servicePeriod: "2015 - Present", assignedServices: ["Baptism", "House Blessing & Other"], email: "fr.torres@sakramentohub.com", phone: "+63 917 555 5555", ordinationDate: "2000-05-30" },
  { id: 6, name: "Fr. Andres Navarro", title: "Retired Priest", status: "Retired", availability: "Available", servicePeriod: "1990 - 2023", assignedServices: [], email: "fr.navarro@sakramentohub.com", phone: "+63 928 666 6666", ordinationDate: "1975-08-15" },
  { id: 7, name: "Fr. Jose Ramos", title: "Associate Priest", status: "Active", availability: "Available", servicePeriod: "2023 - Present", assignedServices: ["Baptism", "Wedding", "Funeral Mass"], email: "fr.ramos@sakramentohub.com", phone: "+63 935 777 7777", ordinationDate: "2015-11-22" },
  { id: 8, name: "Fr. Raul Bautista", title: "Chaplain", status: "Active", availability: "Busy", servicePeriod: "2021 - Present", assignedServices: ["Anointing of the Sick", "House Blessing & Other"], email: "fr.bautista@sakramentohub.com", phone: "+63 906 888 8888", ordinationDate: "2008-04-10" },
]

// ============ USER MANAGEMENT ============
export type UserStatus = "Active" | "Inactive" | "Locked"

export interface User {
  id: number
  name: string
  email: string
  status: UserStatus
  lastLogin: string
  role: string
  avatar?: string
}

export const users: User[] = [
  { id: 1, name: "Admin Maria", email: "maria@sakramentohub.com", status: "Active", lastLogin: "2025-03-15 08:30 AM", role: "Super Admin" },
  { id: 2, name: "Staff Pedro", email: "pedro@sakramentohub.com", status: "Active", lastLogin: "2025-03-15 09:15 AM", role: "Staff" },
  { id: 3, name: "Staff Rosa", email: "rosa@sakramentohub.com", status: "Active", lastLogin: "2025-03-14 04:45 PM", role: "Staff" },
  { id: 4, name: "Admin Luis", email: "luis@sakramentohub.com", status: "Active", lastLogin: "2025-03-15 07:00 AM", role: "Admin" },
  { id: 5, name: "Staff Carmen", email: "carmen@sakramentohub.com", status: "Active", lastLogin: "2025-03-14 03:30 PM", role: "Staff" },
  { id: 6, name: "Staff Ana", email: "ana@sakramentohub.com", status: "Inactive", lastLogin: "2025-02-28 10:00 AM", role: "Staff" },
  { id: 7, name: "Admin Elena", email: "elena@sakramentohub.com", status: "Active", lastLogin: "2025-03-15 08:00 AM", role: "Admin" },
  { id: 8, name: "Staff Antonio", email: "antonio@sakramentohub.com", status: "Locked", lastLogin: "2025-03-10 11:30 AM", role: "Staff" },
  { id: 9, name: "Staff Miguel", email: "miguel@sakramentohub.com", status: "Active", lastLogin: "2025-03-14 01:00 PM", role: "Staff" },
  { id: 10, name: "Staff Grace", email: "grace@sakramentohub.com", status: "Active", lastLogin: "2025-03-15 09:00 AM", role: "Staff" },
  { id: 11, name: "Admin Ricardo", email: "ricardo@sakramentohub.com", status: "Active", lastLogin: "2025-03-15 10:30 AM", role: "Admin" },
  { id: 12, name: "Staff Benigno", email: "benigno@sakramentohub.com", status: "Inactive", lastLogin: "2025-03-01 02:15 PM", role: "Staff" },
]

// ============ AUDIT LOGS ============
export interface AuditLog {
  id: number
  timestamp: string
  user: string
  action: string
  category: string
  details: string
  ip: string
}

export const auditLogs: AuditLog[] = [
  { id: 1, timestamp: "2025-03-15 10:30:00", user: "Admin Maria", action: "Login", category: "Authentication", details: "Successful login", ip: "192.168.1.100" },
  { id: 2, timestamp: "2025-03-15 10:25:00", user: "Admin Maria", action: "Create Record", category: "Sacramental Records", details: "Created baptism record BAP-2025-006", ip: "192.168.1.100" },
  { id: 3, timestamp: "2025-03-15 10:15:00", user: "Staff Pedro", action: "Update Status", category: "Reservations", details: "Changed reservation #3 status to Approved", ip: "192.168.1.101" },
  { id: 4, timestamp: "2025-03-15 10:00:00", user: "Staff Rosa", action: "Generate Certificate", category: "Reports", details: "Generated baptism certificate for Maria Santos", ip: "192.168.1.102" },
  { id: 5, timestamp: "2025-03-15 09:45:00", user: "Admin Luis", action: "Verify Requirements", category: "Verification", details: "Verified requirements for Juan Cruz", ip: "192.168.1.103" },
  { id: 6, timestamp: "2025-03-15 09:30:00", user: "Staff Carmen", action: "Add Priest", category: "Priest Management", details: "Added Fr. Jose Ramos", ip: "192.168.1.104" },
  { id: 7, timestamp: "2025-03-15 09:15:00", user: "Admin Maria", action: "Lock User", category: "User Management", details: "Locked account: antonio@sakramentohub.com", ip: "192.168.1.100" },
  { id: 8, timestamp: "2025-03-15 09:00:00", user: "Staff Ana", action: "Delete Record", category: "Sacramental Records", details: "Soft deleted record FUN-2024-012", ip: "192.168.1.105" },
  { id: 9, timestamp: "2025-03-15 08:45:00", user: "Admin Elena", action: "Update Settings", category: "Settings", details: "Updated notification settings", ip: "192.168.1.106" },
  { id: 10, timestamp: "2025-03-15 08:30:00", user: "Staff Pedro", action: "Create Reservation", category: "Reservations", details: "Created new baptism reservation for Elena Villanueva", ip: "192.168.1.101" },
  { id: 11, timestamp: "2025-03-14 16:30:00", user: "Admin Maria", action: "Export Report", category: "Reports", details: "Exported monthly sacrament report", ip: "192.168.1.100" },
  { id: 12, timestamp: "2025-03-14 16:00:00", user: "Staff Rosa", action: "Approve Request", category: "Priority Requests", details: "Approved priority request #3", ip: "192.168.1.102" },
  { id: 13, timestamp: "2025-03-14 15:30:00", user: "Staff Miguel", action: "Update Priest", category: "Priest Management", details: "Updated Fr. Miguel Torres status to On Leave", ip: "192.168.1.107" },
  { id: 14, timestamp: "2025-03-14 15:00:00", user: "Admin Luis", action: "Reject Verification", category: "Verification", details: "Rejected verification for Luisa Garcia", ip: "192.168.1.103" },
  { id: 15, timestamp: "2025-03-14 14:30:00", user: "Staff Grace", action: "Create Event", category: "Calendar", details: "Added calendar event for Confirmation batch", ip: "192.168.1.108" },
]

// ============ REPORTS ============
export interface GeneratedReport {
  id: number
  title: string
  type: string
  dateGenerated: string
  generatedBy: string
  format: string
  size: string
}

export const generatedReports: GeneratedReport[] = [
  { id: 1, title: "Monthly Baptism Report - February 2025", type: "Sacraments", dateGenerated: "2025-03-01", generatedBy: "Admin Maria", format: "PDF", size: "2.4 MB" },
  { id: 2, title: "Quarterly Wedding Summary - Q1 2025", type: "Statistics", dateGenerated: "2025-03-10", generatedBy: "Admin Luis", format: "PDF", size: "1.8 MB" },
  { id: 3, title: "Reservation Status Report", type: "Reservations", dateGenerated: "2025-03-12", generatedBy: "Staff Pedro", format: "Excel", size: "856 KB" },
  { id: 4, title: "Annual Sacrament Statistics 2024", type: "Statistics", dateGenerated: "2025-01-15", generatedBy: "Admin Maria", format: "PDF", size: "5.2 MB" },
  { id: 5, title: "Priest Assignment Report", type: "Sacraments", dateGenerated: "2025-03-14", generatedBy: "Admin Elena", format: "PDF", size: "1.1 MB" },
  { id: 6, title: "Donation Collection Summary", type: "Statistics", dateGenerated: "2025-03-15", generatedBy: "Staff Rosa", format: "Excel", size: "640 KB" },
]

export const reportStats = {
  totalBaptisms: 456,
  totalWeddings: 312,
  totalConfirmations: 142,
}

// ============ FINANCIAL DATA ============
export interface PaymentRecord {
  id: number
  reservationId: number
  requester: string
  serviceType: ServiceType
  date: string
  amount: number
  status: "Paid" | "Partial" | "Pending" | "Waived"
  paymentMethod?: string
  receiptNumber?: string
}

export const paymentRecords: PaymentRecord[] = [
  { id: 1, reservationId: 1, requester: "Maria Santos", serviceType: "Baptism", date: "2025-03-20", amount: 50, status: "Pending", receiptNumber: "REC-2025-001" },
  { id: 2, reservationId: 2, requester: "Juan Cruz", serviceType: "Wedding", date: "2025-03-25", amount: 5000, status: "Partial", paymentMethod: "Cash", receiptNumber: "REC-2025-002" },
  { id: 3, reservationId: 3, requester: "Pedro Reyes", serviceType: "Funeral Mass", date: "2025-03-16", amount: 0, status: "Waived" },
  { id: 4, reservationId: 4, requester: "Luisa Garcia", serviceType: "Anointing of the Sick", date: "2025-03-18", amount: 0, status: "Waived" },
  { id: 5, reservationId: 5, requester: "Ricardo Gomez", serviceType: "House Blessing & Other", date: "2025-03-10", amount: 0, status: "Waived" },
  { id: 6, reservationId: 6, requester: "Carmen Diaz", serviceType: "Baptism", date: "2025-03-08", amount: 100, status: "Paid", paymentMethod: "Cash", receiptNumber: "REC-2025-006" },
  { id: 7, reservationId: 7, requester: "Elena Villanueva", serviceType: "Confirmation", date: "2025-03-12", amount: 0, status: "Waived" },
  { id: 8, reservationId: 8, requester: "Antonio Morales", serviceType: "Wedding", date: "2025-03-28", amount: 5000, status: "Partial", paymentMethod: "Cash", receiptNumber: "REC-2025-008" },
  { id: 9, reservationId: 9, requester: "Rosa Fernandez", serviceType: "Funeral Mass", date: "2025-03-17", amount: 0, status: "Waived" },
  { id: 10, reservationId: 10, requester: "Miguel Torres", serviceType: "Baptism", date: "2025-04-02", amount: 50, status: "Pending", receiptNumber: "REC-2025-010" },
  { id: 11, reservationId: 11, requester: "Grace Lim", serviceType: "House Blessing & Other", date: "2025-03-05", amount: 0, status: "Waived" },
  { id: 12, reservationId: 12, requester: "Jose Ramos", serviceType: "Wedding", date: "2025-04-10", amount: 5000, status: "Paid", paymentMethod: "Bank Transfer", receiptNumber: "REC-2025-012" },
  { id: 13, reservationId: 13, requester: "Benigno Aquino", serviceType: "Confirmation", date: "2025-04-15", amount: 0, status: "Waived" },
  { id: 14, reservationId: 14, requester: "Ana Dela Cruz", serviceType: "Anointing of the Sick", date: "2025-03-02", amount: 0, status: "Waived" },
  { id: 15, reservationId: 15, requester: "Carla Mendoza", serviceType: "Baptism", date: "2025-03-22", amount: 50, status: "Paid", paymentMethod: "Cash", receiptNumber: "REC-2025-015" },
  { id: 16, reservationId: 16, requester: "Raul Bautista", serviceType: "Wedding", date: "2025-05-01", amount: 5000, status: "Pending", receiptNumber: "REC-2025-016" },
  { id: 17, reservationId: 17, requester: "Lorna Navarro", serviceType: "Funeral Mass", date: "2025-03-19", amount: 0, status: "Waived" },
  { id: 18, reservationId: 18, requester: "Andres Reyes", serviceType: "Baptism", date: "2025-02-28", amount: 50, status: "Paid", paymentMethod: "GCash", receiptNumber: "REC-2025-018" },
]

export const incomeSummary = {
  today: 5050,
  thisWeek: 15150,
  thisMonth: 40250,
  thisYear: 275000,
  serviceBreakdown: [
    { service: "Baptism", amount: 4500, count: 90 },
    { service: "Wedding", amount: 270000, count: 54 },
    { service: "Funeral Mass", amount: 0, count: 45 },
    { service: "Confirmation", amount: 0, count: 95 },
    { service: "Anointing of the Sick", amount: 0, count: 25 },
    { service: "House Blessing & Other", amount: 0, count: 125 },
  ],
  monthlyIncome: [
    { month: "Jan", income: 22000 },
    { month: "Feb", income: 19500 },
    { month: "Mar", income: 40250 },
    { month: "Apr", income: 23500 },
    { month: "May", income: 28000 },
    { month: "Jun", income: 32000 },
    { month: "Jul", income: 21000 },
    { month: "Aug", income: 18000 },
    { month: "Sep", income: 22500 },
    { month: "Oct", income: 25000 },
    { month: "Nov", income: 23800 },
    { month: "Dec", income: 29450 },
  ],
  paymentStatusSummary: {
    paid: 5,
    partial: 2,
    pending: 3,
    waived: 8,
  },
}

// Service fees reference
export const serviceFees: Record<ServiceType, number> = {
  "Baptism": 50,
  "Wedding": 5000,
  "Funeral Mass": 0,
  "Anointing of the Sick": 0,
  "House Blessing & Other": 0,
  "Confirmation": 0,
}
