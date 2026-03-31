"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/context/auth-context"
import { cn } from "@/lib/utils"
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  Trophy,
  Calendar,
  MessageSquare,
  Users,
  AlertTriangle,
  Settings,
  Monitor,
  BarChart3,
  PlusCircle,
  CalendarDays,
} from "lucide-react"

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  roles: string[]
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    roles: ["student", "teacher", "parent", "admin"],
  },
  {
    label: "My Grades",
    href: "/dashboard/grades",
    icon: <BookOpen className="h-5 w-5" />,
    roles: ["student", "parent"],
  },
  {
    label: "Achievements",
    href: "/dashboard/achievements",
    icon: <Trophy className="h-5 w-5" />,
    roles: ["student", "parent"],
  },
  {
    label: "AI Mentor",
    href: "/dashboard/ai-mentor",
    icon: <MessageSquare className="h-5 w-5" />,
    roles: ["student"],
  },
  {
    label: "Events",
    href: "/dashboard/events",
    icon: <Calendar className="h-5 w-5" />,
    roles: ["student", "teacher", "parent", "admin"],
  },
  {
    label: "Students",
    href: "/dashboard/students",
    icon: <Users className="h-5 w-5" />,
    roles: ["teacher", "admin"],
  },
  {
    label: "At-Risk Students",
    href: "/dashboard/at-risk",
    icon: <AlertTriangle className="h-5 w-5" />,
    roles: ["teacher"],
  },
  {
    label: "Record Grade",
    href: "/dashboard/record-grade",
    icon: <PlusCircle className="h-5 w-5" />,
    roles: ["teacher"],
  },
  {
    label: "Record Achievement",
    href: "/dashboard/record-achievement",
    icon: <Trophy className="h-5 w-5" />,
    roles: ["teacher"],
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: <BarChart3 className="h-5 w-5" />,
    roles: ["admin"],
  },
  {
    label: "Manage Events",
    href: "/dashboard/manage-events",
    icon: <Calendar className="h-5 w-5" />,
    roles: ["admin"],
  },
  {
    label: "Smart Schedule",
    href: "/dashboard/schedule",
    icon: <CalendarDays className="h-5 w-5" />,
    roles: ["admin"],
  },
  {
    label: "Kiosk Mode",
    href: "/kiosk",
    icon: <Monitor className="h-5 w-5" />,
    roles: ["admin"],
  },
]

export function DashboardSidebar() {
  const { user } = useAuth()
  const pathname = usePathname()

  const filteredNavItems = navItems.filter(
    (item) => user && item.roles.includes(user.role)
  )

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 hidden lg:block">
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-slate-200">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-semibold text-slate-900">Aqbobek</h1>
              <p className="text-xs text-slate-500">School Portal</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
        </div>
      </div>
    </aside>
  )
}
