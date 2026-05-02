import { GoogleGenerativeAI } from "@google/generative-ai"

const geminiApiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY

if (!geminiApiKey) {
  // Do not throw at import time in Next.js; defer errors to call sites
  // This allows build to succeed even if env is missing locally
}

let client: GoogleGenerativeAI | null = null

export function getGeminiClient(): GoogleGenerativeAI {
  if (!client) {
    if (!geminiApiKey) {
      throw new Error("Gemini API key not configured. Set GOOGLE_API_KEY in environment.")
    }
    client = new GoogleGenerativeAI(geminiApiKey)
  }
  return client
}

export async function generateGeminiText(prompt: string, options?: { model?: string }) {
  const modelName = options?.model || "gemini-1.5-flash"
  const client = getGeminiClient()
  const model = client.getGenerativeModel({ model: modelName })
  const result = await model.generateContent(prompt)
  const response = await result.response
  return response.text()
}


