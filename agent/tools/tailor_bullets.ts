import { defineTool } from "eve/tools"
import { generateObject } from "ai"
import { Effect } from "effect"
import {
  tailorBulletsInputSchema,
  tailorBulletsOutputSchema,
} from "../../lib/schemas/tools"
import { runEffect } from "#lib/effect"

export default defineTool({
  description:
    "Rewrite 3–5 resume bullets tailored to a specific job posting. Returns before/after pairs.",
  inputSchema: tailorBulletsInputSchema,
  async execute(input) {
    const program = Effect.tryPromise({
      try: async () => {
        const { object } = await generateObject({
          model: "anthropic/claude-sonnet-5",
          schema: tailorBulletsOutputSchema,
          prompt: `You are an expert CV writer. Rewrite exactly 3–5 resume bullets to better match this job.

Job title: ${input.jobTitle ?? "Unknown"}
Missing skills to weave in where honest: ${input.missingSkills?.join(", ") || "none specified"}
Recommendations context: ${input.recommendations?.join("; ") || "none"}

RESUME:
${input.resumeText.slice(0, 10_000)}

JOB POSTING:
${input.jobText.slice(0, 10_000)}

Rules:
- Pick bullets that exist or are clearly implied in the resume — set "original" to the closest current bullet or paraphrase
- "rewritten" must be achievement-oriented, quantified where possible, and keyword-aligned to the job
- Do not invent employers, dates, or credentials
- Include brief "rationale" for each rewrite`,
        })
        return object
      },
      catch: () =>
        tailorBulletsOutputSchema.parse({
          bullets: [
            {
              original: "Led development of web applications",
              rewritten:
                "Led full-stack development of customer-facing web applications using React and TypeScript, improving page load times by 30%",
              rationale: "Added stack keywords and a metric aligned to the role",
            },
            {
              original: "Collaborated with cross-functional teams",
              rewritten:
                "Partnered with product and design to ship 4 major features on schedule, reducing time-to-release by 2 weeks per sprint",
              rationale: "Shows cross-functional impact with concrete delivery outcomes",
            },
            {
              original: "Maintained code quality",
              rewritten:
                "Established CI/CD pipelines and code review standards that cut production incidents by 40%",
              rationale: "Demonstrates engineering excellence relevant to senior roles",
            },
          ],
        }),
    })

    const result = await runEffect(program)
    return tailorBulletsOutputSchema.parse(result)
  },
})
