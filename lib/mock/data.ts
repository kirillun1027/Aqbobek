import type { User, Grade, Achievement, Event } from "@/lib/types/database"

// Mock Users
export const mockUsers: User[] = [
  {
    id: "student-1",
    email: "aliya.nurlan@student.aqbobek.kz",
    full_name: "Aliya Nurlan",
    role: "student",
    class_name: "11A",
    grade: 11,
    created_at: "2024-09-01T00:00:00Z",
  },
  {
    id: "student-2",
    email: "timur.akhmetov@student.aqbobek.kz",
    full_name: "Timur Akhmetov",
    role: "student",
    class_name: "11A",
    grade: 11,
    created_at: "2024-09-01T00:00:00Z",
  },
  {
    id: "student-3",
    email: "dana.serik@student.aqbobek.kz",
    full_name: "Dana Serik",
    role: "student",
    class_name: "10B",
    grade: 10,
    created_at: "2024-09-01T00:00:00Z",
  },
  {
    id: "student-4",
    email: "arman.kanat@student.aqbobek.kz",
    full_name: "Arman Kanat",
    role: "student",
    class_name: "11A",
    grade: 11,
    created_at: "2024-09-01T00:00:00Z",
  },
  {
    id: "student-5",
    email: "madina.orazova@student.aqbobek.kz",
    full_name: "Madina Orazova",
    role: "student",
    class_name: "10B",
    grade: 10,
    created_at: "2024-09-01T00:00:00Z",
  },
  {
    id: "teacher-1",
    email: "teacher@aqbobek.kz",
    full_name: "Nurlan Saparov",
    role: "teacher",
    created_at: "2024-08-01T00:00:00Z",
  },
  {
    id: "parent-1",
    email: "parent@aqbobek.kz",
    full_name: "Gulnara Nurlan",
    role: "parent",
    linked_student_ids: ["student-1"],
    created_at: "2024-08-01T00:00:00Z",
  },
  {
    id: "admin-1",
    email: "admin@aqbobek.kz",
    full_name: "Aizhan Bekturova",
    role: "admin",
    created_at: "2024-07-01T00:00:00Z",
  },
]

