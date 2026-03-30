"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/context/auth-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Trophy, 
  Star,
  GraduationCap,
  Dumbbell,
  Palette,
  Users,
  Heart,
  Award
} from "lucide-react"
import { getAchievementsForStudentFromBackend } from "@/lib/api/backend"
import type { Achievement } from "@/lib/types/database"

const categoryIcons: Record<string, React.ReactNode> = {
  academic: <GraduationCap className="h-5 w-5" />,
  sports: <Dumbbell className="h-5 w-5" />,
  arts: <Palette className="h-5 w-5" />,
  leadership: <Users className="h-5 w-5" />,
  community: <Heart className="h-5 w-5" />,
  other: <Award className="h-5 w-5" />,
}

const categoryColors: Record<string, string> = {
  academic: "bg-blue-100 text-blue-600",
  sports: "bg-green-100 text-green-600",
  arts: "bg-purple-100 text-purple-600",
  leadership: "bg-amber-100 text-amber-600",
  community: "bg-pink-100 text-pink-600",
  other: "bg-slate-100 text-slate-600",
}

export default function AchievementsPage() {
  const { user } = useAuth()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadAchievements() {
      if (!user) return

      try {
        const studentId = user.role === "parent"
          ? user.linked_student_ids?.[0]
          : user.id

        if (!studentId) {
          throw new Error("No student is linked to this account.")
        }

        const data = await getAchievementsForStudentFromBackend(studentId)
        setAchievements(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load achievements")
      } finally {
        setIsLoading(false)
      }
    }
    
    loadAchievements()
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

  const totalPoints = achievements.reduce((sum, a) => sum + a.points, 0)
  
  // Group achievements by category
  const byCategory = achievements.reduce((acc, a) => {
    if (!acc[a.category]) acc[a.category] = []
    acc[a.category].push(a)
    return acc
  }, {} as Record<string, Achievement[]>)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Achievements</h1>
        <p className="text-slate-600">Your accomplishments and awards</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100">Total Points</p>
                <p className="text-4xl font-bold mt-1">{totalPoints}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-lg">
                <Star className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500">Total Awards</p>
                <p className="text-4xl font-bold text-slate-900 mt-1">{achievements.length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Trophy className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500">Categories</p>
                <p className="text-4xl font-bold text-slate-900 mt-1">{Object.keys(byCategory).length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(byCategory).map(([category, items]) => (
          <Badge 
            key={category} 
            variant="secondary" 
            className={`${categoryColors[category]} text-sm py-1 px-3`}
          >
            {categoryIcons[category]}
            <span className="ml-1 capitalize">{category}</span>
            <span className="ml-1 opacity-70">({items.length})</span>
          </Badge>
        ))}
      </div>

      {/* Achievements List */}
      {achievements.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <Card key={achievement.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex">
                  <div className={`w-2 ${
                    achievement.category === "academic" ? "bg-blue-500" :
                    achievement.category === "sports" ? "bg-green-500" :
                    achievement.category === "arts" ? "bg-purple-500" :
                    achievement.category === "leadership" ? "bg-amber-500" :
                    achievement.category === "community" ? "bg-pink-500" :
                    "bg-slate-500"
                  }`} />
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${categoryColors[achievement.category]}`}>
                          {categoryIcons[achievement.category]}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{achievement.title}</h3>
                          <p className="text-sm text-slate-600 mt-1">{achievement.description}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                            <span>
                              {new Date(achievement.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                            {achievement.awarded_by && (
                              <>
                                <span>|</span>
                                <span>By: {achievement.awarded_by}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-amber-100 text-amber-700 shrink-0">
                        +{achievement.points} pts
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="p-4 bg-slate-100 rounded-full w-fit mx-auto mb-4">
              <Trophy className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No achievements yet</h3>
            <p className="text-slate-600 mt-1">
              Keep working hard and your accomplishments will be displayed here!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
