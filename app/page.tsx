"use client"

import { useMutation, useQuery } from "convex/react"
import {
  Archive,
  ArchiveRestore,
  ArrowRight,
  ArrowUpDown,
  Briefcase,
  Check,
  GitCompare,
  MoreHorizontal,
  Plus,
  Trash2,
} from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import {
  DashboardEmptyHistory,
  DashboardGettingStarted,
  DashboardNoFilterResults,
} from "@/components/dashboard/dashboard-states"
import { HistoryInsightsPanel } from "@/components/dashboard/history-insights"
import { AnimatedProgress } from "@/components/ui/animated-progress"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MetricStrip } from "@/components/ui/metric-strip"
import { PageHeader } from "@/components/ui/page-header"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"
import { useJobFitUser } from "@/hooks/use-jobfit-user"
import { computeHistoryInsights } from "@/lib/history-insights"
import { matchToneClass, roleTitle, seniorityLabel } from "@/lib/role-label"
import { cn } from "@/lib/utils"

const filters = [
  { label: "All", value: 0 },
  { label: "≥ 50%", value: 50 },
  { label: "≥ 70%", value: 70 },
  { label: "≥ 85%", value: 85 },
]

type Row = {
  analysis: Doc<"analyses">
  resume: Doc<"resumes"> | null
  jobPosting: Doc<"jobPostings"> | null
}

