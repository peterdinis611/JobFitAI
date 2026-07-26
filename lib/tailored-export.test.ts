import { describe, expect, it } from "vitest"
import { slugifyRole, tailoredBulletsPlainList, tailoredBulletsToMarkdown } from "./tailored-export"

const bullets = [
  {
    original: "Worked on React apps",
    rewritten: "Shipped React dashboards used by 12k weekly users",
    rationale: "Adds metric",
  },
  {
    original: "Did TypeScript",
    rewritten: "Owned TypeScript migrations across 4 services",
  },
]

describe("tailoredBulletsToMarkdown", () => {
  it("includes role, after/before sections, and rationale", () => {
    const md = tailoredBulletsToMarkdown(bullets, {
      jobTitle: "Frontend Engineer",
      generatedAt: new Date("2026-07-26T12:00:00Z"),
    })
    expect(md).toContain("**Role:** Frontend Engineer")
    expect(md).toContain("Shipped React dashboards")
    expect(md).toContain("Worked on React apps")
    expect(md).toContain("Adds metric")
  })
})

describe("tailoredBulletsPlainList", () => {
  it("returns copy-ready bullet list", () => {
    expect(tailoredBulletsPlainList(bullets)).toBe(
      "• Shipped React dashboards used by 12k weekly users\n• Owned TypeScript migrations across 4 services",
    )
  })
})

describe("slugifyRole", () => {
  it("slugifies titles", () => {
    expect(slugifyRole("Senior Frontend Engineer")).toBe("senior-frontend-engineer")
  })
})
