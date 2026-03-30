"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar,
  MapPin,
  Clock,
  Megaphone,
  BookOpen,
  PartyPopper,
  Dumbbell,
  Users,
  Star
} from "lucide-react"
import { getEventsFromBackend } from "@/lib/api/backend"
import type { Event } from "@/lib/types/database"

const categoryConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  announcement: { icon: <Megaphone className="h-4 w-4" />, color: "text-blue-600", bg: "bg-blue-100" },
  exam: { icon: <BookOpen className="h-4 w-4" />, color: "text-red-600", bg: "bg-red-100" },
  holiday: { icon: <PartyPopper className="h-4 w-4" />, color: "text-green-600", bg: "bg-green-100" },
  sports: { icon: <Dumbbell className="h-4 w-4" />, color: "text-orange-600", bg: "bg-orange-100" },
  cultural: { icon: <Star className="h-4 w-4" />, color: "text-purple-600", bg: "bg-purple-100" },
  meeting: { icon: <Users className="h-4 w-4" />, color: "text-slate-600", bg: "bg-slate-100" },
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<string | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await getEventsFromBackend()
        setEvents(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load events")
      } finally {
        setIsLoading(false)
      }
    }
    
    loadEvents()
  }, [])

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

  const filteredEvents = filter 
    ? events.filter(e => e.category === filter)
    : events

  const upcomingEvents = filteredEvents.filter(e => new Date(e.start_date) >= new Date())
  const pastEvents = filteredEvents.filter(e => new Date(e.start_date) < new Date())

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">School Events</h1>
        <p className="text-slate-600">Stay updated with school activities and announcements</p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter(null)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            filter === null 
              ? "bg-slate-900 text-white" 
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          All Events
        </button>
        {Object.entries(categoryConfig).map(([category, config]) => (
          <button
            key={category}
            onClick={() => setFilter(filter === category ? null : category)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === category 
                ? `${config.bg} ${config.color}` 
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {config.icon}
            <span className="capitalize">{category}</span>
          </button>
        ))}
      </div>

      {/* Upcoming Events */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Upcoming Events</h2>
        {upcomingEvents.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {upcomingEvents.map((event) => {
              const config = categoryConfig[event.category]
              return (
                <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className={`w-1.5 ${
                        event.category === "exam" ? "bg-red-500" :
                        event.category === "holiday" ? "bg-green-500" :
                        event.category === "sports" ? "bg-orange-500" :
                        event.category === "cultural" ? "bg-purple-500" :
                        event.category === "meeting" ? "bg-slate-500" :
                        "bg-blue-500"
                      }`} />
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className={`p-2 rounded-lg ${config.bg}`}>
                            <span className={config.color}>{config.icon}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {event.is_featured && (
                              <Badge className="bg-amber-100 text-amber-700">Featured</Badge>
                            )}
                            <Badge variant="secondary" className={`${config.bg} ${config.color}`}>
                              {event.category}
                            </Badge>
                          </div>
                        </div>
                        
                        <h3 className="font-semibold text-slate-900 text-lg">{event.title}</h3>
                        <p className="text-sm text-slate-600 mt-1 line-clamp-2">{event.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(event.start_date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                              {event.end_date && event.end_date !== event.start_date && (
                                ` - ${new Date(event.end_date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}`
                              )}
                            </span>
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <Calendar className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-600">No upcoming events</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Past Events</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastEvents.map((event) => {
              const config = categoryConfig[event.category]
              return (
                <Card key={event.id} className="opacity-75">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-1.5 rounded ${config.bg}`}>
                        <span className={config.color}>{config.icon}</span>
                      </div>
                      <span className="text-xs text-slate-500">
                        {new Date(event.start_date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <h3 className="font-medium text-slate-700">{event.title}</h3>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
