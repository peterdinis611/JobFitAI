import { describe, expect, it } from "vitest"
import { analysisToMarkdown } from "@/lib/analysis-export"

describe("analysisToMarkdown", () => {
  it("renders a readable report", () => {
    const md = analysisToMarkdown({
      analysis: {
        createdAt: Date.UTC(2026, 6, 26, 10, 0, 0),
        matchPercentage: 85,
        seniorityFit: "match",
        matchingSkills: ["React", "TypeScript"],
        missingSkills: ["GraphQL"],
        redFlags: ["No GraphQL experience"],
        recommendations: ["Add a GraphQL project"],
        skillCategories: [
          {
            name: "Technical",
            score: 80,
            matched: ["React"],
            missing: ["GraphQL"],
          },
        ],
      } as never,
      resume: { fileName: "cv.pdf" } as never,
      jobPosting: { title: "Frontend Engineer" } as never,
    })

    expect(md).toContain("# JobFit AI — Match Report")
    expect(md).toContain("**Role:** Frontend Engineer")
    expect(md).toContain("**Resume:** cv.pdf")
    expect(md).toContain("**Match score:** 85%")
    expect(md).toContain("- React")
    expect(md).toContain("- GraphQL")
    expect(md).toContain("## Red flags")
    expect(md).toContain("## Skill categories")
    expect(md).toContain("1. Add a GraphQL project")
  })

  it("includes company, location, and salary when present", () => {
    const md = analysisToMarkdown({
      analysis: {
        createdAt: Date.now(),
        matchPercentage: 70,
        seniorityFit: "match",
        matchingSkills: [],
        missingSkills: [],
        redFlags: [],
        recommendations: ["Keep going"],
      } as never,
      jobPosting: {
        title: "Platform Engineer",
        company: "Acme Labs",
        location: "Berlin",
        salary: "€90k",
      } as never,
    })
    expect(md).toContain("**Company:** Acme Labs")
    expect(md).toContain("**Location:** Berlin")
    expect(md).toContain("**Salary:** €90k")
  })

  it("falls back when job title is missing", () => {
    const md = analysisToMarkdown({
      analysis: {
        createdAt: Date.now(),
        matchPercentage: 10,
        seniorityFit: "under",
        matchingSkills: [],
        missingSkills: [],
        redFlags: [],
        recommendations: [],
      } as never,
    })
    expect(md).toContain("**Role:** Job match analysis")
    expect(md).toContain("**Resume:** —")
  })
})
