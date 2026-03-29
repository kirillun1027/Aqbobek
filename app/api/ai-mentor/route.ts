import { NextResponse } from "next/server"
import OpenAI from "openai"

// Инициализируем клиента OpenAI, но направляем его на OpenRouter
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY, // Твой ключ от OpenRouter
  // defaultHeaders нужно передавать по требованию OpenRouter (для статистики)
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    "X-Title": "Akbobek AI Mentor",
  }
})

export async function POST(req: Request) {
  try {
    const { messages, studentData } = await req.json()
    const { grades, achievements, student } = studentData

    // Считаем средние по предметам
    const subjectAverages: Record<string, { sum: number; count: number }> = {}
    for (const grade of grades) {
      if (!subjectAverages[grade.subject]) {
        subjectAverages[grade.subject] = { sum: 0, count: 0 }
      }
      subjectAverages[grade.subject].sum += (grade.score / grade.max_score) * 100
      subjectAverages[grade.subject].count++
    }

    const subjectSummary = Object.entries(subjectAverages)
      .map(([s, { sum, count }]) => `${s}: ${Math.round(sum / count)}%`)
      .join("\n")

    const achievementList = achievements
      .map((a: any) => `- ${a.title} (${a.category}, ${a.points} баллов)`)
      .join("\n")

    const systemPrompt = `Ты AI-ментор школы Акбобек в Казахстане. Помогаешь ученикам с учёбой и карьерными советами.

УЧЕНИК: ${student.full_name}, класс: ${student.grade || "N/A"}

УСПЕВАЕМОСТЬ:
${subjectSummary || "Оценок пока нет"}

ДОСТИЖЕНИЯ:
${achievementList || "Нет достижений"}

Отвечай тепло, по-дружески, давай конкретные советы. Отвечай на том же языке, на котором пишет ученик (казахский, русский или английский). Максимум 3 абзаца.`

    // Формируем историю чата для формата OpenAI
    const formattedMessages = messages.map((m: any) => ({
      // У OpenAI роли называются "user" и "assistant" (а не "model")
      role: m.role === "user" ? "user" : "assistant",
      content: m.content,
    }))

    // Добавляем системный промпт в самое начало массива сообщений
    formattedMessages.unshift({
      role: "system",
      content: systemPrompt,
    })

    // Делаем запрос к ИИ
    const response = await openai.chat.completions.create({
      // Выбираем полностью БЕСПЛАТНУЮ модель на OpenRouter
      // Отличные бесплатные варианты:
      // "google/gemma-2-9b-it:free" (от Google)
      // "meta-llama/llama-3-8b-instruct:free" (от Meta)
      model: "google/gemma-2-9b-it:free", 
      messages: formattedMessages,
      temperature: 0.7, // Настройка креативности (от 0 до 2)
    })

    const text = response.choices[0].message.content

    return NextResponse.json({ reply: text })
  } catch (error: any) {
    console.error("AI Mentor error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
