import { defineTool } from "eve/tools"
import { generateObject } from "ai"
import { Effect } from "effect"
import {
  learningPlanInputSchema,
  learningPlanOutputSchema,
} from "../../lib/schemas/tools"
import { runEffect } from "#lib/effect"
import { agentModel } from "#lib/model"

export default defineTool({
  description:
    "Create a 2-week learning plan for each missing skill gap identified in an analysis.",
  inputSchema: learningPlanInputSchema,
  async execute(input) {
    const program = Effect.tryPromise({
      try: async () => {
        const { object } = await generateObject({
          model: agentModel,
          schema: learningPlanOutputSchema,
          prompt: `Create practical 2-week learning plans to close these skill gaps for a ${input.jobTitle ?? "target"} role.

Missing skills: ${input.missingSkills.join(", ")}
Seniority context: ${input.seniorityFit ?? "match"}

For each skill (up to 5), provide:
- durationWeeks: 2 (default) or 1–4 if warranted
- steps: 4–6 concrete daily/weekly actions (courses, projects, docs, practice exercises)

Be specific with resource types (official docs, free tiers, small projects). No vague "learn more" steps.`,
        })
        return object
      },
      catch: () =>
        learningPlanOutputSchema.parse({
          plans: input.missingSkills.slice(0, 3).map((skill) => ({
            skill,
            durationWeeks: 2,
            steps: [
              `Week 1: Read official ${skill} documentation and complete the getting-started tutorial`,
              `Week 1: Build a minimal hello-world project using ${skill}`,
              `Week 2: Extend the project with one real feature from the job posting requirements`,
              `Week 2: Write a short blog post or README explaining what you learned`,
            ],
          })),
        }),
    })

    const result = await runEffect(program)
    return learningPlanOutputSchema.parse(result)
  },
})