export default function DashboardPage() {
  const { ready } = useJobFitUser()
  const [includeArchived, setIncludeArchived] = useState(false)
  const rows = useQuery(api.analyses.listByUser, ready ? { includeArchived } : "skip")
  const resumes = useQuery(api.resumes.listByUser, ready ? {} : "skip")
  const setArchived = useMutation(api.analyses.setArchived)
  const removeAnalysis = useMutation(api.analyses.remove)
  const [sortDesc, setSortDesc] = useState(true)
  const [minMatch, setMinMatch] = useState(0)
  const [compareIds, setCompareIds] = useState<Id<"analyses">[]>([])

  const hasResume = Boolean(resumes?.some((r) => r.isActive))
  const isEmpty = rows?.length === 0 && !includeArchived

  const sorted = useMemo(() => {
    if (!rows) return []
    const filtered = rows.filter(({ analysis }) => analysis.matchPercentage >= minMatch)
    return [...filtered].sort((a, b) =>
      sortDesc
        ? b.analysis.matchPercentage - a.analysis.matchPercentage
        : a.analysis.matchPercentage - b.analysis.matchPercentage,
    )
  }, [rows, sortDesc, minMatch])

  const stats = useMemo(() => {
    if (!rows?.length) return { avg: 0, best: 0, count: 0 }
    const avg = Math.round(
      rows.reduce((sum, { analysis }) => sum + analysis.matchPercentage, 0) / rows.length,
    )
    const best = Math.max(...rows.map(({ analysis }) => analysis.matchPercentage))
    return { avg, best, count: rows.length }
  }, [rows])

  const insights = useMemo(
    () =>
      computeHistoryInsights(
        (rows ?? []).map(({ analysis }) => ({
          createdAt: analysis.createdAt,
          matchPercentage: analysis.matchPercentage,
          missingSkills: analysis.missingSkills,
          archivedAt: analysis.archivedAt,
        })),
      ),
    [rows],
  )

  function toggleCompare(id: Id<"analyses">) {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 2) return [prev[1], id]
      return [...prev, id]
    })
  }

  async function archiveAnalysis(id: Id<"analyses">, archived: boolean) {
    try {
      await setArchived({ analysisId: id, archived })
      setCompareIds((prev) => prev.filter((x) => x !== id))
      toast.success(archived ? "Archived" : "Restored")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update")
    }
  }

  async function deleteAnalysis(id: Id<"analyses">, title: string) {
    if (
      !window.confirm(
        `Permanently delete “${title}”? This also removes tracker cards and career tools for it.`,
      )
    ) {
      return
    }
    try {
      await removeAnalysis({ analysisId: id })
      setCompareIds((prev) => prev.filter((x) => x !== id))
      toast.success("Analysis deleted")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete")
    }
  }

  async function deleteSelected() {
    if (compareIds.length === 0) return
    const count = compareIds.length
    if (
      !window.confirm(
        `Permanently delete ${count} selected ${count === 1 ? "analysis" : "analyses"}? This also removes tracker cards and career tools.`,
      )
    ) {
      return
    }
    try {
      for (const id of compareIds) {
        await removeAnalysis({ analysisId: id })
      }
      setCompareIds([])
      toast.success(count === 1 ? "Analysis deleted" : `${count} analyses deleted`)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete")
    }
  }

  if (!ready || rows === undefined) {
    return <DashboardSkeleton />
  }

  if (isEmpty) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="History"
          description="Track how well your resume matches each job posting over time."
        />
        {hasResume ? <DashboardEmptyHistory /> : <DashboardGettingStarted hasResume={false} />}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="History"
        description="Past match reports — filter, compare, reopen."
        action={
          <Button asChild>
            <Link href="/analyze">
              <Plus className="size-4" />
              New analysis
            </Link>
          </Button>
        }
      />

      <MetricStrip
        items={[
          { label: "Analyses", value: String(stats.count) },
          { label: "Average", value: `${stats.avg}%`, tone: "success" },
          { label: "Best", value: `${stats.best}%`, tone: "warning" },
        ]}
      />

      <HistoryInsightsPanel insights={insights} />

      {compareIds.length > 0 ? (
        <div className="sticky top-[60px] z-20 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/30 bg-background/95 px-4 py-3 text-sm shadow-sm backdrop-blur supports-backdrop-filter:bg-background/80">
          <p className="font-medium">
            {compareIds.length}/2 selected
            <span className="ml-2 font-normal text-muted-foreground">
              {compareIds.length === 1 ? "Pick one more to compare" : "Ready to compare or delete"}
            </span>
          </p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="ghost" onClick={() => setCompareIds([])}>
              Clear
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => void deleteSelected()}
            >
              <Trash2 className="size-3.5" />
              Delete
            </Button>
            {compareIds.length === 2 ? (
              <Button asChild size="sm">
                <Link href={`/compare?a=${compareIds[0]}&b=${compareIds[1]}`}>
                  <GitCompare className="size-3.5" />
                  Compare
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}

      <section className="mac-window overflow-hidden">
        {/* Toolbar lives with the list — one composition */}
        <div className="space-y-3 border-b border-border bg-[var(--mac-titlebar)] px-4 py-3 sm:px-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-[15px] font-semibold tracking-tight">Reports</h2>
              <p className="text-xs text-muted-foreground">
                {sorted.length} shown
                {minMatch > 0 || includeArchived ? ` · of ${rows.length}` : null}
                {compareIds.length === 0 ? " · select up to two to compare" : null}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setSortDesc((v) => !v)}>
                <ArrowUpDown className="size-3.5" />
                {sortDesc ? "High → low" : "Low → high"}
              </Button>
              <Button
                variant={includeArchived ? "secondary" : "outline"}
                size="sm"
                onClick={() => setIncludeArchived((v) => !v)}
              >
                <Archive className="size-3.5" />
                {includeArchived ? "Hide archived" : "Archived"}
              </Button>
            </div>
          </div>
          <div className="mac-segmented w-fit max-w-full overflow-x-auto">
            {filters.map(({ label, value }) => (
              <button
                key={value}
                type="button"
                onClick={() => setMinMatch(value)}
                className={cn(
                  "mac-segmented-item",
                  minMatch === value && "mac-segmented-item-active",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {sorted.length === 0 && minMatch > 0 ? (
          <DashboardNoFilterResults minMatch={minMatch} onClear={() => setMinMatch(0)} />
        ) : (
          <ul className="grid gap-3 p-3 sm:grid-cols-2 sm:p-4 lg:grid-cols-2 xl:grid-cols-3">
            {sorted.map(({ analysis, jobPosting, resume }, index) => (
              <AnalysisCard
                key={analysis._id}
                row={{ analysis, jobPosting, resume }}
                selected={compareIds.includes(analysis._id)}
                index={index}
                onToggleSelect={() => toggleCompare(analysis._id)}
                onArchive={(archived) => void archiveAnalysis(analysis._id, archived)}
                onDelete={(title) => void deleteAnalysis(analysis._id, title)}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function AnalysisCard({
  row,
  selected,
  index,
  onToggleSelect,
  onArchive,
  onDelete,
}: {
  row: Row
  selected: boolean
  index: number
  onToggleSelect: () => void
  onArchive: (archived: boolean) => void
  onDelete: (title: string) => void
}) {
  const { analysis, jobPosting, resume } = row
  const title = roleTitle(jobPosting, analysis)
  const seniority = seniorityLabel(analysis.seniorityFit)
  const topSkills = analysis.matchingSkills.slice(0, 3)

  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: Math.min(index, 8) * 0.03 }}
      className={cn(
        "group flex list-none flex-col rounded-xl border bg-card p-4 transition-[border-color,box-shadow]",
        selected
          ? "border-primary/50 shadow-[0_0_0_1px] shadow-primary/20"
          : "border-border hover:border-border/80 hover:shadow-sm",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <button
          type="button"
          onClick={onToggleSelect}
          aria-pressed={selected}
          aria-label={selected ? "Deselect" : "Select for compare"}
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-md border transition-colors",
            selected
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background text-muted-foreground hover:border-primary/40",
          )}
        >
          {selected ? <Check className="size-3.5" strokeWidth={2.5} /> : null}
        </button>

        <div className="min-w-0 flex-1 text-right">
          <p
            className={cn(
              "text-2xl font-semibold tabular-nums tracking-tight",
              matchToneClass(analysis.matchPercentage),
            )}
          >
            {analysis.matchPercentage}%
          </p>
          <AnimatedProgress value={analysis.matchPercentage} className="mt-1.5 h-1.5" />
        </div>
      </div>

      <div className="mt-4 flex min-w-0 items-start gap-2.5">
        <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Briefcase className="size-3.5 text-primary" />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <Link
            href={`/analyses/${analysis._id}`}
            className="line-clamp-2 text-[14px] font-semibold leading-snug tracking-tight hover:text-primary"
          >
            {title}
          </Link>
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={cn(
                "inline-flex rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                seniority.tone === "success" && "bg-success/15 text-success",
                seniority.tone === "warning" && "bg-warning/15 text-warning",
                seniority.tone === "primary" && "bg-primary/15 text-primary",
              )}
              title={seniority.hint}
            >
              {seniority.label}
            </span>
            {analysis.archivedAt ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                <Archive className="size-2.5" />
                Archived
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <p className="mt-3 truncate text-[11px] text-muted-foreground">
        {new Date(analysis.createdAt).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
        {resume?.fileName ? ` · ${resume.fileName}` : null}
      </p>

      {topSkills.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1">
          {topSkills.map((skill) => (
            <span
              key={skill}
              className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
            >
              {skill}
            </span>
          ))}
          {analysis.matchingSkills.length > 3 ? (
            <span className="rounded-md px-1.5 py-0.5 text-[10px] text-muted-foreground">
              +{analysis.matchingSkills.length - 3}
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="mt-auto flex items-center gap-2 border-t border-border/60 pt-3">
        <Button asChild variant="secondary" size="sm" className="h-8 flex-1">
          <Link href={`/analyses/${analysis._id}`}>
            Open
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="size-8 shrink-0 px-0"
              aria-label="More actions"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {analysis.archivedAt ? (
              <DropdownMenuItem onClick={() => onArchive(false)}>
                <ArchiveRestore className="size-4" />
                Restore
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => onArchive(true)}>
                <Archive className="size-4" />
                Archive
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => onDelete(title)}>
              <Trash2 className="size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.li>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <Skeleton className="h-12 rounded-xl" />
      <Skeleton className="h-96 rounded-2xl" />
    </div>
  )
}
