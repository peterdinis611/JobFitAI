"use client"

import { motion, useSpring, useTransform } from "motion/react"
import { useEffect } from "react"
import { cn } from "@/lib/utils"

function matchColor(value: number) {
  if (value >= 85) return "bg-success"
  if (value >= 70) return "bg-primary"
  if (value >= 50) return "bg-warning"
  return "bg-destructive"
}

export function AnimatedProgress({
  value,
  className,
  showGlow = false,
}: {
  value: number
  className?: string
  showGlow?: boolean
}) {
  const pct = Math.min(100, Math.max(0, value))
  const spring = useSpring(0, { stiffness: 80, damping: 18 })
  const width = useTransform(spring, (v) => `${v}%`)

  useEffect(() => {
    spring.set(pct)
  }, [pct, spring])

  return (
    <div
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-muted",
        className,
      )}
    >
      <motion.div
        className={cn(
          "h-full rounded-full",
          matchColor(pct),
          showGlow && "shadow-[0_0_12px_var(--glow)]",
        )}
        style={{ width }}
      />
    </div>
  )
}

export function MatchScoreRing({
  value,
  size = 120,
  className,
}: {
  value: number
  size?: number
  className?: string
}) {
  const pct = Math.min(100, Math.max(0, value))
  const radius = (size - 12) / 2
  const circumference = 2 * Math.PI * radius
  const spring = useSpring(0, { stiffness: 60, damping: 16 })
  const offset = useTransform(spring, (v) => circumference - (v / 100) * circumference)

  useEffect(() => {
    spring.set(pct)
  }, [pct, spring])

  const stroke =
    pct >= 85 ? "#10b981" : pct >= 70 ? "#0d9488" : pct >= 50 ? "#d97706" : "#e11d48"

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={8}
          className="text-muted"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: offset }}
        />
      </svg>
      <motion.span
        className="absolute text-2xl font-bold tabular-nums"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.4, type: "spring" }}
      >
        {pct}%
      </motion.span>
    </div>
  )
}
