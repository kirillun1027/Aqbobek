"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  AlertTriangle, 
  TrendingUp,
  TrendingDown,
  PlusCircle,
  Trophy,
  Calendar,
  ArrowRight,
  BookOpen,
  RefreshCw,
} from "lucide-react"
import type { User, Grade, Event } from "@/lib/types/database"
import { calculateSubjectAverage } from "@/lib/utils/analytics"
import {
  getAllGradesFromBackend,
  getAtRiskStudentsFromBackend,
  getEventsFromBackend,
  getStudentsFromBackend,
} from "@/lib/api/backend"

interface TeacherDashboardProps {
  user: User
}

export function TeacherDashboard({ user }: TeacherDashboardProps) {
  const [students, setStudents] = useState<User[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [atRiskStudents, setAtRiskStudents] = useState<{ student: User; average: number; concernSubjects: string[] }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  async function loadData() {
    try {
      setIsLoading(true)
      setError("")
      const [studentsData, gradesData, eventsData, atRisk] = await Promise.all([
        getStudentsFromBackend(),
        getAllGradesFromBackend(3),
        getEventsFromBackend(true),
        getAtRiskStudentsFromBackend(70, 3),
      ])

      setStudents(studentsData)
      setGrades(gradesData)
      setEvents(eventsData.slice(0, 3))
      setAtRiskStudents(
        atRisk.map(item => ({
          student: {
            id: item.student.id,
            email: item.student.email,
            full_name: item.student.full_name,
            role: item.student.role,
            class_name: item.student.class_name || undefined,
            grade: item.student.grade_level || undefined,
            linked_student_ids: item.student.linked_student_ids || [],
            created_at: item.student.created_at,
          },
          average: item.average,
          concernSubjects: item.concern_subjects,
        }))
      )
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load teacher dashboard.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Teacher Dashboard</CardTitle>
          <CardDescription>Overview of your students and class performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
          <Button onClick={() => void loadData()} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Calculate class statistics
  const classAverage = grades.length > 0
    ? Math.round(grades.reduce((sum, g) => sum + (g.score / g.max_score) * 100, 0) / grades.length)
    : 0

  const subjectStats = calculateSubjectAverage(grades)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Teacher Dashboard</h1>
        <p className="text-slate-600">Overview of your students and class performance</p>
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
                <p className="text-slate-500 text-sm">Total Students</p>
                <p className="text-2xl font-bold text-slate-900">{students.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-slate-500 text-sm">Class Average</p>
                <p className="text-2xl font-bold text-slate-900">{classAverage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-slate-500 text-sm">At Risk</p>
                <p className="text-2xl font-bold text-slate-900">{atRiskStudents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-slate-500 text-sm">Subjects</p>
                <p className="text-2xl font-bold text-slate-900">{subjectStats.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/dashboard/record-grade">
          <Card className="hover:bg-slate-50 transition-colors cursor-pointer h-full">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <PlusCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Record Grade</p>
                <p className="text-sm text-slate-500">Add a new grade for a student</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/record-achievement">
          <Card className="hover:bg-slate-50 transition-colors cursor-pointer h-full">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-amber-100 rounded-lg">
                <Trophy className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Record Achievement</p>
                <p className="text-sm text-slate-500">Award an achievement to a student</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* At-Risk Students */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">At-Risk Students</CardTitle>
              <CardDescription>Students needing additional support</CardDescription>
            </div>
            <Link href="/dashboard/at-risk">
              <Button variant="ghost" size="sm" className="gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {atRiskStudents.length > 0 ? (
              <div className="space-y-3">
                {atRiskStudents.slice(0, 4).map(({ student, average, concernSubjects }) => (
                  <div key={student.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-sm font-medium">
                        {student.full_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{student.full_name}</p>
                        <p className="text-xs text-slate-500">
                          {concernSubjects.length > 0 
                            ? `Struggling in: ${concernSubjects.join(", ")}`
                            : "Low overall average"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-red-600">
                      <TrendingDown className="h-4 w-4" />
                      <span className="font-medium">{average}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="p-3 bg-emerald-100 rounded-full w-fit mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                </div>
                <p className="text-slate-600">All students are performing well!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subject Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Subject Averages</CardTitle>
            <CardDescription>Class performance by subject</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {subjectStats.map((subject) => (
                <div key={subject.subject} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="font-medium text-slate-900 text-sm">{subject.subject}</span>
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

      {/* Upcoming Events */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-lg">Upcoming Events</CardTitle>
            <CardDescription>School calendar</CardDescription>
          </div>
          <Link href="/dashboard/events">
            <Button variant="ghost" size="sm" className="gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {events.map((event) => (
              <div key={event.id} className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-xs text-slate-500">
                    {new Date(event.start_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <p className="font-medium text-slate-900 text-sm">{event.title}</p>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{event.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
