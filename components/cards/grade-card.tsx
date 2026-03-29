import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface GradeCardProps {
  subject: string
  grade: number
  maxGrade?: number
  trend?: 'up' | 'down' | 'stable'
  description?: string
}

export function GradeCard({ subject, grade, maxGrade = 100, trend, description }: GradeCardProps) {
  const percentage = (grade / maxGrade) * 100
  const getGradeColor = (pct: number) => {
    if (pct >= 80) return 'bg-green-500'
    if (pct >= 60) return 'bg-blue-500'
    if (pct >= 40) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{subject}</CardTitle>
          {trend && (
            <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
              {trend === 'up' && <TrendingUp className="w-4 h-4" />}
              {trend === 'down' && <TrendingDown className="w-4 h-4" />}
            </div>
          )}
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{grade}</span>
            <span className="text-sm text-muted-foreground">/ {maxGrade}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-full rounded-full ${getGradeColor(percentage)} transition-all`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}% of max</p>
        </div>
      </CardContent>
    </Card>
  )
}
