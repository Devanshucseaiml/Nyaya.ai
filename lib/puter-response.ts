export function extractPuterResponseText(reply: unknown): string {
  if (typeof reply === "string") return reply

  if (Array.isArray(reply)) {
    return reply.map(extractPuterResponseText).filter(Boolean).join("\n")
  }

  if (!reply || typeof reply !== "object") return ""

  const value = reply as Record<string, unknown>
  const candidates = [
    value.output_text,
    value.text,
    value.content,
    value.message,
    value.response,
    value.answer,
  ]

  for (const candidate of candidates) {
    const text = extractPuterResponseText(candidate)
    if (text) return text
  }

  const choices = value.choices
  if (Array.isArray(choices)) {
    for (const choice of choices) {
      const text = extractPuterResponseText(choice)
      if (text) return text
    }
  }

  return ""
}
