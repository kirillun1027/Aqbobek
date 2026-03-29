"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/context/auth-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, Trophy } from "lucide-react"
import { getStudents, addAchievement } from "@/lib/services/data-service"
import type { User, Achievement } from "@/lib/types/database"

const categories: Achievement["category"][] = [
  "academic",
  "sports",
  "arts",
  "leadership",
  "community",
  "other",
]

const categoryLabels: Record<Achievement["category"], string> = {
  academic: "Academic",
  sports: "Sports",
  arts: "Arts & Culture",
  leadership: "Leadership",
  community: "Community Service",
  other: "Other",
}

export default function RecordAchievementPage() {
  const { user } = useAuth()
  const [students, setStudents] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    student_id: "",
    title: "",
    description: "",
    category: "" as Achievement["category"] | "",
    points: "50",
  })

  useEffect(() => {
    async function loadStudents() {
      const data = await getStudents()
      setStudents(data)
      setIsLoading(false)
    }
    loadStudents()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !formData.category) return
    
    setIsSubmitting(true)

    const achievement = await addAchievement({
      student_id: formData.student_id,
      title: formData.title,
      description: formData.description,
      category: formData.category as Achievement["category"],
      points: parseInt(formData.points),
      date: new Date().toISOString().split("T")[0],
      awarded_by: user.full_name,
    })

    if (achievement) {
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        setFormData({
          student_id: "",
          title: "",
          description: "",
          category: "",
          points: "50",
        })
      }, 2000)
    }

    setIsSubmitting(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Record Achievement</h1>
        <p className="text-slate-600">Award an achievement to a student</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-600" />
            New Achievement
          </CardTitle>
          <CardDescription>
            Fill in the details to award an achievement
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="py-8 text-center">
              <div className="p-4 bg-amber-100 rounded-full w-fit mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Achievement Awarded!</h3>
              <p className="text-slate-600 mt-1">The achievement has been recorded successfully.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="student">Student</Label>
                  <Select
                    value={formData.student_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, student_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map(student => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.full_name} ({student.class_name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as Achievement["category"] }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {categoryLabels[category]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Achievement Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Mathematics Olympiad - 1st Place"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the achievement..."
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="points">Points</Label>
                <Input
                  id="points"
                  type="number"
                  min="1"
                  max="500"
                  value={formData.points}
                  onChange={(e) => setFormData(prev => ({ ...prev, points: e.target.value }))}
                  required
                />
                <p className="text-xs text-slate-500">
                  Suggested: 25 (minor), 50 (standard), 100 (major), 200+ (exceptional)
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                disabled={isSubmitting || !formData.student_id || !formData.category || !formData.title}
              >
                {isSubmitting ? "Recording..." : "Award Achievement"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