// Mock Grades (BilimClass-style)
export const mockGrades: Grade[] = [
  // Aliya's grades
  { id: "g1", student_id: "student-1", subject: "Mathematics", score: 95, max_score: 100, date: "2024-03-15", teacher_id: "teacher-1", quarter: 3 },
  { id: "g2", student_id: "student-1", subject: "Mathematics", score: 88, max_score: 100, date: "2024-03-10", teacher_id: "teacher-1", quarter: 3 },
  { id: "g3", student_id: "student-1", subject: "Physics", score: 92, max_score: 100, date: "2024-03-14", teacher_id: "teacher-1", quarter: 3 },
  { id: "g4", student_id: "student-1", subject: "Physics", score: 85, max_score: 100, date: "2024-03-08", teacher_id: "teacher-1", quarter: 3 },
  { id: "g5", student_id: "student-1", subject: "Chemistry", score: 78, max_score: 100, date: "2024-03-12", teacher_id: "teacher-1", quarter: 3 },
  { id: "g6", student_id: "student-1", subject: "Chemistry", score: 82, max_score: 100, date: "2024-03-05", teacher_id: "teacher-1", quarter: 3 },
  { id: "g7", student_id: "student-1", subject: "Biology", score: 90, max_score: 100, date: "2024-03-13", teacher_id: "teacher-1", quarter: 3 },
  { id: "g8", student_id: "student-1", subject: "English", score: 94, max_score: 100, date: "2024-03-11", teacher_id: "teacher-1", quarter: 3 },
  { id: "g9", student_id: "student-1", subject: "History", score: 87, max_score: 100, date: "2024-03-09", teacher_id: "teacher-1", quarter: 3 },
  { id: "g10", student_id: "student-1", subject: "Kazakh Language", score: 91, max_score: 100, date: "2024-03-07", teacher_id: "teacher-1", quarter: 3 },
  
  // Previous quarters for trends
  { id: "g11", student_id: "student-1", subject: "Mathematics", score: 82, max_score: 100, date: "2024-01-15", teacher_id: "teacher-1", quarter: 2 },
  { id: "g12", student_id: "student-1", subject: "Physics", score: 78, max_score: 100, date: "2024-01-14", teacher_id: "teacher-1", quarter: 2 },
  { id: "g13", student_id: "student-1", subject: "Chemistry", score: 70, max_score: 100, date: "2024-01-12", teacher_id: "teacher-1", quarter: 2 },
  
  // Timur's grades
  { id: "g14", student_id: "student-2", subject: "Mathematics", score: 72, max_score: 100, date: "2024-03-15", teacher_id: "teacher-1", quarter: 3 },
  { id: "g15", student_id: "student-2", subject: "Physics", score: 68, max_score: 100, date: "2024-03-14", teacher_id: "teacher-1", quarter: 3 },
  { id: "g16", student_id: "student-2", subject: "Chemistry", score: 65, max_score: 100, date: "2024-03-12", teacher_id: "teacher-1", quarter: 3 },
  { id: "g17", student_id: "student-2", subject: "Biology", score: 75, max_score: 100, date: "2024-03-13", teacher_id: "teacher-1", quarter: 3 },
  { id: "g18", student_id: "student-2", subject: "English", score: 80, max_score: 100, date: "2024-03-11", teacher_id: "teacher-1", quarter: 3 },
  
  // Dana's grades
  { id: "g19", student_id: "student-3", subject: "Mathematics", score: 88, max_score: 100, date: "2024-03-15", teacher_id: "teacher-1", quarter: 3 },
  { id: "g20", student_id: "student-3", subject: "Physics", score: 90, max_score: 100, date: "2024-03-14", teacher_id: "teacher-1", quarter: 3 },
  { id: "g21", student_id: "student-3", subject: "Chemistry", score: 85, max_score: 100, date: "2024-03-12", teacher_id: "teacher-1", quarter: 3 },
  
  // Arman's grades
  { id: "g22", student_id: "student-4", subject: "Mathematics", score: 91, max_score: 100, date: "2024-03-15", teacher_id: "teacher-1", quarter: 3 },
  { id: "g23", student_id: "student-4", subject: "Physics", score: 89, max_score: 100, date: "2024-03-14", teacher_id: "teacher-1", quarter: 3 },
  { id: "g24", student_id: "student-4", subject: "Chemistry", score: 86, max_score: 100, date: "2024-03-12", teacher_id: "teacher-1", quarter: 3 },
  
  // Madina's grades
  { id: "g25", student_id: "student-5", subject: "Mathematics", score: 79, max_score: 100, date: "2024-03-15", teacher_id: "teacher-1", quarter: 3 },
  { id: "g26", student_id: "student-5", subject: "Physics", score: 82, max_score: 100, date: "2024-03-14", teacher_id: "teacher-1", quarter: 3 },
  { id: "g27", student_id: "student-5", subject: "Chemistry", score: 88, max_score: 100, date: "2024-03-12", teacher_id: "teacher-1", quarter: 3 },
]

// Mock Achievements
export const mockAchievements: Achievement[] = [
  {
    id: "a1",
    student_id: "student-1",
    title: "Mathematics Olympiad - 1st Place",
    description: "Won first place in the regional Mathematics Olympiad 2024",
    category: "academic",
    date: "2024-02-20",
    awarded_by: "Ministry of Education",
    points: 100,
  },
  {
    id: "a2",
    student_id: "student-1",
    title: "Perfect Attendance - Q2",
    description: "Maintained perfect attendance throughout Quarter 2",
    category: "other",
    date: "2024-01-31",
    points: 25,
  },
  {
    id: "a3",
    student_id: "student-2",
    title: "Basketball Team Captain",
    description: "Elected as the captain of the school basketball team",
    category: "sports",
    date: "2024-03-01",
    points: 50,
  },
  {
    id: "a4",
    student_id: "student-3",
    title: "Science Fair Winner",
    description: "Best Project Award at the Annual Science Fair",
    category: "academic",
    date: "2024-02-15",
    awarded_by: "Science Department",
    points: 75,
  },
  {
    id: "a5",
    student_id: "student-4",
    title: "Debate Champion",
    description: "Won the inter-school debate competition",
    category: "academic",
    date: "2024-03-10",
    points: 80,
  },
  {
    id: "a6",
    student_id: "student-1",
    title: "Student Council Member",
    description: "Elected to serve on the Student Council",
    category: "leadership",
    date: "2024-01-15",
    points: 40,
  },
  {
    id: "a7",
    student_id: "student-5",
    title: "Art Exhibition",
    description: "Featured artwork in the school gallery",
    category: "arts",
    date: "2024-02-28",
    points: 35,
  },
]

