import { defineTool } from "eve/tools"
import { generateObject } from "ai"
import { Effect } from "effect"
import {
  coverLetterInputSchema,
  coverLetterOutputSchema,
} from "../../lib/schemas/tools"
import { runEffect } from "#lib/effect"
import { agentModel } from "#lib/model"

export default defineTool({
  description: "Draft a tailored cover letter from resume + job analysis context.",
  inputSchema: coverLetterInputSchema,
  async execute(input) {
    const program = Effect.tryPromise({
      try: async () => {
        const { object } = await generateObject({
          model: agentModel,
          schema: coverLetterOutputSchema,
          prompt: `Write a professional cover letter (250–400 words) for this application.

Role: ${input.jobTitle ?? "the position"}
Match score: ${input.matchPercentage}%
Seniority fit: ${input.seniorityFit}
Strong matches: ${input.matchingSkills.join(", ")}
Gaps to address honestly: ${input.missingSkills.join(", ")}

RESUME:
${input.resumeText.slice(0, 8_000)}

JOB POSTING:
${input.jobText.slice(0, 8_000)}

Structure: opening hook → 2 body paragraphs linking experience to requirements → confident close.
Tone: professional, specific, not generic. Do not fabricate experience.`,
        })
        return object
      },
      catch: () =>
        coverLetterOutputSchema.parse({
          coverLetter: `Dear Hiring Manager,

I am writing to express my strong interest in the ${input.jobTitle ?? "role"}. With experience aligned to your requirements — including ${input.matchingSkills.slice(0, 3).join(", ")} — I am confident I can contribute meaningfully to your team.

In my recent roles I have delivered results that map directly to your posting. I would welcome the opportunity to discuss how my background addresses your needs while continuing to grow in areas such as ${input.missingSkills.slice(0, 2).join(" and ") || "the technologies you use"}.

Thank you for your consideration. I look forward to speaking with you.

Sincerely,
[Your Name]`,
        }),
    })

    const result = await runEffect(program)
    return coverLetterOutputSchema.parse(result)
  },
})
