"use client"

import { motion, useMotionValue, useMotionValueEvent, useSpring, useTransform } from "motion/react"
import { useEffect, useState } from "react"

const TARGET = 87

/** Memorable visual: a precision match dial that calibrates on load. */
export function MatchDial({ className }: { className?: string }) {
  const progress = useMotionValue(0)
  const spring = useSpring(progress, { stiffness: 48, damping: 18, mass: 0.8 })
  const degrees = useTransform(spring, [0, 100], [-120, 120])
  const [label, setLabel] = useState(0)

  useMotionValueEvent(spring, "change", (v) => {
    setLabel(Math.round(v))
  })

  useEffect(() => {
    const t = window.setTimeout(() => progress.set(TARGET), 350)
    return () => window.clearTimeout(t)
  }, [progress])

  return (
    <div className={className}>
      <div className="relative mx-auto aspect-square w-full max-w-[380px]">
        <svg viewBox="0 0 320 320" className="h-full w-full" aria-hidden>
          <defs>
            <linearGradient id="dialArc" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--auth-accent)" />
              <stop offset="100%" stopColor="var(--auth-signal)" />
            </linearGradient>
          </defs>

          {Array.from({ length: 48 }).map((_, i) => {
            const a = (i / 48) * Math.PI * 2 - Math.PI / 2
            const major = i % 6 === 0
            const x1 = 160 + Math.cos(a) * (major ? 138 : 142)
            const y1 = 160 + Math.sin(a) * (major ? 138 : 142)
            const x2 = 160 + Math.cos(a) * 148
            const y2 = 160 + Math.sin(a) * 148
            return (
              <line
                key={`tick-${a.toFixed(4)}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="var(--auth-fg)"
                strokeOpacity={major ? 0.35 : 0.12}
                strokeWidth={major ? 2 : 1}
              />
            )
          })}

          <circle
            cx="160"
            cy="160"
            r="118"
            fill="none"
            stroke="var(--auth-line)"
            strokeWidth="1.5"
          />
          <circle
            cx="160"
            cy="160"
            r="92"
            fill="color-mix(in srgb, var(--auth-fg) 3%, transparent)"
            stroke="var(--auth-line)"
            strokeWidth="1"
          />

          <circle
            cx="160"
            cy="160"
            r="104"
            fill="none"
            stroke="var(--auth-line)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray="260 655"
            transform="rotate(150 160 160)"
          />
          <motion.circle
            cx="160"
            cy="160"
            r="104"
            fill="none"
            stroke="url(#dialArc)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray="260 655"
            transform="rotate(150 160 160)"
            initial={{ strokeDashoffset: 260 }}
            animate={{ strokeDashoffset: 260 - (TARGET / 100) * 260 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
          />

          <motion.g style={{ rotate: degrees, transformOrigin: "160px 160px" }}>
            <line
              x1="160"
              y1="160"
              x2="160"
              y2="58"
              stroke="var(--auth-fg)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="160" cy="160" r="7" fill="var(--auth-accent)" />
            <circle cx="160" cy="160" r="3" fill="var(--auth-bg)" />
          </motion.g>
        </svg>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pt-6">
          <p className="font-[family-name:var(--font-auth-mono)] text-[10px] tracking-[0.28em] text-[var(--auth-muted)] uppercase">
            Fit index
          </p>
          <p className="mt-1 flex items-baseline gap-1 font-[family-name:var(--font-auth-display)] text-6xl font-extrabold tracking-[-0.05em] text-[var(--auth-fg)] tabular-nums sm:text-7xl">
            <span>{label}</span>
            <span className="text-2xl text-[var(--auth-signal)] sm:text-3xl">%</span>
          </p>
          <p className="mt-2 font-[family-name:var(--font-auth-mono)] text-[11px] tracking-[0.18em] text-[var(--auth-muted)] uppercase">
            Calibrated sample
          </p>
        </div>
      </div>
    </div>
  )
}
