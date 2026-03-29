"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  TrendingUp,
  Calendar,
  BarChart3,
  Monitor,
  ArrowRight,
  BookOpen,
  Trophy,
  PlusCircle
} from "lucide-react"
import type { User, Grade, Achievement, Event } from "@/lib/types/database"
import { 
  getStudents,
  getAllGrades,
  getAllAchievements,
  getEvents,
  getRankings,
  calculateSubjectAverage
} from "@/lib/services/data-service"
import { mockUsers } from "@/lib/mock/data"

interface AdminDashboardProps {
  user: User
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const [students, setStudents] = useState<User[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [topStudents, setTopStudents] = useState<{ name: string; average: number }[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const [studentsData, gradesData, achievementsData, eventsData, rankingsData] = await Promise.all([
        getStudents(),
        getAllGrades(3),
        getAllAchievements(),
        getEvents(),
        getRankings(),
      ])

      setStudents(studentsData)
      setGrades(gradesData)
      setAchievements(achievementsData)
      setEvents(eventsData)
      setTopStudents(rankingsData.slice(0, 5).map(r => ({ name: r.name, average: r.average })))
      setIsLoading(false)
    }

    loadData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const teachers = mockUsers.filter(u => u.role === "teacher")
  const parents = mockUsers.filter(u => u.role === "parent")
  
  const schoolAverage = grades.length > 0
    ? Math.round(grades.reduce((sum, g) => sum + (g.score / g.max_score) * 100, 0) / grades.length)
    : 0

  const subjectStats = calculateSubjectAverage(grades)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-600">School-wide overview and management</p>
        </div>
        <Link href="/kiosk" target="_blank">
          <Button className="gap-2 bg-slate-900 hover:bg-slate-800 text-white">
            <Monitor className="h-4 w-4" />
            Open Kiosk Mode
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-slate-500 text-sm">Students</p>
                <p className="text-2xl font-bold text-slate-900">{students.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-slate-500 text-sm">Teachers</p>
                <p className="text-2xl font-bold text-slate-900">{teachers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-slate-500 text-sm">School Average</p>
                <p className="text-2xl font-bold text-slate-900">{schoolAverage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-slate-500 text-sm">Events</p>
                <p className="text-2xl font-bold text-slate-900">{events.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/dashboard/manage-events">
          <Card className="hover:bg-slate-50 transition-colors cursor-pointer h-full">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <PlusCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Create Event</p>
                <p className="text-sm text-slate-500">Add news or events</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/analytics">
          <Card className="hover:bg-slate-50 transition-colors cursor-pointer h-full">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">View Analytics</p>
                <p className="text-sm text-slate-500">School performance data</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/students">
          <Card className="hover:bg-slate-50 transition-colors cursor-pointer h-full">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <Users className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Manage Students</p>
                <p className="text-sm text-slate-500">View all students</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Students */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Performing Students</CardTitle>
            <CardDescription>Based on current quarter average</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topStudents.map((student, index) => (
                <div key={student.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? "bg-amber-100 text-amber-700" :
                      index === 1 ? "bg-slate-200 text-slate-700" :
                      index === 2 ? "bg-orange-100 text-orange-700" :
                      "bg-slate-100 text-slate-600"
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-medium text-slate-900">{student.name}</span>
                  </div>
                  <Badge 
                    variant="secondary"
                    className="bg-emerald-100 text-emerald-700"
                  >
                    {student.average}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Subject Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Subject Averages</CardTitle>
            <CardDescription>School-wide performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {subjectStats.map((subject) => (
                <div key={subject.subject} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="font-medium text-slate-900">{subject.subject}</span>
                  <Badge 
                    variant="secondary"
                    className={
                      subject.average >= 85 ? "bg-emerald-100 text-emerald-700" :
                      subject.average >= 70 ? "bg-amber-100 text-amber-700" :
                      "bg-red-100 text-red-700"
                    }
                  >
                    {subject.average}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Events */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-lg">Upcoming Events</CardTitle>
            <CardDescription>School calendar</CardDescription>
          </div>
          <Link href="/dashboard/manage-events">
            <Button variant="ghost" size="sm" className="gap-1">
              Manage <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {events.slice(0, 3).map((event) => (
              <div key={event.id} className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500">
                    {new Date(event.start_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  {event.is_featured && (
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                      Featured
                    </Badge>
                  )}
                </div>
                <p className="font-medium text-slate-900">{event.title}</p>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{event.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
