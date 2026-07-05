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
import { api } from "@/convex/_generated/api"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Doc, Id } from "@/convex/_generated/dataModel"

export default function AnalysisDetailPage() {
  const params = useParams()
  const analysisId = params.id as Id<"analyses">
  const data = useQuery(api.analyses.getWithRelations, { analysisId })

  if (data === undefined) {
    return <div className="h-60 animate-pulse rounded-xl bg-muted" />
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
    <div className="space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to history
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {jobPosting?.title ?? "Job match analysis"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {resume?.fileName} · {new Date(analysis.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-4xl font-bold tabular-nums text-primary">
            {analysis.matchPercentage}%
          </p>
          <Badge variant="secondary" className="mt-1">
            Seniority: {analysis.seniorityFit}
          </Badge>
        </div>
      </div>

      <Progress value={analysis.matchPercentage} className="h-3" />

      <div className="grid gap-4 lg:grid-cols-2">
        {chartData.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Skill categories</CardTitle>
            </CardHeader>
            <CardContent className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={chartData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" />
                  <Radar dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.35} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle2 className="size-4 text-emerald-500" /> Matching skills
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {analysis.matchingSkills.map((s: string) => (
              <Badge key={s} variant="secondary">
                {s}
              </Badge>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Missing skills</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {analysis.missingSkills.map((s: string) => (
              <Badge key={s} variant="outline">
                {s}
              </Badge>
            ))}
          </CardContent>
        </Card>

        {analysis.redFlags.length > 0 ? (
          <Card className="border-destructive/30">
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
        ) : null}

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Lightbulb className="size-4 text-amber-500" /> Recommendations
            </CardTitle>
            <CardDescription>Actionable CV improvements</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal space-y-2 pl-4 text-sm">
              {analysis.recommendations.map((r: string) => (
                <li key={r}>{r}</li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
