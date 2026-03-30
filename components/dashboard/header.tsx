"use client"

import { useState } from "react"
import { useAuth } from "@/lib/context/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, LogOut, ChevronDown, GraduationCap, BookOpen, Users, Shield } from "lucide-react"
import type { UserRole } from "@/lib/types/database"
import { MobileSidebar } from "./mobile-sidebar"

const roleLabels: Record<UserRole, { label: string; icon: React.ReactNode }> = {
  student: { label: "Student", icon: <GraduationCap className="h-4 w-4" /> },
  teacher: { label: "Teacher", icon: <BookOpen className="h-4 w-4" /> },
  parent: { label: "Parent", icon: <Users className="h-4 w-4" /> },
  admin: { label: "Administrator", icon: <Shield className="h-4 w-4" /> },
}

export function DashboardHeader() {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    window.location.href = "/login"
  }

  if (!user) return null

  const roleInfo = roleLabels[user.role]

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="hidden sm:block">
              <p className="text-sm text-slate-500">
                Welcome back,{" "}
                <span className="font-medium text-slate-900">{user.full_name}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-sm">
              {roleInfo.icon}
              <span className="text-slate-700 hidden sm:inline">{roleInfo.label}</span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-medium">
                    {user.full_name.charAt(0)}
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{user.full_name}</span>
                    <span className="text-xs text-slate-500 font-normal">{user.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="gap-2 text-red-600">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <MobileSidebar open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  )
}
