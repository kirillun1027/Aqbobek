"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3,
  Users,
  TrendingUp,
  Trophy,
  BookOpen,
  Target
} from "lucide-react"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from "recharts"
import { getStudents, getAllGrades, getAllAchievements, calculateSubjectAverage } from "@/lib/services/data-service"
import { mockUsers } from "@/lib/mock/data"

const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"]

export default function AnalyticsPage() {
  const [subjectData, setSubjectData] = useState<{ subject: string; average: number }[]>([])
  const [achievementData, setAchievementData] = useState<{ name: string; value: number }[]>([])
  const [gradeDistribution, setGradeDistribution] = useState<{ range: string; count: number }[]>([])
  const [quarterTrends, setQuarterTrends] = useState<{ quarter: string; average: number }[]>([])
  const [stats, setStats] = useState({ students: 0, teachers: 0, avgScore: 0, achievements: 0 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const [students, grades, achievements] = await Promise.all([
        getStudents(),
        getAllGrades(),
        getAllAchievements(),
      ])

      // Subject averages
      const q3Grades = grades.filter(g => g.quarter === 3)
      setSubjectData(calculateSubjectAverage(q3Grades))

      // Achievement categories
      const achievementsByCategory: Record<string, number> = {}
      achievements.forEach(a => {
        achievementsByCategory[a.category] = (achievementsByCategory[a.category] || 0) + 1
      })
      setAchievementData(
        Object.entries(achievementsByCategory).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value,
        }))
      )

      // Grade distribution
      const distribution = { "90-100": 0, "80-89": 0, "70-79": 0, "60-69": 0, "Below 60": 0 }
      q3Grades.forEach(g => {
        const pct = (g.score / g.max_score) * 100
        if (pct >= 90) distribution["90-100"]++
        else if (pct >= 80) distribution["80-89"]++
        else if (pct >= 70) distribution["70-79"]++
        else if (pct >= 60) distribution["60-69"]++
        else distribution["Below 60"]++
      })
      setGradeDistribution(
        Object.entries(distribution).map(([range, count]) => ({ range, count }))
      )

      // Quarter trends
      const quarterAvgs: { quarter: string; average: number }[] = []
      for (let q = 1; q <= 4; q++) {
        const qGrades = grades.filter(g => g.quarter === q)
        if (qGrades.length > 0) {
          const avg = qGrades.reduce((sum, g) => sum + (g.score / g.max_score) * 100, 0) / qGrades.length
          quarterAvgs.push({ quarter: `Q${q}`, average: Math.round(avg) })
        }
      }
      setQuarterTrends(quarterAvgs)

      // Stats
      const teachers = mockUsers.filter(u => u.role === "teacher")
      const avgScore = q3Grades.length > 0
        ? Math.round(q3Grades.reduce((sum, g) => sum + (g.score / g.max_score) * 100, 0) / q3Grades.length)
        : 0

      setStats({
        students: students.length,
        teachers: teachers.length,
        avgScore,
        achievements: achievements.length,
      })

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
        <h1 className="text-2xl font-bold text-slate-900">School Analytics</h1>
        <p className="text-slate-600">Comprehensive overview of school performance</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-slate-500 text-sm">Students</p>
                <p className="text-2xl font-bold text-slate-900">{stats.students}</p>
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
                <p className="text-slate-500 text-sm">Teachers</p>
                <p className="text-2xl font-bold text-slate-900">{stats.teachers}</p>
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
                <p className="text-slate-500 text-sm">Avg Score</p>
                <p className="text-2xl font-bold text-slate-900">{stats.avgScore}%</p>
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
                <p className="text-slate-500 text-sm">Achievements</p>
                <p className="text-2xl font-bold text-slate-900">{stats.achievements}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Subject Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Subject Performance</CardTitle>
            <CardDescription>Average scores by subject (Q3)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectData} layout="vertical" margin={{ left: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis type="category" dataKey="subject" tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar 
                    dataKey="average" 
                    fill="#10B981" 
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Grade Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
            <CardDescription>Distribution of grades across all subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Achievement Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Achievement Categories</CardTitle>
            <CardDescription>Distribution of achievements by type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={achievementData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {achievementData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quarter Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
            <CardDescription>Average scores across quarters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={quarterTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quarter" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="average" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: "#10B981", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
