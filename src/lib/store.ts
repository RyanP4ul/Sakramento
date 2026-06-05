import { create } from "zustand"

export type PageName =
  | "login"
  | "dashboard"
  | "reservations"
  | "calendar"
  | "sakramental-records"
  | "priest-management"
  | "payments"
  | "events"
  | "reports"
  | "user-management"
  | "audit-logs"
  | "settings"

interface AppState {
  currentPage: PageName
  isLoggedIn: boolean
  sidebarOpen: boolean
  setCurrentPage: (page: PageName) => void
  setIsLoggedIn: (val: boolean) => void
  setSidebarOpen: (val: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  currentPage: "login",
  isLoggedIn: false,
  sidebarOpen: true,
  setCurrentPage: (page) => set({ currentPage: page }),
  setIsLoggedIn: (val) => set({ isLoggedIn: val, currentPage: val ? "dashboard" : "login" }),
  setSidebarOpen: (val) => set({ sidebarOpen: val }),
}))
