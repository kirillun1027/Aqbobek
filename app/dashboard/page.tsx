"use client"

import { useAuth } from "@/lib/context/auth-context"
import { StudentDashboard } from "@/components/dashboard/views/student-dashboard"
import { TeacherDashboard } from "@/components/dashboard/views/teacher-dashboard"
import { ParentDashboard } from "@/components/dashboard/views/parent-dashboard"
import { AdminDashboard } from "@/components/dashboard/views/admin-dashboard"

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) return null

  switch (user.role) {
    case "student":
      return <StudentDashboard user={user} />
    case "teacher":
      return <TeacherDashboard user={user} />
    case "parent":
      return <ParentDashboard user={user} />
    case "admin":
      return <AdminDashboard user={user} />
    default:
      return <StudentDashboard user={user} />
  }
}
