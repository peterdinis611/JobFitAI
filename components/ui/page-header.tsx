"use client"

import { motion } from "motion/react"
import { cn } from "@/lib/utils"

export function PageHeader({
  title,
  description,
  action,
  className,
}: {
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={cn("flex flex-wrap items-end justify-between gap-4", className)}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="space-y-1">
        <h1 className="mac-large-title">{title}</h1>
        {description ? (
          <p className="max-w-xl text-[15px] text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action}
    </motion.div>
  )
}
