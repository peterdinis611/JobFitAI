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
    const program = Effect.tryPromise({
      try: async () => {
        const analysisId = await convexMutation(api.analyses.create, {
          userId: input.userId as Id<"users">,
          resumeId: input.resumeId as Id<"resumes">,
          jobPostingId: input.jobPostingId as Id<"jobPostings">,
          matchPercentage: input.matchPercentage,
          matchingSkills: input.matchingSkills,
          missingSkills: input.missingSkills,
          seniorityFit: input.seniorityFit,
          redFlags: input.redFlags,
          recommendations: input.recommendations,
          skillCategories: input.skillCategories,
          eveSessionId: input.eveSessionId,
          previousAnalysisId: input.previousAnalysisId as Id<"analyses"> | undefined,
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
