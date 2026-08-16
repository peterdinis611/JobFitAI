import { generateObject } from "ai"
import { Effect } from "effect"
import { defineTool } from "eve/tools"
import { runEffect } from "#lib/effect"
import { agentModel } from "#lib/model"
import { interviewPrepInputSchema, interviewPrepOutputSchema } from "../../lib/schemas/tools"

export default defineTool({
  description:
    "Generate interview prep questions tailored to the resume + job posting and match gaps.",
  inputSchema: interviewPrepInputSchema,
  async execute(input) {
    const program = Effect.tryPromise({
      try: async () => {
        const { object } = await generateObject({
          model: agentModel,
          schema: interviewPrepOutputSchema,
          prompt: `Create interview preparation for this candidate applying to: ${input.jobTitle ?? "the role"}.

Seniority fit: ${input.seniorityFit ?? "unknown"}
Strengths to lean on: ${(input.matchingSkills ?? []).join(", ") || "from resume"}
Gaps to prepare for: ${(input.missingSkills ?? []).join(", ") || "none flagged"}

RESUME:
${input.resumeText.slice(0, 8_000)}

JOB POSTING:
${input.jobText.slice(0, 8_000)}

Return 6–8 realistic interview questions mix of behavioral, technical, role-specific, and culture.
For each: why the interviewer asks it, and a concrete tip grounded in THIS resume (no fabricated experience).
Optional short opener the candidate can use when asked "tell me about yourself".`,
        })
        return object
      },
      catch: () =>
        interviewPrepOutputSchema.parse({
          opener: `I'm a candidate with strengths in ${(input.matchingSkills ?? []).slice(0, 3).join(", ") || "the core skills for this role"}, and I'm excited about ${input.jobTitle ?? "this opportunity"} because it aligns with the problems I've been solving recently.`,
          questions: [
            {
              category: "behavioral" as const,
              question: "Tell me about a project that best shows you can succeed in this role.",
              whyAsked: "Checks relevance and storytelling against the posting.",
              tip: "Pick one resume project that maps to a must-have skill and quantify the outcome.",
            },
            {
              category: "technical" as const,
              question: `Walk me through how you would approach a typical challenge involving ${(input.matchingSkills ?? ["the core stack"])[0]}.`,
              whyAsked: "Validates hands-on depth on a matching skill.",
              tip: "Explain trade-offs and how you measured success — keep it under 2 minutes.",
            },
            {
              category: "role" as const,
              question:
                "Which requirements in our posting are you strongest on, and where would you ramp up?",
              whyAsked: "Tests honesty about gaps while seeing growth plan.",
              tip: `Lead with ${(input.matchingSkills ?? []).slice(0, 2).join(" and ") || "your strongest matches"}, then name one gap like ${(input.missingSkills ?? ["a new tool"])[0]} with a concrete learning step.`,
            },
            {
              category: "culture" as const,
              question: "How do you collaborate when requirements change mid-project?",
              whyAsked: "Probes adaptability and communication style.",
              tip: "Use a STAR story from your resume that shows communication with stakeholders.",
            },
            {
              category: "behavioral" as const,
              question: "Describe a time you had to learn something quickly to unblock delivery.",
              whyAsked: "Assesses learning speed — useful when missing skills are flagged.",
              tip: "Connect the story to closing a gap listed for this role.",
            },
          ],
        }),
    })

    const result = await runEffect(program)
    return interviewPrepOutputSchema.parse(result)
  },
})
