import sanitizeHtml from "sanitize-html"
import { Effect } from "effect"
import { FetchError } from "#lib/errors"
import { defaultRetry, networkTimeout } from "#lib/effect"

const ALLOWED_TAGS: string[] = []
const ALLOWED_ATTR: Record<string, string[]> = {}

export function fetchAndCleanJobPage(url: string): Effect.Effect<
  { title: string | undefined; cleanedText: string },
  FetchError
> {
  const attempt = Effect.tryPromise({
    try: async () => {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "JobFitAI/1.0 (resume-job matcher)",
          Accept: "text/html,application/xhtml+xml",
        },
        redirect: "follow",
      })

      if (!response.ok) {
        throw new FetchError({
          message: `HTTP ${response.status} fetching job posting`,
          status: response.status,
        })
      }

      const html = await response.text()
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
      const title = titleMatch?.[1]?.trim()

      const stripped = sanitizeHtml(html, {
        allowedTags: ALLOWED_TAGS,
        allowedAttributes: ALLOWED_ATTR,
        disallowedTagsMode: "discard",
      })

      const cleanedText = stripped
        .replace(/\s+/g, " ")
        .replace(/(.)\1{6,}/g, "$1")
        .trim()

      if (cleanedText.length < 80) {
        throw new FetchError({ message: "Job page content too short after sanitization" })
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
      Effect.fail(new FetchError({ message: "Job posting fetch timed out" })),
    ),
    Effect.retry(defaultRetry),
  )
}
