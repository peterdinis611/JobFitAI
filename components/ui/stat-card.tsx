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
  accent?: "primary" | "emerald" | "amber" | "rose"
  delay?: number
}) {
  const accents = {
    primary: "from-primary/15 to-primary/5 text-primary",
    emerald: "from-emerald-500/15 to-emerald-500/5 text-emerald-600 dark:text-emerald-400",
    amber: "from-amber-500/15 to-amber-500/5 text-amber-600 dark:text-amber-400",
    rose: "from-rose-500/15 to-rose-500/5 text-rose-600 dark:text-rose-400",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <Card className="overflow-hidden border-border/60 bg-card/80 backdrop-blur-sm">
        <CardContent className="flex items-center gap-4 p-5">
          <div
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br",
              accents[accent],
            )}
          >
            <Icon className="size-5" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {label}
            </p>
            <p className="text-2xl font-bold tabular-nums tracking-tight">{value}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
