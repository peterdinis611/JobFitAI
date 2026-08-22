"use client"

import { useMutation, useQuery } from "convex/react"
import { Bell, Check, Clock } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import {
  requestFollowUpNotificationPermission,
  useFollowUpAlerts,
} from "@/hooks/use-follow-up-alerts"
import { followUpLabel, isFollowUpDueToday, isFollowUpOverdue } from "@/lib/follow-up"
import { roleTitle } from "@/lib/role-label"
import { cn } from "@/lib/utils"

export function FollowUpBell() {
  const due = useQuery(api.applications.listDueFollowUps, { withinDays: 7 })
  const setFollowUp = useMutation(api.applications.setFollowUp)
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">(() =>
    typeof Notification === "undefined" ? "unsupported" : Notification.permission,
  )

  useFollowUpAlerts(due)

  const items = due ?? []
  const urgentCount = items.filter((row) => {
    const at = row.application.followUpAt
    return at !== undefined && (isFollowUpOverdue(at) || isFollowUpDueToday(at))
  }).length

  async function enableBrowserAlerts() {
    const next = await requestFollowUpNotificationPermission()
    setPermission(next)
    if (next === "granted") toast.success("Browser alerts on for overdue follow-ups")
    else if (next === "denied") toast.error("Notifications blocked in the browser")
    else if (next === "unsupported") toast.error("This browser does not support notifications")
  }

  async function snooze(applicationId: Id<"applications">) {
    const at = Date.now() + 24 * 60 * 60 * 1000
    try {
      await setFollowUp({ applicationId, followUpAt: at })
      toast.success("Snoozed 1 day")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not snooze")
    }
  }

  async function markDone(applicationId: Id<"applications">) {
    try {
      await setFollowUp({ applicationId, followUpAt: null })
      toast.success("Follow-up cleared")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not clear")
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="relative size-8 px-0"
          aria-label={urgentCount > 0 ? `${urgentCount} follow-ups due` : "Follow-up notifications"}
        >
          <Bell className="size-4" />
          {urgentCount > 0 ? (
            <span className="absolute top-0.5 right-0.5 flex size-3.5 items-center justify-center rounded-full bg-destructive text-[8px] font-semibold text-destructive-foreground">
              {urgentCount > 9 ? "9+" : urgentCount}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between gap-2">
          <span>Follow-ups</span>
          <span className="text-[11px] font-normal text-muted-foreground">
            {items.length === 0 ? "Caught up" : `${items.length} this week`}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.length === 0 ? (
          <p className="px-2 py-6 text-center text-[13px] text-muted-foreground">
            No reminders due. Move a card to Applied or Interview to schedule one.
          </p>
        ) : (
          <ul className="max-h-72 space-y-1 overflow-y-auto p-1">
            {items.slice(0, 8).map((row) => {
              const at = row.application.followUpAt
              const title = roleTitle(row.jobPosting, row.analysis ?? undefined)
              const overdue = at !== undefined && isFollowUpOverdue(at)
              return (
                <li
                  key={row.application._id}
                  className="rounded-md border border-border/70 px-2 py-2"
                >
                  <Link
                    href="/tracker"
                    className="block text-[13px] font-medium leading-snug hover:text-primary"
                  >
                    {title}
                  </Link>
                  {at ? (
                    <p
                      className={cn(
                        "mt-0.5 text-[11px] font-medium",
                        overdue ? "text-destructive" : "text-warning",
                      )}
                    >
                      {followUpLabel(at)}
                    </p>
                  ) : null}
                  <div className="mt-1.5 flex gap-1">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] text-muted-foreground hover:bg-accent hover:text-foreground"
                      onClick={() => void snooze(row.application._id)}
                    >
                      <Clock className="size-3" />
                      Snooze 1d
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] text-muted-foreground hover:bg-accent hover:text-foreground"
                      onClick={() => void markDone(row.application._id)}
                    >
                      <Check className="size-3" />
                      Done
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/tracker">Open tracker</Link>
        </DropdownMenuItem>
        {permission !== "granted" && permission !== "unsupported" ? (
          <DropdownMenuItem onClick={() => void enableBrowserAlerts()}>
            Enable browser alerts
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
