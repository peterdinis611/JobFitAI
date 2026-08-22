"use client"

import { useQuery } from "convex/react"
import { ArrowLeft, Minus, Plus } from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useMemo, useState } from "react"
import { MatchScoreRing } from "@/components/ui/animated-progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/ui/page-header"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"
import { matchBadgeClass, roleMeta, roleTitle, seniorityLabel } from "@/lib/role-label"
import { cn } from "@/lib/utils"

type AnalysisRow = {
  analysis: Doc<"analyses">
  resume: Doc<"resumes"> | null
  jobPosting: Doc<"jobPostings"> | null
}

function ComparePanel({ label, data }: { label: string; data: AnalysisRow | null | undefined }) {
  if (!data) {
    return (
      <div className="flex min-h-[280px] items-center justify-center rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
        Select an analysis
      </div>
    )
  }

  const { analysis, jobPosting, resume } = data
  const seniority = seniorityLabel(analysis.seniorityFit)

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <h3 className="text-[15px] font-semibold leading-snug tracking-tight">
          {roleTitle(jobPosting, analysis)}
        </h3>
        <p className="truncate text-[11px] text-muted-foreground">
          {[
            roleMeta(jobPosting),
            resume?.fileName ?? "Resume",
            new Date(analysis.createdAt).toLocaleDateString(),
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <MatchScoreRing value={analysis.matchPercentage} size={88} />
        <div className="space-y-1.5">
          <span
            className={cn(
              "inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium tabular-nums",
              matchBadgeClass(analysis.matchPercentage),
            )}
          >
            {analysis.matchPercentage}% match
          </span>
          <Badge variant="secondary" className="block w-fit">
            {seniority.label}
          </Badge>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div>
          <p className="mb-1.5 text-[12px] font-medium text-success">
            Matching ({analysis.matchingSkills.length})
          </p>
          <div className="flex flex-wrap gap-1">
            {analysis.matchingSkills.slice(0, 8).map((s) => (
              <Badge key={s} variant="secondary" className="text-[11px]">
                {s}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-[12px] font-medium text-muted-foreground">
            Missing ({analysis.missingSkills.length})
          </p>
          <div className="flex flex-wrap gap-1">
            {analysis.missingSkills.slice(0, 8).map((s) => (
              <Badge key={s} variant="outline" className="text-[11px]">
                {s}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <Button asChild variant="outline" size="sm" className="w-full">
        <Link href={`/analyses/${analysis._id}`}>Full report</Link>
      </Button>
    </div>
  )
}

export function CompareContent() {
  const searchParams = useSearchParams()
  const allRows = useQuery(api.analyses.listByUser, {})
  const [idA, setIdA] = useState(searchParams.get("a") ?? "")
  const [idB, setIdB] = useState(searchParams.get("b") ?? "")

  const dataA = useQuery(
    api.analyses.getWithRelations,
    idA ? { analysisId: idA as Id<"analyses"> } : "skip",
  )
  const dataB = useQuery(
    api.analyses.getWithRelations,
    idB ? { analysisId: idB as Id<"analyses"> } : "skip",
  )

  const delta = useMemo(() => {
    if (!dataA?.analysis || !dataB?.analysis) return null
    return dataB.analysis.matchPercentage - dataA.analysis.matchPercentage
  }, [dataA, dataB])

  const options = allRows ?? []

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to history
        </Link>
        <PageHeader
          title="Compare"
          description="Side-by-side match scores — pick two reports from History."
        />
      </div>

      <section className="mac-window overflow-hidden">
        <div className="space-y-3 border-b border-border bg-[var(--mac-titlebar)] px-4 py-3 sm:px-5">
          <div>
            <h2 className="text-[15px] font-semibold tracking-tight">Select reports</h2>
            <p className="text-xs text-muted-foreground">
              {options.length} available · choose A and B
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Select value={idA} onValueChange={setIdA}>
              <SelectTrigger className="mac-field">
                <SelectValue placeholder="Analysis A" />
              </SelectTrigger>
              <SelectContent>
                {options.map(({ analysis, jobPosting }) => (
                  <SelectItem key={analysis._id} value={analysis._id}>
                    {roleTitle(jobPosting, analysis)} — {analysis.matchPercentage}%
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={idB} onValueChange={setIdB}>
              <SelectTrigger className="mac-field">
                <SelectValue placeholder="Analysis B" />
              </SelectTrigger>
              <SelectContent>
                {options.map(({ analysis, jobPosting }) => (
                  <SelectItem key={analysis._id} value={analysis._id}>
                    {roleTitle(jobPosting, analysis)} — {analysis.matchPercentage}%
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4 p-4 sm:p-5">
          {delta !== null ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium",
                delta > 0 && "border-success/30 bg-success/10 text-success",
                delta < 0 && "border-destructive/30 bg-destructive/10 text-destructive",
                delta === 0 && "border-border bg-muted/30",
              )}
            >
              {delta > 0 ? (
                <Plus className="size-4" />
              ) : delta < 0 ? (
                <Minus className="size-4" />
              ) : null}
              {delta === 0
                ? "Same match score"
                : `${Math.abs(delta)} point${Math.abs(delta) === 1 ? "" : "s"} ${delta > 0 ? "higher" : "lower"} on B`}
            </motion.div>
          ) : null}

          {idA || idB ? (
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
              <ComparePanel label="A" data={idA ? dataA : null} />
              <ComparePanel label="B" data={idB ? dataB : null} />
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Pick two analyses above to compare
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
