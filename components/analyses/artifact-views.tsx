"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Bullet = { original: string; rewritten: string; rationale?: string }

export function TailoredBulletsView({ bullets }: { bullets: Bullet[] }) {
  return (
    <div className="space-y-4">
      {bullets.map((b, i) => (
        <Card key={i} className="border-border/60 bg-muted/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Bullet {i + 1}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Before
              </p>
              <p className="text-muted-foreground line-through decoration-border">{b.original}</p>
            </div>
            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-success">After</p>
              <p className="font-medium">{b.rewritten}</p>
            </div>
            {b.rationale ? (
              <p className="text-xs text-muted-foreground italic">{b.rationale}</p>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function CoverLetterView({ text }: { text: string }) {
  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{text}</pre>
    </div>
  )
}

type Plan = { skill: string; durationWeeks: number; steps: string[] }

export function LearningPlanView({ plans }: { plans: Plan[] }) {
  return (
    <div className="space-y-4">
      {plans.map((plan) => (
        <Card key={plan.skill} className="border-border/60">
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-base">{plan.skill}</CardTitle>
              <Badge variant="secondary">{plan.durationWeeks}-week plan</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              To close the <span className="font-medium text-foreground">{plan.skill}</span> gap
            </p>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal space-y-2 pl-4 text-sm">
              {plan.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function RescoreDeltaBanner({
  delta,
}: {
  delta: { current: number; previous: number; delta: number; previousAnalysisId: string }
}) {
  const improved = delta.delta > 0
  const declined = delta.delta < 0

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm",
        improved && "border-success/30 bg-success/10",
        declined && "border-destructive/30 bg-destructive/10",
        delta.delta === 0 && "border-border bg-muted/30",
      )}
    >
      <span>
        Re-scored vs previous:{" "}
        <strong className="tabular-nums">{delta.previous}%</strong>
        {" → "}
        <strong className="tabular-nums">{delta.current}%</strong>
      </span>
      <Badge
        variant="secondary"
        className={cn(
          improved && "bg-success/20 text-success",
          declined && "bg-destructive/20 text-destructive",
        )}
      >
        {delta.delta > 0 ? "+" : ""}
        {delta.delta} pts
      </Badge>
      <Link
        href={`/analyses/${delta.previousAnalysisId}`}
        className="text-xs text-primary hover:underline"
      >
        View previous
      </Link>
    </div>
  )
}
