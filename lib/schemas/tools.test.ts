import { describe, expect, it } from "vitest"
import { z } from "zod"
import {
  fetchJobPostingInputSchema,
  normalizeOptionalId,
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

describe("normalizeOptionalId", () => {
  it("strips empty and whitespace ids", () => {
    expect(normalizeOptionalId("")).toBeUndefined()
    expect(normalizeOptionalId("   ")).toBeUndefined()
    expect(normalizeOptionalId(null)).toBeUndefined()
    expect(normalizeOptionalId(undefined)).toBeUndefined()
    expect(normalizeOptionalId("a_prev")).toBe("a_prev")
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

  it("accepts empty optional ids (normalized at the tool call site)", () => {
    const parsed = saveAnalysisInputSchema.parse({
      ...base,
      previousAnalysisId: "",
      eveSessionId: "   ",
    })
    expect(normalizeOptionalId(parsed.previousAnalysisId)).toBeUndefined()
    expect(normalizeOptionalId(parsed.eveSessionId)).toBeUndefined()
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

  it("is JSON-Schema convertible for eve tools", () => {
    expect(() => z.toJSONSchema(saveAnalysisInputSchema)).not.toThrow()
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
