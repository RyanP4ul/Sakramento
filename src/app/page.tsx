"use client"

import { useAppStore } from "@/lib/store"
import { LoginPage } from "@/components/pages/login-page"
import { AppLayout } from "@/components/layout/app-layout"
import { DashboardPage } from "@/components/pages/dashboard-page"
import { ReservationsPage } from "@/components/pages/reservations-page"
import { CalendarPage } from "@/components/pages/calendar-page"
import { SakramentalRecordsPage } from "@/components/pages/sakramental-records-page"
import { PriestManagementPage } from "@/components/pages/priest-management-page"
import { UserManagementPage } from "@/components/pages/user-management-page"
import { ReportsPage } from "@/components/pages/reports-page"
import { PaymentPage } from "@/components/pages/payment-page"
import { EventsPage } from "@/components/pages/events-page"
import { AuditLogsPage } from "@/components/pages/audit-logs-page"
import { SettingsPage } from "@/components/pages/settings-page"

export default function Home() {
  const { isLoggedIn, currentPage } = useAppStore()

  if (!isLoggedIn) {
    return <LoginPage />
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />
      case "reservations":
        return <ReservationsPage />
      case "sakramental-records":
        return <SakramentalRecordsPage />
      case "priest-management":
        return <PriestManagementPage />
      case "calendar":
        return <CalendarPage />
      case "payments":
        return <PaymentPage />
      case "events":
        return <EventsPage />
      case "user-management":
        return <UserManagementPage />
      case "reports":
        return <ReportsPage />
      case "audit-logs":
        return <AuditLogsPage />
      case "settings":
        return <SettingsPage />
      default:
        return <DashboardPage />
    }
  }

  return <AppLayout>{renderPage()}</AppLayout>
}
