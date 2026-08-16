"use client"

import { TrendingDown, TrendingUp } from "lucide-react"
import type { HistoryInsights } from "@/lib/history-insights"
import { cn } from "@/lib/utils"

function formatShortDate(ts: number) {
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date(ts))
}

export function HistoryInsightsPanel({ insights }: { insights: HistoryInsights }) {
  if (insights.trend.length < 2 && insights.topMissing.length === 0) return null

  const maxScore = Math.max(...insights.trend.map((t) => t.score), 1)

  return (
    <section className="mac-window overflow-hidden">
      <div className="border-b border-border bg-[var(--mac-titlebar)] px-4 py-3">
        <h2 className="text-[15px] font-semibold tracking-tight">Insights</h2>
        <p className="text-xs text-muted-foreground">
          Match trend and skills that keep showing up as gaps
        </p>
      </div>

      <div className="grid gap-5 p-4 sm:grid-cols-2 sm:p-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[13px] font-semibold">Match trend</p>
            {insights.trendDelta !== null ? (
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-[11px] font-medium tabular-nums",
                  insights.trendDelta > 0 && "text-success",
                  insights.trendDelta < 0 && "text-destructive",
                  insights.trendDelta === 0 && "text-muted-foreground",
                )}
              >
                {insights.trendDelta > 0 ? (
                  <TrendingUp className="size-3.5" />
                ) : insights.trendDelta < 0 ? (
                  <TrendingDown className="size-3.5" />
                ) : null}
                {insights.trendDelta > 0 ? "+" : ""}
                {insights.trendDelta} pts
              </span>
            ) : (
              <span className="text-[11px] text-muted-foreground">Need 2+ reports</span>
            )}
          </div>

          {insights.trend.length === 0 ? (
            <p className="text-sm text-muted-foreground">No analyses yet</p>
          ) : (
            <ul className="space-y-2">
              {insights.trend.map((point) => (
                <li key={`${point.date}-${point.score}`} className="flex items-center gap-3">
                  <span className="w-14 shrink-0 text-[11px] tabular-nums text-muted-foreground">
                    {formatShortDate(point.date)}
                  </span>
                  <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary/80"
                      style={{ width: `${Math.max(8, (point.score / maxScore) * 100)}%` }}
                    />
                  </div>
                  <span className="w-10 shrink-0 text-right text-[12px] font-semibold tabular-nums">
                    {point.score}%
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-3">
          <p className="text-[13px] font-semibold">Top missing skills</p>
          {insights.topMissing.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recurring gaps yet</p>
          ) : (
            <ul className="space-y-2">
              {insights.topMissing.map((item) => (
                <li
                  key={item.skill}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-muted/15 px-3 py-2"
                >
                  <span className="min-w-0 truncate text-[13px] font-medium">{item.skill}</span>
                  <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
                    {item.count}×
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
