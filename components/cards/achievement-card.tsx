import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Award, Star } from 'lucide-react'

interface AchievementCardProps {
  title: string
  description?: string
  category?: string
  date?: Date
  icon?: React.ReactNode
  level?: 'gold' | 'silver' | 'bronze'
}

export function AchievementCard({
  title,
  description,
  category,
  date,
  icon,
  level,
}: AchievementCardProps) {
  const getLevelColor = (lvl?: string) => {
    switch (lvl) {
      case 'gold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'silver':
        return 'bg-gray-100 text-gray-800 border-gray-300'
      case 'bronze':
        return 'bg-orange-100 text-orange-800 border-orange-300'
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300'
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            {icon && <div className="mt-1">{icon}</div>}
            <div className="flex-1">
              <CardTitle className="text-base">{title}</CardTitle>
              {description && (
                <CardDescription className="mt-1">{description}</CardDescription>
              )}
            </div>
          </div>
          {level && (
            <Badge className={getLevelColor(level)} variant="outline">
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </Badge>
          )}
        </div>
      </CardHeader>
      {(category || date) && (
        <CardContent className="pt-0">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {category && <span>{category}</span>}
            {date && <span>{new Date(date).toLocaleDateString()}</span>}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
