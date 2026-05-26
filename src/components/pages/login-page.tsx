"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Eye, EyeOff, Cross } from "lucide-react"
import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function LoginPage() {
  const setIsLoggedIn = useAppStore((s) => s.setIsLoggedIn)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate a brief loading state for visual feedback
    await new Promise((resolve) => setTimeout(resolve, 600))
    setIsLoggedIn(true)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#1B2A4A] p-4 sm:p-6">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0">
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,173,99,0.08)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(212,173,99,0.06)_0%,transparent_50%)]" />

        {/* Subtle cross pattern */}
        <svg className="absolute inset-0 h-full w-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cross-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M30 10 L30 50 M15 25 L45 25" stroke="#D4AD63" strokeWidth="1" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cross-pattern)" />
        </svg>

        {/* Decorative corner arcs */}
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#D4AD63]/5 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-[#D4AD63]/5 blur-3xl" />

        {/* Floating decorative crosses */}
        <Cross className="absolute left-[10%] top-[15%] h-8 w-8 text-[#D4AD63]/10 rotate-12" />
        <Cross className="absolute right-[12%] top-[20%] h-6 w-6 text-[#D4AD63]/8 -rotate-6" />
        <Cross className="absolute left-[8%] bottom-[25%] h-5 w-5 text-[#D4AD63]/6 rotate-45" />
        <Cross className="absolute right-[15%] bottom-[18%] h-7 w-7 text-[#D4AD63]/10 -rotate-12" />
        <Cross className="absolute left-[40%] top-[8%] h-4 w-4 text-[#D4AD63]/8 rotate-90" />
        <Cross className="absolute right-[35%] bottom-[10%] h-6 w-6 text-[#D4AD63]/6 rotate-30" />

        {/* Subtle horizontal line accents */}
        <div className="absolute left-0 right-0 top-[30%] h-px bg-gradient-to-r from-transparent via-[#D4AD63]/10 to-transparent" />
        <div className="absolute left-0 right-0 bottom-[35%] h-px bg-gradient-to-r from-transparent via-[#D4AD63]/10 to-transparent" />
      </div>

      {/* Main login card */}
      <Card className="relative z-10 w-full max-w-md border-0 bg-white/95 shadow-2xl shadow-black/20 backdrop-blur-sm sm:max-w-[440px]">
        <CardHeader className="items-center gap-2 pb-2 pt-8">
          {/* Logo - no background */}
          <div className="flex items-center justify-center mb-2">
            <Image
              src="/sakramento-logo.png"
              alt="Saint Peter the Apostle Logo"
              width={72}
              height={72}
              className="object-contain"
            />
          </div>

          {/* Branding - centered */}
          <h1 className="text-2xl font-bold tracking-tight text-[#1B2A4A] sm:text-[26px] text-center">
            Saint Peter the Apostle
          </h1>
          <p className="text-sm text-muted-foreground text-center">
            Parish Management System
          </p>
        </CardHeader>

        <CardContent className="pb-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-[#1B2A4A] font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="name@parish.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 border-[#1B2A4A]/15 bg-white pl-4 text-[#1B2A4A] placeholder:text-[#1B2A4A]/35 focus-visible:border-[#D4AD63] focus-visible:ring-[#D4AD63]/25"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="text-[#1B2A4A] font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 border-[#1B2A4A]/15 bg-white pr-11 text-[#1B2A4A] placeholder:text-[#1B2A4A]/35 focus-visible:border-[#D4AD63] focus-visible:ring-[#D4AD63]/25"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1B2A4A]/40 transition-colors hover:text-[#1B2A4A]/70"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4.5 w-4.5" />
                  ) : (
                    <Eye className="h-4.5 w-4.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                  className="h-4 w-4 border-[#1B2A4A]/25 data-[state=checked]:bg-[#1B2A4A] data-[state=checked]:border-[#1B2A4A]"
                />
                <Label
                  htmlFor="remember"
                  className="cursor-pointer text-sm font-normal text-muted-foreground"
                >
                  Remember me
                </Label>
              </div>
              <button
                type="button"
                className="text-sm font-medium text-[#D4AD63] transition-colors hover:text-[#C49A3E] hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="h-11 bg-[#1B2A4A] text-white shadow-lg shadow-[#1B2A4A]/25 transition-all hover:bg-[#2D4268] hover:shadow-xl hover:shadow-[#1B2A4A]/30 active:scale-[0.98] disabled:opacity-70"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  <span>Signing in...</span>
                </div>
              ) : (
                <span className="font-semibold">Sign In</span>
              )}
            </Button>

            {/* Copyright */}
            <p className="text-center text-xs text-muted-foreground/70 pt-2">
              © 2026 Saint Peter the Apostle Parish. All rights reserved.
            </p>
          </form>
        </CardContent>
      </Card>

      {/* Bottom branding */}
      <div className="absolute bottom-6 left-0 right-0 z-10 text-center">
        <p className="text-xs text-white/30">
          © 2026 Saint Peter the Apostle Parish. All rights reserved.
        </p>
      </div>
    </div>
  )
}
