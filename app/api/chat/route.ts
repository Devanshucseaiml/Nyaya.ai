import { createClient } from "@/lib/supabase/server"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId } = await request.json()

    if (!message) {
      return new Response("Message is required", { status: 400 })
    }

    // Verify user authentication
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    // Get chat history for context
    let chatHistory = ""
    if (sessionId) {
      const { data: messages } = await supabase
        .from("chat_messages")
        .select("content, role")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true })
        .limit(10) // Last 10 messages for context

      if (messages) {
        chatHistory = messages.map((msg) => `${msg.role}: ${msg.content}`).join("\n")
      }
    }

    const systemPrompt = `You are Nyaya.ai, an expert AI legal assistant specializing in Indian law. Your role is to provide accurate, helpful legal information while being accessible to common people.

Key Guidelines:
- Focus on Indian legal system, constitution, and laws
- Provide practical, actionable advice
- Use simple language that non-lawyers can understand
- Always include relevant legal sections/acts when applicable
- Emphasize that this is general information, not personalized legal advice
- Suggest consulting a lawyer for complex matters
- Be empathetic and supportive, especially for vulnerable populations
- Cover areas like: consumer rights, labor law, family law, property law, criminal law, constitutional rights

Important Disclaimers:
- Always remind users this is general legal information
- Recommend consulting qualified lawyers for specific cases
- Don't provide advice on illegal activities
- Be culturally sensitive to Indian context

Previous conversation context:
${chatHistory}

Current user question: ${message}`

    // Use Puter.js AI for response
    const puter = (global as any).puter
    if (!puter?.ai) {
      throw new Error("Puter.js not available on server side")
    }

    const reply = await puter.ai.chat(systemPrompt)

    return new Response(reply.output_text, {
      headers: { "Content-Type": "text/plain" },
    })
  } catch (error) {
    console.error("Error in chat API:", error)
    return new Response("Failed to generate response", { status: 500 })
  }
}
