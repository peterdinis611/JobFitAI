/** Heuristic job title extraction from pasted posting text. */
export function extractJobTitle(text: string): string | undefined {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.replace(/^[\s\p{Emoji_Presentation}\p{Extended_Pictographic}•\-*]+/u, "").trim())
    .filter(Boolean)

  if (lines.length === 0) return undefined

  const labeled = lines.find((l) =>
    /^(job title|role|position|title|pozice|název|pozícia)\s*[:–-]\s*/i.test(l),
  )
  if (labeled) {
    const title = labeled
      .replace(/^(job title|role|position|title|pozice|název|pozícia)\s*[:–-]\s*/i, "")
      .trim()
    if (title.length >= 3 && title.length <= 120) return title
  }

  const roleWord =
    /\b(engineer|developer|designer|manager|analyst|architect|lead|director|specialist|consultant|intern|vývojář|programátor|inženýr|vývojár)\b/i

  for (const line of lines.slice(0, 8)) {
    if (line.length < 3 || line.length > 90) continue
    if (line.endsWith(".") && line.length > 40) continue
    const lower = line.toLowerCase()
    if (
      lower.startsWith("we are") ||
      lower.startsWith("about") ||
      lower.startsWith("requirements") ||
      lower.startsWith("znalost") ||
      lower.startsWith("povinn") ||
      lower.startsWith("skills")
    ) {
      continue
    }
    if (roleWord.test(line) || /^[A-ZÁÉÍÓÚÝŽČŠĎŤŇ][\p{L}0-9 /&+()-]+$/u.test(line)) {
      return line
    }
  }

  return undefined
}

export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

/** Upgrade http→https and trim. Returns null if not a usable URL. */
export function normalizeJobUrl(raw: string): string | null {
  const trimmed = raw.trim()
  if (!trimmed) return null

  let candidate = trimmed
  if (/^http:\/\//i.test(candidate)) {
    candidate = `https://${candidate.slice("http://".length)}`
  }
  if (!/^https:\/\//i.test(candidate)) {
    if (/^[\w.-]+\.[a-z]{2,}([/:].*)?$/i.test(candidate)) {
      candidate = `https://${candidate}`
    } else {
      return null
    }
  }

  try {
    const url = new URL(candidate)
    if (url.protocol !== "https:") return null
    return url.toString()
  } catch {
    return null
  }
}

export function hostFromUrl(url: string): string | undefined {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return undefined
  }
}
