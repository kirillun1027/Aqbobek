"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Users,
  Search,
  TrendingUp,
  TrendingDown,
  Trophy
} from "lucide-react"
import { getStudents, getAllGrades, getAllAchievements, calculateSubjectAverage } from "@/lib/services/data-service"
import type { User, Grade, Achievement } from "@/lib/types/database"

interface StudentWithStats extends User {
  average: number
  achievementCount: number
  achievementPoints: number
}

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentWithStats[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const [studentsData, gradesData, achievementsData] = await Promise.all([
        getStudents(),
        getAllGrades(3),
        getAllAchievements(),
      ])

      const studentsWithStats: StudentWithStats[] = studentsData.map(student => {
        const studentGrades = gradesData.filter(g => g.student_id === student.id)
        const subjectAvgs = calculateSubjectAverage(studentGrades)
        const average = subjectAvgs.length > 0
          ? Math.round(subjectAvgs.reduce((sum, s) => sum + s.average, 0) / subjectAvgs.length)
          : 0

        const studentAchievements = achievementsData.filter(a => a.student_id === student.id)
        
        return {
          ...student,
          average,
          achievementCount: studentAchievements.length,
          achievementPoints: studentAchievements.reduce((sum, a) => sum + a.points, 0),
        }
      })

      setStudents(studentsWithStats.sort((a, b) => b.average - a.average))
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

  const filteredStudents = students.filter(s =>
    s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.class_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Students</h1>
        <p className="text-slate-600">View and manage student information</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
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
                <p className="text-slate-500 text-sm">Average Score</p>
                <p className="text-2xl font-bold text-slate-900">
                  {Math.round(students.reduce((sum, s) => sum + s.average, 0) / students.length)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Trophy className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-slate-500 text-sm">Total Achievements</p>
                <p className="text-2xl font-bold text-slate-900">
                  {students.reduce((sum, s) => sum + s.achievementCount, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search students by name or class..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
          <CardDescription>Ranked by academic performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredStudents.map((student, index) => (
              <div 
                key={student.id} 
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? "bg-amber-100 text-amber-700" :
                    index === 1 ? "bg-slate-200 text-slate-700" :
                    index === 2 ? "bg-orange-100 text-orange-700" :
                    "bg-slate-100 text-slate-600"
                  }`}>
                    {index + 1}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg font-medium">
                    {student.full_name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{student.full_name}</p>
                    <p className="text-sm text-slate-500">
                      Grade {student.grade} - Class {student.class_name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4 text-amber-500" />
                      <span className="text-sm text-slate-600">{student.achievementPoints} pts</span>
                    </div>
                  </div>
                  <Badge 
                    variant="secondary"
                    className={`min-w-[60px] justify-center ${
                      student.average >= 85 ? "bg-emerald-100 text-emerald-700" :
                      student.average >= 70 ? "bg-amber-100 text-amber-700" :
                      "bg-red-100 text-red-700"
                    }`}
                  >
                    {student.average}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
