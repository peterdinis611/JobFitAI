import { describe, expect, it } from "vitest"
import { draftLabel, parseBatchPastes, parseBatchUrls } from "./batch-jobs"

describe("parseBatchUrls", () => {
  it("keeps one HTTPS URL per line and drops junk", () => {
    const jobs = parseBatchUrls("https://acme.com/jobs/1\nnot-a-url\ncareers.acme.com/two")
    expect(jobs).toHaveLength(2)
    expect(jobs.every((j) => j.source === "url")).toBe(true)
    expect(jobs[0]?.raw).toBe("https://acme.com/jobs/1")
    expect(jobs[1]?.raw).toBe("https://careers.acme.com/two")
  })

  it("returns empty for blank or invalid input", () => {
    expect(parseBatchUrls("")).toEqual([])
    expect(parseBatchUrls("not a url\nstill-not")).toEqual([])
  })

  it("upgrades http and ignores blank lines", () => {
    const jobs = parseBatchUrls("\nhttp://acme.com/a\n\nhttps://acme.com/b\n")
    expect(jobs.map((j) => j.raw)).toEqual(["https://acme.com/a", "https://acme.com/b"])
  })
})

describe("parseBatchPastes", () => {
  it("splits on --- separators", () => {
    const jobs = parseBatchPastes(
      "Senior Engineer\nRequirements:\n- React\n\n---\n\nProduct Designer\nRequirements:\n- Figma",
    )
    expect(jobs).toHaveLength(2)
    expect(jobs[0]?.title).toBe("Senior Engineer")
    expect(jobs[1]?.title).toBe("Product Designer")
  })

  it("returns a single draft when there is no separator", () => {
    const jobs = parseBatchPastes("Senior Engineer\nRequirements:\n- React\n- TypeScript")
    expect(jobs).toHaveLength(1)
    expect(jobs[0]?.source).toBe("text")
  })

  it("splits on *** separators", () => {
    const jobs = parseBatchPastes(
      "Senior Engineer\nRequirements:\n- React\n\n***\n\nProduct Designer\nRequirements:\n- Figma",
    )
    expect(jobs).toHaveLength(2)
  })

  it("returns empty for blank paste", () => {
    expect(parseBatchPastes("   \n")).toEqual([])
  })

  it("assigns unique ids", () => {
    const jobs = parseBatchPastes(
      "Senior Engineer\nRequirements:\n- React\n\n---\n\nProduct Designer\nRequirements:\n- Figma",
    )
    expect(new Set(jobs.map((j) => j.id)).size).toBe(jobs.length)
  })
})

describe("draftLabel", () => {
  it("prefers explicit title", () => {
    expect(draftLabel({ id: "1", source: "text", raw: "x", title: "Staff Engineer" })).toBe(
      "Staff Engineer",
    )
  })

  it("strips https from URL drafts", () => {
    expect(draftLabel({ id: "1", source: "url", raw: "https://careers.acme.com/jobs/99" })).toBe(
      "careers.acme.com/jobs/99",
    )
  })

  it("falls back to extracted title or a snippet", () => {
    expect(
      draftLabel({
        id: "1",
        source: "text",
        raw: "Staff Platform Engineer\nBuild APIs and platforms",
      }),
    ).toBe("Staff Platform Engineer")
    expect(
      draftLabel({ id: "1", source: "text", raw: "just some notes without a role word" }),
    ).toMatch(/just some notes/)
  })
})
