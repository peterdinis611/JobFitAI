"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useQuery } from "convex/react"
import { ArrowLeft, Minus, Plus } from "lucide-react"
import { motion } from "motion/react"
import { useMemo, useState } from "react"
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"
import { MatchScoreRing } from "@/components/ui/animated-progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type AnalysisRow = {
  analysis: Doc<"analyses">
  resume: Doc<"resumes"> | null
  jobPosting: Doc<"jobPostings"> | null
}

function ComparePanel({ label, data }: { label: string; data: AnalysisRow | null | undefined }) {
  if (!data) return null
  const { analysis, jobPosting } = data

  return (
    <Card className="border-border/60">
      <CardHeader>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <CardTitle className="text-lg">{jobPosting?.title ?? "Untitled role"}</CardTitle>
        <div className="flex justify-center pt-2">
          <MatchScoreRing value={analysis.matchPercentage} size={100} />
        </div>
        <Badge variant="secondary" className="w-fit">
          Seniority: {analysis.seniorityFit}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div>
          <p className="mb-2 font-medium text-success">
            Matching ({analysis.matchingSkills.length})
          </p>
          <div className="flex flex-wrap gap-1">
            {analysis.matchingSkills.slice(0, 8).map((s) => (
              <Badge key={s} variant="secondary" className="text-xs">
                {s}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 font-medium">Missing ({analysis.missingSkills.length})</p>
          <div className="flex flex-wrap gap-1">
            {analysis.missingSkills.slice(0, 8).map((s) => (
              <Badge key={s} variant="outline" className="text-xs">
                {s}
              </Badge>
            ))}
          </div>
        </div>
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href={`/analyses/${analysis._id}`}>Full report</Link>
        </Button>
      </CardContent>
    </Card>
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
    <div className="space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to history
      </Link>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Compare analyses</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Side-by-side match scores for the same or different roles
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Select value={idA} onValueChange={setIdA}>
          <SelectTrigger>
            <SelectValue placeholder="Select first analysis" />
          </SelectTrigger>
          <SelectContent>
            {options.map(({ analysis, jobPosting }) => (
              <SelectItem key={analysis._id} value={analysis._id}>
                {jobPosting?.title ?? "Untitled"} — {analysis.matchPercentage}%
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={idB} onValueChange={setIdB}>
          <SelectTrigger>
            <SelectValue placeholder="Select second analysis" />
          </SelectTrigger>
          <SelectContent>
            {options.map(({ analysis, jobPosting }) => (
              <SelectItem key={analysis._id} value={analysis._id}>
                {jobPosting?.title ?? "Untitled"} — {analysis.matchPercentage}%
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {delta !== null ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium",
            delta > 0 && "border-success/30 bg-success/10 text-success",
            delta < 0 && "border-destructive/30 bg-destructive/10 text-destructive",
            delta === 0 && "border-border bg-muted/30",
          )}
        >
          {delta > 0 ? <Plus className="size-4" /> : delta < 0 ? <Minus className="size-4" /> : null}
          {delta === 0
            ? "Same match score"
            : `${Math.abs(delta)} point${Math.abs(delta) === 1 ? "" : "s"} ${delta > 0 ? "higher" : "lower"} on the right`}
        </motion.div>
      ) : null}

      {idA && idB ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <ComparePanel label="Analysis A" data={dataA} />
          <ComparePanel label="Analysis B" data={dataB} />
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Pick two analyses above to compare
          </CardContent>
        </Card>
      )}
    </div>
  )
}
