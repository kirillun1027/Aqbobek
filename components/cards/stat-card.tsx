import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowUp, ArrowDown } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  change?: number
  changeLabel?: string
  trend?: 'up' | 'down'
}

export function StatCard({
  label,
  value,
  icon,
  change,
  changeLabel,
  trend,
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            {icon && <div className="text-primary">{icon}</div>}
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold">{value}</p>
            {change !== undefined && (
              <div
                className={`flex items-center gap-1 text-xs font-medium ${
                  trend === 'up'
                    ? 'text-green-600'
                    : trend === 'down'
                      ? 'text-red-600'
                      : 'text-gray-600'
                }`}
              >
                {trend === 'up' && <ArrowUp className="w-3 h-3" />}
                {trend === 'down' && <ArrowDown className="w-3 h-3" />}
                {Math.abs(change)}%
              </div>
            )}
          </div>
          {changeLabel && (
            <p className="text-xs text-muted-foreground">{changeLabel}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
