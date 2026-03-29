"use client"

import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/lib/context/auth-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  MessageSquare, 
  Send, 
  Sparkles,
  BookOpen,
  Target,
  Lightbulb,
  GraduationCap,
  ArrowLeft,
  Bot,
  User as UserIcon
} from "lucide-react"
import { getGradesForStudent, getAchievementsForStudent } from "@/lib/services/data-service"
import type { Grade, Achievement } from "@/lib/types/database"

// ============================================================
// AI MENTOR CONFIGURATION
// ============================================================
// 
// To enable AI functionality:
// 1. Set up your AI provider API key in environment variables
// 2. Uncomment the useChat hook below and the API route
// 3. See /app/api/ai-mentor/route.ts for the AI implementation
// 4. Refer to SETUP.md for detailed instructions
//
// Currently using MOCK responses for demo purposes
// ============================================================

const suggestedQuestions = [
  { icon: <Target className="h-4 w-4" />, text: "What should I focus on to improve my grades?" },
  { icon: <Lightbulb className="h-4 w-4" />, text: "Based on my strengths, what careers should I consider?" },
  { icon: <BookOpen className="h-4 w-4" />, text: "Give me study tips for my weakest subjects" },
  { icon: <GraduationCap className="h-4 w-4" />, text: "How can I prepare for university entrance exams?" },
]

// Mock AI responses for demo
const mockResponses: Record<string, string> = {
  "What should I focus on to improve my grades?": 
    "Based on your current performance, I recommend focusing on consistent daily study sessions rather than cramming. Your Mathematics scores show good potential - try to maintain that momentum. For subjects where you're struggling, consider forming study groups with classmates or seeking additional help from your teachers during office hours.",
  "Based on my strengths, what careers should I consider?": 
    "Looking at your academic profile, you show strong analytical thinking which opens doors to many exciting careers. Consider fields like Engineering, Computer Science, Data Analytics, or Finance. Your achievements also suggest leadership qualities - roles in project management or entrepreneurship could suit you well.",
  "Give me study tips for my weakest subjects": 
    "For challenging subjects, try the 'active recall' method: instead of just reading, close your book and try to recall what you learned. Create flashcards, teach concepts to others, and practice with past exam papers. Breaking study sessions into 25-minute focused blocks (Pomodoro Technique) can also help maintain concentration.",
  "How can I prepare for university entrance exams?": 
    "Start by understanding the UNT/ENT exam structure and which subjects carry the most weight for your desired major. Create a study schedule at least 6 months before the exam. Practice with past papers regularly, focus on your weakest areas first, and don't neglect general subjects. Consider joining preparation courses if available.",
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function AIMentorPage() {
  const { user } = useAuth()
  const [studentData, setStudentData] = useState<{
    grades: Grade[]
    achievements: Achievement[]
  } | null>(null)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // ============================================================
  // AI INTEGRATION POINT
  // ============================================================
  // To enable real AI, uncomment this useChat hook and remove the mock implementation:
  //
  // import { useChat } from "@ai-sdk/react"
  // import { DefaultChatTransport } from "ai"
  //
  // const { messages, sendMessage, status } = useChat({
  //   transport: new DefaultChatTransport({
  //     api: "/api/ai-mentor",
  //     prepareSendMessagesRequest: ({ messages }) => ({
  //       body: {
  //         messages,
  //         studentData: studentData ? { ...studentData, student: user } : null,
  //       },
  //     }),
  //   }),
  // })
  // ============================================================

  useEffect(() => {
    async function loadStudentData() {
      if (!user) return
      
      const [grades, achievements] = await Promise.all([
        getGradesForStudent(user.id),
        getAchievementsForStudent(user.id),
      ])
      
      setStudentData({ grades, achievements })
      setIsDataLoading(false)
    }
    
    loadStudentData()
  }, [user])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // ============================================================
    // MOCK AI RESPONSE - Replace with real AI integration
    // ============================================================
    // When AI is enabled, remove this setTimeout block and use:
    // sendMessage({ text: input })
    // ============================================================
    setTimeout(() => {
      const response = mockResponses[userMessage.content] || 
        "Thank you for your question! As your AI mentor, I'm here to help you succeed academically. While I analyze your grades and achievements to provide personalized advice, remember that consistent effort and a positive attitude are key to success. Is there something specific about your studies or career goals you'd like to discuss?"
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response
      }
      
      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleSuggestedQuestion = (question: string) => {
    if (isLoading) return
    setInput(question)
    // Auto-submit the question
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: question
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    setTimeout(() => {
      const response = mockResponses[question] || 
        "I'm analyzing your academic data to provide personalized advice. Please try again or ask a different question."
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response
      }
      
      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleBack = () => {
    window.location.href = "/dashboard"
  }

  if (!user) return null

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-4 shrink-0">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleBack}
          className="shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Mentor</h1>
          <p className="text-muted-foreground text-sm">Your personal academic advisor</p>
        </div>
      </div>

      {/* Chat container */}
      <Card className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <CardHeader className="border-b shrink-0 py-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Chat with Your Mentor</CardTitle>
              <CardDescription className="text-xs">
                Ask about study strategies, career guidance, or academic advice
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        {/* Messages area - scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0 p-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <div className="p-4 bg-primary/10 rounded-2xl mb-4">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Hello, {user.full_name.split(" ")[0]}!
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md text-sm">
                I&apos;m your AI mentor. I can provide personalized advice based on your academic performance. What would you like to discuss?
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestedQuestion(q.text)}
                    disabled={isDataLoading}
                    className="flex items-center gap-2 p-3 bg-muted hover:bg-muted/80 rounded-lg text-left text-sm text-foreground transition-colors disabled:opacity-50"
                  >
                    <span className="text-primary shrink-0">{q.icon}</span>
                    <span className="line-clamp-2">{q.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                  {message.role === "user" && (
                    <div className="shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <UserIcon className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="p-4 border-t shrink-0 bg-background">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your AI mentor..."
              disabled={isLoading || isDataLoading}
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={isLoading || isDataLoading || !input.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            AI Mentor provides general guidance. Consult teachers for specific academic questions.
          </p>
        </div>
      </Card>
    </div>
  )
}
