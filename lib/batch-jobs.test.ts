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
})

describe("draftLabel", () => {
  it("prefers explicit title", () => {
    expect(draftLabel({ id: "1", source: "text", raw: "x", title: "Staff Engineer" })).toBe(
      "Staff Engineer",
    )
  })
})
