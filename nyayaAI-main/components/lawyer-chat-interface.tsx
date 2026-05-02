"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Send, Bot, User, Loader2, MessageCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Message {
  id: string
  content: string
  sender_id: string
  receiver_id: string
  timestamp: Date
}

interface LawyerChatInterfaceProps {
  userId: string
  lawyerId: string
}

export default function LawyerChatInterface({ userId, lawyerId }: LawyerChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isAiMode, setIsAiMode] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const saveMessage = async (content: string, senderId: string, receiverId: string) => {
    try {
      await supabase.from("chat_messages").insert({
        sender_id: senderId,
        receiver_id: receiverId,
        content,
        created_at: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Error saving message:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      sender_id: userId,
      receiver_id: lawyerId,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    await saveMessage(newMessage.content, userId, lawyerId)
    setInput("")
    setIsLoading(true)

    try {
      if (isAiMode) {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: newMessage.content }),
        })
        if (!res.ok) {
          throw new Error(`Chat API error: ${res.status}`)
        }
        const responseText = await res.text()

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: responseText,
          sender_id: "ai-lawyer",
          receiver_id: userId,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, aiMessage])
        await saveMessage(responseText, "ai-lawyer", userId)
      } else {
        // TODO: Implement real lawyer chat system with WebSocket / API
      }
    } catch (error) {
      console.error("Error in lawyer chat:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or refresh the page.`,
        sender_id: "ai-lawyer",
        receiver_id: userId,
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
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Legal Consultation</h3>
              <p className="text-sm text-gray-600">
                {isAiMode ? "AI Legal Assistant" : "Real Lawyer"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Mode:</span>
            <Button
              variant={isAiMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsAiMode(true)}
            >
              AI
            </Button>
            <Button
              variant={!isAiMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsAiMode(false)}
            >
              Lawyer
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Start your legal consultation</p>
            <p className="text-sm">
              {isAiMode
                ? "Ask the AI legal assistant for guidance"
                : "Connect with a real lawyer for personalized advice"}
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender_id === userId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.sender_id === userId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.sender_id !== userId && (
                  <Bot className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                {message.sender_id === userId && (
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
                <Bot className="w-5 h-5 text-blue-500" />
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
            placeholder={
              isAiMode
                ? "Ask the AI legal assistant..."
                : "Message your lawyer..."
            }
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Card>
  )
}

