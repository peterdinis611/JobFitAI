"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { useQuery } from "convex/react"
import { ArrowUpDown, BarChart3, Plus, Target, TrendingUp } from "lucide-react"
import { motion } from "motion/react"
import { api } from "@/convex/_generated/api"
import type { Doc } from "@/convex/_generated/dataModel"
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
  const analyses = useQuery(api.analyses.listByUser, ready ? {} : "skip")
  const resumes = useQuery(api.resumes.listByUser, ready ? {} : "skip")
  const [sortDesc, setSortDesc] = useState(true)
  const [minMatch, setMinMatch] = useState(0)

  const hasResume = Boolean(resumes?.some((r) => r.isActive))
  const isEmpty = analyses?.length === 0

  const sorted = useMemo(() => {
    if (!analyses) return []
    const filtered = analyses.filter((a: Doc<"analyses">) => a.matchPercentage >= minMatch)
    return [...filtered].sort((a, b) =>
      sortDesc ? b.matchPercentage - a.matchPercentage : a.matchPercentage - b.matchPercentage,
    )
  }, [analyses, sortDesc, minMatch])

  const stats = useMemo(() => {
    if (!analyses?.length) return { avg: 0, best: 0, count: 0 }
    const avg = Math.round(
      analyses.reduce((sum: number, a: Doc<"analyses">) => sum + a.matchPercentage, 0) /
        analyses.length,
    )
    const best = Math.max(...analyses.map((a: Doc<"analyses">) => a.matchPercentage))
    return { avg, best, count: analyses.length }
  }, [analyses])

  if (!ready || analyses === undefined) {
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
          <Button asChild>
            <Link href="/analyze">
              <Plus className="size-4" />
              New analysis
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total analyses" value={stats.count} icon={BarChart3} delay={0.05} />
        <StatCard label="Average match" value={`${stats.avg}%`} icon={Target} accent="emerald" delay={0.1} />
        <StatCard label="Best score" value={`${stats.best}%`} icon={TrendingUp} accent="amber" delay={0.15} />
      </div>

      <motion.div
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <div className="flex flex-wrap gap-1.5 rounded-xl border border-border bg-muted/30 p-1">
          {filters.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              onClick={() => setMinMatch(value)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
                minMatch === value
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
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

      <Card className="overflow-hidden border-border/60 bg-card/80 backdrop-blur-sm">
        <CardHeader className="border-b border-border/60 bg-muted/20">
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Recent analyses</CardTitle>
              <CardDescription>
                {sorted.length} of {analyses.length} shown
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {sorted.length === 0 && minMatch > 0 ? (
            <DashboardNoFilterResults minMatch={minMatch} onClear={() => setMinMatch(0)} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Match</TableHead>
                  <TableHead>Seniority</TableHead>
                  <TableHead>Skills matched</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((row, index) => (
                  <motion.tr
                    key={row._id}
                    className="group border-b transition-colors hover:bg-muted/30"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.04,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <TableCell className="py-4">
                      <div className="flex min-w-[140px] flex-col gap-2">
                        <span
                          className={cn(
                            "text-lg font-semibold tabular-nums",
                            row.matchPercentage >= 85 && "text-success",
                            row.matchPercentage >= 70 &&
                              row.matchPercentage < 85 &&
                              "text-primary",
                            row.matchPercentage < 50 && "text-destructive",
                          )}
                        >
                          {row.matchPercentage}%
                        </span>
                        <AnimatedProgress value={row.matchPercentage} showGlow />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn(
                          row.seniorityFit === "match" && "bg-success/15 text-success",
                          row.seniorityFit === "under" && "bg-warning/15 text-warning",
                          row.seniorityFit === "over" && "bg-primary/15 text-primary",
                        )}
                      >
                        {row.seniorityFit}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[220px]">
                      <p className="truncate text-sm text-muted-foreground">
                        {row.matchingSkills.slice(0, 4).join(", ")}
                        {row.matchingSkills.length > 4 ? ` +${row.matchingSkills.length - 4}` : ""}
                      </p>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(row.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="opacity-60 group-hover:opacity-100"
                      >
                        <Link href={`/analyses/${row._id}`}>View report</Link>
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
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
