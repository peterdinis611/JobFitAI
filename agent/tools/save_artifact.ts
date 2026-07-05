import { defineTool } from "eve/tools"
import { Effect } from "effect"
import { api } from "../../convex/_generated/api.js"
import {
  saveArtifactInputSchema,
  saveArtifactOutputSchema,
} from "../../lib/schemas/tools"
import { convexMutation } from "#lib/convex"
import { runEffect } from "#lib/effect"
import { ConvexError } from "#lib/errors"
import type { Id } from "../../convex/_generated/dataModel"

export default defineTool({
  description: "Persist a generated artifact (tailored bullets, cover letter, or learning plan) to Convex.",
  inputSchema: saveArtifactInputSchema,
  async execute(input) {
    const program = Effect.tryPromise({
      try: async () => {
        const artifactId = await convexMutation(api.artifacts.save, {
          userId: input.userId as Id<"users">,
          analysisId: input.analysisId as Id<"analyses">,
          type: input.type,
          content: input.content,
        })
        return { artifactId: String(artifactId) }
      },
      catch: (error) =>
        new ConvexError({
          message: error instanceof Error ? error.message : "Failed to save artifact",
        }),
    })

    const result = await runEffect(program)
    return saveArtifactOutputSchema.parse(result)
  },
})
