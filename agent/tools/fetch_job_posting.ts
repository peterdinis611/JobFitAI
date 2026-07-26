import { Effect } from "effect"
import { defineTool } from "eve/tools"
import { runEffect } from "#lib/effect"
import { fetchAndCleanJobPage } from "#lib/fetch-job"
import { wordCount } from "#lib/parse-document"
import { fetchJobPostingInputSchema, fetchJobPostingOutputSchema } from "../../lib/schemas/tools"

export default defineTool({
  description:
    "Fetch a job posting URL server-side, strip HTML, sanitize content, and return clean text.",
  inputSchema: fetchJobPostingInputSchema,
  async execute({ url }) {
    const program = fetchAndCleanJobPage(url).pipe(
      Effect.map(({ title, cleanedText }) => ({
        url,
        title,
        cleanedText,
        wordCount: wordCount(cleanedText),
      })),
    )

    const result = await runEffect(program)
    return fetchJobPostingOutputSchema.parse(result)
  },
})
