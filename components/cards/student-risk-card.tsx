import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, TrendingDown } from 'lucide-react'

interface StudentRiskProps {
  name: string
  studentId: string
  riskLevel: 'critical' | 'high' | 'medium'
  averageGrade: number
  missingAssignments: number
  absences: number
  lastActive?: Date
}

export function StudentRiskCard({
  name,
  studentId,
  riskLevel,
  averageGrade,
  missingAssignments,
  absences,
  lastActive,
}: StudentRiskProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300'
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    }
  }

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'critical':
        return 'text-red-600'
      case 'high':
        return 'text-orange-600'
      default:
        return 'text-yellow-600'
    }
  }

  return (
    <Card className="border-l-4 border-l-red-500">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{name}</CardTitle>
            <CardDescription>{studentId}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className={`w-5 h-5 ${getRiskIcon(riskLevel)}`} />
            <Badge className={getRiskColor(riskLevel)} variant="outline">
              {riskLevel.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Avg Grade</p>
            <p className="text-lg font-semibold">{averageGrade.toFixed(1)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Missing</p>
            <p className="text-lg font-semibold text-orange-600">{missingAssignments}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Absences</p>
            <p className="text-lg font-semibold text-red-600">{absences}</p>
          </div>
        </div>
        {lastActive && (
          <p className="text-xs text-muted-foreground mt-4">
            Last active: {new Date(lastActive).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
