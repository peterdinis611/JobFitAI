import { describe, expect, it } from "vitest"
import { z } from "zod"
import {
  fetchJobPostingInputSchema,
  interviewPrepOutputSchema,
  normalizeOptionalId,
  saveAnalysisInputSchema,
  saveArtifactInputSchema,
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

describe("interviewPrepOutputSchema", () => {
  it("accepts prep questions", () => {
    const result = interviewPrepOutputSchema.safeParse({
      opener: "I am a frontend engineer focused on product delivery.",
      questions: [
        {
          question: "Tell me about a React performance win.",
          category: "technical",
          whyAsked: "Checks depth on a matching skill.",
          tip: "Use the metrics from your resume project.",
        },
        {
          question: "How do you handle shifting requirements?",
          category: "behavioral",
          whyAsked: "Culture fit and collaboration.",
          tip: "STAR story with stakeholders.",
        },
        {
          question: "Which posting requirements are stretch goals?",
          category: "role",
          whyAsked: "Honest gap assessment.",
          tip: "Name one missing skill with a ramp plan.",
        },
        {
          question: "What kind of team culture helps you thrive?",
          category: "culture",
          whyAsked: "Values alignment.",
          tip: "Tie to how you collaborated in past roles.",
        },
        {
          question: "Describe a time you owned an ambiguous problem end to end.",
          category: "behavioral",
          whyAsked: "Ownership signal.",
          tip: "Pick a resume project with clear outcome.",
        },
      ],
    })
    expect(result.success).toBe(true)
  })
})

describe("saveArtifactInputSchema", () => {
  it("allows tailored_cv type", () => {
    expect(
      saveArtifactInputSchema.safeParse({
        userId: "u1",
        analysisId: "a1",
        type: "tailored_cv",
        content: { headline: "x", summary: "y", experience: [], skills: [] },
      }).success,
    ).toBe(true)
  })

  it("allows interview_prep type", () => {
    expect(
      saveArtifactInputSchema.safeParse({
        userId: "u1",
        analysisId: "a1",
        type: "interview_prep",
        content: { questions: [] },
      }).success,
    ).toBe(true)
  })
})
