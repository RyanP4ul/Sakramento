"use client"

import { useState } from "react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Settings,
  Bell,
  ShieldCheck,
  Server,
  Save,
  Download,
  Upload,
  RefreshCw,
  Clock,
  HardDrive,
  Database,
  Lock,
  Info,
} from "lucide-react"

export function SettingsPage() {
  // General Tab State
  const [churchName, setChurchName] = useState("St. Mary's Parish")
  const [churchAddress, setChurchAddress] = useState("123 Rizal Street, Sampaloc, Manila")
  const [contactNumber, setContactNumber] = useState("+63 2 8123 4567")
  const [churchEmail, setChurchEmail] = useState("info@stmarysparish.com")
  const [churchWebsite, setChurchWebsite] = useState("www.stmarysparish.com")

  // Notifications Tab State
  const [notifNewReservation, setNotifNewReservation] = useState(true)
  const [notifPriorityRequest, setNotifPriorityRequest] = useState(true)
  const [notifVerificationComplete, setNotifVerificationComplete] = useState(true)
  const [notifSystemUpdates, setNotifSystemUpdates] = useState(false)
  const [notifWeeklyDigest, setNotifWeeklyDigest] = useState(true)

  // Security Tab State
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [sessionTimeout, setSessionTimeout] = useState("30")

  // System Tab State
  const [dataRetention, setDataRetention] = useState("7")
  const [autoBackup, setAutoBackup] = useState(true)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1B2A4A]/10">
          <Settings className="h-5 w-5 text-[#1B2A4A]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#1B2A4A]">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your system preferences and configuration</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="general" className="gap-1.5">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5">
            <ShieldCheck className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-1.5">
            <Server className="h-4 w-4" />
            System
          </TabsTrigger>
        </TabsList>

        {/* ============ GENERAL TAB ============ */}
        <TabsContent value="general">
          <div className="space-y-6">
            {/* Church Information */}
            <Card className="py-0 overflow-hidden">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-[#1B2A4A] flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1B2A4A]/10">
                    <Info className="h-4 w-4 text-[#1B2A4A]" />
                  </div>
                  Church Information
                </CardTitle>
                <CardDescription>Update your church details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="churchName">Church Name</Label>
                    <Input
                      id="churchName"
                      value={churchName}
                      onChange={(e) => setChurchName(e.target.value)}
                      placeholder="Enter church name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactNumber">Contact Number</Label>
                    <Input
                      id="contactNumber"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      placeholder="Enter contact number"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="churchAddress">Address</Label>
                  <Textarea
                    id="churchAddress"
                    value={churchAddress}
                    onChange={(e) => setChurchAddress(e.target.value)}
                    placeholder="Enter church address"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="churchEmail">Email Address</Label>
                    <Input
                      id="churchEmail"
                      type="email"
                      value={churchEmail}
                      onChange={(e) => setChurchEmail(e.target.value)}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="churchWebsite">Website</Label>
                    <Input
                      id="churchWebsite"
                      value={churchWebsite}
                      onChange={(e) => setChurchWebsite(e.target.value)}
                      placeholder="Enter website URL"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button className="bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 text-white gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* ============ NOTIFICATIONS TAB ============ */}
        <TabsContent value="notifications">
          <div className="space-y-6">
            {/* Notification Preferences */}
            <Card className="py-0 overflow-hidden">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-[#1B2A4A] flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D4AD63]/20">
                    <Bell className="h-4 w-4 text-[#D4AD63]" />
                  </div>
                  Notification Preferences
                </CardTitle>
                <CardDescription>Select which events trigger notifications</CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-3">
                {[
                  {
                    label: "New Reservation",
                    description: "When a new reservation is created",
                    checked: notifNewReservation,
                    onChange: setNotifNewReservation,
                  },
                  {
                    label: "Priority Request",
                    description: "When a priority request is submitted",
                    checked: notifPriorityRequest,
                    onChange: setNotifPriorityRequest,
                  },
                  {
                    label: "Verification Complete",
                    description: "When requirements verification is completed",
                    checked: notifVerificationComplete,
                    onChange: setNotifVerificationComplete,
                  },
                  {
                    label: "System Updates",
                    description: "When system updates are available",
                    checked: notifSystemUpdates,
                    onChange: setNotifSystemUpdates,
                  },
                  {
                    label: "Weekly Digest",
                    description: "Weekly summary of all activities",
                    checked: notifWeeklyDigest,
                    onChange: setNotifWeeklyDigest,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                    <Switch checked={item.checked} onCheckedChange={item.onChange} />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button className="bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 text-white gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* ============ SECURITY TAB ============ */}
        <TabsContent value="security">
          <div className="space-y-6">
            {/* Password Change */}
            <Card className="py-0 overflow-hidden">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-[#1B2A4A] flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1B2A4A]/10">
                    <Lock className="h-4 w-4 text-[#1B2A4A]" />
                  </div>
                  Change Password
                </CardTitle>
                <CardDescription>Update your account password for security</CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
                {newPassword && confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-sm text-red-600 font-medium">Passwords do not match</p>
                )}
              </CardContent>
            </Card>

            {/* Session Timeout */}
            <Card className="py-0 overflow-hidden">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-[#1B2A4A] flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1B2A4A]/10">
                    <Clock className="h-4 w-4 text-[#1B2A4A]" />
                  </div>
                  Session Settings
                </CardTitle>
                <CardDescription>Configure session timeout and auto-logout behavior</CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    min="5"
                    max="120"
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                    placeholder="Enter timeout in minutes"
                    className="w-full sm:w-[200px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    Users will be automatically logged out after this period of inactivity (5-120 minutes)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button className="bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 text-white gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* ============ SYSTEM TAB ============ */}
        <TabsContent value="system">
          <div className="space-y-6">
            {/* Backup & Restore */}
            <Card className="py-0 overflow-hidden">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-[#1B2A4A] flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1B2A4A]/10">
                    <Database className="h-4 w-4 text-[#1B2A4A]" />
                  </div>
                  Backup & Restore
                </CardTitle>
                <CardDescription>Manage system data backups and restoration</CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                      <RefreshCw className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Auto Backup</p>
                      <p className="text-sm text-muted-foreground">
                        Automatically backup data daily at 2:00 AM
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={autoBackup}
                    onCheckedChange={setAutoBackup}
                  />
                </div>

                <Separator />

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" className="gap-2 flex-1">
                    <Download className="h-4 w-4" />
                    Create Backup Now
                  </Button>
                  <Button variant="outline" className="gap-2 flex-1">
                    <Upload className="h-4 w-4" />
                    Restore from Backup
                  </Button>
                </div>

                <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                  <p className="text-sm text-amber-800 font-medium flex items-center gap-2">
                    <HardDrive className="h-4 w-4" />
                    Last Backup: March 15, 2025 at 2:00 AM
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    Backup size: 24.5 MB — Stored locally
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Data Retention */}
            <Card className="py-0 overflow-hidden">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-[#1B2A4A] flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D4AD63]/20">
                    <Clock className="h-4 w-4 text-[#D4AD63]" />
                  </div>
                  Data Retention
                </CardTitle>
                <CardDescription>Configure how long data is retained in the system</CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dataRetention">Retention Period (years)</Label>
                  <Input
                    id="dataRetention"
                    type="number"
                    min="1"
                    max="20"
                    value={dataRetention}
                    onChange={(e) => setDataRetention(e.target.value)}
                    placeholder="Enter retention period in years"
                    className="w-full sm:w-[200px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    Records older than the retention period will be automatically archived (1-20 years)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button className="bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 text-white gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
