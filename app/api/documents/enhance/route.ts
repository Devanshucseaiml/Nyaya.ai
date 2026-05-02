import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { content, template_name, form_data } = await request.json()

    // Use Puter.js AI to enhance the document
    const puter = (global as any).puter
    if (!puter?.ai) {
      throw new Error("Puter.js not available on server side")
    }

    const prompt = `You are a legal document expert. Please review and enhance the following ${template_name} document:

${content}

Form data used: ${JSON.stringify(form_data, null, 2)}

Please:
1. Ensure all legal language is accurate and appropriate for Indian law
2. Check for any missing clauses that should be included
3. Improve the formatting and structure
4. Add any necessary legal disclaimers
5. Ensure compliance with Indian legal standards

Return only the enhanced document content, no additional commentary.`

    const reply = await puter.ai.chat(prompt)

    return NextResponse.json({ enhanced_content: reply.output_text })
  } catch (error) {
    console.error("Error enhancing document:", error)
    return NextResponse.json({ error: "Failed to enhance document" }, { status: 500 })
  }
}
