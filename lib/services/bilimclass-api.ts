// This file creates a realistic mock API for BilimClass integration
// In production, replace with actual BilimClass API calls

import { mockGrades, mockStudents } from '@/lib/mock/data'

export interface BilimClassGrade {
  studentId: string
  studentName: string
  subject: string
  grade: number
  date: string
  teacherName: string
  gradeType: 'quiz' | 'test' | 'homework' | 'participation'
}

export interface BilimClassStudent {
  id: string
  name: string
  class: string
  email: string
  averageGrade: number
  totalGrades: number
}

export interface BilimClassResponse<T> {
  success: boolean
  data: T
  message?: string
  timestamp: string
}

/**
 * Mock API service for BilimClass integration
 * Replace API_KEY and BASE_URL with actual BilimClass credentials when available
 */
export class BilimClassAPI {
  private apiKey = process.env.BILIMCLASS_API_KEY || 'mock-key'
  private baseUrl = process.env.BILIMCLASS_BASE_URL || 'https://api.bilimclass.kz'

  /**
   * Get grades for a specific student
   */
  async getStudentGrades(studentId: string): Promise<BilimClassGrade[]> {
    // Mock implementation - returns simulated data
    const studentGrades = mockGrades.filter(g => g.studentId === studentId)
    
    return studentGrades.map(g => ({
      studentId: g.studentId,
      studentName: 'Student Name',
      subject: g.subject,
      grade: g.grade,
      date: g.date,
      teacherName: 'Teacher Name',
      gradeType: 'test' as const,
    }))
  }

  /**
   * Get all students in a class
   */
  async getClassStudents(classId: string): Promise<BilimClassStudent[]> {
    return mockStudents.map(s => ({
      id: s.id,
      name: s.name,
      class: s.class,
      email: s.email,
      averageGrade: s.averageGrade,
      totalGrades: mockGrades.filter(g => g.studentId === s.id).length,
    }))
  }

  /**
   * Get grade statistics for a class
   */
  async getClassStatistics(classId: string) {
    const students = await this.getClassStudents(classId)
    const allGrades = mockGrades
    
    const average = allGrades.length > 0
      ? allGrades.reduce((sum, g) => sum + g.grade, 0) / allGrades.length
      : 0

    const highestGrade = Math.max(...allGrades.map(g => g.grade), 0)
    const lowestGrade = Math.min(...allGrades.map(g => g.grade), 100)

    return {
      classId,
      studentCount: students.length,
      averageGrade: parseFloat(average.toFixed(2)),
      highestGrade,
      lowestGrade,
      totalGrades: allGrades.length,
    }
  }

  /**
   * Get student's grade trends
   */
  async getGradeTrends(studentId: string) {
    const studentGrades = mockGrades
      .filter(g => g.studentId === studentId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return studentGrades.map((g, index) => {
      const trend = index === 0 
        ? 'stable'
        : g.grade > mockGrades[index - 1].grade
          ? 'up'
          : g.grade < mockGrades[index - 1].grade
            ? 'down'
            : 'stable'

      return {
        ...g,
        trend,
        dayNumber: index + 1,
      }
    })
  }

  /**
   * Record a new grade (POST operation)
   */
  async recordGrade(data: {
    studentId: string
    subject: string
    grade: number
    gradeType: string
  }): Promise<BilimClassGrade> {
    // In mock mode, just return the data
    // In production, this would POST to BilimClass API
    return {
      studentId: data.studentId,
      studentName: 'Student Name',
      subject: data.subject,
      grade: data.grade,
      date: new Date().toISOString(),
      teacherName: 'Teacher Name',
      gradeType: data.gradeType as 'quiz' | 'test' | 'homework' | 'participation',
    }
  }

  /**
   * Sync grades from BilimClass
   * This would be called periodically to fetch the latest data
   */
  async syncGrades(): Promise<{ synced: number; lastSync: string }> {
    // In production, this would call BilimClass API to fetch all grades
    return {
      synced: mockGrades.length,
      lastSync: new Date().toISOString(),
    }
  }
}

// Create singleton instance
export const bilimClassAPI = new BilimClassAPI()
