"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/context/auth-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, TrendingUp, TrendingDown, Minus, Calendar } from "lucide-react"
import { calculateSubjectAverage } from "@/lib/utils/analytics"
import { getGradesForStudentFromBackend } from "@/lib/api/backend"
import type { Grade } from "@/lib/types/database"

export default function GradesPage() {
  const { user } = useAuth()
  const [allGrades, setAllGrades] = useState<Grade[]>([])
  const [selectedQuarter, setSelectedQuarter] = useState("3")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadGrades() {
      if (!user) return

      try {
        const studentId = user.role === "parent"
          ? user.linked_student_ids?.[0]
          : user.id

        if (!studentId) {
          throw new Error("No student is linked to this account.")
        }

        const allStudentGrades = await getGradesForStudentFromBackend(studentId)
        setAllGrades(allStudentGrades)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load grades")
      } finally {
        setIsLoading(false)
      }
    }
    
    loadGrades()
  }, [user])

  if (!user) return null

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        {error}
      </div>
    )
  }

  const quarterGrades = allGrades.filter(g => g.quarter === parseInt(selectedQuarter))
  const subjectAverages = calculateSubjectAverage(quarterGrades)
  const overallAverage = subjectAverages.length > 0
    ? Math.round(subjectAverages.reduce((sum, s) => sum + s.average, 0) / subjectAverages.length)
    : 0

  // Calculate trends (compare with previous quarter)
  const prevQuarter = parseInt(selectedQuarter) - 1
  const prevQuarterGrades = allGrades.filter(g => g.quarter === prevQuarter)
  const prevSubjectAverages = calculateSubjectAverage(prevQuarterGrades)

  const getTrend = (subject: string, currentAvg: number) => {
    const prev = prevSubjectAverages.find(s => s.subject === subject)
    if (!prev) return null
    const diff = currentAvg - prev.average
    if (diff > 2) return { direction: "up", value: diff }
    if (diff < -2) return { direction: "down", value: Math.abs(diff) }
    return { direction: "stable", value: 0 }
  }

  // Group grades by subject
  const gradesBySubject: Record<string, Grade[]> = {}
  quarterGrades.forEach(g => {
    if (!gradesBySubject[g.subject]) {
      gradesBySubject[g.subject] = []
    }
    gradesBySubject[g.subject].push(g)
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Grades</h1>
        <p className="text-slate-600">Track your academic performance</p>
      </div>

      {/* Overall Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100">Overall Average</p>
                <p className="text-4xl font-bold mt-1">{overallAverage}%</p>
              </div>
              <div className="p-3 bg-white/20 rounded-lg">
                <BookOpen className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500">Total Grades</p>
                <p className="text-4xl font-bold text-slate-900 mt-1">{quarterGrades.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500">Subjects</p>
                <p className="text-4xl font-bold text-slate-900 mt-1">{subjectAverages.length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quarter Tabs */}
      <Tabs defaultValue="3" onValueChange={setSelectedQuarter}>
        <TabsList>
          <TabsTrigger value="1">Quarter 1</TabsTrigger>
          <TabsTrigger value="2">Quarter 2</TabsTrigger>
          <TabsTrigger value="3">Quarter 3</TabsTrigger>
          <TabsTrigger value="4">Quarter 4</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedQuarter} className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Subject Averages */}
            <Card>
              <CardHeader>
                <CardTitle>Subject Averages</CardTitle>
                <CardDescription>Your performance by subject</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subjectAverages.map((subject) => {
                    const trend = getTrend(subject.subject, subject.average)
                    return (
                      <div key={subject.subject} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-slate-700">{subject.subject}</span>
                          <div className="flex items-center gap-2">
                            {trend && (
                              <span className={`flex items-center text-xs ${
                                trend.direction === "up" ? "text-emerald-600" :
                                trend.direction === "down" ? "text-red-600" :
                                "text-slate-400"
                              }`}>
                                {trend.direction === "up" && <TrendingUp className="h-3 w-3 mr-1" />}
                                {trend.direction === "down" && <TrendingDown className="h-3 w-3 mr-1" />}
                                {trend.direction === "stable" && <Minus className="h-3 w-3 mr-1" />}
                                {trend.value > 0 && `${trend.direction === "up" ? "+" : "-"}${Math.round(trend.value)}`}
                              </span>
                            )}
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
                        </div>
                        <Progress value={subject.average} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Grades */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Grades</CardTitle>
                <CardDescription>Latest recorded grades</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {quarterGrades.slice(0, 8).map((grade) => (
                    <div key={grade.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{grade.subject}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(grade.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <Badge 
                        variant="secondary"
                        className={
                          (grade.score / grade.max_score) * 100 >= 85 
                            ? "bg-emerald-100 text-emerald-700" 
                            : (grade.score / grade.max_score) * 100 >= 70
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                        }
                      >
                        {grade.score}/{grade.max_score}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed by Subject */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Detailed Breakdown</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(gradesBySubject).map(([subject, subjectGrades]) => (
                <Card key={subject}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{subject}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {subjectGrades.map((grade) => (
                        <div key={grade.id} className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">
                            {new Date(grade.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <span className={
                            (grade.score / grade.max_score) * 100 >= 85 
                              ? "text-emerald-600 font-medium" 
                              : (grade.score / grade.max_score) * 100 >= 70
                              ? "text-amber-600 font-medium"
                              : "text-red-600 font-medium"
                          }>
                            {grade.score}/{grade.max_score}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
