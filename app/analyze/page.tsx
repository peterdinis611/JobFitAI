"use client"

import { useMutation, useQuery } from "convex/react"
import { useEveAgent } from "eve/react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import { AnalyzeProgressPanel } from "@/components/analyze/analyze-progress-panel"
import {
  type AnalyzeMode,
  AnalyzeSetupPanel,
  type QueuedJob,
} from "@/components/analyze/analyze-setup-panel"
import { DashboardGettingStarted } from "@/components/dashboard/dashboard-states"
import { PageHeader } from "@/components/ui/page-header"
import { api } from "@/convex/_generated/api"
import type { Doc } from "@/convex/_generated/dataModel"
import { useJobFitUser } from "@/hooks/use-jobfit-user"
import { formatAgentSkillMessage } from "@/lib/agent-message"
import { parseAnalysisStream } from "@/lib/analyze-stream"
import { parseBatchPastes, parseBatchUrls } from "@/lib/batch-jobs"
import { extractJobTitle, normalizeJobUrl } from "@/lib/extract-job-title"

export default function AnalyzePage() {
  const router = useRouter()
  const { userId, ready } = useJobFitUser()
  const resumes = useQuery(api.resumes.listByUser, ready ? {} : "skip")
  const createJob = useMutation(api.jobPostings.create)
  const checkRate = useMutation(api.rateLimits.checkAndIncrement)

  const [tab, setTab] = useState<"text" | "url">("text")
  const [mode, setMode] = useState<AnalyzeMode>("single")
  const [jobText, setJobText] = useState("")
  const [jobUrl, setJobUrl] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [titleTouched, setTitleTouched] = useState(false)
  const [running, setRunning] = useState(false)
  const [urlFetchFailed, setUrlFetchFailed] = useState(false)
  const [queue, setQueue] = useState<QueuedJob[]>([])
  const queueRef = useRef<QueuedJob[]>([])
  queueRef.current = queue
  const queueIndexRef = useRef<number | null>(null)
  const seenAnalysisIds = useRef(new Set<string>())
  const startNextQueuedRef = useRef<(fromIndex: number) => Promise<void>>(async () => {})

  const agent = useEveAgent()
  const activeResume = useMemo(() => resumes?.find((r: Doc<"resumes">) => r.isActive), [resumes])
  const isBusy = agent.status === "submitted" || agent.status === "streaming" || running
  const stream = useMemo(() => parseAnalysisStream(agent.data.messages), [agent.data.messages])
  const notifiedId = useRef<string | null>(null)
  const notifiedSaveError = useRef(false)
  const notifiedFetchError = useRef(false)

  // Keep title in sync with paste heuristics until the user edits it
  useEffect(() => {
    if (titleTouched) return
    if (tab === "text") {
      setJobTitle(extractJobTitle(jobText) ?? "")
    }
  }, [jobText, tab, titleTouched])

  useEffect(() => {
    if (stream.analysisId && stream.analysisId !== notifiedId.current) {
      notifiedId.current = stream.analysisId
      notifiedSaveError.current = false
      seenAnalysisIds.current.add(stream.analysisId)
      toast.success("Saved to History & Tracker", {
        description: "Your match report is ready.",
        action: {
          label: "View report",
          onClick: () => router.push(`/analyses/${stream.analysisId}`),
        },
      })

      const idx = queueIndexRef.current
      if (idx !== null) {
        setQueue((prev) =>
          prev.map((job, i) =>
            i === idx ? { ...job, status: "saved", analysisId: stream.analysisId } : job,
          ),
        )
        void startNextQueuedRef.current(idx + 1)
      }
    }
  }, [stream.analysisId, router])

  useEffect(() => {
    if (
      stream.allDone &&
      stream.hasError &&
      stream.failedStep?.id === "save_analysis" &&
      !notifiedSaveError.current
    ) {
      notifiedSaveError.current = true
      toast.error("Report was not saved to history", {
        description: "Re-run the analysis — the save step failed.",
      })
      const idx = queueIndexRef.current
      if (idx !== null) {
        setQueue((prev) =>
          prev.map((job, i) =>
            i === idx ? { ...job, status: "error", error: "Save failed" } : job,
          ),
        )
        void startNextQueuedRef.current(idx + 1)
      }
    }
  }, [stream.allDone, stream.hasError, stream.failedStep?.id])

  useEffect(() => {
    const fetchFailed =
      stream.failedStep?.id === "fetch_job_posting" ||
      stream.steps.some((s) => s.id === "fetch_job_posting" && s.status === "error")
    if (fetchFailed && !notifiedFetchError.current) {
      notifiedFetchError.current = true
      setUrlFetchFailed(true)
      toast.error("Couldn’t fetch that job URL", {
        description: "Paste the posting text instead — most boards block bots.",
        action: {
          label: "Paste text",
          onClick: () => {
            setTab("text")
            setUrlFetchFailed(false)
          },
        },
      })
      const idx = queueIndexRef.current
      if (idx !== null) {
        setQueue((prev) =>
          prev.map((job, i) =>
            i === idx ? { ...job, status: "error", error: "URL fetch blocked" } : job,
          ),
        )
        void startNextQueuedRef.current(idx + 1)
      }
    }
  }, [stream.failedStep, stream.steps])

  function handleJobTitleChange(value: string) {
    setTitleTouched(true)
    setJobTitle(value)
  }

  function handleTabChange(next: "text" | "url") {
    setTab(next)
    if (next === "url") setUrlFetchFailed(false)
  }

  function switchToPaste() {
    setTab("text")
    setUrlFetchFailed(false)
    toast.message("Paste the full job description, then run again")
  }

  function handleJobPasteDetected(text: string) {
    setTab("text")
    setJobText(text)
    setJobUrl("")
    setUrlFetchFailed(false)
    setTitleTouched(false)
    toast.message("Detected job text — switched to Paste")
  }

  function addCurrentToQueue() {
    const drafts = tab === "url" ? parseBatchUrls(jobUrl) : parseBatchPastes(jobText)
    if (drafts.length === 0) {
      toast.error(tab === "url" ? "Add at least one valid HTTPS URL" : "Paste a job description")
      return
    }
    const titled =
      tab === "text" && drafts.length === 1 && jobTitle.trim()
        ? [{ ...drafts[0], title: jobTitle.trim() }]
        : drafts
    setQueue((prev) => [...prev, ...titled.map((job) => ({ ...job, status: "queued" as const }))])
    setJobText("")
    setJobUrl("")
    setJobTitle("")
    setTitleTouched(false)
    toast.success(titled.length === 1 ? "Added to queue" : `Added ${titled.length} jobs`)
  }

  async function startQueuedJob(job: QueuedJob): Promise<boolean> {
    if (!userId || !activeResume) return false
    notifiedFetchError.current = false
    notifiedSaveError.current = false
    setUrlFetchFailed(false)
    return startAnalysis(job.source, job.raw, job.title)
  }

  async function startNextQueued(fromIndex: number) {
    const current = queueRef.current
    const remaining = current.slice(fromIndex).findIndex((job) => job.status === "queued")
    const nextIndex = remaining === -1 ? -1 : fromIndex + remaining
    if (nextIndex === -1) {
      queueIndexRef.current = null
      setRunning(false)
      if (current.some((job) => job.status === "saved" || job.status === "error")) {
        toast.success("Batch finished")
      }
      return
    }
    const next = current[nextIndex]
    queueIndexRef.current = nextIndex
    setQueue((prev) =>
      prev.map((job, i) => (i === nextIndex ? { ...job, status: "running" } : job)),
    )
    const ok = await startQueuedJob({ ...next, status: "running" })
    if (!ok) {
      setQueue((prev) =>
        prev.map((job, i) =>
          i === nextIndex ? { ...job, status: "error", error: "Could not start" } : job,
        ),
      )
      await startNextQueued(nextIndex + 1)
    }
  }
  startNextQueuedRef.current = startNextQueued

  function runQueue() {
    const first = queueRef.current.findIndex((job) => job.status === "queued")
    if (first === -1) {
      toast.error("Nothing queued")
      return
    }
    setRunning(true)
    void startNextQueued(first)
  }

  async function startAnalysis(source: "text" | "url", rawInput: string, titleOverride?: string) {
    if (!userId || !activeResume) {
      toast.error("Upload an active resume first")
      return false
    }

    let raw = rawInput.trim()

    if (!raw) {
      toast.error(source === "url" ? "Enter a job URL" : "Paste job description")
      return false
    }

    if (source === "url") {
      const normalized = normalizeJobUrl(raw)
      if (!normalized) {
        toast.error("Enter a valid HTTPS job URL")
        return false
      }
      raw = normalized
      setJobUrl(normalized)
    }

    setRunning(true)
    setUrlFetchFailed(false)
    notifiedFetchError.current = false
    try {
      const rate = await checkRate({})
      if (!rate.allowed) {
        toast.error("Daily analysis limit reached (20/day)")
        return false
      }

      const title =
        titleOverride?.trim() ||
        jobTitle.trim() ||
        (source === "text" ? extractJobTitle(raw) : undefined) ||
        undefined

      const jobPostingId = await createJob({
        source,
        rawText: raw,
        cleanedText: source === "text" ? raw : raw,
        url: source === "url" ? raw : undefined,
        title,
      })

      const context = {
        userId,
        resumeId: activeResume._id,
        jobPostingId,
        jobSource: source,
        jobUrl: source === "url" ? raw : undefined,
        jobTitle: title,
        resumeFileName: activeResume.fileName,
      }

      const summary =
        source === "text"
          ? `Job description: ${raw.length.toLocaleString()} characters (stored in Convex — use load_job_posting).${title ? ` Title: ${title}.` : ""}`
          : `Job URL: ${raw}.${title ? ` Expected title: ${title}.` : ""}`

      await agent.send({
        message: formatAgentSkillMessage({
          skill: "analyze-match",
          summary,
          context,
          steps: `parse_resume → ${source === "url" ? "fetch_job_posting → update_job_posting →" : "load_job_posting →"} score_match → save_analysis`,
        }),
      })

      if (queueIndexRef.current === null) toast.success("Analysis started")
      return true
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to start analysis")
      return false
    } finally {
      if (queueIndexRef.current === null) setRunning(false)
    }
  }

  async function runAnalysis() {
    await startAnalysis(tab, tab === "url" ? jobUrl : jobText, jobTitle)
  }

  if (!ready) {
    return <div className="h-60 animate-pulse rounded-xl bg-muted" />
  }

  if (!activeResume && resumes?.length === 0) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <PageHeader
          title="Analyze"
          description="Match your CV to a job posting. Upload a resume to get started."
        />
        <DashboardGettingStarted hasResume={false} />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Analyze"
        description="Paste a job, drop a URL, or batch several postings — each report lands in History."
      />

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <aside className="w-full shrink-0 lg:sticky lg:top-4 lg:w-[340px]">
          <AnalyzeSetupPanel
            activeResumeName={activeResume?.fileName}
            hasResume={Boolean(activeResume)}
            mode={mode}
            onModeChange={setMode}
            tab={tab}
            onTabChange={handleTabChange}
            jobText={jobText}
            onJobTextChange={setJobText}
            jobUrl={jobUrl}
            onJobUrlChange={setJobUrl}
            onJobPasteDetected={handleJobPasteDetected}
            jobTitle={jobTitle}
            onJobTitleChange={handleJobTitleChange}
            titleAutoDetected={!titleTouched && Boolean(jobTitle)}
            urlFetchFailed={urlFetchFailed}
            isBusy={isBusy}
            onRun={() => void runAnalysis()}
            onSwitchToPaste={switchToPaste}
            queue={queue}
            onAddToQueue={addCurrentToQueue}
            onRemoveFromQueue={(id) => setQueue((prev) => prev.filter((job) => job.id !== id))}
            onRunQueue={runQueue}
          />
        </aside>

        <div className="w-full min-w-0 flex-1">
          <AnalyzeProgressPanel messages={agent.data.messages} isBusy={isBusy} />
        </div>
      </div>
    </div>
  )
}
