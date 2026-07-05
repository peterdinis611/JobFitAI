"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useQuery } from "convex/react"
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts"
import { AlertTriangle, ArrowLeft, CheckCircle2, Lightbulb } from "lucide-react"
import { motion } from "motion/react"
import { api } from "@/convex/_generated/api"
import { AnimatedProgress, MatchScoreRing } from "@/components/ui/animated-progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FadeIn, StaggerItem, StaggerList } from "@/components/motion/motion-primitives"
import type { Id } from "@/convex/_generated/dataModel"

export default function AnalysisDetailPage() {
  const params = useParams()
  const analysisId = params.id as Id<"analyses">
  const data = useQuery(api.analyses.getWithRelations, { analysisId })

  if (data === undefined) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-32 animate-pulse rounded bg-muted" />
        <div className="flex gap-8">
          <div className="size-32 animate-pulse rounded-full bg-muted" />
          <div className="flex-1 space-y-3">
            <div className="h-8 w-64 animate-pulse rounded bg-muted" />
            <div className="h-4 w-48 animate-pulse rounded bg-muted" />
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-xl bg-muted" />
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
  const chartData =
    analysis.skillCategories?.map((c: { name: string; score: number }) => ({
      category: c.name,
      score: c.score,
    })) ?? []

  return (
    <div className="space-y-8">
      <FadeIn>
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to history
        </Link>
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {jobPosting?.title ?? "Job match analysis"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {resume?.fileName} · {new Date(analysis.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <MatchScoreRing value={analysis.matchPercentage} size={128} />
            <Badge variant="secondary">Seniority: {analysis.seniorityFit}</Badge>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <AnimatedProgress value={analysis.matchPercentage} className="h-3" showGlow />
      </FadeIn>

      <StaggerList className="grid gap-4 lg:grid-cols-2">
        {chartData.length > 0 ? (
          <StaggerItem>
            <Card className="border-border/60 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-base">Skill categories</CardTitle>
              </CardHeader>
              <CardContent className="h-[280px]">
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
              </CardContent>
            </Card>
          </StaggerItem>
        ) : null}

        <StaggerItem>
          <Card className="border-border/60 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CheckCircle2 className="size-4 text-emerald-500" /> Matching skills
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {analysis.matchingSkills.map((s: string, i: number) => (
                <motion.span
                  key={s}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.03 }}
                >
                  <Badge variant="secondary">{s}</Badge>
                </motion.span>
              ))}
            </CardContent>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card className="border-border/60 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base">Missing skills</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {analysis.missingSkills.map((s: string, i: number) => (
                <motion.span
                  key={s}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 + i * 0.03 }}
                >
                  <Badge variant="outline">{s}</Badge>
                </motion.span>
              ))}
            </CardContent>
          </Card>
        </StaggerItem>

        {analysis.redFlags.length > 0 ? (
          <StaggerItem>
            <Card className="border-destructive/30 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-destructive">
                  <AlertTriangle className="size-4" /> Red flags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-1 pl-4 text-sm">
                  {analysis.redFlags.map((f: string) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </StaggerItem>
        ) : null}

        <StaggerItem className="lg:col-span-2">
          <Card className="border-border/60 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Lightbulb className="size-4 text-amber-500" /> Recommendations
              </CardTitle>
              <CardDescription>Actionable CV improvements</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal space-y-3 pl-4 text-sm">
                {analysis.recommendations.map((r: string, i: number) => (
                  <motion.li
                    key={r}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.06 }}
                  >
                    {r}
                  </motion.li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </StaggerItem>
      </StaggerList>
    </div>
  )
}
