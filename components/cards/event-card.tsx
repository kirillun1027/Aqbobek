import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, MapPin, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface EventCardProps {
  title: string
  description?: string
  date: Date
  location?: string
  attendees?: number
  category?: string
  status?: 'upcoming' | 'ongoing' | 'completed'
}

export function EventCard({
  title,
  description,
  date,
  location,
  attendees,
  category,
  status = 'upcoming',
}: EventCardProps) {
  const getStatusColor = (s: string) => {
    switch (s) {
      case 'ongoing':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-green-100 text-green-800'
    }
  }

  const isUpcoming = new Date(date) > new Date()

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && (
              <CardDescription className="mt-1 line-clamp-2">
                {description}
              </CardDescription>
            )}
          </div>
          <Badge className={getStatusColor(status)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{new Date(date).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}</span>
          </div>
          {location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
          )}
          {attendees !== undefined && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{attendees} attendees</span>
            </div>
          )}
          {category && (
            <div className="pt-2">
              <Badge variant="secondary" className="text-xs">
                {category}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
