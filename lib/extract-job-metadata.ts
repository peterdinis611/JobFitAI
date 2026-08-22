import { extractJobTitle, hostFromUrl } from "@/lib/extract-job-title"

export type JobMetadata = {
  title?: string
  company?: string
  location?: string
  salary?: string
}

const LABEL =
  /^(company|firma|spoločnosť|společnost|employer|organization|organisation|location|lokácia|lokalita|miesto|místo|salary|compensation|pay|mzda|plat|wage)\s*[:–-]\s*/i

function firstLabeled(lines: string[], keys: RegExp): string | undefined {
  for (const line of lines.slice(0, 24)) {
    if (!keys.test(line)) continue
    const value = line.replace(LABEL, "").trim()
    if (value.length >= 2 && value.length <= 120) return value
  }
  return undefined
}

function looksLikeCompany(value: string): boolean {
  if (value.length < 2 || value.length > 80) return false
  if (/^(we |our |about |join |the role)/i.test(value)) return false
  return /[A-Za-zÁÉÍÓÚÝŽČŠĎŤŇáéíóúýžčšďťň]/.test(value)
}

/** Heuristic company / location / salary from pasted or fetched job text. */
export function extractJobMetadata(text: string, url?: string): JobMetadata {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.replace(/^[\s\p{Emoji_Presentation}\p{Extended_Pictographic}•\-*]+/u, "").trim())
    .filter(Boolean)

  const title = extractJobTitle(text)
  const company =
    firstLabeled(
      lines,
      /^(company|firma|spoločnosť|společnost|employer|organization|organisation)\b/i,
    ) ??
    inferCompanyFromTitleLine(lines[0]) ??
    (url ? companyFromHost(url) : undefined)

  const location =
    firstLabeled(lines, /^(location|lokácia|lokalita|miesto|místo)\b/i) ?? inferLocation(text)

  const salary =
    firstLabeled(lines, /^(salary|compensation|pay|mzda|plat|wage)\b/i) ?? inferSalary(text)

  return {
    title,
    company: company && looksLikeCompany(company) ? company.slice(0, 80) : undefined,
    location: location?.slice(0, 80),
    salary: salary?.slice(0, 80),
  }
}

function inferCompanyFromTitleLine(firstLine?: string): string | undefined {
  if (!firstLine) return undefined
  const at = firstLine.match(/\s+(?:at|@|–|-)\s+([A-ZÁÉÍÓÚÝŽČŠĎŤŇ][\w&.\- ]{1,50})$/)
  const value = at?.[1]?.trim()
  return value && looksLikeCompany(value) ? value : undefined
}

function companyFromHost(url: string): string | undefined {
  const host = hostFromUrl(url)
  if (!host) return undefined
  const skip = /^(www|jobs|careers|boards|linkedin|indeed|glassdoor|com|org|net|io)$/i
  const root = host.split(".").find((part) => !skip.test(part))
  if (!root) return undefined
  return root.charAt(0).toUpperCase() + root.slice(1)
}

function inferLocation(text: string): string | undefined {
  const remote = text.match(/\b(remote|hybrid|on-?site|fully remote)\b/i)
  const city = text.match(
    /\b(Bratislava|Praha|Prague|Brno|Košice|Berlin|London|Warsaw|Vienna|Wien|Amsterdam|Munich|Zürich|Zurich|Paris|Madrid|Lisbon|Dublin)\b/,
  )
  if (remote && city) return `${city[1]} · ${capitalize(remote[1])}`
  if (city) return city[1]
  if (remote) return capitalize(remote[1])
  return undefined
}

function inferSalary(text: string): string | undefined {
  const labeled = text.match(
    /(?:salary|compensation|pay|mzda|plat)[:\s]+([€$£]?\s?\d[\d.,\s–-]*k?(?:\s?(?:\/|per)\s?(?:year|yr|month|mo|rok|mesiac))?)/i,
  )
  if (labeled?.[1]) return labeled[1].replace(/\s+/g, " ").trim()
  const compact = text.match(/[€$£]\s?\d[\d.,]*(?:\s?[-–]\s?[€$£]?\s?\d[\d.,]*)?(?:\s?k)?/i)
  return compact?.[0]?.replace(/\s+/g, " ").trim()
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
}

export function mergeJobMetadata(existing: JobMetadata, incoming: JobMetadata): JobMetadata {
  return {
    title: incoming.title || existing.title,
    company: incoming.company || existing.company,
    location: incoming.location || existing.location,
    salary: incoming.salary || existing.salary,
  }
}
