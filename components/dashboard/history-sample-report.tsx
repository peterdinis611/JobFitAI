"use client"

import { SAMPLE_REPORT_PREVIEW } from "@/lib/sample-job-posting"
import { cn } from "@/lib/utils"

export function HistorySampleReport({ className }: { className?: string }) {
  const sample = SAMPLE_REPORT_PREVIEW

  return (
    <article
      className={cn(
        "dash-onboard-sample relative overflow-hidden rounded-xl border border-dashed border-primary/35 bg-linear-to-br from-primary/8 via-card to-card p-4",
        className,
      )}
    >
      <span className="absolute top-3 right-3 font-[family-name:var(--font-auth-mono)] text-[9px] tracking-[0.22em] text-primary uppercase">
        Sample
      </span>

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1 pr-12">
          <p className="line-clamp-2 font-[family-name:var(--font-auth-display)] text-[15px] leading-snug font-semibold tracking-[-0.02em]">
            {sample.title}
          </p>
          <p className="truncate text-[11px] text-muted-foreground">{sample.company}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-2xl font-semibold tabular-nums tracking-tight text-success">
            {sample.matchPercentage}%
          </p>
          <div className="mt-1.5 h-1.5 w-16 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-success/80"
              style={{ width: `${sample.matchPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex rounded-md bg-success/15 px-1.5 py-0.5 text-[10px] font-medium text-success">
          {sample.seniorityLabel}
        </span>
        <span className="text-[11px] text-muted-foreground">{sample.gapCount} skill gaps</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {sample.matchingSkills.map((skill) => (
          <span
            key={skill}
            className="rounded-md border border-border/70 bg-muted/25 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
          >
            {skill}
          </span>
        ))}
      </div>
    </article>
  )
}
