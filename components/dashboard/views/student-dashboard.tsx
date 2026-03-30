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
  MessageSquare, 
  ArrowRight,
  Star,
  Target
} from "lucide-react"
import type { User, Grade, Achievement, Event } from "@/lib/types/database"
import { calculateSubjectAverage } from "@/lib/utils/analytics"
import {
  getAchievementsForStudentFromBackend,
  getEventsFromBackend,
  getGradesForStudentFromBackend,
  getRankingsFromBackend,
} from "@/lib/api/backend"

interface StudentDashboardProps {
  user: User
}

export function StudentDashboard({ user }: StudentDashboardProps) {
  const [grades, setGrades] = useState<Grade[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [ranking, setRanking] = useState<{ rank: number; total: number } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const [gradesData, achievementsData, eventsData, rankingsData] = await Promise.all([
        getGradesForStudentFromBackend(user.id, 3),
        getAchievementsForStudentFromBackend(user.id),
        getEventsFromBackend(true),
        getRankingsFromBackend(),
      ])

      setGrades(gradesData)
      setAchievements(achievementsData)
      setEvents(eventsData.slice(0, 3))
      
      const myRank = rankingsData.findIndex(r => r.student_id === user.id) + 1
      setRanking({ rank: myRank || rankingsData.length, total: rankingsData.length })
      
      setIsLoading(false)
    }

    loadData()
  }, [user.id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const subjectAverages = calculateSubjectAverage(grades)
  const overallAverage = subjectAverages.length > 0
    ? Math.round(subjectAverages.reduce((sum, s) => sum + s.average, 0) / subjectAverages.length)
    : 0

  const totalPoints = achievements.reduce((sum, a) => sum + a.points, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome, {user.full_name.split(" ")[0]}!</h1>
        <p className="text-slate-600">Here&apos;s your academic overview for this quarter</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <p className="text-emerald-100 text-sm">Average</p>
                <p className="text-2xl font-bold">{overallAverage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <p className="text-amber-100 text-sm">Points</p>
                <p className="text-2xl font-bold">{totalPoints}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Star className="h-5 w-5" />
              </div>
              <div>
                <p className="text-blue-100 text-sm">Rank</p>
                <p className="text-2xl font-bold">#{ranking?.rank || "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <p className="text-purple-100 text-sm">Subjects</p>
                <p className="text-2xl font-bold">{subjectAverages.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Subject Performance */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">Subject Performance</CardTitle>
              <CardDescription>Your grades across all subjects</CardDescription>
            </div>
            <Link href="/dashboard/grades">
              <Button variant="ghost" size="sm" className="gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subjectAverages.slice(0, 5).map((subject) => (
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
                  <Progress 
                    value={subject.average} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Mentor Card */}
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <MessageSquare className="h-5 w-5 text-emerald-400" />
              </div>
              <CardTitle className="text-lg text-white">AI Mentor</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 text-sm mb-4">
              Get personalized advice on improving your grades, career guidance, and study tips from your AI mentor.
            </p>
            <Link href="/dashboard/ai-mentor">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                Start Conversation
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Achievements */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">Recent Achievements</CardTitle>
              <CardDescription>Your accomplishments this year</CardDescription>
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
                {achievements.slice(0, 3).map((achievement) => (
                  <div key={achievement.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Trophy className="h-4 w-4 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 text-sm">{achievement.title}</p>
                      <p className="text-xs text-slate-500 truncate">{achievement.description}</p>
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      +{achievement.points}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm text-center py-4">No achievements yet</p>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">Upcoming Events</CardTitle>
              <CardDescription>What&apos;s happening at school</CardDescription>
            </div>
            <Link href="/dashboard/events">
              <Button variant="ghost" size="sm" className="gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {events.length > 0 ? (
              <div className="space-y-3">
                {events.map((event) => (
                  <div key={event.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 text-sm">{event.title}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(event.start_date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                        {event.end_date && ` - ${new Date(event.end_date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}`}
                      </p>
                    </div>
                    <Badge 
                      variant="secondary"
                      className={
                        event.category === "exam" ? "bg-red-100 text-red-700" :
                        event.category === "holiday" ? "bg-green-100 text-green-700" :
                        event.category === "sports" ? "bg-blue-100 text-blue-700" :
                        "bg-slate-100 text-slate-700"
                      }
                    >
                      {event.category}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm text-center py-4">No upcoming events</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
