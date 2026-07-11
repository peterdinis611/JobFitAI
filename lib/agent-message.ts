type AgentContext = Record<string, unknown>

/** Compact JSON for agent prompts — never embed large job bodies in the chat stream. */
export function buildAgentContextJson(context: AgentContext) {
  const {
    userId,
    resumeId,
    jobPostingId,
    jobSource,
    jobUrl,
    analysisId,
    previousAnalysisId,
    matchPercentage,
    matchingSkills,
    missingSkills,
    seniorityFit,
    recommendations,
    resumeFileName,
    jobTitle,
  } = context

  const compact = {
    userId,
    resumeId,
    jobPostingId,
    jobSource,
    jobUrl,
    analysisId,
    previousAnalysisId,
    matchPercentage,
    matchingSkills,
    missingSkills,
    seniorityFit,
    recommendations,
    resumeFileName,
    jobTitle,
  }

  return Object.fromEntries(
    Object.entries(compact).filter(([, value]) => value !== undefined && value !== ""),
  )
}

export function formatAgentSkillMessage({
  skill,
  steps,
  context,
  summary,
}: {
  skill: string
  steps: string
  context: AgentContext
  summary?: string
}) {
  const lines = [`Run the ${skill} skill.`]
  if (summary) lines.push("", summary)
  lines.push(
    "",
    "Context JSON:",
    "```json",
    JSON.stringify(buildAgentContextJson(context), null, 2),
    "```",
    "",
    `Steps: ${steps}`,
  )
  return lines.join("\n")
}
