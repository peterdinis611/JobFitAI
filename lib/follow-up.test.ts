import { describe, expect, it } from "vitest"
import {
  followUpAlertStorageKey,
  followUpLabel,
  isFollowUpDueToday,
  isFollowUpOverdue,
  utcDayKey,
} from "./follow-up"

describe("followUpLabel", () => {
  it("labels overdue, today, and tomorrow", () => {
    const now = Date.now()
    expect(followUpLabel(now - 2 * 24 * 60 * 60 * 1000)).toMatch(/Overdue/)
    expect(followUpLabel(now)).toBe("Due today")
    const noon = new Date()
    noon.setHours(12, 0, 0, 0)
    expect(followUpLabel(noon.getTime() + 24 * 60 * 60 * 1000)).toBe("Due tomorrow")
  })
})

describe("follow-up helpers", () => {
  it("detects overdue vs due today", () => {
    expect(isFollowUpOverdue(Date.now() - 1000)).toBe(true)
    expect(isFollowUpDueToday(Date.now())).toBe(true)
  })

  it("builds a stable localStorage key", () => {
    expect(followUpAlertStorageKey("app1", "2026-08-22")).toBe(
      "jobfit:followup-alert:app1:2026-08-22",
    )
    expect(utcDayKey(Date.parse("2026-08-22T15:00:00.000Z"))).toBe("2026-08-22")
  })
})
