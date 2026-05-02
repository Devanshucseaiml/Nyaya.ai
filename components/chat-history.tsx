"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { User, Bot } from "lucide-react"

interface ChatMessage {
  id: string
  content: string
  sender_id: string
  receiver_id: string
  created_at: string
}

interface ChatHistoryProps {
  userId: string
}

export default function ChatHistory({ userId }: ChatHistoryProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const supabase = createClient()

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("lawyer_messages")
        .select("*")
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order("created_at", { ascending: true })

      if (error) throw error

      if (data) setMessages(data as ChatMessage[])
    } catch (error) {
      console.error("Error fetching chat history:", error)
    }
  }

  return (
    <Card className="p-4 h-[600px] overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Chat History</h2>

      {messages.length === 0 ? (
        <p className="text-gray-500 text-center">No chat history found.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2 ${
                msg.sender_id === userId ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.sender_id === userId
                    ? "bg-green-500 text-white"
                    : msg.sender_id === "ai-lawyer"
                    ? "bg-purple-500 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {msg.sender_id === "ai-lawyer" ? (
                  <Bot className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>

              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.sender_id === userId
                    ? "bg-green-500 text-white"
                    : msg.sender_id === "ai-lawyer"
                    ? "bg-purple-100 text-purple-900"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    msg.sender_id === userId
                      ? "text-green-100"
                      : msg.sender_id === "ai-lawyer"
                      ? "text-purple-600"
                      : "text-gray-500"
                  }`}
                >
                  {new Date(msg.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
