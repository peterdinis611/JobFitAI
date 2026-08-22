import { describe, expect, it } from "vitest"
import { extractJobMetadata, mergeJobMetadata } from "./extract-job-metadata"

describe("extractJobMetadata", () => {
  it("reads labeled company, location, and salary", () => {
    const meta = extractJobMetadata(
      "Senior Frontend Engineer\nCompany: Acme Labs\nLocation: Berlin\nSalary: €90k – €110k\nRequirements:\n- React",
    )
    expect(meta.title).toBe("Senior Frontend Engineer")
    expect(meta.company).toBe("Acme Labs")
    expect(meta.location).toBe("Berlin")
    expect(meta.salary).toMatch(/90k/)
  })

  it("infers company from title at-line and remote location", () => {
    const meta = extractJobMetadata(
      "Staff Engineer at Notion\nWe are looking for talent. Fully remote.",
    )
    expect(meta.company).toBe("Notion")
    expect(meta.location).toMatch(/Remote/i)
  })

  it("falls back to hostname for unknown career sites", () => {
    const meta = extractJobMetadata("Join our team", "https://careers.stripe.com/jobs/1")
    expect(meta.company).toBe("Stripe")
  })
})

describe("mergeJobMetadata", () => {
  it("prefers incoming non-empty fields", () => {
    expect(
      mergeJobMetadata({ title: "Old", company: "Acme" }, { title: "New", location: "Remote" }),
    ).toEqual({ title: "New", company: "Acme", location: "Remote", salary: undefined })
  })
})
