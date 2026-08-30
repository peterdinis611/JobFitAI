import { describe, expect, it } from "vitest"
import { applicationPackMarkdown, tailoredCvToMarkdown } from "@/lib/application-pack"

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
    expect(md).toContain("**Target role:** Senior Frontend")
    expect(md).toContain("Engineer · Acme")
    expect(md).toContain("React · TypeScript")
    expect(md).toContain("verify employers")
  })

  it("omits target role when no job title is given", () => {
    const md = tailoredCvToMarkdown({
      headline: "Frontend Engineer · React",
      summary: "Ships product with clear ownership and measurable outcomes for the team.",
      experience: [{ heading: "Engineer · Acme", bullets: ["Shipped the dashboard"] }],
      skills: [],
    })
    expect(md).not.toContain("**Target role:**")
    expect(md).not.toContain("## Skills")
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

  it("includes location, salary, and tailored bullets", () => {
    const md = applicationPackMarkdown({
      analysis,
      jobPosting: {
        title: "Senior Frontend",
        company: "Acme",
        location: "Berlin · Remote",
        salary: "€90k",
      } as never,
      bullets: [
        {
          original: "Built UIs",
          rewritten: "Shipped the design system used by 8 squads",
        },
      ],
    })
    expect(md).toContain("**Location:** Berlin · Remote")
    expect(md).toContain("**Salary:** €90k")
    expect(md).toContain("Shipped the design system")
    expect(md).toContain("Built UIs")
  })

  it("falls back to Target role when the posting has no title", () => {
    const md = applicationPackMarkdown({ analysis })
    expect(md).toContain("**Role:** Target role")
    expect(md).toContain("Verify every claim")
    expect(md).not.toContain("# Cover letter")
  })
})
