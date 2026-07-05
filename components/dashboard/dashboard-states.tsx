"use client"

import Link from "next/link"
import { Briefcase, FileText, Sparkles, Upload } from "lucide-react"
import { motion } from "motion/react"
import { AuthHeroIllustration } from "@/components/illustrations/jobfit-illustrations"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const steps = [
  {
    icon: Upload,
    title: "Upload your CV",
    description: "PDF or DOCX — we parse skills, experience, and seniority.",
    href: "/resumes",
    cta: "Upload resume",
  },
  {
    icon: Briefcase,
    title: "Add a job posting",
    description: "Paste the description or drop in a URL from any job board.",
    href: "/analyze",
    cta: "Add job",
  },
  {
    icon: Sparkles,
    title: "Get your match score",
    description: "See fit %, skill gaps, red flags, and tailored recommendations.",
    href: "/analyze",
    cta: "Run analysis",
  },
]

export function DashboardGettingStarted({
  hasResume,
  className,
}: {
  hasResume: boolean
  className?: string
}) {
  const primaryHref = hasResume ? "/analyze" : "/resumes"
  const primaryLabel = hasResume ? "Run your first analysis" : "Upload your resume"

  return (
    <motion.div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-card to-muted/30",
        className,
      )}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-10">
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Getting started
            </p>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {hasResume
                ? "Ready to see how you match?"
                : "Let’s set up your first match"}
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              {hasResume
                ? "Paste a job description and get an AI breakdown of fit, missing skills, and CV improvements in under a minute."
                : "Upload a resume first, then compare it against any job posting to get a detailed match report."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href={primaryHref}>{primaryLabel}</Link>
            </Button>
            {!hasResume ? (
              <Button asChild variant="outline" size="lg">
                <Link href="/analyze">I already uploaded one</Link>
              </Button>
            ) : null}
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <AuthHeroIllustration className="max-h-56 w-full max-w-sm sm:max-h-64" />
        </div>
      </div>

      <div className="grid gap-3 border-t border-border bg-muted/20 p-4 sm:grid-cols-3 sm:gap-4 sm:p-6">
        {steps.map((step, index) => {
          const Icon = step.icon
          const done = index === 0 && hasResume
          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.08, duration: 0.4 }}
            >
              <Link
                href={step.href}
                className={cn(
                  "group flex h-full flex-col rounded-xl border border-border/70 bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md",
                  done && "border-primary/25 bg-primary/5",
                )}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span
                    className={cn(
                      "flex size-9 items-center justify-center rounded-lg",
                      done ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-medium">{step.title}</h3>
                <p className="mt-1 flex-1 text-sm text-muted-foreground">{step.description}</p>
                <span className="mt-3 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  {done ? "Done ✓" : step.cta} →
                </span>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
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
    <motion.div
      className="flex flex-col items-center px-4 py-14 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
        <FileText className="size-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">No matches at ≥ {minMatch}%</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Try lowering the filter or run a new analysis against a different role.
      </p>
      <div className="mt-5 flex gap-2">
        <Button variant="outline" size="sm" onClick={onClear}>
          Show all
        </Button>
        <Button asChild size="sm">
          <Link href="/analyze">New analysis</Link>
        </Button>
      </div>
    </motion.div>
  )
}
