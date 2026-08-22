"use client"

import { AlertTriangle, FileText, Link2, Loader2, Plus, Sparkles, Trash2 } from "lucide-react"
import Link from "next/link"
import { useMemo } from "react"
import { JobPostingEditor } from "@/components/analyze/job-posting-editor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { type BatchJobDraft, draftLabel, parseBatchUrls } from "@/lib/batch-jobs"
import {
  extractJobTitle,
  hostFromUrl,
  looksLikeJobPaste,
  normalizeJobUrl,
} from "@/lib/extract-job-title"
import { cn } from "@/lib/utils"

export type AnalyzeMode = "single" | "batch"
export type QueueStatus = "queued" | "running" | "saved" | "error"

export type QueuedJob = BatchJobDraft & {
  status: QueueStatus
  analysisId?: string
  error?: string
}

type AnalyzeSetupPanelProps = {
  activeResumeName?: string
  hasResume: boolean
  mode: AnalyzeMode
  onModeChange: (mode: AnalyzeMode) => void
  tab: "text" | "url"
  onTabChange: (tab: "text" | "url") => void
  jobText: string
  onJobTextChange: (value: string) => void
  jobUrl: string
  onJobUrlChange: (value: string) => void
  /** Fired when pasted text into the URL field looks like a full job posting. */
  onJobPasteDetected?: (text: string) => void
  jobTitle: string
  onJobTitleChange: (value: string) => void
  titleAutoDetected: boolean
  urlFetchFailed?: boolean
  isBusy: boolean
  onRun: () => void
  onSwitchToPaste: () => void
  queue?: QueuedJob[]
  onAddToQueue?: () => void
  onRemoveFromQueue?: (id: string) => void
  onRunQueue?: () => void
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
  onJobPasteDetected,
  jobTitle,
  onJobTitleChange,
  titleAutoDetected,
  urlFetchFailed,
  isBusy,
  onRun,
  onSwitchToPaste,
  mode,
  onModeChange,
  queue = [],
  onAddToQueue,
  onRemoveFromQueue,
  onRunQueue,
}: AnalyzeSetupPanelProps) {
  const normalizedUrl = useMemo(() => normalizeJobUrl(jobUrl), [jobUrl])
  const urlHost = normalizedUrl ? hostFromUrl(normalizedUrl) : undefined
  const detectedFromPaste = useMemo(
    () => (tab === "text" ? extractJobTitle(jobText) : undefined),
    [tab, jobText],
  )

  const batchUrlCount = useMemo(() => parseBatchUrls(jobUrl).length, [jobUrl])
  const canRun =
    hasResume &&
    !isBusy &&
    (tab === "text"
      ? jobText.trim().length > 0
      : mode === "batch"
        ? batchUrlCount > 0
        : Boolean(normalizedUrl) && jobUrl.trim().length > 0)

  return (
    <section className="mac-window w-full min-w-0 overflow-hidden">
      <div className="border-b border-border bg-[var(--mac-titlebar)] px-4 py-3">
        <h2 className="text-[15px] font-semibold tracking-tight">Setup</h2>
        <p className="text-xs text-muted-foreground">
          {mode === "batch"
            ? "Queue several jobs, then run them one by one"
            : "Resume + job → run match"}
        </p>
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
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[13px] font-semibold">Job</p>
            <div className="flex flex-wrap items-center gap-2">
              <div className="mac-segmented w-fit shrink-0">
                <button
                  type="button"
                  className={cn(
                    "mac-segmented-item",
                    mode === "single" && "mac-segmented-item-active",
                  )}
                  onClick={() => onModeChange("single")}
                  disabled={isBusy}
                >
                  Single
                </button>
                <button
                  type="button"
                  className={cn(
                    "mac-segmented-item",
                    mode === "batch" && "mac-segmented-item-active",
                  )}
                  onClick={() => onModeChange("batch")}
                  disabled={isBusy}
                >
                  Batch
                </button>
              </div>
              <div className="mac-segmented w-fit shrink-0">
                <button
                  type="button"
                  className={cn(
                    "mac-segmented-item",
                    tab === "text" && "mac-segmented-item-active",
                  )}
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
          </div>

          {tab === "text" ? (
            <div className="space-y-1.5">
              <JobPostingEditor
                value={jobText}
                onChange={onJobTextChange}
                disabled={isBusy}
                placeholder={
                  mode === "batch"
                    ? "Paste jobs separated by a --- line…"
                    : "Paste full job text — title on line 1…"
                }
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
              {mode === "batch" ? (
                <Textarea
                  placeholder={"https://company.com/careers/one\nhttps://company.com/careers/two"}
                  className="mac-field min-h-24"
                  value={jobUrl}
                  onChange={(e) => onJobUrlChange(e.target.value)}
                  disabled={isBusy}
                />
              ) : (
                <Input
                  placeholder="https://company.com/careers/…"
                  className="mac-field"
                  value={jobUrl}
                  onChange={(e) => {
                    const value = e.target.value
                    if (onJobPasteDetected && looksLikeJobPaste(value)) {
                      onJobPasteDetected(value)
                      return
                    }
                    onJobUrlChange(value)
                  }}
                  onPaste={(e) => {
                    const pasted = e.clipboardData.getData("text")
                    if (onJobPasteDetected && looksLikeJobPaste(pasted)) {
                      e.preventDefault()
                      onJobPasteDetected(pasted)
                    }
                  }}
                  disabled={isBusy}
                />
              )}
              {mode === "single" && jobUrl.trim() && !normalizedUrl ? (
                <p className="text-[11px] text-destructive">Need a valid HTTPS URL</p>
              ) : null}
              {mode === "batch" && jobUrl.trim() && batchUrlCount === 0 ? (
                <p className="text-[11px] text-destructive">Need at least one valid HTTPS URL</p>
              ) : null}
              {urlHost ? (
                <p className="text-[11px] text-muted-foreground">
                  Fetch from {urlHost} · if it fails, we’ll ask you to paste
                </p>
              ) : (
                <p className="text-[11px] text-muted-foreground">
                  Prefer paste if the board blocks bots. Pasting full text here auto-switches.
                </p>
              )}
              {urlFetchFailed ? (
                <div className="space-y-2 rounded-xl border border-warning/35 bg-warning/10 px-3 py-2.5 text-[13px]">
                  <p className="flex items-start gap-2 text-warning">
                    <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                    <span>
                      URL fetch blocked or empty — open the posting in your browser, copy the text,
                      and paste it here.
                    </span>
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

        {mode === "batch" ? (
          <div className="space-y-3">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-10 flex-1"
                disabled={!canRun}
                onClick={onAddToQueue}
              >
                <Plus className="size-4" />
                Add to queue
              </Button>
              <Button
                className="h-10 flex-1"
                disabled={!hasResume || isBusy || queue.length === 0}
                onClick={onRunQueue}
              >
                {isBusy ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Sparkles className="size-4" />
                )}
                {isBusy ? "Analyzing…" : `Analyze ${queue.length || ""}`}
              </Button>
            </div>
            {queue.length === 0 ? (
              <p className="text-[11px] text-muted-foreground">
                Queue is empty. Add pasted jobs or one URL per line. Each run counts toward the
                daily limit.
              </p>
            ) : (
              <ul className="space-y-1.5">
                {queue.map((job) => (
                  <li
                    key={job.id}
                    className="flex items-start gap-2 rounded-lg border border-border/70 bg-muted/20 px-2.5 py-2"
                  >
                    <span
                      className={cn(
                        "mt-0.5 size-1.5 shrink-0 rounded-full",
                        job.status === "saved" && "bg-success",
                        job.status === "running" && "bg-primary",
                        job.status === "error" && "bg-destructive",
                        job.status === "queued" && "bg-muted-foreground/40",
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-medium">{draftLabel(job)}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {job.status === "saved"
                          ? "Saved to History"
                          : job.status === "running"
                            ? "Scoring…"
                            : job.status === "error"
                              ? (job.error ?? "Failed")
                              : job.source === "url"
                                ? "URL"
                                : "Paste"}
                      </p>
                    </div>
                    {job.status === "queued" && onRemoveFromQueue ? (
                      <button
                        type="button"
                        className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                        aria-label="Remove from queue"
                        disabled={isBusy}
                        onClick={() => onRemoveFromQueue(job.id)}
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <Button className="h-10 w-full" disabled={!canRun} onClick={onRun}>
            {isBusy ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {isBusy ? "Analyzing…" : "Run analysis"}
          </Button>
        )}
      </div>
    </section>
  )
}
