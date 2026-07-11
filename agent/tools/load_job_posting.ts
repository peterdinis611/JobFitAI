import { defineTool } from "eve/tools"
import { Effect } from "effect"
import { api } from "../../convex/_generated/api.js"
import {
  loadJobPostingInputSchema,
  loadJobPostingOutputSchema,
} from "../../lib/schemas/tools"
import { convexQuery } from "#lib/convex"
import { runEffect } from "#lib/effect"
import { ConvexError } from "#lib/errors"
import { wordCount } from "#lib/parse-document"
import type { Id } from "../../convex/_generated/dataModel"

export default defineTool({
  description:
    "Load a saved job posting from Convex (title + cleaned text) for analysis tools.",
  inputSchema: loadJobPostingInputSchema,
  async execute({ userId, jobPostingId }) {
    const program = Effect.gen(function* () {
      const job = yield* Effect.tryPromise({
        try: () =>
          convexQuery(api.jobPostings.getForAgent, {
            userId: userId as Id<"users">,
            jobPostingId: jobPostingId as Id<"jobPostings">,
          }),
        catch: (error) =>
          new ConvexError({
            message: error instanceof Error ? error.message : "Convex query failed",
          }),
      })

      if (!job) {
        return yield* Effect.fail(new ConvexError({ message: "Job posting not found" }))
      }

      return {
        jobPostingId,
        source: job.source,
        title: job.title,
        cleanedText: job.cleanedText,
        url: job.url,
        wordCount: wordCount(job.cleanedText),
      }
    })

    const result = await runEffect(program)
    return loadJobPostingOutputSchema.parse(result)
  },
})
