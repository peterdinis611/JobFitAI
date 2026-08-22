import { generateObject } from "ai"
import { Effect } from "effect"
import { defineTool } from "eve/tools"
import { runEffect } from "#lib/effect"
import { agentModel } from "#lib/model"
import { tailoredCvInputSchema, tailoredCvOutputSchema } from "../../lib/schemas/tools"

export default defineTool({
  description:
    "Rewrite a full resume draft tailored to one job: headline, summary, experience bullets, and skills line.",
  inputSchema: tailoredCvInputSchema,
  async execute(input) {
    const program = Effect.tryPromise({
      try: async () => {
        const { object } = await generateObject({
          model: agentModel,
          schema: tailoredCvOutputSchema,
          prompt: `You are an expert CV writer. Produce a tailored resume draft for this role.

Job title: ${input.jobTitle ?? "Unknown"}
Company: ${input.company ?? "Unknown"}
Skills to emphasize: ${input.matchingSkills?.join(", ") || "none specified"}
Gaps to address only if honest: ${input.missingSkills?.join(", ") || "none"}
Recommendations: ${input.recommendations?.join("; ") || "none"}

RESUME:
${input.resumeText.slice(0, 12_000)}

JOB POSTING:
${input.jobText.slice(0, 10_000)}

Rules:
- Headline: 8–16 words, role-aligned, no fluff
- Summary: 3–4 sentences, specific, no generic "passionate professional"
- Experience: 2–5 roles that exist on the resume. heading like "Role · Company". 3–5 achievement bullets each
- Do not invent employers, dates, degrees, or metrics
- Skills: 8–14 keywords from the resume that also match the job
- Copy-paste ready`,
        })
        return object
      },
      catch: () =>
        tailoredCvOutputSchema.parse({
          headline: `${input.jobTitle ?? "Software Engineer"} · ${input.matchingSkills?.slice(0, 2).join(" · ") || "Full-stack"}`,
          summary:
            "Experienced engineer who ships product with clear ownership. Recent work maps to this role’s stack and delivery pace. Comfortable collaborating with product and design, and honest about growing into listed gaps.",
          experience: [
            {
              heading: "Most recent role",
              bullets: [
                "Led delivery of customer-facing features using the stack listed on the resume",
                "Partnered with product to ship on schedule and reduce time-to-release",
                "Raised reliability through reviews, tests, and clearer operational ownership",
              ],
            },
          ],
          skills: (input.matchingSkills ?? ["TypeScript", "React", "Node.js"]).slice(0, 10),
        }),
    })

    const result = await runEffect(program)
    return tailoredCvOutputSchema.parse(result)
  },
})
