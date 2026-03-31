import type {
  Achievement,
  Event,
  Grade,
  ScheduleDataset,
  ScheduleGenerationResult,
  User,
} from "@/lib/types/database"

interface BackendUser {
  id: string
  email: string
  full_name: string
  role: User["role"]
  avatar_url?: string | null
  class_name?: string | null
  grade_level?: number | null
  linked_student_ids?: string[]
  created_at: string
  updated_at: string
}

interface AuthSessionResponse {
  access_token: string
  refresh_token?: string | null
  expires_in?: number | null
  token_type: string
  user: BackendUser
}

export interface RankingEntry {
  student_id: string
  name: string
  average: number
  achievement_points: number
}

export interface AtRiskEntry {
  student: {
    id: string
    email: string
    full_name: string
    role: User["role"]
    class_name?: string | null
    grade_level?: number | null
    linked_student_ids?: string[]
    created_at: string
    updated_at: string
  }
  average: number
  concern_subjects: string[]
}

export interface KioskPayload {
  rankings: RankingEntry[]
  featured_events: Event[]
  recent_achievements: Array<{
    id: string
    student_id: string
    student_name: string
    title: string
    description: string
    points: number
    category: Achievement["category"]
    date: string
  }>
}

export interface AnalyticsOverview {
  total_students: number
  total_teachers: number
  total_parents: number
  total_events: number
  total_achievements: number
  school_average: number
}

const DEFAULT_BACKEND_URL = "http://localhost:8000/api"
const ACCESS_TOKEN_KEY = "aqbobek_access_token"
const SESSION_EXPIRED_MESSAGE = "Session expired or access token is invalid."

export class SessionExpiredError extends Error {
  constructor(message = SESSION_EXPIRED_MESSAGE) {
    super(message)
    this.name = "SessionExpiredError"
  }
}

function getBackendBaseUrl() {
  return process.env.NEXT_PUBLIC_BACKEND_URL || DEFAULT_BACKEND_URL
}

function mapBackendUser(user: BackendUser): User {
  return {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    role: user.role,
    avatar_url: user.avatar_url || undefined,
    class_name: user.class_name || undefined,
    grade: user.grade_level || undefined,
    linked_student_ids: user.linked_student_ids || [],
    created_at: user.created_at,
  }
}

