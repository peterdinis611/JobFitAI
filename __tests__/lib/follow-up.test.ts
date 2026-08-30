import { describe, expect, it } from "vitest"
import {
  FOLLOWUP_ALERT_STORAGE_PREFIX,
  followUpAlertStorageKey,
  followUpLabel,
  formatFollowUpDate,
  isFollowUpDueToday,
  isFollowUpOverdue,
  utcDayKey,
} from "@/lib/follow-up"

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
    expect(isFollowUpOverdue(Date.now() + 60_000)).toBe(false)
    expect(isFollowUpDueToday(Date.now())).toBe(true)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(12, 0, 0, 0)
    expect(isFollowUpDueToday(tomorrow.getTime())).toBe(false)
  })

  it("labels later dates with a calendar day", () => {
    const later = new Date()
    later.setDate(later.getDate() + 5)
    later.setHours(12, 0, 0, 0)
    expect(followUpLabel(later.getTime())).toBe(`Due ${formatFollowUpDate(later.getTime())}`)
  })

  it("formats a short date with the user locale", () => {
    const ts = Date.UTC(2026, 7, 22)
    expect(formatFollowUpDate(ts)).toBe(
      new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date(ts)),
    )
  })

  it("builds a stable localStorage key", () => {
    expect(followUpAlertStorageKey("app1", "2026-08-22")).toBe(
      `${FOLLOWUP_ALERT_STORAGE_PREFIX}app1:2026-08-22`,
    )
    expect(utcDayKey(Date.parse("2026-08-22T15:00:00.000Z"))).toBe("2026-08-22")
    expect(utcDayKey()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})
