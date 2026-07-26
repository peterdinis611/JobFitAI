import { describe, expect, it } from "vitest"
import {
  fetchJobPostingInputSchema,
  saveAnalysisInputSchema,
  scoreMatchOutputSchema,
} from "./tools"

describe("fetchJobPostingInputSchema", () => {
  it("requires HTTPS URLs", () => {
    expect(fetchJobPostingInputSchema.safeParse({ url: "https://example.com/job" }).success).toBe(
      true,
    )
    expect(fetchJobPostingInputSchema.safeParse({ url: "http://example.com/job" }).success).toBe(
      false,
    )
  })
})

describe("saveAnalysisInputSchema", () => {
  const base = {
    userId: "u1",
    resumeId: "r1",
    jobPostingId: "j1",
    matchPercentage: 85,
    matchingSkills: ["React"],
    missingSkills: ["Go"],
    seniorityFit: "match" as const,
    redFlags: [],
    recommendations: ["Highlight React"],
  }

  it("strips empty previousAnalysisId and eveSessionId", () => {
    const parsed = saveAnalysisInputSchema.parse({
      ...base,
      previousAnalysisId: "",
      eveSessionId: "   ",
    })
    expect(parsed.previousAnalysisId).toBeUndefined()
    expect(parsed.eveSessionId).toBeUndefined()
  })

  it("keeps non-empty optional ids", () => {
    const parsed = saveAnalysisInputSchema.parse({
      ...base,
      previousAnalysisId: "a_prev",
      eveSessionId: "sess_1",
    })
    expect(parsed.previousAnalysisId).toBe("a_prev")
    expect(parsed.eveSessionId).toBe("sess_1")
  })

  it("coerces match percentage and recovers bad arrays", () => {
    const parsed = saveAnalysisInputSchema.parse({
      ...base,
      matchPercentage: "72",
      matchingSkills: null,
      seniorityFit: "nope",
    })
    expect(parsed.matchPercentage).toBe(72)
    expect(parsed.matchingSkills).toEqual([])
    expect(parsed.seniorityFit).toBe("match")
  })
})

describe("scoreMatchOutputSchema", () => {
  it("accepts a valid score payload", () => {
    const result = scoreMatchOutputSchema.safeParse({
      matchPercentage: 80,
      matchingSkills: ["TypeScript"],
      missingSkills: ["Kubernetes"],
      seniorityFit: "under",
      redFlags: ["Missing K8s"],
      recommendations: ["Add infra projects"],
      skillCategories: [
        { name: "Technical", score: 75, matched: ["TypeScript"], missing: ["Kubernetes"] },
      ],
    })
    expect(result.success).toBe(true)
  })

  it("rejects out-of-range match percentage", () => {
    expect(
      scoreMatchOutputSchema.safeParse({
        matchPercentage: 101,
        matchingSkills: [],
        missingSkills: [],
        seniorityFit: "match",
        redFlags: [],
        recommendations: [],
        skillCategories: [],
      }).success,
    ).toBe(false)
  })
})
