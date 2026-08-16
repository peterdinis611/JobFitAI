"use client"

import { useMutation, useQuery } from "convex/react"
import { useEveAgent } from "eve/react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import { AnalyzeProgressPanel } from "@/components/analyze/analyze-progress-panel"
import { AnalyzeSetupPanel } from "@/components/analyze/analyze-setup-panel"
import { DashboardGettingStarted } from "@/components/dashboard/dashboard-states"
import { PageHeader } from "@/components/ui/page-header"
import { api } from "@/convex/_generated/api"
import type { Doc } from "@/convex/_generated/dataModel"
import { useJobFitUser } from "@/hooks/use-jobfit-user"
import { formatAgentSkillMessage } from "@/lib/agent-message"
import { parseAnalysisStream } from "@/lib/analyze-stream"
import { extractJobTitle, normalizeJobUrl } from "@/lib/extract-job-title"

export default function AnalyzePage() {
  const router = useRouter()
  const { userId, ready } = useJobFitUser()
  const resumes = useQuery(api.resumes.listByUser, ready ? {} : "skip")
  const createJob = useMutation(api.jobPostings.create)
  const checkRate = useMutation(api.rateLimits.checkAndIncrement)

  const [tab, setTab] = useState<"text" | "url">("text")
  const [jobText, setJobText] = useState("")
  const [jobUrl, setJobUrl] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [titleTouched, setTitleTouched] = useState(false)
  const [running, setRunning] = useState(false)
  const [urlFetchFailed, setUrlFetchFailed] = useState(false)

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
      toast.success("Saved to History & Tracker", {
        description: "Your match report is ready.",
        action: {
          label: "View report",
          onClick: () => router.push(`/analyses/${stream.analysisId}`),
        },
      })
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

  async function runAnalysis() {
    if (!userId || !activeResume) {
      toast.error("Upload an active resume first")
      return
    }

    const source = tab
    let raw = source === "url" ? jobUrl.trim() : jobText.trim()

    if (!raw) {
      toast.error(source === "url" ? "Enter a job URL" : "Paste job description")
      return
    }

    if (source === "url") {
      const normalized = normalizeJobUrl(raw)
      if (!normalized) {
        toast.error("Enter a valid HTTPS job URL")
        return
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
        return
      }

      const title =
        jobTitle.trim() || (source === "text" ? extractJobTitle(raw) : undefined) || undefined

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

      toast.success("Analysis started")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to start analysis")
    } finally {
      setRunning(false)
    }
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
        description="Paste a job or drop a URL — JobFit scores fit and saves a report to History."
      />

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <aside className="w-full shrink-0 lg:sticky lg:top-4 lg:w-[340px]">
          <AnalyzeSetupPanel
            activeResumeName={activeResume?.fileName}
            hasResume={Boolean(activeResume)}
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
          />
        </aside>

        <div className="w-full min-w-0 flex-1">
          <AnalyzeProgressPanel messages={agent.data.messages} isBusy={isBusy} />
        </div>
      </div>
    </div>
  )
}
