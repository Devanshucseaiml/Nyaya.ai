import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { lawyerId } = await request.json()

    if (!lawyerId) {
      return NextResponse.json({ error: "Lawyer ID is required" }, { status: 400 })
    }

    console.log("[v0] Starting chat between user:", user.id, "and lawyer:", lawyerId)

    // Check if conversation already exists
    const { data: existingConversation } = await supabase
      .from("chat_conversations")
      .select("id")
      .eq("user_id", user.id)
      .eq("lawyer_id", lawyerId)
      .single()

    if (existingConversation) {
      console.log("[v0] Existing conversation found:", existingConversation.id)
      return NextResponse.json({ conversationId: existingConversation.id })
    }

    // Create new conversation
    const { data: newConversation, error } = await supabase
      .from("chat_conversations")
      .insert([
        {
          user_id: user.id,
          lawyer_id: lawyerId,
          status: "active",
        },
      ])
      .select("id")
      .single()

    if (error) {
      console.log("[v0] Error creating conversation:", error.message)
      return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 })
    }

    console.log("[v0] New conversation created:", newConversation.id)

    // Send initial system message
    await supabase.from("chat_messages").insert([
      {
        conversation_id: newConversation.id,
        sender_id: user.id,
        sender_type: "user",
        message_text: "Hello! I would like to discuss my legal matter with you.",
        message_type: "text",
      },
    ])

    return NextResponse.json({ conversationId: newConversation.id })
  } catch (error) {
    console.log("[v0] Error in start chat API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
