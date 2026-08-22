import { extractJobTitle, normalizeJobUrl } from "@/lib/extract-job-title"

export type BatchJobDraft = {
  id: string
  source: "text" | "url"
  raw: string
  title?: string
}

function newId(): string {
  return `job-${Math.random().toString(36).slice(2, 10)}`
}

/** Split a URL field into one HTTPS job per non-empty line. */
export function parseBatchUrls(raw: string): BatchJobDraft[] {
  const jobs: BatchJobDraft[] = []
  for (const line of raw.split(/\r?\n/)) {
    const url = normalizeJobUrl(line)
    if (url) jobs.push({ id: newId(), source: "url", raw: url })
  }
  return jobs
}

/** Split pasted text on `---` / `***` separators into multiple job drafts. */
export function parseBatchPastes(raw: string): BatchJobDraft[] {
  const chunks = raw
    .split(/^\s*(?:-{3,}|\*{3,})\s*$/m)
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length >= 20)

  if (chunks.length <= 1) {
    const trimmed = raw.trim()
    if (!trimmed) return []
    return [
      {
        id: newId(),
        source: "text",
        raw: trimmed,
        title: extractJobTitle(trimmed),
      },
    ]
  }

  return chunks.map((chunk) => ({
    id: newId(),
    source: "text" as const,
    raw: chunk,
    title: extractJobTitle(chunk),
  }))
}

export function draftLabel(job: BatchJobDraft): string {
  if (job.title?.trim()) return job.title.trim()
  if (job.source === "url") return job.raw.replace(/^https:\/\//, "").slice(0, 48)
  return extractJobTitle(job.raw) ?? `${job.raw.slice(0, 40).replace(/\s+/g, " ")}…`
}
