import type { EveMessage } from "eve/react"

export type PipelineStepStatus = "pending" | "running" | "completed" | "error"

export type PipelineStep = {
  id: string
  label: string
  status: PipelineStepStatus
  error?: string
}

const STEP_LABELS: Record<string, string> = {
  parse_resume: "Read resume",
  load_job_posting: "Load job posting",
  fetch_job_posting: "Fetch job page",
  update_job_posting: "Process job details",
  score_match: "Score match",
  save_analysis: "Save report",
}

const STEP_ORDER = [
  "parse_resume",
  "load_job_posting",
  "fetch_job_posting",
  "update_job_posting",
  "score_match",
  "save_analysis",
]

function mapToolState(state: string): PipelineStepStatus {
  if (state === "input-streaming" || state === "input-available" || state === "approval-requested") {
    return "running"
  }
  if (state === "output-available" || state === "approval-responded") {
    return "completed"
  }
  if (state === "output-error" || state === "output-denied") {
    return "error"
  }
  return "pending"
}

export type AnalysisStreamState = {
  steps: PipelineStep[]
  assistantText: string
  analysisId?: string
  matchPercentage?: number
  hasError: boolean
  allDone: boolean
  isRunning: boolean
  hasStarted: boolean
  failedStep?: PipelineStep
}

export function parseAnalysisStream(messages: readonly EveMessage[]): AnalysisStreamState {
  const stepMap = new Map<string, PipelineStep>()

  let assistantText = ""
  let analysisId: string | undefined
  let matchPercentage: number | undefined

  for (const message of messages) {
    if (message.role !== "assistant") continue

    for (const part of message.parts) {
      if (part.type === "text") {
        assistantText += part.text
      }

      if (part.type === "dynamic-tool" && STEP_LABELS[part.toolName]) {
        const status = mapToolState(part.state)
        stepMap.set(part.toolName, {
          id: part.toolName,
          label: STEP_LABELS[part.toolName],
          status,
          error: part.errorText,
        })

        if (part.toolName === "save_analysis" && status === "completed" && part.output) {
          const out = part.output as { analysisId?: string }
          if (out.analysisId) analysisId = out.analysisId
        }

        if (part.toolName === "score_match" && status === "completed" && part.output) {
          const out = part.output as { matchPercentage?: number }
          if (typeof out.matchPercentage === "number") matchPercentage = out.matchPercentage
        }
      }
    }
  }

  const steps = STEP_ORDER.filter((id) => stepMap.has(id)).map((id) => stepMap.get(id)!)

  const hasError = steps.some((step) => step.status === "error")
  const isRunning = steps.some((step) => step.status === "running")
  const allDone =
    steps.length > 0 &&
    steps.every((step) => step.status === "completed" || step.status === "error")

  return {
    steps,
    assistantText: assistantText.trim(),
    analysisId,
    matchPercentage,
    hasError,
    allDone,
    isRunning,
    hasStarted: messages.length > 0,
    failedStep: steps.find((step) => step.status === "error"),
  }
}
