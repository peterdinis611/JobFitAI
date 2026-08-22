"use client"

import Link from "next/link"
import { authFontVariables } from "@/components/auth/auth-fonts"
import { OnboardIcon } from "@/components/dashboard/onboard-icons"
import { OnboardPreview } from "@/components/dashboard/onboard-preview"
import { Button } from "@/components/ui/button"
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

export function DashboardGettingStarted({
  hasResume,
  className,
}: {
  hasResume: boolean
  className?: string
}) {
  const completed = hasResume ? 1 : 0
  const activeStep = completed + 1
  const primaryHref = hasResume ? "/analyze" : "/resumes"
  const primaryLabel = hasResume ? "Run your first analysis" : "Upload your resume"

  return (
    <div className={cn("dash-onboard mac-window", authFontVariables, className)}>
      <OnboardTitlebar label="Match setup" step={activeStep} />

      <div className="dash-onboard-hero relative">
        <div aria-hidden className="dash-onboard-glow pointer-events-none absolute inset-0" />

        <div className="relative grid gap-10 p-6 sm:p-8 lg:grid-cols-[1.12fr_0.88fr] lg:items-center lg:gap-12 lg:p-10">
          <div className="dash-onboard-copy space-y-6">
            <div className="space-y-3">
              <p className="font-[family-name:var(--font-auth-mono)] text-[11px] tracking-[0.32em] text-primary uppercase">
                {hasResume ? "Signal locked" : "Protocol"}
              </p>
              <h2 className="font-[family-name:var(--font-auth-display)] text-[clamp(1.75rem,4vw,2.65rem)] leading-[1.05] font-bold tracking-[-0.04em]">
                {hasResume ? "Resume parsed — add a job to calibrate" : "Let’s set up your first match"}
              </h2>
              <p className="max-w-md text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                {hasResume
                  ? "Paste a job description and get an AI breakdown of fit, missing skills, and CV improvements in under a minute."
                  : "Upload a resume first, then compare it against any job posting to get a detailed match report."}
              </p>
            </div>

            <ProgressSegments completed={completed} />

            <div className="flex flex-wrap gap-3">
              <Link href={primaryHref} className="dash-onboard-btn-primary">
                {primaryLabel}
              </Link>
              {!hasResume ? (
                <Link href="/analyze" className="dash-onboard-btn-secondary">
                  I already uploaded one
                </Link>
              ) : null}
            </div>

            <p className="font-[family-name:var(--font-auth-mono)] text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
              {hasResume ? "1 signal captured · 2 inputs remaining" : "0 signals · 3 steps to first report"}
            </p>
          </div>

          <OnboardPreview hasResume={hasResume} className="dash-onboard-dial-wrap" />
        </div>
      </div>

      <ol className="dash-onboard-steps grid gap-3 border-t border-border bg-muted/15 p-4 sm:grid-cols-3 sm:gap-4 sm:p-6">
        {steps.map((step, index) => {
          const done = index === 0 && hasResume
          const active = index === completed && !done

          return (
            <li key={step.n}>
              <Link
                href={step.href}
                className={cn(
                  "dash-onboard-step group block h-full",
                  done && "dash-onboard-step-done",
                  active && "dash-onboard-step-active",
                )}
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
                  {done ? "Done ✓" : `${step.cta} →`}
                </span>

                {index < steps.length - 1 ? (
                  <span aria-hidden className="dash-onboard-step-connector hidden sm:block" />
                ) : null}
              </Link>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export function DashboardEmptyHistory({ className }: { className?: string }) {
  return (
    <div className={cn("dash-onboard mac-window", authFontVariables, className)}>
      <OnboardTitlebar label="History · empty" step={2} />

      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-10 lg:p-10">
        <div className="dash-onboard-empty-viz" aria-hidden>
          <div className="dash-onboard-empty-grid">
            {[68, 54, 72, 61, 79].map((width, index) => (
              <div
                key={width}
                className="dash-onboard-empty-row"
                style={{ animationDelay: `${index * 70}ms` }}
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
          <p className="mt-4 text-center font-[family-name:var(--font-auth-mono)] text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
            Reports appear here after save
          </p>
        </div>

        <div className="dash-onboard-copy space-y-5">
          <div className="flex size-11 items-center justify-center rounded-xl border border-border bg-primary/10 text-primary">
            <OnboardIcon name="history" />
          </div>
          <div className="space-y-2">
            <p className="font-[family-name:var(--font-auth-mono)] text-[11px] tracking-[0.32em] text-primary uppercase">
              No signal yet
            </p>
            <h3 className="font-[family-name:var(--font-auth-display)] text-2xl font-bold tracking-[-0.04em]">
              Your match timeline is waiting
            </h3>
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              Completed analyses land here after the <strong className="font-medium text-foreground">Save report</strong>{" "}
              step succeeds. If you already ran one, check Analyze — a failed save won&apos;t show up here.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/analyze" className="dash-onboard-btn-primary">
              Run analysis
            </Link>
            <Link href="/tracker" className="dash-onboard-btn-secondary">
              Application tracker
            </Link>
          </div>

          <p className="font-[family-name:var(--font-auth-mono)] text-[10px] leading-relaxed tracking-[0.12em] text-muted-foreground uppercase">
            Tracker is separate — save a report from its detail page to track an application.
          </p>
        </div>
      </div>
    </div>
  )
}

export function DashboardNoFilterResults({
  minMatch,
  onClear,
}: {
  minMatch: number
  onClear: () => void
}) {
  return (
    <div className={cn("dash-onboard mac-panel px-6 py-12 text-center", authFontVariables)}>
      <div className="mx-auto flex size-12 items-center justify-center rounded-xl border border-border bg-muted/40 text-muted-foreground">
        <OnboardIcon name="filter" />
      </div>
      <h3 className="mt-4 font-[family-name:var(--font-auth-display)] text-xl font-semibold tracking-[-0.03em]">
        No matches at ≥ {minMatch}%
      </h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
        Try lowering the filter or run a new analysis against a different role.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Button variant="outline" size="sm" onClick={onClear}>
          Show all
        </Button>
        <Button asChild size="sm">
          <Link href="/analyze">New analysis</Link>
        </Button>
      </div>
    </div>
  )
}
