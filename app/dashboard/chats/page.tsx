import { Suspense } from "react"
import { ChatHistory } from "@/components/chat-history"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function ChatsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Conversations</h1>
          <p className="text-lg text-gray-600">Manage your ongoing conversations with legal professionals.</p>
        </div>

        <Suspense
          fallback={
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          }
        >
          <ChatHistory user={user} />
        </Suspense>
      </div>
    </div>
  )
}
