"use client"

import { motion } from "motion/react"
import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = "primary",
  delay = 0,
}: {
  label: string
  value: string | number
  icon: LucideIcon
  accent?: "primary" | "success" | "warning" | "destructive"
  delay?: number
}) {
  const accents = {
    primary: "bg-primary/12 text-primary",
    success: "bg-success/12 text-success",
    warning: "bg-warning/12 text-warning",
    destructive: "bg-destructive/12 text-destructive",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Card>
        <CardContent className="flex items-center gap-4 p-4">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-lg",
              accents[accent],
            )}
          >
            <Icon className="size-[18px]" strokeWidth={2.25} />
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {label}
            </p>
            <p className="text-[22px] font-semibold tabular-nums tracking-tight">{value}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
