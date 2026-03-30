"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  BookOpen, 
  Trophy, 
  TrendingUp,
  Calendar, 
  ArrowRight,
  User,
  Star
} from "lucide-react"
import type { User as UserType, Grade, Achievement, Event } from "@/lib/types/database"
import { calculateSubjectAverage } from "@/lib/utils/analytics"
import {
  getAchievementsForStudentFromBackend,
  getEventsFromBackend,
  getGradesForStudentFromBackend,
  getRankingsFromBackend,
  getStudentByIdFromBackend,
} from "@/lib/api/backend"

interface ParentDashboardProps {
  user: UserType
}

export function ParentDashboard({ user }: ParentDashboardProps) {
  const [child, setChild] = useState<UserType | null>(null)
  const [grades, setGrades] = useState<Grade[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [ranking, setRanking] = useState<{ rank: number; total: number } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const childId = user.linked_student_ids?.[0]
      if (!childId) {
        setIsLoading(false)
        return
      }

      const childData = await getStudentByIdFromBackend(childId)
      
      if (childData) {
        setChild(childData)
        
        const [gradesData, achievementsData, eventsData, rankingsData] = await Promise.all([
          getGradesForStudentFromBackend(childData.id, 3),
          getAchievementsForStudentFromBackend(childData.id),
          getEventsFromBackend(true),
          getRankingsFromBackend(),
        ])

        setGrades(gradesData)
        setAchievements(achievementsData)
        setEvents(eventsData.slice(0, 3))
        
        const childRank = rankingsData.findIndex(r => r.student_id === childData.id) + 1
        setRanking({ rank: childRank || rankingsData.length, total: rankingsData.length })
      }
      
      setIsLoading(false)
    }

    loadData()
  }, [user])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!child) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">No linked student found.</p>
      </div>
    )
  }

  const subjectAverages = calculateSubjectAverage(grades)
  const overallAverage = subjectAverages.length > 0
    ? Math.round(subjectAverages.reduce((sum, s) => sum + s.average, 0) / subjectAverages.length)
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Parent Dashboard</h1>
        <p className="text-slate-600">Monitoring {child.full_name}&apos;s progress</p>
      </div>

      {/* Child Info Card */}
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl font-bold">
              {child.full_name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{child.full_name}</h2>
              <p className="text-slate-300">
                Grade {child.grade} - Class {child.class_name}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-slate-500 text-sm">Average</p>
                <p className="text-2xl font-bold text-slate-900">{overallAverage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Star className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-slate-500 text-sm">Class Rank</p>
                <p className="text-2xl font-bold text-slate-900">#{ranking?.rank || "-"}</p>
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
                <p className="text-2xl font-bold text-slate-900">{achievements.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-slate-500 text-sm">Total Points</p>
                <p className="text-2xl font-bold text-slate-900">
                  {achievements.reduce((sum, a) => sum + a.points, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Subject Performance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">Subject Performance</CardTitle>
              <CardDescription>Current quarter grades</CardDescription>
            </div>
            <Link href="/dashboard/grades">
              <Button variant="ghost" size="sm" className="gap-1">
                Details <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subjectAverages.map((subject) => (
                <div key={subject.subject} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{subject.subject}</span>
                    <span className={
                      subject.average >= 85 ? "text-emerald-600" :
                      subject.average >= 70 ? "text-amber-600" :
                      "text-red-600"
                    }>
                      {subject.average}%
                    </span>
                  </div>
                  <Progress value={subject.average} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">Recent Achievements</CardTitle>
              <CardDescription>Your child&apos;s accomplishments</CardDescription>
            </div>
            <Link href="/dashboard/achievements">
              <Button variant="ghost" size="sm" className="gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {achievements.length > 0 ? (
              <div className="space-y-3">
                {achievements.slice(0, 4).map((achievement) => (
                  <div key={achievement.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Trophy className="h-4 w-4 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 text-sm">{achievement.title}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(achievement.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <Badge variant="secondary">+{achievement.points}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm text-center py-4">No achievements yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-lg">Upcoming Events</CardTitle>
            <CardDescription>Important dates to remember</CardDescription>
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
                <Badge 
                  variant="secondary" 
                  className={
                    event.category === "exam" ? "bg-red-100 text-red-700 mt-2" :
                    event.category === "meeting" ? "bg-blue-100 text-blue-700 mt-2" :
                    "bg-slate-100 text-slate-700 mt-2"
                  }
                >
                  {event.category}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
