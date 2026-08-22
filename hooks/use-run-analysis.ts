"use client"

import { useMutation, useQuery } from "convex/react"
import { useEveAgent } from "eve/react"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"
import type { Doc } from "@/convex/_generated/dataModel"
import { useJobFitUser } from "@/hooks/use-jobfit-user"
import { formatAgentSkillMessage } from "@/lib/agent-message"
import { extractJobTitle, normalizeJobUrl } from "@/lib/extract-job-title"

type RunAnalysisInput = {
  source: "text" | "url"
  raw: string
  title?: string
}

export function useRunAnalysis() {
  const { userId, ready } = useJobFitUser()
  const resumes = useQuery(api.resumes.listByUser, ready ? {} : "skip")
  const createJob = useMutation(api.jobPostings.create)
  const checkRate = useMutation(api.rateLimits.checkAndIncrement)
  const agent = useEveAgent()
  const [running, setRunning] = useState(false)

  const activeResume = useMemo(
    () => resumes?.find((r: Doc<"resumes">) => r.isActive),
    [resumes],
  )

  const isBusy = agent.status === "submitted" || agent.status === "streaming" || running

  async function runAnalysis({ source, raw, title }: RunAnalysisInput) {
    if (!userId || !activeResume) {
      toast.error("Upload an active resume first")
      return false
    }

    let normalizedRaw = raw.trim()
    if (!normalizedRaw) {
      toast.error(source === "url" ? "Enter a job URL" : "Paste job description")
      return false
    }

    if (source === "url") {
      const normalized = normalizeJobUrl(normalizedRaw)
      if (!normalized) {
        toast.error("Enter a valid HTTPS job URL")
        return false
      }
      normalizedRaw = normalized
    }

    setRunning(true)
    try {
      const rate = await checkRate({})
      if (!rate.allowed) {
        toast.error("Daily analysis limit reached (20/day)")
        return false
      }

      const resolvedTitle =
        title?.trim() ||
        (source === "text" ? extractJobTitle(normalizedRaw) : undefined) ||
        undefined

      const jobPostingId = await createJob({
        source,
        rawText: normalizedRaw,
        cleanedText: normalizedRaw,
        url: source === "url" ? normalizedRaw : undefined,
        title: resolvedTitle,
      })

      const context = {
        userId,
        resumeId: activeResume._id,
        jobPostingId,
        jobSource: source,
        jobUrl: source === "url" ? normalizedRaw : undefined,
        jobTitle: resolvedTitle,
        resumeFileName: activeResume.fileName,
      }

      const summary =
        source === "text"
          ? `Job description: ${normalizedRaw.length.toLocaleString()} characters (stored in Convex — use load_job_posting).${resolvedTitle ? ` Title: ${resolvedTitle}.` : ""}`
          : `Job URL: ${normalizedRaw}.${resolvedTitle ? ` Expected title: ${resolvedTitle}.` : ""}`

      await agent.send({
        message: formatAgentSkillMessage({
          skill: "analyze-match",
          summary,
          context,
          steps: `parse_resume → ${source === "url" ? "fetch_job_posting → update_job_posting →" : "load_job_posting →"} score_match → save_analysis`,
        }),
      })

      toast.success("Analysis started", {
        description: "Open Analyze to watch progress — the report saves to History when done.",
      })
      return true
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to start analysis")
      return false
    } finally {
      setRunning(false)
    }
  }

  return {
    runAnalysis,
    activeResume,
    hasResume: Boolean(activeResume),
    isBusy,
    ready,
  }
}
