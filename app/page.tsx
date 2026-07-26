"use client"

import { useQuery } from "convex/react"
import {
  ArrowRight,
  ArrowUpDown,
  BarChart3,
  Briefcase,
  Check,
  GitCompare,
  Plus,
  Target,
  TrendingUp,
} from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link"
import { useMemo, useState } from "react"
import {
  DashboardEmptyHistory,
  DashboardGettingStarted,
  DashboardNoFilterResults,
} from "@/components/dashboard/dashboard-states"
import { AnimatedProgress } from "@/components/ui/animated-progress"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/ui/page-header"
import { Skeleton } from "@/components/ui/skeleton"
import { StatCard } from "@/components/ui/stat-card"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { useJobFitUser } from "@/hooks/use-jobfit-user"
import { matchBadgeClass, matchToneClass, roleTitle, seniorityLabel } from "@/lib/role-label"
import { cn } from "@/lib/utils"

const filters = [
  { label: "All", value: 0 },
  { label: "≥ 50%", value: 50 },
  { label: "≥ 70%", value: 70 },
  { label: "≥ 85%", value: 85 },
]

export default function DashboardPage() {
  const { ready } = useJobFitUser()
  const rows = useQuery(api.analyses.listByUser, ready ? {} : "skip")
  const resumes = useQuery(api.resumes.listByUser, ready ? {} : "skip")
  const [sortDesc, setSortDesc] = useState(true)
  const [minMatch, setMinMatch] = useState(0)
  const [compareIds, setCompareIds] = useState<Id<"analyses">[]>([])

  const hasResume = Boolean(resumes?.some((r) => r.isActive))
  const isEmpty = rows?.length === 0

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

  function toggleCompare(id: Id<"analyses">) {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 2) return [prev[1], id]
      return [...prev, id]
    })
  }

  if (!ready || rows === undefined) {
    return <DashboardSkeleton />
  }

  if (isEmpty) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Analysis history"
          description="Track how well your resume matches each job posting over time."
        />
        {hasResume ? <DashboardEmptyHistory /> : <DashboardGettingStarted hasResume={false} />}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analysis history"
        description="Your past match reports — filter, compare, and reopen anytime."
        action={
          <div className="flex flex-wrap gap-2">
            {compareIds.length === 2 ? (
              <Button asChild variant="secondary">
                <Link href={`/compare?a=${compareIds[0]}&b=${compareIds[1]}`}>
                  <GitCompare className="size-4" />
                  Compare
                </Link>
              </Button>
            ) : null}
            <Button asChild>
              <Link href="/analyze">
                <Plus className="size-4" />
                New analysis
              </Link>
            </Button>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Total analyses" value={stats.count} icon={BarChart3} delay={0.04} />
        <StatCard
          label="Average match"
          value={`${stats.avg}%`}
          icon={Target}
          accent="success"
          delay={0.08}
        />
        <StatCard
          label="Best score"
          value={`${stats.best}%`}
          icon={TrendingUp}
          accent="warning"
          delay={0.12}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="mac-segmented w-fit">
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
        <Button variant="outline" size="sm" onClick={() => setSortDesc((v) => !v)}>
          <ArrowUpDown className="size-3.5" />
          {sortDesc ? "Highest match" : "Lowest match"}
        </Button>
      </div>

      {compareIds.length > 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 text-sm">
          <p className="text-muted-foreground">
            {compareIds.length === 1
              ? "Select one more analysis to compare side by side."
              : "Two analyses selected — ready to compare."}
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => setCompareIds([])}>
              Clear
            </Button>
            {compareIds.length === 2 ? (
              <Button asChild size="sm">
                <Link href={`/compare?a=${compareIds[0]}&b=${compareIds[1]}`}>
                  <GitCompare className="size-3.5" />
                  Compare now
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}

      <section className="mac-window overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-border bg-[var(--mac-titlebar)] px-4 py-3 sm:px-5">
          <div>
            <h2 className="text-[15px] font-semibold tracking-tight">Recent analyses</h2>
            <p className="text-xs text-muted-foreground">
              {sorted.length} of {rows.length} shown
              {compareIds.length === 0 ? " · tap ✓ to pick two for compare" : null}
            </p>
          </div>
        </div>

        {sorted.length === 0 && minMatch > 0 ? (
          <DashboardNoFilterResults minMatch={minMatch} onClear={() => setMinMatch(0)} />
        ) : (
          <ul className="divide-y divide-border">
            {sorted.map(({ analysis, jobPosting, resume }, index) => {
              const selected = compareIds.includes(analysis._id)
              const title = roleTitle(jobPosting, analysis)
              const seniority = seniorityLabel(analysis.seniorityFit)
              const topSkills = analysis.matchingSkills.slice(0, 3)

              return (
                <motion.li
                  key={analysis._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(index, 8) * 0.03 }}
                  className={cn(
                    "group relative transition-colors hover:bg-muted/25",
                    selected && "bg-primary/5",
                  )}
                >
                  <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5 sm:px-5 sm:py-4">
                    <button
                      type="button"
                      onClick={() => toggleCompare(analysis._id)}
                      aria-pressed={selected}
                      aria-label={selected ? "Deselect for compare" : "Select for compare"}
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-lg border transition-colors",
                        selected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                      )}
                    >
                      {selected ? <Check className="size-3.5" strokeWidth={2.5} /> : null}
                    </button>

                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <Briefcase className="size-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            href={`/analyses/${analysis._id}`}
                            className="truncate text-[15px] font-semibold tracking-tight hover:text-primary"
                          >
                            {title}
                          </Link>
                          <span
                            className={cn(
                              "inline-flex rounded-md px-1.5 py-0.5 text-[11px] font-medium",
                              seniority.tone === "success" && "bg-success/15 text-success",
                              seniority.tone === "warning" && "bg-warning/15 text-warning",
                              seniority.tone === "primary" && "bg-primary/15 text-primary",
                            )}
                            title={seniority.hint}
                          >
                            {seniority.label}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-muted-foreground">
                          <span>
                            {new Date(analysis.createdAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          {resume?.fileName ? (
                            <>
                              <span aria-hidden>·</span>
                              <span className="max-w-[180px] truncate">{resume.fileName}</span>
                            </>
                          ) : null}
                        </div>
                        {topSkills.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5 pt-0.5">
                            {topSkills.map((skill) => (
                              <span
                                key={skill}
                                className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground"
                              >
                                {skill}
                              </span>
                            ))}
                            {analysis.matchingSkills.length > 3 ? (
                              <span className="rounded-md px-1.5 py-0.5 text-[11px] text-muted-foreground">
                                +{analysis.matchingSkills.length - 3}
                              </span>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 sm:w-[200px] sm:shrink-0">
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <div className="flex items-baseline justify-between gap-2">
                          <span
                            className={cn(
                              "text-xl font-semibold tabular-nums tracking-tight",
                              matchToneClass(analysis.matchPercentage),
                            )}
                          >
                            {analysis.matchPercentage}%
                          </span>
                          <span
                            className={cn(
                              "rounded-md px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                              matchBadgeClass(analysis.matchPercentage),
                            )}
                          >
                            match
                          </span>
                        </div>
                        <AnimatedProgress value={analysis.matchPercentage} />
                      </div>
                    </div>

                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full shrink-0 sm:w-auto"
                    >
                      <Link href={`/analyses/${analysis._id}`}>
                        Open
                        <ArrowRight className="size-3.5" />
                      </Link>
                    </Button>
                  </div>
                </motion.li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-9 w-52" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-80 rounded-2xl" />
    </div>
  )
}
