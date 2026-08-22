"use client"

import { Copy, Download } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { TailoredCvDraft } from "@/lib/application-pack"
import { tailoredCvToMarkdown } from "@/lib/application-pack"
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

export function TailoredCvView({ draft, jobTitle }: { draft: TailoredCvDraft; jobTitle?: string }) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(tailoredCvToMarkdown(draft, jobTitle))
      toast.success("Tailored CV copied")
    } catch {
      toast.error("Could not copy")
    }
  }

  function downloadMarkdown() {
    downloadTextFile(
      `tailored-cv-${slugifyRole(jobTitle) || "role"}.md`,
      tailoredCvToMarkdown(draft, jobTitle),
    )
    toast.success("Downloaded tailored CV")
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="secondary" onClick={() => void copy()}>
          <Copy className="size-3.5" />
          Copy draft
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={downloadMarkdown}>
          <Download className="size-3.5" />
          .md
        </Button>
      </div>
      <Card className="border-border/60 bg-muted/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{draft.headline}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p className="leading-relaxed">{draft.summary}</p>
          {draft.experience.map((section) => (
            <div key={section.heading}>
              <p className="mb-1.5 text-[13px] font-semibold">{section.heading}</p>
              <ul className="list-disc space-y-1 pl-5">
                {section.bullets.map((bullet) => (
                  <li key={`${section.heading}-${bullet.slice(0, 32)}`}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
          {draft.skills.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {draft.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
      <p className="text-[11px] text-muted-foreground">
        Draft only — verify employers, dates, and metrics before you send it.
      </p>
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
              {plan.steps.map((step) => (
                <li key={`${plan.skill}-${step.slice(0, 48)}`}>{step}</li>
              ))}
            </ol>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

type InterviewQuestion = {
  question: string
  category: "behavioral" | "technical" | "role" | "culture"
  whyAsked: string
  tip: string
}

const CATEGORY_LABEL: Record<InterviewQuestion["category"], string> = {
  behavioral: "Behavioral",
  technical: "Technical",
  role: "Role",
  culture: "Culture",
}

export function InterviewPrepView({
  questions,
  opener,
}: {
  questions: InterviewQuestion[]
  opener?: string
}) {
  async function copyAll() {
    const text = [
      opener ? `Tell me about yourself\n${opener}\n` : "",
      ...questions.map(
        (q, i) =>
          `${i + 1}. [${CATEGORY_LABEL[q.category]}] ${q.question}\nWhy: ${q.whyAsked}\nTip: ${q.tip}`,
      ),
    ]
      .filter(Boolean)
      .join("\n\n")
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Interview prep copied")
    } catch {
      toast.error("Could not copy")
    }
  }

  return (
    <div className="space-y-4">
      <Button type="button" size="sm" variant="secondary" onClick={() => void copyAll()}>
        <Copy className="size-3.5" />
        Copy all
      </Button>
      {opener ? (
        <div className="rounded-xl border border-border bg-muted/20 p-4">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Opener
          </p>
          <p className="text-sm leading-relaxed">{opener}</p>
        </div>
      ) : null}
      {questions.map((q) => (
        <Card key={q.question} className="border-border/60">
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{CATEGORY_LABEL[q.category]}</Badge>
            </div>
            <CardTitle className="text-[15px] leading-snug">{q.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="font-medium text-muted-foreground">Why asked: </span>
              {q.whyAsked}
            </p>
            <p>
              <span className="font-medium text-success">Tip: </span>
              {q.tip}
            </p>
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
