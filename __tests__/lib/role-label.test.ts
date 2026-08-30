import { describe, expect, it } from "vitest"
import {
  matchBadgeClass,
  matchToneClass,
  roleMeta,
  roleTitle,
  seniorityLabel,
} from "@/lib/role-label"

describe("roleTitle", () => {
  it("prefers explicit job title", () => {
    expect(
      roleTitle({
        title: "  Senior Frontend Engineer  ",
        cleanedText: "Requirements\nReact",
      } as never),
    ).toBe("Senior Frontend Engineer")
  })

  it("falls back to hostname from URL", () => {
    expect(
      roleTitle({
        url: "https://www.acme.com/jobs/123",
        cleanedText: "Requirements only",
      } as never),
    ).toBe("Role at acme.com")
  })

  it("uses a sensible snippet from cleaned text", () => {
    expect(
      roleTitle({
        cleanedText: "Requirements\nFull Stack Developer needed urgently\nSkills",
      } as never),
    ).toBe("Full Stack Developer needed urgently")
  })

  it("uses matching skills when nothing else works", () => {
    expect(roleTitle(null, { matchingSkills: ["React", "TypeScript", "Go"] })).toBe(
      "React · TypeScript role",
    )
  })

  it("returns Untitled role as last resort", () => {
    expect(roleTitle(null)).toBe("Untitled role")
  })
})

describe("roleMeta", () => {
  it("joins company, location, and salary", () => {
    expect(
      roleMeta({
        company: " Acme ",
        location: "Berlin",
        salary: "€90k",
      } as never),
    ).toBe("Acme · Berlin · €90k")
  })

  it("returns undefined when nothing is set", () => {
    expect(roleMeta(null)).toBeUndefined()
    expect(roleMeta({ title: "Engineer" } as never)).toBeUndefined()
  })
})

describe("seniorityLabel", () => {
  it("maps under / match / over", () => {
    expect(seniorityLabel("under").label).toBe("Below target")
    expect(seniorityLabel("match").label).toBe("Right level")
    expect(seniorityLabel("over").label).toBe("Above target")
  })
})

describe("match tone helpers", () => {
  it("picks success for 85+", () => {
    expect(matchToneClass(85)).toBe("text-success")
    expect(matchBadgeClass(90)).toContain("success")
  })

  it("picks primary for 70–84", () => {
    expect(matchToneClass(70)).toBe("text-primary")
    expect(matchBadgeClass(84)).toContain("primary")
  })

  it("picks warning for 50–69", () => {
    expect(matchToneClass(50)).toBe("text-warning")
  })

  it("picks destructive below 50", () => {
    expect(matchToneClass(49)).toBe("text-destructive")
  })
})
