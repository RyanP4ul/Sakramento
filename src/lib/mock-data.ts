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

export const mostRequestedServicesByPeriod = {
  weekly: [
    { name: "Baptism", count: 12, percentage: 33.3 },
    { name: "Wedding", count: 8, percentage: 22.2 },
    { name: "Funeral Mass", count: 6, percentage: 16.7 },
    { name: "Confirmation", count: 4, percentage: 11.1 },
    { name: "Anointing of the Sick", count: 3, percentage: 8.3 },
    { name: "House Blessing", count: 3, percentage: 8.3 },
  ],
  monthly: [
    { name: "Baptism", count: 45, percentage: 35.7 },
    { name: "Wedding", count: 32, percentage: 25.4 },
    { name: "Funeral Mass", count: 20, percentage: 15.9 },
    { name: "Confirmation", count: 14, percentage: 11.1 },
    { name: "Anointing of the Sick", count: 9, percentage: 7.1 },
    { name: "House Blessing", count: 6, percentage: 4.8 },
  ],
  yearly: [
    { name: "Baptism", count: 456, percentage: 36.5 },
    { name: "Wedding", count: 312, percentage: 25.0 },
    { name: "Funeral Mass", count: 198, percentage: 15.9 },
    { name: "Confirmation", count: 142, percentage: 11.4 },
    { name: "Anointing of the Sick", count: 78, percentage: 6.3 },
    { name: "House Blessing", count: 62, percentage: 4.9 },
  ],
}

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
  required: boolean
  category: string
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

// Service types that require verification
export const serviceTypesRequiringVerification: ServiceType[] = ["Baptism", "Wedding"]

// Requirement templates per service type
export const requirementTemplates: Record<string, RequirementCheckItem[]> = {
  Baptism: [
    { id: 1, name: "Child Birth Certificate", checked: false, hasFile: false, required: true, category: "Requirements" },
    { id: 2, name: "Parent's Marriage Contract", checked: false, hasFile: false, required: false, category: "Requirements" },
  ],
  Wedding: [
    { id: 1, name: "Marriage License", checked: false, hasFile: false, required: true, category: "Requirements" },
    { id: 2, name: "Certificate of No Marriage (CENOMAR)", checked: false, hasFile: false, required: true, category: "Requirements" },
    { id: 3, name: "Baptismal Certificate", checked: false, hasFile: false, required: true, category: "Church Sacramental Requirements" },
    { id: 4, name: "Confirmation Certificate", checked: false, hasFile: false, required: true, category: "Church Sacramental Requirements" },
    { id: 5, name: "Wedding Banns / Wedding Permission", checked: false, hasFile: false, required: true, category: "Church Sacramental Requirements" },
    { id: 6, name: "Pre-Cana Seminar Certificate", checked: false, hasFile: false, required: true, category: "Seminar & Spiritual Preparation" },
    { id: 7, name: "Certificate of Confession", checked: false, hasFile: false, required: false, category: "Seminar & Spiritual Preparation" },
    { id: 8, name: "DULOG / Meeting with the Parish Priest", checked: false, hasFile: false, required: true, category: "Seminar & Spiritual Preparation" },
  ],
}

