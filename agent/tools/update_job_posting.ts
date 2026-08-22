import { Effect } from "effect"
import { defineTool } from "eve/tools"
import { convexMutation } from "#lib/convex"
import { runEffect } from "#lib/effect"
import { ConvexError } from "#lib/errors"
import { api } from "../../convex/_generated/api.js"
import type { Id } from "../../convex/_generated/dataModel"
import { updateJobPostingInputSchema, updateJobPostingOutputSchema } from "../../lib/schemas/tools"

export default defineTool({
  description:
    "Persist fetched job posting text, title, and metadata (company, location, salary) to Convex after fetch_job_posting.",
  inputSchema: updateJobPostingInputSchema,
  async execute(input) {
    const program = Effect.tryPromise({
      try: async () => {
        await convexMutation(api.jobPostings.updateFromFetch, {
          userId: input.userId as Id<"users">,
          jobPostingId: input.jobPostingId as Id<"jobPostings">,
          title: input.title,
          cleanedText: input.cleanedText,
          company: input.company,
          location: input.location,
          salary: input.salary,
        })
        return {
          jobPostingId: input.jobPostingId,
          title: input.title,
          company: input.company,
          location: input.location,
          salary: input.salary,
        }
      },
      catch: (error) =>
        new ConvexError({
          message: error instanceof Error ? error.message : "Failed to update job posting",
        }),
    })

    const result = await runEffect(program)
    return updateJobPostingOutputSchema.parse(result)
  },
})
