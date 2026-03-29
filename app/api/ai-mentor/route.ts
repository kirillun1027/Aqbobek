// ============================================================
// AI MENTOR API ROUTE
// ============================================================
// 
// This route handles AI-powered mentoring responses.
// Currently DISABLED - the frontend uses mock responses.
//
// TO ENABLE AI INTEGRATION:
// 1. Uncomment the code below
// 2. Set up your AI provider API key:
//    - For OpenAI: Set OPENAI_API_KEY environment variable
//    - For other providers: Configure accordingly
// 3. Update the frontend (app/dashboard/ai-mentor/page.tsx):
//    - Uncomment the useChat hook
//    - Remove the mock response implementation
//
// SUPPORTED PROVIDERS (via Vercel AI Gateway):
// - openai/gpt-4o-mini (recommended for cost-effectiveness)
// - openai/gpt-4o (better quality, higher cost)
// - anthropic/claude-3-haiku-20240307 (alternative)
//
// See: https://sdk.vercel.ai/docs for AI SDK documentation
// ============================================================

import { NextResponse } from "next/server"
// import { streamText, convertToModelMessages } from "ai"
// import type { Grade, Achievement, User } from "@/lib/types/database"

export async function POST(req: Request) {
  // Return a message indicating AI is not configured
  return NextResponse.json(
    { 
      error: "AI Mentor not configured",
      message: "Please set up AI integration. See SETUP.md for instructions."
    },
    { status: 503 }
  )

  // ============================================================
  // UNCOMMENT BELOW TO ENABLE AI FUNCTIONALITY
  // ============================================================
  /*
  const { messages, studentData } = await req.json()

  const { grades, achievements, student } = studentData as {
    grades: Grade[]
    achievements: Achievement[]
    student: User
  }

  // Build context about student performance
  const subjectAverages: Record<string, { sum: number; count: number }> = {}
  for (const grade of grades) {
    if (!subjectAverages[grade.subject]) {
      subjectAverages[grade.subject] = { sum: 0, count: 0 }
    }
    subjectAverages[grade.subject].sum += (grade.score / grade.max_score) * 100
    subjectAverages[grade.subject].count++
  }

  const subjectSummary = Object.entries(subjectAverages)
    .map(([subject, { sum, count }]) => `${subject}: ${Math.round(sum / count)}%`)
    .join("\n")

  const achievementList = achievements
    .map(a => `- ${a.title} (${a.category}, ${a.points} points)`)
    .join("\n")

  const strongSubjects = Object.entries(subjectAverages)
    .filter(([, { sum, count }]) => sum / count >= 85)
    .map(([subject]) => subject)
    .join(", ")

  const weakSubjects = Object.entries(subjectAverages)
    .filter(([, { sum, count }]) => sum / count < 75)
    .map(([subject]) => subject)
    .join(", ")

  const systemPrompt = `You are an AI Educational Mentor for Aqbobek Lyceum, a prestigious school in Kazakhstan. Your role is to provide personalized academic guidance and support to students.

STUDENT PROFILE:
- Name: ${student.full_name}
- Grade: ${student.grade || "N/A"}
- Class: ${student.class_name || "N/A"}

ACADEMIC PERFORMANCE (Current Quarter Averages):
${subjectSummary || "No grades available yet"}

STRENGTHS: ${strongSubjects || "Still analyzing performance"}
AREAS FOR IMPROVEMENT: ${weakSubjects || "No significant concerns"}

ACHIEVEMENTS:
${achievementList || "No achievements recorded yet"}

YOUR RESPONSIBILITIES:
1. ACADEMIC SUPPORT: Analyze grades and provide specific study strategies
2. CAREER GUIDANCE: Based on their strengths, suggest potential career paths and fields of study
3. MOTIVATION: Encourage students and celebrate their achievements
4. GOAL SETTING: Help them set realistic academic goals
5. IMPROVEMENT PLANS: For weak subjects, provide actionable improvement strategies

GUIDELINES:
- Be warm, encouraging, and supportive while remaining professional
- Provide specific, actionable advice based on their actual performance data
- Reference their actual grades and achievements in your responses
- Consider the Kazakhstani education system and university entrance requirements (UNT/ENT)
- Suggest extracurricular activities that align with their interests
- When discussing careers, consider both local and international opportunities
- Keep responses concise but helpful (2-3 paragraphs max unless asked for more detail)

Remember: You're not just an AI - you're a mentor who genuinely cares about this student's success.`

  const result = streamText({
    model: "openai/gpt-4o-mini", // Change model as needed
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 1000,
  })

  return result.toUIMessageStreamResponse()
  */
}
