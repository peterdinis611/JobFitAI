"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { useQuery } from "convex/react"
import { ArrowUpDown, BarChart3, GitCompare, Plus, Target, TrendingUp } from "lucide-react"
import { motion } from "motion/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { useJobFitUser } from "@/hooks/use-jobfit-user"
import {
  DashboardGettingStarted,
  DashboardNoFilterResults,
} from "@/components/dashboard/dashboard-states"
import { AnimatedProgress } from "@/components/ui/animated-progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/ui/page-header"
import { Skeleton } from "@/components/ui/skeleton"
import { StatCard } from "@/components/ui/stat-card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
        <DashboardGettingStarted hasResume={hasResume} />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Analysis history"
        description="Track how well your resume matches each job posting over time."
        action={
          <div className="flex flex-wrap gap-2">
            {compareIds.length === 2 ? (
              <Button asChild variant="secondary">
                <Link href={`/compare?a=${compareIds[0]}&b=${compareIds[1]}`}>
                  <GitCompare className="size-4" />
                  Compare selected
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

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total analyses" value={stats.count} icon={BarChart3} delay={0.05} />
        <StatCard label="Average match" value={`${stats.avg}%`} icon={Target} accent="success" delay={0.1} />
        <StatCard label="Best score" value={`${stats.best}%`} icon={TrendingUp} accent="warning" delay={0.15} />
      </div>

      <motion.div
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <div className="mac-segmented flex flex-wrap gap-0 p-0.5">
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
          <ArrowUpDown className="size-4" />
          Match {sortDesc ? "high → low" : "low → high"}
        </Button>
      </motion.div>

      {compareIds.length > 0 ? (
        <p className="text-sm text-muted-foreground">
          {compareIds.length === 1
            ? "Select one more analysis to compare"
            : "Two analyses selected — click Compare selected"}
        </p>
      ) : null}

      <Card className="overflow-hidden">
        <CardHeader className="border-b border-border/60 bg-muted/20">
          <CardTitle>Recent analyses</CardTitle>
          <CardDescription>
            {sorted.length} of {rows.length} shown · select two rows to compare
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {sorted.length === 0 && minMatch > 0 ? (
            <DashboardNoFilterResults minMatch={minMatch} onClear={() => setMinMatch(0)} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-10" />
                  <TableHead>Role</TableHead>
                  <TableHead>Match</TableHead>
                  <TableHead>Seniority</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map(({ analysis, jobPosting }, index) => {
                  const selected = compareIds.includes(analysis._id)
                  return (
                    <motion.tr
                      key={analysis._id}
                      className={cn(
                        "group border-b transition-colors hover:bg-muted/30",
                        selected && "bg-primary/5",
                      )}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.04 }}
                    >
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleCompare(analysis._id)}
                          className="size-4 rounded border-border accent-primary"
                          aria-label="Select for comparison"
                        />
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <p className="truncate font-medium">
                          {jobPosting?.title ?? "Untitled role"}
                        </p>
                        {jobPosting?.url ? (
                          <p className="truncate text-xs text-muted-foreground">{jobPosting.url}</p>
                        ) : null}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex min-w-[100px] flex-col gap-2">
                          <span
                            className={cn(
                              "text-lg font-semibold tabular-nums",
                              analysis.matchPercentage >= 85 && "text-success",
                              analysis.matchPercentage >= 70 &&
                                analysis.matchPercentage < 85 &&
                                "text-primary",
                              analysis.matchPercentage < 50 && "text-destructive",
                            )}
                          >
                            {analysis.matchPercentage}%
                          </span>
                          <AnimatedProgress value={analysis.matchPercentage} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{analysis.seniorityFit}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(analysis.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/analyses/${analysis._id}`}>View</Link>
                        </Button>
                      </TableCell>
                    </motion.tr>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-9 w-52" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-80 rounded-2xl" />
    </div>
  )
}