export const verificationRecords: VerificationRecord[] = [
  {
    id: 1, applicant: "Maria Santos", serviceType: "Baptism", submittedDate: "2025-03-10", status: "Pending",
    requirements: [
      { id: 1, name: "Child Birth Certificate", checked: true, hasFile: true, required: true, category: "Requirements" },
      { id: 2, name: "Parent's Marriage Contract", checked: false, hasFile: false, required: false, category: "Requirements" },
    ],
    notes: ""
  },
  {
    id: 2, applicant: "Juan Cruz", serviceType: "Wedding", submittedDate: "2025-03-08", status: "Verified",
    requirements: [
      { id: 1, name: "Marriage License", checked: true, hasFile: true, required: true, category: "Requirements" },
      { id: 2, name: "Certificate of No Marriage (CENOMAR)", checked: true, hasFile: true, required: true, category: "Requirements" },
      { id: 3, name: "Baptismal Certificate", checked: true, hasFile: true, required: true, category: "Church Sacramental Requirements" },
      { id: 4, name: "Confirmation Certificate", checked: true, hasFile: true, required: true, category: "Church Sacramental Requirements" },
      { id: 5, name: "Wedding Banns / Wedding Permission", checked: true, hasFile: true, required: true, category: "Church Sacramental Requirements" },
      { id: 6, name: "Pre-Cana Seminar Certificate", checked: true, hasFile: true, required: true, category: "Seminar & Spiritual Preparation" },
      { id: 7, name: "Certificate of Confession", checked: true, hasFile: true, required: false, category: "Seminar & Spiritual Preparation" },
      { id: 8, name: "DULOG / Meeting with the Parish Priest", checked: true, hasFile: true, required: true, category: "Seminar & Spiritual Preparation" },
    ],
    notes: "All requirements complete and verified."
  },
  {
    id: 3, applicant: "Elena Villanueva", serviceType: "Baptism", submittedDate: "2025-03-07", status: "Verified",
    requirements: [
      { id: 1, name: "Child Birth Certificate", checked: true, hasFile: true, required: true, category: "Requirements" },
      { id: 2, name: "Parent's Marriage Contract", checked: true, hasFile: true, required: false, category: "Requirements" },
    ],
    notes: "Complete and verified."
  },
  {
    id: 4, applicant: "Antonio Morales", serviceType: "Wedding", submittedDate: "2025-03-06", status: "Incomplete",
    requirements: [
      { id: 1, name: "Marriage License", checked: true, hasFile: true, required: true, category: "Requirements" },
      { id: 2, name: "Certificate of No Marriage (CENOMAR)", checked: false, hasFile: false, required: true, category: "Requirements" },
      { id: 3, name: "Baptismal Certificate", checked: true, hasFile: true, required: true, category: "Church Sacramental Requirements" },
      { id: 4, name: "Confirmation Certificate", checked: true, hasFile: true, required: true, category: "Church Sacramental Requirements" },
      { id: 5, name: "Wedding Banns / Wedding Permission", checked: false, hasFile: false, required: true, category: "Church Sacramental Requirements" },
      { id: 6, name: "Pre-Cana Seminar Certificate", checked: false, hasFile: false, required: true, category: "Seminar & Spiritual Preparation" },
      { id: 7, name: "Certificate of Confession", checked: false, hasFile: false, required: false, category: "Seminar & Spiritual Preparation" },
      { id: 8, name: "DULOG / Meeting with the Parish Priest", checked: false, hasFile: false, required: true, category: "Seminar & Spiritual Preparation" },
    ],
    notes: "Missing CENOMAR, wedding banns, Pre-Cana seminar, and DULOG."
  },
  {
    id: 5, applicant: "Grace Lim", serviceType: "Baptism", submittedDate: "2025-03-14", status: "Pending",
    requirements: [
      { id: 1, name: "Child Birth Certificate", checked: true, hasFile: true, required: true, category: "Requirements" },
      { id: 2, name: "Parent's Marriage Contract", checked: false, hasFile: false, required: false, category: "Requirements" },
    ],
    notes: ""
  },
  {
    id: 6, applicant: "Jose Ramos", serviceType: "Wedding", submittedDate: "2025-03-12", status: "Pending",
    requirements: [
      { id: 1, name: "Marriage License", checked: true, hasFile: true, required: true, category: "Requirements" },
      { id: 2, name: "Certificate of No Marriage (CENOMAR)", checked: true, hasFile: true, required: true, category: "Requirements" },
      { id: 3, name: "Baptismal Certificate", checked: true, hasFile: true, required: true, category: "Church Sacramental Requirements" },
      { id: 4, name: "Confirmation Certificate", checked: false, hasFile: false, required: true, category: "Church Sacramental Requirements" },
      { id: 5, name: "Wedding Banns / Wedding Permission", checked: true, hasFile: true, required: true, category: "Church Sacramental Requirements" },
      { id: 6, name: "Pre-Cana Seminar Certificate", checked: true, hasFile: true, required: true, category: "Seminar & Spiritual Preparation" },
      { id: 7, name: "Certificate of Confession", checked: false, hasFile: false, required: false, category: "Seminar & Spiritual Preparation" },
      { id: 8, name: "DULOG / Meeting with the Parish Priest", checked: false, hasFile: false, required: true, category: "Seminar & Spiritual Preparation" },
    ],
    notes: ""
  },
  {
    id: 7, applicant: "Carla Mendoza", serviceType: "Baptism", submittedDate: "2025-03-18", status: "Incomplete",
    requirements: [
      { id: 1, name: "Child Birth Certificate", checked: false, hasFile: false, required: true, category: "Requirements" },
      { id: 2, name: "Parent's Marriage Contract", checked: true, hasFile: true, required: false, category: "Requirements" },
    ],
    notes: "Missing child birth certificate - required document."
  },
  {
    id: 8, applicant: "Raul Bautista", serviceType: "Wedding", submittedDate: "2025-03-20", status: "Pending",
    requirements: [
      { id: 1, name: "Marriage License", checked: false, hasFile: false, required: true, category: "Requirements" },
      { id: 2, name: "Certificate of No Marriage (CENOMAR)", checked: false, hasFile: false, required: true, category: "Requirements" },
      { id: 3, name: "Baptismal Certificate", checked: true, hasFile: true, required: true, category: "Church Sacramental Requirements" },
      { id: 4, name: "Confirmation Certificate", checked: true, hasFile: true, required: true, category: "Church Sacramental Requirements" },
      { id: 5, name: "Wedding Banns / Wedding Permission", checked: false, hasFile: false, required: true, category: "Church Sacramental Requirements" },
      { id: 6, name: "Pre-Cana Seminar Certificate", checked: false, hasFile: false, required: true, category: "Seminar & Spiritual Preparation" },
      { id: 7, name: "Certificate of Confession", checked: false, hasFile: false, required: false, category: "Seminar & Spiritual Preparation" },
      { id: 8, name: "DULOG / Meeting with the Parish Priest", checked: true, hasFile: true, required: true, category: "Seminar & Spiritual Preparation" },
    ],
    notes: ""
  },
  {
    id: 9, applicant: "Andres Reyes", serviceType: "Baptism", submittedDate: "2025-03-22", status: "Verified",
    requirements: [
      { id: 1, name: "Child Birth Certificate", checked: true, hasFile: true, required: true, category: "Requirements" },
      { id: 2, name: "Parent's Marriage Contract", checked: true, hasFile: true, required: false, category: "Requirements" },
    ],
    notes: "All required documents verified."
  },
  {
    id: 10, applicant: "Miguel Torres", serviceType: "Wedding", submittedDate: "2025-03-25", status: "Rejected",
    requirements: [
      { id: 1, name: "Marriage License", checked: false, hasFile: false, required: true, category: "Requirements" },
      { id: 2, name: "Certificate of No Marriage (CENOMAR)", checked: false, hasFile: false, required: true, category: "Requirements" },
      { id: 3, name: "Baptismal Certificate", checked: true, hasFile: true, required: true, category: "Church Sacramental Requirements" },
      { id: 4, name: "Confirmation Certificate", checked: false, hasFile: false, required: true, category: "Church Sacramental Requirements" },
      { id: 5, name: "Wedding Banns / Wedding Permission", checked: false, hasFile: false, required: true, category: "Church Sacramental Requirements" },
      { id: 6, name: "Pre-Cana Seminar Certificate", checked: false, hasFile: false, required: true, category: "Seminar & Spiritual Preparation" },
      { id: 7, name: "Certificate of Confession", checked: false, hasFile: false, required: false, category: "Seminar & Spiritual Preparation" },
      { id: 8, name: "DULOG / Meeting with the Parish Priest", checked: false, hasFile: false, required: true, category: "Seminar & Spiritual Preparation" },
    ],
    notes: "Multiple required documents missing. Please resubmit when complete."
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
  // Baptism-specific fields
  birthDate?: string
  birthPlace?: string
  bookNo?: string
  pageNo?: string
  lineNo?: string
  // Wedding-specific fields
  husbandFirstName?: string
  husbandMiddleName?: string
  husbandLastName?: string
  husbandBirthDate?: string
  husbandAge?: number
  husbandBirthPlace?: string
  husbandCitizenship?: string
  husbandResidence?: string
  husbandReligion?: string
  husbandCivilStatus?: string
  husbandFatherName?: string
  husbandFatherCitizenship?: string
  husbandMotherMaidenName?: string
  husbandMotherCitizenship?: string
  wifeFirstName?: string
  wifeMiddleName?: string
  wifeLastName?: string
  wifeBirthDate?: string
  wifeAge?: number
  wifeBirthPlace?: string
  wifeCitizenship?: string
  wifeResidence?: string
  wifeReligion?: string
  wifeCivilStatus?: string
  wifeFatherName?: string
  wifeFatherCitizenship?: string
  wifeMotherMaidenName?: string
  wifeMotherCitizenship?: string
  placeOfMarriage?: string
  timeOfMarriage?: string
  marriageLicenseNo?: string
  marriageLicenseDate?: string
  marriageLicensePlace?: string
  registryNo?: string
  witnesses?: string
  solemnizingOfficerTitle?: string
}

export const sakramentalRecords: SakramentalRecord[] = [
  { id: 1, recordNumber: "BAP-2025-001", serviceType: "Baptism", name: "Maria Santos", date: "2025-01-15", minister: "Rev. Fr. Leopoldo S. Evangelista", status: "Active", hasCertificate: true, parents: "Jose & Ana Santos", godparents: "Luis & Carmen Reyes", details: "Baptized at St. Mary's Parish", birthDate: "2024-11-27", birthPlace: "Malolos, Bulacan", bookNo: "9-789", pageNo: "65", lineNo: "03" },
  { id: 2, recordNumber: "BAP-2025-002", serviceType: "Baptism", name: "Juan Dela Cruz", date: "2025-01-20", minister: "Rev. Fr. Leopoldo S. Evangelista", status: "Active", hasCertificate: true, parents: "Pedro & Rosa Dela Cruz", godparents: "Miguel & Elena Torres", details: "Baptized at St. Mary's Parish", birthDate: "2024-09-10", birthPlace: "Balagtas, Bulacan", bookNo: "9-789", pageNo: "66", lineNo: "01" },
  { id: 3, recordNumber: "WED-2025-001", serviceType: "Wedding", name: "Carlos & Maria Reyes", date: "2025-02-01", minister: "Rev. Fr. Leopoldo S. Evangelista", status: "Active", hasCertificate: true, details: "Wedding ceremony at St. Mary's Parish", husbandFirstName: "Carlos", husbandMiddleName: "Santos", husbandLastName: "Reyes", husbandBirthDate: "1995-03-15", husbandAge: 29, husbandBirthPlace: "Balagtas, Bulacan", husbandCitizenship: "Filipino", husbandResidence: "Borol 2nd, Balagtas, Bulacan", husbandReligion: "Catholic", husbandCivilStatus: "Single", husbandFatherName: "Antonio Reyes", husbandFatherCitizenship: "Filipino", husbandMotherMaidenName: "Maria Santos", husbandMotherCitizenship: "Filipino", wifeFirstName: "Maria", wifeMiddleName: "Dela", wifeLastName: "Cruz", wifeBirthDate: "1997-07-22", wifeAge: 27, wifeBirthPlace: "Malolos, Bulacan", wifeCitizenship: "Filipino", wifeResidence: "Borol 2nd, Balagtas, Bulacan", wifeReligion: "Catholic", wifeCivilStatus: "Single", wifeFatherName: "Pedro Dela Cruz", wifeFatherCitizenship: "Filipino", wifeMotherMaidenName: "Rosa Torres", wifeMotherCitizenship: "Filipino", placeOfMarriage: "St. Peter the Apostle Parish, Borol 2nd, Balagtas, Bulacan", timeOfMarriage: "10:00 am", marriageLicenseNo: "0227755", marriageLicenseDate: "2025-01-15", marriageLicensePlace: "Balagtas, Bulacan", registryNo: "2025-001", witnesses: "Luis Ramos, Carmen Diaz, Roberto Garcia, Ana Villanueva", solemnizingOfficerTitle: "Parish Priest" },
  { id: 4, recordNumber: "CONF-2025-001", serviceType: "Confirmation", name: "Ana Garcia", date: "2025-02-10", minister: "Rev. Fr. Leopoldo S. Evangelista", status: "Active", hasCertificate: true, details: "Confirmed at St. Mary's Parish" },
  { id: 5, recordNumber: "BAP-2025-003", serviceType: "Baptism", name: "Pedro Villanueva", date: "2025-02-15", minister: "Rev. Fr. Leopoldo S. Evangelista", status: "Active", hasCertificate: false, parents: "Antonio & Carmen Villanueva", godparents: "Ricardo & Sofia Lim", details: "Baptized at St. Mary's Parish", birthDate: "2024-12-05", birthPlace: "Bocaue, Bulacan", bookNo: "9-790", pageNo: "12", lineNo: "05" },
  { id: 6, recordNumber: "WED-2025-002", serviceType: "Wedding", name: "Miguel & Rosa Torres", date: "2025-02-20", minister: "Rev. Fr. Leopoldo S. Evangelista", status: "Active", hasCertificate: true, details: "Wedding ceremony at St. Mary's Parish", husbandFirstName: "Miguel", husbandMiddleName: "Cruz", husbandLastName: "Torres", husbandBirthDate: "1993-11-08", husbandAge: 31, husbandBirthPlace: "Bocaue, Bulacan", husbandCitizenship: "Filipino", husbandResidence: "Borol 2nd, Balagtas, Bulacan", husbandReligion: "Catholic", husbandCivilStatus: "Single", husbandFatherName: "Jose Torres", husbandFatherCitizenship: "Filipino", husbandMotherMaidenName: "Elena Ramos", husbandMotherCitizenship: "Filipino", wifeFirstName: "Rosa", wifeMiddleName: "M", wifeLastName: "Santos", wifeBirthDate: "1996-04-12", wifeAge: 28, wifeBirthPlace: "Guiguinto, Bulacan", wifeCitizenship: "Filipino", wifeResidence: "Borol 2nd, Balagtas, Bulacan", wifeReligion: "Catholic", wifeCivilStatus: "Single", wifeFatherName: "Antonio Santos", wifeFatherCitizenship: "Filipino", wifeMotherMaidenName: "Carmen Lim", wifeMotherCitizenship: "Filipino", placeOfMarriage: "St. Peter the Apostle Parish, Borol 2nd, Balagtas, Bulacan", timeOfMarriage: "02:00 pm", marriageLicenseNo: "0227800", marriageLicenseDate: "2025-02-05", marriageLicensePlace: "Balagtas, Bulacan", registryNo: "2025-002", witnesses: "Pedro Reyes, Sofia Mendoza, Luis Garcia, Carmen Diaz", solemnizingOfficerTitle: "Assistant Parish Priest" },
  { id: 7, recordNumber: "FUN-2025-001", serviceType: "Funeral Mass", name: "Elena Navarro", date: "2025-02-25", minister: "Rev. Fr. Leopoldo S. Evangelista", status: "Archived", hasCertificate: false, details: "Funeral mass at St. Mary's Parish" },
  { id: 8, recordNumber: "BAP-2025-004", serviceType: "Baptism", name: "Carmen Diaz", date: "2025-03-01", minister: "Rev. Fr. Leopoldo S. Evangelista", status: "Active", hasCertificate: true, parents: "Luis & Ana Diaz", godparents: "Jose & Maria Ramos", details: "Baptized at St. Mary's Parish", birthDate: "2025-01-15", birthPlace: "Guiguinto, Bulacan", bookNo: "9-790", pageNo: "15", lineNo: "02" },
  { id: 9, recordNumber: "CONF-2025-002", serviceType: "Confirmation", name: "Ricardo Gomez", date: "2025-03-05", minister: "Rev. Fr. Leopoldo S. Evangelista", status: "Active", hasCertificate: true, details: "Confirmed at St. Mary's Parish" },
  { id: 10, recordNumber: "WED-2025-003", serviceType: "Wedding", name: "Benigno & Grace Aquino", date: "2025-03-10", minister: "Rev. Fr. Leopoldo S. Evangelista", status: "Active", hasCertificate: false, details: "Wedding ceremony at St. Mary's Parish", husbandFirstName: "Benigno", husbandMiddleName: "S", husbandLastName: "Aquino", husbandBirthDate: "1990-06-20", husbandAge: 34, husbandBirthPlace: "Meycauayan, Bulacan", husbandCitizenship: "Filipino", husbandResidence: "Borol 2nd, Balagtas, Bulacan", husbandReligion: "Catholic", husbandCivilStatus: "Single", husbandFatherName: "Ricardo Aquino", husbandFatherCitizenship: "Filipino", husbandMotherMaidenName: "Lorna Fernando", husbandMotherCitizenship: "Filipino", wifeFirstName: "Grace", wifeMiddleName: "R", wifeLastName: "Mendoza", wifeBirthDate: "1992-09-03", wifeAge: 32, wifeBirthPlace: "San Jose del Monte, Bulacan", wifeCitizenship: "Filipino", wifeResidence: "Borol 2nd, Balagtas, Bulacan", wifeReligion: "Catholic", wifeCivilStatus: "Single", wifeFatherName: "Luis Mendoza", wifeFatherCitizenship: "Filipino", wifeMotherMaidenName: "Ana Ponce", wifeMotherCitizenship: "Filipino", placeOfMarriage: "St. Peter the Apostle Parish, Borol 2nd, Balagtas, Bulacan", timeOfMarriage: "10:00 am", marriageLicenseNo: "0227850", marriageLicenseDate: "2025-02-20", marriageLicensePlace: "Balagtas, Bulacan", registryNo: "2025-003", witnesses: "Antonio Morales, Elena Reyes, Pedro Santos, Carmen Lim", solemnizingOfficerTitle: "Assistant Parish Priest" },
  { id: 11, recordNumber: "BAP-2025-005", serviceType: "Baptism", name: "Sofia Gonzales", date: "2025-03-12", minister: "Rev. Fr. Leopoldo S. Evangelista", status: "Active", hasCertificate: true, parents: "Raul & Lorna Gonzales", godparents: "Antonio & Elena Morales", details: "Baptized at St. Mary's Parish", birthDate: "2025-02-20", birthPlace: "San Jose del Monte, Bulacan", bookNo: "9-790", pageNo: "22", lineNo: "07" },
  { id: 12, recordNumber: "FUN-2025-002", serviceType: "Funeral Mass", name: "Jose Reyes", date: "2025-03-14", minister: "Rev. Fr. Leopoldo S. Evangelista", status: "Active", hasCertificate: false, details: "Funeral mass at St. Mary's Parish" },
  { id: 13, recordNumber: "BAP-2025-006", serviceType: "Baptism", name: "Luis Mendoza", date: "2025-03-15", minister: "Rev. Fr. Leopoldo S. Evangelista", status: "Pending", hasCertificate: false, parents: "Carla & Andres Mendoza", godparents: "Pedro & Rosa Reyes", details: "Baptized at St. Mary's Parish", birthDate: "2025-02-28", birthPlace: "Meycauayan, Bulacan", bookNo: "9-791", pageNo: "03", lineNo: "01" },
  { id: 14, recordNumber: "WED-2025-004", serviceType: "Wedding", name: "Miguel & Ana Bautista", date: "2025-03-18", minister: "Rev. Fr. Leopoldo S. Evangelista", status: "Active", hasCertificate: true, details: "Wedding ceremony at St. Mary's Parish", husbandFirstName: "Miguel", husbandMiddleName: "D", husbandLastName: "Bautista", husbandBirthDate: "1994-01-10", husbandAge: 31, husbandBirthPlace: "Malolos, Bulacan", husbandCitizenship: "Filipino", husbandResidence: "Borol 2nd, Balagtas, Bulacan", husbandReligion: "Catholic", husbandCivilStatus: "Single", husbandFatherName: "Carlos Bautista", husbandFatherCitizenship: "Filipino", husbandMotherMaidenName: "Dolores Cruz", husbandMotherCitizenship: "Filipino", wifeFirstName: "Ana", wifeMiddleName: "L", wifeLastName: "Gonzales", wifeBirthDate: "1996-05-25", wifeAge: 28, wifeBirthPlace: "Balagtas, Bulacan", wifeCitizenship: "Filipino", wifeResidence: "Borol 2nd, Balagtas, Bulacan", wifeReligion: "Catholic", wifeCivilStatus: "Single", wifeFatherName: "Raul Gonzales", wifeFatherCitizenship: "Filipino", wifeMotherMaidenName: "Lorna Morales", wifeMotherCitizenship: "Filipino", placeOfMarriage: "St. Peter the Apostle Parish, Borol 2nd, Balagtas, Bulacan", timeOfMarriage: "02:00 pm", marriageLicenseNo: "0227900", marriageLicenseDate: "2025-03-05", marriageLicensePlace: "Balagtas, Bulacan", registryNo: "2025-004", witnesses: "Luis Mendoza, Carmen Diaz, Roberto Reyes, Sofia Santos", solemnizingOfficerTitle: "Parish Priest" },
  { id: 15, recordNumber: "CONF-2025-003", serviceType: "Confirmation", name: "Carla Fernandez", date: "2025-03-20", minister: "Rev. Fr. Leopoldo S. Evangelista", status: "Active", hasCertificate: true, details: "Confirmed at St. Mary's Parish" },
]

// ============ PRIEST MANAGEMENT ============
export type PriestStatus = "Active" | "On Leave" | "Retired"
export type PriestAvailability = "Available" | "Busy" | "On Leave"

export type Weekday = "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday"

export const weekdays: Weekday[] = ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export interface Priest {
  id: number
  name: string
  title: string
  status: PriestStatus
  availability: PriestAvailability
  servicePeriod: string
  assignedServices: string[]
  preferredWeekdays: Weekday[]
  email: string
  phone: string
  ordinationDate: string
}

export const priests: Priest[] = [
  { id: 1, name: "Rev. Fr. Leopoldo S. Evangelista", title: "Parish Priest", status: "Active", availability: "Available", servicePeriod: "2020 - Present", assignedServices: ["Baptism", "Wedding", "Funeral Mass", "Anointing of the Sick", "House Blessing & Other", "Confirmation"], preferredWeekdays: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], email: "fr.evangelista@sakramentohub.com", phone: "+63 917 111 1111", ordinationDate: "1995-06-15" },
]

