import { Effect } from "effect"
import { defineTool } from "eve/tools"
import { runEffect } from "#lib/effect"
import { fetchAndCleanJobPage } from "#lib/fetch-job"
import { wordCount } from "#lib/parse-document"
import { extractJobMetadata } from "../../lib/extract-job-metadata"
import { fetchJobPostingInputSchema, fetchJobPostingOutputSchema } from "../../lib/schemas/tools"

export default defineTool({
  description:
    "Fetch a job posting URL server-side, strip HTML, sanitize content, and return clean text plus company/location/salary when available.",
  inputSchema: fetchJobPostingInputSchema,
  async execute({ url }) {
    const program = fetchAndCleanJobPage(url).pipe(
      Effect.map(({ title, cleanedText, company, location, salary }) => {
        const extracted = extractJobMetadata(cleanedText, url)
        return {
          url,
          title: title || extracted.title,
          company: company || extracted.company,
          location: location || extracted.location,
          salary: salary || extracted.salary,
          cleanedText,
          wordCount: wordCount(cleanedText),
        }
      }),
    )

    const result = await runEffect(program)
    return fetchJobPostingOutputSchema.parse(result)
  },
})
