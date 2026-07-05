/** Heuristic job title extraction from pasted posting text. */
export function extractJobTitle(text: string): string | undefined {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)

  if (lines.length === 0) return undefined

  const labeled = lines.find((l) =>
    /^(job title|role|position|title)\s*[:–-]\s*/i.test(l),
  )
  if (labeled) {
    const title = labeled.replace(/^(job title|role|position|title)\s*[:–-]\s*/i, "").trim()
    if (title.length >= 3 && title.length <= 120) return title
  }

  const first = lines[0]
  if (first.length >= 3 && first.length <= 80 && !first.endsWith(".")) {
    const lower = first.toLowerCase()
    const looksLikeTitle =
      /\b(engineer|developer|designer|manager|analyst|architect|lead|director|specialist|consultant|intern)\b/i.test(
        first,
      ) || /^[A-Z][a-zA-Z0-9 /&-]+$/.test(first)
    if (looksLikeTitle && !lower.startsWith("we are") && !lower.startsWith("about")) {
      return first
    }
  }

  return undefined
}

export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}
