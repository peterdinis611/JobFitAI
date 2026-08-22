"use client"

import { MetricStrip } from "@/components/ui/metric-strip"
import type { Doc } from "@/convex/_generated/dataModel"

function formatShortDate(ts: number) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(ts))
}

export function computeLastActivityAt(resumes: Doc<"resumes">[] | undefined) {
  if (!resumes?.length) return null
  return Math.max(...resumes.map((r) => r.createdAt))
}

export function HistoryEmptyMetrics({
  analysisCount,
  hasResume,
  activeResumeName,
  resumes,
}: {
  analysisCount: number
  hasResume: boolean
  activeResumeName?: string
  resumes?: Doc<"resumes">[]
}) {
  const lastActivityAt = computeLastActivityAt(resumes)
  const resumeCount = resumes?.length ?? 0

  return (
    <MetricStrip
      items={[
        {
          label: "Analyses",
          value: String(analysisCount),
          tone: analysisCount > 0 ? "primary" : undefined,
        },
        {
          label: "Resume",
          value: hasResume
            ? activeResumeName
              ? "Ready"
              : "Uploaded"
            : resumeCount > 0
              ? "None active"
              : "Missing",
          tone: hasResume ? "success" : resumeCount > 0 ? "warning" : "destructive",
        },
        {
          label: "Last activity",
          value: lastActivityAt ? formatShortDate(lastActivityAt) : "—",
        },
      ]}
    />
  )
}
