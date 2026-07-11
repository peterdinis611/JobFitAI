import { defineTool } from "eve/tools"
import { generateObject } from "ai"
import { Effect } from "effect"
import {
  scoreMatchInputSchema,
  scoreMatchOutputSchema,
} from "../../lib/schemas/tools"
import { runEffect } from "#lib/effect"
import { agentModel } from "#lib/model"

const SKILL_HINTS = [
  "typescript",
  "javascript",
  "react",
  "next.js",
  "node",
  "python",
  "aws",
  "docker",
  "kubernetes",
  "sql",
  "graphql",
  "leadership",
  "communication",
  "agile",
]

function heuristicScore(resumeText: string, jobText: string) {
  const resume = resumeText.toLowerCase()
  const job = jobText.toLowerCase()
  const matching: string[] = []
  const missing: string[] = []

  for (const skill of SKILL_HINTS) {
    const inJob = job.includes(skill)
    const inResume = resume.includes(skill)
    if (inJob && inResume) matching.push(skill)
    else if (inJob && !inResume) missing.push(skill)
  }

  const base = matching.length + missing.length
  const pct = base === 0 ? 55 : Math.round((matching.length / base) * 100)

  return { matching, missing, pct }
}

export default defineTool({
  description:
    "Score resume vs job posting: match %, skills, seniority fit, red flags, and CV recommendations.",
  inputSchema: scoreMatchInputSchema,
  async execute({ resumeText, jobText, jobTitle }) {
    const program = Effect.tryPromise({
      try: async () => {
        const heuristic = heuristicScore(resumeText, jobText)

        try {
          const { object } = await generateObject({
            model: agentModel,
            schema: scoreMatchOutputSchema,
            prompt: `You are an expert technical recruiter. Compare this resume to the job posting.

Job title: ${jobTitle ?? "Unknown"}

RESUME:
${resumeText.slice(0, 12_000)}

JOB POSTING:
${jobText.slice(0, 12_000)}

Heuristic skill hints (verify, don't copy blindly):
- matching: ${heuristic.matching.join(", ") || "none"}
- missing: ${heuristic.missing.join(", ") || "none"}
- rough %: ${heuristic.pct}

Return structured scoring. Be honest about gaps. seniorityFit: under | match | over.`,
          })
          return object
        } catch {
          return scoreMatchOutputSchema.parse({
            matchPercentage: heuristic.pct,
            matchingSkills: heuristic.matching,
            missingSkills: heuristic.missing,
            seniorityFit: "match",
            redFlags: heuristic.missing.length > 5 ? ["Several required skills appear missing"] : [],
            recommendations: [
              "Tailor your summary to mirror the job title and top requirements.",
              "Add measurable outcomes for projects matching the posting.",
            ],
            skillCategories: [
              {
                name: "technical",
                score: heuristic.pct,
                matched: heuristic.matching,
                missing: heuristic.missing,
              },
              {
                name: "soft",
                score: 60,
                matched: [],
                missing: [],
              },
              {
                name: "domain",
                score: 55,
                matched: [],
                missing: [],
              },
            ],
          })
        }
      },
      catch: (error) => error as Error,
    })

    const result = await runEffect(program)
    return scoreMatchOutputSchema.parse(result)
  },
})
