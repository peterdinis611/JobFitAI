import type { Doc } from "@/convex/_generated/dataModel"

export function roleTitle(
  job: Doc<"jobPostings"> | null | undefined,
  analysis?: Pick<Doc<"analyses">, "matchingSkills"> | null,
) {
  const titled = job?.title?.trim()
  if (titled) return titled

  if (job?.url) {
    try {
      const host = new URL(job.url).hostname.replace(/^www\./, "")
      return `Role at ${host}`
    } catch {
      /* ignore */
    }
  }

  const snippet = job?.cleanedText
    ?.split(/\r?\n/)
    .map((l) => l.replace(/^[\s•\-*🚀]+/u, "").trim())
    .find(
      (l) =>
        l.length >= 8 &&
        l.length <= 80 &&
        !/^(requirements|povinn|znalost|skills|we are|about)/i.test(l),
    )

  if (snippet) return snippet

  const skills = analysis?.matchingSkills?.slice(0, 2).join(" · ")
  if (skills) return `${skills} role`

  return "Untitled role"
}

export function roleMeta(job: Doc<"jobPostings"> | null | undefined): string | undefined {
  const parts = [job?.company?.trim(), job?.location?.trim(), job?.salary?.trim()].filter(Boolean)
  return parts.length > 0 ? parts.join(" · ") : undefined
}

export function seniorityLabel(fit: "under" | "match" | "over") {
  switch (fit) {
    case "under":
      return { label: "Below target", hint: "Junior vs role level", tone: "warning" as const }
    case "over":
      return { label: "Above target", hint: "More senior than needed", tone: "primary" as const }
    default:
      return { label: "Right level", hint: "Seniority aligns", tone: "success" as const }
  }
}

export function matchToneClass(pct: number) {
  if (pct >= 85) return "text-success"
  if (pct >= 70) return "text-primary"
  if (pct >= 50) return "text-warning"
  return "text-destructive"
}

export function matchBadgeClass(pct: number) {
  if (pct >= 85) return "bg-success/15 text-success"
  if (pct >= 70) return "bg-primary/15 text-primary"
  if (pct >= 50) return "bg-warning/15 text-warning"
  return "bg-destructive/15 text-destructive"
}
