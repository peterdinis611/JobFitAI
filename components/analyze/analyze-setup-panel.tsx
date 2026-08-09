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
      <div className="border-b border-border bg-[var(--mac-titlebar)] px-4 py-3">
        <h2 className="text-[15px] font-semibold tracking-tight">Setup</h2>
        <p className="text-xs text-muted-foreground">Resume + job → run match</p>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <div
          className={cn(
            "flex items-center gap-3 rounded-xl border px-3 py-2.5",
            hasResume ? "border-border bg-muted/25" : "border-warning/30 bg-warning/5",
          )}
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="size-3.5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium">
              {activeResumeName ?? "No resume uploaded"}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {hasResume ? "Active resume" : "Upload a PDF or DOCX first"}
            </p>
          </div>
          {!hasResume ? (
            <Button asChild size="sm" variant="outline">
              <Link href="/resumes">Upload</Link>
            </Button>
          ) : null}
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[13px] font-semibold">Job</p>
            <div className="mac-segmented w-fit shrink-0">
              <button
                type="button"
                className={cn("mac-segmented-item", tab === "text" && "mac-segmented-item-active")}
                onClick={() => onTabChange("text")}
                disabled={isBusy}
              >
                Paste
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
                <Link2 className="size-3" />
                URL
              </button>
            </div>
          </div>

          {tab === "text" ? (
            <div className="space-y-1.5">
              <JobPostingEditor
                value={jobText}
                onChange={onJobTextChange}
                disabled={isBusy}
                placeholder="Paste full job text — title on line 1…"
              />
              {jobText.length > 0 ? (
                <p className="text-[11px] text-muted-foreground">
                  {jobText.length.toLocaleString()} chars
                  {detectedFromPaste ? ` · “${detectedFromPaste}”` : null}
                </p>
              ) : null}
            </div>
          ) : (
            <div className="space-y-2">
              <Input
                placeholder="https://company.com/careers/…"
                className="mac-field"
                value={jobUrl}
                onChange={(e) => onJobUrlChange(e.target.value)}
                disabled={isBusy}
              />
              {jobUrl.trim() && !normalizedUrl ? (
                <p className="text-[11px] text-destructive">Need a valid HTTPS URL</p>
              ) : null}
              {urlHost ? (
                <p className="text-[11px] text-muted-foreground">Fetch from {urlHost}</p>
              ) : (
                <p className="text-[11px] text-muted-foreground">
                  Prefer paste if the board blocks bots.
                </p>
              )}
              {urlFetchFailed ? (
                <div className="space-y-2 rounded-xl border border-warning/35 bg-warning/10 px-3 py-2.5 text-[13px]">
                  <p className="flex items-start gap-2 text-warning">
                    <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                    <span>URL fetch failed — paste the posting instead.</span>
                  </p>
                  <Button type="button" size="sm" variant="secondary" onClick={onSwitchToPaste}>
                    Switch to paste
                  </Button>
                </div>
              ) : null}
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="job-title" className="text-[11px] font-medium text-muted-foreground">
              Role title {titleAutoDetected ? "(auto)" : "(optional)"}
            </label>
            <Input
              id="job-title"
              placeholder="Senior Frontend Engineer"
              className="mac-field"
              value={jobTitle}
              onChange={(e) => onJobTitleChange(e.target.value)}
              disabled={isBusy}
            />
          </div>
        </div>

        <Button className="h-10 w-full" disabled={!canRun} onClick={onRun}>
          {isBusy ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
          {isBusy ? "Analyzing…" : "Run analysis"}
        </Button>
      </div>
    </section>
  )
}
