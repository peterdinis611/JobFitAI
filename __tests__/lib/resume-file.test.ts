import { describe, expect, it } from "vitest"
import { isPdfResume } from "@/lib/resume-file"

describe("isPdfResume", () => {
  it("detects pdf mime types", () => {
    expect(isPdfResume({ mimeType: "application/pdf" })).toBe(true)
    expect(isPdfResume({ mimeType: "application/x-pdf" })).toBe(true)
  })

  it("falls back to .pdf filename", () => {
    expect(isPdfResume({ fileName: "PETER_DINIS.pdf" })).toBe(true)
    expect(isPdfResume({ mimeType: "application/octet-stream", fileName: "cv.PDF" })).toBe(true)
  })

  it("rejects docx", () => {
    expect(
      isPdfResume({
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        fileName: "cv.docx",
      }),
    ).toBe(false)
  })
})
