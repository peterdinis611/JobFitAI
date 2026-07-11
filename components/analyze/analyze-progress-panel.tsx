"use client"

import Link from "next/link"
import type { EveMessage } from "eve/react"
import {
  AlertCircle,
  ArrowUp,
  CheckCircle2,
  Circle,
  Loader2,
  Sparkles,
  XCircle,
} from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { useEffect, useMemo, useRef, useState } from "react"
import { AnalyzingIllustration } from "@/components/illustrations/jobfit-illustrations"
import { MatchScoreRing } from "@/components/ui/animated-progress"
import { Button } from "@/components/ui/button"
import { MessageResponse } from "@/components/ai-elements/message"
import { parseAnalysisStream } from "@/lib/analyze-stream"
import { cn } from "@/lib/utils"

type AnalyzeProgressPanelProps = {
  messages: readonly EveMessage[]
  isBusy: boolean
}

function StepIcon({ status }: { status: "pending" | "running" | "completed" | "error" }) {
  if (status === "completed") {
    return <CheckCircle2 className="size-4 text-success" />
  }
  if (status === "running") {
    return <Loader2 className="size-4 animate-spin text-primary" />
  }
  if (status === "error") {
    return <XCircle className="size-4 text-destructive" />
  }
  return <Circle className="size-4 text-muted-foreground/50" />
}

function statusLabel({
  hasStarted,
  isBusy,
  hasError,
  allDone,
}: {
  hasStarted: boolean
  isBusy: boolean
  hasError: boolean
  allDone: boolean
}) {
  if (!hasStarted) return { text: "Ready", tone: "muted" as const }
  if (hasError) return { text: "Failed", tone: "error" as const }
  if (isBusy) return { text: "Analyzing", tone: "active" as const }
  if (allDone) return { text: "Complete", tone: "success" as const }
  return { text: "In progress", tone: "active" as const }
}

export function AnalyzeProgressPanel({
  messages,
  isBusy,
}: AnalyzeProgressPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const stream = useMemo(() => parseAnalysisStream(messages), [messages])
  const badge = statusLabel({
    hasStarted: stream.hasStarted,
    isBusy,
    hasError: stream.hasError,
    allDone: stream.allDone,
  })

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const onScroll = () => setShowScrollTop(el.scrollTop > 160)
    el.addEventListener("scroll", onScroll, { passive: true })
    onScroll()

    return () => el.removeEventListener("scroll", onScroll)
  }, [stream.hasStarted])

  function scrollToTop() {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <section className="mac-window relative flex max-h-[calc(100dvh-100px)] min-h-[560px] flex-col overflow-hidden">
      <div className="mac-titlebar">
        <div className="mac-traffic-lights" aria-hidden>
          <span />
          <span />
          <span />
        </div>
        <span className="flex-1 text-center text-xs font-medium text-muted-foreground">
          Analysis progress
        </span>
        <span className="w-[52px]" aria-hidden />
      </div>

      <div ref={scrollRef} className="flex min-h-0 flex-1 flex-col overflow-y-auto p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[15px] font-semibold">Match analysis</h2>
            <p className="text-xs text-muted-foreground">
              {stream.hasStarted
                ? "Follow each step below while the agent works."
                : "Run an analysis to see live progress here."}
            </p>
          </div>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
              badge.tone === "success" && "bg-success/15 text-success",
              badge.tone === "error" && "bg-destructive/15 text-destructive",
              badge.tone === "active" && "bg-primary/15 text-primary",
              badge.tone === "muted" && "bg-muted text-muted-foreground",
            )}
          >
            {badge.tone === "active" ? (
              <span className="size-1.5 animate-pulse rounded-full bg-current" />
            ) : null}
            {badge.text}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {!stream.hasStarted ? (
            <motion.div
              key="empty"
              className="flex flex-1 flex-col items-center justify-center gap-4 py-8 text-center"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <AnalyzingIllustration className="max-w-[220px] opacity-80" />
              <div className="max-w-xs space-y-1">
                <p className="text-sm font-medium">No analysis yet</p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Paste a job description on the left and click Run analysis. You&apos;ll see a
                  clear step-by-step breakdown instead of raw agent logs.
                </p>
              </div>
              <div className="grid w-full max-w-sm gap-2 text-left text-xs text-muted-foreground">
                {["Read resume", "Load job posting", "Score match", "Save report"].map((step) => (
                  <div
                    key={step}
                    className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/20 px-3 py-2"
                  >
                    <Circle className="size-3.5 shrink-0 opacity-40" />
                    {step}
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="active"
              className="flex min-h-0 flex-1 flex-col gap-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <ol className="space-y-2">
                {stream.steps.map((step, index) => (
                  <li
                    key={step.id}
                    className={cn(
                      "flex items-start gap-3 rounded-xl border px-3.5 py-3 transition-colors",
                      step.status === "running" && "border-primary/30 bg-primary/5",
                      step.status === "completed" && "border-border bg-muted/20",
                      step.status === "error" && "border-destructive/30 bg-destructive/5",
                      step.status === "pending" && "border-border/50 bg-transparent opacity-60",
                    )}
                  >
                    <div className="mt-0.5">
                      <StepIcon status={step.status} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{step.label}</p>
                      {step.error ? (
                        <p className="mt-1 text-xs leading-relaxed text-destructive">{step.error}</p>
                      ) : (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Step {index + 1} of {stream.steps.length}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>

              {stream.hasError && stream.failedStep ? (
                <div className="flex items-start gap-3 rounded-xl border border-destructive/25 bg-destructive/5 px-4 py-3">
                  <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                  <div className="space-y-1 text-sm">
                    <p className="font-medium text-destructive">
                      {stream.failedStep.label} failed
                    </p>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {stream.failedStep.error ??
                        "Something went wrong. Try running the analysis again."}
                    </p>
                  </div>
                </div>
              ) : null}

              {(stream.matchPercentage !== undefined || stream.assistantText) && (
                <div className="rounded-xl border border-border bg-muted/15 p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    {stream.matchPercentage !== undefined ? (
                      <MatchScoreRing value={stream.matchPercentage} size={96} className="shrink-0" />
                    ) : null}
                    <div className="min-w-0 flex-1 space-y-2">
                      <p className="text-sm font-semibold">
                        {stream.allDone && !stream.hasError
                          ? "Analysis complete"
                          : "Preliminary results"}
                      </p>
                      {stream.assistantText ? (
                        <div className="max-w-none text-[13px] leading-relaxed text-muted-foreground">
                          <MessageResponse>{stream.assistantText}</MessageResponse>
                        </div>
                      ) : isBusy ? (
                        <p className="text-xs text-muted-foreground">Generating summary…</p>
                      ) : null}
                    </div>
                  </div>

                  {stream.analysisId ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button asChild size="sm">
                        <Link href={`/analyses/${stream.analysisId}`}>
                          <Sparkles className="size-3.5" />
                          View full report
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="outline">
                        <Link href="/">Open history</Link>
                      </Button>
                    </div>
                  ) : stream.allDone && stream.hasError && stream.failedStep?.id === "save_analysis" ? (
                    <p className="mt-4 text-xs text-destructive">
                      Report was not saved — run the analysis again to add it to History.
                    </p>
                  ) : null}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showScrollTop ? (
          <motion.div
            className="pointer-events-none absolute right-5 bottom-5 z-10"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="pointer-events-auto h-9 gap-1.5 rounded-full border-border bg-card/95 px-3 shadow-md backdrop-blur-sm"
              onClick={scrollToTop}
            >
              <ArrowUp className="size-3.5" />
              Top
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}
