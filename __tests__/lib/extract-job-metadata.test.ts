import { describe, expect, it } from "vitest"
import { extractJobMetadata, mergeJobMetadata } from "@/lib/extract-job-metadata"

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

  it("reads SK/CZ labels", () => {
    const meta = extractJobMetadata(
      "Senior vývojár\nFirma: Vacuumlabs\nLokácia: Bratislava\nPlat: 4500 EUR\nPožiadavky",
    )
    expect(meta.company).toBe("Vacuumlabs")
    expect(meta.location).toBe("Bratislava")
    expect(meta.salary).toMatch(/4500/)
  })

  it("combines city and hybrid/remote", () => {
    const meta = extractJobMetadata("Backend Engineer\nHybrid role in Prague building APIs.")
    expect(meta.location).toBe("Prague · Hybrid")
  })

  it("picks a compact currency salary when no label exists", () => {
    const meta = extractJobMetadata("Engineer\nCompensation starts at $140k plus equity.")
    expect(meta.salary).toMatch(/140k/i)
  })

  it("infers company from an @ title line", () => {
    expect(extractJobMetadata("Designer @ Figma\nAbout the role").company).toBe("Figma")
  })

  it("rejects soft openers as a company name", () => {
    const meta = extractJobMetadata("We are hiring\nAbout the company\nJoin our platform team")
    expect(meta.company).toBeUndefined()
  })

  it("skips job-board hosts", () => {
    const meta = extractJobMetadata("Join our team", "https://www.linkedin.com/jobs/view/1")
    expect(meta.company).toBeUndefined()
  })

  it("returns empty metadata for blank text", () => {
    expect(extractJobMetadata("\n\n")).toEqual({
      title: undefined,
      company: undefined,
      location: undefined,
      salary: undefined,
    })
  })
})

describe("mergeJobMetadata", () => {
  it("prefers incoming non-empty fields", () => {
    expect(
      mergeJobMetadata({ title: "Old", company: "Acme" }, { title: "New", location: "Remote" }),
    ).toEqual({ title: "New", company: "Acme", location: "Remote", salary: undefined })
  })

  it("keeps existing when incoming fields are empty", () => {
    expect(
      mergeJobMetadata(
        { title: "Kept", company: "Acme", location: "Remote", salary: "€90k" },
        { title: "", company: undefined },
      ),
    ).toEqual({ title: "Kept", company: "Acme", location: "Remote", salary: "€90k" })
  })
})