// ============ USER MANAGEMENT ============
export type UserStatus = "Active" | "Inactive" | "Deactivated"

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
  { id: 1, name: "Maria Santos", email: "maria@sakramentohub.com", status: "Active", lastLogin: "2025-03-15 08:30 AM", role: "Admin" },
  { id: 2, name: "Pedro Reyes", email: "pedro@sakramentohub.com", status: "Active", lastLogin: "2025-03-15 09:15 AM", role: "Admin" },
  { id: 3, name: "Rosa Cruz", email: "rosa@sakramentohub.com", status: "Active", lastLogin: "2025-03-14 04:45 PM", role: "Admin" },
  { id: 4, name: "Luis Garcia", email: "luis@sakramentohub.com", status: "Active", lastLogin: "2025-03-15 07:00 AM", role: "Admin" },
  { id: 5, name: "Carmen Dela Cruz", email: "carmen@sakramentohub.com", status: "Active", lastLogin: "2025-03-14 03:30 PM", role: "Admin" },
  { id: 6, name: "Ana Lim", email: "ana@sakramentohub.com", status: "Inactive", lastLogin: "2025-02-28 10:00 AM", role: "Admin" },
  { id: 7, name: "Elena Villanueva", email: "elena@sakramentohub.com", status: "Active", lastLogin: "2025-03-15 08:00 AM", role: "Admin" },
  { id: 8, name: "Antonio Fernandez", email: "antonio@sakramentohub.com", status: "Deactivated", lastLogin: "2025-03-10 11:30 AM", role: "Admin" },
  { id: 9, name: "Miguel Torres", email: "miguel@sakramentohub.com", status: "Active", lastLogin: "2025-03-14 01:00 PM", role: "Admin" },
  { id: 10, name: "Grace Mendoza", email: "grace@sakramentohub.com", status: "Active", lastLogin: "2025-03-15 09:00 AM", role: "Admin" },
  { id: 11, name: "Ricardo Aquino", email: "ricardo@sakramentohub.com", status: "Active", lastLogin: "2025-03-15 10:30 AM", role: "Admin" },
  { id: 12, name: "Benigno Ramos", email: "benigno@sakramentohub.com", status: "Inactive", lastLogin: "2025-03-01 02:15 PM", role: "Admin" },
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
  { id: 7, timestamp: "2025-03-15 09:15:00", user: "Admin Maria", action: "Deactivate User", category: "User Management", details: "Deactivated account: antonio@sakramentohub.com", ip: "192.168.1.100" },
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
export type PaymentMethodType = "Cash" | "GCash"

