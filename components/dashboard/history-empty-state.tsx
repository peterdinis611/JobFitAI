"use client"

import Link from "next/link"
import { authFontVariables } from "@/components/auth/auth-fonts"
import { HistoryQuickStart } from "@/components/dashboard/history-quick-start"
import { HistorySampleReport } from "@/components/dashboard/history-sample-report"
import { OnboardIcon } from "@/components/dashboard/onboard-icons"
import { OnboardPreview } from "@/components/dashboard/onboard-preview"
import type { Doc } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"

const steps = [
  {
    n: "01",
    title: "Upload your CV",
    description: "PDF or DOCX — we parse skills, experience, and seniority.",
    href: "/resumes",
    cta: "Upload resume",
    icon: "upload" as const,
    accent: "var(--primary)",
  },
  {
    n: "02",
    title: "Add a job posting",
    description: "Paste the description or drop in a URL from any job board.",
    href: "/analyze",
    cta: "Add job",
    icon: "radar" as const,
    accent: "var(--success)",
  },
  {
    n: "03",
    title: "Get your match score",
    description: "Fit %, skill gaps, red flags, and tailored recommendations.",
    href: "/analyze",
    cta: "Run analysis",
    icon: "spark" as const,
    accent: "var(--primary)",
  },
] as const

function OnboardTitlebar({
  label,
  step,
  total = 3,
}: {
  label: string
  step: number
  total?: number
}) {
  return (
    <div className="mac-titlebar">
      <div className="mac-traffic-lights" aria-hidden>
        <span />
        <span />
        <span />
      </div>
      <span className="font-[family-name:var(--font-auth-mono)] text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
        {label}
      </span>
      <span className="ml-auto font-[family-name:var(--font-auth-mono)] text-[10px] tracking-[0.22em] text-primary uppercase">
        Step {Math.min(step, total)} of {total}
      </span>
    </div>
  )
}

function ProgressSegments({ completed }: { completed: number }) {
  return (
    <div className="dash-onboard-segments" aria-label={`${completed} of 3 steps complete`}>
      {steps.map((step, index) => (
        <span
          key={step.n}
          className={cn("dash-onboard-segment", index < completed && "dash-onboard-segment-done")}
        />
      ))}
    </div>
  )
}

function NextStepBanner({ hasResume }: { hasResume: boolean }) {
  if (!hasResume) {
    return (
      <p className="dash-onboard-next-banner">
        <span className="text-primary">Next</span>
        <span aria-hidden>→</span>
        Upload your resume to unlock job matching
      </p>
    )
  }

  return (
    <p className="dash-onboard-next-banner dash-onboard-next-banner-ready">
      <span className="text-success">Resume ready</span>
      <span aria-hidden>→</span>
      Paste a job below or use the sample posting
    </p>
  )
}

