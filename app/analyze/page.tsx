"use client"

import { useMemo, useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { useEveAgent } from "eve/react"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"
import { useJobFitUser } from "@/hooks/use-jobfit-user"
import { DashboardGettingStarted } from "@/components/dashboard/dashboard-states"
import { AnalyzeSetupPanel } from "@/components/analyze/analyze-setup-panel"
import { AnalyzeProgressPanel } from "@/components/analyze/analyze-progress-panel"
import { PageHeader } from "@/components/ui/page-header"
import { formatAgentSkillMessage } from "@/lib/agent-message"
import type { Doc } from "@/convex/_generated/dataModel"

export default function AnalyzePage() {
  const { userId, ready } = useJobFitUser()
  const resumes = useQuery(api.resumes.listByUser, ready ? {} : "skip")
  const createJob = useMutation(api.jobPostings.create)
  const checkRate = useMutation(api.rateLimits.checkAndIncrement)

  const [tab, setTab] = useState<"text" | "url">("text")
  const [jobText, setJobText] = useState("")
  const [jobUrl, setJobUrl] = useState("")
  const [running, setRunning] = useState(false)

  const agent = useEveAgent()
  const activeResume = useMemo(
    () => resumes?.find((r: Doc<"resumes">) => r.isActive),
    [resumes],
  )
  const isBusy = agent.status === "submitted" || agent.status === "streaming" || running

  async function runAnalysis() {
    if (!userId || !activeResume) {
      toast.error("Upload an active resume first")
      return
    }

    const source = tab
    const raw = source === "url" ? jobUrl.trim() : jobText.trim()

    if (!raw) {
      toast.error(source === "url" ? "Enter a job URL" : "Paste job description")
      return
    }

    if (source === "url" && !raw.startsWith("https://")) {
      toast.error("Only HTTPS URLs are supported")
      return
    }

    setRunning(true)
    try {
      const rate = await checkRate({})
      if (!rate.allowed) {
        toast.error("Daily analysis limit reached (20/day)")
        return
      }

      const jobPostingId = await createJob({
        source,
        rawText: raw,
        cleanedText: source === "text" ? raw : raw,
        url: source === "url" ? raw : undefined,
      })

      const context = {
        userId,
        resumeId: activeResume._id,
        jobPostingId,
        jobSource: source,
        jobUrl: source === "url" ? raw : undefined,
        resumeFileName: activeResume.fileName,
      }

      const summary =
        source === "text"
          ? `Job description: ${raw.length.toLocaleString()} characters (stored in Convex — use load_job_posting).`
          : `Job URL: ${raw}`

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
      <div className="mx-auto max-w-3xl space-y-8">
        <PageHeader
          title="Analyze match"
          description="Compare your active CV against a job posting and get AI-powered insights."
        />
        <DashboardGettingStarted hasResume={false} />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Analyze match"
        description="Compare your active CV against a job posting and get AI-powered insights."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,400px)_1fr] lg:items-start">
        <div className="lg:sticky lg:top-[68px]">
          <AnalyzeSetupPanel
            activeResumeName={activeResume?.fileName}
            hasResume={Boolean(activeResume)}
            tab={tab}
            onTabChange={setTab}
            jobText={jobText}
            onJobTextChange={setJobText}
            jobUrl={jobUrl}
            onJobUrlChange={setJobUrl}
            isBusy={isBusy}
            onRun={() => void runAnalysis()}
          />
        </div>

        <AnalyzeProgressPanel messages={agent.data.messages} isBusy={isBusy} />
      </div>
    </div>
  )
}
