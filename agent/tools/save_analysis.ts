import { defineTool } from "eve/tools"
import { Effect } from "effect"
import { api } from "../../convex/_generated/api.js"
import {
  saveAnalysisInputSchema,
  saveAnalysisOutputSchema,
} from "../../lib/schemas/tools"
import { convexMutation } from "#lib/convex"
import { runEffect } from "#lib/effect"
import { ConvexError } from "#lib/errors"
import type { Id } from "../../convex/_generated/dataModel"

export default defineTool({
  description: "Persist a completed match analysis to Convex.",
  inputSchema: saveAnalysisInputSchema,
  async execute(input) {
    const parsed = saveAnalysisInputSchema.parse(input)
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
          ...(parsed.skillCategories?.length
            ? { skillCategories: parsed.skillCategories }
            : {}),
          ...(parsed.eveSessionId ? { eveSessionId: parsed.eveSessionId } : {}),
          ...(parsed.previousAnalysisId
            ? { previousAnalysisId: parsed.previousAnalysisId as Id<"analyses"> }
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