function getAccessToken() {
  if (typeof window === "undefined") return null
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

async function parseError(response: Response, fallbackMessage: string) {
  try {
    const data = await response.json()
    if (typeof data?.detail === "string") return data.detail
    if (typeof data?.error === "string") return data.error
  } catch {
    // Ignore parse failures and fall back to a generic message.
  }
  return fallbackMessage
}

async function authorizedFetch(path: string, options: RequestInit = {}) {
  const accessToken = getAccessToken()
  if (!accessToken) {
    throw new Error("You are not authenticated.")
  }

  const response = await fetch(`${getBackendBaseUrl()}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...options.headers,
    },
  })

  if (!response.ok) {
    const message = await parseError(response, "Request failed")
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem(ACCESS_TOKEN_KEY)
      }
      throw new SessionExpiredError(message)
    }
    throw new Error(message)
  }

  return response
}

export async function loginWithBackend(email: string, password: string) {
  const response = await fetch(`${getBackendBaseUrl()}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const message = await parseError(response, "Login failed")
    throw new Error(message)
  }

  const session = (await response.json()) as AuthSessionResponse
  return {
    accessToken: session.access_token,
    refreshToken: session.refresh_token || undefined,
    user: mapBackendUser(session.user),
  }
}

export async function getCurrentUserFromBackend(accessToken: string) {
  const response = await fetch(`${getBackendBaseUrl()}/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    const message = await parseError(response, "Failed to restore session")
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem(ACCESS_TOKEN_KEY)
      }
      throw new SessionExpiredError(message)
    }
    throw new Error(message)
  }

  const user = (await response.json()) as BackendUser
  return mapBackendUser(user)
}

export async function getStudentsFromBackend() {
  const response = await authorizedFetch("/students")
  const students = (await response.json()) as BackendUser[]
  return students.map(mapBackendUser)
}

export async function getStudentByIdFromBackend(studentId: string) {
  const response = await authorizedFetch(`/students/${studentId}`, {
    method: "GET",
    headers: {},
  })
  const student = (await response.json()) as BackendUser
  return mapBackendUser(student)
}

export async function getGradesForStudentFromBackend(studentId: string, quarter?: number) {
  const search = new URLSearchParams({ student_id: studentId })
  if (quarter) {
    search.set("quarter", String(quarter))
  }

  const response = await authorizedFetch(`/grades?${search.toString()}`, {
    method: "GET",
    headers: {},
  })
  return (await response.json()) as Grade[]
}

export async function getAllGradesFromBackend(quarter?: number) {
  const search = new URLSearchParams()
  if (quarter) {
    search.set("quarter", String(quarter))
  }
  const suffix = search.size > 0 ? `?${search.toString()}` : ""
  const response = await authorizedFetch(`/grades${suffix}`, {
    method: "GET",
    headers: {},
  })
  return (await response.json()) as Grade[]
}

export async function createGradeInBackend(payload: Omit<Grade, "id" | "teacher_id">) {
  const response = await authorizedFetch("/grades", {
    method: "POST",
    body: JSON.stringify(payload),
  })
  return (await response.json()) as Grade
}

export async function getAchievementsForStudentFromBackend(studentId: string) {
  const search = new URLSearchParams({ student_id: studentId })
  const response = await authorizedFetch(`/achievements?${search.toString()}`, {
    method: "GET",
    headers: {},
  })
  return (await response.json()) as Achievement[]
}

export async function getAllAchievementsFromBackend() {
  const response = await authorizedFetch("/achievements", {
    method: "GET",
    headers: {},
  })
  return (await response.json()) as Achievement[]
}

export async function createAchievementInBackend(
  payload: Omit<Achievement, "id" | "awarded_by">,
) {
  const response = await authorizedFetch("/achievements", {
    method: "POST",
    body: JSON.stringify(payload),
  })
  return (await response.json()) as Achievement
}

export async function getEventsFromBackend(featured?: boolean) {
  const search = new URLSearchParams()
  if (featured) {
    search.set("featured", "true")
  }
  const suffix = search.size > 0 ? `?${search.toString()}` : ""
  const response = await fetch(`${getBackendBaseUrl()}/events${suffix}`)
  if (!response.ok) {
    const message = await parseError(response, "Failed to load events")
    throw new Error(message)
  }
  return (await response.json()) as Event[]
}

export async function createEventInBackend(payload: Omit<Event, "id" | "created_by">) {
  const response = await authorizedFetch("/events", {
    method: "POST",
    body: JSON.stringify(payload),
  })
  return (await response.json()) as Event
}

export async function getRankingsFromBackend(quarter = 3) {
  const response = await fetch(`${getBackendBaseUrl()}/analytics/rankings?quarter=${quarter}`)
  if (!response.ok) {
    const message = await parseError(response, "Failed to load rankings")
    throw new Error(message)
  }
  return (await response.json()) as RankingEntry[]
}

export async function getAnalyticsOverviewFromBackend(quarter = 3) {
  const response = await authorizedFetch(`/analytics/overview?quarter=${quarter}`, {
    method: "GET",
    headers: {},
  })
  return (await response.json()) as AnalyticsOverview
}

export async function getAtRiskStudentsFromBackend(threshold = 75, quarter = 3) {
  const response = await authorizedFetch(
    `/analytics/at-risk?threshold=${threshold}&quarter=${quarter}`,
    {
      method: "GET",
      headers: {},
    }
  )
  return (await response.json()) as AtRiskEntry[]
}

export async function getKioskPayloadFromBackend() {
  const response = await fetch(`${getBackendBaseUrl()}/analytics/kiosk`)
  if (!response.ok) {
    const message = await parseError(response, "Failed to load kiosk data")
    throw new Error(message)
  }
  return (await response.json()) as KioskPayload
}

export async function chatWithAIMentor(messages: Array<{ role: "user" | "assistant"; content: string }>, studentData: {
  grades: Grade[]
  achievements: Achievement[]
  student: User
}) {
  const response = await authorizedFetch("/ai-mentor", {
    method: "POST",
    body: JSON.stringify({
      messages,
      student_data: studentData,
    }),
  })
  return (await response.json()) as { message: string }
}

export async function getScheduleContextFromBackend() {
  const response = await authorizedFetch("/schedule/context", {
    method: "GET",
    headers: {},
  })
  return (await response.json()) as ScheduleDataset
}

export async function generateScheduleInBackend() {
  const response = await authorizedFetch("/schedule/generate", {
    method: "POST",
    body: JSON.stringify({}),
  })
  return (await response.json()) as ScheduleGenerationResult
}

export async function rebuildScheduleForAbsenceInBackend(absentTeacherId: string) {
  const response = await authorizedFetch("/schedule/rebuild", {
    method: "POST",
    body: JSON.stringify({ absent_teacher_id: absentTeacherId }),
  })
  return (await response.json()) as ScheduleGenerationResult
}
