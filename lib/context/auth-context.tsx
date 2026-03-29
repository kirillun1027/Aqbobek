"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User, UserRole } from "@/lib/types/database"
import { mockUsers } from "@/lib/mock/data"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isMounted: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  switchRole: (role: UserRole) => void // For demo purposes
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Check for stored session only after mount (client-side)
    try {
      const storedUserId = localStorage.getItem("aqbobek_user_id")
      if (storedUserId) {
        const foundUser = mockUsers.find(u => u.id === storedUserId)
        if (foundUser) {
          setUser(foundUser)
        }
      }
    } catch {
      // localStorage not available
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock authentication - in production, this would validate against Supabase
    const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
    
    if (!foundUser) {
      setIsLoading(false)
      return { success: false, error: "User not found. Try: student@student.aqbobek.kz" }
    }
    
    // For demo, any password works
    if (password.length < 1) {
      setIsLoading(false)
      return { success: false, error: "Please enter a password" }
    }
    
    setUser(foundUser)
    try {
      localStorage.setItem("aqbobek_user_id", foundUser.id)
    } catch {
      // localStorage not available
    }
    setIsLoading(false)
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    try {
      localStorage.removeItem("aqbobek_user_id")
    } catch {
      // localStorage not available
    }
  }

  // Demo feature: Quick role switching
  const switchRole = (role: UserRole) => {
    const userOfRole = mockUsers.find(u => u.role === role)
    if (userOfRole) {
      setUser(userOfRole)
      try {
        localStorage.setItem("aqbobek_user_id", userOfRole.id)
      } catch {
        // localStorage not available
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, isMounted, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
