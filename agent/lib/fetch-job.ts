import { Effect } from "effect"
import sanitizeHtml from "sanitize-html"
import { defaultRetry, networkTimeout } from "#lib/effect"
import { FetchError } from "#lib/errors"

const ALLOWED_TAGS: string[] = []
const ALLOWED_ATTR: Record<string, string[]> = {}

const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"

const BLOCK_HINTS =
  /access denied|just a moment|cf-browser-verification|attention required|enable javascript|captcha|are you a robot|verify you are human|request blocked|forbidden|cloudflare|datadome|perimeterx|please sign in to view/i

function extractTitle(html: string): string | undefined {
  const og = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)
  if (og?.[1]?.trim()) return og[1].trim()
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  return titleMatch?.[1]?.replace(/\s+/g, " ").trim() || undefined
}

function extractJsonLdJobText(html: string): string | undefined {
  const scripts = [
    ...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi),
  ]
  const chunks: string[] = []

  for (const match of scripts) {
    const raw = match[1]?.trim()
    if (!raw) continue
    try {
      const parsed: unknown = JSON.parse(raw)
      const nodes = Array.isArray(parsed) ? parsed : [parsed]
      for (const node of nodes) {
        if (!node || typeof node !== "object") continue
        const obj = node as Record<string, unknown>
        const type = String(obj["@type"] ?? "")
        if (!/JobPosting/i.test(type)) continue
        const title = typeof obj.title === "string" ? obj.title : undefined
        const description = typeof obj.description === "string" ? obj.description : undefined
        if (title) chunks.push(title)
        if (description) {
          const cleaned = sanitizeHtml(description, {
            allowedTags: ALLOWED_TAGS,
            allowedAttributes: ALLOWED_ATTR,
          })
            .replace(/\s+/g, " ")
            .trim()
          if (cleaned) chunks.push(cleaned)
        }
      }
    } catch {
      /* ignore bad JSON-LD */
    }
  }

  const text = chunks.join("\n\n").trim()
  return text.length >= 80 ? text : undefined
}

function extractMetaDescription(html: string): string | undefined {
  const og = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i)
  if (og?.[1]?.trim() && og[1].trim().length >= 80) return og[1].trim()
  const meta = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)
  if (meta?.[1]?.trim() && meta[1].trim().length >= 80) return meta[1].trim()
  return undefined
}

function stripHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTR,
    disallowedTagsMode: "discard",
  })
    .replace(/\s+/g, " ")
    .replace(/(.)\1{6,}/g, "$1")
    .trim()
}

function looksBlocked(html: string, cleaned: string): boolean {
  if (BLOCK_HINTS.test(html.slice(0, 12_000))) return true
  if (cleaned.length < 120 && BLOCK_HINTS.test(cleaned)) return true
  return false
}

export function fetchAndCleanJobPage(
  url: string,
): Effect.Effect<{ title: string | undefined; cleanedText: string }, FetchError> {
  const attempt = Effect.tryPromise({
    try: async () => {
      const response = await fetch(url, {
        headers: {
          "User-Agent": BROWSER_UA,
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          "Cache-Control": "no-cache",
        },
        redirect: "follow",
      })

      if (!response.ok) {
        const blocked =
          response.status === 403 || response.status === 401 || response.status === 429
        throw new FetchError({
          message: blocked
            ? `Job board blocked the fetch (HTTP ${response.status}). Paste the posting text instead.`
            : `HTTP ${response.status} fetching job posting`,
          status: response.status,
        })
      }

      const html = await response.text()
      const title = extractTitle(html)

      const candidates = [
        extractJsonLdJobText(html),
        extractMetaDescription(html),
        stripHtml(html),
      ].filter((t): t is string => Boolean(t && t.length >= 80))

      const cleanedText = candidates.sort((a, b) => b.length - a.length)[0] ?? ""

      if (looksBlocked(html, cleanedText) || cleanedText.length < 80) {
        throw new FetchError({
          message:
            "Could not read this job page (likely bot-protected). Paste the posting text instead.",
          status: response.status,
        })
      }

      return { title, cleanedText }
    },
    catch: (error) =>
      error instanceof FetchError
        ? error
        : new FetchError({
            message: error instanceof Error ? error.message : "Failed to fetch job posting",
          }),
  })

  return attempt.pipe(
    Effect.timeout(networkTimeout),
    Effect.catchTag("TimeoutException", () =>
      Effect.fail(
        new FetchError({
          message: "Job posting fetch timed out. Paste the posting text instead.",
        }),
      ),
    ),
    Effect.retry(defaultRetry),
  )
}
