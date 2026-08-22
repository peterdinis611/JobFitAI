"use client"

import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { useRunAnalysis } from "@/hooks/use-run-analysis"
import { SAMPLE_JOB_POSTING } from "@/lib/sample-job-posting"
import { extractJobTitle, looksLikeJobPaste, normalizeJobUrl } from "@/lib/extract-job-title"
import { cn } from "@/lib/utils"

export function HistoryQuickStart({
  hasResume,
  activeResumeName,
  className,
}: {
  hasResume: boolean
  activeResumeName?: string
  className?: string
}) {
  const router = useRouter()
  const { runAnalysis, isBusy } = useRunAnalysis()
  const [tab, setTab] = useState<"text" | "url">("text")
  const [jobText, setJobText] = useState("")
  const [jobUrl, setJobUrl] = useState("")

  const normalizedUrl = useMemo(() => normalizeJobUrl(jobUrl), [jobUrl])
  const canRun =
    hasResume &&
    !isBusy &&
    (tab === "text" ? jobText.trim().length > 0 : Boolean(normalizedUrl))

  function notifyNoResume() {
    toast.error("No resume found", {
      description: "Upload a PDF or DOCX on the Resumes page before running a match.",
      action: {
        label: "Upload",
        onClick: () => router.push("/resumes"),
      },
    })
  }

  function guardResume(action: () => void) {
    if (!hasResume) {
      notifyNoResume()
      return
    }
    action()
  }

  function handleUrlChange(value: string) {
    if (looksLikeJobPaste(value)) {
      setTab("text")
      setJobText(value)
      setJobUrl("")
      return
    }
    setJobUrl(value)
  }

  function loadSample() {
    setTab("text")
    setJobText(SAMPLE_JOB_POSTING.text)
    setJobUrl("")
  }

  async function handleRun() {
    if (!hasResume) {
      notifyNoResume()
      return
    }
    if (!canRun) return
    let ok = false
    if (tab === "text") {
      const title = extractJobTitle(jobText) ?? SAMPLE_JOB_POSTING.title
      ok = (await runAnalysis({ source: "text", raw: jobText, title })) ?? false
    } else if (normalizedUrl) {
      ok = (await runAnalysis({ source: "url", raw: normalizedUrl })) ?? false
    }
    if (ok) router.push("/analyze")
  }

  return (
    <section className={cn("dash-onboard-quick", className)}>
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-[family-name:var(--font-auth-mono)] text-[10px] tracking-[0.24em] text-primary uppercase">
            Quick start
          </p>
          <h3 className="mt-1 font-[family-name:var(--font-auth-display)] text-lg font-semibold tracking-[-0.03em]">
            {hasResume ? "Run your first match from here" : "Add a job when your resume is ready"}
          </h3>
        </div>
        {hasResume && activeResumeName ? (
          <p className="max-w-[220px] truncate text-right text-[11px] text-muted-foreground">
            Active: <span className="font-medium text-foreground">{activeResumeName}</span>
          </p>
        ) : null}
      </header>

      <div className="mt-4 flex gap-1 rounded-lg bg-muted/40 p-1">
        {(["text", "url"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            disabled={isBusy}
            onClick={() => guardResume(() => setTab(mode))}
            className={cn(
              "flex-1 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors",
              tab === mode
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
              !hasResume && "opacity-70",
            )}
          >
            {mode === "text" ? "Paste text" : "Job URL"}
          </button>
        ))}
      </div>

      {tab === "text" ? (
        <textarea
          value={jobText}
          onChange={(e) => setJobText(e.target.value)}
          onFocus={() => {
            if (!hasResume) notifyNoResume()
          }}
          readOnly={!hasResume || isBusy}
          placeholder={
            hasResume
              ? "Paste the full job description…"
              : "Upload a resume first — then paste any job posting here."
          }
          rows={4}
          className={cn(
            "mac-field mt-3 w-full resize-y px-3 py-2.5 text-[14px] leading-relaxed",
            (!hasResume || isBusy) && "cursor-not-allowed opacity-55",
          )}
        />
      ) : (
        <input
          type="url"
          value={jobUrl}
          onChange={(e) => handleUrlChange(e.target.value)}
          onFocus={() => {
            if (!hasResume) notifyNoResume()
          }}
          readOnly={!hasResume || isBusy}
          placeholder={hasResume ? "https://company.com/careers/…" : "Upload a resume first"}
          className={cn(
            "mac-field mt-3 h-10 w-full px-3 text-[14px]",
            (!hasResume || isBusy) && "cursor-not-allowed opacity-55",
          )}
        />
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={isBusy}
          onClick={() => void handleRun()}
          className={cn(
            "dash-onboard-btn-primary inline-flex min-w-[140px] items-center gap-2",
            isBusy && "pointer-events-none opacity-45",
            !hasResume && "opacity-80",
          )}
        >
          {isBusy ? <Loader2 className="size-4 animate-spin" /> : null}
          {isBusy ? "Starting…" : "Run match"}
        </button>
        <button
          type="button"
          disabled={isBusy}
          onClick={() => guardResume(loadSample)}
          className={cn(
            "dash-onboard-btn-secondary",
            isBusy && "pointer-events-none opacity-45",
            !hasResume && "opacity-80",
          )}
        >
          Use sample job
        </button>
      </div>

      {!hasResume ? (
        <p className="mt-3 font-[family-name:var(--font-auth-mono)] text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
          Resume required · upload on Resumes tab
        </p>
      ) : (
        <p className="mt-3 text-[11px] text-muted-foreground">
          Progress streams on{" "}
          <Link href="/analyze" className="font-medium text-primary hover:underline">
            Analyze
          </Link>
          . Reports land here after save succeeds.
        </p>
      )}
    </section>
  )
}