export interface PaymentRecord {
  id: number
  reservationId: number
  requester: string
  serviceType: ServiceType
  date: string
  amount: number
  status: "Paid" | "Partial" | "Pending" | "Waived"
  paymentMethod?: PaymentMethodType
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
  { id: 12, reservationId: 12, requester: "Jose Ramos", serviceType: "Wedding", date: "2025-04-10", amount: 5000, status: "Paid", paymentMethod: "GCash", receiptNumber: "REC-2025-012" },
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

// ============ DONATIONS ============
export type DonationPurpose = "Church Maintenance" | "Charity" | "Church Events" | "Altar Fund" | "Youth Ministry" | "General Fund"
export type DonationMethod = "Cash" | "GCash"

export interface DonationRecord {
  id: number
  donorName: string
  amount: number
  purpose: DonationPurpose
  paymentMethod: DonationMethod
  date: string
  notes?: string
  receiptNumber: string
}

export const donationRecords: DonationRecord[] = [
  { id: 1, donorName: "Maria Santos", amount: 5000, purpose: "Church Maintenance", paymentMethod: "Cash", date: "2025-03-15", receiptNumber: "DON-2025-001" },
  { id: 2, donorName: "Juan Cruz", amount: 10000, purpose: "Altar Fund", paymentMethod: "GCash", date: "2025-03-14", receiptNumber: "DON-2025-002" },
  { id: 3, donorName: "Ana Dela Cruz", amount: 3000, purpose: "Charity", paymentMethod: "GCash", date: "2025-03-13", receiptNumber: "DON-2025-003" },
  { id: 4, donorName: "Pedro Reyes", amount: 15000, purpose: "Church Maintenance", paymentMethod: "Cash", date: "2025-03-12", receiptNumber: "DON-2025-004" },
  { id: 5, donorName: "Elena Villanueva", amount: 2000, purpose: "Youth Ministry", paymentMethod: "Cash", date: "2025-03-11", receiptNumber: "DON-2025-005" },
  { id: 6, donorName: "Antonio Morales", amount: 7500, purpose: "Church Events", paymentMethod: "GCash", date: "2025-03-10", receiptNumber: "DON-2025-006" },
  { id: 7, donorName: "Rosa Fernandez", amount: 1000, purpose: "General Fund", paymentMethod: "GCash", date: "2025-03-09", receiptNumber: "DON-2025-007" },
  { id: 8, donorName: "Miguel Torres", amount: 8000, purpose: "Altar Fund", paymentMethod: "Cash", date: "2025-03-08", receiptNumber: "DON-2025-008" },
  { id: 9, donorName: "Carmen Diaz", amount: 5000, purpose: "Charity", paymentMethod: "Cash", date: "2025-03-07", receiptNumber: "DON-2025-009" },
  { id: 10, donorName: "Ricardo Gomez", amount: 2500, purpose: "Church Maintenance", paymentMethod: "GCash", date: "2025-03-06", receiptNumber: "DON-2025-010" },
  { id: 11, donorName: "Grace Lim", amount: 12000, purpose: "Church Events", paymentMethod: "GCash", date: "2025-03-05", receiptNumber: "DON-2025-011" },
  { id: 12, donorName: "Jose Ramos", amount: 3500, purpose: "Youth Ministry", paymentMethod: "Cash", date: "2025-03-04", receiptNumber: "DON-2025-012" },
  { id: 13, donorName: "Luisa Garcia", amount: 6000, purpose: "Altar Fund", paymentMethod: "GCash", date: "2025-03-03", receiptNumber: "DON-2025-013" },
  { id: 14, donorName: "Benigno Aquino", amount: 4000, purpose: "General Fund", paymentMethod: "GCash", date: "2025-03-02", receiptNumber: "DON-2025-014" },
  { id: 15, donorName: "Lorna Navarro", amount: 20000, purpose: "Church Maintenance", paymentMethod: "Cash", date: "2025-03-01", receiptNumber: "DON-2025-015" },
  { id: 16, donorName: "Andres Reyes", amount: 1500, purpose: "Charity", paymentMethod: "Cash", date: "2025-02-28", receiptNumber: "DON-2025-016" },
  { id: 17, donorName: "Carla Mendoza", amount: 9000, purpose: "Church Events", paymentMethod: "Cash", date: "2025-02-27", receiptNumber: "DON-2025-017" },
  { id: 18, donorName: "Raul Bautista", amount: 7000, purpose: "Altar Fund", paymentMethod: "GCash", date: "2025-02-26", receiptNumber: "DON-2025-018" },
]

// ============ UPCOMING EVENTS ============
export type EventCategory = "Liturgical" | "Community" | "Sacramental" | "Fundraising" | "Youth" | "Formation"
export type EventStatus = "Upcoming" | "Completed" | "Cancelled"

export interface UpcomingEvent {
  id: number
  eventName: string
  date: string
  time: string
  category: EventCategory
  about: string
  venue: string
  organizer: string
  status: EventStatus
}

export const upcomingEvents: UpcomingEvent[] = [
  { id: 1, eventName: "Holy Week Recollection", date: "2025-04-14", time: "8:00 AM", category: "Liturgical", about: "A three-day spiritual recollection in preparation for the Holy Week observance. Includes talks, confession, and communal prayers.", venue: "Main Church", organizer: "Fr. Antonio Santos", status: "Upcoming" },
  { id: 2, eventName: "Parish Feast Day Celebration", date: "2025-04-20", time: "9:00 AM", category: "Community", about: "Annual feast day celebration of Saint Peter the Apostle parish. Featuring a solemn mass, procession, and community fellowship.", venue: "Parish Grounds", organizer: "Parish Council", status: "Upcoming" },
  { id: 3, eventName: "Lenten Recollection (Past)", date: "2025-03-10", time: "8:00 AM", category: "Liturgical", about: "A half-day Lenten recollection that was held earlier this month. The event concluded successfully with over 100 attendees.", venue: "Main Church", organizer: "Fr. Antonio Santos", status: "Completed" },
  { id: 4, eventName: "Easter Egg Hunt", date: "2025-03-22", time: "9:00 AM", category: "Youth", about: "This event was cancelled due to scheduling conflicts. It will be rescheduled for a later date.", venue: "Parish Grounds", organizer: "Youth Ministry", status: "Cancelled" },
]
