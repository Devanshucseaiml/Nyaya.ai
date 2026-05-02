"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Send, Bot, User, Loader2, History, Plus, Check } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

interface ChatInterfaceProps {
  userId: string
}

export default function ChatInterface({ userId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [chatSessions, setChatSessions] = useState<any[]>([])
  const [selectedSession, setSelectedSession] = useState<string | null>(null)
  const [showSessionSelector, setShowSessionSelector] = useState(false)
  const [isLoadingSessions, setIsLoadingSessions] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    loadChatSessions()
  }, [])

  const loadChatSessions = async () => {
    try {
      setIsLoadingSessions(true)
      
      const { data, error } = await supabase
        .from("chat_sessions")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false })

      if (error) {
        console.error("Error loading chat sessions:", error)
        // If table doesn't exist, create a new session
        if (error.code === '42P01') {
          await createChatSession()
        }
        return
      }

      setChatSessions(data || [])

      if (data && data.length > 0) {
        const mostRecentSession = data[0]
        setSelectedSession(mostRecentSession.id)
        await loadSessionMessages(mostRecentSession.id)
      } else {
        // Create new session if no existing sessions
        await createChatSession()
      }
    } catch (error) {
      console.error("Error loading chat sessions:", error)
      // Fallback to creating new session
      await createChatSession()
    } finally {
      setIsLoadingSessions(false)
    }
  }

  const loadSessionMessages = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true })

      if (error) throw error

      const formattedMessages: Message[] = (data || []).map(msg => ({
        id: msg.id,
        content: msg.content,
        role: msg.role as "user" | "assistant",
        timestamp: new Date(msg.created_at)
      }))

      setMessages(formattedMessages)
      setSessionId(sessionId)
    } catch (error) {
      console.error("Error loading session messages:", error)
    }
  }

  const createChatSession = async () => {
    try {
      const { data, error } = await supabase
        .from("chat_sessions")
        .insert({
          user_id: userId,
          title: "New Legal Chat",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      
      setSessionId(data.id)
      setSelectedSession(data.id)
      setMessages([])
      
      // Refresh sessions list
      await loadChatSessions()
    } catch (error) {
      console.error("Error creating chat session:", error)
    }
  }

  const updateSessionTitle = async (sessionId: string, title: string) => {
    try {
      await supabase
        .from("chat_sessions")
        .update({ 
          title,
          updated_at: new Date().toISOString()
        })
        .eq("id", sessionId)
    } catch (error) {
      console.error("Error updating session title:", error)
    }
  }

  const saveMessage = async (content: string, role: "user" | "assistant") => {
    if (!sessionId) return
    try {
      await supabase.from("chat_messages").insert({
        session_id: sessionId,
        content,
        role,
        created_at: new Date().toISOString(),
      })

      // Update session timestamp
      await supabase
        .from("chat_sessions")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", sessionId)

      // Update session title based on first user message if it's a new session
      if (role === "user" && messages.length === 0) {
        const title = content.length > 30 ? content.substring(0, 30) + "..." : content
        await updateSessionTitle(sessionId, title)
      }
    } catch (error) {
      console.error("Error saving message:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    await saveMessage(userMessage.content, "user")
    setInput("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content, sessionId }),
      })
      if (!res.ok) {
        throw new Error(`Chat API error: ${res.status}`)
      }
      const responseText = await res.text()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseText,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      await saveMessage(responseText, "assistant")
    } catch (error) {
      console.error("Error in chat:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or refresh the page.`,
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="h-[600px] flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Nyaya.ai Legal Assistant</h3>
              <p className="text-sm text-gray-600">Ask me anything about Indian law</p>
            </div>
          </div>
          
          {/* Session Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSessionSelector(!showSessionSelector)}
            >
              <History className="w-4 h-4 mr-2" />
              {showSessionSelector ? "Hide History" : "Show History"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={createChatSession}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </div>
        </div>
      </div>

      {/* Session Selector */}
      {showSessionSelector && (
        <div className="p-4 border-b bg-gray-50 max-h-48 overflow-y-auto">
          <h4 className="font-medium mb-3">Chat History</h4>
          {isLoadingSessions ? (
            <div className="text-center py-4">
              <Loader2 className="w-4 h-4 animate-spin mx-auto" />
              <p className="text-sm text-gray-500">Loading sessions...</p>
            </div>
          ) : chatSessions.length > 0 ? (
            <div className="space-y-2">
              {chatSessions.map((session) => (
                <div
                  key={session.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedSession === session.id
                      ? "bg-green-100 border border-green-300"
                      : "bg-white border border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    setSelectedSession(session.id)
                    loadSessionMessages(session.id)
                    setShowSessionSelector(false)
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{session.title}</p>
                      <p className="text-xs text-gray-500">
                        {session.chat_messages?.length || 0} messages • {new Date(session.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    {selectedSession === session.id && (
                      <Check className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center">No chat history yet</p>
          )}
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <Bot className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Start a conversation about Indian law</p>
            <p className="text-sm">I can help with legal questions, document review, and more</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === "user"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.role === "assistant" && (
                  <Bot className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                {message.role === "user" && (
                  <User className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-green-500" />
                <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                <span className="text-sm text-gray-600">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Indian law, legal procedures, or rights..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Card>
  )
}

