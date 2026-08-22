export function formatFollowUpDate(ts: number): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(new Date(ts))
}

export function followUpLabel(ts: number): string {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  const target = new Date(ts)
  target.setHours(0, 0, 0, 0)
  const diffDays = Math.round((target.getTime() - start.getTime()) / (24 * 60 * 60 * 1000))
  if (diffDays < 0) return `Overdue · ${formatFollowUpDate(ts)}`
  if (diffDays === 0) return "Due today"
  if (diffDays === 1) return "Due tomorrow"
  return `Due ${formatFollowUpDate(ts)}`
}

export function isFollowUpOverdue(ts: number): boolean {
  return ts < Date.now()
}

export function isFollowUpDueToday(ts: number): boolean {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(end.getDate() + 1)
  return ts >= start.getTime() && ts < end.getTime()
}

export const FOLLOWUP_ALERT_STORAGE_PREFIX = "jobfit:followup-alert:"

export function followUpAlertStorageKey(applicationId: string, dayKey: string): string {
  return `${FOLLOWUP_ALERT_STORAGE_PREFIX}${applicationId}:${dayKey}`
}

export function utcDayKey(now = Date.now()): string {
  return new Date(now).toISOString().slice(0, 10)
}
