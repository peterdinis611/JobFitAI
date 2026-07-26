import { describe, expect, it } from "vitest"
import { extractJobTitle, wordCount } from "./extract-job-title"

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

  it("skips soft openers", () => {
    expect(extractJobTitle("We are looking for talent\nRequirements")).toBeUndefined()
  })
})

describe("wordCount", () => {
  it("counts words", () => {
    expect(wordCount("  one two   three ")).toBe(3)
    expect(wordCount("")).toBe(0)
  })
})
