import type { Grade } from "@/lib/types/database"

export function calculateSubjectAverage(grades: Grade[]): { subject: string; average: number }[] {
  const subjectTotals: Record<string, { sum: number; count: number }> = {}

  for (const grade of grades) {
    if (!subjectTotals[grade.subject]) {
      subjectTotals[grade.subject] = { sum: 0, count: 0 }
    }
    subjectTotals[grade.subject].sum += (grade.score / grade.max_score) * 100
    subjectTotals[grade.subject].count += 1
  }

  return Object.entries(subjectTotals)
    .map(([subject, totals]) => ({
      subject,
      average: Math.round((totals.sum / totals.count) * 10) / 10,
    }))
    .sort((left, right) => right.average - left.average)
}
