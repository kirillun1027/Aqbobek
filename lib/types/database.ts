export type UserRole = "student" | "teacher" | "parent" | "admin"

export interface User {
  id: string
  email: string
  full_name: string
  role: UserRole
  avatar_url?: string
  created_at: string
  // For parents - linked student IDs
  linked_student_ids?: string[]
  // For students - class/grade info
  class_name?: string
  grade?: number
}

export interface Grade {
  id: string
  student_id: string
  subject: string
  score: number
  max_score: number
  date: string
  teacher_id: string
  quarter: number
  comment?: string
}

export interface Achievement {
  id: string
  student_id: string
  title: string
  description: string
  category: "academic" | "sports" | "arts" | "leadership" | "community" | "other"
  date: string
  awarded_by?: string
  points: number
}

export interface Event {
  id: string
  title: string
  description: string
  start_date: string
  end_date?: string
  location?: string
  category: "announcement" | "exam" | "holiday" | "sports" | "cultural" | "meeting"
  created_by: string
  is_featured: boolean
}

export interface AIConversation {
  id: string
  student_id: string
  messages: AIMessage[]
  created_at: string
  updated_at: string
}

export interface AIMessage {
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export type ScheduleLessonType = "lesson" | "stream" | "event"
export type ScheduleEntryStatus = "scheduled" | "reassigned" | "unfilled"

export interface ScheduleTeacher {
  id: string
  name: string
  subjects: string[]
  unavailable_slots: string[]
}

export interface ScheduleRoom {
  id: string
  name: string
  capacity: number
  features: string[]
}

export interface ScheduleRequirement {
  id: string
  class_name: string
  subject: string
  weekly_lessons: number
  preferred_slots: string[]
  allowed_teacher_ids: string[]
  room_features: string[]
  lesson_type: ScheduleLessonType
  group_label?: string | null
}

export interface ScheduleDataset {
  classes: string[]
  slots: string[]
  teachers: ScheduleTeacher[]
  rooms: ScheduleRoom[]
  requirements: ScheduleRequirement[]
}

export interface ScheduleEntry {
  id: string
  slot_id: string
  day: string
  period: number
  class_name: string
  subject: string
  teacher_id?: string | null
  teacher_name?: string | null
  room_id?: string | null
  room_name?: string | null
  lesson_type: ScheduleLessonType
  group_label?: string | null
  status: ScheduleEntryStatus
  note?: string | null
}

export interface ScheduleChange {
  entry_id: string
  change_type: string
  message: string
}

export interface ScheduleGenerationResult {
  dataset: ScheduleDataset
  entries: ScheduleEntry[]
  changes: ScheduleChange[]
  unresolved_requirements: string[]
  summary: string
}

// Supabase Database schema type
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, "id" | "created_at">
        Update: Partial<Omit<User, "id" | "created_at">>
      }
      grades: {
        Row: Grade
        Insert: Omit<Grade, "id">
        Update: Partial<Omit<Grade, "id">>
      }
      achievements: {
        Row: Achievement
        Insert: Omit<Achievement, "id">
        Update: Partial<Omit<Achievement, "id">>
      }
      events: {
        Row: Event
        Insert: Omit<Event, "id">
        Update: Partial<Omit<Event, "id">>
      }
      ai_conversations: {
        Row: AIConversation
        Insert: Omit<AIConversation, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<AIConversation, "id" | "created_at">>
      }
    }
  }
}
