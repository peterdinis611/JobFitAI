import { Effect } from "effect"
import { defineTool } from "eve/tools"
import { convexMutation } from "#lib/convex"
import { runEffect } from "#lib/effect"
import { ConvexError } from "#lib/errors"
import { api } from "../../convex/_generated/api.js"
import type { Id } from "../../convex/_generated/dataModel"
import {
  normalizeOptionalId,
  saveAnalysisInputSchema,
  saveAnalysisOutputSchema,
} from "../../lib/schemas/tools"

export default defineTool({
  description: "Persist a completed match analysis to Convex.",
  inputSchema: saveAnalysisInputSchema,
  async execute(input) {
    const parsed = saveAnalysisInputSchema.parse(input)
    const eveSessionId = normalizeOptionalId(parsed.eveSessionId)
    const previousAnalysisId = normalizeOptionalId(parsed.previousAnalysisId)
    const program = Effect.tryPromise({
      try: async () => {
        const analysisId = await convexMutation(api.analyses.create, {
          userId: parsed.userId as Id<"users">,
          resumeId: parsed.resumeId as Id<"resumes">,
          jobPostingId: parsed.jobPostingId as Id<"jobPostings">,
          matchPercentage: parsed.matchPercentage,
          matchingSkills: parsed.matchingSkills,
          missingSkills: parsed.missingSkills,
          seniorityFit: parsed.seniorityFit,
          redFlags: parsed.redFlags,
          recommendations: parsed.recommendations,
          ...(parsed.skillCategories?.length ? { skillCategories: parsed.skillCategories } : {}),
          ...(eveSessionId ? { eveSessionId } : {}),
          ...(previousAnalysisId
            ? { previousAnalysisId: previousAnalysisId as Id<"analyses"> }
            : {}),
        })
        return { analysisId: String(analysisId) }
      },
      catch: (error) =>
        new ConvexError({
          message: error instanceof Error ? error.message : "Failed to save analysis",
        }),
    })

    const result = await runEffect(program)
    return saveAnalysisOutputSchema.parse(result)
  },
})
