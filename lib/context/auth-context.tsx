"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User, UserRole } from "@/lib/types/database"
import { getCurrentUserFromBackend, loginWithBackend } from "@/lib/api/backend"

const ACCESS_TOKEN_KEY = "aqbobek_access_token"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isMounted: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  switchRole: (role: UserRole) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    async function restoreSession() {
      try {
        const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
        if (!accessToken) return

        const currentUser = await getCurrentUserFromBackend(accessToken)
        setUser(currentUser)
      } catch {
        localStorage.removeItem(ACCESS_TOKEN_KEY)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    restoreSession()
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)

    try {
      const session = await loginWithBackend(email, password)
      setUser(session.user)
      localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken)
      setIsLoading(false)
      return { success: true }
    } catch (error) {
      setIsLoading(false)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      }
    }
  }

  const logout = () => {
    setUser(null)
    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY)
    } catch {
      // localStorage not available
    }
  }

  const switchRole = (_role: UserRole) => {
    // Deliberately disabled now that auth is backend-driven.
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
