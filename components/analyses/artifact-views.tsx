"use client"

import { Copy, Download } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  downloadTailoredDocx,
  downloadTailoredPdf,
  downloadTextFile,
  slugifyRole,
  tailoredBulletsPlainList,
  tailoredBulletsToMarkdown,
} from "@/lib/tailored-export"
import { cn } from "@/lib/utils"

type Bullet = { original: string; rewritten: string; rationale?: string }

export function TailoredBulletsView({
  bullets,
  jobTitle,
}: {
  bullets: Bullet[]
  jobTitle?: string
}) {
  async function copyRewritten() {
    try {
      await navigator.clipboard.writeText(tailoredBulletsPlainList(bullets))
      toast.success("Rewritten bullets copied")
    } catch {
      toast.error("Could not copy")
    }
  }

  async function copyMarkdown() {
    try {
      await navigator.clipboard.writeText(tailoredBulletsToMarkdown(bullets, { jobTitle }))
      toast.success("Markdown pack copied")
    } catch {
      toast.error("Could not copy")
    }
  }

  function downloadMarkdown() {
    downloadTextFile(
      `tailored-bullets-${slugifyRole(jobTitle) || "role"}.md`,
      tailoredBulletsToMarkdown(bullets, { jobTitle }),
    )
    toast.success("Downloaded markdown pack")
  }

  async function downloadDocx() {
    try {
      await downloadTailoredDocx(bullets, { jobTitle })
      toast.success("Downloaded DOCX")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "DOCX export failed")
    }
  }

  function downloadPdf() {
    try {
      downloadTailoredPdf(bullets, { jobTitle })
      toast.success("Downloaded PDF")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "PDF export failed")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="secondary" onClick={() => void copyRewritten()}>
          <Copy className="size-3.5" />
          Copy rewritten
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => void copyMarkdown()}>
          <Copy className="size-3.5" />
          Copy markdown
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={downloadMarkdown}>
          <Download className="size-3.5" />
          .md
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => void downloadDocx()}>
          <Download className="size-3.5" />
          .docx
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={downloadPdf}>
          <Download className="size-3.5" />
          .pdf
        </Button>
      </div>

      {bullets.map((b, i) => (
        <Card key={`${i}-${b.rewritten.slice(0, 24)}`} className="border-border/60 bg-muted/20">
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
  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Cover letter copied")
    } catch {
      toast.error("Could not copy")
    }
  }

  return (
    <div className="space-y-3">
      <Button type="button" size="sm" variant="secondary" onClick={() => void copy()}>
        <Copy className="size-3.5" />
        Copy letter
      </Button>
      <div className="rounded-lg border bg-muted/30 p-4">
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{text}</pre>
      </div>
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
                <li key={`${plan.skill}-${i}`}>{step}</li>
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
        Re-scored vs previous: <strong className="tabular-nums">{delta.previous}%</strong>
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
