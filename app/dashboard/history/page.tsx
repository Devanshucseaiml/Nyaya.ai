import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import HistoryView from "@/components/history-view"

export default async function HistoryPage() {
  const supabase = await createServerClient()

  // Check if user is authenticated
  let user = null
  try {
    const { data: { user: userData } } = await supabase.auth.getUser()
    user = userData
  } catch (error) {
    console.error("Error getting user:", error)
    redirect("/auth/login")
  }

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch all AI chat sessions
  const { data: chatSessions } = await supabase
    .from("chat_sessions")
    .select(`
      *,
      chat_messages (
        id,
        content,
        role,
        created_at
      )
    `)
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })

  // Fetch all generated documents
  const { data: generatedDocuments } = await supabase
    .from("generated_documents")
    .select(`
      *,
      document_templates (
        id,
        title,
        category,
        slug
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  // Fetch all bookmarks
  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select(`
      *,
      kyr_articles (
        id,
        title,
        slug,
        category,
        summary
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background pt-20">
      <HistoryView 
        user={user}
        chatSessions={chatSessions || []}
        generatedDocuments={generatedDocuments || []}
        bookmarks={bookmarks || []}
      />
    </div>
  )
}
