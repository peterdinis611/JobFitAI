import { describe, expect, it } from "vitest"
import { buildAgentContextJson, formatAgentSkillMessage } from "@/lib/agent-message"

describe("buildAgentContextJson", () => {
  it("keeps known fields and drops empty strings", () => {
    expect(
      buildAgentContextJson({
        userId: "u1",
        resumeId: "r1",
        jobPostingId: "j1",
        previousAnalysisId: "",
        eveSessionId: "   ",
        jobBody: "SHOULD_NOT_APPEAR",
        matchPercentage: 80,
      }),
    ).toEqual({
      userId: "u1",
      resumeId: "r1",
      jobPostingId: "j1",
      matchPercentage: 80,
    })
  })
})

describe("formatAgentSkillMessage", () => {
  it("embeds compact context JSON and skill steps", () => {
    const msg = formatAgentSkillMessage({
      skill: "analyze-match",
      steps: "parse → score → save",
      summary: "Score this role.",
      context: { userId: "u1", resumeId: "r1", jobPostingId: "j1" },
    })

    expect(msg).toContain("Run the analyze-match skill.")
    expect(msg).toContain("Score this role.")
    expect(msg).toContain('"userId": "u1"')
    expect(msg).toContain("Steps: parse → score → save")
    expect(msg).not.toContain("jobBody")
  })
})
