"use client"

import { useEffect, useState } from "react"
import { 
  GraduationCap, 
  Trophy, 
  Calendar, 
  Star,
  TrendingUp,
  Clock
} from "lucide-react"
import { getKioskPayloadFromBackend } from "@/lib/api/backend"
import type { Event, Achievement } from "@/lib/types/database"

export default function KioskPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [rankings, setRankings] = useState<{ name: string; average: number; achievementPoints: number }[]>([])
  const [recentAchievements, setRecentAchievements] = useState<(Achievement & { studentName?: string })[]>([])
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  const slides = ["rankings", "events", "achievements"] as const

  useEffect(() => {
    setIsMounted(true)
    setCurrentTime(new Date())

    async function loadData() {
      const payload = await getKioskPayloadFromBackend()
      setEvents(payload.featured_events)
      setRankings(
        payload.rankings.map(item => ({
          name: item.name,
          average: item.average,
          achievementPoints: item.achievement_points,
        }))
      )
      setRecentAchievements(
        payload.recent_achievements.map(item => ({
          ...item,
          studentName: item.student_name,
        })) as (Achievement & { studentName?: string })[]
      )
    }

    loadData()

    const dataInterval = setInterval(loadData, 5 * 60 * 1000)
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000)

    return () => {
      clearInterval(dataInterval)
      clearInterval(timeInterval)
    }
  }, [])

  // Auto-rotate slides every 8 seconds
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length)
    }, 8000)
    return () => clearInterval(slideInterval)
  }, [slides.length])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!isMounted || !currentTime) {
    return (
      <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg text-slate-300">Loading Kiosk...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col overflow-hidden">
      {/* Compact Header */}
      <header className="shrink-0 bg-primary px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight">Aqbobek Lyceum</h1>
              <p className="text-primary-foreground/70 text-xs">Unified School Portal</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-lg font-mono">
              <Clock className="h-4 w-4" />
              {formatTime(currentTime)}
            </div>
            <p className="text-primary-foreground/70 text-xs">{formatDate(currentTime)}</p>
          </div>
        </div>
      </header>

      {/* Slide Indicators */}
      <div className="shrink-0 flex justify-center gap-2 py-2 bg-slate-800/50">
        {slides.map((slide, idx) => (
          <button
            key={slide}
            onClick={() => setCurrentSlide(idx)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              currentSlide === idx 
                ? "bg-primary text-primary-foreground" 
                : "bg-slate-700 text-slate-400 hover:bg-slate-600"
            }`}
          >
            {slide === "rankings" && "Top Students"}
            {slide === "events" && "Events"}
            {slide === "achievements" && "Achievements"}
          </button>
        ))}
      </div>

      {/* Main Content - Takes remaining space */}
      <main className="flex-1 min-h-0 p-4 overflow-auto">
        {/* Rankings Slide */}
        {slides[currentSlide] === "rankings" && (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <Trophy className="h-5 w-5 text-amber-400" />
              </div>
              <h2 className="text-lg font-bold">Top Students</h2>
            </div>

            <div className="flex-1 flex flex-col gap-2 min-h-0">
              {rankings.map((student, index) => (
                <div 
                  key={student.name}
                  className={`flex items-center gap-3 p-3 rounded-xl shrink-0 ${
                    index === 0 ? "bg-gradient-to-r from-amber-500/30 to-amber-500/10" :
                    index === 1 ? "bg-gradient-to-r from-slate-400/30 to-slate-400/10" :
                    index === 2 ? "bg-gradient-to-r from-orange-500/30 to-orange-500/10" :
                    "bg-slate-700/30"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                    index === 0 ? "bg-amber-500 text-amber-900" :
                    index === 1 ? "bg-slate-400 text-slate-900" :
                    index === 2 ? "bg-orange-500 text-orange-900" :
                    "bg-slate-600 text-slate-300"
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{student.name}</p>
                    <div className="flex items-center gap-1 text-slate-400 text-xs">
                      <Star className="h-3 w-3 text-amber-400" />
                      <span>{student.achievementPoints} pts</span>
                    </div>
                  </div>
                  <div className={`text-lg font-bold shrink-0 ${
                    student.average >= 85 ? "text-emerald-400" :
                    student.average >= 70 ? "text-amber-400" :
                    "text-red-400"
                  }`}>
                    {student.average}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Events Slide */}
        {slides[currentSlide] === "events" && (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-400" />
              </div>
              <h2 className="text-lg font-bold">Upcoming Events</h2>
            </div>

            <div className="flex-1 flex flex-col gap-2 min-h-0 overflow-auto">
              {events.map((event) => (
                <div 
                  key={event.id}
                  className={`p-3 rounded-xl shrink-0 ${
                    event.category === "exam" ? "bg-red-500/20 border-l-4 border-red-500" :
                    event.category === "holiday" ? "bg-green-500/20 border-l-4 border-green-500" :
                    event.category === "sports" ? "bg-orange-500/20 border-l-4 border-orange-500" :
                    event.category === "cultural" ? "bg-purple-500/20 border-l-4 border-purple-500" :
                    "bg-blue-500/20 border-l-4 border-blue-500"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-sm line-clamp-1">{event.title}</h3>
                    {event.is_featured && (
                      <span className="px-2 py-0.5 bg-amber-500 text-amber-900 rounded-full text-xs font-bold shrink-0">
                        FEATURED
                      </span>
                    )}
                  </div>
                  <p className="text-slate-300 text-xs mb-2 line-clamp-2">{event.description}</p>
                  <div className="flex items-center gap-3 text-slate-400 text-xs">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(event.start_date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    {event.location && (
                      <span className="truncate">{event.location}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements Slide */}
        {slides[currentSlide] === "achievements" && (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
              </div>
              <h2 className="text-lg font-bold">Recent Achievements</h2>
            </div>

            <div className="flex-1 flex flex-col gap-2 min-h-0 overflow-auto">
              {recentAchievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className="p-3 bg-gradient-to-r from-emerald-500/20 to-emerald-500/5 rounded-xl border-l-4 border-emerald-500 shrink-0"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-emerald-500/30 rounded-lg shrink-0">
                      <Trophy className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm truncate">{achievement.title}</h3>
                      <p className="text-emerald-300 text-xs">{achievement.studentName}</p>
                      <p className="text-slate-400 text-xs mt-1 line-clamp-1">{achievement.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-lg font-bold text-amber-400">+{achievement.points}</span>
                      <p className="text-slate-400 text-xs">pts</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="shrink-0 mt-3 p-3 bg-primary/20 rounded-xl">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">{rankings.length}</p>
                  <p className="text-slate-400 text-xs">Top Students</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{events.length}</p>
                  <p className="text-slate-400 text-xs">Upcoming Events</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Compact Footer Ticker */}
      <footer className="shrink-0 bg-primary py-2 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          <span className="text-sm mx-4">Welcome to Aqbobek Lyceum - Excellence in Education</span>
          <span className="text-sm mx-4">|</span>
          <span className="text-sm mx-4">Congratulations to all our top-performing students!</span>
          <span className="text-sm mx-4">|</span>
          <span className="text-sm mx-4">Visit the school portal for more information</span>
        </div>
      </footer>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  )
}
