"use client"

import Link from "next/link"
import { FileText, Link2, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type AnalyzeSetupPanelProps = {
  activeResumeName?: string
  hasResume: boolean
  tab: "text" | "url"
  onTabChange: (tab: "text" | "url") => void
  jobText: string
  onJobTextChange: (value: string) => void
  jobUrl: string
  onJobUrlChange: (value: string) => void
  isBusy: boolean
  onRun: () => void
}

export function AnalyzeSetupPanel({
  activeResumeName,
  hasResume,
  tab,
  onTabChange,
  jobText,
  onJobTextChange,
  jobUrl,
  onJobUrlChange,
  isBusy,
  onRun,
}: AnalyzeSetupPanelProps) {
  const canRun =
    hasResume &&
    !isBusy &&
    (tab === "text" ? jobText.trim().length > 0 : jobUrl.trim().length > 0)

  return (
    <section className="mac-window">
      <div className="mac-titlebar">
        <div className="mac-traffic-lights" aria-hidden>
          <span />
          <span />
          <span />
        </div>
        <span className="flex-1 text-center text-xs font-medium text-muted-foreground">
          New analysis
        </span>
        <span className="w-[52px]" aria-hidden />
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <div className="space-y-1">
          <h2 className="text-[15px] font-semibold">Your resume</h2>
          <p className="text-xs text-muted-foreground">We compare this CV against the job posting.</p>
        </div>

        <div
          className={cn(
            "flex items-center gap-3 rounded-xl border px-3.5 py-3",
            hasResume ? "border-border bg-muted/30" : "border-warning/30 bg-warning/5",
          )}
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="size-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {activeResumeName ?? "No resume uploaded"}
            </p>
            <p className="text-xs text-muted-foreground">
              {hasResume ? "Active resume" : "Upload a PDF or DOCX first"}
            </p>
          </div>
          {!hasResume ? (
            <Button asChild size="sm" variant="outline">
              <Link href="/resumes">Upload</Link>
            </Button>
          ) : null}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[15px] font-semibold">Job posting</h2>
              <p className="text-xs text-muted-foreground">Paste text or paste a careers page URL.</p>
            </div>
            <div className="mac-segmented shrink-0">
              <button
                type="button"
                className={cn(
                  "mac-segmented-item",
                  tab === "text" && "mac-segmented-item-active",
                )}
                onClick={() => onTabChange("text")}
              >
                Paste text
              </button>
              <button
                type="button"
                className={cn(
                  "mac-segmented-item gap-1",
                  tab === "url" && "mac-segmented-item-active",
                )}
                onClick={() => onTabChange("url")}
              >
                <Link2 className="size-3.5" />
                URL
              </button>
            </div>
          </div>

          {tab === "text" ? (
            <div className="space-y-2">
              <Textarea
                placeholder="Paste the full job description…"
                className="mac-field field-sizing-fixed h-[200px] max-h-[240px] resize-none overflow-y-auto text-[13px]"
                value={jobText}
                onChange={(e) => onJobTextChange(e.target.value)}
              />
              {jobText.length > 0 ? (
                <p className="text-xs text-muted-foreground">
                  {jobText.length.toLocaleString()} characters
                </p>
              ) : null}
            </div>
          ) : (
            <Input
              placeholder="https://company.com/careers/senior-engineer"
              className="mac-field"
              value={jobUrl}
              onChange={(e) => onJobUrlChange(e.target.value)}
            />
          )}
        </div>

        <Button
          className="h-10 w-full text-[15px]"
          disabled={!canRun}
          onClick={onRun}
        >
          {isBusy ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Sparkles className="size-4" />
          )}
          {isBusy ? "Analyzing…" : "Run analysis"}
        </Button>
      </div>
    </section>
  )
}
