"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  AlertTriangle,
  TrendingDown,
  BookOpen,
  User
} from "lucide-react"
import { getStudents, getAllGrades, identifyAtRiskStudents } from "@/lib/services/data-service"
import type { User as UserType, Grade } from "@/lib/types/database"

interface AtRiskStudent {
  student: UserType
  average: number
  concernSubjects: string[]
}

export default function AtRiskPage() {
  const [atRiskStudents, setAtRiskStudents] = useState<AtRiskStudent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const [students, grades] = await Promise.all([
        getStudents(),
        getAllGrades(3),
      ])

      const atRisk = identifyAtRiskStudents(students, grades, 75)
      setAtRiskStudents(atRisk)
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">At-Risk Students</h1>
        <p className="text-slate-600">Students who may need additional support</p>
      </div>

      {/* Warning Banner */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-900">
                {atRiskStudents.length} student{atRiskStudents.length !== 1 ? "s" : ""} identified as at-risk
              </h3>
              <p className="text-sm text-amber-700 mt-1">
                These students have an average below 75% or are struggling in specific subjects.
                Consider reaching out for additional support.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      {atRiskStudents.length > 0 ? (
        <div className="space-y-4">
          {atRiskStudents.map(({ student, average, concernSubjects }) => (
            <Card key={student.id} className="border-l-4 border-l-red-500">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xl font-medium">
                      {student.full_name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-lg">{student.full_name}</h3>
                      <p className="text-sm text-slate-500">
                        Grade {student.grade} - Class {student.class_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="text-center">
                      <p className="text-sm text-slate-500 mb-1">Overall Average</p>
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-red-500" />
                        <span className="text-2xl font-bold text-red-600">{average}%</span>
                      </div>
                    </div>

                    <div className="w-32">
                      <Progress value={average} className="h-2" />
                    </div>
                  </div>
                </div>

                {concernSubjects.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-slate-600 mb-2 flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Subjects of concern:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {concernSubjects.map(subject => (
                        <Badge key={subject} variant="secondary" className="bg-red-100 text-red-700">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-slate-500">
                    Recommended actions: Schedule a one-on-one meeting, assign peer tutoring, 
                    or notify parents about additional support options.
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="p-4 bg-emerald-100 rounded-full w-fit mx-auto mb-4">
              <User className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">All students are performing well!</h3>
            <p className="text-slate-600 mt-1">
              No students are currently identified as at-risk based on the 75% threshold.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
