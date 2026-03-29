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
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Calendar, PlusCircle, Megaphone } from "lucide-react"
import { getEvents, addEvent } from "@/lib/services/data-service"
import type { Event as EventType } from "@/lib/types/database"

const categories: EventType["category"][] = [
  "announcement",
  "exam",
  "holiday",
  "sports",
  "cultural",
  "meeting",
]

const categoryLabels: Record<EventType["category"], string> = {
  announcement: "Announcement",
  exam: "Exam",
  holiday: "Holiday",
  sports: "Sports Event",
  cultural: "Cultural Event",
  meeting: "Meeting",
}

export default function ManageEventsPage() {
  const { user } = useAuth()
  const [events, setEvents] = useState<EventType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showForm, setShowForm] = useState(false)
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "" as EventType["category"] | "",
    start_date: "",
    end_date: "",
    location: "",
    is_featured: false,
  })

  useEffect(() => {
    async function loadEvents() {
      const data = await getEvents()
      setEvents(data)
      setIsLoading(false)
    }
    loadEvents()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !formData.category) return
    
    setIsSubmitting(true)

    const event = await addEvent({
      title: formData.title,
      description: formData.description,
      category: formData.category as EventType["category"],
      start_date: formData.start_date,
      end_date: formData.end_date || undefined,
      location: formData.location || undefined,
      is_featured: formData.is_featured,
      created_by: user.id,
    })

    if (event) {
      setEvents(prev => [event, ...prev])
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        setShowForm(false)
        setFormData({
          title: "",
          description: "",
          category: "",
          start_date: "",
          end_date: "",
          location: "",
          is_featured: false,
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Events</h1>
          <p className="text-slate-600">Create and manage school events and announcements</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <PlusCircle className="h-4 w-4" />
          {showForm ? "Cancel" : "New Event"}
        </Button>
      </div>

      {/* Create Event Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-blue-600" />
              Create New Event
            </CardTitle>
            <CardDescription>
              Fill in the details to create a new event or announcement
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="py-8 text-center">
                <div className="p-4 bg-emerald-100 rounded-full w-fit mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Event Created!</h3>
                <p className="text-slate-600 mt-1">The event has been published successfully.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Event Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Spring Concert"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as EventType["category"] }))}
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
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the event..."
                    rows={3}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="end_date">End Date (optional)</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location (optional)</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g., Main Hall"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Switch
                      id="featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                    />
                    <Label htmlFor="featured">Featured Event (shown prominently on kiosk)</Label>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={isSubmitting || !formData.title || !formData.category || !formData.start_date}
                >
                  {isSubmitting ? "Creating..." : "Create Event"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      )}

      {/* Events List */}
      <Card>
        <CardHeader>
          <CardTitle>All Events</CardTitle>
          <CardDescription>Manage existing events and announcements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.map((event) => (
              <div 
                key={event.id}
                className="flex items-start justify-between p-4 bg-slate-50 rounded-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{event.title}</h3>
                      {event.is_featured && (
                        <Badge className="bg-amber-100 text-amber-700">Featured</Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mt-1 line-clamp-1">{event.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
                      <span>
                        {new Date(event.start_date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <Badge variant="secondary">{event.category}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
