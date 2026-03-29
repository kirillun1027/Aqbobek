import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client"
import { mockUsers, mockGrades, mockAchievements, mockEvents, calculateRankings } from "@/lib/mock/data"
import type { User, Grade, Achievement, Event } from "@/lib/types/database"

// ============================================================
// DATA SERVICE
// Automatically uses Supabase when configured, falls back to mock data
// ============================================================

export async function getStudents(): Promise<User[]> {
  const supabase = getSupabaseClient()
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("role", "student")
    
    if (error) {
      console.error("[DataService] Error fetching students:", error)
      return mockUsers.filter(u => u.role === "student")
    }
    return data as User[]
  }
  
  return mockUsers.filter(u => u.role === "student")
}

export async function getStudentById(id: string): Promise<User | null> {
  const supabase = getSupabaseClient()
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single()
    
    if (error) {
      console.error("[DataService] Error fetching student:", error)
      return mockUsers.find(u => u.id === id) || null
    }
    return data as User
  }
  
  return mockUsers.find(u => u.id === id) || null
}

export async function getGradesForStudent(studentId: string, quarter?: number): Promise<Grade[]> {
  const supabase = getSupabaseClient()
  if (isSupabaseConfigured && supabase) {
    let query = supabase
      .from("grades")
      .select("*")
      .eq("student_id", studentId)
      .order("date", { ascending: false })
    
    if (quarter) {
      query = query.eq("quarter", quarter)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error("[DataService] Error fetching grades:", error)
      return mockGrades.filter(g => g.student_id === studentId && (!quarter || g.quarter === quarter))
    }
    return data as Grade[]
  }
  
  return mockGrades.filter(g => g.student_id === studentId && (!quarter || g.quarter === quarter))
}

export async function getAllGrades(quarter?: number): Promise<Grade[]> {
  const supabase = getSupabaseClient()
  if (isSupabaseConfigured && supabase) {
    let query = supabase
      .from("grades")
      .select("*")
      .order("date", { ascending: false })
    
    if (quarter) {
      query = query.eq("quarter", quarter)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error("[DataService] Error fetching all grades:", error)
      return quarter ? mockGrades.filter(g => g.quarter === quarter) : mockGrades
    }
    return data as Grade[]
  }
  
  return quarter ? mockGrades.filter(g => g.quarter === quarter) : mockGrades
}

export async function addGrade(grade: Omit<Grade, "id">): Promise<Grade | null> {
  const supabase = getSupabaseClient()
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("grades")
      .insert(grade)
      .select()
      .single()
    
    if (error) {
      console.error("[DataService] Error adding grade:", error)
      return null
    }
    return data as Grade
  }
  
  // Mock: Add to local array (won't persist)
  const newGrade: Grade = {
    ...grade,
    id: `g${Date.now()}`,
  }
  mockGrades.push(newGrade)
  return newGrade
}

export async function getAchievementsForStudent(studentId: string): Promise<Achievement[]> {
  const supabase = getSupabaseClient()
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .eq("student_id", studentId)
      .order("date", { ascending: false })
    
    if (error) {
      console.error("[DataService] Error fetching achievements:", error)
      return mockAchievements.filter(a => a.student_id === studentId)
    }
    return data as Achievement[]
  }
  
  return mockAchievements.filter(a => a.student_id === studentId)
}

export async function getAllAchievements(): Promise<Achievement[]> {
  const supabase = getSupabaseClient()
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .order("date", { ascending: false })
    
    if (error) {
      console.error("[DataService] Error fetching all achievements:", error)
      return mockAchievements
    }
    return data as Achievement[]
  }
  
  return mockAchievements
}

export async function addAchievement(achievement: Omit<Achievement, "id">): Promise<Achievement | null> {
  const supabase = getSupabaseClient()
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("achievements")
      .insert(achievement)
      .select()
      .single()
    
    if (error) {
      console.error("[DataService] Error adding achievement:", error)
      return null
    }
    return data as Achievement
  }
  
  // Mock: Add to local array
  const newAchievement: Achievement = {
    ...achievement,
    id: `a${Date.now()}`,
  }
  mockAchievements.push(newAchievement)
  return newAchievement
}

export async function getEvents(featured?: boolean): Promise<Event[]> {
  const supabase = getSupabaseClient()
  if (isSupabaseConfigured && supabase) {
    let query = supabase
      .from("events")
      .select("*")
      .order("start_date", { ascending: true })
    
    if (featured) {
      query = query.eq("is_featured", true)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error("[DataService] Error fetching events:", error)
      return featured ? mockEvents.filter(e => e.is_featured) : mockEvents
    }
    return data as Event[]
  }
  
  return featured ? mockEvents.filter(e => e.is_featured) : mockEvents
}

export async function addEvent(event: Omit<Event, "id">): Promise<Event | null> {
  const supabase = getSupabaseClient()
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("events")
      .insert(event)
      .select()
      .single()
    
    if (error) {
      console.error("[DataService] Error adding event:", error)
      return null
    }
    return data as Event
  }
  
  // Mock: Add to local array
  const newEvent: Event = {
    ...event,
    id: `e${Date.now()}`,
  }
  mockEvents.push(newEvent)
  return newEvent
}

export async function getRankings() {
  // For Supabase, you would compute this server-side or use a view
  // For now, we use the mock calculation
  return calculateRankings()
}

// Subject average calculator
export function calculateSubjectAverage(grades: Grade[]): { subject: string; average: number }[] {
  const subjectTotals: Record<string, { sum: number; count: number }> = {}
  
  for (const grade of grades) {
    if (!subjectTotals[grade.subject]) {
      subjectTotals[grade.subject] = { sum: 0, count: 0 }
    }
    subjectTotals[grade.subject].sum += (grade.score / grade.max_score) * 100
    subjectTotals[grade.subject].count++
  }
  
  return Object.entries(subjectTotals)
    .map(([subject, { sum, count }]) => ({
      subject,
      average: Math.round((sum / count) * 10) / 10,
    }))
    .sort((a, b) => b.average - a.average)
}

// Identify at-risk students (for teachers)
export function identifyAtRiskStudents(
  students: User[],
  grades: Grade[],
  threshold: number = 70
): { student: User; average: number; concernSubjects: string[] }[] {
  const atRisk: { student: User; average: number; concernSubjects: string[] }[] = []
  
  for (const student of students) {
    const studentGrades = grades.filter(g => g.student_id === student.id)
    if (studentGrades.length === 0) continue
    
    const subjectAverages = calculateSubjectAverage(studentGrades)
    const concernSubjects = subjectAverages
      .filter(s => s.average < threshold)
      .map(s => s.subject)
    
    const overallAverage = subjectAverages.reduce((sum, s) => sum + s.average, 0) / subjectAverages.length
    
    if (concernSubjects.length > 0 || overallAverage < threshold) {
      atRisk.push({
        student,
        average: Math.round(overallAverage * 10) / 10,
        concernSubjects,
      })
    }
  }
  
  return atRisk.sort((a, b) => a.average - b.average)
}
