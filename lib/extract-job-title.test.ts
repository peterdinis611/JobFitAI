import { describe, expect, it } from "vitest"
import { extractJobTitle, hostFromUrl, normalizeJobUrl, wordCount } from "./extract-job-title"

describe("extractJobTitle", () => {
  it("returns undefined for empty text", () => {
    expect(extractJobTitle("")).toBeUndefined()
    expect(extractJobTitle("\n\n")).toBeUndefined()
  })

  it("parses labeled titles", () => {
    expect(extractJobTitle("Job title: Staff Platform Engineer\nWe are hiring")).toBe(
      "Staff Platform Engineer",
    )
    expect(extractJobTitle("Role – Product Designer\nAbout us")).toBe("Product Designer")
  })

  it("uses first line when it looks like a title", () => {
    expect(extractJobTitle("Senior Backend Engineer\nRequirements:\n- Go")).toBe(
      "Senior Backend Engineer",
    )
  })

  it("skips soft openers and finds a later title-like line", () => {
    expect(extractJobTitle("We are looking for talent\nFull Stack Developer\nRequirements")).toBe(
      "Full Stack Developer",
    )
  })

  it("supports SK/CZ role words", () => {
    expect(extractJobTitle("Senior vývojář\nPožadavky")).toBe("Senior vývojář")
  })
})

describe("normalizeJobUrl", () => {
  it("upgrades http to https", () => {
    expect(normalizeJobUrl("http://example.com/jobs/1")).toBe("https://example.com/jobs/1")
  })

  it("adds https to bare hosts", () => {
    expect(normalizeJobUrl("careers.acme.com/role")).toBe("https://careers.acme.com/role")
  })

  it("rejects invalid input", () => {
    expect(normalizeJobUrl("not a url")).toBeNull()
    expect(normalizeJobUrl("")).toBeNull()
  })
})

describe("hostFromUrl", () => {
  it("strips www", () => {
    expect(hostFromUrl("https://www.acme.com/x")).toBe("acme.com")
  })
})

describe("wordCount", () => {
  it("counts words", () => {
    expect(wordCount("  one two   three ")).toBe(3)
    expect(wordCount("")).toBe(0)
  })
})