function TimelinePreview() {
  return (
    <div className="dash-onboard-empty-viz" aria-hidden>
      <HistorySampleReport className="mb-4" />
      <div className="dash-onboard-empty-grid opacity-70">
        {[54, 61].map((width, index) => (
          <div
            key={width}
            className="dash-onboard-empty-row"
            style={{ animationDelay: `${120 + index * 70}ms` }}
          >
            <span className="dash-onboard-empty-date" />
            <span
              className="dash-onboard-empty-bar"
              style={{ ["--bar-width" as string]: `${width}%` }}
            />
            <span className="dash-onboard-empty-score">—</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-center font-[family-name:var(--font-auth-mono)] text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
        Your reports stack here over time
      </p>
    </div>
  )
}

export function HistoryEmptyState({
  hasResume,
  activeResumeName,
  className,
}: {
  hasResume: boolean
  activeResumeName?: string
  resumes?: Doc<"resumes">[]
  className?: string
}) {
  const completed = hasResume ? 1 : 0
  const activeStep = hasResume ? 2 : 1
  const primaryHref = hasResume ? "/analyze" : "/resumes"
  const primaryLabel = hasResume ? "Open Analyze" : "Upload your resume"

  return (
    <div className={cn("dash-onboard mac-window", authFontVariables, className)}>
      <OnboardTitlebar
        label={hasResume ? "History · awaiting first report" : "Match setup"}
        step={activeStep}
      />

      <div className="dash-onboard-hero relative border-b border-border">
        <div aria-hidden className="dash-onboard-glow pointer-events-none absolute inset-0" />

        <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-10 lg:p-10">
          <div className="dash-onboard-copy space-y-5">
            <NextStepBanner hasResume={hasResume} />

            <div className="space-y-3">
              <p className="font-[family-name:var(--font-auth-mono)] text-[11px] tracking-[0.32em] text-primary uppercase">
                {hasResume ? "Signal locked" : "Protocol"}
              </p>
              <h2 className="font-[family-name:var(--font-auth-display)] text-[clamp(1.65rem,3.8vw,2.45rem)] leading-[1.06] font-bold tracking-[-0.04em]">
                {hasResume
                  ? "Resume ready — run your first analysis"
                  : "Let’s set up your first match"}
              </h2>
              <p className="max-w-md text-[15px] leading-relaxed text-muted-foreground">
                {hasResume
                  ? "Paste a job or try the sample posting below. When the save step succeeds, your match report appears in this timeline."
                  : "Upload a resume first, then compare it against any job posting to get a detailed match report."}
              </p>
            </div>

            <ProgressSegments completed={completed} />

            <div className="flex flex-wrap gap-3">
              <Link href={primaryHref} className="dash-onboard-btn-primary">
                {primaryLabel}
              </Link>
              {!hasResume ? (
                <Link href="/resumes" className="dash-onboard-btn-secondary">
                  Go to Resumes
                </Link>
              ) : (
                <Link href="/tracker" className="dash-onboard-btn-secondary">
                  Application tracker
                </Link>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <OnboardPreview hasResume={hasResume} className="dash-onboard-dial-wrap" />
            {!hasResume ? <TimelinePreview /> : null}
          </div>
        </div>

        <div className="border-t border-border bg-muted/10 px-6 py-6 sm:px-8 lg:px-10">
          <HistoryQuickStart hasResume={hasResume} activeResumeName={activeResumeName} />
        </div>
      </div>

      {hasResume ? (
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:p-10">
          <TimelinePreview />

          <div className="dash-onboard-copy space-y-4">
            <div className="flex size-11 items-center justify-center rounded-xl border border-border bg-primary/10 text-primary">
              <OnboardIcon name="history" />
            </div>
            <div className="space-y-2">
              <p className="font-[family-name:var(--font-auth-mono)] text-[11px] tracking-[0.32em] text-primary uppercase">
                What lands here
              </p>
              <h3 className="font-[family-name:var(--font-auth-display)] text-xl font-bold tracking-[-0.04em]">
                Saved reports, trends, and compare picks
              </h3>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                Each analysis you save shows fit %, skill gaps, and seniority fit. Filter by score,
                compare two roles, or archive old applications.
              </p>
            </div>
            <p className="font-[family-name:var(--font-auth-mono)] text-[10px] leading-relaxed tracking-[0.12em] text-muted-foreground uppercase">
              Failed saves won&apos;t appear — re-run from Analyze if needed.
            </p>
          </div>
        </div>
      ) : (
        <ol className="dash-onboard-steps grid gap-3 border-t border-border bg-muted/15 p-4 sm:grid-cols-3 sm:gap-4 sm:p-6">
          {steps.map((step, index) => {
            const active = index === completed

            return (
              <li key={step.n}>
                <Link
                  href={step.href}
                  className={cn("dash-onboard-step group block h-full", active && "dash-onboard-step-active")}
                  style={{ ["--step-accent" as string]: step.accent, animationDelay: `${index * 80}ms` }}
                >
                  <span aria-hidden className="dash-onboard-step-ghost">
                    {step.n}
                  </span>

                  <div className="relative flex items-start justify-between gap-3">
                    <span className="font-[family-name:var(--font-auth-mono)] text-[11px] tracking-[0.24em] text-primary">
                      {step.n}
                    </span>
                    <span className="dash-onboard-step-icon" aria-hidden>
                      <OnboardIcon name={step.icon} />
                    </span>
                  </div>

                  <h3 className="relative mt-8 font-[family-name:var(--font-auth-display)] text-lg leading-tight font-semibold tracking-[-0.03em]">
                    {step.title}
                  </h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                  <span className="relative mt-4 inline-flex text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    {step.cta} →
                  </span>

                  {index < steps.length - 1 ? (
                    <span aria-hidden className="dash-onboard-step-connector hidden sm:block" />
                  ) : null}
                </Link>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}
