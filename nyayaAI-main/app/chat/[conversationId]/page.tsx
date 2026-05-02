import { Suspense } from "react"
import { LawyerChatInterface } from "@/components/lawyer-chat-interface"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

interface ChatPageProps {
  params: {
    conversationId: string
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Verify user has access to this conversation
  const { data: conversation } = await supabase
    .from("chat_conversations")
    .select(`
      *,
      lawyers (
        id,
        full_name,
        profile_image,
        user_id
      )
    `)
    .eq("id", params.conversationId)
    .single()

  if (!conversation) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <Suspense
          fallback={
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          }
        >
          <LawyerChatInterface conversationId={params.conversationId} user={user} conversation={conversation} />
        </Suspense>
      </div>
    </div>
  )
}
