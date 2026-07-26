"use client"

import { AlertTriangle, FileText, Link2, Loader2, Sparkles } from "lucide-react"
import Link from "next/link"
import { useMemo } from "react"
import { JobPostingEditor } from "@/components/analyze/job-posting-editor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { extractJobTitle, hostFromUrl, normalizeJobUrl } from "@/lib/extract-job-title"
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
  jobTitle: string
  onJobTitleChange: (value: string) => void
  titleAutoDetected: boolean
  urlFetchFailed?: boolean
  isBusy: boolean
  onRun: () => void
  onSwitchToPaste: () => void
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
  jobTitle,
  onJobTitleChange,
  titleAutoDetected,
  urlFetchFailed,
  isBusy,
  onRun,
  onSwitchToPaste,
}: AnalyzeSetupPanelProps) {
  const normalizedUrl = useMemo(() => normalizeJobUrl(jobUrl), [jobUrl])
  const urlHost = normalizedUrl ? hostFromUrl(normalizedUrl) : undefined
  const detectedFromPaste = useMemo(
    () => (tab === "text" ? extractJobTitle(jobText) : undefined),
    [tab, jobText],
  )

  const canRun =
    hasResume &&
    !isBusy &&
    (tab === "text"
      ? jobText.trim().length > 0
      : Boolean(normalizedUrl) && jobUrl.trim().length > 0)

  return (
    <section className="mac-window w-full min-w-0 overflow-hidden">
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
          <p className="text-xs text-muted-foreground">
            We compare this CV against the job posting.
          </p>
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
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-[15px] font-semibold">Job posting</h2>
              <p className="text-xs text-muted-foreground">
                Paste text first when possible — many boards block URL fetch.
              </p>
            </div>
            <div className="mac-segmented w-fit shrink-0">
              <button
                type="button"
                className={cn("mac-segmented-item", tab === "text" && "mac-segmented-item-active")}
                onClick={() => onTabChange("text")}
                disabled={isBusy}
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
                disabled={isBusy}
              >
                <Link2 className="size-3.5" />
                URL
              </button>
            </div>
          </div>

          {tab === "text" ? (
            <div className="space-y-2">
              <JobPostingEditor
                value={jobText}
                onChange={onJobTextChange}
                disabled={isBusy}
                placeholder="Paste the full job description — put the role title on the first line…"
              />
              {jobText.length > 0 ? (
                <p className="text-xs text-muted-foreground">
                  {jobText.length.toLocaleString()} characters
                  {detectedFromPaste ? ` · detected “${detectedFromPaste}”` : null}
                </p>
              ) : null}
            </div>
          ) : (
            <div className="space-y-3">
              <Input
                placeholder="https://company.com/careers/senior-engineer"
                className="mac-field"
                value={jobUrl}
                onChange={(e) => onJobUrlChange(e.target.value)}
                disabled={isBusy}
              />
              {jobUrl.trim() && !normalizedUrl ? (
                <p className="text-xs text-destructive">
                  Enter a valid HTTPS URL (http is upgraded).
                </p>
              ) : null}
              {urlHost ? (
                <p className="text-xs text-muted-foreground">Will fetch from {urlHost}</p>
              ) : null}
              <div className="rounded-xl border border-border/70 bg-muted/20 px-3 py-2.5 text-xs text-muted-foreground">
                Prefer paste when the board requires login or blocks bots. You can switch anytime.
              </div>
              {urlFetchFailed ? (
                <div className="flex flex-col gap-2 rounded-xl border border-warning/35 bg-warning/10 px-3 py-3 text-sm">
                  <p className="flex items-start gap-2 text-warning">
                    <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                    <span>
                      URL fetch failed. Paste the job description instead — scoring stays the same.
                    </span>
                  </p>
                  <Button type="button" size="sm" variant="secondary" onClick={onSwitchToPaste}>
                    Switch to paste
                  </Button>
                </div>
              ) : null}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="job-title" className="text-xs font-medium text-muted-foreground">
              Role title {titleAutoDetected ? "(auto-detected — editable)" : "(optional)"}
            </label>
            <Input
              id="job-title"
              placeholder="e.g. Senior Frontend Engineer"
              className="mac-field"
              value={jobTitle}
              onChange={(e) => onJobTitleChange(e.target.value)}
              disabled={isBusy}
            />
          </div>
        </div>

        <Button className="h-10 w-full text-[15px]" disabled={!canRun} onClick={onRun}>
          {isBusy ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
          {isBusy ? "Analyzing…" : "Run analysis"}
        </Button>
      </div>
    </section>
  )
}
