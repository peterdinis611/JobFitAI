"use client"

import { useMutation, useQuery } from "convex/react"
import { AlertTriangle, ArrowLeft, CheckCircle2, Lightbulb, Trash2 } from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts"
import { toast } from "sonner"
import { AnalysisActionsPanel } from "@/components/analyses/analysis-actions-panel"
import { RescoreDeltaBanner } from "@/components/analyses/artifact-views"
import { ExportReportButton } from "@/components/analyses/export-report-button"
import { FadeIn, StaggerItem, StaggerList } from "@/components/motion/motion-primitives"
import { AnimatedProgress, MatchScoreRing } from "@/components/ui/animated-progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MetricStrip } from "@/components/ui/metric-strip"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { matchBadgeClass, roleTitle, seniorityLabel } from "@/lib/role-label"
import { cn } from "@/lib/utils"

export default function AnalysisDetailPage() {
  const params = useParams()
  const router = useRouter()
  const analysisId = params.id as Id<"analyses">
  const data = useQuery(api.analyses.getWithRelations, { analysisId })
  const rescoreDelta = useQuery(api.analyses.getRescoreDelta, { analysisId })
  const removeAnalysis = useMutation(api.analyses.remove)

  if (data === undefined) {
    return (
      <div className="space-y-5">
        <div className="h-8 w-32 animate-pulse rounded bg-muted" />
        <div className="h-28 animate-pulse rounded-xl bg-muted" />
        <div className="grid gap-3 lg:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <p className="text-muted-foreground">
        Analysis not found.{" "}
        <Link href="/" className="text-primary hover:underline">
          Back to history
        </Link>
      </p>
    )
  }

  const { analysis, resume, jobPosting } = data
  const title = roleTitle(jobPosting, analysis)
  const seniority = seniorityLabel(analysis.seniorityFit)
  const chartData =
    analysis.skillCategories?.map((c: { name: string; score: number }) => ({
      category: c.name,
      score: c.score,
    })) ?? []

  async function handleDelete() {
    if (
      !window.confirm(
        `Permanently delete “${title}”? This also removes tracker cards and career tools for it.`,
      )
    ) {
      return
    }
    try {
      await removeAnalysis({ analysisId })
      toast.success("Analysis deleted")
      router.push("/")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete")
    }
  }

  return (
    <div className="space-y-5">
      <FadeIn>
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to history
        </Link>
      </FadeIn>

      <FadeIn delay={0.04}>
        <section className="mac-window overflow-hidden">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border bg-[var(--mac-titlebar)] px-4 py-3 sm:px-5">
            <div className="min-w-0 space-y-1">
              <h1 className="text-lg font-semibold tracking-tight sm:text-xl">{title}</h1>
              <p className="text-xs text-muted-foreground">
                {resume?.fileName ?? "Resume"} · {new Date(analysis.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <ExportReportButton analysis={analysis} resume={resume} jobPosting={jobPosting} />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => void handleDelete()}
              >
                <Trash2 className="size-3.5" />
                Delete
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-5 p-4 sm:flex-row sm:items-center sm:p-5">
            <MatchScoreRing
              value={analysis.matchPercentage}
              size={112}
              className="mx-auto sm:mx-0"
            />
            <div className="min-w-0 flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "inline-flex rounded-md px-2 py-0.5 text-xs font-medium tabular-nums",
                    matchBadgeClass(analysis.matchPercentage),
                  )}
                >
                  {analysis.matchPercentage}% match
                </span>
                <Badge variant="secondary">{seniority.label}</Badge>
              </div>
              <AnimatedProgress value={analysis.matchPercentage} className="h-2" />
              <MetricStrip
                className="border-0 bg-transparent p-0"
                items={[
                  {
                    label: "Matching",
                    value: String(analysis.matchingSkills.length),
                    tone: "success",
                  },
                  {
                    label: "Missing",
                    value: String(analysis.missingSkills.length),
                    tone: analysis.missingSkills.length > 0 ? "warning" : undefined,
                  },
                  {
                    label: "Flags",
                    value: String(analysis.redFlags.length),
                    tone: analysis.redFlags.length > 0 ? "destructive" : undefined,
                  },
                ]}
              />
            </div>
          </div>
        </section>
      </FadeIn>

      {rescoreDelta ? (
        <FadeIn delay={0.08}>
          <RescoreDeltaBanner delta={rescoreDelta} />
        </FadeIn>
      ) : null}

      <FadeIn delay={0.1}>
        <AnalysisActionsPanel data={{ analysis, resume, jobPosting }} />
      </FadeIn>

      <StaggerList className="grid gap-3 lg:grid-cols-2">
        {chartData.length > 0 ? (
          <StaggerItem>
            <section className="mac-window overflow-hidden">
              <div className="border-b border-border bg-[var(--mac-titlebar)] px-4 py-2.5">
                <h2 className="text-[13px] font-semibold">Skill categories</h2>
              </div>
              <div className="h-[260px] p-3">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={chartData}>
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis dataKey="category" tick={{ fontSize: 11 }} />
                    <Radar
                      dataKey="score"
                      stroke="var(--primary)"
                      fill="var(--primary)"
                      fillOpacity={0.35}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </StaggerItem>
        ) : null}

        <StaggerItem>
          <section className="mac-window overflow-hidden">
            <div className="border-b border-border bg-[var(--mac-titlebar)] px-4 py-2.5">
              <h2 className="flex items-center gap-1.5 text-[13px] font-semibold">
                <CheckCircle2 className="size-3.5 text-success" />
                Matching skills
              </h2>
            </div>
            <div className="flex flex-wrap gap-1.5 p-4">
              {analysis.matchingSkills.map((s: string, i: number) => (
                <motion.span
                  key={s}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 + i * 0.02 }}
                >
                  <Badge variant="secondary">{s}</Badge>
                </motion.span>
              ))}
            </div>
          </section>
        </StaggerItem>

        <StaggerItem>
          <section className="mac-window overflow-hidden">
            <div className="border-b border-border bg-[var(--mac-titlebar)] px-4 py-2.5">
              <h2 className="text-[13px] font-semibold">Missing skills</h2>
            </div>
            <div className="flex flex-wrap gap-1.5 p-4">
              {analysis.missingSkills.length === 0 ? (
                <p className="text-sm text-muted-foreground">None flagged</p>
              ) : (
                analysis.missingSkills.map((s: string, i: number) => (
                  <motion.span
                    key={s}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.18 + i * 0.02 }}
                  >
                    <Badge variant="outline">{s}</Badge>
                  </motion.span>
                ))
              )}
            </div>
          </section>
        </StaggerItem>

        {analysis.redFlags.length > 0 ? (
          <StaggerItem>
            <section className="mac-window overflow-hidden border-destructive/35">
              <div className="border-b border-destructive/25 bg-destructive/5 px-4 py-2.5">
                <h2 className="flex items-center gap-1.5 text-[13px] font-semibold text-destructive">
                  <AlertTriangle className="size-3.5" />
                  Red flags
                </h2>
              </div>
              <ul className="list-disc space-y-1.5 px-4 py-3 pl-8 text-sm">
                {analysis.redFlags.map((f: string) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </section>
          </StaggerItem>
        ) : null}

        <StaggerItem className="lg:col-span-2">
          <section className="mac-window overflow-hidden">
            <div className="border-b border-border bg-[var(--mac-titlebar)] px-4 py-2.5">
              <h2 className="flex items-center gap-1.5 text-[13px] font-semibold">
                <Lightbulb className="size-3.5 text-warning" />
                Recommendations
              </h2>
              <p className="text-[11px] text-muted-foreground">Actionable CV improvements</p>
            </div>
            <ol className="list-decimal space-y-2.5 px-4 py-4 pl-8 text-sm">
              {analysis.recommendations.map((r: string, i: number) => (
                <motion.li
                  key={r}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                >
                  {r}
                </motion.li>
              ))}
            </ol>
          </section>
        </StaggerItem>
      </StaggerList>
    </div>
  )
}
