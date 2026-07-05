"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { useQuery } from "convex/react"
import { ArrowUpDown, BarChart3, Target, TrendingUp } from "lucide-react"
import { motion } from "motion/react"
import { api } from "@/convex/_generated/api"
import type { Doc } from "@/convex/_generated/dataModel"
import { useJobFitUser } from "@/hooks/use-jobfit-user"
import { AnimatedProgress } from "@/components/ui/animated-progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { PageHeader } from "@/components/ui/page-header"
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

export default function DashboardPage() {
  const { userId, ready } = useJobFitUser()
  const analyses = useQuery(api.analyses.listByUser, userId ? { userId } : "skip")
  const [sortDesc, setSortDesc] = useState(true)
  const [minMatch, setMinMatch] = useState(0)

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

  if (!ready) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Analysis history"
        description="Track how well your resume matches each job posting over time."
        action={
          <Button asChild>
            <Link href="/analyze">New analysis</Link>
          </Button>
        }
      />

      {analyses && analyses.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Total analyses" value={stats.count} icon={BarChart3} delay={0.05} />
          <StatCard label="Average match" value={`${stats.avg}%`} icon={Target} accent="emerald" delay={0.1} />
          <StatCard label="Best score" value={`${stats.best}%`} icon={TrendingUp} accent="amber" delay={0.15} />
        </div>
      ) : null}

      <motion.div
        className="flex flex-wrap gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Button variant="outline" size="sm" onClick={() => setSortDesc((v) => !v)}>
          <ArrowUpDown className="size-4" />
          Sort by match {sortDesc ? "↓" : "↑"}
        </Button>
        {[0, 50, 70, 85].map((n) => (
          <Button
            key={n}
            variant={minMatch === n ? "default" : "outline"}
            size="sm"
            onClick={() => setMinMatch(n)}
          >
            {n === 0 ? "All" : `≥ ${n}%`}
          </Button>
        ))}
      </motion.div>

      <Card className="border-border/60 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Analyses</CardTitle>
          <CardDescription>
            {sorted.length} result{sorted.length === 1 ? "" : "s"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {analyses === undefined ? (
            <DashboardSkeleton />
          ) : sorted.length === 0 ? (
            <EmptyState
              lottieSrc="/lottie/empty-search.json"
              title="No analyses yet"
              description="Run your first resume vs job match to see scores, skill gaps, and recommendations here."
              actionLabel="Run your first match"
              actionHref="/analyze"
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Match</TableHead>
                  <TableHead>Seniority</TableHead>
                  <TableHead>Skills matched</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((row, index) => (
                  <motion.tr
                    key={row._id}
                    className="group border-b transition-colors hover:bg-muted/40"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.35,
                      delay: index * 0.05,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <TableCell>
                      <div className="flex min-w-[140px] flex-col gap-2">
                        <span
                          className={cn(
                            "font-semibold tabular-nums",
                            row.matchPercentage >= 85 && "text-emerald-600 dark:text-emerald-400",
                            row.matchPercentage >= 70 &&
                              row.matchPercentage < 85 &&
                              "text-violet-600 dark:text-violet-400",
                            row.matchPercentage < 50 && "text-rose-600 dark:text-rose-400",
                          )}
                        >
                          {row.matchPercentage}%
                        </span>
                        <AnimatedProgress value={row.matchPercentage} showGlow />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{row.seniorityFit}</Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">
                      {row.matchingSkills.slice(0, 4).join(", ")}
                      {row.matchingSkills.length > 4 ? "…" : ""}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(row.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button asChild variant="ghost" size="sm" className="opacity-70 group-hover:opacity-100">
                        <Link href={`/analyses/${row._id}`}>View</Link>
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
    <div className="animate-pulse space-y-6">
      <div className="h-10 w-56 rounded-lg bg-muted" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-muted" />
        ))}
      </div>
      <div className="h-64 rounded-xl bg-muted" />
    </div>
  )
}
