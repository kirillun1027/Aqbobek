import { NextRequest, NextResponse } from 'next/server'
import { bilimClassAPI } from '@/lib/services/bilimclass-api'

// GET /api/bilimclass/grades?studentId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const action = searchParams.get('action')

    if (!studentId && action !== 'sync') {
      return NextResponse.json(
        { error: 'studentId parameter required' },
        { status: 400 }
      )
    }

    if (action === 'sync') {
      const result = await bilimClassAPI.syncGrades()
      return NextResponse.json(result)
    }

    if (action === 'trends' && studentId) {
      const trends = await bilimClassAPI.getGradeTrends(studentId)
      return NextResponse.json({ success: true, data: trends })
    }

    if (studentId) {
      const grades = await bilimClassAPI.getStudentGrades(studentId)
      return NextResponse.json({ success: true, data: grades })
    }

    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  } catch (error) {
    console.error('BilimClass API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch from BilimClass' },
      { status: 500 }
    )
  }
}

// POST /api/bilimclass/grades
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { studentId, subject, grade, gradeType } = data

    if (!studentId || !subject || grade === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const result = await bilimClassAPI.recordGrade({
      studentId,
      subject,
      grade: parseFloat(grade),
      gradeType: gradeType || 'test',
    })

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('BilimClass API error:', error)
    return NextResponse.json(
      { error: 'Failed to record grade' },
      { status: 500 }
    )
  }
}
