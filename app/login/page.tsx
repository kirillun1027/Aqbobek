"use client"

import { useState } from "react"
import { useAuth } from "@/lib/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { GraduationCap, AlertCircle, Users, BookOpen, Shield } from "lucide-react"
import type { UserRole } from "@/lib/types/database"

const demoAccounts: { role: UserRole; email: string; password: string; label: string; icon: React.ReactNode }[] = [
  { role: "student", email: "student.demo@aqbobek.kz", password: "Student123!", label: "Student", icon: <GraduationCap className="h-4 w-4" /> },
  { role: "teacher", email: "teacher.demo@aqbobek.kz", password: "Teacher123!", label: "Teacher", icon: <BookOpen className="h-4 w-4" /> },
  { role: "parent", email: "parent.demo@aqbobek.kz", password: "Parent123!", label: "Parent", icon: <Users className="h-4 w-4" /> },
  { role: "admin", email: "admin.demo@aqbobek.kz", password: "Admin123!", label: "Admin", icon: <Shield className="h-4 w-4" /> },
]

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const result = await login(email, password)
    
    if (result.success) {
      window.location.href = "/dashboard"
    } else {
      setError(result.error || "Login failed")
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
    setError("")
    setIsLoading(true)

    const result = await login(demoEmail, demoPassword)
    
    if (result.success) {
      window.location.href = "/dashboard"
    } else {
      setError(result.error || "Login failed")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-600 text-white mb-4">
            <GraduationCap className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Aqbobek Lyceum</h1>
          <p className="text-slate-600 mt-1">Unified School Portal</p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access the portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@aqbobek.kz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex-col border-t pt-6">
            <p className="text-sm text-slate-500 mb-4">Quick Demo Access:</p>
            <div className="grid grid-cols-2 gap-2 w-full">
              {demoAccounts.map((account) => (
                <Button
                  key={account.role}
                  variant="outline"
                  size="sm"
                  className="gap-2 h-10"
                  onClick={() => handleDemoLogin(account.email, account.password)}
                  disabled={isLoading}
                >
                  {account.icon}
                  {account.label}
                </Button>
              ))}
            </div>
          </CardFooter>
        </Card>

        <p className="text-center text-sm text-slate-500 mt-6">
          Aqbobek Lyceum Educational Platform
        </p>
      </div>
    </div>
  )
}
