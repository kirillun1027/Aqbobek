"use client"

import { useEffect } from "react"
import { useAuth } from "@/lib/context/auth-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  GraduationCap, 
  BarChart3, 
  Trophy, 
  Calendar, 
  MessageSquare, 
  Users,
  ArrowRight,
  Monitor
} from "lucide-react"

export default function HomePage() {
  const { user, isLoading, isMounted } = useAuth()

  // Redirect logged-in users to dashboard using window.location (more reliable than router.push during init)
  useEffect(() => {
    if (isMounted && !isLoading && user) {
      window.location.href = "/dashboard"
    }
  }, [user, isLoading, isMounted])

  // Show loading during SSR and initial client mount
  if (!isMounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="font-bold text-xl text-slate-900">Aqbobek Lyceum</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/kiosk" target="_blank">
                <Button variant="outline" size="sm" className="gap-2">
                  <Monitor className="h-4 w-4" />
                  Kiosk
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 text-balance">
            Unified School Portal for
            <span className="text-emerald-600"> Aqbobek Lyceum</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto text-pretty">
            One platform for grades, achievements, events, and personalized AI mentoring.
            Connect students, teachers, parents, and administrators.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 w-full sm:w-auto">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/kiosk" target="_blank">
              <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                <Monitor className="h-4 w-4" /> View Kiosk Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Everything You Need in One Place
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BarChart3 className="h-6 w-6" />}
              title="Grade Tracking"
              description="Real-time access to grades with BilimClass integration. Track performance across subjects and quarters."
              color="blue"
            />
            <FeatureCard
              icon={<Trophy className="h-6 w-6" />}
              title="Achievements"
              description="Record and celebrate student accomplishments in academics, sports, arts, and more."
              color="amber"
            />
            <FeatureCard
              icon={<MessageSquare className="h-6 w-6" />}
              title="AI Mentor"
              description="Personalized advice powered by AI. Get study tips, career guidance, and improvement strategies."
              color="emerald"
            />
            <FeatureCard
              icon={<Calendar className="h-6 w-6" />}
              title="School Events"
              description="Stay updated with exams, holidays, sports events, and cultural activities."
              color="purple"
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Role-Based Access"
              description="Tailored dashboards for students, teachers, parents, and administrators."
              color="rose"
            />
            <FeatureCard
              icon={<Monitor className="h-6 w-6" />}
              title="Kiosk Mode"
              description="Interactive hallway display showing top students, events, and achievements."
              color="slate"
            />
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Designed for Everyone
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <RoleCard
              title="Students"
              description="View grades, track progress, earn achievements, and get AI-powered study advice."
            />
            <RoleCard
              title="Teachers"
              description="Monitor class performance, identify at-risk students, and record grades and achievements."
            />
            <RoleCard
              title="Parents"
              description="Stay informed about your child&apos;s academic progress and upcoming school events."
            />
            <RoleCard
              title="Administrators"
              description="Publish announcements, analyze school-wide performance, and manage the kiosk display."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-emerald-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-emerald-100 text-lg mb-8">
            Sign in to access the portal or view the kiosk demo.
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-slate-100 gap-2">
              Sign In Now <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-slate-900 text-slate-400">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <GraduationCap className="h-4 w-4" />
            </div>
            <span className="font-semibold text-white">Aqbobek Lyceum</span>
          </div>
          <p className="text-sm">
            Unified School Portal - Excellence in Education
          </p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode
  title: string
  description: string
  color: "blue" | "amber" | "emerald" | "purple" | "rose" | "slate"
}) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    amber: "bg-amber-100 text-amber-600",
    emerald: "bg-emerald-100 text-emerald-600",
    purple: "bg-purple-100 text-purple-600",
    rose: "bg-rose-100 text-rose-600",
    slate: "bg-slate-100 text-slate-600",
  }

  return (
    <div className="p-6 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
      <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  )
}

function RoleCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm">{description}</p>
    </div>
  )
}
