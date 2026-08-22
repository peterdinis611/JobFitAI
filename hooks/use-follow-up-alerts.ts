"use client"

import { useEffect, useRef } from "react"
import { followUpAlertStorageKey, isFollowUpOverdue, utcDayKey } from "@/lib/follow-up"
import { roleTitle } from "@/lib/role-label"

type DueRow = {
  application: { _id: string; followUpAt?: number }
  analysis: { matchingSkills: string[] } | null
  jobPosting: Parameters<typeof roleTitle>[0]
}

export function useFollowUpAlerts(due: DueRow[] | undefined) {
  const fired = useRef(false)

  useEffect(() => {
    if (fired.current || !due?.length) return
    if (typeof Notification === "undefined" || Notification.permission !== "granted") return

    const day = utcDayKey()
    const overdue = due.filter(
      (row) =>
        row.application.followUpAt !== undefined && isFollowUpOverdue(row.application.followUpAt),
    )
    if (overdue.length === 0) return

    const fresh = overdue.filter((row) => {
      try {
        return localStorage.getItem(followUpAlertStorageKey(row.application._id, day)) !== "1"
      } catch {
        return true
      }
    })
    if (fresh.length === 0) return

    fired.current = true
    const first = fresh[0]
    const title = roleTitle(first.jobPosting, first.analysis ?? undefined)
    const body =
      fresh.length === 1
        ? `Follow up on ${title}`
        : `${fresh.length} follow-ups are overdue — start with ${title}`

    try {
      new Notification("JobFit follow-up", { body, tag: `jobfit-followup-${day}` })
      for (const row of fresh) {
        localStorage.setItem(followUpAlertStorageKey(row.application._id, day), "1")
      }
    } catch {
      /* ignore permission / browser limits */
    }
  }, [due])
}

export async function requestFollowUpNotificationPermission(): Promise<
  NotificationPermission | "unsupported"
> {
  if (typeof Notification === "undefined") return "unsupported"
  if (Notification.permission === "granted") return "granted"
  if (Notification.permission === "denied") return "denied"
  return Notification.requestPermission()
}
