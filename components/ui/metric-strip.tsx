"use client"

import { motion } from "motion/react"
import { cn } from "@/lib/utils"

export function MetricStrip({
  items,
  className,
}: {
  items: {
    label: string
    value: string
    tone?: "success" | "warning" | "primary" | "destructive"
  }[]
  className?: string
}) {
  return (
    <motion.div
      className={cn(
        "flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-border/70 bg-muted/20 px-4 py-3 text-sm",
        className,
      )}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {items.map((item, i) => (
        <div key={item.label} className="flex items-center gap-x-6">
          {i > 0 ? <span className="hidden h-4 w-px bg-border sm:block" aria-hidden /> : null}
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-muted-foreground">{item.label}</span>
            <span
              className={cn(
                "text-base font-semibold tabular-nums tracking-tight",
                item.tone === "success" && "text-success",
                item.tone === "warning" && "text-warning",
                item.tone === "primary" && "text-primary",
                item.tone === "destructive" && "text-destructive",
              )}
            >
              {item.value}
            </span>
          </div>
        </div>
      ))}
    </motion.div>
  )
}
