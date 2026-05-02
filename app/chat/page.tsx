import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import ChatInterface from "@/components/chat-interface"

export default async function ChatPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Legal AI Assistant</h1>
            <p className="text-lg text-gray-600">
              Get instant legal guidance powered by AI. Ask questions about Indian law, rights, and procedures.
            </p>
          </div>

          <Suspense fallback={<div className="text-center">Loading chat...</div>}>
            <ChatInterface userId={user.id} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