// Mock Events
export const mockEvents: Event[] = [
  {
    id: "e1",
    title: "Spring Break",
    description: "School will be closed for spring break. Classes resume on March 25th.",
    start_date: "2024-03-18",
    end_date: "2024-03-24",
    category: "holiday",
    created_by: "admin-1",
    is_featured: true,
  },
  {
    id: "e2",
    title: "Parent-Teacher Conference",
    description: "Quarterly parent-teacher meetings. Please book your slot in advance.",
    start_date: "2024-03-28",
    location: "School Auditorium",
    category: "meeting",
    created_by: "admin-1",
    is_featured: true,
  },
  {
    id: "e3",
    title: "Quarter 3 Final Exams",
    description: "Final examinations for Q3. Check the detailed schedule on the portal.",
    start_date: "2024-04-01",
    end_date: "2024-04-10",
    category: "exam",
    created_by: "admin-1",
    is_featured: true,
  },
  {
    id: "e4",
    title: "Inter-School Sports Meet",
    description: "Annual sports competition with neighboring schools. All students are welcome to participate.",
    start_date: "2024-04-15",
    end_date: "2024-04-17",
    location: "School Sports Complex",
    category: "sports",
    created_by: "admin-1",
    is_featured: true,
  },
  {
    id: "e5",
    title: "Career Day",
    description: "Industry professionals will share insights about various career paths.",
    start_date: "2024-04-20",
    location: "Main Hall",
    category: "cultural",
    created_by: "admin-1",
    is_featured: false,
  },
  {
    id: "e6",
    title: "School Anniversary Celebration",
    description: "Celebrating 15 years of Aqbobek Lyceum! Join us for performances and festivities.",
    start_date: "2024-05-01",
    location: "School Campus",
    category: "cultural",
    created_by: "admin-1",
    is_featured: true,
  },
  {
    id: "e7",
    title: "New Library Hours",
    description: "The library will now be open until 6 PM on weekdays.",
    start_date: "2024-03-15",
    category: "announcement",
    created_by: "admin-1",
    is_featured: false,
  },
]

// Helper function to calculate student rankings
export function calculateRankings() {
  const studentAverages: { studentId: string; name: string; average: number; achievementPoints: number }[] = []
  
  const students = mockUsers.filter(u => u.role === "student")
  
  for (const student of students) {
    const studentGrades = mockGrades.filter(g => g.student_id === student.id && g.quarter === 3)
    const average = studentGrades.length > 0 
      ? studentGrades.reduce((sum, g) => sum + (g.score / g.max_score) * 100, 0) / studentGrades.length
      : 0
    
    const achievementPoints = mockAchievements
      .filter(a => a.student_id === student.id)
      .reduce((sum, a) => sum + a.points, 0)
    
    studentAverages.push({
      studentId: student.id,
      name: student.full_name,
      average: Math.round(average * 10) / 10,
      achievementPoints,
    })
  }
  
  return studentAverages.sort((a, b) => {
    // Primary sort by average, secondary by achievement points
    const scoreDiff = b.average - a.average
    if (scoreDiff !== 0) return scoreDiff
    return b.achievementPoints - a.achievementPoints
  })
}
