"use client"

import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useEffect, useState } from "react"
import { RobotLogo } from "@/components/brand/robot-logo"

const BOOT_KEY = "jobfit-boot-v1"
const ease = [0.16, 1, 0.3, 1] as const

/**
 * One-shot landing boot overlay (session). Skips on subsequent navigations
 * in the same tab and when the user prefers reduced motion.
 */
export function AuthBootOverlay() {
  const reduceMotion = useReducedMotion()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (reduceMotion) return
    try {
      if (sessionStorage.getItem(BOOT_KEY)) return
      sessionStorage.setItem(BOOT_KEY, "1")
    } catch {
      // private mode / blocked storage — still show once this mount
    }
    setVisible(true)
    const t = window.setTimeout(() => setVisible(false), 1600)
    return () => window.clearTimeout(t)
  }, [reduceMotion])

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[var(--auth-bg)]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease }}
          aria-hidden
        >
          <motion.div
            className="relative flex size-28 items-center justify-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease }}
          >
            <motion.span
              className="absolute inset-0 rounded-full border border-[var(--auth-accent)]"
              initial={{ scale: 0.7, opacity: 0.7 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1.1, ease: "easeOut" }}
            />
            <motion.svg
              viewBox="0 0 112 112"
              className="absolute inset-0 size-full"
              initial={{ rotate: -30 }}
              animate={{ rotate: 330 }}
              transition={{ duration: 1.35, ease }}
            >
              <circle
                cx="56"
                cy="56"
                r="48"
                fill="none"
                stroke="var(--auth-accent)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="70 240"
              />
            </motion.svg>
            <div className="relative z-10 flex size-14 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--auth-accent)_14%,transparent)] ring-1 ring-[var(--auth-accent)]/25">
              <RobotLogo size={32} />
            </div>
          </motion.div>

          <motion.p
            className="mt-6 font-[family-name:var(--font-auth-display)] text-xl font-bold tracking-[-0.04em]"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.35 }}
          >
            JobFit AI
          </motion.p>
          <motion.p
            className="mt-2 font-[family-name:var(--font-auth-mono)] text-[10px] tracking-[0.32em] text-[var(--auth-muted)] uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            Boot sequence
          </motion.p>

          <motion.div
            className="mt-8 h-[2px] w-36 overflow-hidden rounded-full bg-[var(--auth-line)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="h-full bg-[var(--auth-accent)]"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.25, ease }}
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
