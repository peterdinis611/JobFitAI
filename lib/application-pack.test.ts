import { describe, expect, it } from "vitest"
import { applicationPackMarkdown, tailoredCvToMarkdown } from "./application-pack"

const analysis = {
  matchPercentage: 81,
  matchingSkills: ["React"],
  missingSkills: ["GraphQL"],
  seniorityFit: "match",
  redFlags: [],
  recommendations: ["Add a GraphQL bullet"],
  createdAt: Date.parse("2026-08-01"),
} as never

describe("tailoredCvToMarkdown", () => {
  it("renders headline, summary, and experience", () => {
    const md = tailoredCvToMarkdown(
      {
        headline: "Frontend Engineer · React",
        summary: "Ships product with clear ownership and measurable outcomes for the team.",
        experience: [{ heading: "Engineer · Acme", bullets: ["Shipped the dashboard"] }],
        skills: ["React", "TypeScript"],
      },
      "Senior Frontend",
    )
    expect(md).toContain("Frontend Engineer · React")
    expect(md).toContain("Engineer · Acme")
    expect(md).toContain("React · TypeScript")
  })
})

describe("applicationPackMarkdown", () => {
  it("includes report, CV, and cover letter", () => {
    const md = applicationPackMarkdown({
      analysis,
      jobPosting: { title: "Senior Frontend", company: "Acme" } as never,
      tailoredCv: {
        headline: "Frontend Engineer · React",
        summary: "Ships product with clear ownership and measurable outcomes for the team.",
        experience: [{ heading: "Engineer · Acme", bullets: ["Shipped the dashboard"] }],
        skills: ["React"],
      },
      coverLetter: "Dear Hiring Manager,\nI am writing…",
    })
    expect(md).toContain("Application pack")
    expect(md).toContain("Acme")
    expect(md).toContain("81%")
    expect(md).toContain("Dear Hiring Manager")
  })
})
