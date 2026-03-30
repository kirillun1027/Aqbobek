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
import { chatWithAIMentor, getAchievementsForStudentFromBackend, getGradesForStudentFromBackend } from "@/lib/api/backend"
import type { Grade, Achievement } from "@/lib/types/database"

const suggestedQuestions = [
  { icon: <Target className="h-4 w-4" />, text: "What should I focus on to improve my grades?" },
  { icon: <Lightbulb className="h-4 w-4" />, text: "Based on my strengths, what careers should I consider?" },
  { icon: <BookOpen className="h-4 w-4" />, text: "Give me study tips for my weakest subjects" },
  { icon: <GraduationCap className="h-4 w-4" />, text: "How can I prepare for university entrance exams?" },
]

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
  const [error, setError] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function loadStudentData() {
      if (!user) return
      
      const [grades, achievements] = await Promise.all([
        getGradesForStudentFromBackend(user.id),
        getAchievementsForStudentFromBackend(user.id),
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
    setError("")

    try {
      const response = await chatWithAIMentor(
        [...messages, userMessage].map(message => ({
          role: message.role,
          content: message.content,
        })),
        {
          grades: studentData?.grades || [],
          achievements: studentData?.achievements || [],
          student: user,
        }
      )

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.message
      }
      
      setMessages(prev => [...prev, aiMessage])
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI mentor is unavailable")
    } finally {
      setIsLoading(false)
    }
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

    void (async () => {
      try {
        const response = await chatWithAIMentor(
          [...messages, userMessage].map(message => ({
            role: message.role,
            content: message.content,
          })),
          {
            grades: studentData?.grades || [],
            achievements: studentData?.achievements || [],
            student: user,
          }
        )

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response.message
        }
        
        setMessages(prev => [...prev, aiMessage])
      } catch (err) {
        setError(err instanceof Error ? err.message : "AI mentor is unavailable")
      } finally {
        setIsLoading(false)
      }
    })()
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
          {error && (
            <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
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
